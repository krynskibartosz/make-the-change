'use client'

import { Package } from 'lucide-react'
import { CurrencyAmount } from '@/components/currency'
import { usePathname, useRouter } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState, useTransition } from 'react'
import { ProductsPagination } from '@/app/[locale]/(screens)/products/_features/products-pagination'
import type { ProductsPaginationData } from '@/app/[locale]/(screens)/products/_features/products-query'
import {
  buildProductsSearchParams,
  DEFAULT_PRODUCTS_QUERY_STATE,
  type ProductsQueryState,
} from '@/app/[locale]/(screens)/products/_features/query-state'
import { ClientCatalogProductCard } from './_components/client-catalog-product-card'

export type Product = {
  id: string
  name_default: string
  short_description_default?: string | null
  description_default?: string | null
  price?: number
  price_points?: number | null
  stock_quantity?: number | null
  featured?: boolean | null
  category_id?: string | null
  producer_id?: string | null
  /** Nom lisible du producteur — enrichi côté serveur */
  producer_name?: string | null
  image_url?: string | null
  images?: string[] | null
  tags?: string[] | null
  created_at: string
}

type ProductsClientProps = {
  products: Product[]
  pagination: ProductsPaginationData
  initialQueryState: ProductsQueryState
}

export function ProductsClient({
  products,
  pagination,
  initialQueryState,
}: ProductsClientProps) {
  const tProducts = useTranslations('products')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [userImpactCredits, setUserImpactCredits] = useState<number>(0)
  const [isConnected, setIsConnected] = useState<boolean>(false)

  useEffect(() => {
    async function loadUserImpactCredits() {
      try {
        const { getMockViewerSession } = await import('@/lib/mock/mock-session-server')
        const { getCurrentMockImpactCreditsBalance } = await import('@/lib/mock/mock-member-data-server')
        const session = await getMockViewerSession()
        if (session) {
          const balance = await getCurrentMockImpactCreditsBalance(session.viewerId, session.faction)
          setUserImpactCredits(balance)
          setIsConnected(true)
        }
      } catch (error) {
        setIsConnected(false)
      }
    }

    loadUserImpactCredits()
  }, [])

  const updateQuery = useCallback(
    (patch: Partial<ProductsQueryState>, options?: { resetPage?: boolean }) => {
      const resetPage = options?.resetPage ?? true
      const nextState: ProductsQueryState = {
        ...DEFAULT_PRODUCTS_QUERY_STATE,
        ...initialQueryState,
        ...patch,
      }

      if (resetPage && patch.page === undefined) {
        nextState.page = 1
      }

      const params = buildProductsSearchParams(nextState)
      const nextQuery = params.toString()
      const currentQuery = searchParams.toString()

      if (nextQuery === currentQuery) {
        return
      }

      startTransition(() => {
        router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname)
      })
    },
    [initialQueryState, pathname, router, searchParams],
  )

  return (
    <>
      {/* ── TITRE & DESCRIPTION (scroll avec le contenu) ─────────────────────── */}
      <header className="px-6 pt-8 pb-4 flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-4xl font-black text-white tracking-tighter leading-tight">{tProducts('title')}</h1>
          <p className="text-white/60 text-[15px] mt-3 font-medium">{tProducts('subtitle')}</p>
          <p className="text-white/35 text-[11px] mt-1.5 font-medium uppercase tracking-wider">
            Les prix sont affichés en Credits Impact
          </p>
        </div>
        {isConnected && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/60 border border-white/10 mt-2 shrink-0">
            <CurrencyAmount
              kind="impactCredits"
              value={userImpactCredits}
              className="text-sm font-black tracking-tight"
            />
          </div>
        )}
      </header>

      {/* Products Area */}
      <div className="w-full max-w-[1920px] mx-auto px-4 pt-10 pb-24">
        {products.length === 0 ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 text-center">
            <Package className="mb-4 h-12 w-12 text-muted-foreground/50" aria-hidden="true" />
            <h3 className="text-lg font-bold text-foreground">{tProducts('empty_state.title')}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{tProducts('empty_state.description')}</p>
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-4 m-0 p-0 list-none">
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
              itemsCount: (count) => `${count.toLocaleString()} ${tProducts('product_list')}`,
            }}
          />
        </div>
      </div>
    </>
  )
}

export default ProductsClient
