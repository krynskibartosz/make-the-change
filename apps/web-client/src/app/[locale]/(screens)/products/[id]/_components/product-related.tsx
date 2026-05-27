import { Package } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { sanitizeImageUrl } from '@/lib/image-url'
import type { ProductWithRelations } from '../product-detail-data'

const formatEuro = (value: number) =>
  new Intl.NumberFormat('fr-BE', { style: 'currency', currency: 'EUR' }).format(value)

type Props = {
  products: ProductWithRelations[]
  producerName: string
}

export function ProductRelated({ products, producerName }: Props) {
  if (products.length === 0) return null

  return (
    <div className="pt-8">
      <h2 className="px-4 text-base font-black text-white">
        D&apos;autres produits de {producerName}
      </h2>
      <ul className="mt-4 flex list-none gap-3 overflow-x-auto px-4 pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {products.map((product) => {
          const image = sanitizeImageUrl(product.image_url)
          return (
            <li key={product.id} className="w-40 shrink-0">
              <Link
                href={`/products/${product.slug ?? product.id}`}
                className="block overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.03]"
              >
                <div className="aspect-square overflow-hidden bg-white/5">
                  {image ? (
                    <img
                      src={image}
                      alt={product.name_default}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Package className="h-8 w-8 text-white/20" aria-hidden="true" />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="line-clamp-2 text-[12px] font-semibold leading-snug text-white/80">
                    {product.name_default}
                  </p>
                  <p className="mt-1 text-[13px] font-black text-white">
                    {formatEuro(product.price_eur_equivalent)}
                  </p>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
