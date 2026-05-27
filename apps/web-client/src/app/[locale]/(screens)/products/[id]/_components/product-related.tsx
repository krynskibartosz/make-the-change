import { ClientCatalogProductCard } from '../../_components/client-catalog-product-card'
import type { ProductWithRelations } from '../product-detail-data'

type Props = {
  products: ProductWithRelations[]
  producerName: string
}

export function ProductRelated({ products, producerName }: Props) {
  if (products.length === 0) return null

  return (
    <div className="pt-8">
      <h2 className="px-4 text-base font-black text-white">
        D&apos;autres produits de {producerName}
      </h2>
      <ul className="mt-4 flex list-none gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {products.map((product) => (
          <li key={product.id} className="w-36 shrink-0">
            <ClientCatalogProductCard
              product={{
                id: product.id,
                slug: product.slug,
                name_default: product.name_default,
                price: product.price_eur_equivalent,
                stock_quantity: product.stock_quantity,
                image_url: product.image_url,
                images: product.images,
                producer_name: product.producer.name_default,
                isTemporaryVisual: product.isTemporaryVisual,
              }}
              outOfStockLabel="Épuisé"
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
