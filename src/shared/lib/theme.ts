export const themePreferences = ['system', 'paper', 'sepia', 'dark'] as const
export const readingModes = ['scroll', 'pages'] as const

export type ThemePreference = (typeof themePreferences)[number]
export type ResolvedTheme = Exclude<ThemePreference, 'system'>
export type ReadingMode = (typeof readingModes)[number]

export const fontScaleLimits = { min: 0.875, max: 1.3, step: 0.025, default: 1 } as const
export const lineHeightLimits = { min: 1.45, max: 1.95, step: 0.05, default: 1.7 } as const

export type ReaderSettings = {
  theme: ThemePreference
  fontScale: number
  lineHeight: number
  readingMode: ReadingMode
}

export const defaultSettings: ReaderSettings = {
  theme: 'system',
  fontScale: fontScaleLimits.default,
  lineHeight: lineHeightLimits.default,
  readingMode: 'scroll',
}

/** Держать в одном цвете с --color-bg в tokens.css: нужно до загрузки стилей. */
export const themeBackground: Record<ResolvedTheme, string> = {
  paper: '#f4efe6',
  sepia: '#f3e4cc',
  dark: '#141210',
}

export function resolveTheme(preference: ThemePreference, systemDark: boolean): ResolvedTheme {
  if (preference === 'system') return systemDark ? 'dark' : 'paper'
  return preference
}

export function sanitizeSettings(value: unknown): ReaderSettings {
  if (!value || typeof value !== 'object') return defaultSettings
  const record = value as Partial<ReaderSettings>
  const theme = themePreferences.includes(record.theme as ThemePreference)
    ? (record.theme as ThemePreference)
    : defaultSettings.theme
  const readingMode = readingModes.includes(record.readingMode as ReadingMode)
    ? (record.readingMode as ReadingMode)
    : defaultSettings.readingMode
  return {
    theme,
    readingMode,
    fontScale: clampNumber(
      record.fontScale,
      fontScaleLimits.min,
      fontScaleLimits.max,
      fontScaleLimits.default,
    ),
    lineHeight: clampNumber(
      record.lineHeight,
      lineHeightLimits.min,
      lineHeightLimits.max,
      lineHeightLimits.default,
    ),
  }
}

export function formatFontScale(scale: number): string {
  return `${Math.round(scale * 100)}%`
}

export function formatLineHeight(value: number): string {
  return value.toFixed(2).replace('.', ',')
}

function clampNumber(value: unknown, min: number, max: number, fallback: number): number {
  if (typeof value !== 'number' || Number.isNaN(value)) return fallback
  return Math.min(max, Math.max(min, value))
}
