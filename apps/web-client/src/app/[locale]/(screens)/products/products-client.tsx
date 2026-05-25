'use client'

import { Package, ShoppingBag } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useCallback, useTransition } from 'react'
import { ProductsPagination } from '@/app/[locale]/(screens)/products/_features/products-pagination'
import type { ProductsPaginationData } from '@/app/[locale]/(screens)/products/_features/products-query'
import {
  buildProductsSearchParams,
  DEFAULT_PRODUCTS_QUERY_STATE,
  type ProductsQueryState,
} from '@/app/[locale]/(screens)/products/_features/query-state'
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { ClientCatalogProductCard } from './_components/client-catalog-product-card'

export type Product = {
  id: string
  slug: string
  name_default: string
  short_description_default?: string | null
  price: number
  stock_quantity?: number | null
  featured?: boolean | null
  category_id?: string | null
  producer_name?: string | null
  image_url?: string | null
  images?: string[] | null
  isTemporaryVisual?: boolean
  created_at: string
}

type Props = {
  products: Product[]
  pagination: ProductsPaginationData
  initialQueryState: ProductsQueryState
  cartCount: number
}

const CATEGORIES = [
  { id: '', label: 'Tous' },
  { id: 'coffrets', label: 'Coffrets' },
  { id: 'miels', label: 'Miels' },
  { id: 'soins', label: 'Soins' },
]

export function ProductsClient({ products, pagination, initialQueryState, cartCount }: Props) {
  const tProducts = useTranslations('products')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const updateQuery = useCallback(
    (patch: Partial<ProductsQueryState>, options?: { resetPage?: boolean }) => {
      const nextState = { ...DEFAULT_PRODUCTS_QUERY_STATE, ...initialQueryState, ...patch }
      if ((options?.resetPage ?? true) && patch.page === undefined) nextState.page = 1
      const query = buildProductsSearchParams(nextState).toString()
      if (query === searchParams.toString()) return
      startTransition(() => router.push(query ? `${pathname}?${query}` : pathname))
    },
    [initialQueryState, pathname, router, searchParams],
  )

  return (
    <>
      <header className="flex items-start justify-between gap-4 px-4 pb-5 pt-7">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-black uppercase text-lime-300/70">Boutique partenaire</p>
          <h1 className="mt-1 text-[30px] font-black leading-tight text-white">
            Boutique partenaire
          </h1>
          <p className="mt-2 text-[14px] font-medium leading-relaxed text-white/55">
            Produits vendus et expédiés par nos partenaires, payés en euros.
          </p>
        </div>
        <Link
          href="/products/cart"
          aria-label="Voir le panier"
          className="relative mt-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white"
        >
          <ShoppingBag className="h-5 w-5" aria-hidden="true" />
          {cartCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-lime-300 px-1 text-[10px] font-black text-[#0B0F15]">
              {cartCount}
            </span>
          )}
        </Link>
      </header>

      <nav className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-5" aria-label="Catégories">
        {CATEGORIES.map((category) => (
          <button
            key={category.id || 'all'}
            type="button"
            onClick={() => updateQuery({ category: category.id })}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold ${
              initialQueryState.category === category.id
                ? 'border-lime-300 bg-lime-300 text-[#0B0F15]'
                : 'border-white/10 bg-white/[0.03] text-white/60'
            }`}
          >
            {category.label}
          </button>
        ))}
      </nav>

      <div className="w-full px-4 pb-24">
        {products.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
            <Package className="mb-4 h-11 w-11 text-white/25" aria-hidden="true" />
            <h3 className="text-lg font-bold text-white">{tProducts('empty_state.title')}</h3>
          </div>
        ) : (
          <ul className="m-0 grid list-none grid-cols-2 gap-4 p-0">
            {products.map((product) => (
              <li key={product.id}>
                <ClientCatalogProductCard
                  product={product}
                  outOfStockLabel={tProducts('card.sold_out')}
                />
              </li>
            ))}
          </ul>
        )}
        <div className="mt-8">
          <ProductsPagination
            pagination={pagination}
            isPending={isPending}
            onPageChange={(page) => updateQuery({ page }, { resetPage: false })}
            labels={{
              previous: tProducts('pagination.previous'),
              next: tProducts('pagination.next'),
              page: tProducts('pagination.page'),
              of: tProducts('pagination.of'),
              itemsCount: (count) => `${count} produits`,
            }}
          />
        </div>
      </div>
    </>
  )
}
