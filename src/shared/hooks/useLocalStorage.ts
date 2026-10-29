import { useCallback, useState } from 'react'
import { readStorage, writeStorage } from '@/shared/lib/storage.ts'

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => readStorage(key, initial))

  const set = useCallback(
    (next: T | ((current: T) => T)) => {
      setValue((current) => {
        const resolved = typeof next === 'function' ? (next as (current: T) => T)(current) : next
        writeStorage(key, resolved)
        return resolved
      })
    },
    [key],
  )

  return [value, set] as const
}
