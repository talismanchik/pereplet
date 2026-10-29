import { useId, type ReactNode, type MouseEvent } from 'react'
import { useDialog } from '@/shared/hooks/useDialog.ts'
import { IconButton } from '@/shared/ui/IconButton.tsx'
import { IconClose } from '@/shared/ui/icons.tsx'
import styles from './Modal.module.css'

type Props = {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

export function Modal({ open, title, onClose, children }: Props) {
  const ref = useDialog(open, onClose)
  const titleId = useId()
  if (!open) return null

  const keepOpen = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
  }

  return (
    <div className={styles.root} onClick={onClose}>
      <div
        ref={ref}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={keepOpen}
      >
        <h2 id={titleId} className={styles.hidden}>
          {title}
        </h2>
        <IconButton label="Закрыть" tone="overlay" className={styles.close} onClick={onClose}>
          <IconClose />
        </IconButton>
        {children}
      </div>
    </div>
  )
}
