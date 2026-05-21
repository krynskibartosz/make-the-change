'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { Flame, Package, Truck, Info, ChevronRight, ChevronUp, ChevronDown, X } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { CurrencyAmount, getCurrencyDesign } from '@/components/currency'
import { sanitizeImageUrl } from '@/lib/image-url'
import { getLocalizedContent } from '@/lib/utils'
import { getEntityViewTransitionName } from '@/lib/view-transition'
import { BottomActionBar } from '@/app/[locale]/_components/bottom-action-bar'
import type { ProductWithRelations } from './product-detail-data'
import { ProductShareButton } from './_components/product-share-button'
import { ProductCheckoutView } from './_features/product-checkout-view'
import { ProductFiatCheckoutView } from './_features/product-fiat-checkout-view'

type ProductQuickViewProps = {
  product: ProductWithRelations
  userBalance: number
}

type ProductFormat = {
  id: string
  label: string
  points: number
  euros: number
  stock: number
}

// ─── Glow contextuel par catégorie produit ──────────────────────────────────
type ProductGlowTone = 'amber' | 'sky' | 'rose' | 'teal' | 'green'

const PRODUCT_GLOW: Record<ProductGlowTone, { r: number; g: number; b: number }> = {
  amber: { r: 245, g: 158, b: 11  }, // amber-500  → miel        (couleur du miel)
  sky:   { r: 14,  g: 165, b: 233 }, // sky-500    → savon       (propre, eau, fraîcheur)
  rose:  { r: 244, g: 114, b: 182 }, // pink-400   → huile visage (soin, beauté)
  teal:  { r: 20,  g: 184, b: 166 }, // teal-500   → shampoing   (fraîcheur capillaire)
  green: { r: 16,  g: 185, b: 129 }, // emerald-500 → huile d'olive (couleur olive)
}

function getProductGlowTone(categoryId: string | null | undefined): ProductGlowTone {
  const id = categoryId?.toLowerCase() ?? ''
  if (id.includes('olive'))   return 'green'
  if (id.includes('soap'))    return 'sky'
  if (id.includes('shampoo')) return 'teal'
  if (id.includes('oil'))     return 'rose'
  return 'amber' // honey + défaut
}

function productGlowRgba(tone: { r: number; g: number; b: number }, alpha: number): string {
  return `rgba(${tone.r}, ${tone.g}, ${tone.b}, ${alpha})`
}
// ────────────────────────────────────────────────────────────────────────────

