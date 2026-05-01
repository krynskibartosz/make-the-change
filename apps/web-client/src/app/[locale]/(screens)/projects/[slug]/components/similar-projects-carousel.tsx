import { sanitizeImageUrl } from '@/lib/image-url'
import { getLocalizedContent } from '@/lib/utils'
import {
  formatEcologicalImpact,
  ProjectThumbnailCard,
} from '@/app/[locale]/(marketing)/_features/project-thumbnail-card'
import type { RelatedProject } from '../project-detail-data'

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
}

const ALL_MOCK_CARDS: MockSimilarCard[] = [
  {
    id: 'beehive-1',
    slug: 'sauvons-les-abeilles-noires',
    title: 'Sauvons les Abeilles Noires',
    gradientClass: 'bg-gradient-to-br from-amber-400/60 via-lime-500/25 to-zinc-900',
  },
  {
    id: 'beehive-2',
    slug: 'ruches-solidaires-montagne',
    title: 'Ruches Solidaires en Montagne',
    gradientClass: 'bg-gradient-to-br from-lime-500/55 via-yellow-400/25 to-zinc-900',
  },
  {
    id: 'olive-1',
    slug: 'oliveraies-regeneratives-provence',
    title: 'Oliveraies Régénératives',
    gradientClass: 'bg-gradient-to-br from-emerald-500/45 via-zinc-700 to-zinc-950',
  },
  {
    id: 'vineyard-1',
    slug: 'vignes-vivantes-vallee',
    title: 'Vignes Vivantes de la Vallée',
    gradientClass: 'bg-gradient-to-br from-fuchsia-500/35 via-purple-500/25 to-zinc-950',
  },
]

const MOCK_TAG_PRIORITY: Record<string, number> = {
  beehive: 0,
  olive_tree: 1,
  vineyard: 2,
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

      <div className="flex w-full max-w-full gap-4 overflow-x-auto overflow-y-hidden pb-4 snap-x snap-mandatory touch-pan-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {shouldUseFallback
          ? mockCards.map((card) => (
              <div key={card.id} className="relative w-[70vw] max-w-[260px] aspect-square shrink-0 snap-start rounded-3xl overflow-hidden border border-white/10 group active:scale-[0.98] transition-transform">
                <div className={`absolute inset-0 ${card.gradientClass}`} aria-hidden="true" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F15]/90 via-[#0B0F15]/40 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4 w-full">
                  <h4 className="text-sm font-bold text-white leading-tight line-clamp-2 drop-shadow-md">
                    {card.title}
                  </h4>
                </div>
              </div>
            ))
          : realCards.map((project) => {
              const title = getLocalizedContent(project.name_i18n, locale, project.name_default)
              const imageUrl = sanitizeImageUrl(project.hero_image_url) ?? null
              const impactLabel = formatEcologicalImpact(
                typeof project.current_funding === 'number' ? project.current_funding : null,
                project.type ?? null,
              )

              return (
                <ProjectThumbnailCard
                  key={project.id}
                  slug={`${locale}/projects/${project.slug}`}
                  title={title}
                  imageUrl={imageUrl}
                  impactLabel={impactLabel}
                  type={project.type ?? null}
                />
              )
            })}
      </div>
    </section>
  )
}
