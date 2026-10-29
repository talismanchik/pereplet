import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      // Новая глава подхватывается при следующем открытии онлайн: воркер обновляет кэш сам.
      // В dev воркер не регистрируется, чтобы не кэшировать черновик сборки.
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'og.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Переплёт',
        short_name: 'Переплёт',
        description: 'Совместная книга. Главы появляются по одной.',
        lang: 'ru',
        dir: 'ltr',
        display: 'standalone',
        start_url: './',
        scope: './',
        id: './',
        background_color: '#f4efe6',
        theme_color: '#f4efe6',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff,woff2}'],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
