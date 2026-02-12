'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  BottomSheet,
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetTrigger,
  Button,
  Checkbox,
  DataList,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@make-the-change/core/ui'
import { ProductCardSkeleton } from '@make-the-change/core/ui/next'
import { ArrowUpDown, Filter, Package, Search } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { type FC, useCallback, useEffect, useMemo, useState, useTransition } from 'react'
import {
  type ActiveFilterChip,
  ProductsActiveFilters,
} from '@/features/commerce/products/products-active-filters'
import { ProductsPagination } from '@/features/commerce/products/products-pagination'
import type { ProductsPaginationData } from '@/features/commerce/products/products-query'
import {
  buildProductsSearchParams,
  DEFAULT_PRODUCT_SORT,
  DEFAULT_PRODUCTS_QUERY_STATE,
  isProductSort,
  type ProductSort,
  type ProductsQueryState,
} from '@/features/commerce/products/query-state'
import { ClientCatalogProductCard } from './components/client-catalog-product-card'

export interface Product {
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
  image_url?: string | null
  tags?: string[] | null
  created_at: string
}

export interface Category {
  id: string
  name_default: string
}

export interface Producer {
  id: string
  name_default: string
}

interface ProductsClientProps {
  products: Product[]
  categories: Category[]
  producers: Producer[]
  availableTags: string[]
  pagination: ProductsPaginationData
  initialQueryState: ProductsQueryState
}

type SelectOption = { value: string; label: string }

const createSelectOptions = <T extends { id: string; name_default: string }>(
  items: T[] | undefined,
  allLabel: string,
): SelectOption[] => [
  { value: '', label: allLabel },
  ...(items?.map((item) => ({ value: item.id, label: item.name_default })) || []),
]

const getSortOptions = (tProducts: (key: string) => string): SelectOption[] => [
  { value: 'featured_first', label: tProducts('sort.featured') },
  { value: 'name_asc', label: tProducts('sort.name_asc') },
  { value: 'name_desc', label: tProducts('sort.name_desc') },
  { value: 'price_asc', label: tProducts('sort.price_asc') },
  { value: 'price_desc', label: tProducts('sort.price_desc') },
]

type ProductsFiltersSidebarProps = {
  title: string
  clearLabel: string
  categoryLabel: string
  producerLabel: string
  tagLabel: string
  allCategoriesLabel: string
  allProducersLabel: string
  allTagsLabel: string
  showClear: boolean
  onReset: () => void
  categoryOptions: SelectOption[]
  producerOptions: SelectOption[]
  tagOptions: SelectOption[]
  category: string
  producer: string
  tag: string
  onCategoryChange: (value: string) => void
  onProducerChange: (value: string) => void
  onTagChange: (value: string) => void
}

