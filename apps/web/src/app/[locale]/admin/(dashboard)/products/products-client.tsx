'use client'

import { Button, CheckboxWithLabel, Input, SimpleSelect } from '@make-the-change/core/ui'
import { Package, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useQueryStates } from 'nuqs'
import { type FC, useMemo, useState } from 'react'
import { Filters } from '@/app/[locale]/admin/(dashboard)/components/admin-layout/generic-filters'
import { useDebouncedCallback } from '@/app/[locale]/admin/(dashboard)/components/hooks/use-debounced-callback'
import { AdminPageContainer } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-container'
import { AdminPageHeader } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-header'
import { AdminPagination } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-pagination'
import {
  AdminFilterButton,
  AdminFilterSheet,
} from '@/app/[locale]/admin/(dashboard)/components/ui/admin-filter-sheet'
import {
  type ViewMode,
  ViewToggle,
} from '@/app/[locale]/admin/(dashboard)/components/ui/view-toggle'
import { ProductCard } from '@/app/[locale]/admin/(dashboard)/products/components/product'
import { ProductCardSkeleton, ProductListSkeleton } from '@/app/[locale]/admin/(dashboard)/products/components/product-card-skeleton'
import { LocalizedLink } from '@/components/localized-link'
import { DataList } from '@make-the-change/core/ui'
import type { Product } from '@/lib/types/product'

import { PAGE_SIZE as pageSize } from './constants'
import { productSearchParams } from './products-search-params'

type SelectOption = { value: string; label: string }
type Categories = Array<{ id: string; name: string; parentId: string | null }>

type ProductsClientProps = {
  initialData: {
    items: Product[]
    total: number
    metadata: {
      producers: Array<{ id: string; name: string }>
      categories: Categories
      tags: string[]
    }
  }
}

const createCategoryHierarchy = (
  categories: Categories | undefined,
  t: (key: string) => string,
): SelectOption[] => {
  if (!categories) return [{ value: 'all', label: t('admin.products.filters.all_categories') }]

  const rootCategories = categories.filter((cat) => !cat.parentId)
  const subCategories = categories.filter((cat) => cat.parentId)

  const options: SelectOption[] = [
    { value: 'all', label: t('admin.products.filters.all_categories') },
  ]

  for (const root of rootCategories) {
    options.push({ value: root.id, label: root.name })
    const children = subCategories.filter((sub) => sub.parentId === root.id)
    for (const child of children) {
      options.push({ value: child.id, label: `  └── ${child.name}` })
    }
  }

  return options
}

const createSelectOptions = <T extends { id: string; name: string }>(
  items: T[] | undefined,
  allLabel: string,
): SelectOption[] => [
  { value: 'all', label: allLabel },
  ...(items?.map((item) => ({ value: item.id, label: item.name })) || []),
]

const getSortOptions = (t: (key: string) => string): SelectOption[] => [
  { value: 'created_at_desc', label: t('admin.products.sort.newest') },
  { value: 'created_at_asc', label: t('admin.products.sort.oldest') },
  { value: 'name_asc', label: t('admin.products.sort.name_asc') },
  { value: 'name_desc', label: t('admin.products.sort.name_desc') },
  { value: 'price_asc', label: t('admin.products.sort.price_asc') },
  { value: 'price_desc', label: t('admin.products.sort.price_desc') },
  { value: 'featured_first', label: t('admin.products.sort.featured') },
]

