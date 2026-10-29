import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn.ts'
import styles from './Heading.module.css'

type Props = {
  level: 1 | 2 | 3
  variant?: 'display' | 'title' | 'section'
  id?: string
  className?: string
  children: ReactNode
}

const tags = { 1: 'h1', 2: 'h2', 3: 'h3' } as const

export function Heading({ level, variant = 'title', id, className, children }: Props) {
  const Tag = tags[level]
  return (
    <Tag id={id} className={cn(styles.heading, styles[variant], className)}>
      {children}
    </Tag>
  )
}
