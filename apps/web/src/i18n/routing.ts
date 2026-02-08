import { defaultLocale, locales } from '@make-the-change/core/i18n'
import { defineRouting } from 'next-intl/routing'

export { locales, defaultLocale }

export const routing = defineRouting({
  // Langues supportées
  locales: [...locales],

  // Langue par défaut
  defaultLocale,
})
