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
  onMove: (move: RubikMove) => void
  onShuffle: () => void
  onReset: () => void
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
    onMove,
    onShuffle,
    onReset,
  }
}
