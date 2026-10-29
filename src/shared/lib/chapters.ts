import { FrontmatterError, parseFrontmatter } from '@/shared/lib/frontmatter.ts'
import type { Chapter } from '@/types/chapter.ts'

const FILE_NAME = /^(\d+)-([a-z0-9-]+)\.md$/i

export function fileNameOf(path: string): string {
  const normalized = path.replaceAll('\\', '/')
  const slash = normalized.lastIndexOf('/')
  return slash === -1 ? normalized : normalized.slice(slash + 1)
}

export function findImage(images: Record<string, string>, ref: string): string | undefined {
  if (/^https?:\/\//i.test(ref)) return ref
  const [pathOnly] = ref.split('?')
  const name = fileNameOf(pathOnly ?? ref)
  if (!name) return undefined
  const found = Object.entries(images).find(([path]) => fileNameOf(path) === name)
  return found?.[1]
}

export function buildChapters(
  files: Record<string, string>,
  images: Record<string, string>,
): Chapter[] {
  const chapters = Object.entries(files).map(([path, source]) => {
    const filename = fileNameOf(path)
    const parsedName = FILE_NAME.exec(filename)
    if (!parsedName?.[1] || !parsedName[2]) {
      throw new FrontmatterError(`«${filename}»: имя файла должно быть вида 01-slug.md`)
    }

    const { frontmatter, body } = parseFrontmatter(source, filename)
    const fileNumber = Number(parsedName[1])
    if (fileNumber !== frontmatter.number) {
      throw new FrontmatterError(
        `«${filename}»: номер в имени файла (${fileNumber}) не совпадает с number: ${frontmatter.number}`,
      )
    }

    let illustrationUrl: string | undefined
    if (frontmatter.illustration) {
      illustrationUrl = findImage(images, frontmatter.illustration)
      if (!illustrationUrl) {
        throw new FrontmatterError(
          `«${filename}»: иллюстрация «${frontmatter.illustration}» не найдена в src/content/images`,
        )
      }
    }

    return {
      slug: parsedName[2],
      filename,
      frontmatter,
      markdown: body,
      illustrationUrl,
    }
  })

  chapters.sort((left, right) => left.frontmatter.number - right.frontmatter.number)

  const numbers = new Set<number>()
  const slugs = new Set<string>()
  for (const chapter of chapters) {
    if (numbers.has(chapter.frontmatter.number)) {
      throw new FrontmatterError(`Две главы с номером ${chapter.frontmatter.number}`)
    }
    if (slugs.has(chapter.slug)) {
      throw new FrontmatterError(`Две главы с адресом «${chapter.slug}»`)
    }
    numbers.add(chapter.frontmatter.number)
    slugs.add(chapter.slug)
  }

  return chapters
}
