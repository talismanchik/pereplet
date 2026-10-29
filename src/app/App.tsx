import { AppErrorBoundary } from '@/app/AppErrorBoundary.tsx'
import { LibraryProvider } from '@/app/library.tsx'
import { ReadingProvider } from '@/app/reading.tsx'
import { AppRouter } from '@/app/router.tsx'
import { SettingsProvider } from '@/app/settings.tsx'

export function App() {
  return (
    <SettingsProvider>
      <AppErrorBoundary>
        <LibraryProvider>
          <ReadingProvider>
            <AppRouter />
          </ReadingProvider>
        </LibraryProvider>
      </AppErrorBoundary>
    </SettingsProvider>
  )
}
