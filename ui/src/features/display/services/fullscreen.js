// Switches the kiosk between a normal window and full screen.
//
// - Electron (npm run electron): the window itself goes into kiosk mode, so
//   customers can't leave it.
// - Browser: uses the Fullscreen API. Browsers only allow entering full
//   screen from a tap or click, and the customer can leave it with Esc.

export function setFullScreen(on) {
  if (typeof window.kiosk?.setFullScreen === 'function') {
    return window.kiosk.setFullScreen(on)
  }

  const isFullScreen = !!document.fullscreenElement
  // Errors (e.g. not called from a tap) just leave the screen as it is.
  if (on && !isFullScreen) return document.documentElement.requestFullscreen?.().catch(() => {})
  if (!on && isFullScreen) return document.exitFullscreen().catch(() => {})
  return Promise.resolve()
}
