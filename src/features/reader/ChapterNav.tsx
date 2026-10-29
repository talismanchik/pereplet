import { memo } from 'react'
import { Link } from 'react-router'
import { buttonClassName } from '@/shared/ui/index.ts'
import type { Chapter } from '@/types/chapter.ts'
import styles from './ChapterNav.module.css'

type Props = {
  previous?: Chapter
  next?: Chapter
  showNext: boolean
  onNext: () => void
}

export const ChapterNav = memo(function ChapterNav({ previous, next, showNext, onNext }: Props) {
  if (!previous && !showNext) return null
  const nextLabel = next ? 'Следующая' : 'На обложку'
  const nextTitle = next ? next.frontmatter.title : 'Обложка'

  return (
    <nav
      className={styles.nav}
      aria-label="Навигация по главам"
      aria-keyshortcuts="ArrowLeft ArrowRight"
    >
      {previous ? (
        <Link
          to={`/read/${previous.slug}`}
          className={buttonClassName('secondary', 'md', styles.link)}
          aria-label={`Предыдущая глава: ${previous.frontmatter.title}`}
        >
          Предыдущая
        </Link>
      ) : (
        <span />
      )}
      {showNext ? (
        <button
          type="button"
          className={buttonClassName('secondary', 'md', styles.link)}
          aria-label={`${nextLabel}: ${nextTitle}`}
          onClick={onNext}
        >
          {nextLabel}
        </button>
      ) : null}
    </nav>
  )
})
