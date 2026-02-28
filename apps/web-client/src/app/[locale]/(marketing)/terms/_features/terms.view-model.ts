import type { getTranslations } from 'next-intl/server'
import type { TermsViewModel } from './terms.types'

export const buildTermsViewModel = async (
  t: Awaited<ReturnType<typeof getTranslations>>,
): Promise<TermsViewModel> => {
  const titleLine1 = t('hero.title_line1')
  const titleHighlight = t('hero.title_highlight')

  return {
    hero: {
      badge: t('badge'),
      title: [titleLine1, titleHighlight].filter(Boolean).join(' ').trim(),
      description: t('hero.description'),
    },
    content: {
      acceptance: {
        title: t('sections.acceptance.title'),
        content: t('sections.acceptance.body'),
      },
      evolution: {
        title: t('sections.evolution.title'),
        content: t('sections.evolution.body'),
      },
      contact: {
        title: t('sections.contact.title'),
        content: t('sections.contact.body'),
        cta: t('sections.contact.cta'),
      },
    },
  }
}
