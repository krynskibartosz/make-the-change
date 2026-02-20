'use client'

import { ProductCard } from '@make-the-change/core/ui/next'
import { buildProductCardBadges } from '@/app/[locale]/(marketing)/products/_features/product-card-badges'
import { sanitizeImageUrl } from '@/lib/image-url'

type ClientCatalogProduct = {
  id: string
  name_default: string
  short_description_default?: string | null
  description_default?: string | null
  price?: number
  price_points?: number | null
  stock_quantity?: number | null
  featured?: boolean | null
  image_url?: string | null
  images?: string[] | null
}

type ClientCatalogProductCardProps = {
  product: ClientCatalogProduct
  featuredLabel: string
  outOfStockLabel: string
  lowStockLabel: string
  pointsLabel: string
  viewLabel: string
}

export const ClientCatalogProductCard = ({
  product,
  featuredLabel,
  outOfStockLabel,
  lowStockLabel,
  pointsLabel,
  viewLabel,
}: ClientCatalogProductCardProps) => {
  const imageUrl =
    sanitizeImageUrl(product.image_url) ||
    (Array.isArray(product.images) && product.images.length > 0
      ? sanitizeImageUrl(product.images[0])
      : undefined)

  const badges = buildProductCardBadges({
    featured: product.featured,
    stockQuantity: product.stock_quantity,
    labels: {
      featuredLabel,
      outOfStockLabel,
      lowStockLabel,
    },
  })

  return (
    <div itemScope itemType="https://schema.org/Product">
      <ProductCard
        context="clientCatalog"
        model={{
          id: product.id,
          href: `/products/${product.id}`,
          title: product.name_default,
          description: product.short_description_default || product.description_default || '',
          image: {
            src: imageUrl || '',
            alt: product.name_default,
          },
          pricePoints: product.price_points || 0,
          priceEuro: product.price || 0,
          stockQuantity: product.stock_quantity,
          featured: !!product.featured,
          badges,
        }}
        labels={{
          pointsLabel,
          viewLabel,
        }}
      />
      <meta itemProp="name" content={product.name_default} />
      <meta
        itemProp="description"
        content={product.short_description_default || product.description_default || ''}
      />
      <meta itemProp="image" content={imageUrl || ''} />
      <div itemProp="offers" itemScope itemType="https://schema.org/Offer">
        <meta itemProp="price" content={`${product.price || 0}`} />
        <meta itemProp="priceCurrency" content="EUR" />
        <meta
          itemProp="availability"
          content={
            product.stock_quantity && product.stock_quantity > 0
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock'
          }
        />
      </div>
    </div>
  )
}
