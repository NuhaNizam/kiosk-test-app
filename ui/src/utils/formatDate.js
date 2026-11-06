export function formatTime(date, locale = 'en') {
  return date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
}

export function formatLongDate(date, locale = 'en') {
  return date.toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
