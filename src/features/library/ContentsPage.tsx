import { useEffect } from 'react'
import { Link } from 'react-router'
import { useReading } from '@/app/useReading.ts'
import { book } from '@/config/book.ts'
import { ContentsList } from '@/features/library/ContentsList.tsx'
import { useDocumentTitle } from '@/shared/hooks/useDocumentTitle.ts'
import { buttonClassName } from '@/shared/ui/index.ts'
import styles from './ContentsPage.module.css'

export function ContentsPage() {
  const { position } = useReading()
  useDocumentTitle(`Оглавление — ${book.title}`)
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link to="/" className={buttonClassName('ghost')}>
          На обложку
        </Link>
        <h1 className={styles.title}>Оглавление</h1>
      </header>
      <nav aria-label="Оглавление">
        <ContentsList readSlugs={position.read} />
      </nav>
    </div>
  )
}
