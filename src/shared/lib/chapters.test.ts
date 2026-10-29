import { describe, expect, it } from 'vitest'
import source from '../../content/chapters/01-glava.md?raw'
import { loadLibrary } from '@/content/loadChapters.ts'
import { buildChapters, findImage } from '@/shared/lib/chapters.ts'
import { FrontmatterError, parseFrontmatter } from '@/shared/lib/frontmatter.ts'

const images = {
  'src/content/images/aurora.svg': '/assets/aurora.svg',
  'src/content/images/window.svg': '/assets/window.svg',
}

function sourceOf(filename: string, yaml: string, body = 'Абзац.'): [string, string] {
  return [`src/content/chapters/${filename}`, `---\n${yaml}\n---\n\n${body}\n`]
}

describe('buildChapters', () => {
  it('сортирует по номеру, а не по имени файла', () => {
    const files = Object.fromEntries([
      sourceOf('02-second.md', 'title: Вторая\nnumber: 2'),
      sourceOf('01-first.md', 'title: Первая\nnumber: 1'),
    ])
    const chapters = buildChapters(files, {})
    expect(chapters.map((chapter) => chapter.slug)).toEqual(['first', 'second'])
    expect(chapters[0]?.frontmatter.number).toBe(1)
  })

  it('находит иллюстрацию по имени файла', () => {
    const files = Object.fromEntries([
      sourceOf('01-road.md', 'title: Дорога\nnumber: 1\nillustration: images/aurora.svg'),
    ])
    const chapters = buildChapters(files, images)
    expect(chapters[0]?.illustrationUrl).toBe('/assets/aurora.svg')
    expect(findImage(images, 'https://example.com/a.png')).toBe('https://example.com/a.png')
  })

  it('падает, если картинки нет', () => {
    const files = Object.fromEntries([
      sourceOf('01-road.md', 'title: Дорога\nnumber: 1\nillustration: missing.png'),
    ])
    expect(() => buildChapters(files, images)).toThrow(/не найдена/)
  })

  it('падает на повторном номере, адресе и кривом имени', () => {
    const sameNumber = Object.fromEntries([
      sourceOf('01-a.md', 'title: А\nnumber: 1'),
      sourceOf('01-b.md', 'title: Б\nnumber: 1'),
    ])
    expect(() => buildChapters(sameNumber, {})).toThrow(FrontmatterError)

    const sameSlug = Object.fromEntries([
      sourceOf('01-road.md', 'title: А\nnumber: 1'),
      sourceOf('02-road.md', 'title: Б\nnumber: 2'),
    ])
    expect(() => buildChapters(sameSlug, {})).toThrow(/адресом/)

    expect(() =>
      buildChapters({ 'notes.md': '---\ntitle: А\nnumber: 1\n---\n\nТекст\n' }, {}),
    ).toThrow(/01-slug/)
  })

  it('сверяет номер в имени файла с frontmatter', () => {
    const files = Object.fromEntries([sourceOf('02-road.md', 'title: Дорога\nnumber: 1')])
    expect(() => buildChapters(files, {})).toThrow(/не совпадает/)
  })
})

describe('папка глав', () => {
  it('подхватывает написанные главы без ручного списка', () => {
    const library = loadLibrary()
    expect(library.chapters.map((chapter) => chapter.slug)).toEqual(['glava'])
    expect(library.chapters[0]?.illustrationUrl).toBeTruthy()
    expect(library.resolveImage('window.svg')).toBeTruthy()
    expect(library.resolveImage('netu.png')).toBeUndefined()
  })
})

describe('глава 1', () => {
  it('сохраняет авторский текст дословно', () => {
    const parsed = parseFrontmatter(source, '01-glava.md')
    const paragraphs = parsed.body.split('\n\n')
    expect(parsed.frontmatter).toMatchObject({
      title: 'Глава 1',
      number: 1,
      illustration: 'aurora.svg',
    })
    expect(paragraphs).toHaveLength(47)
    expect(paragraphs[0]).toBe('Неужели этот день настал, подумала я, едва открыв глаза.')
    expect(paragraphs.at(-1)).toBe('Затем водительская дверь открылась…')
    expect(parsed.body).toContain(
      'Он проехал немного вперёд остановился, медленно сдал назад и поравнялся с обочиной.',
    )
    expect(parsed.body).not.toContain('# ')
  })
})
