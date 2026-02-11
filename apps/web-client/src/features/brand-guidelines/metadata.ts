import { defaultLocale, isLocale, type Locale } from '@make-the-change/core/i18n'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { type BrandGuidelinePageSlug, getBrandGuidelinePath } from './config'

const METADATA_KEY_BY_SLUG: Record<BrandGuidelinePageSlug, string> = {
  overview: 'overview',
  logo: 'logo',
  colors: 'colors',
  typography: 'typography',
  voice: 'voice',
  assets: 'assets',
}

export const resolveGuidelineLocale = (locale: string): Locale => {
  return isLocale(locale) ? locale : defaultLocale
}

export async function getBrandGuidelineMetadata(
  locale: Locale,
  slug: BrandGuidelinePageSlug,
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'brand_guidelines.metadata' })
  const metadataKey = METADATA_KEY_BY_SLUG[slug]

  return {
    title: `Brand Guidelines | ${t(`${metadataKey}.title`)} | Make the Change`,
    description: t(`${metadataKey}.description`),
    alternates: {
      canonical: getBrandGuidelinePath(slug),
    },
  }
}
