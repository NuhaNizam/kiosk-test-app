import { KIOSK_CONFIG } from '@/config/kiosk.config'
import { formatLongDate, formatTime } from '@/utils/formatDate'
import styles from './TestReceipt.module.css'

const SAMPLE_ITEMS = [
  { name: 'Sample item A', qty: 1, price: 4.5 },
  { name: 'Sample item B', qty: 2, price: 2.25 },
  { name: 'Item with a long name to test wrapping', qty: 1, price: 10 },
]

const money = (value) => value.toFixed(2)

export function TestReceipt({ printedAt }) {
  const total = SAMPLE_ITEMS.reduce((sum, item) => sum + item.qty * item.price, 0)

  return (
    <article className={styles.receipt}>
      <h1 className={styles.title}>PRINTER TEST</h1>
      <p className={styles.center}>{KIOSK_CONFIG.brandName}</p>
      <p className={styles.center}>
        {formatLongDate(printedAt)} {formatTime(printedAt)}
      </p>

      <hr className={styles.rule} />

      <p className={styles.left}>Left aligned</p>
      <p className={styles.center}>Centre aligned</p>
      <p className={styles.right}>Right aligned</p>

      <hr className={styles.rule} />

      <p className={styles.small}>Small text</p>
      <p>Normal text</p>
      <p className={styles.bold}>Bold text</p>
      <p className={styles.large}>Large text</p>

      <hr className={styles.rule} />

      <p className={styles.chars}>ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
      <p className={styles.chars}>abcdefghijklmnopqrstuvwxyz</p>
      <p className={styles.chars}>0123456789 !@#$%&amp;*()-+=/?</p>

      <hr className={styles.rule} />

      <table className={styles.items}>
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {SAMPLE_ITEMS.map((item) => (
            <tr key={item.name}>
              <td>{item.name}</td>
              <td>{item.qty}</td>
              <td>{money(item.qty * item.price)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={2}>TOTAL</td>
            <td>{money(total)}</td>
          </tr>
        </tfoot>
      </table>

      <hr className={styles.rule} />

      {/* Solid bar: shows print darkness and whether the full width is printable */}
      <div className={styles.bar} />

      <p className={styles.center}>If you can read this, printing works.</p>
      <p className={`${styles.center} ${styles.bold}`}>*** END OF TEST ***</p>
    </article>
  )
}
