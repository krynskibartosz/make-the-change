export { cn } from '@make-the-change/core/shared/utils'

export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  return keys.reduce((acc, key) => {
    if (key in obj) {
      acc[key] = obj[key]
    }
    return acc
  }, {} as Pick<T, K>)
}

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
