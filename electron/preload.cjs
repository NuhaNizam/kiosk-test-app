// Exposes a small, safe printing API to the React app as `window.kiosk`.
// Only present when the app runs inside Electron.

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('kiosk', {
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
