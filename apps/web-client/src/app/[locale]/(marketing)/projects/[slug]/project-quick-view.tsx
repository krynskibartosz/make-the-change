import { Badge, Button, Progress } from '@make-the-change/core/ui'
import { Calendar, Globe, Leaf, MapPin, Sparkles, Target } from 'lucide-react'
import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { sanitizeImageUrl } from '@/lib/image-url'
import { createClient } from '@/lib/supabase/server'
import { cn, formatCurrency } from '@/lib/utils'
import { getEntityViewTransitionName } from '@/lib/view-transition'
import type { PublicProject } from './project-detail-data'
import { ProjectFavoriteButton } from './project-favorite-button'
import { ProjectShareButton } from './project-share-button'

type ProjectQuickViewProps = {
  project: PublicProject
}

const formatBadgeLabel = (value: string | null | undefined): string | null => {
  if (!value) {
    return null
  }

  const normalized = value.replace(/[_-]+/g, ' ').trim()

  if (!normalized) {
    return null
  }

  return normalized.replace(/\b\w/g, (match) => match.toUpperCase())
}

const getWebsiteLabel = (url: string | null): string | null => {
  if (!url) {
    return null
  }

  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

const getStatusLabel = (
  status: string | null,
  active: string,
  completed: string,
): string | null => {
  if (!status) {
    return null
  }

  const normalizedStatus = status.toLowerCase()

  if (normalizedStatus === 'active') {
    return active
  }

  if (
    normalizedStatus === 'completed' ||
    normalizedStatus === 'funded' ||
    normalizedStatus === 'closed'
  ) {
    return completed
  }

  return formatBadgeLabel(status)
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
  const statusLabel = getStatusLabel(
    project.status,
    t('filter.status.active'),
    t('filter.status.completed'),
  )
  const typeLabel = formatBadgeLabel(project.type)
  const launchDate = project.launch_date
    ? new Date(project.launch_date).toLocaleDateString(locale)
    : null
  const maturityDate = project.maturity_date
    ? new Date(project.maturity_date).toLocaleDateString(locale)
    : null

  const projectName = project.name_default
  const projectDescription = project.description_default || project.long_description_default || ''

  const organizerName = project.producer?.name_default || 'Make the Change'
  const organizerDescription = project.producer?.description_default || t('subtitle')
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
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-24 h-72 w-72 rounded-full bg-marketing-positive-500/10 blur-3xl" />
      </div>

      <div className="relative flex h-full min-h-0 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-4">
          <div className="grid gap-4 lg:gap-6">
            <section>
              <div
                className="relative h-[clamp(300px,48vh,500px)] overflow-hidden rounded-none border-b border-border/50 bg-muted/40 sm:h-[clamp(260px,40vh,430px)]"
                style={{ viewTransitionName: mediaTransitionName }}
              >
                {coverImage ? (
                  <img src={coverImage} alt={projectName} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-muted">
                    <Leaf className="h-16 w-16 text-primary/50" />
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-marketing-overlay-dark/35 via-transparent to-transparent" />
              </div>
            </section>

            <aside className="space-y-4 px-4 sm:px-5 lg:px-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{t('detail.about')}</span>
              </div>

              <div className="space-y-3">
                <h1
                  className="text-3xl font-black tracking-tight text-foreground sm:text-4xl"
                  style={{ viewTransitionName: titleTransitionName }}
                >
                  {projectName}
                </h1>

                <div className="flex flex-wrap gap-2">
                  {statusLabel ? (
                    <Badge
                      className={cn(
                        'border-none',
                        project.status === 'active'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground',
                      )}
                    >
                      {statusLabel}
                    </Badge>
                  ) : null}

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
              </div>
            </aside>
          </div>

          <div className="mt-4 space-y-4 px-4 pb-36 sm:px-5 sm:pb-40 lg:px-6">
            <section className="rounded-2xl border border-white/10 bg-background/40 p-4">
              <div className="mb-3 flex items-end justify-end gap-3">
                <p className="text-2xl font-black text-foreground">
                  {Math.round(fundingProgress)}%
                </p>
              </div>

              <Progress
                value={fundingProgress}
                className="h-3 rounded-full bg-muted"
                indicatorClassName="bg-gradient-to-r from-primary to-marketing-positive-600"
              />

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-muted/60 px-3 py-2">
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    {t('filter.progress.collected')}
                  </p>
                  <p className="mt-1 text-base font-black">{formatCurrency(currentFunding)}</p>
                </div>
                <div className="rounded-xl bg-muted/60 px-3 py-2 text-right">
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    {t('card.goal')}
                  </p>
                  <p className="mt-1 text-base font-black">{formatCurrency(targetBudget)}</p>
                </div>
              </div>
            </section>

            {projectDescription ? (
              <section className="rounded-2xl border border-white/10 bg-background/40 p-4">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {projectDescription}
                </p>
              </section>
            ) : null}

            {project.producer ? (
              <section className="group rounded-2xl border border-white/10 bg-background/40 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-background/60 hover:shadow-lg">
                {producerHref ? (
                  <a href={producerHref}>
                    <div className="flex items-start gap-3">
                      {producerImage ? (
                        <img
                          src={producerImage}
                          alt={organizerName}
                          className="h-14 w-14 rounded-xl object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary transition-transform duration-300 group-hover:scale-105">
                          {organizerName?.[0]?.toUpperCase() || 'M'}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-base font-bold text-foreground underline-offset-4 group-hover:underline">
                            {organizerName}
                          </p>
                        </div>
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                          {organizerDescription}
                        </p>
                        {websiteUrl && websiteLabel ? (
                          <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                            <Globe className="h-3.5 w-3.5" />
                            {websiteLabel}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </a>
                ) : (
                  <div className="flex items-start gap-3">
                    {producerImage ? (
                      <img
                        src={producerImage}
                        alt={organizerName}
                        className="h-14 w-14 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
                        {organizerName?.[0]?.toUpperCase() || 'M'}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-bold text-foreground">
                        {organizerName}
                      </p>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {organizerDescription}
                      </p>
                      {websiteUrl && websiteLabel ? (
                        <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                          <Globe className="h-3.5 w-3.5" />
                          {websiteLabel}
                        </span>
                      ) : null}
                    </div>
                  </div>
                )}
              </section>
            ) : null}

            {launchDate || maturityDate ? (
              <section className="rounded-2xl border border-white/10 bg-background/40 p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  {launchDate ? (
                    <div className="flex items-center gap-2 rounded-xl bg-muted/60 px-3 py-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold">{launchDate}</span>
                    </div>
                  ) : null}
                  {maturityDate ? (
                    <div className="flex items-center gap-2 rounded-xl bg-muted/60 px-3 py-2">
                      <Target className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold">{maturityDate}</span>
                    </div>
                  ) : null}
                </div>
              </section>
            ) : null}
          </div>
        </div>

        <div className="relative shrink-0 border-t border-white/10 bg-background/40 p-4 backdrop-blur-xl sm:p-5">
          <div className="pointer-events-none absolute inset-x-0 -top-10 h-10 bg-gradient-to-t from-transparent to-background/5" />
          <div className="grid items-end gap-3 md:grid-cols-[1fr_auto]">
            <div>
              <div className="flex items-baseline gap-4">
                <div className="text-4xl font-black text-primary">
                  {formatCurrency(currentFunding)}
                </div>
                <div className="pb-1 text-lg font-bold text-muted-foreground">
                  / {formatCurrency(targetBudget)}
                </div>
              </div>
              <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <span>
                  {Math.round(fundingProgress)}% {t('card.funded')}
                </span>
                <span className="h-2 w-2 rounded-full bg-marketing-positive-500" />
              </div>
            </div>

            <div className="flex w-full gap-2 md:w-[360px]">
              {isFundingClosed ? (
                <Button className="h-12 flex-1 rounded-xl text-base font-bold" disabled>
                  {t('detail.funding_closed')}
                </Button>
              ) : (
                <Link href={investCtaHref} className="flex-1">
                  <Button className="h-12 w-full rounded-xl text-base font-bold">
                    {t('detail.invest_now')}
                  </Button>
                </Link>
              )}
              <ProjectShareButton
                projectName={projectName}
                projectSlug={project.slug}
                className="h-12 w-12 shrink-0 rounded-xl"
              />
              <ProjectFavoriteButton
                projectName={projectName}
                projectId={project.id}
                className="h-12 w-12 shrink-0 rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
