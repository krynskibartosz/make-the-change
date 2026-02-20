import type { getTranslations } from 'next-intl/server'
import type { PricingViewModel } from './pricing.types'

export const buildPricingViewModel = async (
  t: Awaited<ReturnType<typeof getTranslations>>,
): Promise<PricingViewModel> => {
  return {
    hero: {
      title: t('title'),
      subtitle: t('subtitle'),
    },
    tiers: {
      sectionTitle: t('tiers.title'),
      explorer: {
        title: t('tiers.explorer.title'),
        price: t('tiers.explorer.price'),
        perMonth: t('tiers.per_month'),
        description: t('tiers.explorer.description'),
        features: [
          t('tiers.explorer.features.access_projects'),
          t('tiers.explorer.features.realtime_tracking'),
          t('tiers.explorer.features.monthly_newsletter'),
        ],
        cta: t('tiers.explorer.cta'),
      },
      protector: {
        badge: t('tiers.protector.badge'),
        title: t('tiers.protector.title'),
        price: t('tiers.protector.price'),
        perMonth: t('tiers.per_month'),
        description: t('tiers.protector.description'),
        features: [
          t('tiers.protector.features.all_explorer'),
          t('tiers.protector.features.points_bonus'),
          t('tiers.protector.features.investment_certificate'),
          t('tiers.protector.features.priority_access'),
        ],
        cta: t('tiers.protector.cta'),
      },
      ambassador: {
        title: t('tiers.ambassador.title'),
        price: t('tiers.ambassador.price'),
        perMonth: t('tiers.per_month'),
        description: t('tiers.ambassador.description'),
        features: [
          t('tiers.ambassador.features.all_protector'),
          t('tiers.ambassador.features.monthly_points'),
          t('tiers.ambassador.features.events'),
          t('tiers.ambassador.features.vip_support'),
        ],
        cta: t('tiers.ambassador.cta'),
      },
    },
  }
}
