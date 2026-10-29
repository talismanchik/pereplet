import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import { App } from './app/App.tsx'
import './styles/fonts.css'
import './styles/global.css'

// В dev-регистрация пустая. В сборке воркер обновляет кэш и перезагружает страницу.
registerSW({ immediate: true })

const root = document.getElementById('root')
if (!root) throw new Error('Не найден корневой элемент')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
