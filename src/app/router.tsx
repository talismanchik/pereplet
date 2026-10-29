import { HashRouter, Route, Routes } from 'react-router'
import { ContentsPage } from '@/features/library/ContentsPage.tsx'
import { CoverPage } from '@/features/library/CoverPage.tsx'
import { ReaderPage } from '@/features/reader/ReaderPage.tsx'
import { StatusPage } from '@/app/StatusPage.tsx'

export function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<CoverPage />} />
        <Route path="/contents" element={<ContentsPage />} />
        <Route path="/read/:slug" element={<ReaderPage />} />
        <Route
          path="*"
          element={
            <StatusPage title="Такой страницы нет" text="Вернитесь к обложке и выберите главу." />
          }
        />
      </Routes>
    </HashRouter>
  )
}
