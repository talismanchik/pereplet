import { renderHook, act } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useReaderSettings } from '@/shared/hooks/useReaderSettings.ts'
import { storageKeys } from '@/shared/lib/storage.ts'

function setMatchMedia(matches: boolean) {
  window.matchMedia = ((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    addListener: () => undefined,
    removeListener: () => undefined,
    dispatchEvent: () => false,
  })) as typeof window.matchMedia
}

describe('useReaderSettings', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
    setMatchMedia(false)
    document.head.innerHTML = '<meta name="theme-color" content="#f4efe6">'
  })

  it('по умолчанию берёт светлую тему, если система светлая', () => {
    const { result } = renderHook(() => useReaderSettings())
    expect(result.current.settings.theme).toBe('system')
    expect(result.current.resolved).toBe('paper')
    expect(document.documentElement.dataset.theme).toBe('paper')
  })

  it('сохраняет выбранную тему и масштаб', () => {
    const { result } = renderHook(() => useReaderSettings())
    act(() => {
      result.current.setTheme('sepia')
      result.current.setFontScale(1.1)
    })
    expect(document.documentElement.dataset.theme).toBe('sepia')
    expect(document.documentElement.style.getPropertyValue('--font-scale')).toBe('1.1')
    expect(JSON.parse(localStorage.getItem(storageKeys.settings) ?? '{}')).toMatchObject({
      theme: 'sepia',
      fontScale: 1.1,
    })
  })

  it('не падает на испорченном localStorage и следует тёмной системе', () => {
    localStorage.setItem(storageKeys.settings, '{')
    setMatchMedia(true)
    const { result } = renderHook(() => useReaderSettings())
    expect(result.current.settings.theme).toBe('system')
    expect(result.current.resolved).toBe('dark')
  })
})
