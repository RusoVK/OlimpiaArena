import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { RubikViewModel } from '../controllers/useRubikController'
import type { RubikCommand, RubikMove } from '../models/rubikModel'
import { defaultRubikColors } from '../models/rubikModel'

type CubieCoord = { x: -1 | 0 | 1; y: -1 | 0 | 1; z: -1 | 0 | 1 }
type CubieMesh = THREE.Mesh

type ActiveLayerRotation = {
  move: RubikMove
  axis: 'x' | 'y' | 'z'
  layer: -1 | 1
  direction: -1 | 1
  progress: number
  pivot: THREE.Group
  cubies: CubieMesh[]
}

const LAYER_GAP = 0.96
const MOVE_STEP = Math.PI / 48
const CUBIE_SIZE = 0.94
const STICKER_SIZE = 0.76
const STICKER_OFFSET = CUBIE_SIZE / 2 + 0.003

function parseMove(move: RubikMove): Pick<ActiveLayerRotation, 'axis' | 'layer' | 'direction'> {
  switch (move) {
    case 'R':
      return { axis: 'x', layer: 1, direction: -1 }
    case "R'":
      return { axis: 'x', layer: 1, direction: 1 }
    case 'L':
      return { axis: 'x', layer: -1, direction: 1 }
    case "L'":
      return { axis: 'x', layer: -1, direction: -1 }
    case 'U':
      return { axis: 'y', layer: 1, direction: -1 }
    case "U'":
      return { axis: 'y', layer: 1, direction: 1 }
    case 'D':
      return { axis: 'y', layer: -1, direction: 1 }
    case "D'":
      return { axis: 'y', layer: -1, direction: -1 }
    case 'F':
      return { axis: 'z', layer: 1, direction: -1 }
    case "F'":
      return { axis: 'z', layer: 1, direction: 1 }
    case 'B':
      return { axis: 'z', layer: -1, direction: 1 }
    case "B'":
      return { axis: 'z', layer: -1, direction: -1 }
  }
}

function roundCoord(value: number): -1 | 0 | 1 {
  const rounded = Math.round(value / LAYER_GAP)
  return (Math.max(-1, Math.min(1, rounded)) as -1 | 0 | 1)
}

function getCoord(cubie: CubieMesh): CubieCoord {
  return cubie.userData.coord as CubieCoord
}

function setCoord(cubie: CubieMesh, coord: CubieCoord): void {
  cubie.userData.coord = coord
}

function getHomeCoord(cubie: CubieMesh): CubieCoord {
  return cubie.userData.homeCoord as CubieCoord
}

function setHomeCoord(cubie: CubieMesh, coord: CubieCoord): void {
  cubie.userData.homeCoord = coord
}

function createStickerBorderGeometry(): THREE.BufferGeometry {
  const half = STICKER_SIZE / 2
  const points = [
    new THREE.Vector3(-half, -half, 0),
    new THREE.Vector3(half, -half, 0),
    new THREE.Vector3(half, half, 0),
    new THREE.Vector3(-half, half, 0),
  ]

  return new THREE.BufferGeometry().setFromPoints(points)
}

