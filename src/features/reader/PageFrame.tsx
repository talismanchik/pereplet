import { useCallback, useEffect, useRef, type ReactNode, type RefObject } from 'react'
import { usePagedChapter } from '@/shared/hooks/usePagedChapter.ts'
import { useSwipe } from '@/shared/hooks/useSwipe.ts'
import { cn } from '@/shared/lib/cn.ts'
import styles from './PageFrame.module.css'

type Props = {
  slug: string
  savedRatio: number
  layoutKey: string
  overlaysOpen: boolean
  trackRef: RefObject<HTMLDivElement | null>
  barRef: RefObject<HTMLDivElement | null>
  onProgress: (ratio: number) => void
  onPreviousEdge: () => void
  onNextEdge: () => void
  illustration: ReactNode
  children: ReactNode
}

export function PageFrame({
  slug,
  savedRatio,
  layoutKey,
  overlaysOpen,
  trackRef,
  barRef,
  onProgress,
  onPreviousEdge,
  onNextEdge,
  illustration,
  children,
}: Props) {
  const stageRef = useRef<HTMLDivElement>(null)
  const { frameRef, sheetRef, page, textPages, offset, ready, turn } = usePagedChapter({
    active: true,
    slug,
    savedRatio,
    layoutKey,
    extraPages: illustration ? 1 : 0,
    onProgress,
    trackRef,
    barRef,
  })
  const total = textPages + (illustration ? 1 : 0)
  const onPlate = Boolean(illustration) && page >= textPages

  const go = useCallback(
    (delta: number) => {
      if (turn(delta)) return
      if (delta < 0) onPreviousEdge()
      else onNextEdge()
    },
    [onNextEdge, onPreviousEdge, turn],
  )

  useSwipe(stageRef, {
    enabled: !overlaysOpen,
    onSwipeLeft: () => go(1),
    onSwipeRight: () => go(-1),
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  useEffect(() => {
    if (overlaysOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return
      const target = event.target
      if (!(target instanceof HTMLElement)) return
      const tag = target.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable) return
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
      event.preventDefault()
      go(event.key === 'ArrowRight' ? 1 : -1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, overlaysOpen])

  return (
    <div className={styles.stage} ref={stageRef}>
      <div className={styles.frame} ref={frameRef}>
        <div
          ref={sheetRef}
          className={styles.sheet}
          style={{
            transform: `translate3d(${offset}px, 0, 0)`,
            visibility: ready && !onPlate ? 'visible' : 'hidden',
          }}
          aria-hidden={!ready || onPlate}
          inert={!ready || onPlate}
        >
          {children}
        </div>
        {onPlate ? <div className={styles.plate}>{illustration}</div> : null}
      </div>
      <button
        type="button"
        className={cn(styles.hit, styles.hitLeft)}
        aria-label={page === 0 ? 'Предыдущая глава' : 'Предыдущая страница'}
        onClick={() => go(-1)}
      />
      <button
        type="button"
        className={cn(styles.hit, styles.hitRight)}
        aria-label={page >= total - 1 ? 'Следующая глава' : 'Следующая страница'}
        onClick={() => go(1)}
      />
      <p className={styles.pager} aria-live="polite">
        {ready ? `${page + 1} из ${total}` : ''}
      </p>
    </div>
  )
}
