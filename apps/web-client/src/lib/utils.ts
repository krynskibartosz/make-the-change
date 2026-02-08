export { cn } from '@make-the-change/core/shared/utils'

export const formatPoints = (points: number): string => {
  return new Intl.NumberFormat('fr-FR').format(points)
}

export const formatCurrency = (amount: number, currency = 'EUR'): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
  }).format(amount)
}

export const formatDate = (date: string | Date, locale = 'fr-FR'): string => {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export const formatPercentage = (value: number): string => {
  return `${Math.round(value * 100)}%`
}
