// Thin wrapper around the browser print API.
// Chrome started with --kiosk-printing sends the job straight to the
// Windows default printer without showing a dialog.

const AFTERPRINT_FALLBACK_MS = 5000

export function printPage() {
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
