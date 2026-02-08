import { defaultLocale, isLocale, type Locale } from '@make-the-change/core/i18n'
import en from '@make-the-change/core/locales/en.json'
import fr from '@make-the-change/core/locales/fr.json'
import nl from '@make-the-change/core/locales/nl.json'
import type { AbstractIntlMessages } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'

const messagesByLocale: Record<Locale, AbstractIntlMessages> = {
  en: en as AbstractIntlMessages,
  fr: fr as AbstractIntlMessages,
  nl: nl as AbstractIntlMessages,
}

export default getRequestConfig(async ({ requestLocale }) => {
  // Cette fonction sera appelée pour chaque requête
  const requested = await requestLocale
  const locale: Locale = requested && isLocale(requested) ? requested : defaultLocale

  return {
    locale,
    messages: messagesByLocale[locale],
  }
})
