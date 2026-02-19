import { Button } from '@make-the-change/core/ui'
import { ArrowRight } from 'lucide-react'
import { MarketingSection } from '@/app/[locale]/(marketing)/_features/marketing-section'
import {
  ProductCard,
  type ProductCardProduct,
} from '@/app/[locale]/(marketing)/products/_features/product-card'
import { Link } from '@/i18n/navigation'

type HomeFeaturedProductsSectionProps = {
  title: string
  viewAllLabel: string
  products: ProductCardProduct[]
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
      variant={variant}
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
