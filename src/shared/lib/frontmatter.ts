import type { ChapterFrontmatter } from '@/types/chapter.ts'

const KNOWN_KEYS = [
  'title',
  'number',
  'subtitle',
  'epigraph',
  'illustration',
  'illustrationCaption',
] as const

type FrontmatterKey = (typeof KNOWN_KEYS)[number]
type OptionalKey = Exclude<FrontmatterKey, 'title' | 'number'>

const OPTIONAL_KEYS: readonly OptionalKey[] = [
  'subtitle',
  'epigraph',
  'illustration',
  'illustrationCaption',
]

export class FrontmatterError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'FrontmatterError'
  }
}

export type ParsedChapter = {
  frontmatter: ChapterFrontmatter
  body: string
}

export function parseFrontmatter(source: string, filename = 'глава'): ParsedChapter {
  const text = source.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n')
  const lines = text.split('\n')
  if (lines[0]?.trim() !== '---') {
    throw new FrontmatterError(`«${filename}»: файл должен начинаться со строки ---`)
  }

  let closeIndex = -1
  for (let index = 1; index < lines.length; index += 1) {
    if (lines[index]?.trim() === '---') {
      closeIndex = index
      break
    }
  }
  if (closeIndex === -1) {
    throw new FrontmatterError(`«${filename}»: не закрыт блок frontmatter (нужна строка ---)`)
  }

  const raw = parseFields(lines.slice(1, closeIndex), filename)
  const frontmatter = validateFields(raw, filename)
  const body = lines
    .slice(closeIndex + 1)
    .join('\n')
    .replace(/^\n/, '')
    .trim()

  if (!body) {
    throw new FrontmatterError(`«${filename}»: в главе нет текста`)
  }

  return { frontmatter, body }
}

function parseFields(lines: string[], filename: string): Record<string, string> {
  const fields: Record<string, string> = {}
  for (const line of lines) {
    if (line.trim() === '') continue
    const match = /^([A-Za-z][A-Za-z0-9]*)\s*:\s*(.*)$/.exec(line)
    if (!match?.[1]) {
      throw new FrontmatterError(`«${filename}»: не поняла строку frontmatter «${line.trim()}»`)
    }
    const key = match[1]
    if (key in fields) {
      throw new FrontmatterError(`«${filename}»: поле «${key}» указано дважды`)
    }
    fields[key] = parseScalar(match[2] ?? '')
  }
  return fields
}

function parseScalar(raw: string): string {
  const value = raw.trim()
  if (value.length < 2) return value
  const quote = value[0]
  if ((quote === '"' || quote === "'") && value.endsWith(quote)) {
    const inner = value.slice(1, -1)
    if (quote === '"') {
      return inner.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\')
    }
    return inner.replace(/\\'/g, "'").replace(/\\\\/g, '\\')
  }
  return value
}

function validateFields(raw: Record<string, string>, filename: string): ChapterFrontmatter {
  for (const key of Object.keys(raw)) {
    if (!KNOWN_KEYS.includes(key as FrontmatterKey)) {
      throw new FrontmatterError(
        `«${filename}»: неизвестное поле «${key}». Допустимы: ${KNOWN_KEYS.join(', ')}`,
      )
    }
  }

  const title = requiredString(raw, 'title', filename)
  const number = requiredNumber(raw.number, filename)

  const frontmatter: ChapterFrontmatter = { title, number }
  for (const key of OPTIONAL_KEYS) {
    const value = raw[key]
    if (value === undefined) continue
    if (value.trim() === '') {
      throw new FrontmatterError(
        `«${filename}»: поле «${key}» пустое — уберите строку или заполните`,
      )
    }
    frontmatter[key] = value
  }
  return frontmatter
}

function requiredString(raw: Record<string, string>, key: 'title', filename: string): string {
  const value = raw[key]
  if (value === undefined) {
    throw new FrontmatterError(`«${filename}»: нет обязательного поля «${key}»`)
  }
  if (value.trim() === '') {
    throw new FrontmatterError(`«${filename}»: поле «${key}» пустое`)
  }
  return value
}

function requiredNumber(raw: string | undefined, filename: string): number {
  if (raw === undefined) {
    throw new FrontmatterError(`«${filename}»: нет обязательного поля «number»`)
  }
  if (!/^[1-9]\d*$/.test(raw)) {
    throw new FrontmatterError(
      `«${filename}»: number должен быть целым числом от 1, сейчас «${raw}»`,
    )
  }
  return Number(raw)
}
