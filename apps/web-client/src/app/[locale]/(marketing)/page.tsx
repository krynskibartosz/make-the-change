import type { Product } from '@make-the-change/core/schema'
import { Button } from '@make-the-change/core/ui'
import { ArrowDown, ArrowRight, Globe, Leaf, ShieldCheck, Sparkles, Users, Zap } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { HomeBlogSection } from '@/components/marketing/home/home-blog-section'
import { HomeFeaturedProductsSection } from '@/components/marketing/home/home-featured-products-section'
import { HomeFeaturedProjectsSection } from '@/components/marketing/home/home-featured-projects-section'
import { HomeFeaturesSection } from '@/components/marketing/home/home-features-section'
import { HomePartnersSection } from '@/components/marketing/home/home-partners-section'
import { HomeStatsSection } from '@/components/marketing/home/home-stats-section'
import { HomeUniverseSection } from '@/components/marketing/home/home-universe-section'
import { DiversityFactLoader } from '@/components/marketing/home/diversity-fact-loader'
import { MarketingCtaBand } from '@/components/marketing/marketing-cta-band'
import { PageHero } from '@/components/ui/page-hero'
import { getBlogPosts } from '@/features/blog/blog-data'
import type { BlogPost } from '@/features/blog/blog-types'
import { getPageContent } from '@/features/cms/cms.service'
import type { HomePageContent } from '@/features/cms/types'
import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/server'
import { formatPoints } from '@/lib/utils'

type NumericRpcResponse = {
  data: number | null
  error: unknown
}

type RawFeaturedProject = {
  id: string
  slug: string | null
  name_default: string | null
  description_default: string | null
  hero_image_url: string | null
  target_budget: number | null
  current_funding: number | null
  status: string | null
  featured: boolean | null
}

export default async function HomePage() {
  const t = await getTranslations('home')
  const supabase = await createClient()

  const [
    { count: activeProjectsCount },
    { count: activeProductsCount },
    { data: membersCountData },
    { data: featuredProjectsRaw },
    { data: featuredProductsRaw },
    { data: activeProducersRaw },
    homeContent,
    { data: pointsData },
    latestPosts,
  ] = await Promise.all([
    supabase
      .schema('investment')
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active'),
    supabase
      .schema('commerce')
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true),
    supabase.rpc('count_total_members') as unknown as Promise<NumericRpcResponse>,
    supabase
      .schema('investment')
      .from('projects')
      .select('*')
      .eq('featured', true)
      .limit(3)
      .order('created_at', { ascending: false }),
    supabase
      .schema('commerce')
      .from('products')
      .select('*')
      .eq('featured', true)
      .limit(4)
      .order('created_at', { ascending: false }),
    supabase
      .schema('investment')
      .from('producers')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false }),
    getPageContent('home'),
    supabase.rpc('get_total_points_generated') as unknown as Promise<NumericRpcResponse>,
    getBlogPosts(),
  ])

  const content = homeContent as HomePageContent | null
  const projectsCount = activeProjectsCount || 0
  const productsCount = activeProductsCount || 0
  const membersCount = membersCountData || 0
  const pointsGenerated = pointsData || 0

  const featuredProjects = ((featuredProjectsRaw || []) as RawFeaturedProject[]).map((project) => ({
    id: project.id,
    slug: project.slug || project.id,
    name_default: project.name_default,
    description_default: project.description_default,
    hero_image_url: project.hero_image_url,
    target_budget: project.target_budget,
    current_funding: project.current_funding,
    status: project.status,
    featured: project.featured,
  }))

  const featuredProducts = (featuredProductsRaw || []) as unknown as Product[]
  const blogPosts = (latestPosts || []) as BlogPost[]
  const activeProducers = (activeProducersRaw || []) as any[]
