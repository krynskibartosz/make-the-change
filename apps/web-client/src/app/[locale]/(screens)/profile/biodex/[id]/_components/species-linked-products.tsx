'use client'
import { Leaf } from 'lucide-react'
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
    <section className='mt-2'>
      <div className='px-5'>
        <p className='text-[11px] font-black uppercase tracking-[0.16em] text-white/35'>
          Savoir-faire lié
        </p>
        <p className='mt-1 text-[12px] leading-relaxed text-white/40'>
          Proposé par {mainProducer.producerName}. Ces produits prolongent la découverte du
          savoir-faire local, sans constituer une preuve d&apos;impact sur l&apos;espèce.
        </p>
      </div>

      <ul
        className='mt-3 flex snap-x gap-3 overflow-x-auto px-5 scroll-pl-5 pb-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden m-0 list-none'
        aria-label='Produits du partenaire'
      >
        {allProducts.map((product) => {
          const imageUrl = sanitizeImageUrl(product.image_url)
          const name = product.name_default ?? 'Produit'
          return (
            <li key={product.id} className='w-36 shrink-0 snap-start'>
              <Link
                href={product.slug ? `/products/${product.slug}` : `/products/${product.id}`}
                className='group flex flex-col gap-2'
              >
                <div className='relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-white/5'>
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={name}
                      className='h-full w-full object-cover transition-transform duration-500 group-active:scale-105'
                      loading='lazy'
                    />
                  ) : (
                    <div className='flex h-full items-center justify-center'>
                      <Leaf className='h-6 w-6 text-white/20' aria-hidden='true' />
                    </div>
                  )}
                </div>
                <p className='line-clamp-2 text-[13px] font-semibold leading-snug text-white/75'>
                  {name}
                </p>
              </Link>
            </li>
          )
        })}
      </ul>

      <div className='px-5'>
        <Link
          href={`/producers/${mainProducer.producerSlug}`}
          className='mt-1 flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] py-2.5 text-sm font-semibold text-white/55 active:bg-white/[0.07]'
        >
          Voir le savoir-faire de {mainProducer.producerName}
        </Link>
      </div>
    </section>
  )
}
