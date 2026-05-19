import { Leaf, TreePine, Waves } from 'lucide-react'
import {
  getProjectImpactDisplay,
  type ProjectMapImpactKind,
} from '@/app/[locale]/(tabs)/projects/_features/project-map-data'
import { Link } from '@/i18n/navigation'
import { formatCompact } from '@/lib/formatters'
import { sanitizeImageUrl } from '@/lib/image-url'
import { getLocalizedContent } from '@/lib/utils'
import type { RelatedProject } from '../../project-detail-data'

type SimilarProjectsCarouselProps = {
  locale: string
  relatedProjects?: RelatedProject[]
  title?: string
}

const IMPACT_KIND_STYLES: Record<ProjectMapImpactKind, { icon: string }> = {
  beehive: {
    icon: 'text-amber-300',
  },
  orchard: {
    icon: 'text-emerald-300',
  },
  reef: {
    icon: 'text-sky-300',
  },
}

type CompactSimilarProjectCardProps = {
  href: string
  title: string
  imageUrl: string | null
  currentFunding: number | null
  type: string | null
}

function CompactSimilarProjectCard({
  href,
  title,
  imageUrl,
  currentFunding,
  type,
}: CompactSimilarProjectCardProps) {
  const impact = getProjectImpactDisplay({
    current_funding: currentFunding,
    type,
  })
  const impactTheme = IMPACT_KIND_STYLES[impact.kind]

  return (
    <Link
      href={href}
      className="block w-[64vw] max-w-[220px] shrink-0 snap-start text-left transition-transform active:scale-[0.98]"
    >
      <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-white/5">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-white/5" aria-hidden="true" />
        )}
      </div>

      <div className="mt-3 px-0.5">
        <h4 className="line-clamp-2 min-h-[2.25rem] text-[15px] font-black leading-tight text-white text-balance">
          {title}
        </h4>

        {impact.value > 0 ? (
          <div className="mt-2 flex items-center gap-1.5">
            {impact.kind === 'orchard' ? (
              <TreePine className={`h-3.5 w-3.5 shrink-0 ${impactTheme.icon}`} />
            ) : impact.kind === 'reef' ? (
              <Waves className={`h-3.5 w-3.5 shrink-0 ${impactTheme.icon}`} />
            ) : (
              <Leaf className={`h-3.5 w-3.5 shrink-0 ${impactTheme.icon}`} />
            )}
            <p className="truncate text-[12px] font-medium text-white/66">
              <span className="font-black text-white/88 tabular-nums">
                {formatCompact(impact.value)}
              </span>{' '}
              {impact.label}
            </p>
          </div>
        ) : null}
      </div>
    </Link>
  )
}

export function SimilarProjectsCarousel({
  locale,
  relatedProjects = [],
  title = "Explorez d'autres projets",
}: SimilarProjectsCarouselProps) {
  const cards = relatedProjects.slice(0, 3)

  if (cards.length === 0) return null

  return (
    <section className="w-full max-w-full overflow-hidden">
      <h3 className="mb-4 text-xl font-bold text-white">{title}</h3>

      <div className="flex w-full max-w-full gap-4 overflow-x-auto overflow-y-hidden pb-4 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {cards.map((project) => {
          const cardTitle = getLocalizedContent(project.name_i18n, locale, project.name_default)
          const imageUrl = sanitizeImageUrl(project.hero_image_url) ?? null

          return (
            <CompactSimilarProjectCard
              key={project.id}
              href={`/projects/${project.slug}`}
              title={cardTitle}
              imageUrl={imageUrl}
              currentFunding={
                typeof project.current_funding === 'number' ? project.current_funding : null
              }
              type={project.type ?? null}
            />
          )
        })}
      </div>
    </section>
  )
}
