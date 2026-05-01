'use client'

import Image from 'next/image'
import { BadgeCheck, Leaf, Sparkles } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { sanitizeImageUrl } from '@/lib/image-url'

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Détecte si un tag signale la certification nature/bio */
const BIO_TAGS = ['bio', 'nature', 'naturel', 'botanique', 'organique', 'écologique', 'ecologique']
const ARTISAN_TAGS = ['artisanal', 'artisan', 'fait main', 'handmade', 'local']

const hasBioTag = (tags?: string[] | null) =>
  tags?.some((t) => BIO_TAGS.some((bio) => t.toLowerCase().includes(bio))) ?? false

const hasArtisanTag = (tags?: string[] | null) =>
  tags?.some((t) => ARTISAN_TAGS.some((a) => t.toLowerCase().includes(a))) ?? false

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
  view?: 'grid' | 'list'
}

// ─── Component ────────────────────────────────────────────────────────────────

export const ClientCatalogProductCard = ({
  product,
  outOfStockLabel,
  pointsLabel,
  view = 'grid',
}: ClientCatalogProductCardProps) => {
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

  // ── Vue Liste (desktop fallback) ────────────────────────────────────────────
  if (view === 'list') {
    return (
      <div itemScope itemType="https://schema.org/Product">
        <Link
          href={`/products/${product.id}`}
          className="group flex items-center gap-4 px-5 py-4 active:bg-white/5 transition-colors"
        >
          {/* Image */}
          <div className="w-16 h-16 shrink-0 rounded-2xl overflow-hidden bg-white/5 relative">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={product.name_default}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-white/10" />
            )}
          </div>

          {/* Infos */}
          <div className="flex-1 min-w-0">
            {/* Titre + badges certification */}
            <div className="flex items-center gap-1.5 mb-0.5">
              <h3 className="text-sm font-bold text-white truncate flex-1">
                {product.name_default}
              </h3>
              {isBio && <Leaf className="w-3 h-3 text-emerald-400 shrink-0" />}
              {isArtisan && <BadgeCheck className="w-3 h-3 text-sky-400 shrink-0" />}
            </div>

            {/* Producteur */}
            {product.producer_name && (
              <p className="text-[11px] text-white/40 font-medium truncate mb-1.5">
                {product.producer_name}
              </p>
            )}

            {/* Prix ou rupture */}
            {!inStock ? (
              <span className="text-[11px] font-semibold text-red-400/80">{outOfStockLabel}</span>
            ) : points > 0 ? (
              <div className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-lime-400 shrink-0" />
                <span className="text-sm font-black text-lime-400 tabular-nums">
                  {points.toLocaleString('fr-FR')}
                </span>
                <span className="text-xs font-semibold text-white/50">{pointsLabel}</span>
              </div>
            ) : null}
          </div>
        </Link>
      </div>
    )
  }

  // ── Vue Grille (défaut, mobile-first) ───────────────────────────────────────
  return (
    <div itemScope itemType="https://schema.org/Product" className="h-full">
      <Link
        href={`/products/${product.id}`}
        className="group flex h-full flex-col rounded-2xl overflow-hidden bg-white/[0.04] border border-white/8 hover:border-white/16 transition-all active:scale-[0.98]"
      >
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

        {/* ── Image carrée ── */}
        <div className="relative aspect-square w-full overflow-hidden bg-white/5">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name_default}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
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

        {/* ── Contenu ── */}
        <div className="flex flex-col flex-1 p-3 gap-1">
          {/* Titre */}
          <h3 className="text-sm font-bold text-white truncate leading-snug group-hover:text-lime-400 transition-colors">
            {product.name_default}
          </h3>

          {/* Producteur */}
          {product.producer_name && (
            <p className="text-[11px] text-white/40 font-medium truncate">
              {product.producer_name}
            </p>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Prix + icônes certification */}
          <div className="flex items-center justify-between mt-2">
            {/* Prix en points */}
            {inStock && points > 0 ? (
              <div className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-lime-400 shrink-0" />
                <span className="text-sm font-black text-lime-400 tabular-nums leading-none">
                  {points.toLocaleString('fr-FR')}
                </span>
              </div>
            ) : inStock ? (
              <span className="text-xs font-semibold text-white/50">Gratuit</span>
            ) : null}

            {/* Badges certification discrets */}
            <div className="flex items-center gap-1 ml-auto">
              {isBio && (
                <span title="Produit naturel / bio">
                  <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                </span>
              )}
              {isArtisan && (
                <span title="Produit artisanal">
                  <BadgeCheck className="w-3.5 h-3.5 text-sky-400" />
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
