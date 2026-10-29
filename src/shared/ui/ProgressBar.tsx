import type { RefObject } from 'react'
import styles from './ProgressBar.module.css'

type Props = {
  label: string
  trackRef: RefObject<HTMLDivElement | null>
  barRef: RefObject<HTMLDivElement | null>
}

export function ProgressBar({ label, trackRef, barRef }: Props) {
  return (
    <div
      ref={trackRef}
      className={styles.track}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
    >
      <div ref={barRef} className={styles.bar} />
    </div>
  )
}
