import { useEffect } from 'react'

export function useReaderKeys(
  enabled: boolean,
  hasPrevious: boolean,
  goPrevious: () => void,
  goNext: () => void,
) {
  useEffect(() => {
    if (!enabled) return
    const onKey = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return
      const target = event.target
      if (!(target instanceof HTMLElement)) return
      const tag = target.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable) return
      if (event.key === 'ArrowLeft' && hasPrevious) {
        event.preventDefault()
        goPrevious()
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        goNext()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [enabled, hasPrevious, goPrevious, goNext])
}
