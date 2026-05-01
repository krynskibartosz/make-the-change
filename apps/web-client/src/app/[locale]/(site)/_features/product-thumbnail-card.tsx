import { Sparkles } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { sanitizeImageUrl } from '@/lib/image-url'

type ProductThumbnailCardProps = {
  slug: string
  title: string
  imageUrl: string | null
  pricePoints: number
  isFeatured?: boolean
  priority?: boolean
}

const pointsFormatter = new Intl.NumberFormat('fr-FR')

export function ProductThumbnailCard({
  slug,
  title,
  imageUrl,
  pricePoints,
  isFeatured = false,
  priority = false,
}: ProductThumbnailCardProps) {
  const formattedPrice = pointsFormatter.format(pricePoints)
  const cleanImage = imageUrl ? sanitizeImageUrl(imageUrl) : null

  return (
    <Link
      href={`/products/${slug}`}
      prefetch={priority}
      className="w-36 shrink-0 snap-start group flex flex-col gap-2.5 active:scale-[0.98] transition-transform block"
    >
      <div className="relative w-full aspect-[4/5] rounded-2xl bg-[#1A1F26] border border-white/5 overflow-hidden shadow-lg">
        {isFeatured ? (
          <span className="absolute top-2 left-2 z-10 px-1.5 py-0.5 rounded bg-amber-400 text-[#0B0F15] text-[8px] font-black uppercase tracking-widest shadow-sm">
            Best-seller
          </span>
        ) : null}

        {cleanImage ? (
          <img
            src={cleanImage}
            alt={title}
            loading={priority ? 'eager' : 'lazy'}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-lime-500/10 via-[#1A1F26] to-[#0B0F15]">
            <Sparkles className="w-6 h-6 text-white/20" />
          </div>
        )}
      </div>

      <div className="flex flex-col px-1">
        <h3 className="text-sm font-bold text-white leading-snug line-clamp-2 mb-1">{title}</h3>
        <div className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-lime-400 shrink-0" />
          <span className="text-[13px] font-black text-lime-400 tabular-nums">{formattedPrice}</span>
        </div>
      </div>
    </Link>
  )
}
