'use client'

import { Badge } from '@make-the-change/core/ui'
import { Award, Flame, Package, Star } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { sanitizeImageUrl } from '@/lib/image-url'
import { formatCurrency, getLocalizedContent } from '@/lib/utils'
import { getEntityViewTransitionName } from '@/lib/view-transition'
import { ProductDetailAddToCartButton } from './floating-action-buttons'
import type { ProductWithRelations } from './product-detail-data'
import { ProductFavoriteButton } from './product-favorite-button'
import { ProductShareButton } from './product-share-button'

type ProductQuickViewProps = {
  product: ProductWithRelations
}

export function ProductQuickView({ product }: ProductQuickViewProps) {
  const t = useTranslations('products')
  const locale = useLocale()
  const router = useRouter()

  const coverImage =
    sanitizeImageUrl(product.image_url) ||
    (Array.isArray(product.images) && product.images.length > 0
      ? sanitizeImageUrl(product.images[0])
      : undefined)

  const producerImage =
    product.producer?.images &&
    Array.isArray(product.producer.images) &&
    product.producer.images.length > 0
      ? sanitizeImageUrl(product.producer.images[0])
      : undefined

  const displayPoints = product.price_points || 0
  const displayPrice = displayPoints > 0 ? displayPoints / 100 : 0

  const inStock = (product.stock_quantity || 0) > 0
  const LOW_STOCK_THRESHOLD = 10
  const isLowStock = (product.stock_quantity || 0) <= LOW_STOCK_THRESHOLD

  const stockStatus = inStock
    ? isLowStock
      ? t('detail_page.stock_available', { count: product.stock_quantity || 0 })
      : t('card.in_stock')
    : t('card.out_of_stock')

  const productName = getLocalizedContent(
    product.name_i18n,
    locale,
    product.name_default || t('card.default_name'),
  )
  
  // Fix the backslash bug in description
  const rawDescription = getLocalizedContent(
    product.description_i18n,
    locale,
    product.description_default || '',
  )
  const productDescription = rawDescription.replace(/\\'/g, "'")

  const producerName = getLocalizedContent(
    product.producer?.name_i18n,
    locale,
    product.producer?.name_default || 'Producer',
  )
  const producerDescription = getLocalizedContent(
    product.producer?.description_i18n,
    locale,
    product.producer?.description_default || '',
  )
  const categoryName = getLocalizedContent(
    product.category?.name_i18n,
    locale,
    product.category?.name_default || '',
  )

  const mediaTransitionName = getEntityViewTransitionName('product', product.id, 'media')
  const titleTransitionName = getEntityViewTransitionName('product', product.id, 'title')

  const parsedPriceEuros =
    product.price_eur_equivalent === null || product.price_eur_equivalent === undefined
      ? Number.NaN
      : Number(product.price_eur_equivalent)
  const priceEuros = Number.isFinite(parsedPriceEuros) ? parsedPriceEuros : null

  return (
    <div className="relative flex h-full min-h-full flex-col bg-transparent">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-24 h-72 w-72 rounded-full bg-marketing-positive-500/10 blur-3xl" />
      </div>

      <div className="relative flex h-full flex-col">
        <div className="flex-1 overflow-y-auto overscroll-contain pb-4 sm:px-5 sm:pt-5 lg:px-6 lg:pt-6">
          <div className="grid gap-4 md:grid-cols-[1.08fr_0.92fr] lg:gap-6">
            <section>
              <div
                className="relative h-[clamp(220px,34vh,360px)] overflow-hidden rounded-none border-b border-border/50 bg-muted/40 sm:rounded-3xl sm:border"
                style={{ viewTransitionName: mediaTransitionName }}
              >
                {coverImage ? (
                  <img src={coverImage} alt={productName} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-linear-to-br from-primary/10 to-muted">
                    <Package className="h-16 w-16 text-primary/50" />
                  </div>
                )}
                
                {/* ── Overlay Gradient ── */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* ── Bottom Right Share + Favorite ── */}
                <div className="absolute bottom-4 right-4 z-20 flex gap-2">
                  <ProductShareButton
                    productName={productName}
                    productId={product.id}
                    className="h-10 w-10 rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md transition-all hover:bg-black/70 active:scale-95"
                  />
                  <ProductFavoriteButton
                    productName={productName}
                    productId={product.id}
                    className="h-10 w-10 rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md transition-all hover:bg-black/70 active:scale-95"
                  />
                </div>
              </div>
            </section>

            <aside className="space-y-4 px-4 sm:px-0">
              <div className="space-y-3">
                <h1
                  className="text-3xl font-black tracking-tight text-foreground sm:text-4xl"
                  style={{ viewTransitionName: titleTransitionName }}
                >
                  {productName}
                </h1>
                <div className="flex flex-wrap gap-2">
                  {categoryName && (
                    <Badge
                      variant="outline"
                      className="border-white/10 bg-white/5 text-muted-foreground transition-colors hover:bg-white/10"
                    >
                      <Package className="mr-1 h-3.5 w-3.5" />
                      {categoryName}
                    </Badge>
                  )}
                  {product.is_hero_product && (
                    <Badge className="border-none bg-white/10 text-primary backdrop-blur-sm">
                      <Award className="mr-1 h-3.5 w-3.5" />
                      {t('detail_page.hero_product_badge')}
                    </Badge>
                  )}
                </div>
              </div>
            </aside>
          </div>

          <div className="mt-4 space-y-4 px-4 pb-36 sm:px-0 sm:pb-40">
            {productDescription && (
              <section className="px-1">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {productDescription}
                </p>
              </section>
            )}

            {product.producer && (
              <section className="group border-y border-white/5 py-5 transition-colors hover:bg-white/[0.02]">
                <a href={`/${locale}/producers/${product.producer.slug || product.producer.id}`} className="flex items-center gap-4">
                  {producerImage ? (
                    <img
                      src={producerImage}
                      alt={producerName}
                      className="h-12 w-12 rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary transition-transform duration-300 group-hover:scale-105">
                      {producerName[0]?.toUpperCase() || 'P'}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-foreground underline-offset-4 group-hover:underline">
                      {producerName}
                    </p>
                    <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                      {producerDescription}
                    </p>
                  </div>
                </a>
              </section>
            )}

            {product.certifications && product.certifications.length > 0 && (
              <section className="rounded-2xl border border-white/10 bg-background/40 p-4">
                <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                  {t('detail.certifications')}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {product.certifications.map((certification, index) => (
                    <Badge
                      key={`${certification}-${index}`}
                      variant="outline"
                      className="border-marketing-positive-600/30 bg-marketing-positive-500/10 text-marketing-positive-700"
                    >
                      {certification}
                    </Badge>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* ── Sticky Bottom Bar ── */}
        <div className="relative shrink-0 border-t border-white/10 bg-background/60 p-4 backdrop-blur-xl sm:p-6">
          <div className="pointer-events-none absolute inset-x-0 -top-10 h-10 bg-gradient-to-t from-background/60 to-transparent" />
          
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-center justify-center gap-1">
              {/* Scarcity indicator */}
              {inStock && (
                <div className="mb-1 flex items-center gap-1.5">
                  <Flame size={12} className="text-orange-400/80" />
                  <span className="text-xs font-medium text-orange-400/80">
                    Série limitée • Plus que 12 exemplaires
                  </span>
                </div>
              )}
              
              {/* Price hierarchy */}
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-lime-400">
                  {displayPoints.toLocaleString('fr-FR')} Points
                </span>
                {displayPrice > 0 && (
                  <span className="text-sm font-medium text-muted-foreground">
                    ou {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                      maximumFractionDigits: 0,
                    }).format(displayPrice)}
                  </span>
                )}
              </div>
            </div>

            <ProductDetailAddToCartButton
              className="h-14 w-full rounded-2xl text-lg font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              productId={product.id}
              productName={productName}
              productSlug={product.slug}
              pricePoints={displayPoints}
              priceEuros={priceEuros}
              imageUrl={coverImage || null}
              fulfillmentMethod={product.fulfillment_method}
              stockQuantity={product.stock_quantity}
              inStock={inStock}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
