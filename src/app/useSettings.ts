import { createContext, useContext } from 'react'
import type { ReaderSettingsApi } from '@/shared/hooks/useReaderSettings.ts'

export const SettingsContext = createContext<ReaderSettingsApi | null>(null)

export function useSettings(): ReaderSettingsApi {
  const settings = useContext(SettingsContext)
  if (!settings) throw new Error('Настройки ещё не готовы')
  return settings
}
