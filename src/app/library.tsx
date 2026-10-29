import { useMemo, type ReactNode } from 'react'
import { LibraryContext } from '@/app/useLibrary.ts'
import { loadLibrary } from '@/content/loadChapters.ts'

export function LibraryProvider({ children }: { children: ReactNode }) {
  const library = useMemo(() => loadLibrary(), [])
  return <LibraryContext.Provider value={library}>{children}</LibraryContext.Provider>
}
