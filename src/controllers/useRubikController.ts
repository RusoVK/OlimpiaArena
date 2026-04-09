import { useEffect, useRef, useState } from 'react'
import type { RubikActionBatch, RubikMove, RubikState } from '../models/rubikModel'
import { initialRubikState } from '../models/rubikModel'

export type RubikViewModel = {
  state: RubikState
  actionBatch: RubikActionBatch
  onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void
  onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void
  onMouseUp: () => void
  onWheel: (e: React.WheelEvent<HTMLCanvasElement>) => void
  onTouchStart: (e: React.TouchEvent<HTMLCanvasElement>) => void
  onTouchMove: (e: React.TouchEvent<HTMLCanvasElement>) => void
  onTouchEnd: () => void
  onMove: (move: RubikMove) => void
  onBatch: (moves: RubikMove[]) => void
  onShuffle: () => void
  onReset: () => void
  onCubeSolved?: () => void
}

const MOVES: RubikMove[] = ['R', "R'", 'L', "L'", 'U', "U'", 'D', "D'", 'F', "F'", 'B', "B'"]

function randomMoves(length: number): RubikMove[] {
  return Array.from({ length }, () => MOVES[Math.floor(Math.random() * MOVES.length)])
}

export function useRubikController(): RubikViewModel {
  const [state, setState] = useState<RubikState>(initialRubikState)
  const [actionBatch, setActionBatch] = useState<RubikActionBatch>({ id: 0, moves: [] })
  const mouseDownRef = useRef(false)
  const mouseStartRef = useRef({ x: 0, y: 0 })
  const rotationStartRef = useRef({ x: 0, y: 0 })

  const dispatchMoves = (moves: RubikActionBatch['moves']) => {
    setActionBatch((previous) => ({
      id: previous.id + 1,
      moves,
    }))
  }

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    mouseDownRef.current = true
    mouseStartRef.current = { x: e.clientX, y: e.clientY }
    rotationStartRef.current = { x: state.rotationX, y: state.rotationY }
  }

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!mouseDownRef.current) return

    const deltaX = e.clientX - mouseStartRef.current.x
    const deltaY = e.clientY - mouseStartRef.current.y

    setState((prev) => ({
      ...prev,
      rotationY: rotationStartRef.current.y + deltaX * 0.008,
      rotationX: rotationStartRef.current.x + deltaY * 0.008,
    }))
  }

  const onMouseUp = () => {
    mouseDownRef.current = false
  }

  const onTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      mouseDownRef.current = true
      mouseStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      rotationStartRef.current = { x: state.rotationX, y: state.rotationY }
    } else if (e.touches.length === 2) {
      // Para zoom con dos dedos en el futuro
      mouseDownRef.current = false
    }
  }

  const onTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!mouseDownRef.current || e.touches.length !== 1) return
    e.preventDefault()

    const deltaX = e.touches[0].clientX - mouseStartRef.current.x
    const deltaY = e.touches[0].clientY - mouseStartRef.current.y

    setState((prev) => ({
      ...prev,
      rotationY: rotationStartRef.current.y + deltaX * 0.008,
      rotationX: rotationStartRef.current.x + deltaY * 0.008,
    }))
  }

  const onTouchEnd = () => {
    mouseDownRef.current = false
  }

  const onWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    setState((prev) => ({
      ...prev,
      zoom: Math.max(3.2, Math.min(9, prev.zoom + (e.deltaY > 0 ? 0.3 : -0.3))),
    }))
  }

  const onMove = (move: RubikMove) => {
    dispatchMoves([move])
  }

  const onBatch = (moves: RubikMove[]) => {
    dispatchMoves(moves)
  }

  const onShuffle = () => {
    dispatchMoves(randomMoves(20))
  }

  const onReset = () => {
    setState(initialRubikState)
    dispatchMoves(['RESET'])
  }

  useEffect(() => {
    const handleMouseUp = () => {
      mouseDownRef.current = false
    }
    window.addEventListener('mouseup', handleMouseUp)
    return () => window.removeEventListener('mouseup', handleMouseUp)
  }, [])

  return {
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
    onBatch,
    onShuffle,
    onReset,
  }
}
