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
  Combobox,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
  ComboboxPortal,
  ComboboxPositioner,
  ComboboxTrigger,
  DataList,
  Input,
  ScrollArea,
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
} from '@/app/[locale]/(marketing)/products/_features/products-active-filters'
import { ProductsPagination } from '@/app/[locale]/(marketing)/products/_features/products-pagination'
import type { ProductsPaginationData } from '@/app/[locale]/(marketing)/products/_features/products-query'
import {
  buildProductsSearchParams,
  DEFAULT_PRODUCT_SORT,
  DEFAULT_PRODUCTS_QUERY_STATE,
  isProductSort,
  type ProductSort,
  type ProductsQueryState,
} from '@/app/[locale]/(marketing)/products/_features/query-state'
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

// Add PageHero props to ProductsClient
interface PageHeroProps {
  title: string
  description: string
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
  <div className="p-4 md:p-5">
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
          <ScrollArea className="max-h-96 pr-1">
            <div className="space-y-2">
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
          </ScrollArea>
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
          <ScrollArea className="max-h-96 pr-1">
            <div className="space-y-2">
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
          </ScrollArea>
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
          <ScrollArea className="max-h-96 pr-1">
            <div className="space-y-2">
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
          </ScrollArea>
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
  const activeTagValue = initialQueryState.tag || '__all__'

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
    <>
      {/* Page Hero Section */}
      <div className="py-8 md:pb-12 md:pt-24">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {tProducts('title')}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {tProducts('subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Fixed Search and Filters Bar */}
      <div className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <search role="search" className="relative w-full lg:w-[320px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <Input
                  type="search"
                  className="h-10 bg-background pl-9"
                  placeholder={tProducts('search_placeholder')}
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  aria-label={tProducts('search_placeholder')}
                />
              </search>

              <Combobox
                value={activeTagValue}
                onValueChange={(value) => {
                  if (typeof value === 'string') {
                    updateQuery({ tag: value === '__all__' ? '' : value })
                  }
                }}
              >
                <div className="relative w-full lg:w-[220px]">
                  <ComboboxInput
                    className="h-10 w-full rounded-md border border-input bg-background pl-3 pr-9 text-sm"
                    placeholder={tProducts('filters.tag_label')}
                  />
                  <ComboboxTrigger className="absolute right-1 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted">
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </ComboboxTrigger>
                </div>
                <ComboboxPortal>
                  <ComboboxPositioner>
                    <ComboboxPopup className="z-[60] mt-1 w-[220px] rounded-md border border-border bg-popover p-1 shadow-md">
                      <ComboboxList>
                        <ComboboxItem
                          value="__all__"
                          className="cursor-pointer rounded-sm px-2 py-1.5 text-sm hover:bg-muted"
                        >
                          {tProducts('filters.all_tags')}
                        </ComboboxItem>
                        {tagOptions
                          .filter((option) => option.value)
                          .map((option) => (
                            <ComboboxItem
                              key={option.value}
                              value={option.value}
                              className="cursor-pointer rounded-sm px-2 py-1.5 text-sm hover:bg-muted"
                            >
                              {option.label}
                            </ComboboxItem>
                          ))}
                      </ComboboxList>
                    </ComboboxPopup>
                  </ComboboxPositioner>
                </ComboboxPortal>
              </Combobox>
            </div>

            <div className="flex items-center gap-4">
              <Select
                value={sort}
                onValueChange={(value) => updateQuery({ sort: value as ProductSort })}
              >
                <SelectTrigger className="h-10 w-full lg:w-[220px] bg-background">
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

              <div className="hidden lg:flex">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                  className="h-10"
                >
                  {tProducts('filters.clear_filters')}
                </Button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="mt-4">
              <ProductsActiveFilters
                title={tProducts('filters.active_filters')}
                chips={activeFilterChips}
                clearAllLabel={tProducts('filters.clear_all')}
                onClearAll={clearAllFilters}
              />
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-4 pb-24 sm:px-6 lg:px-0 lg:pb-16">
        <div className="grid gap-y-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-x-0 lg:items-start">
          {/* Sidebar - Fixed on Left */}
          <aside className="hidden lg:sticky lg:top-24 lg:block lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
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

          {/* Product Grid Area */}
          <div className="min-w-0 space-y-4 px-4 sm:px-6 lg:px-8">
            {/* Mobile Filter Bar */}
            <div className="sticky top-0 z-20 -mx-4 -mx-6 lg:-mx-8 border-y border-border/70 bg-background/95 px-4 py-3 backdrop-blur sm:px-6 lg:px-8 lg:hidden">
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

            {/* Product Count */}
            <div className="space-y-1">
              <p className="text-xs font-black uppercase tracking-wide text-muted-foreground">
                {tProducts('product_list')}
              </p>
              <p className="text-lg font-black tracking-tight text-foreground">
                {pagination.totalItems.toLocaleString()} {tProducts('product_list')}
              </p>
            </div>

            {/* Product Grid */}
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

            {/* Pagination */}
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
      </div>
    </>
  )
}

export default ProductsClient
