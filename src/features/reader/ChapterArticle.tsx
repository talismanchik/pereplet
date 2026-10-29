import { Children, memo, type HTMLAttributes, type ReactNode } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useLibrary } from '@/app/useLibrary.ts'
import { cn } from '@/shared/lib/cn.ts'
import { applyTypography } from '@/shared/lib/typography.ts'
import { Ornament } from '@/shared/ui/index.ts'
import styles from './ChapterArticle.module.css'

function typograph(children: ReactNode): ReactNode {
  return Children.map(children, (child) =>
    typeof child === 'string' ? applyTypography(child) : child,
  )
}

function Paragraph({ children }: HTMLAttributes<HTMLParagraphElement>) {
  return <p>{typograph(children)}</p>
}

function Quote({ children }: HTMLAttributes<HTMLQuoteElement>) {
  return <blockquote className={styles.quote}>{typograph(children)}</blockquote>
}

function Subheading({ children }: HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={styles.subheading}>{typograph(children)}</h2>
}

function MinorHeading({ children }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={styles.minor}>{typograph(children)}</h3>
}

function Emphasis({ children }: HTMLAttributes<HTMLElement>) {
  return <em>{typograph(children)}</em>
}

function Strong({ children }: HTMLAttributes<HTMLElement>) {
  return <strong>{typograph(children)}</strong>
}

function Anchor({ href, children }: HTMLAttributes<HTMLAnchorElement> & { href?: string }) {
  const external = href?.startsWith('http')
  return (
    <a
      href={href}
      className={styles.link}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
    >
      {typograph(children)}
    </a>
  )
}

function MarkdownImage({ src, alt }: { src?: string; alt?: string }) {
  const { resolveImage } = useLibrary()
  if (!src) return null
  const resolved = resolveImage(src)
  if (!resolved) return null
  return (
    <img className={styles.image} src={resolved} alt={alt ?? ''} loading="lazy" decoding="async" />
  )
}

const components = {
  p: Paragraph,
  blockquote: Quote,
  h1: Subheading,
  h2: Subheading,
  h3: MinorHeading,
  em: Emphasis,
  strong: Strong,
  a: Anchor,
  img: MarkdownImage,
  hr: () => <Ornament className={styles.break} />,
}

function startsWithLetter(markdown: string): boolean {
  const firstBlock =
    markdown
      .trim()
      .split(/\n\s*\n/u)[0]
      ?.trim() ?? ''
  return /^\p{L}/u.test(firstBlock)
}

type Props = { markdown: string }

export const ChapterArticle = memo(function ChapterArticle({ markdown }: Props) {
  return (
    <article
      id="chapter"
      className={cn(styles.prose, startsWithLetter(markdown) && styles.withDropCap)}
      lang="ru"
    >
      <Markdown remarkPlugins={[remarkGfm]} components={components}>
        {markdown}
      </Markdown>
    </article>
  )
})
