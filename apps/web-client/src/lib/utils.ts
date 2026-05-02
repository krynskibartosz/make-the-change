import { isRecord } from '@/lib/type-guards'
import { parseIsoDate } from '@/lib/date-utils'

export { cn } from '@make-the-change/core/shared/utils'

export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  return keys.reduce(
    (acc, key) => {
      if (key in obj) {
        acc[key] = obj[key]
      }
      return acc
    },
    {} as Pick<T, K>,
  )
}

export function formatPoints(points: number): string {
  return new Intl.NumberFormat('fr-FR').format(points)
}

export function formatCurrency(amount: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatDate(date: string | Date, locale = 'fr-FR'): string {
  const timestamp = date instanceof Date ? date.getTime() : parseIsoDate(date as string)
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(timestamp)
}

export function getLocalizedContent(content: unknown, locale: string, fallback = ''): string {
  if (!isRecord(content)) return fallback

  const localValue = content[locale]
  if (typeof localValue === 'string') {
    return localValue
  }

  const frenchValue = content['fr']
  if (typeof frenchValue === 'string') {
    return frenchValue
  }

  const englishValue = content['en']
  if (typeof englishValue === 'string') {
    return englishValue
  }

  return fallback
}
