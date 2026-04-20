import { ArrowRight } from 'lucide-react'
import { MarketingSection } from '@/app/[locale]/(marketing)/_features/marketing-section'
import { ProductThumbnailCard } from '@/app/[locale]/(marketing)/_features/product-thumbnail-card'
import type { ProductCardProduct } from '@/app/[locale]/(marketing)/products/_features/product-card'
import { Link } from '@/i18n/navigation'

type HomeFeaturedProductsSectionProps = {
  title: string
  viewAllLabel: string
  pointsLabel: string
  products: ProductCardProduct[]
  variant?: 'default' | 'muted'
}

export const HomeFeaturedProductsSection = ({
  title,
  viewAllLabel,
  pointsLabel,
  products,
}: HomeFeaturedProductsSectionProps) => {
  const visibleProducts = products.filter((product) => (product.stock_quantity || 0) > 0)

  return (
    <MarketingSection title={title} variant="muted" size="lg">
      <ul className="m-0 flex list-none gap-3 overflow-x-auto p-0 px-6 pb-4 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {visibleProducts.map((product, index) => {
          const title = product.name_default || 'Produit'
          const imageUrl = product.images[0] ?? null
          const slug = product.slug || product.id

          return (
            <li key={product.id} className="shrink-0">
              <ProductThumbnailCard
                slug={slug}
                title={title}
                imageUrl={imageUrl}
                pricePoints={product.price_points || 0}
                pointsLabel={pointsLabel}
                isFeatured={!!product.featured}
                priority={index === 0}
              />
            </li>
          )
        })}

        <li className="shrink-0">
          <Link
            href="/products"
            className="w-40 aspect-[4/5] shrink-0 snap-start rounded-2xl overflow-hidden border border-lime-500/30 bg-lime-900/10 flex flex-col items-center justify-center gap-3 p-4 text-center group active:scale-[0.98] transition-transform block"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lime-400/20 text-lime-400 transition-transform group-hover:translate-x-1">
              <ArrowRight size={18} />
            </div>
            <span className="text-xs font-bold text-lime-400 leading-snug">{viewAllLabel}</span>
          </Link>
        </li>
      </ul>
    </MarketingSection>
  )
}

