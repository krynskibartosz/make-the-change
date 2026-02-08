export const locales = ['fr', 'en', 'nl'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'fr'

export const isLocale = (value: string): value is Locale => locales.includes(value as Locale)

export type Messages = typeof import('../../locales/en.json')
