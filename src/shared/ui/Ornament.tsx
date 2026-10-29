import { cn } from '@/shared/lib/cn.ts'
import styles from './Ornament.module.css'

type Props = {
  className?: string
}

export function Ornament({ className }: Props) {
  return (
    <div className={cn(styles.ornament, className)} role="separator">
      <span className={styles.line} />
      <svg className={styles.mark} viewBox="0 0 24 12" aria-hidden="true">
        <path d="M12 1.2 14.4 6 12 10.8 9.6 6Z" fill="currentColor" />
      </svg>
      <span className={styles.line} />
    </div>
  )
}
