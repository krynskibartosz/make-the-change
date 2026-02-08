import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Progress,
} from '@make-the-change/core/ui'
import { ArrowDown, ArrowRight, Gift, Heart, Leaf, TrendingUp } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { FeaturedProjectsList } from '@/components/featured-projects-list'
import { PageHero } from '@/components/ui/page-hero'
import { SectionContainer } from '@/components/ui/section-container'
import { StatsSection } from '@/components/ui/stats-section'
import { ProductCard } from '@/features/commerce/products/product-card'
import { Link } from '@/i18n/navigation'
import {
  getRandomProjectImage,
  placeholderImages,
} from '@/lib/placeholder-images'
import { createClient } from '@/lib/supabase/server'
import { formatPoints } from '@/lib/utils'

export default async function HomePage() {
  const t = await getTranslations('home')

  const supabase = await createClient()

  const [
    { data: activeProjects },
    { data: activeProducts },
    { data: profiles },
    { data: featuredProjects },
    { data: featuredProducts },
  ] = await Promise.all([
    supabase.from('public_projects').select('id', { count: 'exact', head: true }),
    supabase.from('public_products').select('id', { count: 'exact', head: true }),
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase
      .from('public_featured_projects')
      .select('*')
      .limit(3)
      .order('created_at', { ascending: false }),
    supabase
      .from('public_products')
      .select('*')
      .eq('featured', true)
      .limit(4)
      .order('created_at', { ascending: false }),
  ])

  const activeProjectsCount = activeProjects?.length || 0
  const activeProductsCount = activeProducts?.length || 0
  const membersCount = profiles?.length || 0

  return (
    <>
      <PageHero
        badge={
          <span className="inline-flex items-center gap-2">
            <Leaf className="h-4 w-4" />
            Biodiversité & Impact
          </span>
        }
        title={t('hero.title')}
        description={t('hero.subtitle')}
        hideDescriptionOnMobile
        size="md"
        variant="gradient"
      >
        <div className="absolute -left-[10%] top-[20%] h-64 w-64 rounded-full bg-primary/20 blur-[100px]" />
        <div className="absolute -right-[10%] top-[40%] h-64 w-64 rounded-full bg-primary/10 blur-[100px]" />
        <div className="space-y-4">
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/projects">
              <Button size="lg" className="w-full sm:w-auto">
                {t('hero.cta_primary')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                {t('hero.cta_secondary')}
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
            <Badge variant="secondary" className="rounded-full bg-background/60">
              {activeProjectsCount} projets actifs
            </Badge>
            <Badge variant="secondary" className="rounded-full bg-background/60">
              {activeProductsCount} produits
            </Badge>
            <Badge variant="secondary" className="rounded-full bg-background/60">
              {membersCount} membres
            </Badge>
          </div>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 backdrop-blur-sm">
            <ArrowDown className="h-8 w-8 text-primary" />
          </div>
        </div>
      </PageHero>

      <SectionContainer
        title="Notre univers visuel"
        description="Des initiatives et des produits qui rendent l'impact tangible."
        hideDescriptionOnMobile
        size="lg"
        variant="muted"
      >
        <div className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible">
          {[
            {
              title: 'Projets vivants',
              description: 'Reforestation, habitats et biodiversite.',
              image: placeholderImages.projects[0],
            },
            {
              title: 'Boutique responsable',
              description: 'Produits durables et artisanaux.',
              image: placeholderImages.products[0],
            },
            {
              title: 'Communautes engagees',
              description: 'Impact collectif et local.',
              image: placeholderImages.projects[1],
            },
          ].map((item) => (
            <Card
              key={item.title}
              className="group min-w-[240px] overflow-hidden border-[hsl(var(--border)/0.5)] bg-background/70 backdrop-blur transition-all hover:-translate-y-1 hover:shadow-xl md:min-w-0"
            >
              <div className="relative h-40 w-full sm:h-48">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              </div>
              <CardContent className="space-y-2 p-4">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="hidden sm:block text-sm text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </SectionContainer>

      <SectionContainer title={t('features.title')} size="lg">
        <div className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible">
          <Card className="group min-w-[240px] text-center border-[hsl(var(--border)/0.5)] bg-background/70 backdrop-blur transition-all hover:-translate-y-1 hover:shadow-xl md:min-w-0">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 transition-transform group-hover:scale-110">
                <Heart className="h-7 w-7 text-primary" />
              </div>
              <CardTitle>{t('features.invest.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="hidden sm:block text-sm text-muted-foreground">
                {t('features.invest.description')}
              </p>
            </CardContent>
          </Card>

          <Card className="group min-w-[240px] text-center border-[hsl(var(--border)/0.5)] bg-background/70 backdrop-blur transition-all hover:-translate-y-1 hover:shadow-xl md:min-w-0">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 transition-transform group-hover:scale-110">
                <TrendingUp className="h-7 w-7 text-primary" />
              </div>
              <CardTitle>{t('features.earn.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="hidden sm:block text-sm text-muted-foreground">
                {t('features.earn.description')}
              </p>
            </CardContent>
          </Card>

          <Card className="group min-w-[240px] text-center border-[hsl(var(--border)/0.5)] bg-background/70 backdrop-blur transition-all hover:-translate-y-1 hover:shadow-xl md:min-w-0">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 transition-transform group-hover:scale-110">
                <Gift className="h-7 w-7 text-primary" />
              </div>
              <CardTitle>{t('features.redeem.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="hidden sm:block text-sm text-muted-foreground">
                {t('features.redeem.description')}
              </p>
            </CardContent>
          </Card>
        </div>
      </SectionContainer>

      <SectionContainer title="Impact en chiffres" variant="muted" size="lg">
        <StatsSection
          variant="card"
          stats={[
            { value: activeProjectsCount, label: 'Projets actifs' },
            { value: membersCount, label: 'Membres' },
            { value: activeProductsCount, label: 'Produits' },
          ]}
        />
      </SectionContainer>

      {featuredProjects && featuredProjects.length > 0 && (
        <SectionContainer
          title={t('featured_projects')}
          action={
            <Link href="/projects">
              <Button variant="ghost">
                {t('view_all_projects')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          }
          variant="muted"
          size="lg"
        >
          <div className="md:hidden">
            <div className="flex gap-4 overflow-x-auto pb-2">
              {featuredProjects.map((project) => {
                const fundingProgress = project.target_budget
                  ? (project.current_funding! / project.target_budget) * 100
                  : 0
                const imageUrl =
                  project.hero_image_url || getRandomProjectImage(project.name_default?.length || 0)
                return (
                  <Link key={project.id} href={`/projects/${project.slug}`}>
                    <Card className="min-w-[260px] overflow-hidden border-[hsl(var(--border)/0.5)] bg-background/70 backdrop-blur transition-all hover:-translate-y-1 hover:shadow-xl">
                      <div className="relative h-36 w-full">
                        <img
                          src={imageUrl}
                          alt={project.name_default || 'Project'}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                      </div>
                      <CardContent className="space-y-2 p-4">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-base font-semibold">{project.name_default}</h3>
                          <Badge variant="success">Actif</Badge>
                        </div>
                        {project.target_budget && (
                          <div className="space-y-2">
                            <Progress value={fundingProgress} />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span className="font-medium text-foreground">
                                {Math.round(fundingProgress || 0)}% financé
                              </span>
                              <span>{formatPoints(project.target_budget!)}€</span>
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

      {featuredProducts && featuredProducts.length > 0 && (
        <SectionContainer
          title={t('featured_products')}
          action={
            <Link href="/products">
              <Button variant="ghost">
                {t('view_all_products')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          }
          size="lg"
        >
          {/* Unified Product Grid for Mobile & Desktop */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                className="h-full"
                priority={true}
              />
            ))}
          </div>
        </SectionContainer>
      )}

      <SectionContainer variant="primary" size="lg" className="relative overflow-hidden">
        <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="relative z-10 text-center">
          <h2 className="mb-4 text-3xl font-bold">{t('cta.title')}</h2>
          <p className="mx-auto mb-8 hidden max-w-2xl text-lg opacity-90 sm:block">
            {t('cta.description')}
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary">
              {t('cta.button')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </SectionContainer>
    </>
  )
}
