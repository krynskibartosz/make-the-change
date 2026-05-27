'use client'

import { Package } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { sanitizeImageUrl } from '@/lib/image-url'

type ClientCatalogProduct = {
  id: string
  slug: string
  name_default: string
  price?: number
  stock_quantity?: number | null
  image_url?: string | null
  images?: string[] | null
  producer_name?: string | null
  isTemporaryVisual?: boolean
}

type Props = {
  product: ClientCatalogProduct
  outOfStockLabel: string
}

const formatEuro = (value: number) =>
  new Intl.NumberFormat('fr-BE', { style: 'currency', currency: 'EUR' }).format(value)

export function ClientCatalogProductCard({ product, outOfStockLabel }: Props) {
  const imageUrl =
    sanitizeImageUrl(product.image_url) ??
    (product.images?.length ? sanitizeImageUrl(product.images[0]) : undefined)
  const inStock = (product.stock_quantity ?? 0) > 0
  const price = product.price ?? 0

  return (
    <article itemScope itemType="https://schema.org/Product" className="h-full">
      <meta itemProp="name" content={product.name_default} />
      <div itemProp="offers" itemScope itemType="https://schema.org/Offer">
        <meta itemProp="price" content={price.toFixed(2)} />
        <meta itemProp="priceCurrency" content="EUR" />
      </div>
      <Link
        href={`/products/${product.slug}`}
        className="group flex h-full flex-col gap-2 active:scale-[0.98]"
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-zinc-800">
          {imageUrl ? (
            <img src={imageUrl} alt={product.name_default} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center bg-white/[0.04]">
              <Package className="h-10 w-10 text-white/20" aria-hidden="true" />
            </div>
          )}
          {!inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/55">
              <span className="rounded-full bg-black/60 px-2 py-1 text-[10px] font-bold uppercase text-red-400">
                {outOfStockLabel}
              </span>
            </div>
          )}
        </div>
        <div className="mt-1.5 flex flex-col gap-1">
          <span className="text-[11px] font-bold uppercase text-zinc-400">
            {product.producer_name}
          </span>
          <h3 className="line-clamp-2 text-sm font-semibold text-white">{product.name_default}</h3>
          {inStock && <span className="text-sm font-black text-white">{formatEuro(price)}</span>}
        </div>
      </Link>
    </article>
  )
}