console.log("activeProducers", activeProducers)
  return (
    <div className="overflow-x-hidden">
      <PageHero
        badge={
          <span className="inline-flex items-center gap-2 px-1 py-1">
            <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
            <span className="font-bold tracking-widest uppercase text-[10px]">
              {content?.hero.badge || t('hero.badge')}
            </span>
          </span>
        }
        title={content?.hero.title || t('hero.title')}
        description={content?.hero.subtitle || t('hero.subtitle')}
        size="lg"
        variant="gradient"
        className="min-h-[100dvh] flex flex-col justify-center"
      >
        <div className="space-y-8 relative z-10">
          <div className="flex flex-col justify-center gap-4 sm:flex-row items-center">
            <Link href="/projects">
              <Button
                size="lg"
                className="flex items-center justify-center w-full sm:w-auto h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl shadow-primary/20 hover:scale-105 transition-transform"
              >
                {content?.hero.cta_primary || t('hero.cta_primary')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-sm border-2 backdrop-blur-md hover:bg-background/50"
              >
                {content?.hero.cta_secondary || t('hero.cta_secondary')}
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-background/40 backdrop-blur-md border border-marketing-overlay-light/10 shadow-sm">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-tight">
                {projectsCount} {content?.stats.projects || t('stats.projects')}
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-background/40 backdrop-blur-md border border-marketing-overlay-light/10 shadow-sm">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-tight">
                {membersCount} {content?.stats.members || t('stats.members')}
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-background/40 backdrop-blur-md border border-marketing-overlay-light/10 shadow-sm">
              <Globe className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-tight">
                {content?.stats.global_impact || t('stats.global_impact')}
              </span>
            </div>
          </div>

          <DiversityFactLoader />

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 animate-bounce cursor-pointer mt-16">
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
      />

      <HomeFeaturesSection
        title={content?.features.title || t('features.title')}
        exploreLabel={content?.features.explore || t('features.explore')}
        invest={{
          title: content?.features.invest.title || t('features.invest.title'),
          description: content?.features.invest.description || t('features.invest.description'),
        }}
        earn={{
          title: content?.features.earn.title || t('features.earn.title'),
          description: content?.features.earn.description || t('features.earn.description'),
        }}
        redeem={{
          title: content?.features.redeem.title || t('features.redeem.title'),
          description: content?.features.redeem.description || t('features.redeem.description'),
        }}
      />

      <HomeStatsSection
        title={t('stats_section.title')}
        stats={[
          {
            value: projectsCount,
            label: content?.stats.projects || t('stats_section.active_projects'),
            icon: Leaf,
            color: 'text-marketing-positive-400',
            bg: 'bg-marketing-positive-400/10',
            border: 'border-marketing-positive-400/20',
          },
          {
            value: membersCount,
            label: content?.stats.members || t('stats_section.engaged_members'),
            icon: Users,
            color: 'text-marketing-info-400',
            bg: 'bg-marketing-info-400/10',
            border: 'border-marketing-info-400/20',
          },
          {
            value: productsCount,
            label: content?.stats.global_impact || t('stats_section.ethical_products'),
            icon: Sparkles,
            color: 'text-marketing-warning-400',
            bg: 'bg-marketing-warning-400/10',
            border: 'border-marketing-warning-400/20',
          },
          {
            value: formatPoints(pointsGenerated),
            label: content?.stats.points_label || t('stats_section.points_generated'),
            icon: Zap,
            color: 'text-primary',
            bg: 'bg-primary/10',
            border: 'border-primary/20',
          },
        ]}
      />

      {featuredProjects.length > 0 ? (
        <HomeFeaturedProjectsSection
          title={t('featured_projects')}
          viewAllLabel={t('view_all_projects')}
          fundedLabel={t('project_card.funded')}
          activeLabel={t('project_card.active')}
          projects={featuredProjects}
        />
      ) : null}

      {featuredProducts.length > 0 ? (
        <HomeFeaturedProductsSection
          title={t('featured_products')}
          viewAllLabel={t('view_all_products')}
          products={featuredProducts}
        />
      ) : null}

      <HomePartnersSection producers={activeProducers} />

      {blogPosts.length > 0 ? (
        <HomeBlogSection
          title={content?.blog?.title || t('blog_section.title')}
          viewAllLabel={t('blog_section.view_all')}
          posts={blogPosts}
        />
      ) : null}

      <section className="mb-24">
        <div className="container mx-auto px-4">
          <MarketingCtaBand
            badge={
              <>
                <ShieldCheck className="h-5 w-5 text-primary" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-marketing-neutral-300">
                  {content?.cta.stats.transparency || t('cta.stats.transparency')}
                </span>
              </>
            }
            title={content?.cta.title || t('cta.title')}
            description={content?.cta.description || t('cta.description')}
            primaryAction={
              <Link href="/register" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="flex items-center justify-center w-full h-16 px-12 rounded-2xl text-lg font-black uppercase tracking-widest shadow-2xl shadow-primary/40 hover:scale-105 transition-transform"
                >
                  {content?.cta.button || t('cta.button')}
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>
            }
            secondaryAction={
              <Link href="/how-it-works" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full h-16 px-12 rounded-2xl text-lg font-black uppercase tracking-widest border-2 border-marketing-overlay-light/10 hover:bg-marketing-overlay-light/5 transition-all"
                >
                  {content?.hero.cta_secondary || t('hero.cta_secondary')}
                </Button>
              </Link>
            }
            footer={
              <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-40">
                <div className="flex items-center gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em]">
                    {content?.cta.stats.engagement || t('cta.stats.engagement')}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em]">
                    {content?.cta.stats.transparency || t('cta.stats.transparency')}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em]">
                    {content?.cta.stats.community || t('cta.stats.community')}
                  </p>
                </div>
              </div>
            }
          />
        </div>
      </section>
    </div>
  )
}