export function ProductQuickView({ product, userBalance }: ProductQuickViewProps) {
  const t = useTranslations('products')
  const locale = useLocale()

  const glow = PRODUCT_GLOW[getProductGlowTone(product.category_id)]

  const coverImage =
    sanitizeImageUrl(product.image_url) ||
    (Array.isArray(product.images) && product.images.length > 0
      ? sanitizeImageUrl(product.images[0])
      : undefined)

  const producerImage = product.producer?.visualAssets?.portrait
    ? sanitizeImageUrl(product.producer.visualAssets.portrait)
    : product.producer?.images &&
      Array.isArray(product.producer.images) &&
      product.producer.images.length > 0
      ? sanitizeImageUrl(product.producer.images[0])
      : undefined

  const formats: ProductFormat[] =
    product.variants && product.variants.length > 0
      ? product.variants.map((v) => ({
          id: v.id,
          label: v.format_label,
          points: v.price_points,
          euros: v.price_eur_equivalent,
          stock: v.stock_quantity,
        }))
      : [
          {
            id: product.id,
            label: product.name_default,
            points: product.price_points ?? 0,
            euros: product.price_eur_equivalent ?? 0,
            stock: product.stock_quantity ?? 0,
          },
        ]
  const defaultFormat = formats[0]!
  const [selectedFormat, setSelectedFormat] = useState<ProductFormat>(defaultFormat);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isFiatCheckoutOpen, setIsFiatCheckoutOpen] = useState(false)
  const [isNutritionModalOpen, setIsNutritionModalOpen] = useState(false)
  const [isCompositionOpen, setIsCompositionOpen] = useState(false)
  const [isConservationOpen, setIsConservationOpen] = useState(false)
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)

  const displayPoints = selectedFormat.points
  const displayPrice = selectedFormat.euros

  const inStock = (product.stock_quantity || 0) > 0

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
  const mediaTransitionName = getEntityViewTransitionName('product', product.id, 'media')
  const titleTransitionName = getEntityViewTransitionName('product', product.id, 'title')

  return (
    <div className="relative flex h-full min-h-full flex-col bg-transparent">
      <div className="pointer-events-none absolute inset-0">
        {/* Glow ambiance haut – halo discret au-dessus du visuel */}
        <div
          className="absolute -right-20 -top-24 h-72 w-72 rounded-full blur-3xl"
          style={{ backgroundColor: productGlowRgba(glow, 0.12) }}
        />
        {/* Glow de destination bas – lumière d'appel vers le CTA */}
        <div
          className="absolute -bottom-20 -left-24 h-72 w-72 rounded-full blur-3xl"
          style={{ backgroundColor: productGlowRgba(glow, 0.15) }}
        />
      </div>

      <div className="relative flex h-full flex-col">
        <div
          data-modal-scroll-root
          className="flex-1 overflow-y-auto overscroll-contain pb-4"
        >
          <div>
            <section>
              <div
                className="relative aspect-[4/5] max-h-[420px] min-h-[340px] w-full overflow-hidden rounded-none border-b border-white/10 bg-white/5"
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
                  <ProductShareButton
                    productName={productName}
                    productId={product.id}
                  />
                </div>

                {/* Dots pagination */}
                <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-white" />
                  <div className="h-1.5 w-1.5 rounded-full bg-white/30" />
                  <div className="h-1.5 w-1.5 rounded-full bg-white/30" />
                </div>
              </div>
            </section>

            <aside className="space-y-4 px-4 pt-4">
              <div>
                <h1
                  className="text-3xl font-black leading-tight tracking-tight text-white"
                  style={{ viewTransitionName: titleTransitionName }}
                >
                  {productName}
                </h1>
              </div>
            </aside>
          </div>

          {product.producer && (
            <a
              href={`/${locale}/producers/${product.producer.slug || product.producer.id}`}
              className="flex items-center gap-3 px-4 py-3 border-y border-white/5 group mt-4"
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

          <div className="mt-4 space-y-4 px-4 pb-36">
            {/* ── Scarcity Indicator ── */}
            <div className="flex items-center gap-1.5 px-1 min-h-[20px]">
              {inStock && selectedFormat.stock < 20 && (
                <>
                  <Flame className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  <span className="text-xs font-bold text-orange-500">
                    Série limitée · Plus que {selectedFormat.stock} exemplaire{selectedFormat.stock > 1 ? 's' : ''}
                  </span>
                </>
              )}
            </div>

            {/* ── DESCRIPTION (Séduction) ── */}
            <section className="px-1 pt-4 mb-4">
              <h3 className="text-sm font-bold text-white mb-2">À propos de ce produit</h3>
              <p className={`text-white/70 leading-relaxed text-[14px] ${isDescriptionExpanded ? '' : 'line-clamp-3'}`}>
                {productDescription || 'Découvrez ce produit partenaire soigneusement sélectionné parmi nos producteurs engagés.'}
              </p>
              {productDescription && productDescription.length > 180 && (
                <button
                  onClick={() => setIsDescriptionExpanded(v => !v)}
                  className="mt-1.5 text-[13px] font-semibold text-white/40 hover:text-white/70 transition-colors"
                >
                  {isDescriptionExpanded ? 'Lire moins' : 'Lire plus'}
                </button>
              )}
            </section>

            {/* ── PROFIL GUSTATIF + LIVRAISON (Séduction suite) ── */}
            <div className="px-1 flex gap-8 pt-2 pb-6">
              {/* PROFIL GUSTATIF */}
              {product.taste_profile && product.taste_profile.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] text-white/50 uppercase tracking-wider font-bold">Profil Gustatif</span>
                  <div className="flex flex-wrap gap-1.5">
                    {product.taste_profile.map((tag) => (
                      <span key={tag} className="bg-white/10 text-white/70 border border-white/10 px-2 py-1 rounded-md text-[10px] font-bold">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* LIVRAISON */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-white/30" />
                  <span className="text-[11px] text-white/50 uppercase tracking-wider font-bold">Livraison</span>
                </div>
                <span className="text-sm font-medium text-white">2 – 3 jours</span>
              </div>
            </div>


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
                        <p className="text-sm font-medium text-white">{product.composition?.ingredients ?? '—'}</p>
                      </div>
                      <div>
                        <span className="block text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Origine</span>
                        <p className="text-sm font-medium text-white">{product.composition?.origin ?? '—'}</p>
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
                        {product.conservation ?? 'Conserver dans un endroit frais et sec.'}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* BOUTON DÉCLENCHEUR NUTRITION */}
            {product.nutrition && (
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
                      <span className="block text-sm font-bold text-white tracking-wide">Valeurs nutritionnelles</span>
                      <span className="block text-[11px] text-white/40 mt-0.5">
                        Pour 100g : {product.nutrition.energy_kcal} kcal, {product.nutrition.carbs_g}g glucides...
                      </span>
                    </div>
                  </div>
                  <ChevronUp className="w-5 h-5 text-white/30 transition-transform" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Sticky Bottom Bar ── */}
        <BottomActionBar className="absolute bottom-0 left-0 right-0 z-20">
          <div className="pointer-events-none absolute inset-x-0 -top-10 h-10 bg-gradient-to-t from-background to-transparent" />
          
          <div className="flex flex-col gap-3 max-w-md mx-auto w-full">
            {/* Format selector — native select stylé en chip, positionné à gauche */}
            {formats.length > 1 && (
              <div className="relative self-start">
                <select
                  value={selectedFormat.id}
                  onChange={(e) => {
                    const found = formats.find((f) => f.id === e.target.value)
                    if (found) setSelectedFormat(found)
                  }}
                  className="appearance-none cursor-pointer rounded-xl border border-white/10 bg-white/5 py-2 pl-4 pr-8 text-sm font-bold text-white transition-all active:scale-95"
                >
                  {formats.map((format) => (
                    <option key={format.id} value={format.id}>
                      {format.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/40" />
              </div>
            )}
            {userBalance >= displayPoints ? (
              <>
                <button
                  key={`exchange-${selectedFormat.points}`}
                  onClick={() => setIsCheckoutOpen(true)}
                  className={`flex w-full h-14 items-center justify-center gap-2 rounded-2xl text-[17px] font-black shadow-[0_0_30px_rgba(252,211,77,0.18)] active:scale-[0.98] transition-all animate-in fade-in zoom-in duration-300 ${getCurrencyDesign('impactCredits').ctaClassName}`}
                >
                  Échanger · <CurrencyAmount kind="impactCredits" value={displayPoints} tone="inherit" className="text-[17px] font-black" />
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
        </BottomActionBar>
      </div>

      {/* ── Checkout Modal Interceptée ── */}
      {isCheckoutOpen && (
        <ProductCheckoutView
          product={product}
          selectedFormat={selectedFormat}
          initialBalance={userBalance}
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
      {isNutritionModalOpen && product.nutrition && (
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
              <h3 className="text-xl font-bold text-white tracking-tight">Valeurs nutritionnelles</h3>
              <p className="text-sm text-white/50">Pour 100 g de produit</p>
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

          <div className="px-6 pb-[max(2rem,env(safe-area-inset-bottom))] mt-6">
            <div className="flex flex-col text-[15px]">

              <div className="flex justify-between py-4 border-b border-white/5">
                <span className="text-white/70 tracking-wide">Énergie</span>
                <span className="text-white font-black tabular-nums">{product.nutrition.energy_kj} kJ / {product.nutrition.energy_kcal} kcal</span>
              </div>

              <div className="flex justify-between py-4 border-b border-white/5">
                <span className="text-white/70 tracking-wide">Matières grasses</span>
                <span className="text-white font-black tabular-nums">{product.nutrition.fat_g} g</span>
              </div>

              <div className="flex justify-between py-4 border-b border-white/5">
                <span className="text-white/40 pl-6 text-sm relative before:content-[''] before:absolute before:left-2 before:top-1/2 before:w-2 before:h-[1px] before:bg-white/20">dont acides gras saturés</span>
                <span className="text-white/80 font-bold text-sm tabular-nums">{product.nutrition.saturated_fat_g} g</span>
              </div>

              <div className="flex justify-between py-4 border-b border-white/5">
                <span className="text-white/70 tracking-wide">Glucides</span>
                <span className="text-white font-black tabular-nums">{product.nutrition.carbs_g} g</span>
              </div>

              <div className="flex justify-between py-4 border-b border-white/5">
                <span className="text-white/40 pl-6 text-sm relative before:content-[''] before:absolute before:left-2 before:top-1/2 before:w-2 before:h-[1px] before:bg-white/20">dont sucres</span>
                <span className="text-white/80 font-bold text-sm tabular-nums">{product.nutrition.sugars_g} g</span>
              </div>

              <div className="flex justify-between py-4 border-b border-white/5">
                <span className="text-white/70 tracking-wide">Protéines</span>
                <span className="text-white font-black tabular-nums">{product.nutrition.protein_g} g</span>
              </div>

              <div className="flex justify-between py-4">
                <span className="text-white/70 tracking-wide">Sel</span>
                <span className="text-white font-black tabular-nums">{product.nutrition.salt_g} g</span>
              </div>

            </div>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  )
}
