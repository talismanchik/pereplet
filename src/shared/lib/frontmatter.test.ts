import { describe, expect, it } from 'vitest'
import { FrontmatterError, parseFrontmatter } from '@/shared/lib/frontmatter.ts'

const file = '01-glava.md'

function chapter(yaml: string, body = 'Текст главы.'): string {
  return `---\n${yaml}\n---\n\n${body}\n`
}

describe('parseFrontmatter', () => {
  it('читает обязательные поля и тело', () => {
    const parsed = parseFrontmatter(chapter('title: Глава 1\nnumber: 1', 'Первая строка.'))
    expect(parsed.frontmatter).toEqual({ title: 'Глава 1', number: 1 })
    expect(parsed.body).toBe('Первая строка.')
  })

  it('понимает кавычки, двоеточие и перевод строки', () => {
    const parsed = parseFrontmatter(
      chapter('title: "Дорога: север"\nnumber: 2\nepigraph: "строка\\nвторая"'),
    )
    expect(parsed.frontmatter.title).toBe('Дорога: север')
    expect(parsed.frontmatter.epigraph).toBe('строка\nвторая')
  })

  it('принимает необязательные поля иллюстрации', () => {
    const parsed = parseFrontmatter(
      chapter('title: Глава\nnumber: 3\nillustration: aurora.svg\nillustrationCaption: Небо'),
    )
    expect(parsed.frontmatter.illustration).toBe('aurora.svg')
    expect(parsed.frontmatter.illustrationCaption).toBe('Небо')
  })

  it('терпит перевод строки Windows', () => {
    const parsed = parseFrontmatter(
      '---\r\ntitle: Глава\r\nnumber: 1\r\n---\r\n\r\nАбзац.\r\n',
      file,
    )
    expect(parsed.body).toBe('Абзац.')
  })

  it('падает без открывающего блока', () => {
    expect(() => parseFrontmatter('title: Глава\n', file)).toThrow(FrontmatterError)
    expect(() => parseFrontmatter('title: Глава\n', file)).toThrow(/начинаться/)
  })

  it('падает без закрывающего блока', () => {
    expect(() => parseFrontmatter('---\ntitle: Глава\nnumber: 1\n', file)).toThrow(/не закрыт/)
  })

  it('падает на неизвестном поле', () => {
    expect(() => parseFrontmatter(chapter('title: Глава\nnumber: 1\nauthor: я'), file)).toThrow(
      /author/,
    )
  })

  it('падает без номера и на дробном номере', () => {
    expect(() => parseFrontmatter(chapter('title: Глава'), file)).toThrow(/number/)
    expect(() => parseFrontmatter(chapter('title: Глава\nnumber: 1.5'), file)).toThrow(/целым/)
    expect(() => parseFrontmatter(chapter('title: Глава\nnumber: 0'), file)).toThrow(/целым/)
  })

  it('падает на пустом тексте и повторном поле', () => {
    expect(() => parseFrontmatter(chapter('title: Глава\nnumber: 1', '   '), file)).toThrow(
      /нет текста/,
    )
    expect(() => parseFrontmatter(chapter('title: Глава\nnumber: 1\ntitle: Ещё'), file)).toThrow(
      /дважды/,
    )
  })
})
