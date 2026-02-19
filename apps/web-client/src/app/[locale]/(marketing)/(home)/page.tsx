import type { Locale } from '@make-the-change/core/i18n'
import { defaultLocale, isLocale } from '@make-the-change/core/i18n'
import { Button } from '@make-the-change/core/ui'
import { ArrowDown, ArrowRight, Leaf, type LucideIcon, Sparkles, Users, Zap } from 'lucide-react'
import type { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import { Logo } from '@/components/ui/logo'
import { PageHero } from '@/components/ui/page-hero'
import { Link } from '@/i18n/navigation'
import { buildPartnerDashboardUrl } from '@/lib/partner-app-url'
import { cn, formatPoints } from '@/lib/utils'
import { MarketingCtaBand } from '../_features/marketing-cta-band'
import { DiversityFactLoader } from './_features/diversity-fact-loader'
import { getHomeServerData } from './_features/home.server-data'
import { HomeBlogSection } from './_features/home-blog-section'
import { HomeFeaturedProductsSection } from './_features/home-featured-products-section'
import { HomeFeaturedProjectsSection } from './_features/home-featured-projects-section'
import { HomePartnersSection } from './_features/home-partners-section'
import { HomeSectionEmptyState } from './_features/home-section-empty-state'
import { HomeStatsSection } from './_features/home-stats-section'
import { HomeUniverseSection } from './_features/home-universe-section'
import { MarketingStepsSection } from './_features/marketing-steps-section'

type HeroStat = {
  key: 'projects' | 'members'
  href: string
  icon: LucideIcon
  value: number
  label: string
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata' })
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://make-the-change-web-client.vercel.app'
  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      type: 'website',
      siteName: 'Make the Change',
      locale: locale === 'fr' ? 'fr_FR' : locale === 'nl' ? 'nl_NL' : 'en_US',
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

export default async function HomePage() {
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

  const placeholderImages = {
    projects: [
      'https://images.unsplash.com/photo-1551888192-3cf5d6a5e1c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f5b3d5b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558628042-1c5a1e9c5b8?w=800&h=600&fit=crop',
    ],
  }

  const partnerAppBaseUrl =
    process.env.NEXT_PUBLIC_PARTNER_APP_BASE_URL || process.env.NEXT_PUBLIC_ADMIN_URL
  const partnerDashboardUrl = buildPartnerDashboardUrl(partnerAppBaseUrl, locale)

  const heroStats: HeroStat[] = []
  if (activeProjectsState.status === 'ready') {
    heroStats.push({
      key: 'projects',
      href: '/projects',
      icon: Zap,
      value: activeProjectsState.value,
      label: t('stats.projects'),
    })
  }
  if (membersCountState.status === 'ready') {
    heroStats.push({
      key: 'members',
      href: '/leaderboard',
      icon: Users,
      value: membersCountState.value,
      label: t('stats.members'),
    })
  }

  const statsItems = []
  if (activeProjectsState.status === 'ready') {
    statsItems.push({
      value: activeProjectsState.value,
      label: t('stats_section.active_projects'),
      icon: Leaf,
      color: 'text-marketing-positive-400',
      bg: 'bg-marketing-positive-400/10',
      border: 'border-marketing-positive-400/20',
    })
  }
  if (membersCountState.status === 'ready') {
    statsItems.push({
      value: membersCountState.value,
      label: t('stats_section.engaged_members'),
      icon: Users,
      color: 'text-marketing-info-400',
      bg: 'bg-marketing-info-400/10',
      border: 'border-marketing-info-400/20',
    })
  }
  if (activeProductsState.status === 'ready') {
    statsItems.push({
      value: activeProductsState.value,
      label: t('stats_section.ethical_products'),
      icon: Sparkles,
      color: 'text-marketing-warning-400',
      bg: 'bg-marketing-warning-400/10',
      border: 'border-marketing-warning-400/20',
    })
  }
  if (pointsGeneratedState.status === 'ready') {
    statsItems.push({
      value: formatPoints(pointsGeneratedState.value),
      label: t('stats_section.points_generated'),
      icon: Zap,
      color: 'text-primary',
      bg: 'bg-primary/10',
      border: 'border-primary/20',
    })
  }

  const featuredProjectsVisible = featuredProjectsState.status !== 'unknown'
  const featuredProductsVisible = featuredProductsState.status !== 'unknown'
  const partnersVisible = activeProducersState.status !== 'unknown'
  const blogVisible = blogPostsState.status !== 'unknown'

  const featuredSectionsVisibleCount =
    (featuredProjectsVisible ? 1 : 0) + (featuredProductsVisible ? 1 : 0)
  const partnersVariant: 'default' | 'muted' =
    featuredSectionsVisibleCount % 2 === 0 ? 'muted' : 'default'
  const blogVariant: 'default' | 'muted' =
    (featuredSectionsVisibleCount + (partnersVisible ? 1 : 0)) % 2 === 0 ? 'muted' : 'default'
  const ctaSectionClassName = cn(
    'py-24',
    (featuredSectionsVisibleCount + (partnersVisible ? 1 : 0) + (blogVisible ? 1 : 0)) % 2 === 0
      ? 'bg-muted/30'
      : 'bg-background',
  )

  const content = homeContent.data

  return (
    <>
      <div className="absolute left-0 right-0 top-4 z-50 flex justify-center md:hidden">
        <Link href="/" className="flex items-center gap-2">
          <Logo variant="icon" width={32} height={32} className="h-8 w-8" />
          <span className="text-lg font-bold">Make the Change</span>
        </Link>
      </div>

      <PageHero
        badge={
          <span className="inline-flex items-center gap-2 px-1 py-1">
            <Sparkles className="h-3.5 w-3.5 animate-pulse text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              {content?.hero.badge || t('hero.badge')}
            </span>
          </span>
        }
        title={content?.hero.title || t('hero.title')}
        description={content?.hero.subtitle || t('hero.subtitle')}
        size="lg"
        variant="gradient"
        className="relative flex min-h-[100dvh] flex-col justify-center pt-32 md:pt-0"
      >
        <div className="relative z-10 space-y-8">
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="flex h-14 w-full items-center justify-center rounded-2xl px-8 text-sm font-black uppercase tracking-widest shadow-2xl shadow-primary/20 transition-transform hover:scale-105 sm:w-auto"
            >
              <Link href="/projects">
                {content?.hero.cta_primary || t('hero.cta_primary')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-14 w-full rounded-2xl border-2 px-8 text-sm font-black uppercase tracking-widest backdrop-blur-md hover:bg-background/50 sm:w-auto"
            >
              <Link href="/about">{content?.hero.cta_secondary || t('hero.cta_secondary')}</Link>
            </Button>
          </div>

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

          <div className="mx-auto mt-16 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-primary/20 bg-primary/10 backdrop-blur-sm animate-bounce">
            <ArrowDown className="h-6 w-6 text-primary" />
          </div>
        </div>
      </PageHero>

      <HomeUniverseSection
        title={content?.universe.title || t('universe.title')}
        description={content?.universe.description || t('universe.description')}
        projects={{
          image: content?.universe.cards.projects.image,
          badge: content?.universe.cards.projects.badge || t('universe.cards.projects.badge'),
          title: content?.universe.cards.projects.title || t('universe.cards.projects.title'),
          description:
            content?.universe.cards.projects.description ||
            t('universe.cards.projects.description'),
          cta: content?.universe.cards.projects.cta || t('universe.cards.projects.cta'),
        }}
        products={{
          image: content?.universe.cards.products.image,
          badge: content?.universe.cards.products.badge || t('universe.cards.products.badge'),
          title: content?.universe.cards.products.title || t('universe.cards.products.title'),
          description:
            content?.universe.cards.products.description ||
            t('universe.cards.products.description'),
          cta: content?.universe.cards.products.cta || t('universe.cards.products.cta'),
        }}
        community={{
          title: content?.universe.cards.community.title || t('universe.cards.community.title'),
          description:
            content?.universe.cards.community.description ||
            t('universe.cards.community.description'),
          cta: content?.universe.cards.community.cta || t('universe.cards.community.cta'),
        }}
        variant="default"
      />

      {statsItems.length > 0 ? (
        <HomeStatsSection title={t('stats_section.title')} stats={statsItems} variant="muted" />
      ) : null}

      <MarketingStepsSection variant="default" placeholderImages={placeholderImages} />

      {featuredProjectsState.status === 'ready' ? (
        <HomeFeaturedProjectsSection
          title={t('featured_projects')}
          viewAllLabel={t('view_all_projects')}
          fundedLabel={t('project_card.funded')}
          activeLabel={t('project_card.active')}
          projects={featuredProjectsState.value}
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
          variant={featuredProjectsVisible ? 'default' : 'muted'}
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
          secondaryCtaLabel={partnerDashboardUrl ? t('empty.partners.cta_secondary') : undefined}
          secondaryCtaHref={partnerDashboardUrl}
        />
      ) : null}

      {blogPostsState.status === 'ready' ? (
        <HomeBlogSection
          title={content?.blog?.title || t('blog_section.title')}
          viewAllLabel={t('blog_section.view_all')}
          posts={blogPostsState.value}
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
            title={content?.cta.title || t('cta.title')}
            description={content?.cta.description || t('cta.description')}
            primaryAction={
              user ? (
                <Button
                  asChild
                  size="lg"
                  className="flex h-16 w-full items-center justify-center rounded-2xl px-12 text-lg font-black uppercase tracking-widest shadow-2xl shadow-primary/40 transition-transform hover:scale-105"
                >
                  <Link href="/projects" className="w-full sm:w-auto">
                    Investir dans des projets
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <Button
                  asChild
                  size="lg"
                  className="flex h-16 w-full items-center justify-center rounded-2xl px-12 text-lg font-black uppercase tracking-widest shadow-2xl shadow-primary/40 transition-transform hover:scale-105"
                >
                  <Link href="/register" className="w-full sm:w-auto">
                    Nous rejoindre
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </Link>
                </Button>
              )
            }
            secondaryAction={
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-16 w-full rounded-2xl border-2 border-marketing-overlay-light/10 px-12 text-lg font-black uppercase tracking-widest transition-all hover:bg-marketing-overlay-light/5"
              >
                <Link href="/about" className="w-full sm:w-auto">
                  {content?.hero.cta_secondary || t('hero.cta_secondary')}
                </Link>
              </Button>
            }
            footer={
              <ul className="m-0 flex list-none flex-wrap items-center justify-center gap-8 p-0 opacity-40 md:gap-16">
                <li className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
                    {content?.cta.stats.engagement || t('cta.stats.engagement')}
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
                    {content?.cta.stats.transparency || t('cta.stats.transparency')}
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
                    {content?.cta.stats.community || t('cta.stats.community')}
                  </span>
                </li>
              </ul>
            }
          />
        </div>
      </section>
    </>
  )
}
