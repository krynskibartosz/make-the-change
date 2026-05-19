'use client'

import { BadgeCheck, Leaf } from 'lucide-react'
import { CurrencyAmount } from '@/components/currency'
import { Link } from '@/i18n/navigation'
import { sanitizeImageUrl } from '@/lib/image-url'

type ClientCatalogProduct = {
  id: string
  name_default: string
  short_description_default?: string | null
  description_default?: string | null
  price?: number
  price_points?: number | null
  stock_quantity?: number | null
  featured?: boolean | null
  image_url?: string | null
  images?: string[] | null
  tags?: string[] | null
  producer_name?: string | null
}

type ClientCatalogProductCardProps = {
  product: ClientCatalogProduct
  outOfStockLabel: string
}

export function ClientCatalogProductCard({
  product,
  outOfStockLabel,
}: ClientCatalogProductCardProps) {
  const imageUrl =
    sanitizeImageUrl(product.image_url) ||
    (Array.isArray(product.images) && product.images.length > 0
      ? sanitizeImageUrl(product.images[0])
      : undefined)

  const inStock =
    product.stock_quantity !== null &&
    product.stock_quantity !== undefined &&
    product.stock_quantity > 0

  const points = product.price_points ?? 0

  return (
    <article itemScope itemType="https://schema.org/Product" className="h-full">
      <meta itemProp="name" content={product.name_default} />
      <meta itemProp="image" content={imageUrl || ''} />
      <div itemProp="offers" itemScope itemType="https://schema.org/Offer">
        <meta itemProp="price" content={`${points}`} />
        <meta itemProp="priceCurrency" content="PTS" />
        <meta
          itemProp="availability"
          content={inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'}
        />
      </div>

      <Link
        href={`/products/${product.id}`}
        className="group flex h-full flex-col gap-2 active:scale-[0.98] transition-transform"
      >
        {/* ── Image avec ratio 4/5 ── */}
        <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-zinc-800">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name_default}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-white/10 flex items-center justify-center">
              <span className="text-white/20 text-3xl">📦</span>
            </div>
          )}

          {/* Badge rupture de stock */}
          {!inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-red-400 bg-black/60 px-2 py-1 rounded-full">
                {outOfStockLabel}
              </span>
            </div>
          )}
        </div>

        {/* ── Contenu cardless ── */}
        <div className="flex flex-col gap-0.5 mt-2">
          {/* Producteur */}
          {product.producer_name && (
            <span className="text-xs text-zinc-400 uppercase tracking-wider">
              {product.producer_name}
            </span>
          )}

          {/* Titre */}
          <h3 className="text-sm font-semibold text-white line-clamp-2">
            {product.name_default}
          </h3>

          {/* Prix */}
          <div className="flex items-center gap-1 mt-1">
            {inStock && points > 0 ? (
              <CurrencyAmount kind="impactCredits" value={points} className="text-sm font-bold" />
            ) : inStock ? (
              <span className="text-xs font-semibold text-white/50">Gratuit</span>
            ) : null}
          </div>
        </div>
      </Link>
    </article>
  )
}
