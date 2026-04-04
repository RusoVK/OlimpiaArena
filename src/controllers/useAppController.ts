import { useMemo, useState } from 'react'
import { getAppContent } from '../models/appModel'

export type AppViewModel = {
  count: number
  onIncrement: () => void
  content: ReturnType<typeof getAppContent>
}

export function useAppController(): AppViewModel {
  const [count, setCount] = useState(0)
  const content = useMemo(() => getAppContent(), [])

  const onIncrement = () => {
    setCount((currentCount) => currentCount + 1)
  }

  return {
    count,
    onIncrement,
    content,
  }
}