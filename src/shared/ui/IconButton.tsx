import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/shared/lib/cn.ts'
import styles from './IconButton.module.css'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string
  tone?: 'default' | 'overlay'
  children: ReactNode
}

export function IconButton({
  label,
  tone = 'default',
  className,
  type = 'button',
  children,
  ...props
}: Props) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cn(styles.iconButton, tone === 'overlay' && styles.overlay, className)}
      {...props}
    >
      {children}
    </button>
  )
}
