export type ChapterFrontmatter = {
  title: string
  number: number
  subtitle?: string
  epigraph?: string
  illustration?: string
  illustrationCaption?: string
}

export type Chapter = {
  slug: string
  filename: string
  frontmatter: ChapterFrontmatter
  markdown: string
  illustrationUrl?: string
}
