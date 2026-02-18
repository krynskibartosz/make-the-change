import { Button } from '@make-the-change/core/ui'
import { ArrowLeft, Leaf } from 'lucide-react'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { MarketingCtaBand } from '@/app/[locale]/(marketing)/_features/marketing/marketing-cta-band'
import { MarketingHeroShell } from '@/app/[locale]/(marketing)/_features/marketing/marketing-hero-shell'
import { SectionContainer } from '@/components/ui/section-container'
import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProjectCoverHero } from './components/project-cover-hero'
import { ProjectMainContent } from './components/project-main-content'
import { ProjectSidebar } from './components/project-sidebar'

interface ProjectDetailPageProps {
  params: Promise<{
    slug: string
    locale: string
  }>
}

type ProjectProducer = {
  name_default: string
  description_default: string | null
  contact_website: string | null
  images: string[] | null
}

type PublicProject = {
  slug: string
  status: string | null
  type: string | null
  name_default: string
  description_default: string | null
  long_description_default: string | null
  address_city: string | null
  address_country_code: string | null
  launch_date: string | null
  maturity_date: string | null
  current_funding: number | null
  target_budget: number | null
  hero_image_url: string | null
  images: string[] | null
  producer: ProjectProducer | null
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug, locale } = await params
  const t = await getTranslations('projects')
  const tCommon = await getTranslations('common')
  const tNav = await getTranslations('navigation')
  const supabase = await createClient()

  const { data } = await supabase
    .from('public_projects')
    .select(
      `
      *,
      producer:public_producers!producer_id(*)
    `,
    )
    .eq('slug', slug)
    .single()

  const project = data as PublicProject | null

  if (!project) {
    notFound()
  }

  const currentFunding = project.current_funding || 0
  const targetBudget = project.target_budget || 0
  const fundingProgress =
    targetBudget > 0 ? Math.min((currentFunding / targetBudget) * 100, 100) : 0

  const coverImage =
    project.hero_image_url ||
    (Array.isArray(project.images) && project.images.length > 0 ? project.images[0] : undefined)

  const producerImage =
    project.producer?.images &&
      Array.isArray(project.producer.images) &&
      project.producer.images.length > 0
      ? project.producer.images[0]
      : undefined

  return (
    <>
      <MarketingHeroShell
        minHeightClassName="min-h-[88vh]"
        paddingClassName="pt-28 pb-20 lg:pt-40 lg:pb-24"
        background={
          <>
            <div className="absolute top-[-20%] left-[-10%] h-[760px] w-[760px] rounded-full bg-primary/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse duration-3000" />
            <div className="absolute bottom-[-20%] right-[-10%] h-[760px] w-[760px] rounded-full bg-marketing-gradient-mid-400/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse duration-5000 delay-1000" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9ImN1cnJlbnRDb2xvciIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')] opacity-100 text-foreground/20 mask-image-gradient" />
          </>
        }
      >
        <ProjectCoverHero
          project={project}
          coverImage={coverImage}
          locale={locale}
          fundingProgress={fundingProgress}
          currentFunding={currentFunding}
          targetBudget={targetBudget}
        />
      </MarketingHeroShell>

      <SectionContainer size="lg" className="relative pt-6 md:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          <ProjectMainContent
            project={project}
            fundingProgress={fundingProgress}
            currentFunding={currentFunding}
            targetBudget={targetBudget}
          />
          <ProjectSidebar
            project={project}
            locale={locale}
            fundingProgress={fundingProgress}
            producerImage={producerImage}
          />
        </div>

        <div className="mt-16">
          <Link href="/projects">
            <Button variant="ghost" size="lg" className="pl-0 hover:pl-2 transition-all group">
              <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
              <span className="font-medium">{tCommon('back')}</span>
            </Button>
          </Link>
        </div>
      </SectionContainer>

      <div className="container mx-auto px-4 pb-20 lg:pb-32 pt-12 lg:pt-20">
        <MarketingCtaBand
          badge={
            <>
              <Leaf className="h-5 w-5 text-marketing-positive-400" />
              <span className="text-sm font-bold tracking-widest uppercase text-marketing-positive-100">
                {t('detail.impact')}
              </span>
            </>
          }
          title={
            <>
              <span className="block text-marketing-overlay-light">{project.name_default}</span>
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-marketing-positive-400 via-marketing-gradient-mid-300 to-marketing-positive-400 bg-300% animate-gradient">
                {t('detail.invest_now')}
              </span>
            </>
          }
          description={project.description_default || t('subtitle')}
          primaryAction={
            <Link href={`/projects/${project.slug}/invest`}>
              <Button
                size="lg"
                className="h-16 px-10 text-lg rounded-full font-bold bg-marketing-positive-500 text-marketing-overlay-light hover:bg-marketing-positive-400 hover:scale-105 transition-all shadow-[0_0_50px_-10px_hsl(var(--marketing-positive) / 0.4)] border-none"
              >
                {t('detail.invest_now')}
              </Button>
            </Link>
          }
          secondaryAction={
            <Link href="/projects">
              <Button
                size="lg"
                variant="outline"
                className="h-16 px-10 text-lg rounded-full font-bold border-marketing-overlay-light/20 bg-transparent text-marketing-overlay-light hover:bg-marketing-overlay-light/10 hover:border-marketing-overlay-light/40 transition-all backdrop-blur-sm"
              >
                {tNav('projects')}
              </Button>
            </Link>
          }
        />
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Project',
            name: project.name_default,
            description: project.description_default,
            image: coverImage ? [coverImage] : [],
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/projects/${project.slug}`,
            location:
              project.address_city || project.address_country_code
                ? {
                  '@type': 'Place',
                  address: {
                    '@type': 'PostalAddress',
                    addressLocality: project.address_city,
                    addressCountry: project.address_country_code,
                  },
                }
                : undefined,
            organizer: project.producer
              ? {
                '@type': 'Organization',
                name: project.producer.name_default,
                url: project.producer.contact_website,
                image: producerImage,
              }
              : {
                '@type': 'Organization',
                name: 'Make the Change',
              },
            startDate: project.launch_date,
            endDate: project.maturity_date,
            funding: {
              '@type': 'MonetaryAmount',
              currency: 'EUR',
              value: project.target_budget,
            },
          }),
        }}
      />
    </>
  )
}
