import { useCallback, useEffect, useMemo } from 'react'
import { useLocalStorage } from '@/shared/hooks/useLocalStorage.ts'
import { useMediaQuery } from '@/shared/hooks/useMediaQuery.ts'
import { storageKeys } from '@/shared/lib/storage.ts'
import {
  defaultSettings,
  resolveTheme,
  sanitizeSettings,
  type ReaderSettings,
  type ReadingMode,
  type ThemePreference,
} from '@/shared/lib/theme.ts'

const DARK_SCHEME = '(prefers-color-scheme: dark)'

export function useReaderSettings() {
  const [stored, setStored] = useLocalStorage<unknown>(storageKeys.settings, defaultSettings)
  const settings = useMemo(() => sanitizeSettings(stored), [stored])
  const systemDark = useMediaQuery(DARK_SCHEME)
  const resolved = resolveTheme(settings.theme, systemDark)

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = resolved
    root.style.setProperty('--font-scale', String(settings.fontScale))
    root.style.setProperty('--line-height', String(settings.lineHeight))
    const background = getComputedStyle(root).getPropertyValue('--color-bg').trim()
    if (background) {
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', background)
    }
  }, [resolved, settings.fontScale, settings.lineHeight])

  const update = useCallback(
    (patch: Partial<ReaderSettings>) => {
      setStored((current: unknown) => ({ ...sanitizeSettings(current), ...patch }))
    },
    [setStored],
  )

  const setTheme = useCallback((theme: ThemePreference) => update({ theme }), [update])
  const setFontScale = useCallback((fontScale: number) => update({ fontScale }), [update])
  const setLineHeight = useCallback((lineHeight: number) => update({ lineHeight }), [update])
  const setReadingMode = useCallback(
    (readingMode: ReadingMode) => update({ readingMode }),
    [update],
  )

  return { settings, resolved, setTheme, setFontScale, setLineHeight, setReadingMode }
}

export type ReaderSettingsApi = ReturnType<typeof useReaderSettings>
