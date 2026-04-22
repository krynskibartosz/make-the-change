import { Button } from '@make-the-change/core/ui'
import { ArrowLeft, Leaf, MapPin } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { MarketingCtaBand } from '@/app/[locale]/(marketing)/_features/marketing-cta-band'
import { MarketingHeroShell } from '@/app/[locale]/(marketing)/_features/marketing-hero-shell'
import { SectionContainer } from '@/components/ui/section-container'
import { Link } from '@/i18n/navigation'
import { getProjectContext } from '@/lib/api/project-context.service'
import { createClient } from '@/lib/supabase/server'
import { getLocalizedContent } from '@/lib/utils'
import { EcosystemCard } from '@/components/investment/ecosystem-card'
import { getEcosystemById, getPropertiesByProjectId } from '@/lib/investment/ecosystem.actions'
import { buildPublicAppUrl } from '@/lib/public-url'
import { ProjectCoverHero } from './components/project-cover-hero'
import { ProjectMainContent } from './components/project-main-content'
import { ProjectSidebar } from './components/project-sidebar'
import { ProjectQuickView } from './project-quick-view'
import { getRelatedProjectsByType, type PublicProject } from './project-detail-data'

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

  const projectContext = project.is_mock ? null : await getProjectContext(project.slug)

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

  let ecosystem = null
  let properties: any[] = []

  if (!project.is_mock) {
    const supabase = await createClient()
    const { data: coreProject } = await supabase
      .schema('investment')
      .from('projects')
      .select('ecosystem_id')
      .eq('id', project.id)
      .single()

    ecosystem = coreProject?.ecosystem_id ? await getEcosystemById(coreProject.ecosystem_id) : null
    properties = await getPropertiesByProjectId(project.id)
  }

  const relatedProjects = await getRelatedProjectsByType({
    type: project.type,
    excludeProjectId: project.id,
    excludeProjectSlug: project.slug,
    limit: 4,
  })
  const producerProducts = projectContext?.producer_products || project.producer_products || null

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Project',
    name: localizedTitle,
    description: localizedDesc,
    image: coverImage ? [coverImage] : [],
    url: buildPublicAppUrl(`/projects/${project.slug}`),
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
      <div className="lg:hidden">
        <ProjectQuickView
          project={project}
          mode="page"
          producerProducts={producerProducts}
          relatedProjects={relatedProjects.slice(0, 3)}
        />
      </div>

      <div className="hidden lg:block">
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
          <div className="grid grid-cols-1 gap-8 md:gap-12 lg:grid-cols-12">
            <ProjectMainContent
              project={{
                ...project,
                species: projectContext?.species || project.species || null,
                challenges: projectContext?.challenges || project.challenges || null,
                producer_products: producerProducts,
                expected_impact: projectContext?.expected_impact || project.expected_impact || null,
              }}
              fundingProgress={fundingProgress}
              currentFunding={currentFunding}
              targetBudget={targetBudget}
              relatedProjects={relatedProjects}
            />
            <ProjectSidebar
              project={project}
              locale={locale}
              fundingProgress={fundingProgress}
              {...(producerImage ? { producerImage } : {})}
            />
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:gap-12 lg:grid-cols-12">
            {ecosystem && (
              <div className="space-y-4 lg:col-span-4">
                <h3 className="text-xl font-bold">{t('detail.ecosystem') || 'Écosystème'}</h3>
                <EcosystemCard ecosystem={ecosystem} />
              </div>
            )}

            {properties && properties.length > 0 && (
              <div className={`space-y-4 ${ecosystem ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
                <h3 className="text-xl font-bold">
                  {t('detail.properties') || 'Parcelles & Propriétés'}
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {properties.map((prop: any) => (
                    <div
                      key={prop.id}
                      className="flex flex-col rounded-2xl border border-border/50 bg-background/50 p-5 transition-colors hover:bg-muted/50"
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <h4 className="text-lg font-semibold">{prop.name}</h4>
                      </div>
                      {prop.location && (
                        <p className="text-sm text-muted-foreground">{prop.location}</p>
                      )}
                      {prop.capacity && (
                        <div className="mt-3 inline-flex self-start items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                          CapacitÃ©: {prop.capacity}
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
              <Button variant="ghost" size="lg" className="group pl-0 transition-all hover:pl-2">
                <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
                <span className="font-medium">{tCommon('back')}</span>
              </Button>
            </Link>
          </div>
        </SectionContainer>

        <div className="container mx-auto px-4 pb-20 pt-12 lg:pb-32 lg:pt-20">
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
                <span className="mt-2 block animate-gradient bg-linear-to-r from-marketing-positive-400 via-marketing-gradient-mid-300 to-marketing-positive-400 bg-clip-text text-transparent bg-300%">
                  {t('detail.invest_now')}
                </span>
              </>
            }
            description={localizedDesc || t('subtitle')}
            primaryAction={
              <Link href={`/projects/${project.slug}/invest?source=cta_band`}>
                <Button
                  size="lg"
                  className="h-16 rounded-full border-none bg-marketing-positive-500 px-10 text-lg font-bold text-marketing-overlay-light shadow-[0_0_50px_-10px_hsl(var(--marketing-positive) / 0.4)] transition-all hover:scale-105 hover:bg-marketing-positive-400"
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
                  className="h-16 rounded-full border-marketing-overlay-light/20 bg-transparent px-10 text-lg font-bold text-marketing-overlay-light backdrop-blur-sm transition-all hover:border-marketing-overlay-light/40 hover:bg-marketing-overlay-light/10"
                >
                  {tNav('projects')}
                </Button>
              </Link>
            }
          />
        </div>
      </div>

      {includeStructuredData && <script type="application/ld+json">{structuredDataJson}</script>}
    </>
  )
}
