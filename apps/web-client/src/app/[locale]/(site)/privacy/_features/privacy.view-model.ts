import type { getTranslations } from 'next-intl/server'
import type { PrivacyViewModel } from './privacy.types'

export const buildPrivacyViewModel = async (
  t: Awaited<ReturnType<typeof getTranslations>>,
): Promise<PrivacyViewModel> => {
  return {
    hero: {
      badge: t('badge'),
      title: {
        line1: t('hero.title_line1'),
        highlight: t('hero.title_highlight'),
      },
      description: {
        line1: t('hero.description_line1'),
        line2: t('hero.description_line2'),
      },
    },
    cards: {
      minimalCollection: {
        title: t('cards.minimal_collection.title'),
        description: t('cards.minimal_collection.description'),
      },
      dataOwnership: {
        title: t('cards.data_ownership.title'),
        description: t('cards.data_ownership.description'),
        guarantee: t('cards.data_ownership.guarantee'),
      },
      security: {
        title: t('cards.security.title'),
        description: t('cards.security.description'),
      },
      contact: {
        title: t('cards.contact.title'),
        description: t('cards.contact.description'),
        cta: t('cards.contact.cta'),
      },
    },
  }
}
