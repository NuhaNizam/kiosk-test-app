// Tracks whether a customer is using the kiosk, so updates (of the app or of
// the UI) only happen when it's idle on the Welcome screen.

const IDLE_AFTER_MS = 60 * 1000

// When the kiosk arrived on the Welcome screen; null while a customer is on
// any other screen.
let welcomeSince = Date.now()
// A customer has left the Welcome screen since the app opened.
let usedSinceOpen = false

export function setOnWelcome(onWelcome) {
  if (!onWelcome) {
    welcomeSince = null
    usedSinceOpen = true
  } else {
    welcomeSince ??= Date.now()
  }
}

/** On the Welcome screen for at least a minute. */
export const isIdle = () => welcomeSince !== null && Date.now() - welcomeSince >= IDLE_AFTER_MS

export const isUsedSinceOpen = () => usedSinceOpen
