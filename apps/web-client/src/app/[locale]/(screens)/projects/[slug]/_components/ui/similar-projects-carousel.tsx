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
  currentProjectTags: string[]
  locale: string
  relatedProjects?: RelatedProject[]
}

type MockSimilarCard = {
  id: string
  slug: string
  title: string
  gradientClass: string
  currentFunding: number | null
  type: string | null
}

const ALL_MOCK_CARDS: MockSimilarCard[] = [
  {
    id: 'beehive-1',
    slug: 'sauvons-les-abeilles-noires',
    title: 'Sauvons les Abeilles Noires',
    gradientClass: 'bg-gradient-to-br from-amber-400/60 via-lime-500/25 to-zinc-900',
    currentFunding: 3510,
    type: 'beehive',
  },
  {
    id: 'beehive-2',
    slug: 'ruches-solidaires-montagne',
    title: 'Ruches Solidaires en Montagne',
    gradientClass: 'bg-gradient-to-br from-lime-500/55 via-yellow-400/25 to-zinc-900',
    currentFunding: 2600,
    type: 'beehive',
  },
  {
    id: 'olive-1',
    slug: 'oliveraies-regeneratives-provence',
    title: 'Oliveraies Régénératives',
    gradientClass: 'bg-gradient-to-br from-emerald-500/45 via-zinc-700 to-zinc-950',
    currentFunding: 450,
    type: 'olive_tree',
  },
  {
    id: 'vineyard-1',
    slug: 'vignes-vivantes-vallee',
    title: 'Vignes Vivantes de la Vallée',
    gradientClass: 'bg-gradient-to-br from-fuchsia-500/35 via-purple-500/25 to-zinc-950',
    currentFunding: null,
    type: null,
  },
]

const MOCK_TAG_PRIORITY: Record<string, number> = {
  beehive: 0,
  olive_tree: 1,
  vineyard: 2,
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

const pickMockCards = (tags: string[]): MockSimilarCard[] => {
  const normalizedTags = tags.map((t) => t.toLowerCase())
  const priority = normalizedTags.reduce(
    (best, tag) => Math.min(best, MOCK_TAG_PRIORITY[tag] ?? 99),
    99,
  )
  const preferred = ALL_MOCK_CARDS.filter((_, i) => i === priority)
  const rest = ALL_MOCK_CARDS.filter((_, i) => i !== priority)
  return [...preferred, ...rest].slice(0, 3)
}

type CompactSimilarProjectCardProps = {
  href: string
  title: string
  imageUrl: string | null
  fallbackMediaClass?: string
  currentFunding: number | null
  type: string | null
}

function CompactSimilarProjectCard({
  href,
  title,
  imageUrl,
  fallbackMediaClass = 'bg-white/5',
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
          <div className={`h-full w-full ${fallbackMediaClass}`} aria-hidden="true" />
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
  currentProjectTags,
  locale,
  relatedProjects = [],
}: SimilarProjectsCarouselProps) {
  const realCards = relatedProjects.slice(0, 3)
  const shouldUseFallback = realCards.length === 0
  const mockCards = pickMockCards(currentProjectTags)

  return (
    <section className="w-full max-w-full overflow-hidden">
      <h3 className="mb-4 text-xl font-bold text-white">Explorez d&apos;autres projets</h3>

      <div className="flex w-full max-w-full gap-4 overflow-x-auto overflow-y-hidden pb-4 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {shouldUseFallback
          ? mockCards.map((card) => (
              <CompactSimilarProjectCard
                key={card.id}
                href={`/projects/${card.slug}`}
                title={card.title}
                imageUrl={null}
                fallbackMediaClass={card.gradientClass}
                currentFunding={card.currentFunding}
                type={card.type}
              />
            ))
          : realCards.map((project) => {
              const title = getLocalizedContent(project.name_i18n, locale, project.name_default)
              const imageUrl = sanitizeImageUrl(project.hero_image_url) ?? null

              return (
                <CompactSimilarProjectCard
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  title={title}
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
