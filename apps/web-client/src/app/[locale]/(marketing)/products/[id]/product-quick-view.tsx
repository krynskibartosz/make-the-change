'use client'

import { useState } from 'react'

import { Badge } from '@make-the-change/core/ui'
import { Award, Flame, Package, Star, Sparkles, Truck, Trophy, Hexagon, Info, ShieldCheck, ChevronRight, X } from 'lucide-react'
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
import { ArrowLeft } from 'lucide-react'

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

  const userBalance = 2450;
  const formats = [
    { id: "140g", points: 550, euros: 5.50, stock: 12 },
    { id: "250g", points: 950, euros: 9.50, stock: 45 },
    { id: "500g", points: 1800, euros: 18.00, stock: 3 }
  ];
  const [selectedFormat, setSelectedFormat] = useState(formats[0]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isNutritionModalOpen, setIsNutritionModalOpen] = useState(false);

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
                <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0B0F15]/80 to-transparent z-10" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0B0F15] via-[#0B0F15]/40 to-transparent z-10" />
                
                {/* ── Top Navigation & Actions ── */}
                <div className="absolute top-[max(1rem,env(safe-area-inset-top))] left-4 right-4 z-30 flex justify-between">
                  <button 
                    onClick={() => router.back()}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all hover:bg-black/60 active:scale-95"
                    aria-label="Retour"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <div className="flex gap-2">
                    <ProductShareButton
                      productName={productName}
                      productId={product.id}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all hover:bg-black/60 active:scale-95"
                    />
                    <ProductFavoriteButton
                      productName={productName}
                      productId={product.id}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all hover:bg-black/60 active:scale-95"
                    />
                  </div>
                </div>

                {/* Dots pagination */}
                <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-white" />
                  <div className="h-1.5 w-1.5 rounded-full bg-white/30" />
                  <div className="h-1.5 w-1.5 rounded-full bg-white/30" />
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
                <div className="flex flex-wrap gap-2 mt-3">
                  {categoryName && (
                    <span className="bg-white/5 border border-white/10 text-white/70 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <Hexagon className="w-3 h-3"/> {categoryName}
                    </span>
                  )}
                  {product.is_hero_product && (
                    <span className="bg-amber-500/10 border border-amber-500/20 text-amber-500 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <Trophy className="w-3 h-3"/> Bestseller
                    </span>
                  )}
                </div>
              </div>
            </aside>
          </div>

          <div className="mt-4 space-y-4 px-4 pb-36 sm:px-0 sm:pb-40">
            {/* ── LA BENTO GRID INTERACTIVE ── */}
            <div className="grid grid-cols-2 gap-3 px-1 mb-6 mt-2">
              {/* BENTO 1 : SÉLECTEUR DE FORMAT */}
              <div className="col-span-2 bg-white/[0.02] border-t border-b border-white/5 py-4 px-1 sm:p-4 sm:rounded-2xl sm:border">
                <div className="flex justify-between items-end mb-3">
                  <span className="text-[11px] text-white/50 uppercase tracking-wider font-bold">Choisir le format</span>
                  <div className="flex items-center gap-1.5 bg-lime-400/10 px-2.5 py-1 rounded-lg">
                    <span className="text-[11px] text-white/50 font-medium">Votre solde :</span>
                    <span className="flex items-center gap-1 text-xs font-bold text-lime-400 tabular-nums">
                      {userBalance} <Sparkles className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {formats.map((format) => (
                    <button
                      key={format.id}
                      onClick={() => setSelectedFormat(format)}
                      className={`flex-1 flex items-center justify-center h-12 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                        selectedFormat.id === format.id 
                          ? 'bg-lime-400 text-[#0B0F15] shadow-lg' 
                          : 'bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10'
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

            {/* ── TRANSPARENCE DU PRODUIT ── */}
            <section className="px-1 mt-8 mb-6">
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Transparence du produit</h3>
              
              <div className="bg-[#1A1F26] border border-white/5 rounded-3xl p-5 mb-3">
                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck className="w-4 h-4 text-white/50" />
                  <h4 className="text-sm font-bold text-white tracking-wide">Ingrédients & Conservation</h4>
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="block text-[11px] uppercase tracking-wider font-bold text-white/40 mb-1">Ingrédients</span>
                    <p className="text-white text-sm font-medium">100% Miel d'Eucalyptus</p>
                  </div>
                  <div>
                    <span className="block text-[11px] uppercase tracking-wider font-bold text-white/40 mb-1">Origine</span>
                    <p className="text-white text-sm font-medium">Madagascar</p>
                  </div>
                  <div>
                    <span className="block text-[11px] uppercase tracking-wider font-bold text-white/40 mb-1">Conservation</span>
                    <p className="text-sm leading-relaxed text-white/70">À conserver à l'abri de l'humidité et de la chaleur, dans une pièce à température ambiante (environ 20°C).</p>
                  </div>
                </div>
              </div>

              {/* BOUTON DÉCLENCHEUR NUTRITION */}
              <button 
                onClick={() => setIsNutritionModalOpen(true)}
                className="w-full bg-[#1A1F26] border border-white/5 hover:bg-white/5 transition-colors rounded-3xl p-4 flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                    <Info className="w-5 h-5 text-white/70" />
                  </div>
                  <div className="text-left">
                    <span className="block text-sm font-bold text-white tracking-wide">Valeurs Nutritionnelles</span>
                    <span className="block text-[11px] text-white/40 uppercase tracking-wider mt-0.5">Énergie, glucides, protéines...</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-white/30 group-hover:translate-x-1 transition-transform" />
              </button>
            </section>
          </div>
        </div>

        {/* ── Sticky Bottom Bar ── */}
        <div className="relative shrink-0 border-t border-white/10 bg-[#0B0F15]/90 p-4 backdrop-blur-xl sm:p-6 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="pointer-events-none absolute inset-x-0 -top-10 h-10 bg-gradient-to-t from-[#0B0F15] to-transparent" />
          
          <div className="flex flex-col gap-3 max-w-md mx-auto w-full">
            {/* Scarcity indicator */}
            {inStock && (
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <span className="text-xs font-bold text-orange-500">
                  {selectedFormat.stock < 20 ? `Série limitée • Plus que ${selectedFormat.stock} exemplaires` : 'En stock • Prêt à expédier'}
                </span>
              </div>
            )}

            {/* Bouton Primaire : Échange en Points */}
            <button 
              key={selectedFormat.points}
              onClick={() => setIsCheckoutOpen(true)}
              className="flex w-full h-14 items-center justify-center gap-2 rounded-2xl bg-lime-400 text-[17px] font-black text-[#0B0F15] shadow-[0_0_30px_rgba(132,204,22,0.2)] active:scale-[0.98] transition-all animate-in fade-in zoom-in duration-300"
            >
              Échanger <span className="tabular-nums">{displayPoints.toLocaleString('fr-FR')}</span> <Sparkles className="w-4 h-4" />
            </button>
            
            {/* Bouton Secondaire : Achat euros */}
            {displayPrice > 0 && (
              <button className="flex w-full mt-2 items-center justify-center rounded-2xl px-4 py-1.5 text-xs font-medium text-white/40 hover:text-white transition-colors active:scale-[0.98] active:opacity-50">
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

      {/* ── MODALE BOTTOM SHEET (NUTRITION) ── */}
      {isNutritionModalOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end">
          {/* OVERLAY (Ferme la modale au clic) */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsNutritionModalOpen(false)}
          ></div>

          {/* LE TIROIR */}
          <div className="relative w-full bg-[#0B0F15] rounded-t-3xl border-t border-white/10 p-6 pt-3 flex flex-col max-h-[85vh] animate-in slide-in-from-bottom duration-300 shadow-[0_-20px_40px_rgba(0,0,0,0.5)]">
            
            {/* DRAG HANDLE (La petite barre grise en haut pour swipe) */}
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6"></div>

            {/* HEADER DU TIROIR */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white tracking-tight">Nutrition (100g)</h3>
              <button 
                onClick={() => setIsNutritionModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-transform active:scale-95 hover:bg-white/20"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* LE CONTENU DENSE */}
            <div className="overflow-y-auto overscroll-contain pb-safe">
              <div className="flex flex-col text-[14px]">
                <div className="flex justify-between py-3.5 border-b border-white/5">
                  <span className="text-white/70">Énergie (Kj/Kcal)</span>
                  <span className="text-white font-semibold tabular-nums">1374 / 328</span>
                </div>
                <div className="flex justify-between py-3.5 border-b border-white/5">
                  <span className="text-white/70">Matières Grasses</span>
                  <span className="text-white font-semibold tabular-nums">0.22 g</span>
                </div>
                <div className="flex justify-between py-3.5 border-b border-white/5">
                  <span className="text-white/40 pl-4 text-sm relative before:content-[''] before:absolute before:left-0 before:top-1/2 before:w-2 before:h-[1px] before:bg-white/20">dont acides gras saturés</span>
                  <span className="text-white/70 font-semibold text-sm tabular-nums">0 g</span>
                </div>
                <div className="flex justify-between py-3.5 border-b border-white/5">
                  <span className="text-white/70">Glucides</span>
                  <span className="text-white font-semibold tabular-nums">81 g</span>
                </div>
                <div className="flex justify-between py-3.5 border-b border-white/5">
                  <span className="text-white/40 pl-4 text-sm relative before:content-[''] before:absolute before:left-0 before:top-1/2 before:w-2 before:h-[1px] before:bg-white/20">dont sucres</span>
                  <span className="text-white/70 font-semibold text-sm tabular-nums">74 g</span>
                </div>
                <div className="flex justify-between py-3.5 border-b border-white/5">
                  <span className="text-white/70">Protéines</span>
                  <span className="text-white font-semibold tabular-nums">0.8 g</span>
                </div>
                <div className="flex justify-between py-3.5">
                  <span className="text-white/70">Sel</span>
                  <span className="text-white font-semibold tabular-nums">0 g</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
