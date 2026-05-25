import { Package } from 'lucide-react'
import { getMockProductById } from '@/app/[locale]/(screens)/products/_features/mock-products'
import type { ProducerProduct } from '@/app/[locale]/(screens)/projects/_types/project'
import { Link } from '@/i18n/navigation'
import { sanitizeImageUrl } from '@/lib/image-url'

interface Props {
  products: ProducerProduct[] | null
}

const formatEuro = (value: number) =>
  new Intl.NumberFormat('fr-BE', { style: 'currency', currency: 'EUR' }).format(value)

export function ProjectProducerProductsSection({ products }: Props) {
  const shopProducts = (products ?? []).flatMap((entry) => {
    const product = getMockProductById(entry.id)
    return product ? [product] : []
  })

  if (shopProducts.length === 0) return null

  return (
    <section className="w-full max-w-full overflow-hidden">
      <h3 className="mb-1 text-xl font-bold text-white">Produits du partenaire</h3>
      <p className="mb-4 text-xs text-white/45">Vendus en euros et expédiés par le partenaire.</p>
      <div className="relative -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 pl-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {shopProducts.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="group flex w-44 shrink-0 snap-center flex-col"
          >
            <div className="aspect-square overflow-hidden rounded-xl border border-white/5 bg-white/5">
              {sanitizeImageUrl(product.image_url) ? (
                <img
                  src={product.image_url}
                  alt={product.name_default}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Package className="h-8 w-8 text-white/30" aria-hidden="true" />
                </div>
              )}
            </div>
            <p className="mt-3 line-clamp-2 text-sm font-bold text-white">{product.name_default}</p>
            <p className="mt-1 text-sm font-black text-white">
              {formatEuro(product.price_eur_equivalent)}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