export const ProductsClient: FC<ProductsClientProps> = ({ initialData }) => {
  const t = useTranslations()

  // URL State Management with Nuqs
  const [filters, setFilters] = useQueryStates(productSearchParams, {
    shallow: false, // Trigger server component refresh
    throttleMs: 400,
  })

  // Local UI state
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)

  // Destructure filters for easier access
  const {
    q: search,
    active_only: activeOnly,
    producer: selectedProducerId,
    category: selectedCategoryId,
    sort: sortBy,
    page,
    tags: selectedTags,
    view,
  } = filters

  const products = initialData.items
  const totalProducts = initialData.total
  const totalPages = Math.max(1, Math.ceil(totalProducts / pageSize))

  const producers = initialData.metadata.producers
  const categories = initialData.metadata.categories
  const tagsData = initialData.metadata.tags

  // Update helper that resets page to 1
  const updateFilters = (updates: Partial<typeof filters>) => {
    void setFilters({ ...updates, page: 1 })
  }

  const debouncedSearch = useDebouncedCallback((value: string) => {
    updateFilters({ q: value })
  }, 400)

  // Derived UI state
  const isFilterActive = useMemo(
    () =>
      !!(
        search ||
        activeOnly ||
        (selectedProducerId && selectedProducerId !== 'all') ||
        (selectedCategoryId && selectedCategoryId !== 'all') ||
        sortBy !== 'created_at_desc' ||
        selectedTags.length > 0
      ),
    [search, activeOnly, selectedProducerId, selectedCategoryId, sortBy, selectedTags],
  )

  const producerOptions = useMemo(
    (): SelectOption[] =>
      producers
        ? createSelectOptions(producers, t('admin.products.filters.all_partners'))
        : [{ value: 'all', label: t('admin.products.filters.all_partners') }],
    [producers, t],
  )

  const categoryOptions = useMemo(
    (): SelectOption[] =>
      categories
        ? createCategoryHierarchy(categories, t)
        : [{ value: 'all', label: t('admin.products.filters.all_categories') }],
    [categories, t],
  )

  const tagOptions = useMemo((): SelectOption[] => {
    if (!tagsData) return []
    const tags = Array.isArray(tagsData) ? tagsData : []
    return tags.map((tag: string) => ({ value: tag, label: tag }))
  }, [tagsData])

  const sortOptions = useMemo(() => getSortOptions(t), [t])
  const sortSelectionItems = useMemo(
    () => sortOptions.map((option) => ({ id: option.value, name: option.label })),
    [sortOptions],
  )

  const resetFilters = () => {
    void setFilters(null) // Resets all to defaults
  }

  return (
    <AdminPageContainer>
      <AdminPageHeader>
        <div className="flex items-center gap-2">
          <LocalizedLink href="/admin/products/new">
            <Button icon={<Plus />} size="sm">
              {t('admin.products.new_product')}
            </Button>
          </LocalizedLink>
          <ViewToggle value={view as ViewMode} onChange={(v) => setFilters({ view: v })} />
        </div>
      </AdminPageHeader>

      <div className="space-y-3 md:hidden">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Input
              aria-label={t('admin.products.search_placeholder')}
              placeholder={t('admin.products.search_placeholder')}
              defaultValue={search}
              onChange={(e) => debouncedSearch(e.target.value)}
            />
          </div>
          <AdminFilterButton isActive={isFilterActive} onClick={() => setIsFilterModalOpen(true)} />
        </div>
      </div>

      <div className="hidden md:block space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 max-w-md">
            <Input
              aria-label={t('admin.products.search_placeholder')}
              placeholder={t('admin.products.search_placeholder')}
              defaultValue={search}
              onChange={(e) => debouncedSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <SimpleSelect
            className="w-48"
            disabled={!producers}
            options={producerOptions}
            placeholder={t('admin.products.filters.all_partners')}
            value={selectedProducerId || 'all'}
            onValueChange={(value) => updateFilters({ producer: value === 'all' ? 'all' : value })}
          />

          <SimpleSelect
            className="w-52"
            disabled={!categories}
            options={categoryOptions}
            placeholder={t('admin.products.filters.all_categories')}
            value={selectedCategoryId || 'all'}
            onValueChange={(value) => updateFilters({ category: value === 'all' ? 'all' : value })}
          />

          <SimpleSelect
            className="w-44"
            options={sortOptions}
            placeholder={t('admin.products.filters.sort_by')}
            value={sortBy}
            onValueChange={(value) => updateFilters({ sort: value as typeof sortBy })}
          />

          <SimpleSelect
            className="w-40"
            disabled={!tagsData}
            options={tagOptions}
            placeholder={t('admin.products.filters.tags_placeholder')}
            value=""
            onValueChange={(value) => {
              if (value && !selectedTags.includes(value)) {
                const newTags = [...selectedTags, value]
                updateFilters({ tags: newTags })
              }
            }}
          />

          <CheckboxWithLabel
            checked={activeOnly}
            label={t('admin.products.filters.active_only')}
            onCheckedChange={(v) => updateFilters({ active_only: !!v })}
          />

          {isFilterActive && (
            <Button
              className="text-xs px-3 py-2 h-auto text-muted-foreground hover:text-foreground border-dashed"
              size="sm"
              variant="outline"
              onClick={resetFilters}
            >
              {t('admin.products.filters.clear_filters')}
            </Button>
          )}
        </div>
      </div>

      <DataList
        isLoading={false} // Nuqs handles loading state differently, and initialData is SSR'd
        items={products}
        variant={view === 'map' ? 'grid' : (view as 'grid' | 'list')}
        getItemKey={(product) => product.id ?? ''}
        emptyState={{
          icon: Package,
          title: t('admin.products.empty_state.title'),
          description: t('admin.products.empty_state.description'),
          action: (
            <Button size="sm" variant="outline" onClick={resetFilters}>
              {t('admin.products.filters.reset')}
            </Button>
          ),
        }}
        renderItem={(product: Product) => (
          <ProductCard
            key={product.id}
            product={product}
            view={view === 'map' ? 'grid' : (view as 'list' | 'grid')}
            onFilterChange={{
              setCategory: (categoryId: string) => updateFilters({ category: categoryId }),
              setProducer: (producerId: string) => updateFilters({ producer: producerId }),
              addTag: (tag: string) => {
                if (!selectedTags.includes(tag)) {
                  const newTags = [...selectedTags, tag]
                  updateFilters({ tags: newTags })
                }
              },
            }}
          />
        )}
        renderSkeleton={() => (view === 'grid' ? <ProductCardSkeleton /> : <ProductListSkeleton />)}
      />

      {totalPages > 1 && (
        <div className="mt-6">
          <AdminPagination
            pagination={{
              currentPage: page,
              pageSize,
              totalItems: totalProducts,
              totalPages,
            }}
            onPageChange={(p) => setFilters({ page: p })}
          />
        </div>
      )}
      <AdminFilterSheet open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
        <Filters>
          <Filters.View view={view as ViewMode} onViewChange={(v) => setFilters({ view: v })} />

          <Filters.Selection
            allLabel=""
            items={sortSelectionItems}
            label={t('admin.products.filters.sort_by')}
            selectedId={sortBy}
            onSelectionChange={(id) => updateFilters({ sort: id as typeof sortBy })}
          />

          <Filters.Selection
            allLabel={t('admin.products.filters.all_partners')}
            items={producers || []}
            label={t('admin.products.filter_modal.partner')}
            selectedId={selectedProducerId}
            onSelectionChange={(id) => updateFilters({ producer: id })}
          />

          <Filters.Selection
            allLabel={t('admin.products.filters.all_categories')}
            items={categories?.filter((cat) => !cat.parentId) || []}
            label={t('admin.products.filter_modal.category')}
            selectedId={selectedCategoryId}
            onSelectionChange={(id) => updateFilters({ category: id })}
          />

          <Filters.Toggle
            checked={activeOnly}
            label={t('admin.products.filter_modal.active_only_description')}
            onCheckedChange={(v) => updateFilters({ active_only: !!v })}
          />

          {isFilterActive && (
            <div className="pt-4 border-t border-border/30">
              <Button
                className="w-full text-muted-foreground hover:text-foreground border-dashed"
                size="sm"
                variant="outline"
                onClick={() => {
                  resetFilters()
                  setIsFilterModalOpen(false)
                }}
              >
                {t('admin.products.filters.clear_all_filters')}
              </Button>
            </div>
          )}
        </Filters>
      </AdminFilterSheet>
    </AdminPageContainer>
  )
}

export default ProductsClient
