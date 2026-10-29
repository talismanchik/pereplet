import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { useLibrary } from '@/app/useLibrary.ts'
import { useReading } from '@/app/useReading.ts'
import { book } from '@/config/book.ts'
import { SettingsSheet } from '@/features/settings/SettingsSheet.tsx'
import { useDocumentTitle } from '@/shared/hooks/useDocumentTitle.ts'
import { chapterCountLabel } from '@/shared/lib/russian.ts'
import { continueTarget } from '@/shared/lib/position.ts'
import { IconButton, IconSettings, Ornament, Text, buttonClassName } from '@/shared/ui/index.ts'
import styles from './CoverPage.module.css'

export function CoverPage() {
  const { chapters } = useLibrary()
  const { position } = useReading()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const first = chapters[0]
  const resume = continueTarget(
    position,
    chapters.map((chapter) => ({ slug: chapter.slug, number: chapter.frontmatter.number })),
  )
  const href = resume ? `/read/${resume.slug}` : first ? `/read/${first.slug}` : '/contents'
  const label = resume ? `Продолжить с главы ${resume.number}` : 'Читать'

  useDocumentTitle(book.title)
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className={styles.cover}>
      <div className={styles.spine} aria-hidden="true" />
      <IconButton
        className={styles.settings}
        label="Настройки чтения"
        onClick={() => setSettingsOpen(true)}
      >
        <IconSettings />
      </IconButton>
      <div className={styles.main}>
        <Text variant="kicker" tone="muted">
          Совместная книга
        </Text>
        <h1 className={styles.title}>{book.title}</h1>
        <Ornament className={styles.ornament} />
        <p className={styles.subtitle}>{book.subtitle}</p>
        <p className={styles.authors}>{book.authors}</p>
      </div>
      <div className={styles.actions}>
        <p className={styles.count}>
          {chapters.length === 0
            ? 'Глав пока нет'
            : `В книге ${chapterCountLabel(chapters.length)}`}
        </p>
        {first ? (
          <Link to={href} className={buttonClassName('primary', 'lg', styles.read)}>
            {label}
          </Link>
        ) : null}
        <Link to="/contents" className={buttonClassName('ghost', 'md', styles.contents)}>
          Оглавление
        </Link>
      </div>
      <SettingsSheet open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}
