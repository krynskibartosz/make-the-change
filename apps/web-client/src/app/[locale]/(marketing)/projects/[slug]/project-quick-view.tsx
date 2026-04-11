import { Badge, Button, Progress } from '@make-the-change/core/ui'
import { ChevronRight, Globe, Leaf, MapPin } from 'lucide-react'
import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { sanitizeImageUrl } from '@/lib/image-url'
import { getLocalizedContent } from '@/lib/utils'
import { getEntityViewTransitionName } from '@/lib/view-transition'
import { ProjectImpactCalculator } from './components/project-impact-calculator'
import { SimilarProjectsCarousel } from './components/similar-projects-carousel'
import { getRelatedProjectsByType, type PublicProject } from './project-detail-data'
import { ProjectFavoriteButton } from './project-favorite-button'
import { ProjectShareButton } from './project-share-button'

type ProjectQuickViewProps = {
  project: PublicProject
}

const formatBadgeLabel = (value: string | null | undefined): string | null => {
  if (!value) return null
  const normalized = value.replace(/[_-]+/g, ' ').trim()
  if (!normalized) return null
  return normalized.replace(/\b\w/g, (match) => match.toUpperCase())
}

/** Formate un montant sans symbole monétaire (18 000) */
const formatAmountNumber = (amount: number): string =>
  new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 0,
  }).format(amount)

