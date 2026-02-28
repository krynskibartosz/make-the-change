import { Badge, Card, CardContent } from '@make-the-change/core/ui'
import { Leaf, Sparkles, TrendingUp } from 'lucide-react'
import { getLocale, getTranslations } from 'next-intl/server'
import { cn, formatCurrency, getLocalizedContent } from '@/lib/utils'
import { ProjectSpeciesSection } from './project-species-section'
import { ProjectChallengesSection } from './project-challenges-section'
import { ProjectImpactSection } from './project-impact-section'
import { ProjectProducerProductsSection } from './project-producer-products-section'
import type { ProjectSpecies, ProjectChallenge, ProducerProduct, ProjectImpact } from '@/types/context'

type ProjectMainContentProject = {
  name_default: string
  description_default: string | null
  description_i18n?: Record<string, string> | null
  long_description_default: string | null
  long_description_i18n?: Record<string, string> | null
  images: string[] | null
  status: string | null
  species?: ProjectSpecies[] | null
  challenges?: ProjectChallenge[] | null
  producer_products?: ProducerProduct[] | null
  expected_impact?: ProjectImpact | null
}

type ProjectMainContentProps = {
  project: ProjectMainContentProject
  fundingProgress: number
  currentFunding: number
  targetBudget: number
}

export async function ProjectMainContent({
  project,
  fundingProgress,
  currentFunding,
  targetBudget,
}: ProjectMainContentProps) {
  const t = await getTranslations('projects')
  const locale = await getLocale()
  const statusLabel =
    project.status === 'active' ? t('filter.status.active') : t('filter.status.completed')

  const defaultDesc = project.long_description_default || project.description_default || ''
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

  return (
    <div className="lg:col-span-8 space-y-8">
      <section>
        <Card className="group relative overflow-hidden rounded-[2.5rem] border-border/50 bg-background/50 backdrop-blur-sm transition-all hover:bg-background/80 hover:shadow-xl hover:-translate-y-1">
          <CardContent className="p-8 md:p-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkles className="h-3 w-3" />
              <span>{t('detail.about')}</span>
            </div>

            <h2 className="mb-5 text-4xl font-black tracking-tight">{t('detail.about')}</h2>

            <div className="prose prose-lg max-w-none">
              <p className="whitespace-pre-wrap text-lg leading-relaxed text-muted-foreground font-medium">
                {projectDescription}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* New Enhanced Sections */}
      {project.expected_impact && (
        <ProjectImpactSection impact={project.expected_impact} />
      )}

      {project.species && project.species.length > 0 && (
        <ProjectSpeciesSection species={project.species} />
      )}
      
      {project.challenges && project.challenges.length > 0 && (
        <ProjectChallengesSection challenges={project.challenges} />
      )}
      
      {project.producer_products && project.producer_products.length > 0 && (
        <ProjectProducerProductsSection products={project.producer_products} />
      )}

      {project.images && project.images.length > 0 && (
        <section>
          <div className="mb-6 flex items-center gap-3">
            <div className="h-10 w-1 rounded-full bg-primary" />
            <h2 className="text-3xl font-black tracking-tight">{t('detail.updates')}</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {project.images.map((img, i) => (
              <div
                key={`${project.name_default}-${i}`}
                className={cn(
                  'group relative overflow-hidden rounded-3xl border border-border/50 bg-muted shadow-md transition-all hover:shadow-xl hover:-translate-y-1',
                  i === 0 ? 'md:col-span-2 aspect-[21/9]' : 'aspect-[4/3]',
                )}
              >
                <img
                  src={img}
                  alt={`${project.name_default} ${i + 1}`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-marketing-overlay-dark/0 transition-colors group-hover:bg-marketing-overlay-dark/10" />
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="mb-6 flex items-center gap-3">
          <div className="h-10 w-1 rounded-full bg-primary" />
          <h2 className="text-3xl font-black tracking-tight">{t('detail.impact')}</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="rounded-3xl border-border/50 bg-primary/5">
            <CardContent className="p-6">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <TrendingUp className="h-6 w-6" />
              </div>
              <p className="text-4xl font-black tracking-tight">{Math.round(fundingProgress)}%</p>
              <p className="mt-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                {t('card.funded')}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border/50 bg-background/50">
            <CardContent className="p-6">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Leaf className="h-6 w-6" />
              </div>
              <p className="text-2xl font-black tracking-tight">{formatCurrency(currentFunding)}</p>
              <p className="mt-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                {t('filter.progress.collected')}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border/50 bg-background/50">
            <CardContent className="p-6">
              <Badge variant="outline" className="mb-4 bg-background/80">
                {statusLabel}
              </Badge>
              <p className="text-2xl font-black tracking-tight">{formatCurrency(targetBudget)}</p>
              <p className="mt-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                {t('card.goal')}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
