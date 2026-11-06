// Auto-update for the installed kiosk app (the .exe from `npm run dist`).
// For changes to the screens only, see ui.js: they don't need a new .exe.
//
// Checks the update server (package.json "build.publish.url") when the app
// opens and every few hours, and downloads a new version in the background.
//  - Found when the app opens: installs as soon as it has downloaded, unless a
//    customer has already left the Welcome screen.
//  - Otherwise: installs only after the kiosk has sat on the Welcome screen
//    for a while, so a customer's order is never interrupted.
// Does nothing when not installed (npm run electron / electron:prod).

import { app } from 'electron'
import electronUpdater from 'electron-updater'
import { isIdle, isUsedSinceOpen } from './idle.js'

const { autoUpdater } = electronUpdater

const CHECK_EVERY_MS = 4 * 60 * 60 * 1000
const IDLE_CHECK_EVERY_MS = 15 * 1000

// Silent install, then start the new version.
const install = () => autoUpdater.quitAndInstall(true, true)

function check() {
  // An unreachable server is normal (kiosk offline); try again next time.
  autoUpdater.checkForUpdates().catch((error) => console.error('Update check failed:', error.message))
}

export function startAutoUpdates() {
  if (!app.isPackaged) return

  autoUpdater.logger = console
  autoUpdater.on('error', (error) => console.error('Update failed:', error.message))

  autoUpdater.once('update-downloaded', ({ version }) => {
    if (!isUsedSinceOpen()) {
      console.log(`Update ${version} downloaded; installing now`)
      install()
      return
    }
    console.log(`Update ${version} downloaded; installing when the kiosk is idle`)
    const timer = setInterval(() => {
      if (!isIdle()) return
      clearInterval(timer)
      install()
    }, IDLE_CHECK_EVERY_MS)
  })

  check()
  setInterval(check, CHECK_EVERY_MS)
}
