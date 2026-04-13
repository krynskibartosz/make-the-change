'use client'

import { Badge } from '@make-the-change/core/ui'
import { Award, Flame, Package, Star, Sparkles, Truck } from 'lucide-react'
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
                className="relative aspect-square md:aspect-[4/3] max-h-[60vh] w-full overflow-hidden rounded-none border-b border-white/10 bg-white/5 sm:rounded-3xl sm:border"
                style={{ viewTransitionName: mediaTransitionName }}
              >
                {coverImage ? (
                  <img src={coverImage} alt={productName} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-linear-to-br from-primary/10 to-muted">
                    <Package className="h-16 w-16 text-primary/50" />
                  </div>
                )}
                
                {/* ── Overlay Gradients ── */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/80 via-black/20 to-transparent z-10" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0B0F15] via-[#0B0F15]/40 to-transparent" />
                
                {/* Dots pagination */}
                <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-white opacity-100" />
                  <div className="h-1.5 w-1.5 rounded-full bg-white opacity-40" />
                  <div className="h-1.5 w-1.5 rounded-full bg-white opacity-40" />
                </div>

                {/* ── Bottom Right Share + Favorite ── */}
                <div className="absolute bottom-4 right-4 z-30 flex gap-2">
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
                  className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl"
                  style={{ viewTransitionName: titleTransitionName }}
                >
                  {productName}
                </h1>
                <div className="flex flex-wrap gap-2">
                  {categoryName && (
                    <Badge
                      variant="outline"
                      className="border-white/10 bg-white/5 text-white/80 backdrop-blur-sm transition-colors hover:bg-white/10"
                    >
                      {categoryName}
                    </Badge>
                  )}
                  {product.is_hero_product && (
                    <Badge className="border border-white/10 bg-white/5 text-white/90 backdrop-blur-sm">
                      🏆 Bestseller
                    </Badge>
                  )}
                </div>
              </div>
            </aside>
          </div>

          <div className="mt-4 space-y-4 px-4 pb-36 sm:px-0 sm:pb-40">
            {/* ── Spec Grid ── */}
            <div className="grid grid-cols-2 gap-3 px-1 mb-6">
              <div className="flex flex-col gap-1 rounded-2xl border border-white/10 bg-white/5 p-4">
                <Package className="h-5 w-5 text-white/50 mb-1.5" />
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Format</span>
                <span className="text-sm font-semibold text-white">À l'unité</span>
              </div>
              <div className="flex flex-col gap-1 rounded-2xl border border-white/10 bg-white/5 p-4">
                <Truck className="h-5 w-5 text-white/50 mb-1.5" />
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Livraison</span>
                <span className="text-sm font-semibold text-white">2 - 3 jours</span>
              </div>
            </div>

            {productDescription && (
              <section className="px-1">
                <p className="whitespace-pre-wrap text-[15px] leading-7 text-white/80 sm:text-base">
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
                      className="border-white/10 bg-white/5 text-emerald-400"
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
        <div className="relative shrink-0 border-t border-white/10 bg-[#0B0F15]/90 p-4 backdrop-blur-xl sm:p-6 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="pointer-events-none absolute inset-x-0 -top-10 h-10 bg-gradient-to-t from-[#0B0F15] to-transparent" />
          
          <div className="flex flex-col gap-3 max-w-md mx-auto w-full">
            {/* Scarcity indicator */}
            {inStock && (
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Flame size={14} className="text-orange-400" />
                <span className="text-[13px] font-bold text-orange-400">
                  Série limitée
                </span>
              </div>
            )}

            {/* Bouton Primaire : Échange en Points */}
            <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-lime-400 px-4 py-4 text-[17px] font-black text-[#0B0F15] shadow-[0_0_20px_rgba(163,230,53,0.15)] transition-transform hover:scale-[1.02] active:scale-[0.98]">
              Échanger {displayPoints.toLocaleString('fr-FR')} ✨
            </button>
            
            {/* Bouton Secondaire : Achat euros */}
            {displayPrice > 0 && (
              <button className="flex w-full items-center justify-center rounded-2xl px-4 py-1.5 text-[15px] font-bold text-white/50 transition-colors hover:text-white hover:bg-white/5 active:scale-[0.98]">
                Ou acheter pour {new Intl.NumberFormat('fr-FR', {
                  style: 'currency',
                  currency: 'EUR',
                  maximumFractionDigits: 2,
                }).format(displayPrice)}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
