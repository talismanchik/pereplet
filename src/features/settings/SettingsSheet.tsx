import { Drawer, SegmentedControl, Slider } from '@/shared/ui/index.ts'
import { useSettings } from '@/app/useSettings.ts'
import {
  fontScaleLimits,
  formatFontScale,
  formatLineHeight,
  lineHeightLimits,
  type ReadingMode,
  type ThemePreference,
} from '@/shared/lib/theme.ts'
import styles from './SettingsSheet.module.css'

const readingOptions: { value: ReadingMode; label: string }[] = [
  { value: 'scroll', label: 'Сплошной' },
  { value: 'pages', label: 'Страницы' },
]

const themeOptions: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'Система' },
  { value: 'paper', label: 'Бумага' },
  { value: 'sepia', label: 'Сепия' },
  { value: 'dark', label: 'Тёмная' },
]

type Props = {
  open: boolean
  onClose: () => void
}

export function SettingsSheet({ open, onClose }: Props) {
  const { settings, setTheme, setFontScale, setLineHeight, setReadingMode } = useSettings()

  return (
    <Drawer open={open} title="Настройки" side="right" onClose={onClose}>
      <div className={styles.stack}>
        <SegmentedControl
          label="Чтение"
          value={settings.readingMode}
          options={readingOptions}
          onChange={setReadingMode}
        />
        <SegmentedControl
          label="Тема"
          value={settings.theme}
          options={themeOptions}
          onChange={setTheme}
        />
        <Slider
          label="Размер текста"
          min={fontScaleLimits.min}
          max={fontScaleLimits.max}
          step={fontScaleLimits.step}
          value={settings.fontScale}
          valueText={formatFontScale(settings.fontScale)}
          onChange={setFontScale}
        />
        <Slider
          label="Межстрочный интервал"
          min={lineHeightLimits.min}
          max={lineHeightLimits.max}
          step={lineHeightLimits.step}
          value={settings.lineHeight}
          valueText={formatLineHeight(settings.lineHeight)}
          onChange={setLineHeight}
        />
        <p className={styles.preview}>Так будет выглядеть текст главы.</p>
      </div>
    </Drawer>
  )
}
