// Where the kiosk UI (the React app) comes from in the installed app.
//
// The UI loads from a web server (UI_URL), so a change to the screens only
// needs `npm run build` and an upload of ui/dist/: no new installer. If the
// server can't be reached, the copy of the UI bundled in the installer is
// shown instead.
//
// Every minute the server's version.json is compared with the UI on screen;
// when it differs, the page reloads with the new UI once the kiosk is idle
// on the Welcome screen.

import { isIdle } from './idle.js'

export const UI_URL = process.env.KIOSK_UI_URL ?? 'http://localhost:8081/'

const CHECK_EVERY_MS = 60 * 1000
// Chromium's "navigation aborted", e.g. a reload replacing a load.
const ERR_ABORTED = -3

// Build id of the UI on screen (from its <meta name="ui-version">).
let showingVersion = null

// Always ask the server whether index.html changed, never use a cached copy.
// The JS and CSS have the build hash in their names, so caching them is safe.
const loadRemote = (win) => win.loadURL(UI_URL, { extraHeaders: 'Cache-Control: no-cache\n' })

async function serverVersion() {
  try {
    const response = await fetch(new URL(`version.json?t=${Date.now()}`, UI_URL))
    return response.ok ? (await response.json()).version : null
  } catch {
    return null // unreachable (kiosk offline); try again next time
  }
}

async function checkForNewUi(win) {
  if (!isIdle()) return
  const version = await serverVersion()
  if (version && version !== showingVersion) {
    console.log(`New UI ${version} (showing ${showingVersion ?? 'none'}); reloading`)
    loadRemote(win)
  }
}

export function loadUi(win, bundledIndex) {
  const showBundled = (reason) => {
    console.log(`UI server not available (${reason}); showing the bundled UI`)
    win.loadFile(bundledIndex)
  }
  const isRemote = (url) => url.startsWith(UI_URL)

  win.webContents.on('did-fail-load', (event, errorCode, description, url, isMainFrame) => {
    if (isMainFrame && errorCode !== ERR_ABORTED && isRemote(url)) showBundled(description)
  })

  win.webContents.on('did-finish-load', async () => {
    showingVersion = await win.webContents.executeJavaScript(
      `document.querySelector('meta[name="ui-version"]')?.content ?? null`,
    )
    console.log(`Showing UI ${showingVersion ?? '(none)'} from ${win.webContents.getURL()}`)
    // The server answered, but not with the kiosk UI (e.g. an error page).
    if (!showingVersion && isRemote(win.webContents.getURL())) showBundled('no UI at ' + UI_URL)
  })

  loadRemote(win)
  setInterval(() => checkForNewUi(win), CHECK_EVERY_MS)
}
