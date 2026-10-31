import { useState } from 'react'
import { Button } from '@/components/common/Button'
import { KIOSK_CONFIG, LANGUAGES, WELCOME_TEXT } from '@/config/kiosk.config'
import { TestPrintButton } from '@/features/printing'
import { Clock } from './components/Clock'
import { LanguageSelector } from './components/LanguageSelector'
import styles from './WelcomeScreen.module.css'

export function WelcomeScreen({ onStart }) {
  const [language, setLanguage] = useState(KIOSK_CONFIG.defaultLanguage)
  const text = WELCOME_TEXT[language]

  return (
    <section className={styles.screen}>
      <header className={styles.header}>
        <span className={styles.brand}>{KIOSK_CONFIG.brandName}</span>
        <Clock locale={language} />
      </header>

      <div className={styles.hero}>
        <h1 className={styles.greeting}>{text.greeting}</h1>
        <p className={styles.tagline}>{KIOSK_CONFIG.tagline}</p>

        <Button size="lg" className={styles.cta} onClick={() => onStart(language)}>
          {text.cta}
        </Button>
        <p className={styles.hint}>{text.hint}</p>
      </div>

      <footer className={styles.footer}>
        <LanguageSelector languages={LANGUAGES} value={language} onChange={setLanguage} />
        <TestPrintButton />
      </footer>
    </section>
  )
}
