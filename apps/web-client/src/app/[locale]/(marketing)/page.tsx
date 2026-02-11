import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Progress,
} from '@make-the-change/core/ui'
import { ArrowDown, ArrowRight, Gift, Heart, Leaf, TrendingUp, ShieldCheck, Zap, Globe, Sparkles, Users } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { FeaturedProjectsList } from '@/components/featured-projects-list'
import { PageHero } from '@/components/ui/page-hero'
import { SectionContainer } from '@/components/ui/section-container'
import { StatsSection } from '@/components/ui/stats-section'
import { getPageContent } from '@/features/cms/cms.service'
import { ProductCard } from '@/features/commerce/products/product-card'
import { getBlogPosts } from '@/features/blog/blog-data'
import { BlogCard } from '@/features/blog/components/blog-card'
import { Link } from '@/i18n/navigation'
import {
  getRandomProjectImage,
  placeholderImages,
} from '@/lib/placeholder-images'
import { createClient } from '@/lib/supabase/server'
import { cn, formatPoints } from '@/lib/utils'

export default async function HomePage() {
  const t = await getTranslations('home')
  const supabase = await createClient()

  const [
    { count: activeProjectsCount },
    { count: activeProductsCount },
    { count: membersCount },
    { data: featuredProjects },
    { data: featuredProducts },
    homeContent,
    { data: pointsData },
    latestPosts
  ] = await Promise.all([
    supabase.schema('investment').from('projects').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.schema('commerce').from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
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
    getPageContent('home'),
    supabase.rpc('get_total_points_generated'),
    getBlogPosts()
  ])

  // If RPC doesn't exist yet, we can fallback to summing up profiles points_balance for now, 
  // or just use a placeholder if the RPC fails.
  // Ideally, we create an RPC function `get_total_points_generated` in the database.
  // For now, let's try to sum `points_balance` from profiles if RPC is not available, 
  // but `profiles` read might be heavy.
  // Let's assume for this step we will implement the RPC or use a simpler query.
  
  // Actually, let's do a sum query directly if possible.
  // supabase.from('profiles').select('points_balance.sum') is not directly supported in JS client easily without RPC.
  
  // Alternative: Fetch all profiles points (bad for perf) or use an RPC.
  // Let's use a safe fallback for points if the RPC doesn't exist.
  const pointsGenerated = pointsData || 0


  return (
    <div className="overflow-x-hidden">
      {/* Premium Hero Section */}
      <PageHero
        badge={
          <span className="inline-flex items-center gap-2 px-1 py-1">
            <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
            <span className="font-bold tracking-widest uppercase text-[10px]">{homeContent?.hero.badge || t('hero.badge')}</span>
          </span>
        }
        title={homeContent?.hero.title || t('hero.title')}
        description={homeContent?.hero.subtitle || t('hero.subtitle')}
        size="lg"
        variant="gradient"
        className="min-h-[100dvh] flex flex-col justify-center"
      >
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/20 blur-[100px]" />
        </div>

        <div className="space-y-8 relative z-10">
          <div className="flex flex-col justify-center gap-4 sm:flex-row items-center">
            <Link href="/projects">
              <Button size="lg" className="flex items-center justify-center w-full sm:w-auto h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl shadow-primary/20 hover:scale-105 transition-transform">
                {homeContent?.hero.cta_primary || t('hero.cta_primary')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-sm border-2 backdrop-blur-md hover:bg-background/50">
                {homeContent?.hero.cta_secondary || t('hero.cta_secondary')}
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-background/40 backdrop-blur-md border border-white/10 shadow-sm">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-tight">{activeProjectsCount} {homeContent?.stats.projects || t('stats.projects')}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-background/40 backdrop-blur-md border border-white/10 shadow-sm">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-tight">{membersCount} {homeContent?.stats.members || t('stats.members')}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-background/40 backdrop-blur-md border border-white/10 shadow-sm">
              <Globe className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-tight">{homeContent?.stats.global_impact || t('stats.global_impact')}</span>
            </div>
          </div>
          
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 animate-bounce cursor-pointer mt-16">
            <ArrowDown className="h-6 w-6 text-primary" />
          </div>
        </div>
      </PageHero>

      {/* Bento Grid Universe Section */}
      <SectionContainer
        title={homeContent?.universe.title || t('universe.title')}
        description={homeContent?.universe.description || t('universe.description')}
        size="lg"
        className="pb-20"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">
          {/* Main Large Card */}
          <Link href="/projects" className="md:col-span-7 relative group overflow-hidden rounded-[2.5rem] border shadow-2xl cursor-pointer block">
            <img 
              src={homeContent?.universe.cards.projects.image || placeholderImages.projects[0]} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
              alt={homeContent?.universe.cards.projects.title || t('universe.cards.projects.title')} 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 md:p-12 space-y-4">
              <Badge className="bg-primary text-white border-none px-4 py-1 font-black uppercase tracking-widest text-[10px]">{homeContent?.universe.cards.projects.badge || t('universe.cards.projects.badge')}</Badge>
              <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight">{homeContent?.universe.cards.projects.title || t('universe.cards.projects.title')}</h3>
              <p className="text-white/70 text-lg font-medium max-w-md">{homeContent?.universe.cards.projects.description || t('universe.cards.projects.description')}</p>
              <div className="inline-flex items-center gap-2 text-primary font-bold hover:underline">
                {homeContent?.universe.cards.projects.cta || t('universe.cards.projects.cta')} <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </Link>

          {/* Secondary Column */}
          <div className="md:col-span-5 grid grid-rows-2 gap-6">
            {/* Top Right Card */}
            <div className="h-[300px] md:h-full relative group rounded-[2.5rem] border shadow-xl overflow-hidden">
              <Link href="/products" className="block w-full h-full">
                <img 
                  src={homeContent?.universe.cards.products.image || placeholderImages.products[0]} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                  alt={homeContent?.universe.cards.products.title || t('universe.cards.products.title')} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8 space-y-2">
                  <Badge className="bg-emerald-500 text-white border-none px-3 py-0.5 font-black uppercase tracking-widest text-[10px]">{homeContent?.universe.cards.products.badge || t('universe.cards.products.badge')}</Badge>
                  <h3 className="text-2xl font-black text-white">{homeContent?.universe.cards.products.title || t('universe.cards.products.title')}</h3>
                  <p className="text-white/70 text-sm font-medium">{homeContent?.universe.cards.products.description || t('universe.cards.products.description')}</p>
                </div>
              </Link>
            </div>

            {/* Bottom Right Card */}
            <div className="h-[300px] md:h-full relative group rounded-[2.5rem] border shadow-xl bg-slate-900 overflow-hidden">
              <Link href="/about" className="block w-full h-full">
                <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center space-y-4">
                  <div className="h-16 w-16 rounded-3xl bg-primary/20 flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-black text-white">{homeContent?.universe.cards.community.title || t('universe.cards.community.title')}</h3>
                  <p className="text-slate-400 text-sm font-medium">{homeContent?.universe.cards.community.description || t('universe.cards.community.description')}</p>
                  <Button variant="outline" size="sm" className="rounded-xl border-white/10 text-white hover:bg-white/5 pointer-events-none">{homeContent?.universe.cards.community.cta || t('universe.cards.community.cta')}</Button>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </SectionContainer>

      {/* Features Grid - 2026 Design */}
      <SectionContainer title={homeContent?.features.title || t('features.title')} size="lg" className="relative overflow-hidden py-32">
        {/* Background Ambient Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background -z-10 opacity-60" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] -z-10 mix-blend-screen animate-pulse duration-[10000ms]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px] -z-10 mix-blend-screen" />

        <div className="grid gap-8 md:grid-cols-3 relative z-10">
          {[
            { 
              icon: Heart, 
              title: homeContent?.features.invest.title || t('features.invest.title'), 
              desc: homeContent?.features.invest.description || t('features.invest.description'),
              color: "text-rose-500",
              bg: "bg-rose-500/10",
              border: "group-hover:border-rose-500/50",
              glow: "group-hover:shadow-rose-500/20"
            },
            { 
              icon: TrendingUp, 
              title: homeContent?.features.earn.title || t('features.earn.title'), 
              desc: homeContent?.features.earn.description || t('features.earn.description'),
              color: "text-primary",
              bg: "bg-primary/10",
              border: "group-hover:border-primary/50",
              glow: "group-hover:shadow-primary/20"
            },
            { 
              icon: Gift, 
              title: homeContent?.features.redeem.title || t('features.redeem.title'), 
              desc: homeContent?.features.redeem.description || t('features.redeem.description'),
              color: "text-emerald-500",
              bg: "bg-emerald-500/10",
              border: "group-hover:border-emerald-500/50",
              glow: "group-hover:shadow-emerald-500/20"
            }
          ].map((feature, i) => (
            <Card key={i} className={cn(
              "group relative border border-white/5 bg-white/[0.03] backdrop-blur-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl rounded-[2.5rem] overflow-hidden",
              feature.border,
              feature.glow
            )}>
              <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-white/5 to-transparent pointer-events-none")} />
              
              <CardHeader className="p-10 pb-6 relative">
                <div className={cn(
                  "mb-8 flex h-20 w-20 items-center justify-center rounded-[1.5rem] border border-white/10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg backdrop-blur-md",
                  feature.bg
                )}>
                  <feature.icon className={cn("h-10 w-10 transition-colors duration-500", feature.color)} />
                </div>
                <CardTitle className="text-3xl font-black tracking-tight text-foreground mb-2">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10 pt-0 relative">
                <p className="text-muted-foreground font-medium leading-relaxed text-lg">
                  {feature.desc}
                </p>
                
                <div className="mt-8 flex items-center gap-2 text-sm font-bold uppercase tracking-widest opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-75">
                  <span className={feature.color}>{homeContent?.features.explore || t('features.explore')}</span>
                  <ArrowRight className={cn("h-4 w-4", feature.color)} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </SectionContainer>

      {/* Stats Section - 2026 Design */}
      <SectionContainer title={t('stats_section.title')} size="lg" className="py-32 mt-24 md:mt-0 relative overflow-hidden">
        {/* Ambient Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse duration-[8000ms]" />
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 relative z-10">
          {[
            { value: activeProjectsCount, label: homeContent?.stats.projects || t('stats_section.active_projects'), icon: Leaf, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
            { value: membersCount, label: homeContent?.stats.members || t('stats_section.engaged_members'), icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
            { value: activeProductsCount, label: homeContent?.stats.global_impact || t('stats_section.ethical_products'), icon: Sparkles, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
            { value: formatPoints(pointsGenerated), label: homeContent?.stats.points_label || t('stats_section.points_generated'), icon: Zap, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' },
          ].map((stat, i) => (
            <div key={i} className="group relative p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all duration-500 hover:-translate-y-2">
              <div className={cn("absolute inset-0 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 border", stat.border)} />
              
              <div className="flex flex-col items-center justify-center text-center space-y-6">
                <div className={cn(
                  "h-16 w-16 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 shadow-lg backdrop-blur-md", 
                  stat.bg
                )}>
                  <stat.icon className={cn("h-8 w-8 transition-colors duration-500", stat.color)} />
                </div>
                
                <div className="space-y-2">
                  <p className="text-4xl md:text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
                    {stat.value}
                  </p>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                    {stat.label}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionContainer>

      {/* Featured Projects */}
      {featuredProjects && featuredProjects.length > 0 && (
        <SectionContainer
          title={t('featured_projects')}
          action={
            <Link href="/projects">
              <Button variant="ghost" className="flex items-center font-bold uppercase tracking-widest text-xs">
                {t('view_all_projects')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          }
          variant="muted"
          size="lg"
        >
          <div className="md:hidden">
            <div className="flex gap-4 overflow-x-auto pb-4 px-1">
              {featuredProjects.map((project) => {
                const fundingProgress = project.target_budget
                  ? (project.current_funding! / project.target_budget) * 100
                  : 0
                const imageUrl =
                  project.hero_image_url || getRandomProjectImage(project.name_default?.length || 0)
                return (
                  <Link key={project.id} href={`/projects/${project.slug}`} className="min-w-[280px]">
                    <Card className="overflow-hidden border bg-background/70 backdrop-blur shadow-lg rounded-3xl">
                      <div className="relative h-40 w-full">
                        <img src={imageUrl} alt={project.name_default || 'Project'} className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <Badge className="absolute top-4 right-4 bg-emerald-500 border-none text-[10px] font-black uppercase">{t('project_card.active')}</Badge>
                      </div>
                      <CardContent className="space-y-4 p-5">
                        <h3 className="text-lg font-black tracking-tight">{project.name_default}</h3>
                        {project.target_budget && (
                          <div className="space-y-2">
                            <Progress value={fundingProgress} className="h-1.5" />
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                              <span>{Math.round(fundingProgress || 0)}{t('project_card.funded')}</span>
                              <span className="text-foreground">{formatPoints(project.target_budget!)}€</span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>
          <div className="hidden md:block">
            <FeaturedProjectsList projects={featuredProjects} />
          </div>
        </SectionContainer>
      )}

      {/* Featured Products */}
      {featuredProducts && featuredProducts.length > 0 && (
        <SectionContainer
          title={t('featured_products')}
          action={
            <Link href="/products">
              <Button variant="ghost" className="flex items-center font-bold uppercase tracking-widest text-xs">
                {t('view_all_products')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          }
          size="lg"
        >
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                className="h-full rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
                priority={true}
              />
            ))}
          </div>
        </SectionContainer>
      )}

      {/* Latest Blog Posts */}
      {latestPosts && latestPosts.length > 0 && (
        <SectionContainer
          title={homeContent?.blog?.title || t('blog_section.title')}
          action={
            <Link href="/blog">
              <Button variant="ghost" className="flex items-center font-bold uppercase tracking-widest text-xs">
                {t('blog_section.view_all')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          }
          size="lg"
          className="py-20"
        >
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestPosts.slice(0, 3).map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </SectionContainer>
      )}

      {/* Modern Premium CTA */}
      <section className="relative w-full bg-slate-950 py-24 text-white overflow-hidden group shadow-[0_40px_100px_-15px_rgba(0,0,0,0.5)] mb-24">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent opacity-40 -z-0 group-hover:opacity-60 transition-opacity duration-1000" />
        <div className="absolute bottom-[-20%] left-[-10%] w-96 h-96 bg-emerald-500/10 blur-[120px] -z-0 animate-pulse" />
        
        <div className="container mx-auto px-4 relative z-10 text-center space-y-12">
          <div className="mx-auto h-20 w-20 rounded-[2rem] bg-white/5 backdrop-blur-2xl border border-white/10 flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform duration-700">
            <ShieldCheck className="h-10 w-10 text-primary" />
          </div>
          
          <div className="space-y-6">
            <h2 className="text-4xl md:text-7xl font-black tracking-tight leading-[1.1]">
              {homeContent?.cta.title || t('cta.title')}
            </h2>
            <p className="mx-auto max-w-2xl text-lg md:text-xl text-slate-400 font-medium leading-relaxed">
              {homeContent?.cta.description || t('cta.description')}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4 px-6 sm:px-0">
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" className="flex items-center justify-center w-full h-16 px-12 rounded-2xl text-lg font-black uppercase tracking-widest shadow-2xl shadow-primary/40 hover:scale-105 transition-transform">
                {homeContent?.cta.button || t('cta.button')}
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/how-it-works" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full h-16 px-12 rounded-2xl text-lg font-black uppercase tracking-widest border-2 border-white/10 hover:bg-white/5 transition-all">
                {homeContent?.hero.cta_secondary || t('hero.cta_secondary')}
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 pt-12 opacity-40">
            <div className="flex items-center gap-3">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              <p className="text-[10px] font-bold uppercase tracking-[0.3em]">{homeContent?.cta.stats.engagement || t('cta.stats.engagement')}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              <p className="text-[10px] font-bold uppercase tracking-[0.3em]">{homeContent?.cta.stats.transparency || t('cta.stats.transparency')}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              <p className="text-[10px] font-bold uppercase tracking-[0.3em]">{homeContent?.cta.stats.community || t('cta.stats.community')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
