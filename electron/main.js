// Electron shell for the kiosk: shows the React app and prints receipts
// silently (no preview, no dialog) to a chosen printer.
//
//   npm run electron           Welcome screen in a normal (maximized) window,
//                              every other screen full-screen kiosk
//   npm run electron:window    always a normal window, still prints silently
//   npm run electron:prod      builds the app and loads dist/ (no dev server)
//
// Printer: set KIOSK_PRINTER to a printer name (as shown in Windows
// "Printers & scanners"); otherwise the Windows default printer is used.

import { app, BrowserWindow, ipcMain, Menu, shell } from 'electron'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'

const DEV_URL = process.env.KIOSK_URL ?? 'http://localhost:5173'
const PRINTER_NAME = process.env.KIOSK_PRINTER ?? ''

const windowed = process.argv.includes('--windowed')
const useBuild = app.isPackaged || process.argv.includes('--prod')

const appDir = fileURLToPath(new URL('..', import.meta.url))

// Electron prints to the Windows default printer when no deviceName is
// given. A KIOSK_PRINTER name is checked first so a typo fails loudly
// instead of printing somewhere else.
async function printerOptions(webContents) {
  if (!PRINTER_NAME) return {}
  const printers = await webContents.getPrintersAsync()
  if (!printers.some((p) => p.name === PRINTER_NAME)) {
    throw new Error(`Printer "${PRINTER_NAME}" not found`)
  }
  return { deviceName: PRINTER_NAME }
}

// Shortest page the POS-80 driver supports (60.06mm).
const MIN_PAGE_HEIGHT_MM = 61

// Page size from the app (measured receipt). Without it the driver's default
// page (72 x 297mm) is used: the receipt prints shrunk with blank paper after.
function pageOptions({ widthMm, heightMm, marginMm }) {
  const margin = Math.round((marginMm * 96) / 25.4) // Electron wants pixels
  return {
    pageSize: {
      width: Math.round(widthMm * 1000), // microns
      height: Math.round(Math.max(heightMm, MIN_PAGE_HEIGHT_MM) * 1000),
    },
    margins: { marginType: 'custom', top: margin, bottom: margin, left: margin, right: margin },
  }
}

// Prints the current page. The page's print CSS hides the app and shows
// only the receipt, the same as window.print() in a browser.
ipcMain.handle('kiosk:print', async (event, page) => {
  const target = await printerOptions(event.sender)
  const layout = pageOptions(page)
  console.log(
    `Printing to ${target.deviceName ?? 'Windows default printer'}:`,
    `${page.widthMm} x ${layout.pageSize.height / 1000}mm`,
  )
  return new Promise((resolve, reject) => {
    event.sender.print(
      { silent: true, printBackground: true, ...target, ...layout },
      (success, failureReason) =>
        success
          ? resolve({ printer: target.deviceName ?? 'Windows default' })
          : reject(new Error(failureReason)),
    )
  })
})

// The app asks for full screen when it leaves the Welcome screen and for a
// normal window when it returns. Kiosk mode also stops customers leaving
// full screen. Ignored with --windowed, which is for testing.
ipcMain.handle('kiosk:fullscreen', (event, on) => {
  if (windowed) return
  BrowserWindow.fromWebContents(event.sender)?.setKiosk(!!on)
})

async function isDevServerUp() {
  try {
    await fetch(DEV_URL)
    return true
  } catch {
    return false
  }
}

// "Developer version" button: the same as running `npm run dev` and opening
// it in the browser. The dev server gets its own terminal window, so it keeps
// running after the kiosk closes; close that window (or Ctrl+C) to stop it.
ipcMain.handle('kiosk:openDevVersion', async () => {
  if (!(await isDevServerUp())) {
    if (app.isPackaged) throw new Error(`The dev server is not running at ${DEV_URL}.`)

    spawn('cmd.exe', ['/c', 'start', 'Kiosk dev server', 'cmd', '/k', 'npm run dev'], {
      cwd: appDir,
      detached: true,
      stdio: 'ignore',
    }).unref()

    const deadline = Date.now() + 30000
    while (!(await isDevServerUp())) {
      if (Date.now() > deadline) throw new Error(`The dev server did not start at ${DEV_URL}.`)
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }
  await shell.openExternal(DEV_URL)
})

ipcMain.handle('kiosk:printers', (event) =>
  event.sender
    .getPrintersAsync()
    .then((printers) => printers.map(({ name, displayName }) => ({ name, displayName }))),
)

function createWindow() {
  // Starts as a normal window for the Welcome screen; the app switches to
  // full screen itself (see 'kiosk:fullscreen').
  const win = new BrowserWindow({
    width: 1080,
    height: 1920,
    show: false,
    autoHideMenuBar: true,
    backgroundColor: '#ffffff',
    webPreferences: {
      preload: join(appDir, 'electron', 'preload.cjs'),
    },
  })
  win.maximize()
  win.show()

  // A (re)load always starts on the Welcome screen, so leave full screen.
  win.webContents.on('did-finish-load', () => win.setKiosk(false))

  // Customers can't open pop-ups or other sites.
  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }))

  if (useBuild) {
    win.loadFile(join(appDir, 'dist', 'index.html'))
  } else {
    win.loadURL(DEV_URL)
  }
}

// Only one kiosk window, even if the app is started twice.
if (!app.requestSingleInstanceLock()) {
  app.quit()
} else {
  if (!windowed) Menu.setApplicationMenu(null)

  app.whenReady().then(createWindow)
  app.on('window-all-closed', () => app.quit())
}
