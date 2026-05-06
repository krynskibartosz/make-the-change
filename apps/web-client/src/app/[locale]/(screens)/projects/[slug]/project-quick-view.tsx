import { Badge, Button, Progress } from '@make-the-change/core/ui'
import { ChevronRight, Globe, MapPin } from 'lucide-react'
import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getProjectContext } from '@/app/[locale]/(screens)/projects/_api/project-context.service'
import { sanitizeImageUrl } from '@/lib/image-url'
import type { DonationOption, ProducerProduct } from '@/app/[locale]/(screens)/projects/_types/project'
import { cn, getLocalizedContent } from '@/lib/utils'
import { getEntityViewTransitionName } from '@/lib/view-transition'
import { ProjectImpactCalculator } from './components/project-impact-calculator'
import { ProjectSpeciesTeaser } from './components/project-species-teaser'
import { ProjectProducerProductsSection } from './components/project-producer-products-section'
import { ProjectQuickViewHero } from './components/project-quick-view-hero'
import { SimilarProjectsCarousel } from './components/similar-projects-carousel'
import { BottomActionBar } from '@/app/[locale]/_components/bottom-action-bar'
import {
  getRelatedProjectsByType,
  type PublicProject,
  type RelatedProject,
} from './project-detail-data'
import { formatAmountNumber } from '@/lib/formatters'

type ProjectQuickViewProps = {
  project: PublicProject
  mode?: 'modal' | 'page'
  producerProducts?: ProducerProduct[] | null
  relatedProjects?: RelatedProject[]
}

// ─── Glow contextuel par type de projet ────────────────────────────────────
type ProjectGlowTone = 'yellow' | 'green' | 'blue'

const PROJECT_GLOW_RGB: Record<ProjectGlowTone, string> = {
  yellow: '245 158 11', // amber-500  → beehive / pollinisateur
  green: '16 185 129',  // emerald-500 → agroforestry / olive_tree / forêt
  blue: '14 165 233',   // sky-500     → coral_restoration / océan
}

function getProjectGlowTone(type: string | null | undefined): ProjectGlowTone {
  const t = type?.toLowerCase() ?? ''
  if (t.includes('coral') || t.includes('reef') || t.includes('ocean')) return 'blue'
  if (t.includes('agroforestry') || t.includes('orchard') || t.includes('olive') || t.includes('forest') || t.includes('tree')) return 'green'
  return 'yellow' // beehive par défaut
}
// ────────────────────────────────────────────────────────────────────────────

const formatBadgeLabel = (value: string | null | undefined, locale: string): string | null => {
  if (!value) return null
  const normalized = value.replace(/[_-]+/g, ' ').trim()
  if (!normalized) return null
  
  // Traduction des types de projet
  const typeTranslations: Record<string, Record<string, string>> = {
    beehive: { fr: 'Rucher', en: 'Beehive' },
    orchard: { fr: 'Verger', en: 'Orchard' },
    reef: { fr: 'Récif', en: 'Reef' },
  }
  
  const lowerValue = normalized.toLowerCase()
  if (typeTranslations[lowerValue]?.[locale]) {
    return typeTranslations[lowerValue][locale]
  }
  
  return normalized.replace(/\b\w/g, (match) => match.toUpperCase())
}

