import type { Locale } from '@make-the-change/core/i18n'
import { defaultLocale, isLocale } from '@make-the-change/core/i18n'
import { Button } from '@make-the-change/core/ui'
import { ArrowDown, ArrowRight, Sparkles } from 'lucide-react'
import type { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import { Logo } from '@/components/ui/logo'
import { PageHero } from '@/components/ui/page-hero'
import { Link } from '@/i18n/navigation'
import { buildPartnerDashboardUrl } from '@/lib/partner-app-url'
import { getLocalizedContent } from '@/lib/utils'
import { MarketingCtaBand } from '../_features/marketing-cta-band'
import { DiversityFactLoader } from './_features/diversity-fact-loader'
import { getHomeServerData } from './_features/home.server-data'
import { buildHomeViewModel, type HomeViewModelLabels } from './_features/home.view-model'
import { HomeBlogSection } from './_features/home-blog-section'
import { HomeFeaturedProductsSection } from './_features/home-featured-products-section'
import { HomeFeaturedProjectsSection } from './_features/home-featured-projects-section'
import { HomePartnersSection } from './_features/home-partners-section'
import { HomeSectionEmptyState } from './_features/home-section-empty-state'
import { HomeStatsSection } from './_features/home-stats-section'
import { HomeUniverseSection } from './_features/home-universe-section'
import { MarketingStepsSection } from './_features/marketing-steps-section'

type MarketingStepPlaceholderImages = {
  projects: string[]
}

const marketingStepPlaceholderImages = {
  projects: [
    'https://images.unsplash.com/photo-1551888192-3cf5d6a5e1c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1571019613454-1cb2f5b3d5b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1558628042-1c5a1e9c5b8?w=800&h=600&fit=crop',
  ],
} satisfies MarketingStepPlaceholderImages

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
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://make-the-change-web-client.vercel.app'

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
  const t = await getTranslations('home')
  const localeValue = await getLocale()
  const locale: Locale = isLocale(localeValue) ? localeValue : defaultLocale
  const {
    user,
    homeContent,
    activeProjectsState,
    activeProductsState,
    membersCountState,
    pointsGeneratedState,
    featuredProjectsState,
    featuredProductsState,
    activeProducersState,
    blogPostsState,
  } = await getHomeServerData()

  const partnerAppBaseUrl =
    process.env.NEXT_PUBLIC_PARTNER_APP_BASE_URL || process.env.NEXT_PUBLIC_ADMIN_URL
  const partnerDashboardUrl = buildPartnerDashboardUrl(partnerAppBaseUrl, locale)

  const cmsContent = homeContent.data
  const localizedCmsContent = locale === defaultLocale ? cmsContent : null
  const universeCards = cmsContent?.universe.cards
  const partnerDashboardHref = partnerDashboardUrl ?? null

  const labels = {
    heroInvestCta: t('steps.invest.title'),
    heroRegisterCta: t('cta.button'),
    heroProjectsStat: t('stats.projects'),
    heroMembersStat: t('stats.members'),
    statsActiveProjects: t('stats_section.active_projects'),
    statsEngagedMembers: t('stats_section.engaged_members'),
    statsEthicalProducts: t('stats_section.ethical_products'),
    statsPointsGenerated: t('stats_section.points_generated'),
    primaryCtaAuthed: t('hero.cta_primary'),
    primaryCtaGuest: t('cta.button'),
  } satisfies HomeViewModelLabels

  const {
    heroContextualCta,
    heroStats,
    statsItems,
    featuredProjectsVisible,
    partnersVariant,
    blogVariant,
    ctaSectionClassName,
    primaryCta,
  } = buildHomeViewModel({
    user,
    activeProjectsState,
    activeProductsState,
    membersCountState,
    pointsGeneratedState,
    featuredProjectsState,
    featuredProductsState,
    activeProducersState,
    blogPostsState,
    labels,
  })

  const ctaFooterItems = [
    localizedCmsContent?.cta.stats.engagement ?? t('cta.stats.engagement'),
    localizedCmsContent?.cta.stats.transparency ?? t('cta.stats.transparency'),
    localizedCmsContent?.cta.stats.community ?? t('cta.stats.community'),
  ]
  const projectsUniverseCard = {
    ...(universeCards?.projects.image !== undefined ? { image: universeCards.projects.image } : {}),
    badge: localizedCmsContent?.universe.cards.projects.badge ?? t('universe.cards.projects.badge'),
    title: localizedCmsContent?.universe.cards.projects.title ?? t('universe.cards.projects.title'),
    description:
      localizedCmsContent?.universe.cards.projects.description ??
      t('universe.cards.projects.description'),
    cta: localizedCmsContent?.universe.cards.projects.cta ?? t('universe.cards.projects.cta'),
  }
  const productsUniverseCard = {
    ...(universeCards?.products.image !== undefined ? { image: universeCards.products.image } : {}),
    badge: localizedCmsContent?.universe.cards.products.badge ?? t('universe.cards.products.badge'),
    title: localizedCmsContent?.universe.cards.products.title ?? t('universe.cards.products.title'),
    description:
      localizedCmsContent?.universe.cards.products.description ??
      t('universe.cards.products.description'),
    cta: localizedCmsContent?.universe.cards.products.cta ?? t('universe.cards.products.cta'),
  }

  return (
    <>
      <div className="absolute left-0 right-0 top-4 z-50 flex justify-center md:hidden">
        <Link href="/" className="flex items-center gap-2">
          <Logo variant="icon" width={32} height={32} className="h-8 w-8" />
          <span className="text-lg font-bold">Make the Change</span>
        </Link>
      </div>

      <PageHero.Layout
        size="lg"
        variant="gradient"
        className="relative flex min-h-dvh flex-col justify-center pt-32 md:pt-44"
      >
        <PageHero.Badge>
          <span className="inline-flex items-center gap-2 px-1 py-1">
            <Sparkles className="h-3.5 w-3.5 animate-pulse text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              {localizedCmsContent?.hero.badge ?? t('hero.badge')}
            </span>
          </span>
        </PageHero.Badge>

        <PageHero.Title>{localizedCmsContent?.hero.title ?? t('hero.title')}</PageHero.Title>
        <PageHero.Description>
          {localizedCmsContent?.hero.subtitle ?? t('hero.subtitle')}
        </PageHero.Description>

        <PageHero.Content>
          <PageHero.Actions>
            <PageHero.CTA>
              <Link href={heroContextualCta.href} className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="h-14 w-full rounded-2xl px-8 text-sm font-black uppercase tracking-widest sm:w-auto"
                >
                  {heroContextualCta.label}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </PageHero.CTA>
          </PageHero.Actions>

          {heroStats.length > 0 ? (
            <ul className="m-0 flex list-none flex-wrap justify-center gap-4 p-0 pt-4">
              {heroStats.map((heroStat) => (
                <li key={heroStat.key}>
                  <Link href={heroStat.href}>
                    <span className="flex items-center gap-2 rounded-2xl border border-marketing-overlay-light/10 bg-background/40 px-4 py-2 shadow-sm backdrop-blur-md">
                      <heroStat.icon className="h-4 w-4 text-primary" />
                      <span className="text-xs font-bold uppercase tracking-tight">
                        {heroStat.value} {heroStat.label}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}

          <DiversityFactLoader />

          <div className="mx-auto mt-16 flex h-12 w-12 cursor-pointer animate-bounce items-center justify-center rounded-full border border-primary/20 bg-primary/10 backdrop-blur-sm">
            <ArrowDown className="h-6 w-6 text-primary" />
          </div>
        </PageHero.Content>
      </PageHero.Layout>

      <HomeUniverseSection
        title={localizedCmsContent?.universe.title ?? t('universe.title')}
        description={localizedCmsContent?.universe.description ?? t('universe.description')}
        projects={projectsUniverseCard}
        products={productsUniverseCard}
        community={{
          title:
            localizedCmsContent?.universe.cards.community.title ??
            t('universe.cards.community.title'),
          description:
            localizedCmsContent?.universe.cards.community.description ??
            t('universe.cards.community.description'),
          cta:
            localizedCmsContent?.universe.cards.community.cta ?? t('universe.cards.community.cta'),
        }}
        variant="default"
      />

      {statsItems.length > 0 ? (
        <HomeStatsSection title={t('stats_section.title')} stats={statsItems} variant="muted" />
      ) : null}

      <MarketingStepsSection variant="default" placeholderImages={marketingStepPlaceholderImages} />

      {featuredProjectsState.status === 'ready' ? (
        <HomeFeaturedProjectsSection
          title={t('featured_projects')}
          viewAllLabel={t('view_all_projects')}
          fundedLabel={t('project_card.funded')}
          activeLabel={t('project_card.active')}
          projects={featuredProjectsState.value.map((project) => ({
            ...project,
            name_default: getLocalizedContent(
              project.name_i18n,
              locale,
              project.name_default || '',
            ),
            description_default: getLocalizedContent(
              project.description_i18n,
              locale,
              project.description_default || '',
            ),
          }))}
          variant="muted"
        />
      ) : featuredProjectsState.status === 'empty' ? (
        <HomeSectionEmptyState
          title={t('empty.featured_projects.title')}
          description={t('empty.featured_projects.description')}
          primaryCtaLabel={t('empty.featured_projects.cta')}
          primaryCtaHref="/projects"
          variant="muted"
        />
      ) : null}

      {featuredProductsState.status === 'ready' ? (
        <HomeFeaturedProductsSection
          title={t('featured_products')}
          viewAllLabel={t('view_all_products')}
          products={featuredProductsState.value}
        />
      ) : featuredProductsState.status === 'empty' ? (
        <HomeSectionEmptyState
          title={t('empty.featured_products.title')}
          description={t('empty.featured_products.description')}
          primaryCtaLabel={t('empty.featured_products.cta')}
          primaryCtaHref="/products"
          variant={featuredProjectsVisible ? 'default' : 'muted'}
        />
      ) : null}

      {activeProducersState.status === 'ready' ? (
        <HomePartnersSection
          mode="carousel"
          producers={activeProducersState.value}
          variant={partnersVariant}
          title={t('partners.title')}
          description={t('partners.description')}
        />
      ) : activeProducersState.status === 'empty' ? (
        <HomePartnersSection
          mode="empty"
          producers={[]}
          variant={partnersVariant}
          emptyTitle={t('empty.partners.title')}
          emptyDescription={t('empty.partners.description')}
          primaryCtaLabel={t('empty.partners.cta_primary')}
          primaryCtaHref="/contact"
          {...(partnerDashboardHref
            ? { secondaryCtaLabel: t('empty.partners.cta_secondary') }
            : {})}
          {...(partnerDashboardHref ? { secondaryCtaHref: partnerDashboardHref } : {})}
        />
      ) : null}

      {blogPostsState.status === 'ready' ? (
        <HomeBlogSection
          title={localizedCmsContent?.blog?.title ?? t('blog_section.title')}
          viewAllLabel={t('blog_section.view_all')}
          posts={blogPostsState.value.map((post) => ({
            ...post,
            title: getLocalizedContent(post.titleI18n, locale, post.title),
            excerpt: getLocalizedContent(post.excerptI18n, locale, post.excerpt),
          }))}
          variant={blogVariant}
        />
      ) : blogPostsState.status === 'empty' ? (
        <HomeSectionEmptyState
          title={t('empty.blog.title')}
          description={t('empty.blog.description')}
          primaryCtaLabel={t('empty.blog.cta')}
          primaryCtaHref="/blog"
          variant={blogVariant}
        />
      ) : null}

      <section className={ctaSectionClassName}>
        <div className="container mx-auto px-4">
          <MarketingCtaBand
            title={localizedCmsContent?.cta.title ?? t('cta.title')}
            description={localizedCmsContent?.cta.description ?? t('cta.description')}
            primaryAction={
              <Link
                href={primaryCta.href}
                className="inline-flex h-16 w-full items-center justify-center rounded-2xl bg-primary px-12 text-lg font-black uppercase tracking-widest text-primary-foreground shadow-2xl shadow-primary/40 transition-transform hover:scale-105 sm:w-auto"
              >
                {primaryCta.label}
                <ArrowRight className="ml-3 h-5 w-5" />
              </Link>
            }
            secondaryAction={
              <Link
                href="/about"
                className="inline-flex h-16 w-full items-center justify-center rounded-2xl border-2 border-marketing-overlay-light/10 px-12 text-lg font-black uppercase tracking-widest transition-all hover:bg-marketing-overlay-light/5 sm:w-auto"
              >
                {localizedCmsContent?.hero.cta_secondary ?? t('hero.cta_secondary')}
              </Link>
            }
            footer={
              <ul className="m-0 flex list-none flex-wrap items-center justify-center gap-8 p-0 opacity-40 md:gap-16">
                {ctaFooterItems.map((footerItem) => (
                  <li key={footerItem} className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
                      {footerItem}
                    </span>
                  </li>
                ))}
              </ul>
            }
          />
        </div>
      </section>
    </>
  )
}

export default HomePage
