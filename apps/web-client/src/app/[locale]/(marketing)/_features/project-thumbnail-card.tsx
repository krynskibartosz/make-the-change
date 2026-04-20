import { Leaf } from 'lucide-react'
import { Link } from '@/i18n/navigation'

type ProjectThumbnailCardProps = {
  slug: string
  title: string
  imageUrl: string | null
  impactLabel?: string
  priority?: boolean
}

const formatImpact = (currentFunding: number | null): string | undefined => {
  if (!currentFunding || currentFunding <= 0) return undefined
  if (currentFunding >= 1000) {
    return `${Math.round(currentFunding / 1000)}k€ levés`
  }
  return `${currentFunding}€ levés`
}

export function ProjectThumbnailCard({
  slug,
  title,
  imageUrl,
  impactLabel,
  priority = false,
}: ProjectThumbnailCardProps) {
  return (
    <Link
      href={`/projects/${slug}`}
      prefetch={priority}
      className="relative w-[70vw] max-w-[260px] aspect-square shrink-0 snap-start rounded-3xl overflow-hidden border border-white/10 block active:scale-[0.98] transition-transform group"
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

      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F15]/90 via-[#0B0F15]/40 to-transparent" />

      <div className="absolute bottom-0 left-0 w-full p-4 flex flex-col items-start z-10">
        <h3 className="text-sm font-bold text-white leading-tight mb-2 line-clamp-2 drop-shadow-md">
          {title}
        </h3>

        {impactLabel ? (
          <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
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

export { formatImpact }
