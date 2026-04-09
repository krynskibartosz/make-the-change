import { Card, CardContent } from '@make-the-change/core/ui'
import { ArrowRight, Target } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { sanitizeImageUrl } from '@/lib/image-url'
import { formatCurrency, getLocalizedContent } from '@/lib/utils'
import type { RelatedProject } from '../project-detail-data'

interface ProjectAssociatedProjectsSectionProps {
  projects: RelatedProject[]
  locale: string
}

const getFundingProgress = (currentFunding: number, targetBudget: number) => {
  if (targetBudget <= 0) return 0
  return Math.min((currentFunding / targetBudget) * 100, 100)
}

const formatTypeLabel = (value: string | null) => {
  if (!value) return null
  return value
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (match) => match.toUpperCase())
}

export function ProjectAssociatedProjectsSection({
  projects,
  locale,
}: ProjectAssociatedProjectsSectionProps) {
  if (!projects.length) return null

  return (
    <section>
      <div className="mb-6 flex items-center gap-3">
        <div className="h-10 w-1 rounded-full bg-primary" />
        <h2 className="text-3xl font-black tracking-tight">Projets associés</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {projects.map((project) => {
          const imageUrl = sanitizeImageUrl(project.hero_image_url)
          const title = getLocalizedContent(project.name_i18n, locale, project.name_default)
          const description = getLocalizedContent(
            project.description_i18n,
            locale,
            project.description_default || '',
          )
          const currentFunding = project.current_funding || 0
          const targetBudget = project.target_budget || 0
          const progress = getFundingProgress(currentFunding, targetBudget)
          const typeLabel = formatTypeLabel(project.type)

          return (
            <Link key={project.id} href={`/projects/${project.slug}`} className="group block">
              <Card className="h-full overflow-hidden rounded-2xl border-border/50 bg-background/50 transition-all hover:-translate-y-1 hover:bg-background/80 hover:shadow-xl">
                <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-primary/5 text-sm font-semibold text-muted-foreground">
                      Projet
                    </div>
                  )}
                </div>

                <CardContent className="space-y-4 p-5">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary" />
                      <h3 className="line-clamp-1 text-xl font-bold tracking-tight">{title}</h3>
                    </div>
                    {description ? (
                      <p className="line-clamp-2 text-sm text-muted-foreground">{description}</p>
                    ) : null}
                  </div>

                  {typeLabel ? (
                    <span className="inline-flex rounded-full border border-primary/25 bg-primary/5 px-2.5 py-1 text-xs font-semibold text-primary">
                      {typeLabel}
                    </span>
                  ) : null}

                  {targetBudget > 0 ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-foreground">
                          {formatCurrency(currentFunding)}
                        </span>
                        <span className="text-muted-foreground">{formatCurrency(targetBudget)}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full bg-primary transition-all duration-700"
                          style={{ width: `${Math.max(0, Math.min(progress, 100))}%` }}
                        />
                      </div>
                    </div>
                  ) : null}

                  <p className="inline-flex items-center text-sm font-semibold text-primary">
                    Voir le projet
                    <ArrowRight className="ml-1.5 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
