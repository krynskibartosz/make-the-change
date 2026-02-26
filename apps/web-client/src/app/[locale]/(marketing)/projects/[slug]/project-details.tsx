import { Button } from '@make-the-change/core/ui'
import { ArrowLeft, Leaf } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { MarketingCtaBand } from '@/app/[locale]/(marketing)/_features/marketing-cta-band'
import { MarketingHeroShell } from '@/app/[locale]/(marketing)/_features/marketing-hero-shell'
import { SectionContainer } from '@/components/ui/section-container'
import { Link } from '@/i18n/navigation'
import { getLocalizedContent } from '@/lib/utils'
import { ProjectCoverHero } from './components/project-cover-hero'
import { ProjectMainContent } from './components/project-main-content'
import { ProjectSidebar } from './components/project-sidebar'
import type { PublicProject } from './project-detail-data'
import { getEcosystemById, getPropertiesByProjectId } from '@/lib/investment/ecosystem.actions'
import { EcosystemCard } from '@/components/investment/ecosystem-card'
import { createClient } from '@/lib/supabase/server'
import { MapPin } from 'lucide-react'

type ProjectDetailsProps = {
  project: PublicProject
  locale: string
  includeStructuredData?: boolean
}

export async function ProjectDetails({
  project,
  locale,
  includeStructuredData = true,
}: ProjectDetailsProps) {
  const t = await getTranslations('projects')
  const tCommon = await getTranslations('common')
  const tNav = await getTranslations('navigation')

  const currentFunding = project.current_funding || 0
  const targetBudget = project.target_budget || 0
  const fundingProgress =
    targetBudget > 0 ? Math.min((currentFunding / targetBudget) * 100, 100) : 0

  const coverImage =
    project.hero_image_url ||
    (Array.isArray(project.images) && project.images.length > 0 ? project.images[0] : null)

  const producerImage =
    project.producer?.images &&
      Array.isArray(project.producer.images) &&
      project.producer.images.length > 0
      ? project.producer.images[0]
      : null
  const localizedTitle = getLocalizedContent(project.name_i18n, locale, project.name_default)
  const defaultDesc = project.description_default || project.long_description_default || ''
  const localizedLongDesc = getLocalizedContent(
    project.long_description_i18n,
    locale,
    project.long_description_default || '',
  )
  const localizedDesc = getLocalizedContent(
    project.description_i18n,
    locale,
    localizedLongDesc || defaultDesc,
  )

  const producerName = project.producer
    ? getLocalizedContent(project.producer.name_i18n, locale, project.producer.name_default)
    : 'Make the Change'

  // Fetch ecosystem and properties
  const supabase = await createClient()
  const { data: coreProject } = await supabase
    .schema('investment')
    .from('projects')
    .select('ecosystem_id')
    .eq('id', project.id)
    .single()

  const ecosystem = coreProject?.ecosystem_id ? await getEcosystemById(coreProject.ecosystem_id) : null
  const properties = await getPropertiesByProjectId(project.id)

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Project',
    name: localizedTitle,
    description: localizedDesc,
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
        name: producerName,
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
  }
  const structuredDataJson = JSON.stringify(structuredData).replace(/</g, '\\u003c')

  return (
    <>
      <MarketingHeroShell
        minHeightClassName="min-h-[88vh]"
        paddingClassName="pt-28 pb-20 lg:pt-40 lg:pb-24"
        background={
          <>
            <div className="absolute top-[-20%] left-[-10%] h-190 w-190 rounded-full bg-primary/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse duration-3000" />
            <div className="absolute bottom-[-20%] right-[-10%] h-190 w-190 rounded-full bg-marketing-gradient-mid-400/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse duration-5000 delay-1000" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9ImN1cnJlbnRDb2xvciIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')] opacity-100 text-foreground/20 mask-image-gradient" />
          </>
        }
      >
        <ProjectCoverHero
          project={project}
          locale={locale}
          fundingProgress={fundingProgress}
          currentFunding={currentFunding}
          targetBudget={targetBudget}
          {...(coverImage ? { coverImage } : {})}
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
            {...(producerImage ? { producerImage } : {})}
          />
        </div>

        {/* ECOSYSTEM & PROPERTIES SECTION */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          {ecosystem && (
            <div className="lg:col-span-4 space-y-4">
              <h3 className="text-xl font-bold">{t('detail.ecosystem') || 'Écosystème'}</h3>
              <EcosystemCard ecosystem={ecosystem} />
            </div>
          )}

          {properties && properties.length > 0 && (
            <div className={`space-y-4 ${ecosystem ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
              <h3 className="text-xl font-bold">{t('detail.properties') || 'Parcelles & Propriétés'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {properties.map((prop: any) => (
                  <div key={prop.id} className="flex flex-col p-5 rounded-2xl border border-border/50 bg-background/50 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <h4 className="font-semibold text-lg">{prop.name}</h4>
                    </div>
                    {prop.location && (
                      <p className="text-sm text-muted-foreground">{prop.location}</p>
                    )}
                    {prop.capacity && (
                      <div className="mt-3 inline-flex self-start items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                        Capacité: {prop.capacity}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
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
              <span className="block text-marketing-overlay-light">{localizedTitle}</span>
              <span className="block mt-2 text-transparent bg-clip-text bg-linear-to-r from-marketing-positive-400 via-marketing-gradient-mid-300 to-marketing-positive-400 bg-300% animate-gradient">
                {t('detail.invest_now')}
              </span>
            </>
          }
          description={localizedDesc || t('subtitle')}
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

      {includeStructuredData && <script type="application/ld+json">{structuredDataJson}</script>}
    </>
  )
}
