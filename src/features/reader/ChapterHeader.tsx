import { memo } from 'react'
import { applyTypography } from '@/shared/lib/typography.ts'
import { chapterHeading } from '@/shared/lib/russian.ts'
import { Text } from '@/shared/ui/index.ts'
import type { Chapter } from '@/types/chapter.ts'
import styles from './ChapterHeader.module.css'

type Props = { chapter: Chapter }

export const ChapterHeader = memo(function ChapterHeader({ chapter }: Props) {
  const heading = chapterHeading(chapter.frontmatter.number, chapter.frontmatter.title)
  return (
    <header className={styles.header}>
      {heading.kicker ? (
        <Text variant="kicker" tone="muted">
          {heading.kicker}
        </Text>
      ) : null}
      <h1 className={styles.title}>{applyTypography(heading.title)}</h1>
      {chapter.frontmatter.subtitle ? (
        <p className={styles.subtitle}>{applyTypography(chapter.frontmatter.subtitle)}</p>
      ) : null}
      {chapter.frontmatter.epigraph ? (
        <blockquote className={styles.epigraph}>
          {applyTypography(chapter.frontmatter.epigraph)}
        </blockquote>
      ) : null}
    </header>
  )
})
