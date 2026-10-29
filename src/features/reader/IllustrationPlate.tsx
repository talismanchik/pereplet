import { memo, useState } from 'react'
import { applyTypography } from '@/shared/lib/typography.ts'
import { buttonClassName, Modal } from '@/shared/ui/index.ts'
import styles from './IllustrationPlate.module.css'

type Props = {
  src: string
  title: string
  caption?: string
  nextLabel: string
  onNext: () => void
}

export const IllustrationPlate = memo(function IllustrationPlate({
  src,
  title,
  caption,
  nextLabel,
  onNext,
}: Props) {
  const [open, setOpen] = useState(false)
  const [start, setStart] = useState<{ x: number; y: number } | null>(null)
  const alt = caption ? applyTypography(caption) : `Иллюстрация к главе «${title}»`

  return (
    <figure className={styles.plate}>
      <button
        type="button"
        className={styles.frame}
        aria-label={alt}
        onPointerDown={(event) => setStart({ x: event.clientX, y: event.clientY })}
        onClick={(event) => {
          if (!start) {
            setOpen(true)
            return
          }
          const moved = Math.hypot(event.clientX - start.x, event.clientY - start.y)
          if (moved < 12) setOpen(true)
        }}
      >
        <img src={src} alt={alt} />
      </button>
      {caption ? (
        <figcaption className={styles.caption}>{applyTypography(caption)}</figcaption>
      ) : null}
      <button
        type="button"
        className={buttonClassName('primary', 'lg', styles.next)}
        onClick={onNext}
      >
        {nextLabel}
      </button>
      <Modal open={open} title={alt} onClose={() => setOpen(false)}>
        <img src={src} alt={alt} />
      </Modal>
    </figure>
  )
})