const ProductsFiltersSidebar: FC<ProductsFiltersSidebarProps> = ({
  title,
  clearLabel,
  categoryLabel,
  producerLabel,
  tagLabel,
  allCategoriesLabel,
  allProducersLabel,
  allTagsLabel,
  showClear,
  onReset,
  categoryOptions,
  producerOptions,
  tagOptions,
  category,
  producer,
  tag,
  onCategoryChange,
  onProducerChange,
  onTagChange,
}) => (
  <div className="rounded-3xl border border-border bg-card p-4 shadow-sm md:p-5">
    <div className="mb-4 flex items-center justify-between gap-3">
      <h3 className="text-lg font-black tracking-tight">{title}</h3>
      {showClear && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-auto px-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          {clearLabel}
        </Button>
      )}
    </div>

    <Accordion
      type="multiple"
      defaultValue={['categories', 'producers', 'tags']}
      className="w-full"
    >
      <AccordionItem value="categories">
        <AccordionTrigger className="text-sm font-bold">{categoryLabel}</AccordionTrigger>
        <AccordionContent>
          <button
            type="button"
            onClick={() => onCategoryChange('')}
            className="mb-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            {allCategoriesLabel}
          </button>
          <div className="max-h-52 space-y-2 overflow-auto pr-1">
            {categoryOptions
              .filter((option) => option.value)
              .map((option) => (
                <div key={option.value} className="flex items-center space-x-3">
                  <Checkbox
                    id={`cat-${option.value}`}
                    checked={category === option.value}
                    onCheckedChange={(checked) => onCategoryChange(checked ? option.value : '')}
                  />
                  <label
                    htmlFor={`cat-${option.value}`}
                    className="cursor-pointer text-sm font-medium leading-none text-muted-foreground hover:text-foreground"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="producers">
        <AccordionTrigger className="text-sm font-bold">{producerLabel}</AccordionTrigger>
        <AccordionContent>
          <button
            type="button"
            onClick={() => onProducerChange('')}
            className="mb-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            {allProducersLabel}
          </button>
          <div className="max-h-52 space-y-2 overflow-auto pr-1">
            {producerOptions
              .filter((option) => option.value)
              .map((option) => (
                <div key={option.value} className="flex items-center space-x-3">
                  <Checkbox
                    id={`prod-${option.value}`}
                    checked={producer === option.value}
                    onCheckedChange={(checked) => onProducerChange(checked ? option.value : '')}
                  />
                  <label
                    htmlFor={`prod-${option.value}`}
                    className="cursor-pointer text-sm font-medium leading-none text-muted-foreground hover:text-foreground"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="tags">
        <AccordionTrigger className="text-sm font-bold">{tagLabel}</AccordionTrigger>
        <AccordionContent>
          <button
            type="button"
            onClick={() => onTagChange('')}
            className="mb-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            {allTagsLabel}
          </button>
          <div className="max-h-52 space-y-2 overflow-auto pr-1">
            {tagOptions
              .filter((option) => option.value)
              .map((option) => (
                <div key={option.value} className="flex items-center space-x-3">
                  <Checkbox
                    id={`tag-${option.value}`}
                    checked={tag === option.value}
                    onCheckedChange={(checked) => onTagChange(checked ? option.value : '')}
                  />
                  <label
                    htmlFor={`tag-${option.value}`}
                    className="cursor-pointer text-sm font-medium leading-none text-muted-foreground hover:text-foreground"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
)

export const ProductsClient: FC<ProductsClientProps> = ({
  products,
  categories,
  producers,
  availableTags,
  pagination,
  initialQueryState,
}) => {
  const tProducts = useTranslations('products')
  const tCommon = useTranslations('common')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [searchInput, setSearchInput] = useState(initialQueryState.search)

  useEffect(() => {
    setSearchInput(initialQueryState.search)
  }, [initialQueryState.search])

  const sortOptions = useMemo(() => getSortOptions(tProducts), [tProducts])

  const categoryOptions = useMemo(
    () => createSelectOptions(categories, tProducts('filters.all_categories')),
    [categories, tProducts],
  )

  const producerOptions = useMemo(
    () => createSelectOptions(producers, tProducts('filters.all_producers')),
    [producers, tProducts],
  )

  const tagOptions = useMemo(() => {
    return [
      { value: '', label: tProducts('filters.all_tags') },
      ...[...availableTags]
        .sort((a, b) => a.localeCompare(b))
        .map((tag) => ({ value: tag, label: tag })),
    ]
  }, [availableTags, tProducts])

  const categoryLabelById = useMemo(
    () => new Map(categories.map((category) => [category.id, category.name_default])),
    [categories],
  )

  const producerLabelById = useMemo(
    () => new Map(producers.map((producer) => [producer.id, producer.name_default])),
    [producers],
  )

  const sort = isProductSort(initialQueryState.sort) ? initialQueryState.sort : DEFAULT_PRODUCT_SORT

  const sortLabel =
    sortOptions.find((option) => option.value === sort)?.label || tProducts('filters.sort_by')

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

  useEffect(() => {
    const normalizedInput = searchInput.trim()
    if (normalizedInput === initialQueryState.search) {
      return
    }

    const timer = window.setTimeout(() => {
      updateQuery({ search: normalizedInput }, { resetPage: true })
    }, 350)

    return () => window.clearTimeout(timer)
  }, [searchInput, initialQueryState.search, updateQuery])

  const clearAllFilters = useCallback(() => {
    setSearchInput('')
    updateQuery(DEFAULT_PRODUCTS_QUERY_STATE, { resetPage: false })
  }, [updateQuery])

  const activeFilterChips = useMemo<ActiveFilterChip[]>(() => {
    const chips: ActiveFilterChip[] = []

    if (initialQueryState.search) {
      chips.push({
        key: 'search',
        label: `${tProducts('filters.search_label')}: ${initialQueryState.search}`,
        onRemove: () => {
          setSearchInput('')
          updateQuery({ search: '' })
        },
      })
    }

    if (initialQueryState.category) {
      const label = categoryLabelById.get(initialQueryState.category)
      if (label) {
        chips.push({
          key: 'category',
          label: `${tProducts('filters.category_label')}: ${label}`,
          onRemove: () => updateQuery({ category: '' }),
        })
      }
    }

    if (initialQueryState.producer) {
      const label = producerLabelById.get(initialQueryState.producer)
      if (label) {
        chips.push({
          key: 'producer',
          label: `${tProducts('filters.producer_label')}: ${label}`,
          onRemove: () => updateQuery({ producer: '' }),
        })
      }
    }

    if (initialQueryState.tag) {
      chips.push({
        key: 'tag',
        label: `${tProducts('filters.tag_label')}: ${initialQueryState.tag}`,
        onRemove: () => updateQuery({ tag: '' }),
      })
    }

    if (sort !== DEFAULT_PRODUCT_SORT) {
      chips.push({
        key: 'sort',
        label: `${tProducts('filters.sort_label')}: ${sortLabel}`,
        onRemove: () => updateQuery({ sort: DEFAULT_PRODUCT_SORT }),
      })
    }

    return chips
  }, [
    categoryLabelById,
    initialQueryState.category,
    initialQueryState.producer,
    initialQueryState.search,
    initialQueryState.tag,
    producerLabelById,
    sort,
    sortLabel,
    tProducts,
    updateQuery,
  ])

  const hasActiveFilters = activeFilterChips.length > 0

  return (
    <div className="grid gap-6 pb-24 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start lg:pb-16">
      <aside className="hidden lg:block">
        <ProductsFiltersSidebar
          title={tCommon('filter')}
          clearLabel={tProducts('filters.clear_filters')}
          categoryLabel={tProducts('filters.category_label')}
          producerLabel={tProducts('filters.producer_label')}
          tagLabel={tProducts('filters.tag_label')}
          allCategoriesLabel={tProducts('filters.all_categories')}
          allProducersLabel={tProducts('filters.all_producers')}
          allTagsLabel={tProducts('filters.all_tags')}
          showClear={hasActiveFilters}
          onReset={clearAllFilters}
          categoryOptions={categoryOptions}
          producerOptions={producerOptions}
          tagOptions={tagOptions}
          category={initialQueryState.category}
          producer={initialQueryState.producer}
          tag={initialQueryState.tag}
          onCategoryChange={(value) => updateQuery({ category: value })}
          onProducerChange={(value) => updateQuery({ producer: value })}
          onTagChange={(value) => updateQuery({ tag: value })}
        />
      </aside>

      <div className="min-w-0 space-y-4">
        <div className="sticky top-0 z-20 -mx-4 border-y border-border/70 bg-background/95 px-4 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center gap-2">
            <BottomSheet>
              <BottomSheetTrigger>
                <div className="inline-flex">
                  <Button type="button" variant="outline" className="h-10 gap-2">
                    <Filter className="h-4 w-4" />
                    {tCommon('filter')}
                    {hasActiveFilters && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                        {activeFilterChips.length}
                      </span>
                    )}
                  </Button>
                </div>
              </BottomSheetTrigger>
              <BottomSheetContent showHandle>
                <BottomSheetHeader className="px-0 pb-3">
                  <BottomSheetTitle>{tCommon('filter')}</BottomSheetTitle>
                </BottomSheetHeader>
                <BottomSheetBody className="px-0 pb-4">
                  <ProductsFiltersSidebar
                    title={tCommon('filter')}
                    clearLabel={tProducts('filters.clear_filters')}
                    categoryLabel={tProducts('filters.category_label')}
                    producerLabel={tProducts('filters.producer_label')}
                    tagLabel={tProducts('filters.tag_label')}
                    allCategoriesLabel={tProducts('filters.all_categories')}
                    allProducersLabel={tProducts('filters.all_producers')}
                    allTagsLabel={tProducts('filters.all_tags')}
                    showClear={hasActiveFilters}
                    onReset={clearAllFilters}
                    categoryOptions={categoryOptions}
                    producerOptions={producerOptions}
                    tagOptions={tagOptions}
                    category={initialQueryState.category}
                    producer={initialQueryState.producer}
                    tag={initialQueryState.tag}
                    onCategoryChange={(value) => updateQuery({ category: value })}
                    onProducerChange={(value) => updateQuery({ producer: value })}
                    onTagChange={(value) => updateQuery({ tag: value })}
                  />
                </BottomSheetBody>
              </BottomSheetContent>
            </BottomSheet>

            <Select
              value={sort}
              onValueChange={(value) => updateQuery({ sort: value as ProductSort })}
            >
              <SelectTrigger className="h-10 min-w-0 flex-1 bg-background">
                <div className="flex min-w-0 items-center gap-2">
                  <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate text-sm font-semibold">{sortLabel}</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <header className="space-y-4 rounded-3xl border border-border bg-card p-4 shadow-sm md:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-xs font-black uppercase tracking-wide text-muted-foreground">
                {tProducts('product_list')}
              </p>
              <p className="text-lg font-black tracking-tight text-foreground">
                {pagination.totalItems.toLocaleString()} {tProducts('product_list')}
              </p>
            </div>

            <div className="hidden items-center gap-3 lg:flex">
              <div className="relative w-[320px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="h-10 bg-background pl-9"
                  placeholder={tProducts('search_placeholder')}
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                />
              </div>

              <Select
                value={sort}
                onValueChange={(value) => updateQuery({ sort: value as ProductSort })}
              >
                <SelectTrigger className="h-10 w-[220px] bg-background">
                  <div className="flex min-w-0 items-center gap-2">
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate text-sm font-semibold">{sortLabel}</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="relative lg:hidden">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="h-10 bg-background pl-9"
              placeholder={tProducts('search_placeholder')}
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
            />
          </div>

          <ProductsActiveFilters
            title={tProducts('filters.active_filters')}
            chips={activeFilterChips}
            clearAllLabel={tProducts('filters.clear_all')}
            onClearAll={clearAllFilters}
          />
        </header>

        <DataList
          isLoading={isPending}
          items={products}
          getItemKey={(product) => product.id}
          gridCols={4 as const}
          emptyState={{
            icon: Package,
            title: tProducts('empty_state.title'),
            description: tProducts('empty_state.description'),
            action: hasActiveFilters ? (
              <Button size="sm" variant="outline" onClick={clearAllFilters}>
                {tProducts('filters.clear_filters')}
              </Button>
            ) : undefined,
          }}
          renderItem={(product: Product) => (
            <ClientCatalogProductCard
              product={product}
              featuredLabel={tProducts('featured')}
              outOfStockLabel={tProducts('card.sold_out')}
              lowStockLabel={tProducts('card.low_stock')}
              pointsLabel={tProducts('card.points')}
              viewLabel={tProducts('card.view_action')}
            />
          )}
          renderSkeleton={() => <ProductCardSkeleton context="clientCatalog" />}
        />

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
  )
}

export default ProductsClient