const getWebsiteLabel = (url: string | null): string | null => {
  if (!url) return null
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

export async function ProjectQuickView({ project }: ProjectQuickViewProps) {
  const t = await getTranslations('projects')
  const locale = await getLocale()

  const currentFunding = project.current_funding || 0
  const targetBudget = project.target_budget || 0
  const fundingProgress =
    targetBudget > 0 ? Math.min((currentFunding / targetBudget) * 100, 100) : 0

  const coverImage =
    sanitizeImageUrl(project.hero_image_url) ||
    (Array.isArray(project.images) && project.images.length > 0
      ? sanitizeImageUrl(project.images[0])
      : undefined)

  const producerImage =
    project.producer?.images &&
    Array.isArray(project.producer.images) &&
    project.producer.images.length > 0
      ? sanitizeImageUrl(project.producer.images[0])
      : undefined

  const locationLabel = [project.address_city, project.address_country_code]
    .filter(Boolean)
    .join(', ')
  const normalizedStatus = project.status?.toLowerCase() || null
  const isFundingClosed = normalizedStatus === 'completed' || normalizedStatus === 'funded'
  const typeLabel = formatBadgeLabel(project.type)

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
  const investPath = `/projects/${project.slug}/invest?source=quick_view`
  const relatedProjects = await getRelatedProjectsByType({
    type: project.type,
    excludeProjectId: project.id,
    excludeProjectSlug: project.slug,
    limit: 3,
  })

  const mediaTransitionName = getEntityViewTransitionName('project', project.id, 'media')
  const titleTransitionName = getEntityViewTransitionName('project', project.id, 'title')

  return (
    <div className="relative flex h-full min-h-full flex-col overflow-x-hidden bg-transparent">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-24 h-72 w-72 rounded-full bg-marketing-positive-500/10 blur-3xl" />
      </div>

      <div className="relative flex h-full min-h-0 flex-col overflow-x-hidden">
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain overscroll-x-none touch-pan-y pb-4">

          {/* ── Hero Image avec Like en overlay ── */}
          <section>
            <div
              className="relative h-48 overflow-hidden bg-muted/40 sm:h-56"
              style={{ viewTransitionName: mediaTransitionName }}
            >
              {coverImage ? (
                <img src={coverImage} alt={projectName} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-muted">
                  <Leaf className="h-16 w-16 text-primary/50" />
                </div>
              )}
              {/* Gradient bas pour faire respirer le Hero */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

              {/* ── Share + Like repositionnés sur l'image ── */}
              <div className="absolute bottom-4 right-4 z-20 flex gap-2">
                <ProjectShareButton
                  projectName={projectName}
                  projectSlug={project.slug}
                  className="w-10 h-10 rounded-full bg-black/50 text-white backdrop-blur-md border border-white/20 shadow-lg flex items-center justify-center transition-all active:scale-95 hover:bg-black/70"
                />
                <ProjectFavoriteButton
                  projectName={projectName}
                  projectId={project.id}
                  className="w-10 h-10 rounded-full bg-black/50 text-white backdrop-blur-md border border-white/20 shadow-lg flex items-center justify-center transition-all active:scale-95 hover:bg-black/70"
                />
              </div>
            </div>
          </section>

          {/* ── Titre + Tags ── */}
          <aside className="space-y-3 px-4 pt-5 sm:px-5 lg:px-6">
            <h1
              className="text-3xl font-black tracking-tighter text-foreground sm:text-4xl"
              style={{ viewTransitionName: titleTransitionName }}
            >
              {projectName}
            </h1>

            {/* Tags catégorie + localisation uniquement (pas le statut) */}
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

            {/* Executive summary */}
            <div className="pt-1">
              <div className="mb-2 flex items-baseline justify-between">
                <div className="flex items-baseline">
                  <span className="text-4xl font-black text-lime-400 tabular-nums tracking-tight">
                    {formatAmountNumber(currentFunding)}{' '}
                    <span className="text-2xl text-lime-400/80">€</span>
                  </span>
                  <span className="ml-2 text-sm font-medium text-white/50 tabular-nums">
                    / {formatAmountNumber(targetBudget)} €
                  </span>
                </div>
                <span className="text-sm font-bold text-white tabular-nums tracking-tight">
                  {Math.round(fundingProgress)}%
                </span>
              </div>
              <Progress
                value={fundingProgress}
                className="h-2 rounded-full bg-muted"
                indicatorClassName="bg-gradient-to-r from-primary to-marketing-positive-600"
              />
            </div>
          </aside>

          {/* ── Corps éditorial ── */}
          <div className="mt-5 space-y-6  pb-40   sm:pb-44 lg:px-6">

            {/* Description : texte nu, sans card */}
            {projectDescription ? (
              
                <p className="whitespace-pre-wrap px-4 sm:px-5 text-sm leading-relaxed text-white/80 text-pretty sm:text-base">
                  {projectDescription}
                </p>
              
            ) : null}

            {/* Producteur : flex inline avec séparateurs subtils */}
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
                      <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                        {organizerDescription}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-white/35 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-white/60" />
                  </div>
                </a>
              ) : (
                <section className="flex items-center gap-4 border-y border-white/5 px-4 py-3 sm:px-5">
                  <div className="flex items-center gap-4 w-full">
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
                      <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                        {organizerDescription}
                      </p>
                    </div>
                    {websiteUrl && websiteLabel ? (
                      <span className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                        <Globe className="h-3 w-3" />
                        {websiteLabel}
                      </span>
                    ) : null}
                  </div>
                </section>
              )
            ) : null}
<div className='px-4 sm:px-5'>

            <ProjectImpactCalculator baseAmount={100} amount={currentFunding} mode="project" />
</div>

            <div className="w-full px-4 sm:px-5 max-w-full overflow-hidden">
              <SimilarProjectsCarousel
                currentProjectTags={[project.type || 'beehive']}
                locale={locale}
                relatedProjects={relatedProjects}
              />
            </div>
          </div>
        </div>

        <div className="relative shrink-0 border-t border-white/10 bg-background/95 px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-xl">
          {isFundingClosed ? (
            <Button
              className="h-14 w-full rounded-2xl bg-white/10 text-center text-lg font-black text-muted-foreground hover:bg-white/10 justify-center gap-0 [&_svg]:hidden"
              disabled
            >
              {t('detail.funding_closed')}
            </Button>
          ) : (
            <Link href={investPath} className="block w-full">
              <Button className="w-full h-14 flex items-center justify-center bg-lime-400 text-black font-black text-lg rounded-2xl active:scale-95 transition-transform [&_svg]:hidden">
                Soutenir ce projet
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
