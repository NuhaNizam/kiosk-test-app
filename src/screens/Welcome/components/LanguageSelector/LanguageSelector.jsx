import { Button } from '@/components/common/Button'
import styles from './LanguageSelector.module.css'

export function LanguageSelector({ languages, value, onChange }) {
  return (
    <div className={styles.selector} role="group" aria-label="Choose language">
      {languages.map(({ code, label }) => (
        <Button
          key={code}
          variant="ghost"
          aria-pressed={code === value}
          onClick={() => onChange(code)}
        >
          {label}
        </Button>
      ))}
    </div>
  )
}
