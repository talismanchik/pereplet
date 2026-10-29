import { Link } from 'react-router'
import { useLibrary } from '@/app/useLibrary.ts'
import styles from './ContentsList.module.css'

type Props = {
  currentSlug?: string
  readSlugs: string[]
  onNavigate?: () => void
}

export function ContentsList({ currentSlug, readSlugs, onNavigate }: Props) {
  const { chapters } = useLibrary()

  if (chapters.length === 0) {
    return <p className={styles.empty}>Написанных глав пока нет.</p>
  }

  return (
    <ol className={styles.list}>
      {chapters.map((chapter) => {
        const current = chapter.slug === currentSlug
        const read = readSlugs.includes(chapter.slug)
        return (
          <li key={chapter.slug}>
            <Link
              to={`/read/${chapter.slug}`}
              className={styles.link}
              aria-current={current ? 'page' : undefined}
              onClick={onNavigate}
            >
              <span className={styles.number}>{chapter.frontmatter.number}</span>
              <span className={styles.titles}>
                <span className={styles.title}>{chapter.frontmatter.title}</span>
                {chapter.frontmatter.subtitle ? (
                  <span className={styles.subtitle}>{chapter.frontmatter.subtitle}</span>
                ) : null}
              </span>
              {read ? <span className={styles.read}>Прочитано</span> : null}
            </Link>
          </li>
        )
      })}
    </ol>
  )
}
