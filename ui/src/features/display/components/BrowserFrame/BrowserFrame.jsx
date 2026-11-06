import styles from './BrowserFrame.module.css'

const FAVICON = `${import.meta.env.BASE_URL}favicon.svg`

// In Electron the window has no title bar (see app/main.js), so this
// draws a Chrome-like tab strip and address bar around the Welcome screen.
// In a real browser it renders nothing extra: the browser has its own.
const isElectron = () => typeof window.kiosk !== 'undefined'

function currentAddress() {
  const { protocol, host, pathname } = window.location
  return protocol.startsWith('http') ? `${host}${pathname === '/' ? '' : pathname}` : 'kiosk'
}

export function BrowserFrame({ children }) {
  if (!isElectron()) return children

  return (
    <div className={styles.frame}>
      {/* Drag area; the window buttons are drawn by Windows on the right. */}
      <div className={styles.tabStrip}>
        <div className={styles.tab}>
          <img className={styles.favicon} src={FAVICON} alt="" />
          <span className={styles.tabTitle}>{document.title}</span>
          <span className={styles.tabClose} aria-hidden="true">
            ×
          </span>
        </div>
        <span className={styles.newTab} aria-hidden="true">
          +
        </span>
      </div>

      <div className={styles.toolbar}>
        <button className={styles.navButton} disabled aria-label="Back">
          ←
        </button>
        <button className={styles.navButton} disabled aria-label="Forward">
          →
        </button>
        <button
          className={styles.navButton}
          aria-label="Reload"
          onClick={() => window.location.reload()}
        >
          ↻
        </button>
        <div className={styles.omnibox}>
          <span className={styles.siteInfo} aria-hidden="true">
            ⓘ
          </span>
          <span className={styles.address}>{currentAddress()}</span>
        </div>
      </div>

      <div className={styles.content}>{children}</div>
    </div>
  )
}
