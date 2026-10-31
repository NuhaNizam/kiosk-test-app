import { useClock } from '@/hooks/useClock'
import { formatLongDate, formatTime } from '@/utils/formatDate'
import styles from './Clock.module.css'

export function Clock({ locale }) {
  const now = useClock()

  return (
    <div className={styles.clock}>
      <span className={styles.time}>{formatTime(now, locale)}</span>
      <span className={styles.date}>{formatLongDate(now, locale)}</span>
    </div>
  )
}
