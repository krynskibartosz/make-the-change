'use client'

import { Package } from 'lucide-react'
import { sanitizeImageUrl } from '@/lib/image-url'
import { ProductShareButton } from './product-share-button'

type Props = {
  images: string[]
  selectedIndex: number
  onSelect: (index: number) => void
  productName: string
  productId: string
}

export function ProductGallery({ images, selectedIndex, onSelect, productName, productId }: Props) {
  const coverImage = sanitizeImageUrl(images[selectedIndex] ?? images[0] ?? '')

  return (
    <div className="relative aspect-[4/3] max-h-[360px] w-full overflow-hidden border-b border-white/10 bg-white/5">
      {coverImage ? (
        <img src={coverImage} alt={productName} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full items-center justify-center">
          <Package className="h-16 w-16 text-white/25" aria-hidden="true" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F15] via-transparent to-black/40" />
      <div className="absolute right-4 top-[max(1rem,env(safe-area-inset-top))]">
        <ProductShareButton productName={productName} productId={productId} />
      </div>
      {selectedIndex > 0 ? (
        <span className="absolute left-4 top-[max(1rem,env(safe-area-inset-top))] rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-bold text-white/80">
          Image d&apos;ambiance
        </span>
      ) : null}
      {images.length > 1 ? (
        <div
          className="absolute bottom-3 left-4 flex gap-2"
          aria-label="Photos du produit"
          role="group"
        >
          {images.map((imageUrl, index) => {
            const thumbnail = sanitizeImageUrl(imageUrl)
            return (
              <button
                key={imageUrl}
                type="button"
                aria-label={index === 0 ? 'Voir le produit' : "Voir une image d'ambiance"}
                onClick={() => onSelect(index)}
                className={`h-12 w-12 overflow-hidden rounded-lg border-2 bg-[#0B0F15] ${
                  index === selectedIndex ? 'border-lime-300' : 'border-white/30'
                }`}
              >
                {thumbnail ? (
                  <img src={thumbnail} alt="" className="h-full w-full object-cover" />
                ) : null}
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
