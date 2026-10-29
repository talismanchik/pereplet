import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import { pageCountFromWidths, pageIndexFromRatio, ratioFromPage } from '@/shared/lib/paging.ts'

type Options = {
  active: boolean
  slug: string
  savedRatio: number
  layoutKey: string
  extraPages: number
  onProgress: (ratio: number) => void
  trackRef: RefObject<HTMLDivElement | null>
  barRef: RefObject<HTMLDivElement | null>
}

/** Пустой зазор между колонками. Кадр его обрезает, поэтому погрешность в пару пикселей не показывает буквы соседней страницы. */
const COLUMN_GUTTER = 24

function paintProgress(
  track: HTMLDivElement | null,
  bar: HTMLDivElement | null,
  ratio: number,
) {
  if (bar) bar.style.transform = `scaleX(${ratio})`
  track?.setAttribute('aria-valuenow', String(Math.round(ratio * 100)))
}

export function usePagedChapter({
  active,
  slug,
  savedRatio,
  layoutKey,
  extraPages,
  onProgress,
  trackRef,
  barRef,
}: Options) {
  const frameRef = useRef<HTMLDivElement>(null)
  const sheetRef = useRef<HTMLDivElement>(null)
  const [page, setPage] = useState(0)
  const [textPages, setTextPages] = useState(1)
  const [offset, setOffset] = useState(0)
  const [ready, setReady] = useState(false)
  const pageRef = useRef(0)
  const countRef = useRef(1)
  const textPagesRef = useRef(1)
  const ratioRef = useRef(savedRatio)
  const savedRatioRef = useRef(savedRatio)
  const onProgressRef = useRef(onProgress)
  const strideRef = useRef(0)

  useEffect(() => {
    savedRatioRef.current = savedRatio
  }, [savedRatio])

  useEffect(() => {
    onProgressRef.current = onProgress
  }, [onProgress])

  const publish = useCallback((index: number, count: number) => {
    const next = Math.min(count - 1, Math.max(0, index))
    const ratio = ratioFromPage(next, count)
    ratioRef.current = ratio
    pageRef.current = next
    countRef.current = count
    setPage(next)
    const textIndex = Math.min(next, Math.max(0, textPagesRef.current - 1))
    setOffset(-textIndex * strideRef.current)
    paintProgress(trackRef.current, barRef.current, ratio)
    onProgressRef.current(ratio)
  }, [barRef, trackRef])

  useEffect(() => {
    if (!active) return
    const frame = frameRef.current
    const sheet = sheetRef.current
    if (!frame || !sheet) return

    let frameId = 0
    const measure = () => {
      const view = frame.getBoundingClientRect().width
      if (view < 32 || frame.clientHeight < 32) return
      const stride = view + COLUMN_GUTTER
      sheet.style.columnCount = 'auto'
      sheet.style.columnWidth = `${view}px`
      sheet.style.columnGap = `${COLUMN_GUTTER}px`
      sheet.style.width = `${view}px`
      let textCount = pageCountFromWidths(sheet.scrollWidth, stride, COLUMN_GUTTER)
      // Фиксируем лист кратно странице: колонки делятся поровну и не накапливают сдвиг.
      sheet.style.columnCount = String(textCount)
      sheet.style.width = `${textCount * view + Math.max(0, textCount - 1) * COLUMN_GUTTER}px`
      const lockedCount = pageCountFromWidths(sheet.scrollWidth, stride, COLUMN_GUTTER)
      if (lockedCount !== textCount) {
        textCount = lockedCount
        sheet.style.columnCount = String(textCount)
        sheet.style.width = `${textCount * view + Math.max(0, textCount - 1) * COLUMN_GUTTER}px`
      }
      strideRef.current = stride
      textPagesRef.current = textCount
      setTextPages(textCount)
      const total = textCount + extraPages
      publish(pageIndexFromRatio(ratioRef.current, total), total)
      setReady(true)
    }

    const schedule = () => {
      cancelAnimationFrame(frameId)
      frameId = requestAnimationFrame(measure)
    }

    schedule()
    const observer = new ResizeObserver(schedule)
    observer.observe(frame)
    void document.fonts?.ready.then(schedule)
    sheet.addEventListener('load', schedule, true)

    return () => {
      cancelAnimationFrame(frameId)
      observer.disconnect()
      sheet.removeEventListener('load', schedule, true)
    }
  }, [active, slug, layoutKey, extraPages, publish])

  const turn = useCallback(
    (delta: number) => {
      const next = pageRef.current + delta
      if (next < 0 || next >= countRef.current) return false
      publish(next, countRef.current)
      return true
    },
    [publish],
  )

  return { frameRef, sheetRef, page, textPages, offset, ready, turn }
}