const getWebsiteLabel = (url: string | null): string | null => {
  if (!url) return null
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

export async function ProjectQuickView({
  project,
  mode = 'modal',
  producerProducts,
  relatedProjects,
}: ProjectQuickViewProps) {
  const t = await getTranslations('projects')
  const locale = await getLocale()
  const isPageMode = mode === 'page'

  const glowTone = getProjectGlowTone(project.type)
  const glowRgb = PROJECT_GLOW_RGB[glowTone]

  const currentFunding = project.current_funding || 0
  const targetBudget = project.target_budget || 0
  const fundingProgress =
    targetBudget > 0 ? Math.min((currentFunding / targetBudget) * 100, 100) : 0

  const coverImage =
    sanitizeImageUrl(project.hero_image_url) ??
    (Array.isArray(project.images) && project.images.length > 0
      ? sanitizeImageUrl(project.images[0]) ?? undefined
      : undefined)

  const producerImage =
    project.producer?.images &&
    Array.isArray(project.producer.images) &&
    project.producer.images.length > 0
      ? sanitizeImageUrl(project.producer.images[0]) ?? undefined
      : undefined

  const locationLabel = [project.address_city, project.address_country_code]
    .filter(Boolean)
    .join(', ')
  const normalizedStatus = project.status?.toLowerCase() || null
  const isFundingClosed = normalizedStatus === 'completed' || normalizedStatus === 'funded'
  const typeLabel = formatBadgeLabel(project.type, locale)

  const projectName = getLocalizedContent(project.name_i18n, locale, project.name_default)

  const defaultDesc = project.description_default || project.long_description_default || ''
  const localizedLongDesc = getLocalizedContent(
    project.long_description_i18n,
    locale,
    project.long_description_default || '',
  )
  const projectDescription = getLocalizedContent(
    project.description_i18n,
    locale,
    localizedLongDesc || defaultDesc,
  )

  const producerName = project.producer
    ? getLocalizedContent(project.producer.name_i18n, locale, project.producer.name_default)
    : 'Make the Change'
  const organizerName = producerName
  const producerDescription = project.producer
    ? getLocalizedContent(
        project.producer.description_i18n,
        locale,
        project.producer.description_default || '',
      )
    : t('subtitle')
  const organizerDescription = producerDescription || t('subtitle')
  const websiteUrl = project.producer?.contact_website || null
  const websiteLabel = getWebsiteLabel(websiteUrl)
  const producerHref =
    project.producer && (project.producer.slug || project.producer.id)
      ? `/${locale}/producers/${project.producer.slug || project.producer.id}`
      : null

  const isDonationProject = !!(project.is_donation_project && project.donation_options)
  const investPath = isDonationProject
    ? `/projects/${project.slug}/donate?source=quick_view`
    : `/projects/${project.slug}/invest?source=quick_view`
  const projectContext =
    producerProducts === undefined && !project.is_mock ? await getProjectContext(project.slug) : null
  const resolvedProducerProducts =
    producerProducts ?? projectContext?.producer_products ?? project.producer_products ?? null
  const resolvedRelatedProjects =
    relatedProjects ??
    (await getRelatedProjectsByType({
      type: project.type,
      excludeProjectId: project.id,
      excludeProjectSlug: project.slug,
      limit: 3,
    }))
  const galleryMedia = [
    ...(project.hero_image_url ? [project.hero_image_url] : []),
    ...(Array.isArray(project.images) ? project.images : []),
  ]

  const titleTransitionName = getEntityViewTransitionName('project', project.id, 'title')

  return (
    <div
      className={cn(
        'relative flex flex-col overflow-x-hidden',
        isPageMode ? 'min-h-screen bg-background' : 'h-full min-h-full bg-transparent',
      )}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Glow discret sous le hero – donne l'ambiance du projet */}
        <div
          className="absolute -right-24 top-20 h-64 w-64 rounded-full blur-[100px]"
          style={{ backgroundColor: `rgb(${glowRgb} / 0.07)` }}
        />
        {/* Glow de destination – attire doucement le regard vers le CTA */}
        <div
          className="absolute bottom-0 left-1/2 h-80 w-[36rem] -translate-x-1/2 translate-y-1/3 rounded-full blur-[140px]"
          style={{ backgroundColor: `rgb(${glowRgb} / 0.12)` }}
        />
      </div>

      <div
        className={cn(
          'relative flex min-h-0 flex-1 flex-col overflow-x-hidden',
          !isPageMode && 'h-full',
        )}
      >
        <div
          className={cn(
            'flex-1 overflow-x-hidden pb-4',
            isPageMode
              ? 'overflow-visible'
              : 'min-h-0 overflow-y-auto overscroll-contain overscroll-x-none touch-pan-y',
          )}
        >
          <ProjectQuickViewHero
            coverImage={coverImage}
            media={galleryMedia}
            projectId={project.id}
            projectName={projectName}
            projectSlug={project.slug}
          />

          <aside className="space-y-3 px-4 pt-5 sm:px-5 lg:px-6">
            <h1
              className="text-3xl font-black tracking-tighter text-foreground sm:text-4xl"
              style={{ viewTransitionName: titleTransitionName }}
            >
              {projectName}
            </h1>

            <div className="flex flex-wrap gap-2">
              {typeLabel ? (
                <Badge
                  variant="outline"
                  className="border-primary/25 bg-primary/5 text-primary"
                >
                  {typeLabel}
                </Badge>
              ) : null}
              {locationLabel ? (
                <Badge variant="outline" className="border-border/60 bg-background/70">
                  <MapPin className="mr-1 h-3.5 w-3.5" />
                  {locationLabel}
                </Badge>
              ) : null}
            </div>
          </aside>

          <div className="mt-5 space-y-8 pb-40 sm:pb-44 lg:px-6">
            {projectDescription ? (
              <p className="whitespace-pre-wrap px-4 text-sm leading-relaxed text-pretty text-white/80 sm:px-5 sm:text-base">
                {projectDescription}
              </p>
            ) : null}

            <div className="px-4 sm:px-5">
              <ProjectSpeciesTeaser isDonationProject={isDonationProject} />
            </div>

            <div className="px-4 sm:px-5">
              <ProjectImpactCalculator
                baseAmount={100}
                amount={currentFunding}
                mode="project"
                isDonationProject={isDonationProject}
                donationOptions={project.donation_options || undefined}
                projectType={project.type || undefined}
                projectImpact={project.expected_impact}
                showSpeciesCard={false}
              />
            </div>

            {project.producer ? (
              producerHref ? (
                <a
                  href={producerHref}
                  className="group block w-full cursor-pointer border-y border-white/5 px-4 py-3 transition-all duration-200 hover:bg-white/[0.02] active:bg-white/[0.04] sm:px-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400/60"
                >
                  <div className="-mx-2 flex items-center gap-4 rounded-2xl px-2 py-2 transition-all duration-200 group-hover:bg-white/5 group-active:scale-[0.99] group-active:bg-white/10">
                    {producerImage ? (
                      <img
                        src={producerImage}
                        alt={organizerName}
                        className="h-12 w-12 shrink-0 rounded-full object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-base font-bold text-primary">
                        {organizerName?.[0]?.toUpperCase() || 'M'}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-foreground underline-offset-4 group-hover:underline">
                        {organizerName}
                      </p>
                      <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
                        {organizerDescription}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-white/35 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-white/60" />
                  </div>
                </a>
              ) : (
                <section className="flex items-center gap-4 border-y border-white/5 px-4 py-3 sm:px-5">
                  <div className="flex w-full items-center gap-4">
                    {producerImage ? (
                      <img
                        src={producerImage}
                        alt={organizerName}
                        className="h-12 w-12 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-base font-bold text-primary">
                        {organizerName?.[0]?.toUpperCase() || 'M'}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-foreground">{organizerName}</p>
                      <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
                        {organizerDescription}
                      </p>
                    </div>
                    {websiteUrl && websiteLabel ? (
                      <a
                        href={websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-primary hover:underline"
                      >
                        <Globe className="h-3 w-3" />
                        {websiteLabel}
                      </a>
                    ) : null}
                  </div>
                </section>
              )
            ) : null}

            <div className="px-4 sm:px-5">
              <div>
                <div className="mb-2 flex items-baseline justify-between">
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold tabular-nums tracking-tight text-emerald-400">
                      {formatAmountNumber(currentFunding)}{' '}
                      <span className="text-lg text-emerald-400/70">EUR</span>
                    </span>
                    <span className="ml-2 text-sm font-medium tabular-nums text-white/50">
                      / {formatAmountNumber(targetBudget)} EUR
                    </span>
                  </div>
                  <span className="text-sm font-bold tabular-nums tracking-tight text-white">
                    {Math.round(fundingProgress)}%
                  </span>
                </div>
                <Progress
                  value={fundingProgress}
                  className="h-2 rounded-full bg-muted"
                  indicatorClassName="bg-gradient-to-r from-primary to-marketing-positive-600"
                />
                <p className="mt-2 text-xs text-white/40">
                  Cet objectif couvre l&apos;équipement, le suivi terrain et la valorisation des produits du projet.
                </p>
              </div>
            </div>

            {!isDonationProject && resolvedProducerProducts && resolvedProducerProducts.length > 0 ? (
              <div className="px-4 sm:px-5">
                <ProjectProducerProductsSection products={resolvedProducerProducts} />
              </div>
            ) : null}

            <div className="w-full max-w-full overflow-hidden px-4 sm:px-5">
              <SimilarProjectsCarousel
                currentProjectTags={[project.type || 'beehive']}
                locale={locale}
                relatedProjects={resolvedRelatedProjects}
              />
            </div>
          </div>
        </div>

        <BottomActionBar className={isPageMode ? 'sticky bottom-0 z-20' : 'fixed bottom-0 left-0 right-0 z-40 w-full'}>
          {isFundingClosed ? (
            <Button
              className="h-14 w-full justify-center gap-0 rounded-2xl bg-white/10 text-center text-lg font-black text-muted-foreground hover:bg-white/10 [&_svg]:hidden"
              disabled
            >
              {t('detail.funding_closed')}
            </Button>
          ) : (
            <Link href={investPath} className="block w-full">
              <Button className="h-14 w-full items-center justify-center rounded-2xl bg-lime-400 text-lg font-black text-black transition-transform active:scale-95 [&_svg]:hidden">
                {isDonationProject ? 'Faire un don' : 'Soutenir ce projet'}
              </Button>
            </Link>
          )}
        </BottomActionBar>
      </div>
    </div>
  )
}
