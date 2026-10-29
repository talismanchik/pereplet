import type { ReactNode } from 'react'
import { ReadingContext } from '@/app/useReading.ts'
import { useReadingPosition } from '@/shared/hooks/useReadingPosition.ts'

export function ReadingProvider({ children }: { children: ReactNode }) {
  const reading = useReadingPosition()
  return <ReadingContext.Provider value={reading}>{children}</ReadingContext.Provider>
}
