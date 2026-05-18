'use client'

/**
 * [ACTUEL_CODE] [SOURCE_PROTOTYPE]
 * Section Produits - Séparation app vs gamme partenaire
 *
 * Architecture:
 * - Produits partenaires disponibles dans l'app (achetables)
 * - Filières documentées du partenaire (éditorial, pas catalogue)
 */

import { Link } from '@/i18n/navigation'
import { Leaf, Info } from 'lucide-react'
import { CurrencyAmount } from '@/components/currency'
import type { ProducerProduct } from '../producer-detail-data'
import type { PartnerCatalogOverview } from '@/app/[locale]/(site)/producers/_features/mock-producers'

type ProductsSectionProps = {
  products: ProducerProduct[]
  partnerCatalog?: PartnerCatalogOverview
}

export function ProductsSection({
  products,
  partnerCatalog,
}: ProductsSectionProps) {
  const hasProducts = products.length > 0
  const hasCatalog = Boolean(partnerCatalog?.families.length)

  if (!hasProducts && !hasCatalog) return null

  return (
    <section className="mt-10">
      {/* ── Produits partenaires disponibles dans l'app ── */}
      {hasProducts && (
        <div className="mb-10">
          <div className="px-4">
            <h2 className="text-[17px] font-bold text-white/80">
              Produits partenaires disponibles
            </h2>
            <p className="mt-1 text-[13px] text-white/50">
              Achetables dans l&apos;app en Crédits Impact.
            </p>
          </div>

          {/* Carousel horizontal — même pattern que projets et biodex */}
          <ul
            className="mt-4 flex snap-x gap-3 overflow-x-auto px-4 scroll-pl-4 pb-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden m-0 list-none"
            aria-label="Produits disponibles"
          >
            {products.map((product) => (
              <li key={product.id} className="w-40 shrink-0 snap-start">
                <Link
                  href={product.slug ? `/products/${product.slug}` : '/products'}
                  className="group flex flex-col gap-2"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-zinc-800">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name_default || ''}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Leaf className="h-8 w-8 text-white/20" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-col gap-0.5">
                    <h4 className="text-[14px] font-semibold text-white line-clamp-2 leading-tight">
                      {product.name_default}
                    </h4>
                    {typeof product.price_points === 'number' && product.price_points > 0 && (
                      <div className="flex items-baseline gap-1">
                        <CurrencyAmount
                          kind="impactCredits"
                          value={product.price_points}
                          className="text-[13px] font-bold"
                        />
                        <span className="text-[10px] text-white/35">Crédits Impact</span>
                      </div>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {/* Reconnexion produit → filière */}
          <p className="mt-1 px-4 text-[12px] text-white/40">
            Ces produits sont liés aux filières documentées du partenaire.
          </p>
        </div>
      )}

      {/* ── Filières documentées du partenaire ── */}
      {hasCatalog && partnerCatalog && (
        <div className="px-4">
          <div className="mb-4">
            <h3 className="text-[17px] font-bold text-white/80">
              {partnerCatalog.title}
            </h3>
            <p className="mt-1 flex items-start gap-1.5 text-[12px] leading-snug text-white/50">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>{partnerCatalog.disclaimer}</span>
            </p>
          </div>

          {/* Layout éditorial avec séparateurs — pas des cards */}
          <div className="flex flex-col">
            {partnerCatalog.families.map((family, index) => (
              <div
                key={index}
                className={`py-3.5 ${index > 0 ? 'border-t border-white/[0.06]' : ''}`}
              >
                {/* Première famille plus prominente (filière cœur) */}
                <h4 className={`leading-tight ${index === 0 ? 'text-[15px] font-bold text-white/90' : 'text-[14px] font-semibold text-white/80'}`}>
                  {family.label}
                </h4>
                <p className="mt-1 text-[12px] text-white/60 leading-relaxed">
                  {family.examples.join(' · ')}
                </p>
                {family.origin && (
                  <p className="mt-0.5 text-[11px] text-white/40">
                    {family.origin}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
