import { KIOSK_CONFIG } from '@/config/kiosk.config'

export function formatPrice(amount, locale = 'en') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: KIOSK_CONFIG.currency,
  }).format(amount)
}
