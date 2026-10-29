import { createContext, useContext } from 'react'
import type { Library } from '@/content/loadChapters.ts'

export const LibraryContext = createContext<Library | null>(null)

export function useLibrary(): Library {
  const library = useContext(LibraryContext)
  if (!library) throw new Error('Книга ещё не загружена')
  return library
}
