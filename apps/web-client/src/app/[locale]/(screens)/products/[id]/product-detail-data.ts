import { unstable_cache } from 'next/cache'
import {
  getMockProductByIdentifier,
  type MockProductSeed,
  type ProductVariant,
} from '@/app/[locale]/(screens)/products/_features/mock-products'

export type { ProductVariant }

export type ProductWithRelations = MockProductSeed

async function _getPublicProductById(idOrSlug: string): Promise<ProductWithRelations | null> {
  return getMockProductByIdentifier(idOrSlug)
}

export const getPublicProductById = unstable_cache(
  _getPublicProductById,
  ['v1-mock-product-detail'],
  {
    revalidate: 3600,
    tags: ['products-list'],
  },
)
