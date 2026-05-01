import type { getTranslations } from 'next-intl/server'
import type { FaqItemConfig, FaqViewModel } from './faq.types'

const FAQ_ITEM_CONFIG = [
  { id: '01', key: 'points' },
  { id: '02', key: 'tracking' },
  { id: '03', key: 'payment' },
  { id: '04', key: 'profile' },
] as const

export const buildFaqViewModel = async (
  t: Awaited<ReturnType<typeof getTranslations>>,
): Promise<FaqViewModel> => {
  const items: FaqItemConfig[] = FAQ_ITEM_CONFIG.map((config) => ({
    id: config.id,
    category: t(`items.${config.key}.category`),
    q: t(`items.${config.key}.question`),
    a: t(`items.${config.key}.answer`),
  }))

  return {
    badge: t('badge'),
    title: t('title'),
    description: t('description'),
    footerTitle: 'Toujours bloqué\u00a0?',
    footerDescription: 'Notre équipe est là pour vous aider personnellement.',
    footerCta: 'Nous écrire',
    items,
  }
}
