// Opens the developer version of the app: the Vite dev server
// (`npm run dev`) in the normal web browser, with hot reload and DevTools.
//
// - Electron: starts the dev server if it isn't running, then opens it in
//   the default browser (see 'kiosk:openDevVersion' in electron/main.js).
// - Browser: opens it in a new tab (the dev server must already be running).

export const DEV_URL = 'http://localhost:5173'

export async function openDevVersion() {
  if (typeof window.kiosk?.openDevVersion === 'function') {
    return window.kiosk.openDevVersion()
  }
  window.open(DEV_URL, '_blank', 'noopener')
}
