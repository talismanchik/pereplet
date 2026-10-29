import { describe, expect, it } from 'vitest'
import {
  CONTINUE_RATIO,
  continueTarget,
  defaultPosition,
  nextPosition,
  sanitizePosition,
  withRead,
} from '@/shared/lib/position.ts'
import { defaultSettings, resolveTheme, sanitizeSettings } from '@/shared/lib/theme.ts'

const chapters = [
  { slug: 'glava', number: 1 },
  { slug: 'doroga', number: 2 },
]

describe('position', () => {
  it('помечает главу прочитанной только у порога', () => {
    const early = nextPosition(defaultPosition, 'glava', 0.2)
    expect(early.read).toEqual([])
    expect(early.ratio).toBe(0.2)
    const done = nextPosition(early, 'glava', 0.94)
    expect(done.read).toEqual(['glava'])
    expect(nextPosition(done, 'glava', 0.94)).toBe(done)
  })

  it('чинит битое значение из storage', () => {
    expect(sanitizePosition(null)).toEqual(defaultPosition)
    expect(sanitizePosition({ slug: 'glava', ratio: 4, read: ['a', 1] })).toEqual({
      slug: 'glava',
      ratio: 1,
      read: ['a'],
    })
  })

  it('предлагает продолжить, только если чтение уже начато', () => {
    expect(continueTarget(defaultPosition, chapters)).toBeNull()
    expect(continueTarget({ slug: 'glava', ratio: CONTINUE_RATIO, read: [] }, chapters)).toBeNull()
    expect(continueTarget({ slug: 'glava', ratio: 0.2, read: [] }, chapters)?.number).toBe(1)
    expect(continueTarget({ slug: 'doroga', ratio: 0, read: [] }, chapters)?.number).toBe(2)
    expect(continueTarget({ slug: 'netu', ratio: 0.5, read: [] }, chapters)).toBeNull()
  })

  it('не дублирует прочитанное', () => {
    const once = withRead(defaultPosition, 'glava')
    expect(withRead(once, 'glava')).toBe(once)
  })
})

describe('theme', () => {
  it('по умолчанию следует системе', () => {
    expect(resolveTheme('system', false)).toBe('paper')
    expect(resolveTheme('system', true)).toBe('dark')
    expect(resolveTheme('sepia', true)).toBe('sepia')
  })

  it('отбрасывает неизвестную тему и ограничивает шкалы', () => {
    expect(sanitizeSettings({ theme: 'neon', fontScale: 9, lineHeight: 0 })).toEqual({
      theme: defaultSettings.theme,
      readingMode: 'scroll',
      fontScale: 1.3,
      lineHeight: 1.45,
    })
    expect(sanitizeSettings({ readingMode: 'pages' }).readingMode).toBe('pages')
    expect(sanitizeSettings({ readingMode: 'book' }).readingMode).toBe('scroll')
    expect(sanitizeSettings('нет')).toEqual(defaultSettings)
  })
})
