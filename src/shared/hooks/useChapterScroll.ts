import { useEffect, useRef } from 'react'
import { clampRatio } from '@/shared/lib/position.ts'

const SCROLL_FIT_TOLERANCE = 8

function measureRatio(scrolling: Element): number {
  const max = scrolling.scrollHeight - scrolling.clientHeight
  if (max <= SCROLL_FIT_TOLERANCE) return 1
  return clampRatio(scrolling.scrollTop / max)
}

export function useChapterScroll(
  slug: string | null,
  savedRatio: number,
  onProgress: (ratio: number) => void,
) {
  const onProgressRef = useRef(onProgress)
  const savedRatioRef = useRef(savedRatio)
  const trackRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    onProgressRef.current = onProgress
    savedRatioRef.current = savedRatio
  }, [onProgress, savedRatio])

  useEffect(() => {
    if (!slug) return
    const scrolling = document.scrollingElement
    if (!scrolling) return

    let ready = false

    const paint = (ratio: number) => {
      if (barRef.current) barRef.current.style.transform = `scaleX(${ratio})`
      trackRef.current?.setAttribute('aria-valuenow', String(Math.round(ratio * 100)))
    }

    const publish = () => {
      const ratio = measureRatio(scrolling)
      paint(ratio)
      onProgressRef.current(ratio)
    }

    const onScroll = () => {
      if (!ready) return
      publish()
    }

    const restore = () => {
      const max = scrolling.scrollHeight - scrolling.clientHeight
      const target = savedRatioRef.current
      if (max > SCROLL_FIT_TOLERANCE && target > 0) {
        window.scrollTo(0, target * max)
      } else {
        window.scrollTo(0, 0)
      }
      ready = true
      publish()
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    restore()
    let cancelled = false
    void document.fonts?.ready.then(() => {
      if (!cancelled) requestAnimationFrame(restore)
    })

    return () => {
      cancelled = true
      window.removeEventListener('scroll', onScroll)
    }
  }, [slug])

  return { trackRef, barRef }
}
