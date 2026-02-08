'use client'

import { Badge, DataList, Input, SimpleSelect } from '@make-the-change/core/ui'
import { Package } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { type FC, useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react'
import { AdminPageLayout } from '@/app/[locale]/admin/(dashboard)/components/admin-layout'
import { AdminPageHeader } from '@/app/[locale]/admin/(dashboard)/components/admin-layout/header'
import { AdminPagination } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-pagination'
import { usePathname, useRouter } from '@/i18n/navigation'
import { PAGE_SIZE } from './constants'

type CategoryRow = { id: string; name: string; parent_id: string | null }

type ProductRow = {
  id: string
  name_default: string | null
  slug: string
  category_id: string
  price_points: number
  stock_quantity: number | null
  is_active: boolean | null
  short_description_default?: string | null
}

type PartnerProductsClientProps = {
  initialProducts: {
    items: ProductRow[]
    total: number
  }
  initialCategories: { data: CategoryRow[] }
}

export const PartnerProductsClient: FC<PartnerProductsClientProps> = ({
  initialProducts,
  initialCategories,
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const q = searchParams.get('q') || ''
  const category = searchParams.get('category') || undefined
  const page = Number(searchParams.get('page') || '1')

  const [searchValue, setSearchValue] = useState(q)
  const [productsState, setProductsState] = useState<ProductRow[]>(initialProducts.items || [])
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setProductsState(initialProducts.items || [])
  }, [initialProducts.items])

  useEffect(() => {
    setSearchValue(q)
  }, [q])

  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
    }
  }, [])

  const totalItems = initialProducts.total

  const categoryOptions = useMemo(() => {
    const categories = initialCategories.data || []
    return [
      { value: 'all', label: 'Toutes les catégories' },
      ...categories.map((cat) => ({ value: cat.id, label: cat.name })),
    ]
  }, [initialCategories.data])

  const categoryMap = useMemo(() => {
    return new Map(initialCategories.data.map((cat) => [cat.id, cat.name]))
  }, [initialCategories.data])

  const updateFilters = useCallback(
    (updates: Record<string, string | null | undefined>) => {
      const params = new URLSearchParams(searchParams.toString())

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '') {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      })

      if (!updates.page) {
        params.set('page', '1')
      }

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`)
      })
    },
    [searchParams, router, pathname],
  )

  return (
    <AdminPageLayout>
      <AdminPageHeader>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between w-full">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <Input
              className="max-w-xs"
              placeholder="Rechercher un produit..."
              value={searchValue}
              onChange={(e) => {
                const value = e.target.value
                setSearchValue(value)

                if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
                searchDebounceRef.current = setTimeout(() => {
                  updateFilters({ q: value })
                }, 500)
              }}
            />
            <SimpleSelect
              className="w-[200px]"
              placeholder="Catégorie"
              value={category ?? 'all'}
              options={categoryOptions}
              onValueChange={(value) => updateFilters({ category: value === 'all' ? null : value })}
            />
          </div>
          {isPending && (
            <span aria-live="polite" className="text-xs text-muted-foreground animate-pulse">
              Chargement…
            </span>
          )}
        </div>
      </AdminPageHeader>

      <AdminPageLayout.Content>
        <DataList
          gridCols={3}
          isLoading={isPending}
          items={productsState}
          emptyState={{
            icon: Package,
            title: 'Aucun produit',
            description: 'Aucun produit ne correspond à vos filtres.',
          }}
          renderItem={(product: ProductRow) => (
            <div className="glass-card p-4 border border-white/10 rounded-xl">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-foreground truncate">
                    {product.name_default || product.slug}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {categoryMap.get(product.category_id) || 'Catégorie inconnue'}
                  </p>
                </div>
                <Badge color={product.is_active ? 'green' : 'gray'}>
                  {product.is_active ? 'Actif' : 'Inactif'}
                </Badge>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Prix</span>
                  <span className="font-medium text-foreground">{product.price_points} points</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Stock</span>
                  <span className="font-medium text-foreground">{product.stock_quantity ?? 0}</span>
                </div>
              </div>

              {product.short_description_default && (
                <p className="text-xs text-muted-foreground mt-3 line-clamp-2">
                  {product.short_description_default}
                </p>
              )}
            </div>
          )}
          renderSkeleton={() => (
            <div className="p-4 border rounded-lg bg-card text-card-foreground shadow-sm animate-pulse h-[180px]" />
          )}
        />
      </AdminPageLayout.Content>

      <AdminPagination
        pagination={{
          currentPage: page,
          pageSize: PAGE_SIZE,
          totalItems,
          totalPages: Math.ceil(totalItems / PAGE_SIZE),
        }}
      />
    </AdminPageLayout>
  )
}

export default PartnerProductsClient
