import { Badge, Button, Progress } from '@make-the-change/core/ui'
import { Calendar, Globe, Leaf, MapPin, Target } from 'lucide-react'
import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { sanitizeImageUrl } from '@/lib/image-url'
import { createClient } from '@/lib/supabase/server'
import { cn, formatCurrency, getLocalizedContent } from '@/lib/utils'
import { getEntityViewTransitionName } from '@/lib/view-transition'
import type { PublicProject } from './project-detail-data'
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

/** Formate un montant en euros sans décimales (18 000 € au lieu de 18 000,00 €) */
const formatAmount = (amount: number): string =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
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
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

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
  const launchDate = project.launch_date
    ? new Date(project.launch_date).toLocaleDateString(locale)
    : null
  const maturityDate = project.maturity_date
    ? new Date(project.maturity_date).toLocaleDateString(locale)
    : null

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
  const investCtaHref = user ? investPath : `/login?returnTo=${encodeURIComponent(investPath)}`

  const mediaTransitionName = getEntityViewTransitionName('project', project.id, 'media')
  const titleTransitionName = getEntityViewTransitionName('project', project.id, 'title')

  return (
    <div className="relative flex h-full min-h-full flex-col bg-transparent">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-24 h-72 w-72 rounded-full bg-marketing-positive-500/10 blur-3xl" />
      </div>

      <div className="relative flex h-full min-h-0 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-4 ">

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
              className="text-3xl font-black tracking-tight text-foreground sm:text-4xl"
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

            {/* ── 1. Barre de progression uniquement (sans le texte "72% de l'objectif") ── */}
            <div className="pt-1">
              <Progress
                value={fundingProgress}
                className="h-2 rounded-full bg-muted"
                indicatorClassName="bg-gradient-to-r from-primary to-marketing-positive-600"
              />
            </div>
          </aside>

          {/* ── Corps éditorial ── */}
          <div className="mt-5 space-y-6 px-4 pb-36 sm:px-5 sm:pb-44 lg:px-6">

            {/* Description : texte nu, sans card */}
            {projectDescription ? (
              <section>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground text-pretty sm:text-base">
                  {projectDescription}
                </p>
              </section>
            ) : null}

            {/* Producteur : flex inline avec séparateurs subtils */}
            {project.producer ? (
              <section className="flex items-center gap-4 border-y border-white/5 py-4">
                {producerHref ? (
                  <a href={producerHref} className="flex items-center gap-4 w-full group">
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
                    {websiteUrl && websiteLabel ? (
                      <span className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                        <Globe className="h-3 w-3" />
                        {websiteLabel}
                      </span>
                    ) : null}
                  </a>
                ) : (
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
                )}
              </section>
            ) : null}

            {/* Dates : icônes grises inline, pas de card */}
            {launchDate || maturityDate ? (
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                {launchDate ? (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                    <span>{launchDate}</span>
                  </div>
                ) : null}
                {maturityDate ? (
                  <div className="flex items-center gap-2">
                    <Target className="h-3.5 w-3.5 shrink-0" />
                    <span>{maturityDate}</span>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>

        {/* ── 3. Sticky Bottom Bar refactorisée (sans le Like, CTA full-width) ── */}
        <div className="relative shrink-0 border-t border-white/10 bg-background/60 px-5 py-5 backdrop-blur-xl sm:px-6 sm:py-6">
          <div className="pointer-events-none absolute inset-x-0 -top-12 h-12 bg-gradient-to-t from-background/60 to-transparent" />

          {/* Ligne 1 : métriques full-width */}
          <div className="flex items-baseline justify-between mb-4 px-1">
            {/* Pôle Gauche : L'argent */}
            <div>
              <span className="text-3xl font-black text-lime-400">{formatAmount(currentFunding)}</span>
              <span className="text-sm font-medium text-muted-foreground ml-1">/ {formatAmount(targetBudget)}</span>
            </div>
            {/* Pôle Droite : La progression */}
            <div className="text-right">
              <span className="text-sm font-bold text-foreground">{Math.round(fundingProgress)}% de l&apos;objectif</span>
            </div>
          </div>

          {/* CTA seul, pleine largeur */}
          {isFundingClosed ? (
            <Button className="h-14 w-full rounded-2xl text-base font-bold" disabled>
              {t('detail.funding_closed')}
            </Button>
          ) : (
            <Link href={investCtaHref} className="block w-full">
              <Button className="h-14 w-full rounded-2xl text-base font-bold shadow-lg shadow-primary/30">
                Soutenir ce projet
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
