import { Button } from '@/components/common/Button'
import { KIOSK_CONFIG } from '@/config/kiosk.config'
import { MENU_ITEMS } from '@/data/sampleMenu'
import { MenuTile } from './components/MenuTile'
import styles from './MenuScreen.module.css'

export function MenuScreen({ onBack }) {
  return (
    <section className={styles.screen}>
      <header className={styles.header}>
        <Button variant="ghost" onClick={onBack}>
          ← Back
        </Button>
        <span className={styles.brand}>{KIOSK_CONFIG.brandName}</span>
      </header>

      <h1 className={styles.title}>What would you like?</h1>

      <div className={styles.grid}>
        {MENU_ITEMS.map((item) => (
          <MenuTile key={item.id} item={item} />
        ))}
      </div>
    </section>
  )
}
