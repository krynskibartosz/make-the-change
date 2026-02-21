import type { Locale } from '@make-the-change/core/i18n'
import { defaultLocale, isLocale } from '@make-the-change/core/i18n'
import { ArrowRight } from 'lucide-react'
import { getLocale, getTranslations } from 'next-intl/server'
import { MarketingCtaBand } from '@/app/[locale]/(marketing)/_features/marketing-cta-band'
import { getHomeServerData } from '@/app/[locale]/(marketing)/(home)/_features/home.server-data'
import {
  buildHomeViewModel,
  type HomeViewModelLabels,
} from '@/app/[locale]/(marketing)/(home)/_features/home.view-model'
import { HomeBlogSection } from '@/app/[locale]/(marketing)/(home)/_features/home-blog-section'
import { HomeFeaturedProductsSection } from '@/app/[locale]/(marketing)/(home)/_features/home-featured-products-section'
import { HomeFeaturedProjectsSection } from '@/app/[locale]/(marketing)/(home)/_features/home-featured-projects-section'
import { HomePartnersSection } from '@/app/[locale]/(marketing)/(home)/_features/home-partners-section'
import { HomeSectionEmptyState } from '@/app/[locale]/(marketing)/(home)/_features/home-section-empty-state'
import { HomeStatsSection } from '@/app/[locale]/(marketing)/(home)/_features/home-stats-section'
import { HomeUniverseSection } from '@/app/[locale]/(marketing)/(home)/_features/home-universe-section'
import { MarketingStepsSection } from '@/app/[locale]/(marketing)/(home)/_features/marketing-steps-section'
import { Link } from '@/i18n/navigation'
import { buildPartnerDashboardUrl } from '@/lib/partner-app-url'
import { getLocalizedContent } from '@/lib/utils'
import type { HeroLabVariant } from './hero-lab.types'
import { getHeroLabCopy } from './hero-lab-copy'
import { HeroLabNav } from './hero-lab-nav'
import { HeroVariantV1 } from './hero-variant-v1'
import { HeroVariantV2 } from './hero-variant-v2'
import { HeroVariantV3 } from './hero-variant-v3'

type MarketingStepPlaceholderImages = {
  projects: string[]
}

const marketingStepPlaceholderImages = {
  projects: [
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80',
  ],
} satisfies MarketingStepPlaceholderImages

const heroVariantById = {
  v1: HeroVariantV1,
  v2: HeroVariantV2,
  v3: HeroVariantV3,
} satisfies Record<HeroLabVariant, typeof HeroVariantV1>

type HeroLabPageProps = {
  variant: HeroLabVariant
}

export async function HeroLabPage({ variant }: HeroLabPageProps) {
  const t = await getTranslations('home')
  const localeValue = await getLocale()
  const locale: Locale = isLocale(localeValue) ? localeValue : defaultLocale
  const heroLabCopy = getHeroLabCopy(locale)
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

  const HeroVariant = heroVariantById[variant]

  return (
    <>
      <section className="container mx-auto px-4 pb-6 pt-24">
        <HeroLabNav labels={heroLabCopy.nav} />
      </section>

      <HeroVariant
        copy={heroLabCopy.variants[variant]}
        secondaryCtaLabel={localizedCmsContent?.hero.cta_secondary ?? t('hero.cta_secondary')}
        heroContextualCta={heroContextualCta}
        heroStats={heroStats}
      />

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
