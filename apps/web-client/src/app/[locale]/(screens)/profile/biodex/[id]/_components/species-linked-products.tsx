'use client'
import { Package } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { sanitizeImageUrl } from '@/lib/image-url'

export type SpeciesLinkedProducerData = {
  producerSlug: string
  producerName: string
  products: {
    id: string
    slug: string | null
    name_default: string | null
    image_url: string | null
  }[]
}

interface SpeciesLinkedProductsProps {
  producers: SpeciesLinkedProducerData[]
}

export function SpeciesLinkedProducts({ producers }: SpeciesLinkedProductsProps) {
  const allProducts = producers.flatMap((p) => p.products).slice(0, 4)
  const mainProducer = producers[0]

  if (!allProducts.length || !mainProducer) return null

  return (
    <section className='mx-5'>
      <p className='mb-3 text-[11px] font-black uppercase tracking-[0.16em] text-white/35'>
        Savoir-faire lié
      </p>
      <div className='rounded-3xl border border-white/8 bg-white/[0.045] p-4'>
        <div className='flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
          {allProducts.map((product) => {
            const imageUrl = sanitizeImageUrl(product.image_url)
            const name = product.name_default ?? 'Produit'
            return (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className='block w-[72px] shrink-0 transition-transform active:scale-[0.97]'
              >
                <div className='aspect-square w-full overflow-hidden rounded-2xl border border-white/8 bg-white/5'>
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={name}
                      className='h-full w-full object-cover'
                      loading='lazy'
                    />
                  ) : (
                    <div className='flex h-full items-center justify-center'>
                      <Package className='h-5 w-5 text-white/25' aria-hidden='true' />
                    </div>
                  )}
                </div>
                <p className='mt-2 line-clamp-2 text-[11px] font-semibold leading-tight text-white/65'>
                  {name}
                </p>
              </Link>
            )
          })}
        </div>

        <p className='mt-4 text-xs leading-relaxed text-white/40'>
          Proposés par {mainProducer.producerName}, partenaire associé au projet. Ces produits
          prolongent la découverte du savoir-faire local, sans constituer une preuve d&apos;impact
          sur l&apos;espèce.
        </p>

        <Link
          href={`/producers/${mainProducer.producerSlug}`}
          className='mt-3 flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] py-2.5 text-sm font-semibold text-white/60 active:bg-white/[0.07]'
        >
          Voir le savoir-faire de {mainProducer.producerName}
        </Link>
      </div>
    </section>
  )
}
