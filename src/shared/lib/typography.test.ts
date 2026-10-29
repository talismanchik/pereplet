import { describe, expect, it } from 'vitest'
import { applyTypography } from '@/shared/lib/typography.ts'

describe('applyTypography', () => {
  it('ставит неразрывный пробел после коротких слов', () => {
    expect(applyTypography('Малой мурчал мне в волосы и иногда.')).toBe(
      'Малой мурчал мне в\u00A0волосы и\u00A0иногда.',
    )
    expect(applyTypography('В такую погоду.')).toBe('В\u00A0такую погоду.')
  })

  it('не отрывает тире и не трогает тире в начале реплики', () => {
    expect(applyTypography('денег — ещё меньше')).toBe('денег\u00A0— ещё меньше')
    expect(applyTypography('— Всё, хватит, — пробормотала я')).toBe(
      '— Всё, хватит,\u00A0— пробормотала я',
    )
  })

  it('меняет прямые кавычки на ёлочки и не портит уже обработанный текст', () => {
    expect(applyTypography('слово "север" здесь')).toBe('слово «север» здесь')
    const once = applyTypography('дорога в лес — дом')
    expect(applyTypography(once)).toBe(once)
  })
})
