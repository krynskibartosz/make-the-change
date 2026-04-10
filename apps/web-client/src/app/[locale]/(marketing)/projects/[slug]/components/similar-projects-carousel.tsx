import { Leaf } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { sanitizeImageUrl } from '@/lib/image-url'
import { getLocalizedContent } from '@/lib/utils'
import type { RelatedProject } from '../project-detail-data'

type SimilarProjectsCarouselProps = {
  currentProjectTags: string[]
  locale: string
  relatedProjects?: RelatedProject[]
}

type SimilarProjectCard = {
  id: string
  slug: string
  title: string
  tag: string
  imageClassName: string
}

const ALL_MOCK_PROJECTS: SimilarProjectCard[] = [
  {
    id: 'beehive-1',
    slug: 'sauvons-les-abeilles-noires',
    title: 'Sauvons les Abeilles Noires',
    tag: 'Beehive',
    imageClassName: 'bg-linear-to-br from-amber-400/60 via-lime-500/25 to-zinc-900',
  },
  {
    id: 'beehive-2',
    slug: 'ruches-solidaires-montagne',
    title: 'Ruches Solidaires en Montagne',
    tag: 'Beehive',
    imageClassName: 'bg-linear-to-br from-lime-500/55 via-yellow-400/25 to-zinc-900',
  },
  {
    id: 'olive-1',
    slug: 'oliveraies-regeneratives-provence',
    title: 'Oliveraies Régénératives',
    tag: 'Olive Tree',
    imageClassName: 'bg-linear-to-br from-emerald-500/45 via-zinc-700 to-zinc-950',
  },
  {
    id: 'vineyard-1',
    slug: 'vignes-vivantes-vallee',
    title: 'Vignes Vivantes de la Vallée',
    tag: 'Vineyard',
    imageClassName: 'bg-linear-to-br from-fuchsia-500/35 via-purple-500/25 to-zinc-950',
  },
]

const NORMALIZED_TAG_TO_LABEL: Record<string, string> = {
  beehive: 'Beehive',
  olive_tree: 'Olive Tree',
  vineyard: 'Vineyard',
}

const pickCards = (tags: string[]): SimilarProjectCard[] => {
  const normalizedTags = tags.map((tag) => tag.toLowerCase())
  const preferredLabel =
    normalizedTags.map((tag) => NORMALIZED_TAG_TO_LABEL[tag]).find(Boolean) || 'Beehive'

  const matching = ALL_MOCK_PROJECTS.filter((project) => project.tag === preferredLabel)
  const fallback = ALL_MOCK_PROJECTS.filter((project) => project.tag !== preferredLabel)

  return [...matching, ...fallback].slice(0, 3)
}

const formatTypeLabel = (value: string | null | undefined): string => {
  if (!value) return 'Projet'
  const normalized = value.replace(/[_-]+/g, ' ').trim()
  if (!normalized) return 'Projet'
  return normalized.replace(/\b\w/g, (match) => match.toUpperCase())
}

export function SimilarProjectsCarousel({
  currentProjectTags,
  locale,
  relatedProjects = [],
}: SimilarProjectsCarouselProps) {
  const fallbackCards = pickCards(currentProjectTags)
  const realCards = relatedProjects.slice(0, 3)
  const shouldUseFallback = realCards.length === 0

  return (
    <section className="w-full  max-w-full overflow-hidden">
      <h3 className="mb-4 text-xl font-bold text-white">Explorez d&apos;autres projets</h3>

      <div className="flex w-full max-w-full gap-4 overflow-x-auto overflow-y-hidden pb-4 snap-x snap-mandatory touch-pan-x [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden">
        {shouldUseFallback
          ? fallbackCards.map((card) => (
              <Link
                key={card.id}
                href={`/${locale}/projects/${card.slug}`}
                className="min-w-[240px] w-[240px] h-[160px] shrink-0 snap-start rounded-2xl overflow-hidden relative group cursor-pointer border border-white/10"
              >
                <div
                  className={`absolute inset-0 object-cover w-full h-full transition-transform group-hover:scale-105 ${card.imageClassName}`}
                  aria-hidden="true"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4 w-full">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-lime-400 mb-1 block">
                    {card.tag}
                  </span>
                  <h4 className="text-sm font-bold text-white leading-tight truncate">{card.title}</h4>
                </div>
              </Link>
            ))
          : realCards.map((project) => {
              const title = getLocalizedContent(project.name_i18n, locale, project.name_default)
              const imageUrl = sanitizeImageUrl(project.hero_image_url)
              const typeLabel = formatTypeLabel(project.type)

              return (
                <Link
                  key={project.id}
                  href={`/${locale}/projects/${project.slug}`}
                  className="min-w-[240px] w-[240px] h-[160px] shrink-0 snap-start rounded-2xl overflow-hidden relative group cursor-pointer border border-white/10"
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-800">
                      <Leaf className="h-8 w-8 text-white/50" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4 w-full">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-lime-400 mb-1 block">
                      {typeLabel}
                    </span>
                    <h4 className="text-sm font-bold text-white leading-tight truncate">{title}</h4>
                  </div>
                </Link>
              )
            })}
      </div>
    </section>
  )
}
