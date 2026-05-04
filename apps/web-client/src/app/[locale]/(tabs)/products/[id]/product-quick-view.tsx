'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { Badge } from '@make-the-change/core/ui'
import { Flame, Package, Truck, Leaf, Hexagon, Info, ShieldCheck, ChevronRight, ChevronDown, X } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { CurrencyAmount, getCurrencyDesign } from '@/components/currency'
import { useRouter } from '@/i18n/navigation'
import { sanitizeImageUrl } from '@/lib/image-url'
import { getLocalizedContent } from '@/lib/utils'
import { getEntityViewTransitionName } from '@/lib/view-transition'
import type { ProductWithRelations } from './product-detail-data'
import { ProductFavoriteButton } from './product-favorite-button'
import { ProductShareButton } from './product-share-button'
import { ProductCheckoutView } from './product-checkout-view'
import { ProductFiatCheckoutView } from './product-fiat-checkout-view'

type ProductQuickViewProps = {
  product: ProductWithRelations
}

type ProductFormat = {
  id: string
  points: number
  euros: number
  stock: number
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
  const formats: ProductFormat[] = [
    { id: "140g", points: 550, euros: 5.50, stock: 12 },
    { id: "250g", points: 950, euros: 9.50, stock: 45 },
    { id: "500g", points: 1800, euros: 18.00, stock: 3 }
  ];
  const defaultFormat = formats[0]!
  const [selectedFormat, setSelectedFormat] = useState<ProductFormat>(defaultFormat);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isFiatCheckoutOpen, setIsFiatCheckoutOpen] = useState(false)
  const [isNutritionModalOpen, setIsNutritionModalOpen] = useState(false);
  const [isCompositionOpen, setIsCompositionOpen] = useState(false)
  const [isConservationOpen, setIsConservationOpen] = useState(false)

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
                
                {/* ── Top Actions (Aligned to top-right) ── */}
                <div className="absolute top-[max(1rem,env(safe-area-inset-top))] right-4 z-30 flex justify-end">
                  <div className="flex gap-2">
                    <ProductShareButton
                      productName={productName}
                      productId={product.id}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md border border-white/10 transition-all hover:bg-black/60 active:scale-95"
                    />
                    <ProductFavoriteButton
                      productName={productName}
                      productId={product.id}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md border border-white/10 transition-all hover:bg-black/60 active:scale-95"
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
                  {product.tags && product.tags[0] && (
                    <span className="bg-lime-400/10 border border-lime-400/20 text-lime-400 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <Leaf className="w-3 h-3" /> {product.tags[0]}
                    </span>
                  )}
                  {product.featured && (
                    <span className="bg-amber-400/10 border border-amber-500/30 text-amber-400 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                      👑 Accès anticipé Gardiens
                    </span>
                  )}
                </div>
              </div>
            </aside>
          </div>

          {product.producer && (
            <a
              href={`/${locale}/producers/${product.producer.slug || product.producer.id}`}
              className="flex items-center gap-3 px-4 py-3 border-y border-white/5 group mt-2"
            >
              {producerImage ? (
                <img src={producerImage} alt={producerName} className="h-8 w-8 rounded-full object-cover shrink-0" />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary shrink-0">
                  {producerName[0]?.toUpperCase() || 'P'}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Producteur partenaire</p>
                <p className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors truncate">
                  {producerName}{product.producer.address_city ? ` · ${product.producer.address_city}` : ''}{product.producer.address_country_code ? `, ${product.producer.address_country_code.toUpperCase()}` : ''}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors shrink-0" />
            </a>
          )}

          <div className="mt-4 space-y-4 px-4 pb-36 sm:px-0 sm:pb-40">
            {/* ── Scarcity Indicator ── */}
            {inStock && selectedFormat.stock < 20 && (
              <div className="flex items-center gap-1.5 mb-3 px-1">
                <Flame className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <span className="text-xs font-bold text-orange-500">
                  Série limitée · Plus que {selectedFormat.stock} exemplaire{selectedFormat.stock > 1 ? 's' : ''}
                </span>
              </div>
            )}

            {/* ── SÉLECTEUR DE FORMAT ── */}
            <div className="px-1 pt-4 pb-2">
              <div className="flex justify-between items-end mb-3">
                <span className="text-[11px] text-white/50 uppercase tracking-wider font-bold">Choisir le format</span>
                <div className="flex items-center gap-1.5 rounded-lg bg-amber-300/10 px-2.5 py-1">
                  <span className="text-[11px] text-white/50 font-medium">Votre solde :</span>
                  <CurrencyAmount kind="impactCredits" value={userBalance} className="text-xs font-bold" />
                </div>
              </div>
              <div className="flex gap-2">
                {formats.map((format) => (
                  <button
                    key={format.id}
                    onClick={() => setSelectedFormat(format)}
                    className={`flex-1 flex items-center justify-center h-12 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                      selectedFormat.id === format.id
                        ? 'bg-amber-300 text-[#120d04] shadow-lg'
                        : 'bg-white/5 border border-white/20 text-white/90 font-semibold hover:bg-white/10 hover:border-white/30'
                    }`}
                  >
                    {format.id}
                  </button>
                ))}
              </div>
            </div>

            {/* ── DESCRIPTION (Séduction) ── */}
            <section className="px-1 pt-4 mb-4">
              <h3 className="text-sm font-bold text-white mb-2">À propos de ce miel</h3>
              <p className="text-white/70 leading-relaxed text-[14px]">
                Récolté de manière artisanale, il reflète la richesse des écosystèmes locaux et le travail des apiculteurs engagés.
                Au-delà de ses qualités, ce miel soutient une apiculture durable et participe à la préservation du vivant grâce à la pollinisation.
              </p>
            </section>

            {/* ── PROFIL GUSTATIF + LIVRAISON (Séduction suite) ── */}
            <div className="px-1 flex gap-8 pt-2 pb-10">
              {/* PROFIL GUSTATIF */}
              <div className="flex flex-col gap-2">
                <span className="text-[11px] text-white/50 uppercase tracking-wider font-bold">Profil Gustatif</span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="bg-orange-500/20 text-orange-400 border border-orange-500/20 px-2 py-1 rounded-md text-[10px] font-bold">Ambré</span>
                  <span className="bg-amber-500/20 text-amber-400 border border-amber-500/20 px-2 py-1 rounded-md text-[10px] font-bold">Boisé</span>
                  <span className="bg-green-500/20 text-green-400 border border-green-500/20 px-2 py-1 rounded-md text-[10px] font-bold">Frais</span>
                </div>
              </div>

              {/* LIVRAISON */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-white/30" />
                  <span className="text-[11px] text-white/50 uppercase tracking-wider font-bold">Livraison</span>
                </div>
                <span className="text-sm font-medium text-white">2 – 3 jours</span>
              </div>
            </div>

            {product.certifications && product.certifications.filter(c => !/^Origine\b/i.test(c)).length > 0 && (
              <section className="px-1 pb-6">
                <h2 className="mb-2 text-[11px] font-bold uppercase tracking-widest text-white/40">
                  {t('detail.certifications')}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {product.certifications
                    .filter(c => !/^Origine\b/i.test(c))
                    .map((certification, index) => (
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

            {/* BLOC COMPOSITION ET CONSERVATION */}
            <div className="px-1 mt-8">
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Informations produit</h3>

              {/* Accordéon Composition */}
              <button
                onClick={() => setIsCompositionOpen(v => !v)}
                className="w-full flex items-center justify-between py-4 border-b border-white/5"
              >
                <span className="text-sm font-bold text-white">Composition & Origine</span>
                <ChevronDown className={`w-4 h-4 text-white/30 transition-transform duration-200 ${isCompositionOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isCompositionOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="py-4 border-b border-white/5 grid grid-cols-2 gap-4">
                      <div>
                        <span className="block text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Ingrédients</span>
                        <p className="text-sm font-medium text-white">100% miel d'Eucalyptus</p>
                      </div>
                      <div>
                        <span className="block text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Origine</span>
                        <p className="text-sm font-medium text-white">Madagascar</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Accordéon Conservation */}
              <button
                onClick={() => setIsConservationOpen(v => !v)}
                className="w-full flex items-center justify-between py-4"
              >
                <span className="text-sm font-bold text-white">Conservation</span>
                <ChevronDown className={`w-4 h-4 text-white/30 transition-transform duration-200 ${isConservationOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isConservationOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="py-4">
                      <p className="text-[13px] text-white/70 leading-relaxed">
                        À conserver à l'abri de l'humidité et de la chaleur, dans une pièce à température ambiante (environ 20 °C).
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* BOUTON DÉCLENCHEUR NUTRITION */}
            <div className="px-1 mt-4 mb-32">
              <button  
                onClick={() => setIsNutritionModalOpen(true)}
                className="w-full bg-[#1A1F26] border border-white/5 hover:bg-white/10 transition-colors rounded-2xl p-4 flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                    <Info className="w-4 h-4 text-white/70" /> 
                  </div>
                  <div className="text-left">
                    <span className="block text-sm font-bold text-white tracking-wide">Valeurs Nutritionnelles</span>
                    <span className="block text-[11px] text-white/40 mt-0.5">Pour 100g : 328 kcal, 81g glucides...</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-white/30 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Sticky Bottom Bar ── */}
        <div className="relative shrink-0 border-t border-white/10 bg-[#0B0F15]/90 p-4 backdrop-blur-xl sm:p-6 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="pointer-events-none absolute inset-x-0 -top-10 h-10 bg-gradient-to-t from-[#0B0F15] to-transparent" />
          
          <div className="flex flex-col gap-3 max-w-md mx-auto w-full">
            {/* Boutons d'Achat Dynamiques */}
            {userBalance >= displayPoints ? (
              <>
                <button 
                  key={`exchange-${selectedFormat.points}`}
                  onClick={() => setIsCheckoutOpen(true)}
                  className={`flex w-full h-14 items-center justify-center gap-2 rounded-2xl text-[17px] font-black shadow-[0_0_30px_rgba(252,211,77,0.18)] active:scale-[0.98] transition-all animate-in fade-in zoom-in duration-300 ${getCurrencyDesign('impactCredits').ctaClassName}`}
                >
                  Utiliser mes crédits <CurrencyAmount kind="impactCredits" value={displayPoints} tone="inherit" className="text-[17px] font-black" />
                </button>
                
                {displayPrice > 0 && (
                  <button 
                    onClick={() => setIsFiatCheckoutOpen(true)}
                    className="flex w-full mt-2 items-center justify-center rounded-2xl px-4 py-1.5 text-xs font-medium text-white/40 hover:text-white transition-colors active:scale-[0.98] active:opacity-50"
                  >
                    Ou acheter pour {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                      maximumFractionDigits: 2,
                    }).format(displayPrice)}
                  </button>
                )}
              </>
            ) : (
              <>
                <button 
                  key={`buy-${selectedFormat.euros}`}
                  onClick={() => setIsFiatCheckoutOpen(true)}
                  className="flex w-full h-14 items-center justify-center gap-2 rounded-2xl bg-emerald-400 text-[17px] font-black text-[#0B0F15] shadow-[0_0_30px_rgba(52,211,153,0.18)] active:scale-[0.98] transition-all animate-in fade-in zoom-in duration-300 hover:bg-emerald-300"
                >
                  Acheter pour {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                    maximumFractionDigits: 2,
                  }).format(displayPrice)}
                </button>
                <div className="mt-2 text-center text-xs text-white/60">
                  Il vous manque <CurrencyAmount kind="impactCredits" value={displayPoints - userBalance} className="font-bold" /> pour l'obtenir gratuitement.{' '}
                  <a href={`/${locale}/projects`} className="text-white underline decoration-white/30 hover:decoration-white transition-all">Soutenir un projet</a>
                </div>
              </>
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


      {/* ── Checkout Fiat Interceptée ── */}
      {isFiatCheckoutOpen && (
        <ProductFiatCheckoutView 
          product={product} 
          selectedFormat={selectedFormat} 
          onClose={() => setIsFiatCheckoutOpen(false)} 
        />
      )}

      {/* MODALE BOTTOM SHEET (NUTRITION) - STYLE ECO-FACT */}
      <AnimatePresence>
      {isNutritionModalOpen && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] overflow-y-auto bg-[#0B0F15]"
          onClick={(event) => event.stopPropagation()}
        >
          {/* HEADER FIXE */}
          <div className="sticky top-0 z-20 bg-[#0B0F15]/90 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-white/5 pt-[max(1.5rem,env(safe-area-inset-top))]">
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Valeurs Nutritionnelles</h3>
              <p className="text-sm text-white/50">Pour 100g de produit</p>
            </div>
            <button 
              onClick={(event) => {
                event.stopPropagation()
                setIsNutritionModalOpen(false)
              }}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center active:scale-95 transition-transform"
              aria-label="Fermer"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* DONNÉES EXACTES EXTRAITES DU DOCUMENT */}
          <div className="px-6 pb-[max(2rem,env(safe-area-inset-bottom))] mt-6">
            <div className="flex flex-col text-[15px]">
              
              <div className="flex justify-between py-4 border-b border-white/5">
                <span className="text-white/70 tracking-wide">Énergie (Kj/KCal)</span>
                <span className="text-white font-black tabular-nums">1374 / 328</span>
              </div>
              
              <div className="flex justify-between py-4 border-b border-white/5">
                <span className="text-white/70 tracking-wide">Matières Grasses <span className="text-white/30 text-xs ml-1 font-medium">(Gr)</span></span>
                <span className="text-white font-black tabular-nums">0.22</span>
              </div>
              
              <div className="flex justify-between py-4 border-b border-white/5">
                <span className="text-white/40 pl-6 text-sm relative before:content-[''] before:absolute before:left-2 before:top-1/2 before:w-2 before:h-[1px] before:bg-white/20">Dont d'acides gras saturés <span className="text-white/20 text-xs ml-1 font-medium">(Gr)</span></span>
                <span className="text-white/80 font-bold text-sm tabular-nums">0</span>
              </div>
              
              <div className="flex justify-between py-4 border-b border-white/5">
                <span className="text-white/70 tracking-wide">Glucides <span className="text-white/30 text-xs ml-1 font-medium">(Gr)</span></span>
                <span className="text-white font-black tabular-nums">81</span>
              </div>
              
              <div className="flex justify-between py-4 border-b border-white/5">
                <span className="text-white/40 pl-6 text-sm relative before:content-[''] before:absolute before:left-2 before:top-1/2 before:w-2 before:h-[1px] before:bg-white/20">Dont Sucres <span className="text-white/20 text-xs ml-1 font-medium">(Gr)</span></span>
                <span className="text-white/80 font-bold text-sm tabular-nums">74</span>
              </div>
              
              <div className="flex justify-between py-4 border-b border-white/5">
                <span className="text-white/70 tracking-wide">Protéines <span className="text-white/30 text-xs ml-1 font-medium">(Gr)</span></span>
                <span className="text-white font-black tabular-nums">0.8</span>
              </div>
              
              <div className="flex justify-between py-4">
                <span className="text-white/70 tracking-wide">Sel <span className="text-white/30 text-xs ml-1 font-medium">(Gr)</span></span>
                <span className="text-white font-black tabular-nums">0</span>
              </div>

            </div>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  )
}
