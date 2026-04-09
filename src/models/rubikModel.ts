export type RubikMove =
  | 'R'
  | "R'"
  | 'L'
  | "L'"
  | 'U'
  | "U'"
  | 'D'
  | "D'"
  | 'F'
  | "F'"
  | 'B'
  | "B'"

export type RubikCommand = RubikMove | 'RESET'

export type RubikState = {
  rotationX: number
  rotationY: number
  zoom: number
}

export const initialRubikState: RubikState = {
  rotationX: 0.55,
  rotationY: 0.6,
  zoom: 15.2,
}

export type RubikActionBatch = {
  id: number
  moves: RubikCommand[]
}

export type RubikColors = {
  right: number
  left: number
  up: number
  down: number
  front: number
  back: number
}

export const defaultRubikColors: RubikColors = {
  right: 0xC41E3A,
  left: 0xFF5800,
  up: 0xFFFFFF,
  down: 0x0051BA,
  front: 0x009E60,
  back: 0xFFD500,
}
