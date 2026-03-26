import type { Locale } from '@make-the-change/core/i18n'
import { defaultLocale, isLocale } from '@make-the-change/core/i18n'
import { Button } from '@make-the-change/core/ui'
import type { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import { HomeEcosystemSection } from '@/app/[locale]/(marketing)/(home)/_features/home-ecosystem-section'
import { HomeFaqSection } from '@/app/[locale]/(marketing)/(home)/_features/home-faq-section'
import { HomeFinalCtaSection } from '@/app/[locale]/(marketing)/(home)/_features/home-final-cta-section'
import { HomeFeaturedProductsSection } from '@/app/[locale]/(marketing)/(home)/_features/home-featured-products-section'
import { HomeFeaturedProjectsSection } from '@/app/[locale]/(marketing)/(home)/_features/home-featured-projects-section'
import { HomeGamificationSection } from '@/app/[locale]/(marketing)/(home)/_features/home-gamification-section'
import { HomeHeroContent } from '@/app/[locale]/(marketing)/(home)/_features/home-hero-content'
import { HomeReveal } from '@/app/[locale]/(marketing)/(home)/_features/home-reveal'
import { MarketingStepsSection } from '@/app/[locale]/(marketing)/(home)/_features/marketing-steps-section'
import { Logo } from '@/components/ui/logo'
import { Link } from '@/i18n/navigation'
import { getPublicAppUrl } from '@/lib/public-url'
import { getLocalizedContent } from '@/lib/utils'
import { getHomeServerData } from './_features/home.server-data'
import { HeroParallaxBackground } from './_features/hero-parallax-background'

const HERO_VIDEO_URL = '/videos/home-header.mp4'
const HERO_POSTER_URL = '/images/home-header-poster.jpeg'

const toLocaleForOpenGraph = (locale: string) => {
  if (locale === 'fr') return 'fr_FR'
  if (locale === 'nl') return 'nl_NL'
  return 'en_US'
}

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> => {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata' })
  const baseUrl = getPublicAppUrl()

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      type: 'website',
      siteName: 'Make the Change',
      locale: toLocaleForOpenGraph(locale),
      url: `${baseUrl}/${locale}`,
    },
    twitter: {
      card: 'summary_large_image',
    },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        fr: `${baseUrl}/fr`,
        en: `${baseUrl}/en`,
        nl: `${baseUrl}/nl`,
      },
    },
  }
}

const HomePage = async () => {
  const t = await getTranslations('home_v2')
  const localeValue = await getLocale()
  const locale: Locale = isLocale(localeValue) ? localeValue : defaultLocale
  const { featuredProjectsState, featuredProductsState, activeProducersState } =
    await getHomeServerData()

  return (
    <>
      <section className="relative flex min-h-[100svh] flex-col px-6 pb-32 pt-12 overflow-hidden bg-black">
        <HeroParallaxBackground videoUrl={HERO_VIDEO_URL} posterUrl={HERO_POSTER_URL} />
        <div
          className="absolute inset-0 bg-gradient-to-t from-background via-background/90 via-30% to-transparent dark:from-background dark:via-background/60 dark:to-transparent"
          aria-hidden="true"
        />

        <div className="absolute left-6 top-12 z-20">
          <Link href="/" className="inline-flex items-center gap-2">
            <Logo variant="icon" width={34} height={34} className="h-8 w-8" />
            <span className="text-lg font-bold tracking-tight text-white drop-shadow-md">Make the Change</span>
          </Link>
        </div>

        <HomeHeroContent 
          title={t('hero.title')} 
          subtitle={t('hero.subtitle')} 
          cta={t('hero.cta')} 
        />
      </section>

      <HomeReveal>
        <MarketingStepsSection variant="default" />
      </HomeReveal>

      {featuredProjectsState.status === 'ready' ? (
        <HomeReveal>
          <HomeFeaturedProjectsSection
            title={t('projects.title')}
            viewAllLabel={t('projects.view_all')}
            supportLabel={t('projects.support_cta')}
            collectedLabel={t('projects.collected_suffix')}
            goalLabel={t('projects.goal_prefix')}
            projects={featuredProjectsState.value.map((project) => ({
              ...project,
              name_default: getLocalizedContent(project.name_i18n, locale, project.name_default || ''),
              description_default: getLocalizedContent(
                project.description_i18n,
                locale,
                project.description_default || '',
              ),
            }))}
            variant="default"
          />
        </HomeReveal>
      ) : null}

      {featuredProductsState.status === 'ready' ? (
        <HomeReveal>
          <HomeFeaturedProductsSection
            title={t('shop.title')}
            viewAllLabel={t('shop.view_all')}
            discoverLabel={t('shop.discover')}
            pointsLabel={t('shop.points_label')}
            products={featuredProductsState.value.map((product) => ({
              ...product,
              name_default: getLocalizedContent(product.name_i18n, locale, product.name_default || ''),
            }))}
            variant="muted"
          />
        </HomeReveal>
      ) : null}

      <HomeReveal>
        <HomeGamificationSection variant="default" />
      </HomeReveal>

      <HomeReveal>
        <HomeEcosystemSection
          producers={activeProducersState.status === 'ready' ? activeProducersState.value : []}
          variant="muted"
        />
      </HomeReveal>

      <HomeReveal>
        <HomeFaqSection variant="default" />
      </HomeReveal>

      <HomeReveal>
        <HomeFinalCtaSection variant="default" />
      </HomeReveal>
    </>
  )
}

export default HomePage
