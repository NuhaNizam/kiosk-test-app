import { formatPrice } from '@/utils/formatPrice'
import styles from './MenuTile.module.css'

export function MenuTile({ item, onSelect }) {
  return (
    <button type="button" className={styles.tile} onClick={() => onSelect?.(item)}>
      <span className={styles.image} aria-hidden="true">
        {item.image}
      </span>
      <span className={styles.body}>
        <span className={styles.name}>{item.name}</span>
        <span className={styles.description}>{item.description}</span>
        <span className={styles.price}>{formatPrice(item.price)}</span>
      </span>
    </button>
  )
}
