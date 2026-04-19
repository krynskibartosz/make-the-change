// Producer products carousel component
import { Package } from 'lucide-react'
import type { ProducerProduct } from '@/types/context'
import { Link } from '@/i18n/navigation'
import { sanitizeImageUrl } from '@/lib/image-url'

interface ProjectProducerProductsSectionProps {
  products: ProducerProduct[] | null
}

export function ProjectProducerProductsSection({ products }: ProjectProducerProductsSectionProps) {
  if (!products || products.length === 0) return null

  return (
    <section className="w-full max-w-full overflow-hidden">
      <h3 className="mb-4 text-xl font-bold text-white">Produits du partenaire</h3>

      <div className="flex w-full max-w-full gap-4 overflow-x-auto overflow-y-hidden pb-4 snap-x snap-mandatory touch-pan-x [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

function ProductCard({ product }: { product: ProducerProduct }) {
  const imageUrl = sanitizeImageUrl(product.image_url)

  return (
    <Link
      href={`/products/${product.id}`}
      className="min-w-[240px] w-[240px] h-[160px] shrink-0 snap-start rounded-2xl overflow-hidden relative group cursor-pointer border border-white/10"
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={product.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-800">
          <Package className="h-8 w-8 text-white/50" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 p-4 w-full">
        <span className="text-[10px] font-bold uppercase tracking-wider text-lime-400 mb-1 block">
          {product.category}
        </span>
        <h4 className="text-sm font-bold text-white leading-tight truncate">{product.name}</h4>
      </div>
    </Link>
  )
}
