import { MarketingSection } from '@/app/[locale]/(marketing)/_features/marketing-section'
import {
  ProductCard,
  type ProductCardProduct,
} from '@/app/[locale]/(marketing)/products/_features/product-card'
import { HomeSectionViewAllAction } from './home-section-view-all-action'

type HomeFeaturedProductsSectionProps = {
  title: string
  viewAllLabel: string
  products: ProductCardProduct[]
}

export const HomeFeaturedProductsSection = ({
  title,
  viewAllLabel,
  products,
}: HomeFeaturedProductsSectionProps) => (
  <MarketingSection
    title={title}
    variant="default"
    action={<HomeSectionViewAllAction href="/products" label={viewAllLabel} />}
    size="lg"
  >
    <ul className="m-0 grid list-none grid-cols-2 gap-6 p-0 md:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard
            product={product}
            className="h-full overflow-hidden rounded-3xl shadow-lg transition-all hover:shadow-2xl"
            priority
          />
        </li>
      ))}
    </ul>
  </MarketingSection>
)
