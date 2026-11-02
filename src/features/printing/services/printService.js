// Prints the current page; the print CSS shows only the receipt.
//
// - In the Electron app (npm run electron) the job goes straight to the
//   printer with no preview at all, via the `window.kiosk` bridge.
// - In a normal browser it falls back to window.print(), which shows the
//   print dialog (or prints silently in Chrome with --kiosk-printing).

import { measureReceiptPage } from '../printLayout'

const AFTERPRINT_FALLBACK_MS = 5000

/** True when running inside the Electron kiosk app. */
export const isSilentPrintAvailable = () => typeof window.kiosk?.print === 'function'

function browserPrint() {
  return new Promise((resolve) => {
    let done = false
    const finish = () => {
      if (done) return
      done = true
      window.removeEventListener('afterprint', finish)
      resolve()
    }

    window.addEventListener('afterprint', finish)
    // Some browsers never fire `afterprint`; don't leave the UI stuck.
    setTimeout(finish, AFTERPRINT_FALLBACK_MS)
    window.print()
  })
}

/** Resolves when the job is sent; rejects if the Electron print fails. */
export function printPage() {
  // Electron needs the page size; a browser takes it from the print dialog.
  return isSilentPrintAvailable() ? window.kiosk.print(measureReceiptPage()) : browserPrint()
}
