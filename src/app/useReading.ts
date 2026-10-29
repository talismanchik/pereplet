import { createContext, useContext } from 'react'
import type { ReadingApi } from '@/shared/hooks/useReadingPosition.ts'

export const ReadingContext = createContext<ReadingApi | null>(null)

export function useReading(): ReadingApi {
  const reading = useContext(ReadingContext)
  if (!reading) throw new Error('Прогресс чтения ещё не готов')
  return reading
}
