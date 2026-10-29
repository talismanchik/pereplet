import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn.ts'
import styles from './Text.module.css'

type Props = {
  as?: 'p' | 'span'
  variant?: 'body' | 'ui' | 'caption' | 'kicker'
  tone?: 'default' | 'muted'
  className?: string
  children: ReactNode
}

export function Text({ as = 'p', variant = 'ui', tone = 'default', className, children }: Props) {
  const Tag = as
  return (
    <Tag className={cn(styles.text, styles[variant], tone === 'muted' && styles.muted, className)}>
      {children}
    </Tag>
  )
}
