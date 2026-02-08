import { defaultLocale, locales } from '@make-the-change/core/i18n'
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  // Langues supportées
  locales: [...locales],

  // Langue par défaut
  defaultLocale,
})
