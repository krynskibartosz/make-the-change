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
import {
  ArrowUpDown,
  Bug,
  Filter,
  LayoutGrid,
  List as ListIcon,
  Package,
  Search,
  Sparkles,
  TreePine,
  Waves,
} from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useMemo, useState, useTransition } from 'react'
import {
  type ActiveFilterChip,
  ProductsActiveFilters,
} from '@/app/[locale]/(marketing)/products/_features/products-active-filters'
import { ProductsPagination } from '@/app/[locale]/(marketing)/products/_features/products-pagination'
import type { ProductsPaginationData } from '@/app/[locale]/(marketing)/products/_features/products-query'
import {
  buildProductsSearchParams,
  DEFAULT_PRODUCT_VIEW,
  DEFAULT_PRODUCT_SORT,
  DEFAULT_PRODUCTS_QUERY_STATE,
  isProductView,
  isProductSort,
  type ProductsQueryState,
} from '@/app/[locale]/(marketing)/products/_features/query-state'
import { Link } from '@/i18n/navigation'
import { sanitizeImageUrl } from '@/lib/image-url'
import { MarketHeader } from './components/market-header'
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
  images?: string[] | null
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
  title?: string
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

const ProductsFiltersSidebar = ({
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
}: ProductsFiltersSidebarProps) => (
  <div className="pb-4 md:pb-5">
    <div className="mb-4 flex items-center justify-between gap-3">
      {title && <h3 className="text-lg font-black tracking-tight">{title}</h3>}

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
        <AccordionTrigger className="text-sm font-bold transition-colors cursor-pointer hover:no-underline hover:text-primary hover:cursor-pointer">
          {categoryLabel}
        </AccordionTrigger>
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
        <AccordionTrigger className="text-sm font-bold transition-colors cursor-pointer hover:no-underline hover:text-primary hover:cursor-pointer">
          {producerLabel}
        </AccordionTrigger>
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
        <AccordionTrigger className="text-sm font-bold transition-colors cursor-pointer hover:no-underline hover:text-primary hover:cursor-pointer">
          {tagLabel}
        </AccordionTrigger>
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

export const ProductsClient = ({
  products,
  categories,
  producers,
  availableTags,
  pagination,
  initialQueryState,
}: ProductsClientProps) => {
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
  const view = isProductView(initialQueryState.view) ? initialQueryState.view : DEFAULT_PRODUCT_VIEW
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
    updateQuery(
      {
        ...DEFAULT_PRODUCTS_QUERY_STATE,
        view,
      },
      { resetPage: false },
    )
  }, [updateQuery, view])

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
  const maxPricePoints = useMemo(
    () => Math.max(...products.map((product) => product.price_points || 0), 1),
    [products],
  )
  const formatPointsCompact = useCallback(
    (value: number | null | undefined) => new Intl.NumberFormat('fr-FR').format(value || 0),
    [],
  )
  const formatEuroCompact = useCallback(
    (value: number | null | undefined) =>
      `${new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(value || 0)} €`,
    [],
  )

  return (
    <>
      {/* ── TITRE & DESCRIPTION (scroll avec le contenu) ─────────────────── */}
      <div className="px-6 pt-8 pb-4">
        <h1 className="text-4xl font-black text-white tracking-tighter leading-tight">{tProducts('title')}</h1>
        <p className="text-white/60 text-[15px] mt-3 font-medium">{tProducts('subtitle')}</p>
      </div>

      {/* Desktop sticky top search bar — hidden on mobile */}
      <div className="hidden md:block sticky top-[4.5rem] z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="w-full max-w-[1920px] mx-auto px-8 lg:px-12 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center w-full lg:w-auto lg:gap-4">
              <search role="search" className="relative w-full lg:w-[320px]">
                <Search
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  type="search"
                  className="h-10 bg-background pl-9 w-full"
                  placeholder={tProducts('search_placeholder')}
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  aria-label={tProducts('search_placeholder')}
                />
              </search>

              <div className="hidden lg:block">
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
            </div>

            <div className="flex items-center gap-2 w-full lg:w-auto lg:gap-4">
              <div className="flex-1 lg:flex-none">
                <Select
                  value={sort}
                  onValueChange={(value) => {
                    if (isProductSort(value)) {
                      updateQuery({ sort: value })
                    }
                  }}
                >
                  <SelectTrigger className="rounded-full bg-white/5 border border-white/10 px-5 py-2.5 text-sm transition-transform active:scale-95 flex items-center gap-2 w-full lg:w-[220px] text-foreground hover:bg-white/10 data-[placeholder]:text-foreground">
                    <div className="flex min-w-0 items-center gap-2 w-full justify-center">
                      <ArrowUpDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="truncate font-medium">{sortLabel}</span>
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

              <div className="hidden lg:flex items-center rounded-full border border-white/10 bg-white/5 p-1">
                <button
                  type="button"
                  onClick={() => updateQuery({ view: 'grid' }, { resetPage: false })}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${view === 'grid'
                    ? 'bg-foreground text-background'
                    : 'text-foreground/80 hover:bg-white/10'
                    }`}
                  aria-pressed={view === 'grid'}
                  aria-label={tProducts('view.grid')}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  <span>{tProducts('view.grid')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateQuery({ view: 'list' }, { resetPage: false })}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${view === 'list'
                    ? 'bg-foreground text-background'
                    : 'text-foreground/80 hover:bg-white/10'
                    }`}
                  aria-pressed={view === 'list'}
                  aria-label={tProducts('view.list')}
                >
                  <ListIcon className="h-3.5 w-3.5" />
                  <span>{tProducts('view.list')}</span>
                </button>
              </div>

              <div className="hidden lg:flex">
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="rounded-full bg-white/5 border border-white/10 px-5 py-2.5 text-sm font-medium transition-transform active:scale-95 flex items-center gap-2 text-foreground hover:bg-white/10 whitespace-nowrap"
                >
                  {tProducts('filters.clear_filters')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── DOCK FLOTTANT (Thumb Zone) — identique à /projects ─────────────── */}
      <div
        className="md:hidden fixed mb-1 left-0 right-0 z-40 flex justify-center pointer-events-none px-4"
        style={{ bottom: 'calc(4.5rem + env(safe-area-inset-bottom) + 0.5rem)' }}
      >
        <div className="bg-background/80  backdrop-blur-lg border border-border/70 p-1 rounded-full flex items-center shadow-[0_8px_30px_rgba(0,0,0,0.4)] pointer-events-auto overflow-x-auto scrollbar-hide max-w-full">

          {/* Bouton Points — remplace le bouton Map de /projects */}
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-white/5 text-lime-400 transition-all active:scale-95 shrink-0 mx-1"
            aria-label="Solde Points d'Impact"
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span className="text-[13px] font-black tabular-nums tracking-tight">2 450</span>
          </button>

          {/* Séparateur vertical */}
          <div className="w-px mr-2 h-5 bg-white/15 shrink-0" />
          <div className='w-full mr-2'>

            {/* Filtre Tous */}
            <button
              type="button"
              onClick={() => updateQuery({ category: '' })}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full transition-all active:scale-95 shrink-0 ${!initialQueryState.category
                ? 'bg-lime-400 text-[#0B0F15] font-bold'
                : 'hover:bg-white/5 text-white/70'
                }`}
            >
              <span className="text-[13px] font-bold">Tous</span>
            </button>

            {/* Filtre par catégorie — les 3 premières catégories */}
            {categories.slice(0, 3).map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => updateQuery({ category: cat.id })}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full transition-all active:scale-95 shrink-0 ${initialQueryState.category === cat.id
                  ? 'bg-lime-400 text-[#0B0F15] font-bold'
                  : 'hover:bg-white/5 text-white/70'
                  }`}
              >
                <span className="text-[13px] font-medium">{cat.name_default}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Area — Fixed structure */}
      <div className="w-full max-w-[1920px] mx-auto px-4 md:px-8 lg:px-12 pt-10 pb-64 md:pb-16 lg:pt-14">
        {/* Active Filters Bar (Desktop/Tablet) */}
        {hasActiveFilters && (
          <div className="mb-6 hidden md:block">
            <ProductsActiveFilters
              title={tProducts('filters.active_filters')}
              chips={activeFilterChips}
              clearAllLabel={tProducts('filters.clear_all')}
              onClearAll={clearAllFilters}
            />
          </div>
        )}

        <div className="grid gap-y-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-12 lg:items-start">
          {/* Desktop Sidebar — Hidden on Mobile */}
          <aside className="hidden lg:sticky lg:top-24 lg:block lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto pr-4">
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

          {/* Products list/grid area */}
          <div className="min-w-0 space-y-4">


            {/* Products list — forcé en vue liste sur mobile */}
            {view === 'list' || true ? (
              products.length === 0 ? (
                <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 text-center">
                  <Package className="mb-4 h-12 w-12 text-muted-foreground/50" />
                  <h3 className="text-lg font-bold text-foreground">{tProducts('empty_state.title')}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{tProducts('empty_state.description')}</p>
                  {hasActiveFilters ? (
                    <Button size="sm" variant="outline" onClick={clearAllFilters} className="mt-5">
                      {tProducts('filters.clear_filters')}
                    </Button>
                  ) : null}
                </div>
              ) : (
                <div className="-mx-4 md:-mx-8 lg:-mx-12">
                  {products.map((product, index) => {
                    const points = product.price_points || 0
                    const pointsBarPercent = Math.min(Math.max((points / maxPricePoints) * 100, 0), 100)
                    const imageUrl =
                      sanitizeImageUrl(product.image_url) ||
                      (Array.isArray(product.images) && product.images.length > 0
                        ? sanitizeImageUrl(product.images[0])
                        : undefined)
                    const description =
                      product.short_description_default ||
                      product.description_default ||
                      ''
                    const isLast = index === products.length - 1

                    return (
                      <Link
                        key={product.id}
                        href={`/products/${product.id}`}
                        className="w-full flex items-center gap-4 px-5 py-4 bg-transparent active:bg-white/5 transition-colors text-left group"
                      >
                        <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-white/5">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={product.name_default}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-white/10" />
                          )}
                        </div>

                        <div
                          className={`flex-1 min-w-0 flex flex-col justify-center ${isLast ? '' : 'border-b border-white/10 pb-4'}`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-base font-bold text-white truncate">
                              {product.name_default}
                            </h3>
                            {product.featured ? (
                              <Sparkles className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                            ) : null}
                          </div>
                          <p className="text-xs text-white/50 truncate mb-3">
                            {description}
                          </p>
                          <div className="flex justify-between items-end mb-1.5">
                            <span className="text-sm font-black text-lime-400 tabular-nums">
                              {formatPointsCompact(points)} {tProducts('card.points')}
                            </span>
                            <span className="text-[10px] font-medium text-white/40 uppercase tabular-nums">
                              / {formatEuroCompact(product.price)} Obj.
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="bg-lime-400 h-full rounded-full"
                              style={{ width: `${pointsBarPercent}%` }}
                            />
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )
            ) : (
              <DataList
                isLoading={isPending}
                variant={view}
                items={products}
                getItemKey={(product) => product.id}
                gridCols={3 as const}
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
                    view={view}
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
            )}

            {/* Pagination */}
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
        </div>
      </div>
    </>
  )
}

export default ProductsClient
