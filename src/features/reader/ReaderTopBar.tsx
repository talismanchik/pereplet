import type { RefObject } from 'react'
import { useMediaQuery } from '@/shared/hooks/useMediaQuery.ts'
import { IconButton, IconMenu, IconSettings, ProgressBar } from '@/shared/ui/index.ts'
import styles from './ReaderTopBar.module.css'

type Props = {
  label: string
  progressLabel: string
  trackRef: RefObject<HTMLDivElement | null>
  barRef: RefObject<HTMLDivElement | null>
  onOpenContents: () => void
  onOpenSettings: () => void
}

export function ReaderTopBar({
  label,
  progressLabel,
  trackRef,
  barRef,
  onOpenContents,
  onOpenSettings,
}: Props) {
  const desktop = useMediaQuery('(min-width: 60rem)')

  return (
    <header className={styles.bar}>
      <ProgressBar label={progressLabel} trackRef={trackRef} barRef={barRef} />
      <div className={styles.row}>
        {desktop ? (
          <span className={styles.spacer} />
        ) : (
          <IconButton label="Оглавление" onClick={onOpenContents}>
            <IconMenu />
          </IconButton>
        )}
        <p className={styles.label}>{label}</p>
        <IconButton label="Настройки чтения" onClick={onOpenSettings}>
          <IconSettings />
        </IconButton>
      </div>
    </header>
  )
}
