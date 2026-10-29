import { cn } from '@/shared/lib/cn.ts'
import styles from './Button.module.css'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'md' | 'lg'

export function buttonClassName(
  variant: Variant = 'primary',
  size: Size = 'md',
  className?: string,
) {
  return cn(styles.button, styles[variant], styles[size], className)
}
