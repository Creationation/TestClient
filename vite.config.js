import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Öffentliche Adresse für Vorschaubilder & Google: eigene Domain über SITE_URL,
// sonst die Produktionsadresse, die Vercel beim Build mitgibt.
const siteUrl = (
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:4173')
).replace(/\/$/, '')

const siteUrlPlugin = {
  name: 'site-url',
  transformIndexHtml: { order: 'pre', handler: (html) => html.replaceAll('%SITE_URL%', siteUrl) },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), siteUrlPlugin],
  server: { host: true },
  build: {
    rollupOptions: {
      input: { main: 'index.html', impressum: 'impressum.html', datenschutz: 'datenschutz.html' },
    },
  },
})
