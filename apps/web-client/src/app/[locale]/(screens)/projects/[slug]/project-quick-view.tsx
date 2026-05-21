import { Badge, Button, Progress } from '@make-the-change/core/ui'
import { ChevronRight, Globe } from 'lucide-react'
import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getProjectContext } from '@/app/[locale]/(screens)/projects/_api/project-context.service'
import { getSpeciesForProject } from '@/app/[locale]/(screens)/projects/_api/project-species.service'
import { sanitizeImageUrl } from '@/lib/image-url'
import { resolveCountryCode, getCountryDisplayName } from '@/lib/location'
import type { DonationOption, ProducerProduct } from '@/app/[locale]/(screens)/projects/_types/project'
import { cn, getLocalizedContent } from '@/lib/utils'
import { getEntityViewTransitionName } from '@/lib/view-transition'
import { ProjectProducerProductsSection } from './_components/shared/producer-products'
import { ProjectQuickViewHero } from './_components/quick-view/hero'
import { SimilarProjectsCarousel } from './_components/shared/similar-projects-carousel'
import { ProjectSpeciesTeaser } from './_components/shared/species-teaser'
import { ProjectLearningLinks } from './_components/shared/learning-links'
import { ProjectStorySheet } from './_components/quick-view/story-sheet'
import { ProjectImpactPreview } from './_components/quick-view/impact-preview'
import { ProjectTrackingPreview } from './_components/quick-view/tracking-preview'
import { ProjectBiodexSheet } from './_components/quick-view/biodex-sheet'
import { ProjectCountrySheet } from './_components/quick-view/country-sheet'
import { ProjectFundingSheet } from './_components/quick-view/funding-sheet'
import { BottomActionBar } from '@/app/[locale]/_components/bottom-action-bar'
import {
  getRelatedProjectsByType,
  type PublicProject,
  type RelatedProject,
} from './project-detail-data'
import { buildProjectImpactItems } from './_utils/build-project-impact-items'
import { formatAmountNumber } from '@/lib/formatters'

type ProjectQuickViewProps = {
  project: PublicProject
  mode?: 'modal' | 'page'
  producerProducts?: ProducerProduct[] | null
  relatedProjects?: RelatedProject[]
}

// ─── Glow contextuel par type de projet ────────────────────────────────────
type ProjectGlowTone = 'yellow' | 'green' | 'blue'

const PROJECT_GLOW: Record<ProjectGlowTone, { r: number; g: number; b: number }> = {
  yellow: { r: 245, g: 158, b: 11  },
  green:  { r: 16,  g: 185, b: 129 },
  blue:   { r: 14,  g: 165, b: 233 },
}

// Muted contextual gradients for the funding progress bar.
// Lower saturation than CTA (lime-400) so it never competes with it.
const PROGRESS_INDICATOR_CLASS: Record<ProjectGlowTone, string> = {
  yellow: 'bg-gradient-to-r from-amber-500/60 to-lime-400/50',
  blue:   'bg-gradient-to-r from-sky-500/60 to-teal-400/50',
  green:  'bg-gradient-to-r from-emerald-600/60 to-emerald-400/50',
}

function getProjectGlowTone(type: string | null | undefined): ProjectGlowTone {
  const t = type?.toLowerCase() ?? ''
  if (t.includes('coral') || t.includes('reef') || t.includes('ocean')) return 'blue'
  if (t.includes('agroforestry') || t.includes('orchard') || t.includes('olive') || t.includes('forest') || t.includes('tree')) return 'green'
  return 'yellow'
}

function glowRgba(tone: { r: number; g: number; b: number }, alpha: number): string {
  return `rgba(${tone.r}, ${tone.g}, ${tone.b}, ${alpha})`
}
// ────────────────────────────────────────────────────────────────────────────

