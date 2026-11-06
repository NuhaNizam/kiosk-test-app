import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

// Gives every build a new UI version: in index.html (the UI a kiosk is
// showing) and in version.json (the UI on the server). The kiosk reloads
// when they differ (app/ui.js).
function uiVersion() {
  const version = new Date().toISOString()
  return {
    name: 'ui-version',
    apply: 'build',
    transformIndexHtml: () => [
      { tag: 'meta', attrs: { name: 'ui-version', content: version }, injectTo: 'head' },
    ],
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'version.json', source: JSON.stringify({ version }) })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), uiVersion()],
  // Relative asset paths so the build also loads from file:// in Electron.
  base: './',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // Fixed port so scripts/start-electron.js always finds the app.
  server: {
    port: 5173,
    strictPort: true,
  },
})
