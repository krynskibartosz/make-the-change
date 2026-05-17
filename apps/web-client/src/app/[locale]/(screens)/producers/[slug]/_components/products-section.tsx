'use client'

/**
 * [ACTUEL_CODE] [SOURCE_PROTOTYPE]
 * Section Produits - Séparation app vs gamme partenaire
 * 
 * Architecture:
 * - Produits sélectionnés dans l'app (achetables)
 * - Gamme complète du partenaire (informatif, avec disclaimer)
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
    <section className="mt-10 px-4">
      {/* ── Produits sélectionnés dans l'app ── */}
      {hasProducts && (
        <div className="mb-8">
          <h2 className="text-[17px] font-bold text-white/80">
            Sélection disponible
          </h2>
          <p className="mt-1 text-[13px] text-white/50">
            Produits sélectionnés dans l&apos;app Make the Change
          </p>
          
          <ul 
            className="mt-4 grid grid-cols-2 gap-x-3 gap-y-5 m-0 p-0 list-none"
            aria-label="Produits disponibles"
          >
            {products.map((product) => (
              <li key={product.id}>
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
                  <div className="mt-1 flex flex-col gap-0.5">
                    <h4 className="text-[14px] font-semibold text-white line-clamp-2">
                      {product.name_default}
                    </h4>
                    {typeof product.price_points === 'number' && product.price_points > 0 && (
                      <div className="mt-1">
                        <CurrencyAmount 
                          kind="impactCredits" 
                          value={product.price_points} 
                          className="text-[13px] font-bold" 
                        />
                      </div>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* ── Gamme complète du partenaire ── */}
      {hasCatalog && partnerCatalog && (
        <div>
          <div className="mb-3">
            <h3 className="text-[17px] font-bold text-white/80">
              {partnerCatalog.title}
            </h3>
            <p className="mt-1 flex items-start gap-1.5 text-[12px] leading-snug text-white/40">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>{partnerCatalog.disclaimer}</span>
            </p>
          </div>
          
          <div className="space-y-3">
            {partnerCatalog.families.map((family, index) => (
              <div 
                key={index}
                className="rounded-lg border border-white/5 bg-white/[0.02] p-3"
              >
                <h4 className="text-[14px] font-semibold text-white/90">
                  {family.label}
                </h4>
                <p className="mt-1 text-[12px] text-white/50">
                  {family.examples.join(' · ')}
                </p>
                {family.origin && (
                  <p className="mt-1 text-[11px] text-white/30">
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
