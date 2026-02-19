import { Badge, Button } from '@make-the-change/core/ui'
import Image from 'next/image'
import { Calendar, Leaf, MapPin, Sparkles } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { cn, formatCurrency } from '@/lib/utils'

type ProjectCoverHeroProject = {
  slug: string
  status: string | null
  type: string | null
  name_default: string
  description_default: string | null
  address_city: string | null
  address_country_code: string | null
  launch_date: string | null
}

type ProjectCoverHeroProps = {
  project: ProjectCoverHeroProject
  coverImage?: string
  locale: string
  fundingProgress: number
  currentFunding: number
  targetBudget: number
}

export async function ProjectCoverHero({
  project,
  coverImage,
  locale,
  fundingProgress,
  currentFunding,
  targetBudget,
}: ProjectCoverHeroProps) {
  const t = await getTranslations('projects')
  const statusLabel =
    project.status === 'active' ? t('filter.status.active') : t('filter.status.completed')

  return (
    <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
      <div className="space-y-8 order-2 lg:order-1">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-sm">
          <Sparkles className="h-4 w-4" />
          <span className="uppercase tracking-widest text-xs font-bold">{t('detail.about')}</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          <Badge
            className={cn(
              'px-3 py-1 text-xs font-bold uppercase tracking-wider border-0',
              project.status === 'active'
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                : 'bg-muted text-foreground',
            )}
          >
            {statusLabel}
          </Badge>
          {project.type ? (
            <Badge variant="outline" className="bg-background/80 border-border/60 backdrop-blur-sm">
              {project.type.replace('_', ' ')}
            </Badge>
          ) : null}
        </div>

        <h1
          className={cn(
            'font-black tracking-tighter text-foreground animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150',
            project.name_default.length > 40
              ? 'text-4xl sm:text-5xl lg:text-6xl'
              : 'text-5xl sm:text-6xl lg:text-7xl',
          )}
        >
          {project.name_default}
        </h1>

        <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-250 max-w-xl">
          {project.description_default}
        </p>

        <div className="flex flex-wrap gap-3 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-350">
          {(project.address_city || project.address_country_code) && (
            <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-background/60 px-4 py-2 backdrop-blur-sm">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                {[project.address_city, project.address_country_code].filter(Boolean).join(', ')}
              </span>
            </div>
          )}
          {project.launch_date && (
            <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-background/60 px-4 py-2 backdrop-blur-sm">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                {new Date(project.launch_date).toLocaleDateString(locale)}
              </span>
            </div>
          )}
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-450">
          <Link href={`/projects/${project.slug}/invest`}>
            <Button
              size="lg"
              className="h-14 px-9 text-base rounded-full font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] transition-all"
            >
              {t('detail.invest_now')}
            </Button>
          </Link>
        </div>
      </div>

      <div className="relative order-1 lg:order-2">
        <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/20 border border-border/50 bg-muted relative z-10 rotate-3 transition-transform duration-700 hover:rotate-0">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={project.name_default}
              fill
              priority
              className="object-cover scale-110 transition-transform duration-700 hover:scale-100"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-primary/20 to-muted flex items-center justify-center">
              <Leaf className="h-24 w-24 text-primary/50" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-marketing-overlay-dark/60 via-transparent to-transparent opacity-60" />
        </div>

        <div className="absolute -bottom-10 -left-10 z-20 p-6 rounded-3xl bg-background/90 backdrop-blur-xl shadow-[0_8px_30px_hsl(var(--marketing-overlay-dark) / 0.12)] border border-marketing-overlay-light/20 animate-in slide-in-from-left-4 duration-1000 delay-300">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-marketing-positive-600 flex items-center justify-center text-marketing-overlay-light shadow-lg shadow-primary/30">
              <Leaf className="h-7 w-7" />
            </div>
            <div>
              <p className="text-3xl font-black leading-none mb-1">
                {Math.round(fundingProgress)}%
              </p>
              <p className="text-sm text-muted-foreground font-medium">
                {formatCurrency(currentFunding)} / {formatCurrency(targetBudget)}
              </p>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 bg-primary/20 blur-[80px] -z-10 rounded-full scale-125" />
      </div>
    </div >
  )
}
