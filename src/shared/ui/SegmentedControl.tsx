import { useId } from 'react'
import styles from './SegmentedControl.module.css'

type Option<T extends string> = {
  value: T
  label: string
}

type Props<T extends string> = {
  label: string
  value: T
  options: readonly Option<T>[]
  onChange: (value: T) => void
}

export function SegmentedControl<T extends string>({ label, value, options, onChange }: Props<T>) {
  const labelId = useId()

  const move = (delta: number) => {
    const current = options.findIndex((option) => option.value === value)
    const next = options[(current + delta + options.length) % options.length]
    if (next) onChange(next.value)
  }

  return (
    <div className={styles.field}>
      <div id={labelId} className={styles.label}>
        {label}
      </div>
      <div
        role="radiogroup"
        aria-labelledby={labelId}
        className={styles.group}
        onKeyDown={(event) => {
          if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
          event.preventDefault()
          event.stopPropagation()
          move(event.key === 'ArrowRight' ? 1 : -1)
        }}
      >
        {options.map((option) => {
          const selected = option.value === value
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              className={styles.option}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
