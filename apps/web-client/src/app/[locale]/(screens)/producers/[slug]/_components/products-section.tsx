'use client'

/**
 * [ACTUEL_CODE] [SOURCE_PROTOTYPE]
 * Section Produits
 * 
 * Grid 2 colonnes.
 * Contexte terrain: "Issu des ruchers de..."
 * Produits comme conséquence naturelle de la mission.
 */

import { Link } from '@/i18n/navigation'
import { Leaf } from 'lucide-react'
import { CurrencyAmount } from '@/components/currency'
import type { ProducerProduct } from '../producer-detail-data'

type ProductsSectionProps = {
  products: ProducerProduct[]
  title?: string
  subtitle?: string
  producerFieldLocation?: string
}

export function ProductsSection({ 
  products, 
  title = "Produits issus des filières soutenues",
  subtitle,
  producerFieldLocation
}: ProductsSectionProps) {
  if (products.length === 0) return null

  return (
    <section className="mt-12 px-5">
      <h2 className="text-lg font-bold text-white/90">
        {title}
      </h2>
      {(subtitle || producerFieldLocation) && (
        <p className="mt-1 text-[14px] text-white/50">
          {subtitle || `Issus des ruchers partenaires de ${producerFieldLocation || 'Madagascar'}`}
        </p>
      )}
      
      <ul 
        className="mt-5 grid grid-cols-2 gap-x-4 gap-y-6 m-0 p-0 list-none"
        aria-label="Produits du partenaire"
      >
        {products.map((product) => (
          <li key={product.id}>
            <Link
              href={product.slug ? `/products/${product.slug}` : '/products'}
              className="group flex flex-col gap-2"
            >
              {/* Image */}
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-zinc-800">
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
    </section>
  )
}
