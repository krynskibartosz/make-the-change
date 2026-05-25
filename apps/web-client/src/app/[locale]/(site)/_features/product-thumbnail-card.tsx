import { Hexagon } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { sanitizeImageUrl } from '@/lib/image-url'

type Props = {
  slug: string
  title: string
  imageUrl: string | null
  priceEur: number
  isFeatured?: boolean
  priority?: boolean
}

const priceFormatter = new Intl.NumberFormat('fr-BE', { style: 'currency', currency: 'EUR' })

export function ProductThumbnailCard({
  slug,
  title,
  imageUrl,
  priceEur,
  isFeatured = false,
  priority = false,
}: Props) {
  const cleanImage = imageUrl ? sanitizeImageUrl(imageUrl) : null

  return (
    <Link
      href={`/products/${slug}`}
      prefetch={priority}
      className="group flex w-36 shrink-0 snap-start flex-col gap-2.5 active:scale-[0.98]"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-white/5 bg-[#1A1F26]">
        {isFeatured && (
          <span className="absolute left-2 top-2 z-10 rounded bg-amber-400 px-1.5 py-0.5 text-[8px] font-black uppercase text-[#0B0F15]">
            Selection
          </span>
        )}
        {cleanImage ? (
          <img
            src={cleanImage}
            alt={title}
            loading={priority ? 'eager' : 'lazy'}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Hexagon className="h-6 w-6 text-white/20" aria-hidden="true" />
          </div>
        )}
      </div>
      <div className="px-1">
        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-white">{title}</h3>
        <span className="mt-1 block text-[13px] font-black text-white">
          {priceFormatter.format(priceEur)}
        </span>
      </div>
    </Link>
  )
}