export function RubikView({
  state,
  actionBatch,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onWheel,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onMove,
  onShuffle,
  onReset,
  onCubeSolved,
  isMoveDisabled = false,
  showUtilityButtons = true,
}: RubikViewModel & { isMoveDisabled?: boolean; showUtilityButtons?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rootRef = useRef<THREE.Group | null>(null)
  const cubiesRef = useRef<CubieMesh[]>([])
  const stateRef = useRef(state)
  const actionQueueRef = useRef<RubikCommand[]>([])
  const activeRotationRef = useRef<ActiveLayerRotation | null>(null)
  const actionBatchIdRef = useRef(0)
  const frameRef = useRef<number | null>(null)
  const isCubeSolvedRef = useRef(false)
  const scrambleAppliedRef = useRef(false)
  const completedMovesAfterResetRef = useRef(0)

  const moveButtons = useMemo<RubikMove[]>(
    () => ['R', "R'", 'L', "L'", 'U', "U'", 'D', "D'", 'F', "F'", 'B', "B'"],
    []
  )

  useEffect(() => {
    stateRef.current = state
  }, [state])

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x111318)
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(52, canvas.clientWidth / canvas.clientHeight, 0.1, 100)
    camera.position.set(0, 0, stateRef.current.zoom)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    rendererRef.current = renderer

    const root = new THREE.Group()
    root.rotation.set(stateRef.current.rotationX, stateRef.current.rotationY, 0)
    rootRef.current = root
    scene.add(root)

    const ambient = new THREE.AmbientLight(0xffffff, 0.88)
    const hemi = new THREE.HemisphereLight(0xe8edf8, 0x5f6470, 0.35)
    scene.add(ambient, hemi)

    const geometry = new THREE.BoxGeometry(CUBIE_SIZE, CUBIE_SIZE, CUBIE_SIZE)
    const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0xf8f8f8 })
    const stickerGeometry = new THREE.PlaneGeometry(STICKER_SIZE, STICKER_SIZE)
    const stickerBorderGeometry = createStickerBorderGeometry()
    const stickerBorderMaterial = new THREE.LineBasicMaterial({ color: 0x060606 })
    const stickerMaterialMap = new Map<number, THREE.MeshLambertMaterial>()

    const getStickerMaterial = (color: number): THREE.MeshLambertMaterial => {
      const existing = stickerMaterialMap.get(color)
      if (existing) return existing
      const created = new THREE.MeshLambertMaterial({ color })
      stickerMaterialMap.set(color, created)
      return created
    }

    const addSticker = (
      cubie: THREE.Mesh,
      face: 'right' | 'left' | 'up' | 'down' | 'front' | 'back',
      color: number
    ) => {
      const sticker = new THREE.Mesh(stickerGeometry, getStickerMaterial(color))
      const border = new THREE.LineLoop(stickerBorderGeometry, stickerBorderMaterial)

      switch (face) {
        case 'right':
          sticker.position.set(STICKER_OFFSET, 0, 0)
          sticker.rotation.y = Math.PI / 2
          break
        case 'left':
          sticker.position.set(-STICKER_OFFSET, 0, 0)
          sticker.rotation.y = -Math.PI / 2
          break
        case 'up':
          sticker.position.set(0, STICKER_OFFSET, 0)
          sticker.rotation.x = -Math.PI / 2
          break
        case 'down':
          sticker.position.set(0, -STICKER_OFFSET, 0)
          sticker.rotation.x = Math.PI / 2
          break
        case 'front':
          sticker.position.set(0, 0, STICKER_OFFSET)
          break
        case 'back':
          sticker.position.set(0, 0, -STICKER_OFFSET)
          sticker.rotation.y = Math.PI
          break
      }

      border.position.z = 0.001
      sticker.add(border)
      cubie.add(sticker)
    }

    const cubies: CubieMesh[] = []

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          const mesh = new THREE.Mesh(geometry, bodyMaterial)
          mesh.position.set(x * LAYER_GAP, y * LAYER_GAP, z * LAYER_GAP)
          const coord = { x: x as -1 | 0 | 1, y: y as -1 | 0 | 1, z: z as -1 | 0 | 1 }
          setCoord(mesh, coord)
          setHomeCoord(mesh, coord)

          if (x === 1) addSticker(mesh, 'right', defaultRubikColors.right)
          if (x === -1) addSticker(mesh, 'left', defaultRubikColors.left)
          if (y === 1) addSticker(mesh, 'up', defaultRubikColors.up)
          if (y === -1) addSticker(mesh, 'down', defaultRubikColors.down)
          if (z === 1) addSticker(mesh, 'front', defaultRubikColors.front)
          if (z === -1) addSticker(mesh, 'back', defaultRubikColors.back)

          root.add(mesh)
          cubies.push(mesh as CubieMesh)
        }
      }
    }

    cubiesRef.current = cubies

    const resetCube = () => {
      if (!rootRef.current) return

      const active = activeRotationRef.current
      if (active) {
        active.cubies.forEach((cubie) => {
          rootRef.current?.attach(cubie)
        })
        rootRef.current.remove(active.pivot)
      }

      activeRotationRef.current = null
      actionQueueRef.current = []
      rootRef.current.rotation.set(stateRef.current.rotationX, stateRef.current.rotationY, 0)

      cubiesRef.current.forEach((cubie) => {
        const { x, y, z } = getHomeCoord(cubie)
        setCoord(cubie, { x, y, z })
        cubie.rotation.set(0, 0, 0)
        cubie.position.set(x * LAYER_GAP, y * LAYER_GAP, z * LAYER_GAP)
      })

      isCubeSolvedRef.current = false
      scrambleAppliedRef.current = false
      completedMovesAfterResetRef.current = 0
    }

    const checkCubeSolved = (): boolean => {
      return cubiesRef.current.every((cubie) => {
        const current = getCoord(cubie)
        const home = getHomeCoord(cubie)
        return (
          current.x === home.x &&
          current.y === home.y &&
          current.z === home.z &&
          Math.abs(cubie.rotation.x) < 0.01 &&
          Math.abs(cubie.rotation.y) < 0.01 &&
          Math.abs(cubie.rotation.z) < 0.01
        )
      })
    }

    const beginLayerRotation = (move: RubikMove) => {
      if (!rootRef.current) return
      const parsed = parseMove(move)
      const pivot = new THREE.Group()
      rootRef.current.add(pivot)

      const selected = cubiesRef.current.filter((cubie) => {
        const coord = getCoord(cubie)[parsed.axis]
        return coord === parsed.layer
      })

      selected.forEach((cubie) => pivot.attach(cubie))

      activeRotationRef.current = {
        move,
        axis: parsed.axis,
        layer: parsed.layer,
        direction: parsed.direction,
        progress: 0,
        pivot,
        cubies: selected,
      }
    }

    const finishLayerRotation = () => {
      const active = activeRotationRef.current
      if (!active || !rootRef.current) return

      const target = active.direction * (Math.PI / 2)
      active.pivot.rotation[active.axis] = target

      active.cubies.forEach((cubie) => {
        rootRef.current?.attach(cubie)
        cubie.position.set(
          roundCoord(cubie.position.x) * LAYER_GAP,
          roundCoord(cubie.position.y) * LAYER_GAP,
          roundCoord(cubie.position.z) * LAYER_GAP
        )
        setCoord(cubie, {
          x: roundCoord(cubie.position.x),
          y: roundCoord(cubie.position.y),
          z: roundCoord(cubie.position.z),
        })
        cubie.rotation.x = Math.round(cubie.rotation.x / (Math.PI / 2)) * (Math.PI / 2)
        cubie.rotation.y = Math.round(cubie.rotation.y / (Math.PI / 2)) * (Math.PI / 2)
        cubie.rotation.z = Math.round(cubie.rotation.z / (Math.PI / 2)) * (Math.PI / 2)
      })

      rootRef.current.remove(active.pivot)
      activeRotationRef.current = null
      completedMovesAfterResetRef.current++
    }

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate)

      if (rootRef.current) {
        rootRef.current.rotation.x = stateRef.current.rotationX
        rootRef.current.rotation.y = stateRef.current.rotationY
      }

      if (cameraRef.current) {
        cameraRef.current.position.z = stateRef.current.zoom
      }

      const active = activeRotationRef.current
      if (active) {
        const remaining = (Math.PI / 2) - active.progress
        const delta = Math.min(MOVE_STEP, remaining)
        active.progress += delta
        active.pivot.rotation[active.axis] += delta * active.direction

        if (Math.abs((Math.PI / 2) - active.progress) < 0.0001) {
          finishLayerRotation()
        }
      } else if (actionQueueRef.current.length > 0) {
        const next = actionQueueRef.current.shift()
        if (next === 'RESET') {
          resetCube()
        } else if (next) {
          beginLayerRotation(next)
        }
      } else if (!scrambleAppliedRef.current && completedMovesAfterResetRef.current > 0) {
        // Cola vacía y hemos ejecutado al menos un move después del reset
        scrambleAppliedRef.current = true
      }

      // Check if cube is solved ONLY after scramble has been applied
      if (
        scrambleAppliedRef.current &&
        !isCubeSolvedRef.current &&
        !activeRotationRef.current &&
        actionQueueRef.current.length === 0
      ) {
        if (checkCubeSolved()) {
          isCubeSolvedRef.current = true
          if (onCubeSolved) {
            onCubeSolved()
          }
        }
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current)
      }
    }

    animate()

    const onResize = () => {
      if (!canvasRef.current || !cameraRef.current || !rendererRef.current) return
      const width = canvasRef.current.clientWidth
      const height = canvasRef.current.clientHeight
      cameraRef.current.aspect = width / height
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(width, height)
    }

    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current)
      }
      renderer.dispose()
      geometry.dispose()
      bodyMaterial.dispose()
      stickerGeometry.dispose()
      stickerBorderGeometry.dispose()
      stickerBorderMaterial.dispose()
      stickerMaterialMap.forEach((material) => material.dispose())
    }
  }, [])

  useEffect(() => {
    if (actionBatch.id <= actionBatchIdRef.current) return
    actionBatchIdRef.current = actionBatch.id
    actionQueueRef.current.push(...actionBatch.moves)
  }, [actionBatch])

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <canvas
        ref={canvasRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onWheel={onWheel}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          flex: 1,
          minHeight: 0,
          cursor: 'grab',
          display: 'block',
          touchAction: 'none',
        }}
      />
      {showUtilityButtons && (
      <div
        style={{
          padding: '12px 14px',
          backgroundColor: '#1c2028',
          color: '#eff3ff',
          borderTop: '1px solid #2f3746',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isMoveDisabled ? 0.5 : 1,
          transition: 'opacity 0.3s ease',
        }}
      >
        {moveButtons.map((move) => (
          <button
            key={move}
            onClick={() => !isMoveDisabled && onMove(move)}
            disabled={isMoveDisabled}
            style={{
              padding: '7px 10px',
              borderRadius: '6px',
              border: '1px solid #4d5a73',
              background: '#273247',
              color: '#ecf2ff',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              cursor: isMoveDisabled ? 'not-allowed' : 'pointer',
              opacity: isMoveDisabled ? 0.5 : 1,
            }}
          >
            {move}
          </button>
        ))}
        <button
          onClick={onShuffle}
          disabled={isMoveDisabled}
          style={{
            padding: '7px 12px',
            borderRadius: '6px',
            border: '1px solid #4d5a73',
            background: '#304f31',
            color: '#f0ffef',
            cursor: isMoveDisabled ? 'not-allowed' : 'pointer',
            opacity: isMoveDisabled ? 0.5 : 1,
          }}
        >
          Shuffle
        </button>
        <button
          onClick={onReset}
          style={{
            padding: '7px 12px',
            borderRadius: '6px',
            border: '1px solid #4d5a73',
            background: '#4a2b2b',
            color: '#ffecec',
            cursor: 'pointer',
          }}
        >
          Reset
        </button>
        <span style={{ fontSize: '12px', opacity: 0.85 }}>Arrastra para orbitar, scroll para zoom, botones para girar capas</span>
      </div>
      )}
    </div>
  )
}

export default RubikView
