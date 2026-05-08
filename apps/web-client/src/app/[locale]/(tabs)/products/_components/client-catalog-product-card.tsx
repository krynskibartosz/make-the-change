'use client'

import { BadgeCheck, Leaf } from 'lucide-react'
import { CurrencyAmount } from '@/components/currency'
import { Link } from '@/i18n/navigation'
import { sanitizeImageUrl } from '@/lib/image-url'

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Détecte si un tag signale la certification nature/bio */
const BIO_TAGS = ['bio', 'nature', 'naturel', 'botanique', 'organique', 'écologique', 'ecologique']
const ARTISAN_TAGS = ['artisanal', 'artisan', 'fait main', 'handmade', 'local']

// Helpers moved to bottom

// ─── Types ────────────────────────────────────────────────────────────────────

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
  /** Nom du producteur (enrichi côté serveur si besoin) */
  producer_name?: string | null
}

type ClientCatalogProductCardProps = {
  product: ClientCatalogProduct
  featuredLabel: string
  outOfStockLabel: string
  lowStockLabel: string
  pointsLabel: string
  viewLabel: string
}

// ─── Component ────────────────────────────────────────────────────────────────

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
  const isBio = hasBioTag(product.tags)
  const isArtisan = hasArtisanTag(product.tags)

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

          {/* Prix + icônes certification */}
          <div className="flex items-center gap-1 mt-1">
            {/* Prix en points */}
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

function hasBioTag(tags?: string[] | null): boolean {
  return tags?.some((t) => BIO_TAGS.some((bio) => t.toLowerCase().includes(bio))) ?? false
}

function hasArtisanTag(tags?: string[] | null): boolean {
  return tags?.some((t) => ARTISAN_TAGS.some((a) => t.toLowerCase().includes(a))) ?? false
}
