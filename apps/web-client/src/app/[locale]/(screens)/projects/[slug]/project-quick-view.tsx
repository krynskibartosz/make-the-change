import { Button, Progress } from '@make-the-change/core/ui'
import { ChevronRight, Globe } from 'lucide-react'
import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { sanitizeImageUrl } from '@/lib/image-url'
import { resolveCountryCode, getCountryDisplayName } from '@/lib/location'
import type { ProducerProduct, ProjectSpecies } from '@/app/[locale]/(screens)/projects/_types/project'
import { getLocalizedContent } from '@/lib/utils'
import { getEntityViewTransitionName } from '@/lib/view-transition'
import { ProjectProducerProductsSection } from './_components/shared/producer-products'
import { ProjectQuickViewHero } from './_components/quick-view/hero'
import { SimilarProjectsCarousel } from './_components/shared/similar-projects-carousel'
import { ProjectLearningLinks } from './_components/shared/learning-links'
import { ProjectImpactPreview } from './_components/quick-view/impact-preview'
import { ProjectBiodexSheet } from './_components/quick-view/biodex-sheet'
import { ProjectCountrySheet } from './_components/quick-view/country-sheet'
import { ProjectFundingSheet } from './_components/quick-view/funding-sheet'
import { ProjectUpdatesFeed } from './_components/project-updates-feed'
import { getMockProjectUpdates } from '@/lib/mock/mock-project-updates'
import { BottomActionBar } from '@/app/[locale]/_components/bottom-action-bar'
import type { PublicProject, RelatedProject } from './project-detail-data'
import { buildProjectImpactItems } from './_utils/build-project-impact-items'
import { type ProjectGlowTone, getProjectGlowTone, makeProjectGlowRgba } from './_utils/project-glow'
import { formatAmountNumber } from '@/lib/formatters'

type ProjectQuickViewProps = {
  project: PublicProject
  species: ProjectSpecies[] | null
  producerProducts: ProducerProduct[] | null
  relatedProjects: RelatedProject[]
}

