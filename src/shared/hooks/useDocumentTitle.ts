import { useEffect } from 'react'
import { book } from '@/config/book.ts'

export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title
    return () => {
      document.title = book.title
    }
  }, [title])
}
