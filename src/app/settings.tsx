import type { ReactNode } from 'react'
import { SettingsContext } from '@/app/useSettings.ts'
import { useReaderSettings } from '@/shared/hooks/useReaderSettings.ts'

export function SettingsProvider({ children }: { children: ReactNode }) {
  const settings = useReaderSettings()
  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>
}
