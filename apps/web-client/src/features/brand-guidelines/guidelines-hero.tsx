'use client'

import { ArrowRight, Box, MessageCircle, Palette, Type } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import {
  BRAND_GUIDELINE_NAV_ITEMS,
  BRAND_GUIDELINE_PAGE_THEMES,
  type BrandGuidelinePageSlug,
  resolveBrandGuidelineSlugFromPath,
} from './config'

function HeroIllustration({
  slug,
  accentClass,
}: {
  slug: BrandGuidelinePageSlug
  accentClass: string
}) {
  if (slug === 'overview') {
    return null
  }

  const iconMap = {
    logo: <img src="/adopt.svg" alt="Mascot" className="h-40 w-40 md:h-52 md:w-52" />,
    colors: <Palette className="h-40 w-40 md:h-52 md:w-52" />,
    typography: <Type className="h-40 w-40 md:h-52 md:w-52" />,
    voice: <MessageCircle className="h-40 w-40 md:h-52 md:w-52" />,
    assets: <Box className="h-40 w-40 md:h-52 md:w-52" />,
  } as const

  return (
    <div className="relative hidden h-[280px] lg:block">
      <div className="absolute right-10 top-0 h-52 w-52 rounded-full border-[8px] border-current/25" />
      <div className="absolute right-2 top-16 h-40 w-64 -rotate-12 rounded-full border-4 border-current/25" />
      <div className={cn('absolute bottom-4 right-16', accentClass)}>{iconMap[slug]}</div>
    </div>
  )
}

export function GuidelinesHero() {
  const pathname = usePathname()
  const activeSlug = resolveBrandGuidelineSlugFromPath(pathname)
  const theme = BRAND_GUIDELINE_PAGE_THEMES[activeSlug]
  const isOverview = activeSlug === 'overview'

  const t = useTranslations('brand_guidelines')
  const tNav = useTranslations('brand_guidelines.nav')
  const tUi = useTranslations('brand_guidelines.ui')
  const tLogo = useTranslations('brand_guidelines.logo')
  const tColors = useTranslations('brand_guidelines.colors')
  const tTypography = useTranslations('brand_guidelines.typography')
  const tVoice = useTranslations('brand_guidelines.voice')
  const tAssets = useTranslations('brand_guidelines.assets')

  const heroContentBySlug = {
    overview: {
      eyebrow: t('badge'),
      title: t('title'),
      description: t('subtitle'),
    },
    logo: {
      eyebrow: tNav('logo'),
      title: tLogo('title'),
      description: tLogo('intro'),
    },
    colors: {
      eyebrow: tNav('colors'),
      title: tColors('title'),
      description: tColors('intro'),
    },
    typography: {
      eyebrow: tNav('typography'),
      title: tTypography('title'),
      description: tTypography('intro'),
    },
    voice: {
      eyebrow: tNav('voice'),
      title: tVoice('title'),
      description: tVoice('intro'),
    },
    assets: {
      eyebrow: tNav('assets'),
      title: tAssets('title'),
      description: tAssets('intro'),
    },
  } as const

  const hero = heroContentBySlug[activeSlug]
  const quickLinks = BRAND_GUIDELINE_NAV_ITEMS.filter((item) => item.slug !== activeSlug).slice(
    0,
    4,
  )

  return (
    <section
      className={cn('relative isolate overflow-hidden border-b border-border/40', theme.heroClass)}
    >
      <div className="pointer-events-none absolute inset-0 opacity-25">
        <div className="absolute -left-20 top-20 h-56 w-56 rounded-full border-[8px] border-current" />
        <div className="absolute -right-16 top-8 h-72 w-72 rounded-full border-[8px] border-current" />
      </div>

      <div
        className={cn(
          'relative mx-auto max-w-[1360px] gap-8 px-4 py-9 md:py-16',
          isOverview
            ? 'grid lg:grid-cols-[1.2fr_0.8fr] lg:items-end'
            : 'grid lg:grid-cols-[1fr_420px] lg:items-center',
        )}
      >
        <div>
          <p
            className={cn(
              'text-[11px] font-black uppercase tracking-[0.22em] md:text-sm',
              theme.headingClass,
            )}
          >
            {hero.eyebrow}
          </p>
          <h1
            className={cn(
              'mt-3 max-w-4xl text-[2.25rem] font-black leading-[0.95] tracking-tight md:mt-4 md:text-6xl lg:leading-[0.95]',
              theme.headingClass,
            )}
          >
            {hero.title}
          </h1>
          <p
            className={cn(
              'mt-3 max-w-3xl text-base leading-relaxed md:mt-4 md:text-xl',
              theme.paragraphClass,
            )}
          >
            {hero.description}
          </p>
          <p
            className={cn(
              'mt-5 text-[10px] font-black uppercase tracking-[0.22em] md:text-[11px]',
              theme.paragraphClass,
            )}
          >
            {t('last_updated')}
          </p>
        </div>

        {isOverview ? (
          <aside>
            <p
              className={cn(
                'mb-3 text-[11px] font-black uppercase tracking-[0.2em] md:text-xs',
                theme.headingClass,
              )}
            >
              {tUi('quick_links')}
            </p>
            <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 lg:grid-cols-1">
              {quickLinks.map((link) => (
                <Link
                  key={link.slug}
                  href={link.href}
                  className={cn(
                    'group flex min-h-11 items-center justify-between rounded-2xl border px-3 py-2.5 text-sm font-bold',
                    theme.quickLinkClass,
                    theme.quickLinkHoverClass,
                  )}
                >
                  <span>{tNav(link.labelKey)}</span>
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </aside>
        ) : (
          <HeroIllustration slug={activeSlug} accentClass={theme.accentClass} />
        )}
      </div>
    </section>
  )
}
