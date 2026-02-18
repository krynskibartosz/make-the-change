import type { Product } from '@make-the-change/core/schema'
import { Button } from '@make-the-change/core/ui'
import { ArrowRight } from 'lucide-react'
import { MarketingSection } from '@/components/marketing/marketing-section'
import { ProductCard } from '@/features/commerce/products/product-card'
import { Link } from '@/i18n/navigation'

type HomeFeaturedProductsSectionProps = {
  title: string
  viewAllLabel: string
  products: Product[]
  variant?: 'default' | 'muted'
}

export function HomeFeaturedProductsSection({
  title,
  viewAllLabel,
  products,
  variant = 'default',
}: HomeFeaturedProductsSectionProps) {
  return (
    <MarketingSection
      title={title}
      action={
        <Link href="/products" aria-label={viewAllLabel}>
          <Button
            variant="ghost"
            className="flex items-center font-bold uppercase tracking-widest text-xs"
          >
            {viewAllLabel}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      }
      size="lg"
    >
      <ul className="grid grid-cols-2 gap-6 md:grid-cols-2 lg:grid-cols-4 list-none m-0 p-0">
        {products.map((product) => (
          <li key={product.id}>
            <ProductCard
              product={product}
              className="h-full rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
              priority
            />
          </li>
        ))}
      </ul>
    </MarketingSection>
  )
}
