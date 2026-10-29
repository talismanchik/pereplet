export const READ_THRESHOLD = 0.9
export const CONTINUE_RATIO = 0.02

export type ReadingPosition = {
  slug: string
  ratio: number
  read: string[]
}

export const defaultPosition: ReadingPosition = {
  slug: '',
  ratio: 0,
  read: [],
}

export function clampRatio(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.min(1, Math.max(0, value))
}

export function roundRatio(value: number): number {
  return Math.round(clampRatio(value) * 100) / 100
}

export function sanitizePosition(value: unknown): ReadingPosition {
  if (!value || typeof value !== 'object') return defaultPosition
  const record = value as Partial<ReadingPosition>
  const slug = typeof record.slug === 'string' ? record.slug : ''
  const read = Array.isArray(record.read)
    ? record.read.filter((item) => typeof item === 'string')
    : []
  return {
    slug,
    ratio: typeof record.ratio === 'number' ? clampRatio(record.ratio) : 0,
    read,
  }
}

export function nextPosition(
  current: ReadingPosition,
  slug: string,
  ratio: number,
): ReadingPosition {
  const nextRatio = roundRatio(ratio)
  const read =
    nextRatio >= READ_THRESHOLD && !current.read.includes(slug)
      ? [...current.read, slug]
      : current.read
  if (current.slug === slug && current.ratio === nextRatio && read === current.read) return current
  return { slug, ratio: nextRatio, read }
}

export function withRead(current: ReadingPosition, slug: string): ReadingPosition {
  if (current.read.includes(slug)) return current
  return { ...current, read: [...current.read, slug] }
}

type ChapterRef = { slug: string; number: number }

export function continueTarget(
  position: ReadingPosition,
  chapters: ChapterRef[],
): ChapterRef | null {
  const saved = chapters.find((chapter) => chapter.slug === position.slug)
  const first = chapters[0]
  if (!saved || !first) return null
  const started = saved.slug !== first.slug || position.ratio > CONTINUE_RATIO
  return started ? saved : null
}
