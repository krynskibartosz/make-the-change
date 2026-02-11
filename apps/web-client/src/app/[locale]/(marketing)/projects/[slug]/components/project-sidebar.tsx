import { Badge, Button, Card, CardContent, Progress, Separator } from '@make-the-change/core/ui'
import { Calendar, Globe, Leaf, Share2, Target } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { formatCurrency } from '@/lib/utils'

type ProjectProducer = {
  name_default: string
  description_default: string | null
  contact_website: string | null
}

type ProjectSidebarProject = {
  slug: string
  status: string | null
  launch_date: string | null
  maturity_date: string | null
  current_funding: number | null
  target_budget: number | null
  producer: ProjectProducer | null
}

type ProjectSidebarProps = {
  project: ProjectSidebarProject
  locale: string
  fundingProgress: number
  producerImage?: string
}

function getWebsiteLabel(url: string | null) {
  if (!url) {
    return null
  }

  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

export async function ProjectSidebar({
  project,
  locale,
  fundingProgress,
  producerImage,
}: ProjectSidebarProps) {
  const t = await getTranslations('projects')

  const statusLabel =
    project.status === 'active' ? t('filter.status.active') : t('filter.status.completed')

  const launchDate = project.launch_date
    ? new Date(project.launch_date).toLocaleDateString(locale)
    : null
  const maturityDate = project.maturity_date
    ? new Date(project.maturity_date).toLocaleDateString(locale)
    : null

  const websiteLabel = getWebsiteLabel(project.producer?.contact_website || null)

  return (
    <div className="lg:col-span-4 space-y-6">
      <div className="sticky top-24 space-y-6">
        <Card className="group relative overflow-hidden rounded-[2.5rem] border-border/50 bg-background/50 backdrop-blur-sm transition-all hover:bg-background/80 hover:shadow-xl hover:-translate-y-1">
          <CardContent className="p-6 md:p-8 space-y-8">
            <div>
              <div className="mb-4 flex items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                    {t('filter.progress.label')}
                  </p>
                  <p className="mt-2 text-5xl font-black tracking-tight text-foreground">
                    {Math.round(fundingProgress)}%
                  </p>
                </div>
                <Badge variant="outline" className="bg-background/80">
                  {statusLabel}
                </Badge>
              </div>

              <Progress
                value={fundingProgress}
                className="h-4 rounded-full bg-muted"
                indicatorClassName="bg-gradient-to-r from-primary to-primary/80"
              />

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-muted/60 px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    {t('filter.progress.collected')}
                  </p>
                  <p className="mt-1 text-lg font-black">
                    {formatCurrency(project.current_funding || 0)}
                  </p>
                </div>
                <div className="rounded-2xl bg-muted/60 px-4 py-3 text-right">
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    {t('card.goal')}
                  </p>
                  <p className="mt-1 text-lg font-black">
                    {formatCurrency(project.target_budget || 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Link href={`/projects/${project.slug}/invest`} className="block w-full">
                <Button
                  size="lg"
                  className="w-full h-14 text-lg font-bold rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] transition-all"
                >
                  {t('detail.invest_now')}
                </Button>
              </Link>

              <Button
                variant="outline"
                className="w-full h-12 rounded-full border-border/50 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
              >
                <Share2 className="mr-2 h-4 w-4" />
                {t('detail.share')}
              </Button>
            </div>

            <Separator />

            <div className="space-y-3">
              {launchDate ? (
                <div className="flex items-center gap-3 rounded-2xl border border-border/50 bg-background/70 px-4 py-3">
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <p className="text-sm font-semibold">{launchDate}</p>
                </div>
              ) : null}

              {maturityDate ? (
                <div className="flex items-center gap-3 rounded-2xl border border-border/50 bg-background/70 px-4 py-3">
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Target className="h-4 w-4" />
                  </div>
                  <p className="text-sm font-semibold">{maturityDate}</p>
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>

        {project.producer ? (
          <Card className="group relative overflow-hidden rounded-[2.5rem] border-border/50 bg-background/50 backdrop-blur-sm transition-all hover:bg-background/80 hover:shadow-xl hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                <Leaf className="h-3 w-3" />
                <span>{t('detail.about')}</span>
              </div>

              <div className="flex items-start gap-4">
                {producerImage ? (
                  <div className="h-16 w-16 rounded-2xl overflow-hidden border border-border/50 bg-muted flex-shrink-0">
                    <img
                      src={producerImage}
                      alt={project.producer.name_default}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary font-bold text-xl flex-shrink-0">
                    {project.producer.name_default?.[0]?.toUpperCase()}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <h3 className="text-xl font-black tracking-tight">
                    {project.producer.name_default}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                    {project.producer.description_default}
                  </p>

                  {project.producer.contact_website && websiteLabel ? (
                    <a
                      href={project.producer.contact_website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                    >
                      <Globe className="h-4 w-4" />
                      {websiteLabel}
                    </a>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  )
}
