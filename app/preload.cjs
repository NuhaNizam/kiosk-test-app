// Exposes a small, safe printing API to the React app as `window.kiosk`.
// Only present when the app runs inside Electron.

const { contextBridge, ipcRenderer } = require('electron')

const SHELL_VERSION_ARG = '--kiosk-shell-version='

contextBridge.exposeInMainWorld('kiosk', {
  /**
   * Version of the installed kiosk app (e.g. "1.0.4"). The UI comes from a
   * server and can be newer than the app: check this before using a
   * function that older apps don't have.
   */
  shellVersion: process.argv.find((arg) => arg.startsWith(SHELL_VERSION_ARG))?.slice(SHELL_VERSION_ARG.length),
  /**
   * Prints the current page silently on a page of the given size
   * ({ widthMm, heightMm, marginMm }). Resolves with { printer }.
   */
  print: (page) => ipcRenderer.invoke('kiosk:print', page),
  /** true = full-screen kiosk, false = normal window. */
  setFullScreen: (on) => ipcRenderer.invoke('kiosk:fullscreen', on),
  /** Starts the dev server if needed and opens it in the default browser. */
  openDevVersion: () => ipcRenderer.invoke('kiosk:openDevVersion'),
  /** Lists installed printers: [{ name, displayName }]. */
  getPrinters: () => ipcRenderer.invoke('kiosk:printers'),
})
