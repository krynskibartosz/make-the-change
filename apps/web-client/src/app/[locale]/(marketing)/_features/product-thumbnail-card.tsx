import { Sparkles } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { sanitizeImageUrl } from '@/lib/image-url'

type ProductThumbnailCardProps = {
  slug: string
  title: string
  imageUrl: string | null
  pricePoints: number
  pointsLabel: string
  isFeatured?: boolean
  priority?: boolean
}

const pointsFormatter = new Intl.NumberFormat('fr-FR')

export function ProductThumbnailCard({
  slug,
  title,
  imageUrl,
  pricePoints,
  pointsLabel,
  isFeatured = false,
  priority = false,
}: ProductThumbnailCardProps) {
  const formattedPrice = pointsFormatter.format(pricePoints)
  const cleanImage = imageUrl ? sanitizeImageUrl(imageUrl) : null

  return (
    <Link
      href={`/products/${slug}`}
      prefetch={priority}
      className="relative w-40 aspect-[4/5] shrink-0 snap-start rounded-2xl overflow-hidden border border-white/5 bg-[#1A1F26] flex flex-col shadow-lg active:scale-[0.98] transition-transform group block"
    >
      <div className="relative w-full h-[65%] bg-[#0B0F15] p-2">
        {isFeatured ? (
          <span className="absolute top-3 left-3 z-10 px-1.5 py-0.5 rounded bg-lime-400 text-[#0B0F15] text-[8px] font-black uppercase tracking-wider shadow-sm">
            Best-seller
          </span>
        ) : null}

        {cleanImage ? (
          <img
            src={cleanImage}
            alt={title}
            loading={priority ? 'eager' : 'lazy'}
            className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full rounded-xl bg-gradient-to-br from-lime-500/10 via-[#1A1F26] to-[#0B0F15] flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white/20" />
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1 justify-between">
        <h3 className="text-sm font-bold text-white leading-snug line-clamp-2">{title}</h3>

        <div className="flex items-center gap-1 mt-auto pt-2">
          <Sparkles className="w-3 h-3 text-lime-400 shrink-0" />
          <span className="text-sm font-black text-lime-400 tabular-nums">{formattedPrice}</span>
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider ml-0.5">
            {pointsLabel}
          </span>
        </div>
      </div>
    </Link>
  )
}
