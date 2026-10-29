import { useEffect, useRef } from 'react'

const SWIPE_DISTANCE = 72
const SWIPE_DOMINANCE = 1.4
const EDGE_GUARD = 28

type SwipeHandlers = {
  enabled: boolean
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
}

export function useSwipe(
  ref: { readonly current: HTMLElement | null },
  handlers: SwipeHandlers,
) {
  const handlersRef = useRef(handlers)

  useEffect(() => {
    handlersRef.current = handlers
  }, [handlers])

  useEffect(() => {
    const element = ref.current
    if (!element || !handlersRef.current.enabled) return

    let startX = 0
    let startY = 0
    let tracking = false
    let swiped = false

    const onStart = (event: TouchEvent) => {
      if (!handlersRef.current.enabled || event.touches.length !== 1) return
      const touch = event.touches[0]
      if (!touch) return
      if (touch.clientX < EDGE_GUARD || touch.clientX > window.innerWidth - EDGE_GUARD) return
      startX = touch.clientX
      startY = touch.clientY
      tracking = true
      swiped = false
    }

    const onEnd = (event: TouchEvent) => {
      if (!tracking) return
      tracking = false
      const touch = event.changedTouches[0]
      if (!touch) return
      const dx = touch.clientX - startX
      const dy = touch.clientY - startY
      if (Math.abs(dx) < SWIPE_DISTANCE || Math.abs(dx) < Math.abs(dy) * SWIPE_DOMINANCE) return
      swiped = true
      if (dx < 0) handlersRef.current.onSwipeLeft?.()
      else handlersRef.current.onSwipeRight?.()
    }

    const onClickCapture = (event: MouseEvent) => {
      if (!swiped) return
      event.preventDefault()
      event.stopPropagation()
      swiped = false
    }

    const onCancel = () => {
      tracking = false
    }

    element.addEventListener('touchstart', onStart, { passive: true })
    element.addEventListener('touchend', onEnd, { passive: true })
    element.addEventListener('touchcancel', onCancel)
    element.addEventListener('click', onClickCapture, true)
    return () => {
      element.removeEventListener('touchstart', onStart)
      element.removeEventListener('touchend', onEnd)
      element.removeEventListener('touchcancel', onCancel)
      element.removeEventListener('click', onClickCapture, true)
    }
  }, [ref, handlers.enabled])
}
