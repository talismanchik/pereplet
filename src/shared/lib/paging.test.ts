import { describe, expect, it } from 'vitest'
import { pageCountFromWidths, pageIndexFromRatio, ratioFromPage } from '@/shared/lib/paging.ts'

describe('paging', () => {
  it('считает страницы по ширине колонок', () => {
    expect(pageCountFromWidths(0, 0, 0)).toBe(1)
    expect(pageCountFromWidths(300, 300, 48)).toBe(1)
    expect(pageCountFromWidths(5 * 375 - 48, 375, 48)).toBe(5)
  })

  it('восстанавливает страницу из доли прокрутки и обратно', () => {
    expect(pageIndexFromRatio(0, 8)).toBe(0)
    expect(pageIndexFromRatio(1, 8)).toBe(7)
    expect(pageIndexFromRatio(0.5, 5)).toBe(2)
    expect(ratioFromPage(0, 5)).toBe(0)
    expect(ratioFromPage(4, 5)).toBe(1)
    expect(ratioFromPage(0, 1)).toBe(1)
  })
})
