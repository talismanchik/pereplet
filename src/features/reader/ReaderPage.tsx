import { useCallback, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useLibrary } from '@/app/useLibrary.ts'
import { useReading } from '@/app/useReading.ts'
import { useSettings } from '@/app/useSettings.ts'
import { StatusPage } from '@/app/StatusPage.tsx'
import { book } from '@/config/book.ts'
import { ContentsList } from '@/features/library/ContentsList.tsx'
import { ChapterArticle } from '@/features/reader/ChapterArticle.tsx'
import { ChapterHeader } from '@/features/reader/ChapterHeader.tsx'
import { ChapterNav } from '@/features/reader/ChapterNav.tsx'
import { IllustrationPlate } from '@/features/reader/IllustrationPlate.tsx'
import { PageFrame } from '@/features/reader/PageFrame.tsx'
import { ReaderTopBar } from '@/features/reader/ReaderTopBar.tsx'
import { SettingsSheet } from '@/features/settings/SettingsSheet.tsx'
import { useChapterScroll } from '@/shared/hooks/useChapterScroll.ts'
import { useDocumentTitle } from '@/shared/hooks/useDocumentTitle.ts'
import { useReaderKeys } from '@/shared/hooks/useReaderKeys.ts'
import { useSwipe } from '@/shared/hooks/useSwipe.ts'
import { cn } from '@/shared/lib/cn.ts'
import { Drawer } from '@/shared/ui/index.ts'
import styles from './ReaderPage.module.css'

export function ReaderPage() {
  const { slug = '' } = useParams()
  const navigate = useNavigate()
  const { chapters } = useLibrary()
  const { position, saveProgress, markRead } = useReading()
  const { settings } = useSettings()
  const paging = settings.readingMode === 'pages'
  const [tocOpen, setTocOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const swipeRef = useRef<HTMLElement>(null)

  const index = chapters.findIndex((chapter) => chapter.slug === slug)
  const chapter = index >= 0 ? chapters[index] : undefined
  const previous = index > 0 ? chapters[index - 1] : undefined
  const next = chapter && index < chapters.length - 1 ? chapters[index + 1] : undefined
  const overlaysOpen = tocOpen || settingsOpen

  useDocumentTitle(chapter ? `${chapter.frontmatter.title} — ${book.title}` : book.title)

  const savedRatio = chapter && position.slug === chapter.slug ? position.ratio : 0
  const reportProgress = useCallback(
    (ratio: number) => {
      if (chapter) saveProgress(chapter.slug, ratio)
    },
    [chapter, saveProgress],
  )
  const { trackRef, barRef } = useChapterScroll(
    paging ? null : (chapter?.slug ?? null),
    savedRatio,
    reportProgress,
  )

  const goPrevious = useCallback(() => {
    if (previous) navigate(`/read/${previous.slug}`)
  }, [navigate, previous])

  const goNext = useCallback(() => {
    if (chapter) markRead(chapter.slug)
    navigate(next ? `/read/${next.slug}` : '/')
  }, [chapter, markRead, navigate, next])

  useSwipe(swipeRef, {
    enabled: Boolean(chapter) && !overlaysOpen && !paging,
    onSwipeLeft: goNext,
    onSwipeRight: goPrevious,
  })

  useReaderKeys(Boolean(chapter) && !overlaysOpen && !paging, Boolean(previous), goPrevious, goNext)

  if (!chapter) {
    return (
      <StatusPage title="Главы нет" text="В оглавлении только те главы, которые уже написаны." />
    )
  }

  const progressLabel = `Глава ${chapter.frontmatter.number} из ${chapters.length}`

  return (
    <div className={cn(styles.page, paging && styles.paged)}>
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <h2 className={styles.sideTitle}>Оглавление</h2>
          <nav aria-label="Оглавление">
            <ContentsList currentSlug={chapter.slug} readSlugs={position.read} />
          </nav>
        </aside>
        <div className={styles.column}>
          <ReaderTopBar
            label={progressLabel}
            progressLabel={`Прогресс: ${progressLabel}`}
            trackRef={trackRef}
            barRef={barRef}
            onOpenContents={() => setTocOpen(true)}
            onOpenSettings={() => setSettingsOpen(true)}
          />
          <main ref={swipeRef} className={styles.main}>
            <a className="skip-link" href="#chapter">
              К тексту главы
            </a>
            {paging ? (
              <PageFrame
                key={chapter.slug}
                slug={chapter.slug}
                savedRatio={savedRatio}
                layoutKey={`${settings.fontScale}:${settings.lineHeight}`}
                overlaysOpen={overlaysOpen}
                trackRef={trackRef}
                barRef={barRef}
                onProgress={reportProgress}
                onPreviousEdge={goPrevious}
                onNextEdge={goNext}
                illustration={
                  chapter.illustrationUrl ? (
                    <IllustrationPlate
                      src={chapter.illustrationUrl}
                      title={chapter.frontmatter.title}
                      caption={chapter.frontmatter.illustrationCaption}
                      nextLabel={next ? 'Дальше' : 'На обложку'}
                      onNext={goNext}
                    />
                  ) : null
                }
              >
                <ChapterHeader chapter={chapter} />
                <ChapterArticle key={chapter.slug} markdown={chapter.markdown} />
              </PageFrame>
            ) : (
              <>
                <ChapterHeader chapter={chapter} />
                <ChapterArticle key={chapter.slug} markdown={chapter.markdown} />
                {chapter.illustrationUrl ? (
                  <IllustrationPlate
                    src={chapter.illustrationUrl}
                    title={chapter.frontmatter.title}
                    caption={chapter.frontmatter.illustrationCaption}
                    nextLabel={next ? 'Дальше' : 'На обложку'}
                    onNext={goNext}
                  />
                ) : null}
                <ChapterNav
                  previous={previous}
                  next={next}
                  showNext={!chapter.illustrationUrl}
                  onNext={goNext}
                />
              </>
            )}
          </main>
        </div>
      </div>
      <Drawer open={tocOpen} title="Оглавление" onClose={() => setTocOpen(false)}>
        <ContentsList
          currentSlug={chapter.slug}
          readSlugs={position.read}
          onNavigate={() => setTocOpen(false)}
        />
      </Drawer>
      <SettingsSheet open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}
