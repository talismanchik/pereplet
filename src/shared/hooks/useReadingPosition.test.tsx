import { renderHook, act } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useReadingPosition } from '@/shared/hooks/useReadingPosition.ts'
import { storageKeys } from '@/shared/lib/storage.ts'

describe('useReadingPosition', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('запоминает главу и помечает её прочитанной после порога', () => {
    const { result } = renderHook(() => useReadingPosition())
    act(() => result.current.saveProgress('glava', 0.4))
    expect(result.current.position).toMatchObject({ slug: 'glava', ratio: 0.4, read: [] })
    act(() => result.current.saveProgress('glava', 0.91))
    expect(result.current.position.read).toEqual(['glava'])
    const stored = JSON.parse(localStorage.getItem(storageKeys.position) ?? '{}') as {
      slug: string
    }
    expect(stored.slug).toBe('glava')
  })

  it('явно отмечает главу прочитанной и не дублирует её', () => {
    const { result } = renderHook(() => useReadingPosition())
    act(() => result.current.markRead('glava'))
    act(() => result.current.markRead('glava'))
    expect(result.current.position.read).toEqual(['glava'])
  })

  it('поднимается после битого json', () => {
    localStorage.setItem(storageKeys.position, 'нет')
    const { result } = renderHook(() => useReadingPosition())
    expect(result.current.position).toEqual({ slug: '', ratio: 0, read: [] })
  })
})
