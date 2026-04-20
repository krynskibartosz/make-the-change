import { ArrowRight } from 'lucide-react'
import { MarketingSection } from '@/app/[locale]/(marketing)/_features/marketing-section'
import { ProductThumbnailCard } from '@/app/[locale]/(marketing)/_features/product-thumbnail-card'
import type { ProductCardProduct } from '@/app/[locale]/(marketing)/products/_features/product-card'
import { Link } from '@/i18n/navigation'

type HomeFeaturedProductsSectionProps = {
  title: string
  viewAllLabel: string
  products: ProductCardProduct[]
  variant?: 'default' | 'muted'
}

export const HomeFeaturedProductsSection = ({
  title,
  viewAllLabel,
  products,
}: HomeFeaturedProductsSectionProps) => {
  const visibleProducts = products.filter((product) => (product.stock_quantity || 0) > 0)

  return (
    <MarketingSection title={title} variant="muted" size="lg">
      <ul className="m-0 flex list-none gap-4 overflow-x-auto p-0 px-6 pb-6 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {visibleProducts.map((product, index) => {
          const productTitle = product.name_default || 'Produit'
          const imageUrl = product.images[0] ?? null
          const slug = product.slug || product.id

          return (
            <li key={product.id} className="shrink-0">
              <ProductThumbnailCard
                slug={slug}
                title={productTitle}
                imageUrl={imageUrl}
                pricePoints={product.price_points || 0}
                isFeatured={!!product.featured}
                priority={index === 0}
              />
            </li>
          )
        })}

        <li className="shrink-0">
          <Link
            href="/products"
            className="w-36 shrink-0 snap-start group flex flex-col gap-2.5 active:scale-[0.98] transition-transform block"
          >
            <div className="w-full aspect-[4/5] rounded-2xl border border-lime-500/30 bg-lime-900/10 flex items-center justify-center">
              <ArrowRight size={20} className="text-lime-400 transition-transform group-hover:translate-x-1" />
            </div>
            <div className="px-1">
              <span className="text-sm font-bold text-lime-400 leading-snug">{viewAllLabel}</span>
            </div>
          </Link>
        </li>
      </ul>
    </MarketingSection>
  )
}

