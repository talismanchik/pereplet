import { useCallback, useMemo } from 'react'
import { useLocalStorage } from '@/shared/hooks/useLocalStorage.ts'
import {
  defaultPosition,
  nextPosition,
  sanitizePosition,
  withRead,
  type ReadingPosition,
} from '@/shared/lib/position.ts'
import { storageKeys } from '@/shared/lib/storage.ts'

export function useReadingPosition() {
  const [stored, setStored] = useLocalStorage<unknown>(storageKeys.position, defaultPosition)
  const position = useMemo(() => sanitizePosition(stored), [stored])

  const commit = useCallback(
    (next: (current: ReadingPosition) => ReadingPosition) => {
      setStored((previous: unknown) => {
        const current = sanitizePosition(previous)
        const resolved = next(current)
        if (
          resolved.slug === current.slug &&
          resolved.ratio === current.ratio &&
          resolved.read === current.read
        ) {
          return previous
        }
        return resolved
      })
    },
    [setStored],
  )

  const saveProgress = useCallback(
    (slug: string, ratio: number) => {
      commit((current) => nextPosition(current, slug, ratio))
    },
    [commit],
  )

  const markRead = useCallback(
    (slug: string) => {
      commit((current) => withRead(current, slug))
    },
    [commit],
  )

  return { position, saveProgress, markRead }
}

export type ReadingApi = ReturnType<typeof useReadingPosition>
