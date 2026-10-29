import styles from './Slider.module.css'

type Props = {
  label: string
  value: number
  min: number
  max: number
  step: number
  valueText: string
  onChange: (value: number) => void
}

export function Slider({ label, value, min, max, step, valueText, onChange }: Props) {
  return (
    <label className={styles.field}>
      <span className={styles.row}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>{valueText}</span>
      </span>
      <input
        className={styles.input}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={valueText}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  )
}
