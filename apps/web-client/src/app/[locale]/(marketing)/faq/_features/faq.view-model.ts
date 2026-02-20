import type { getTranslations } from 'next-intl/server'
import type { FaqItemConfig, FaqViewModel } from './faq.types'

const FAQ_ITEM_CONFIG = [
  { id: '01', key: 'points', iconName: 'Zap', color: 'text-marketing-warning-500' },
  { id: '02', key: 'tracking', iconName: 'Globe', color: 'text-marketing-info-500' },
  { id: '03', key: 'payment', iconName: 'Sparkles', color: 'text-marketing-accent-alt-500' },
  { id: '04', key: 'profile', iconName: 'ShieldCheck', color: 'text-marketing-positive-500' },
] as const

export const buildFaqViewModel = async (
  t: Awaited<ReturnType<typeof getTranslations>>,
): Promise<FaqViewModel> => {
  const items: FaqItemConfig[] = FAQ_ITEM_CONFIG.map((config) => ({
    id: config.id,
    iconName: config.iconName,
    color: config.color,
    category: t(`items.${config.key}.category`),
    q: t(`items.${config.key}.question`),
    a: t(`items.${config.key}.answer`),
  }))

  return {
    badge: t('badge'),
    title: t('title'),
    description: t('description'),
    searchPlaceholder: t('search_placeholder'),
    emptyTitle: t('empty_title'),
    emptyDescription: t('empty_description'),
    footerPrompt: t('footer_prompt'),
    footerCta: t('footer_cta'),
    learnMore: t('learn_more'),
    items,
  }
}
