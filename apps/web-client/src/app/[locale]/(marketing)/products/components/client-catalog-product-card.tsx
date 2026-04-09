'use client'

import Image from 'next/image'
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

export const ClientCatalogProductCard = ({
  product,
  featuredLabel,
  outOfStockLabel,
  lowStockLabel,
  pointsLabel,
  viewLabel,
  view = 'grid',
}: ClientCatalogProductCardProps) => {
  const imageUrl =
    sanitizeImageUrl(product.image_url) ||
    (Array.isArray(product.images) && product.images.length > 0
      ? sanitizeImageUrl(product.images[0])
      : undefined)

  const inStock = product.stock_quantity !== null && product.stock_quantity !== undefined && product.stock_quantity > 0
  const isListView = view === 'list'

  return (
    <div
      itemScope
      itemType="https://schema.org/Product"
      className={isListView ? undefined : 'h-full'}
    >
      <Link
        href={`/products/${product.id}`}
        className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-card transition-all hover:border-white/20 hover:shadow-xl ${
          isListView ? 'flex flex-col md:flex-row' : 'flex h-full flex-col'
        }`}
      >
        <meta itemProp="name" content={product.name_default} />
        <meta
          itemProp="description"
          content={product.short_description_default || product.description_default || ''}
        />
        <meta itemProp="image" content={imageUrl || ''} />
        <div itemProp="offers" itemScope itemType="https://schema.org/Offer">
          <meta itemProp="price" content={`${product.price || 0}`} />
          <meta itemProp="priceCurrency" content="EUR" />
          <meta
            itemProp="availability"
            content={inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'}
          />
        </div>

        {/* Badges Flottants */}
        <div className="absolute left-4 top-4 z-10 flex flex-col gap-2 items-start">
          {product.featured && (
            <span className="rounded-full bg-lime-500/20 border border-lime-500/30 px-3 py-1 text-xs font-bold uppercase tracking-wider text-lime-400 backdrop-blur-sm shadow-sm">
              {featuredLabel}
            </span>
          )}
          {!inStock && (
            <span className="rounded-full bg-red-500/20 border border-red-500/30 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-400 backdrop-blur-sm shadow-sm">
              {outOfStockLabel}
            </span>
          )}
        </div>

        {/* Zone Image */}
        <div
          className={`relative aspect-square overflow-hidden bg-muted p-6 mix-blend-multiply dark:mix-blend-normal ${
            isListView ? 'w-full md:h-auto md:w-56 md:flex-shrink-0' : 'w-full flex-shrink-0'
          }`}
        >
          <Image
            src={imageUrl || ''}
            alt={product.name_default}
            fill
            className="object-contain p-6 transition-transform duration-500 group-hover:scale-110 drop-shadow-xl"
          />
        </div>

        {/* Contenu - Avec un padding généreux */}
        <div className={`flex flex-1 flex-col p-5 ${isListView ? 'md:p-6' : ''}`}>
          <h3 className="line-clamp-2 text-lg font-bold tracking-tight text-foreground mb-2 group-hover:underline">
            {product.name_default}
          </h3>

          <p className={`text-sm text-muted-foreground mb-6 ${isListView ? 'line-clamp-3' : 'line-clamp-2'}`}>
            {product.short_description_default || product.description_default}
          </p>

          {/* Points & Prix */}
          <div className="mt-auto pt-4 flex flex-col gap-1 border-t border-white/10">
            {product.price_points !== null && product.price_points !== undefined && product.price_points > 0 ? (
              <>
                <div className="font-black text-2xl text-lime-400 leading-none">
                  {product.price_points.toLocaleString()} <span className="text-sm font-bold">{pointsLabel}</span>
                </div>
                {product.price !== null && product.price !== undefined && product.price > 0 && (
                  <div className="text-xs text-muted-foreground font-medium mt-1">
                    Valeur : {Math.floor(product.price).toLocaleString()} €
                  </div>
                )}
              </>
            ) : (
              <div className="font-black text-2xl text-foreground leading-none mt-2">
                {product.price ? `${Math.floor(product.price).toLocaleString()} €` : 'Gratuit'}
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}
