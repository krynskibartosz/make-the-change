import { Leaf, MapPin } from 'lucide-react'
import { Link } from '@/i18n/navigation'

type ProjectThumbnailCardProps = {
  slug: string
  title: string
  imageUrl: string | null
  impactLabel?: string
  location?: string
  priority?: boolean
}

export function formatEcologicalImpact(
  currentFunding: number | null,
  type: string | null,
): string | undefined {
  if (!currentFunding || currentFunding <= 0 || !type) return undefined

  switch (type) {
    case 'beehive': {
      const bees = Math.floor(currentFunding / 390) * 15000
      if (bees <= 0) return undefined
      return bees >= 1000
        ? `${Math.round(bees / 1000)}k abeilles protégées`
        : `${bees} abeilles protégées`
    }
    case 'olive_tree': {
      const trees = Math.floor(currentFunding / 50)
      if (trees <= 0) return undefined
      return `${trees} oliviers préservés`
    }
    case 'coral': {
      const corals = Math.floor(currentFunding / 18)
      if (corals <= 0) return undefined
      return `${corals} coraux transplantés`
    }
    default:
      return undefined
  }
}

export function ProjectThumbnailCard({
  slug,
  title,
  imageUrl,
  impactLabel,
  location,
  priority = false,
}: ProjectThumbnailCardProps) {
  return (
    <Link
      href={`/projects/${slug}`}
      prefetch={priority}
      className="relative w-72 aspect-square shrink-0 snap-start rounded-3xl overflow-hidden border border-white/10 block active:scale-[0.98] transition-transform group shadow-lg"
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title}
          loading={priority ? 'eager' : 'lazy'}
          className="absolute inset-0 w-full h-full object-cover bg-[#1A1F26] transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-lime-500/20 via-[#1A1F26] to-[#0B0F15] flex items-center justify-center">
          <Leaf className="h-10 w-10 text-white/20" />
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F15] via-[#0B0F15]/60 to-transparent" />

      <div className="absolute bottom-0 left-0 w-full p-5 flex flex-col items-start z-10">
        {location ? (
          <div className="flex items-center gap-1 mb-1.5 opacity-90">
            <MapPin className="w-2.5 h-2.5 text-gray-400 shrink-0" />
            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">
              {location}
            </span>
          </div>
        ) : null}

        <h3 className="text-xl font-bold text-white leading-tight mb-4 line-clamp-2 drop-shadow-md text-balance">
          {title}
        </h3>

        {impactLabel ? (
          <div className="flex items-center gap-1.5 bg-[#0B0F15]/80 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/10 shadow-sm">
            <Leaf className="w-3 h-3 text-lime-400 shrink-0" />
            <span className="text-[11px] font-bold text-white tracking-wide">
              <span className="text-lime-400">{impactLabel}</span>
            </span>
          </div>
        ) : null}
      </div>
    </Link>
  )
}
