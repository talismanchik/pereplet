import { useId, type ReactNode } from 'react'
import { useDialog } from '@/shared/hooks/useDialog.ts'
import { IconButton } from '@/shared/ui/IconButton.tsx'
import { IconClose } from '@/shared/ui/icons.tsx'
import styles from './Drawer.module.css'

type Props = {
  open: boolean
  title: string
  side?: 'left' | 'right'
  onClose: () => void
  children: ReactNode
}

export function Drawer({ open, title, side = 'left', onClose, children }: Props) {
  const ref = useDialog(open, onClose)
  const titleId = useId()
  if (!open) return null

  return (
    <div className={styles.root}>
      <div className={styles.backdrop} onClick={onClose} />
      <div
        ref={ref}
        className={styles.panel}
        data-side={side}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className={styles.header}>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          <IconButton label="Закрыть" onClick={onClose}>
            <IconClose />
          </IconButton>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  )
}
