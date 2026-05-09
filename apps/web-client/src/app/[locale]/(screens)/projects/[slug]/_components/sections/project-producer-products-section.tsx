// Producer products carousel component
import { Package } from 'lucide-react'
import type { ProducerProduct } from '@/app/[locale]/(screens)/projects/_types/project'
import { Link } from '@/i18n/navigation'
import { sanitizeImageUrl } from '@/lib/image-url'
import { CurrencyAmount } from '@/components/currency'

interface ProjectProducerProductsSectionProps {
  products: ProducerProduct[] | null
}

export function ProjectProducerProductsSection({ products }: ProjectProducerProductsSectionProps) {
  if (!products || products.length === 0) return null

  return (
    <section className="w-full max-w-full overflow-hidden">
      <div className="mb-4 flex items-baseline justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Produits du partenaire</h3>
          <p className="mt-0.5 text-xs text-white/45">Accessibles avec vos Crédits Impact</p>
        </div>
        <span className="shrink-0 text-sm text-white/20">→</span>
      </div>

      <div className="relative -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 pl-4 sm:-mx-5 sm:pl-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        <div className="w-1 shrink-0" />
      </div>
    </section>
  )
}

function ProductCard({ product }: { product: ProducerProduct }) {
  const imageUrl = sanitizeImageUrl(product.image_url)

  return (
    <Link
      href={`/products/${product.id}`}
      prefetch={false}
      className="group flex w-44 shrink-0 snap-center flex-col overflow-hidden transition-transform active:scale-[0.97]"
    >
      <div className="aspect-square w-full overflow-hidden rounded-[1.5rem] border border-white/5 bg-white/5">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Package className="h-8 w-8 text-white/30" />
          </div>
        )}
      </div>
      <div className="mt-3 flex flex-col gap-0.5">
        <p className="line-clamp-1 text-sm font-bold text-white">{product.name}</p>
        {product.price_points != null ? (
          <CurrencyAmount
            kind="impactCredits"
            value={product.price_points}
            className="text-sm font-black"
          />
        ) : null}
      </div>
    </Link>
  )
}