const PROGRESS_INDICATOR_CLASS: Record<ProjectGlowTone, string> = {
  yellow: 'bg-gradient-to-r from-amber-500/60 to-lime-400/50',
  blue:   'bg-gradient-to-r from-sky-500/60 to-teal-400/50',
  green:  'bg-gradient-to-r from-emerald-600/60 to-emerald-400/50',
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
  species,
  producerProducts,
  relatedProjects,
}: ProjectQuickViewProps) {
  const [t, locale] = await Promise.all([getTranslations('projects'), getLocale()])

  const glowTone = getProjectGlowTone(project.type)
  const glowRgba = makeProjectGlowRgba(project.type)

  const currentFunding = project.current_funding || 0
  const targetBudget = project.target_budget || 0
  const fundingProgress = project.funding_progress ?? (
    targetBudget > 0 ? Math.min((currentFunding / targetBudget) * 100, 100) : 0
  )

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
  const projectName = getLocalizedContent(project.name_i18n, locale, project.name_default)

  // Short description for the hero (1–2 sentences, decisive)
  const projectDescription = getLocalizedContent(
    project.description_i18n,
    locale,
    project.description_default || '',
  )

  // Narrative description for the story sheet (long_description preferred, falls back to short)
  const narrativeDescription = getLocalizedContent(
    project.long_description_i18n,
    locale,
    project.long_description_default || projectDescription,
  )

  const producerName = project.producer
    ? getLocalizedContent(project.producer.name_i18n, locale, project.producer.name_default)
    : 'Make the Change'
  const producerDescription = project.producer
    ? getLocalizedContent(
        project.producer.description_i18n,
        locale,
        project.producer.description_default || '',
      )
    : t('subtitle')
  const websiteUrl = project.producer?.contact_website || null
  const websiteLabel = getWebsiteLabel(websiteUrl)
  const producerHref =
    project.producer && (project.producer.slug || project.producer.id)
      ? `/producers/${project.producer.slug || project.producer.id}`
      : null

  const isDonationProject = !!(project.is_donation_project && project.donation_options)
  const supportPath = isDonationProject
    ? `/projects/${project.slug}/donate?source=quick_view`
    : `/projects/${project.slug}/support?source=quick_view`

  const galleryMedia = [
    ...new Set([
      ...(project.hero_image_url ? [project.hero_image_url] : []),
      ...(Array.isArray(project.images) ? project.images : []),
    ]),
  ]

  const titleTransitionName = getEntityViewTransitionName('project', project.id, 'title')

  const impactItems = buildProjectImpactItems({
    amount: currentFunding,
    projectType: project.type,
    isDonationProject,
    donationOptions: project.donation_options,
    projectImpact: project.expected_impact,
  })

  const partnerLabel = isDonationProject ? 'Partenaire terrain' : 'Producteur partenaire'
  const fundingTitle = isDonationProject ? 'Objectif de don' : 'Objectif de soutien'
  const fundingSubtext = isDonationProject
    ? 'Restauration, suivi terrain, matériel et mises à jour du projet.'
    : 'Équipement, suivi terrain, structuration de la filière et valorisation des produits du partenaire.'
  const projectContextLabel = (() => {
    if (isDonationProject) return 'Projet biodiversité'
    if (project.type === 'beehive') return 'Apiculteurs accompagnés'
    if (project.type === 'coral' || project.type === 'reef') return 'Restauration marine'
    if (project.type === 'orchard') return 'Producteurs accompagnés'
    return 'Filière locale'
  })()
  const ctaProofLine = isDonationProject
    ? `Suivi terrain · Don sans contrepartie · ${projectContextLabel}`
    : `Suivi terrain · Crédits Impact possibles · ${projectContextLabel}`
  const similarTitle = getSimilarProjectsTitle(project.type)

  return (
    <div className="relative flex h-full flex-col overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -right-20 -top-24 h-72 w-72 rounded-full blur-3xl"
          style={{ backgroundColor: glowRgba(0.12) }}
        />
        <div
          className="absolute -bottom-20 -left-24 h-72 w-72 rounded-full blur-3xl"
          style={{ backgroundColor: glowRgba(0.15) }}
        />
      </div>

      <div className="relative flex min-h-0 flex-1 flex-col overflow-x-hidden h-full">
        <div
          data-modal-scroll-root
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain overscroll-x-none touch-pan-y"
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
          <div className="px-4 pt-5 sm:px-5">
            {project.address_country_code && countryName ? (
              <ProjectCountrySheet
                countryCode={resolvedIso ?? project.address_country_code}
                countryName={countryName}
                city={project.address_city}
                projectType={project.type}
                speciesCount={species?.length ?? 0}
                relatedProjects={relatedProjects}
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


          </div>

          {/* 3. Partenaire */}
          {project.producer ? (
            <div className="mt-10">
              <div className="h-px bg-white/[0.06]" />
              <p className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.16em] text-white/25 sm:px-5">
                {partnerLabel}
              </p>
              <div className="h-px bg-white/[0.06]" />

              {producerHref ? (
                <Link
                  href={producerHref}
                  className="group flex w-full cursor-pointer items-center gap-4 px-4 py-4 transition-all duration-200 hover:bg-white/[0.03] active:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-lime-400/60 sm:px-5"
                >
                  {producerImage ? (
                    <img
                      src={producerImage}
                      alt={producerName}
                      className="h-12 w-12 shrink-0 rounded-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-base font-bold text-primary">
                      {producerName?.[0]?.toUpperCase() || 'M'}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-foreground underline-offset-4 group-hover:underline">
                      {producerName}
                    </p>
                    <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
                      {producerDescription}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-white/20" />
                </Link>
              ) : (
                <div className="flex w-full items-center gap-4 px-4 py-4 sm:px-5">
                  {producerImage ? (
                    <img
                      src={producerImage}
                      alt={producerName}
                      className="h-12 w-12 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-base font-bold text-primary">
                      {producerName?.[0]?.toUpperCase() || 'M'}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-foreground">{producerName}</p>
                    <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
                      {producerDescription}
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
            {/* 4. Comprendre ce projet */}
            <div className="mt-14 px-4 sm:px-5">
              <ProjectBiodexSheet
                species={species ?? []}
                projectType={project.type}
                projectSlug={project.slug}
                isDonationProject={isDonationProject}
                description={narrativeDescription}
                producerName={project.producer ? producerName : undefined}
                producerLocation={[project.address_city, countryName].filter(Boolean).join(' · ') || undefined}
              />
            </div>

            {/* Nouvelles du terrain (point d'accès compact → bottom sheet) */}
            <div className="mt-8 px-4 sm:px-5">
              <ProjectUpdatesFeed updates={getMockProjectUpdates(project.slug)} />
            </div>

            {/* 5. Ce que le projet permet */}
            {impactItems.length > 0 ? (
              <div className="mt-14 px-4 sm:px-5">
                <ProjectImpactPreview
                  items={impactItems}
                  accentColor={glowRgba(1)}
                />
              </div>
            ) : null}

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
                      style={{ color: glowRgba(0.90) }}
                    >
                      {formatAmountNumber(currentFunding)}{' '}
                      <span style={{ color: glowRgba(0.55) }} className="text-lg">EUR</span>
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
                indicatorClassName={PROGRESS_INDICATOR_CLASS[glowTone]}
              />
            </div>

            <div className="mt-14 px-4 sm:px-5">
              <ProjectLearningLinks projectSlug={project.slug} />
            </div>

            {/* 7. Produits partenaires (soutien uniquement) */}
            {!isDonationProject && producerProducts && producerProducts.length > 0 ? (
              <div className="mt-16 px-4 sm:px-5">
                <ProjectProducerProductsSection products={producerProducts} />
              </div>
            ) : null}

            {/* 8. Projets similaires */}
            <div className="mt-16 w-full max-w-full overflow-hidden px-4 sm:px-5">
              <SimilarProjectsCarousel
                locale={locale}
                relatedProjects={relatedProjects}
                title={similarTitle}
              />
            </div>
          </div>
        </div>

        {/* 9. CTA sticky */}
        <BottomActionBar className="fixed bottom-0 left-0 right-0 z-40 w-full">
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
