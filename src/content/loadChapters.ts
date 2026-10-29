import { buildChapters, findImage } from '@/shared/lib/chapters.ts'
import type { Chapter } from '@/types/chapter.ts'

const chapterFiles = import.meta.glob('./chapters/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

const imageFiles = import.meta.glob('./images/*.{svg,png,jpg,jpeg,webp,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
})

export type Library = {
  chapters: Chapter[]
  resolveImage: (src: string) => string | undefined
}

function asStringRecord(value: unknown): Record<string, string> {
  if (!value || typeof value !== 'object') return {}
  const record: Record<string, string> = {}
  for (const [key, item] of Object.entries(value)) {
    if (typeof item === 'string') record[key] = item
  }
  return record
}

export function loadLibrary(): Library {
  const images = asStringRecord(imageFiles)
  return {
    chapters: buildChapters(asStringRecord(chapterFiles), images),
    resolveImage: (src) => findImage(images, src),
  }
}
