// Central place for kiosk branding and behaviour.
// Change these values per deployment instead of editing components.
export const KIOSK_CONFIG = {
  brandName: 'Self-Service Kiosk',
  tagline: 'Fast, easy self-service ordering',
  defaultLanguage: 'en',
  currency: 'USD',
}

export const LANGUAGES = [
  { code: 'en', label: 'English' }
]

export const WELCOME_TEXT = {
  en: { greeting: 'Welcome', cta: 'Touch to start', hint: 'Tap the button to begin your order' }
}
