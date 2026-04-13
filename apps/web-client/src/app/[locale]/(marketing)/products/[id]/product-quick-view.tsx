'use client'

import { useState } from 'react'

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
import { ProductCheckoutView } from './product-checkout-view'

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

  // ─── GESTION DE L'ÉTAT (Le State React) ───
  const formats = [
    { id: "140g", points: 550, euros: 5.50 },
    { id: "250g", points: 950, euros: 9.50 },
    { id: "500g", points: 1800, euros: 18.00 }
  ];
  const [selectedFormat, setSelectedFormat] = useState(formats[0]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const displayPoints = selectedFormat.points
  const displayPrice = selectedFormat.euros

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
                  <div className="h-1.5 w-1.5 rounded-full bg-white" />
                  <div className="h-1.5 w-1.5 rounded-full bg-white/30" />
                  <div className="h-1.5 w-1.5 rounded-full bg-white/30" />
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
              <div className="space-y-2">
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
            {/* ── LA BENTO GRID INTERACTIVE ── */}
            <div className="grid grid-cols-2 gap-3 px-1 mb-6 mt-2">
              {/* BENTO 1 : SÉLECTEUR DE FORMAT */}
              <div className="col-span-2 bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="flex justify-between items-end mb-3">
                  <span className="text-[11px] text-white/50 uppercase tracking-wider font-bold">Choisir le format</span>
                </div>
                <div className="flex gap-2">
                  {formats.map((format) => (
                    <button
                      key={format.id}
                      onClick={() => setSelectedFormat(format)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                        selectedFormat.id === format.id 
                          ? 'bg-lime-400 text-[#0B0F15] shadow-lg' 
                          : 'bg-white/5 text-white hover:bg-white/10'
                      }`}
                    >
                      {format.id}
                    </button>
                  ))}
                </div>
              </div>

              {/* BENTO 2 : PROFIL GUSTATIF */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-2">
                <span className="text-[11px] text-white/50 uppercase tracking-wider font-bold">Profil Gustatif</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  <span className="bg-orange-500/20 text-orange-400 border border-orange-500/20 px-2 py-1 rounded-md text-[10px] font-bold">Ambré</span>
                  <span className="bg-amber-500/20 text-amber-400 border border-amber-500/20 px-2 py-1 rounded-md text-[10px] font-bold">Boisé</span>
                  <span className="bg-green-500/20 text-green-400 border border-green-500/20 px-2 py-1 rounded-md text-[10px] font-bold">Frais</span>
                </div>
              </div>

              {/* BENTO 3 : EXPÉDITION */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
                <span className="text-[11px] text-white/50 uppercase tracking-wider font-bold">Livraison</span>
                <span className="text-sm font-medium text-white mt-2">2 - 3 jours</span>
              </div>
            </div>

            {/* ── LA DESCRIPTION ÉPURÉE (Histoire) ── */}
            <section className="px-1 mb-10">
              <h3 className="text-sm font-bold text-white mb-2">À propos de ce miel</h3>
              <p className="text-white/70 leading-relaxed text-[14px]">
                Récolté de manière artisanale, il reflète la richesse des écosystèmes locaux et le travail des apiculteurs engagés. 
                Au-delà de ses qualités, ce miel soutient une apiculture durable et participe à la préservation du vivant grâce à la pollinisation.
              </p>
            </section>

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
                  Série limitée • En stock
                </span>
              </div>
            )}

            {/* Bouton Primaire : Échange en Points */}
            <button 
              onClick={() => setIsCheckoutOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-lime-400 px-4 py-4 text-[17px] font-black text-[#0B0F15] shadow-[0_0_30px_rgba(132,204,22,0.2)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Échanger {displayPoints.toLocaleString('fr-FR')} ✨
            </button>
            
            {/* Bouton Secondaire : Achat euros */}
            {displayPrice > 0 && (
              <button className="flex w-full items-center justify-center rounded-2xl px-4 py-1.5 text-[14px] font-medium text-white/50 underline underline-offset-4 transition-all hover:text-white hover:bg-white/5 active:scale-[0.98] active:opacity-50 mt-1">
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
      
      {/* ── Checkout Modal Interceptée ── */}
      {isCheckoutOpen && (
        <ProductCheckoutView 
          product={product} 
          selectedFormat={selectedFormat} 
          onClose={() => setIsCheckoutOpen(false)} 
        />
      )}
    </div>
  )
}