const formatBadgeLabel = (value: string | null | undefined, locale: string): string | null => {
  if (!value) return null
  const normalized = value.replace(/[_-]+/g, ' ').trim()
  if (!normalized) return null

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

function getSimilarProjectsTitle(type: string | null | undefined): string {
  const t = type?.toLowerCase() ?? ''
  if (t.includes('coral') || t.includes('reef') || t.includes('ocean')) {
    return 'Autres projets liés aux océans'
  }
  if (t.includes('orchard') || t.includes('olive') || t.includes('forest') || t.includes('tree')) {
    return 'Autres projets liés aux terres vivantes'
  }
  return 'Autres projets liés aux pollinisateurs'
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
  const glow = PROJECT_GLOW[glowTone]

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
    project.producer?.visualAssets?.portrait
      ? sanitizeImageUrl(project.producer.visualAssets.portrait) ?? undefined
      : project.producer?.images &&
        Array.isArray(project.producer.images) &&
        project.producer.images.length > 0
        ? sanitizeImageUrl(project.producer.images[0]) ?? undefined
        : undefined

  const resolvedIso = project.address_country_code
    ? resolveCountryCode(project.address_country_code)
    : null
  const countryName = resolvedIso
    ? getCountryDisplayName(resolvedIso, locale)
    : project.address_country_code ?? null
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
  const supportPath = isDonationProject
    ? `/projects/${project.slug}/donate?source=quick_view`
    : `/projects/${project.slug}/support?source=quick_view`

  const projectContext =
    producerProducts === undefined && !project.is_mock ? await getProjectContext(project.slug) : null
  const resolvedProducerProducts =
    producerProducts ?? projectContext?.producer_products ?? project.producer_products ?? null
  const resolvedSpecies = await getSpeciesForProject(project.slug, project.id)

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

  const impactItems = buildProjectImpactItems({
    amount: currentFunding,
    projectType: project.type,
    isDonationProject,
    donationOptions: project.donation_options,
    projectImpact: project.expected_impact,
  })

  const contributionLabel = isDonationProject ? 'Don terrain' : 'Soutien producteur'
  const partnerLabel = isDonationProject ? 'Partenaire terrain' : 'Producteur partenaire'
  const fundingTitle = isDonationProject ? 'Objectif de don' : 'Objectif de soutien'
  const fundingSubtext = isDonationProject
    ? 'Restauration, suivi terrain, matériel et mises à jour du projet.'
    : 'Équipement, suivi terrain, structuration de la filière et valorisation des produits du partenaire.'
  const ctaProofLine = isDonationProject
    ? 'Suivi inclus · Graines possibles · Projet documenté'
    : 'Suivi inclus · Crédits Impact possibles · Projet documenté'
  const similarTitle = getSimilarProjectsTitle(project.type)

  return (
    <div
      className={cn(
        'relative flex flex-col overflow-x-hidden',
        isPageMode ? 'min-h-screen bg-background' : 'h-full min-h-full bg-transparent',
      )}
    >
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -right-20 -top-24 h-72 w-72 rounded-full blur-3xl"
          style={{ backgroundColor: glowRgba(glow, 0.12) }}
        />
        <div
          className="absolute -bottom-20 -left-24 h-72 w-72 rounded-full blur-3xl"
          style={{ backgroundColor: glowRgba(glow, 0.15) }}
        />
      </div>

      <div
        className={cn(
          'relative flex min-h-0 flex-1 flex-col overflow-x-hidden',
          !isPageMode && 'h-full',
        )}
      >
        <div
          data-modal-scroll-root
          className={cn(
            'flex-1 overflow-x-hidden',
            isPageMode
              ? 'overflow-visible'
              : 'min-h-0 overflow-y-auto overscroll-contain overscroll-x-none touch-pan-y',
          )}
        >
          {/* 1. Hero */}
          <ProjectQuickViewHero
            coverImage={coverImage}
            media={galleryMedia}
            projectId={project.id}
            projectName={projectName}
            projectSlug={project.slug}
          />

          {/* 2. Intro */}
          <aside className="px-4 pt-5 sm:px-5">
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className="border-white/15 bg-white/8 text-white/70"
              >
                {contributionLabel}
              </Badge>
              {typeLabel ? (
                <Badge
                  variant="outline"
                  style={{
                    borderColor: glowRgba(glow, 0.30),
                    backgroundColor: glowRgba(glow, 0.08),
                    color: glowRgba(glow, 0.90),
                  }}
                >
                  {typeLabel}
                </Badge>
              ) : null}
            </div>

            {project.address_country_code && countryName ? (
              <ProjectCountrySheet
                countryCode={resolvedIso ?? project.address_country_code}
                countryName={countryName}
                city={project.address_city}
                projectType={project.type}
                speciesCount={resolvedSpecies?.length ?? 0}
                relatedProjects={resolvedRelatedProjects}
                latitude={project.latitude}
                longitude={project.longitude}
                locale={locale}
              />
            ) : null}

            <h1
              className="mt-3 text-3xl font-black tracking-tighter text-foreground sm:text-4xl"
              style={{ viewTransitionName: titleTransitionName }}
            >
              {projectName}
            </h1>

            {projectDescription ? (
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-white/75 sm:text-base">
                {projectDescription}
              </p>
            ) : null}

            <ProjectStorySheet
              description={projectDescription}
              title={projectName}
              producerName={project.producer ? organizerName : undefined}
              producerLocation={[project.address_city, countryName].filter(Boolean).join(' · ') || undefined}
              projectType={project.type}
              isDonationProject={isDonationProject}
            />
          </aside>

          {/* 3. Partenaire */}
          {project.producer ? (
            <div className="mt-10">
              <div className="h-px bg-white/[0.06]" />
              <p className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.16em] text-white/25 sm:px-5">
                {partnerLabel}
              </p>
              <div className="h-px bg-white/[0.06]" />

              {producerHref ? (
                <a
                  href={producerHref}
                  className="group flex w-full cursor-pointer items-center gap-4 px-4 py-4 transition-all duration-200 hover:bg-white/[0.03] active:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-lime-400/60 sm:px-5"
                >
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
                  <ChevronRight className="h-4 w-4 shrink-0 text-white/20" />
                </a>
              ) : (
                <div className="flex w-full items-center gap-4 px-4 py-4 sm:px-5">
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
              )}
            </div>
          ) : null}

          <div className="pb-40 sm:pb-44">
            {/* 4. Impact preview */}
            {impactItems.length > 0 ? (
              <div className="mt-14 px-4 sm:px-5">
                <ProjectImpactPreview
                  items={impactItems}
                  accentColor={glowRgba(glow, 1)}
                />
              </div>
            ) : null}

            {/* 5. Suivi */}
            <div className="mt-12 px-4 sm:px-5">
              <ProjectTrackingPreview
                isDonationProject={isDonationProject}
                projectType={project.type}
                producerName={project.producer ? organizerName : undefined}
              />
            </div>

            {/* 6. Objectif */}
            <div className="mt-14 px-4 sm:px-5">
              <p className="mb-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/30">
                {fundingTitle}
              </p>
              <p className="mb-3 text-xs leading-relaxed text-white/40">{fundingSubtext}</p>

              <div>
                <div className="mb-2 flex items-baseline justify-between">
                  <div className="flex items-baseline">
                    <span
                      className="text-2xl font-bold tabular-nums tracking-tight"
                      style={{ color: glowRgba(glow, 0.90) }}
                    >
                      {formatAmountNumber(currentFunding)}{' '}
                      <span style={{ color: glowRgba(glow, 0.55) }} className="text-lg">EUR</span>
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
                  className="h-2 rounded-full bg-[#141C26]"
                  indicatorClassName={PROGRESS_INDICATOR_CLASS[glowTone]}
                />
              </div>
              <ProjectFundingSheet
                targetBudget={targetBudget}
                currentFunding={currentFunding}
                fundingProgress={fundingProgress}
                projectType={project.type}
                isDonationProject={isDonationProject}
                fundingTitle={fundingTitle}
              />
            </div>

            {/* 7. Espèces liées */}
            {resolvedSpecies && resolvedSpecies.length > 0 ? (
              <div className="mt-16 px-4 sm:px-5">
                <ProjectBiodexSheet
                  species={resolvedSpecies}
                  isDonationProject={isDonationProject}
                />
                <ProjectSpeciesTeaser
                  species={resolvedSpecies}
                  accentColor={glowRgba(glow, 0.75)}
                  showHeader={false}
                />
              </div>
            ) : null}

            <div className="mt-14 px-4 sm:px-5">
              <ProjectLearningLinks projectSlug={project.slug} />
            </div>

            {/* 8. Produits partenaires (soutien uniquement) */}
            {!isDonationProject && resolvedProducerProducts && resolvedProducerProducts.length > 0 ? (
              <div className="mt-16 px-4 sm:px-5">
                <ProjectProducerProductsSection products={resolvedProducerProducts} />
              </div>
            ) : null}

            {/* 9. Projets similaires */}
            <div className="mt-16 w-full max-w-full overflow-hidden px-4 sm:px-5">
              <SimilarProjectsCarousel
                locale={locale}
                relatedProjects={resolvedRelatedProjects}
                title={similarTitle}
              />
            </div>
          </div>
        </div>

        {/* 10. CTA sticky */}
        <BottomActionBar className={isPageMode ? 'sticky bottom-0 z-20' : 'fixed bottom-0 left-0 right-0 z-40 w-full'}>
          {isFundingClosed ? (
            <Button
              className="h-14 w-full justify-center gap-0 rounded-2xl bg-white/10 text-center text-lg font-black text-muted-foreground hover:bg-white/10 [&_svg]:hidden"
              disabled
            >
              {t('detail.funding_closed')}
            </Button>
          ) : (
            <Link href={supportPath} className="block w-full">
              <Button className="h-14 w-full items-center justify-center rounded-2xl bg-lime-400 text-lg font-black text-black transition-transform active:scale-95 [&_svg]:hidden">
                {isDonationProject ? 'Faire un don' : 'Soutenir ce projet'}
              </Button>
            </Link>
          )}
          {!isFundingClosed ? (
            <p className="mt-2 text-center text-[11px] text-white/35">
              {ctaProofLine}
            </p>
          ) : null}
        </BottomActionBar>
      </div>
    </div>
  )
}
