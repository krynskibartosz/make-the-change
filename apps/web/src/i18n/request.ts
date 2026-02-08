import { defaultLocale, isLocale, type Locale } from '@make-the-change/core/i18n'
import en from '@make-the-change/core/locales/en.json'
import fr from '@make-the-change/core/locales/fr.json'
import { getRequestConfig } from 'next-intl/server'

const messagesByLocale = {
  en,
  fr,
  nl: en, // Use English as fallback for nl
}

export default getRequestConfig(async ({ requestLocale }) => {
  // Cette fonction sera appelée pour chaque requête
  let locale = await requestLocale

  // Assurer que la locale est supportée
  if (!locale || !isLocale(locale)) {
    locale = defaultLocale
  }

  return {
    locale,
    messages: messagesByLocale[locale as Locale],
  }
})
