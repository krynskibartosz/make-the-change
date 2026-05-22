import { Leaf } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { getProjectTypeDesign } from '@/lib/project-type-icons'

type ProjectThumbnailCardProps = {
  slug: string
  title: string
  imageUrl: string | null
  impactLabel?: string
  locationDisplay?: { flag: string; label: string }
  priority?: boolean
  type?: string | null
}

export function ProjectThumbnailCard({
  slug,
  title,
  imageUrl,
  impactLabel,
  locationDisplay,
  priority = false,
  type,
}: ProjectThumbnailCardProps) {
  const getImpactIcon = () => {
    if (!type) return <Leaf className="w-3 h-3 text-lime-400 shrink-0" />
    const design = getProjectTypeDesign(type)
    return <design.icon className={`w-3 h-3 shrink-0 ${design.color}`} />
  }

  return (
    <Link
      href={`/projects/${slug}`}
      prefetch={priority}
      className="relative w-72 aspect-[4/5] shrink-0 snap-start rounded-3xl overflow-hidden border border-white/10 block active:scale-[0.98] transition-transform group shadow-lg"
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
        {locationDisplay ? (
          <div className="flex items-center gap-1 mb-1.5 opacity-90">
            <span className="text-[13px] leading-none">{locationDisplay.flag}</span>
            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">
              {locationDisplay.label}
            </span>
          </div>
        ) : null}

        <h3 className="text-xl font-bold text-white leading-tight mb-4 line-clamp-2 drop-shadow-md text-balance">
          {title}
        </h3>

        {impactLabel ? (
          <div className="flex items-center gap-1.5 bg-[#0B0F15]/80 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/10 shadow-sm">
            {getImpactIcon()}
            <span className="text-[11px] font-bold text-white tracking-wide">
              <span className="text-lime-400">{impactLabel}</span>
            </span>
          </div>
        ) : null}
      </div>
    </Link>
  )
}
