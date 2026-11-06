import styles from './KioskLayout.module.css'

// Full-viewport shell shared by every kiosk screen.
export function KioskLayout({ children }) {
  return <main className={styles.layout}>{children}</main>
}
