'use client'
import {
  ArrowUpDown,
  Building2,
  Circle,
  DollarSign,
  Folder,
  Hash,
  Package,
  Plus,
  SortAsc,
  SortDesc,
  Star,
  Tag,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import {
  type FC,
  type ReactNode,
  useCallback,
  useDeferredValue,
  useMemo,
  useOptimistic,
  useState,
  useTransition,
} from 'react'

import {
  AdminPageLayout,
  FilterModal,
  Filters,
} from '@/app/[locale]/admin/(dashboard)/components/admin-layout'
import { FilterButton } from '@/app/[locale]/admin/(dashboard)/components/admin-layout/filter-modal'
import { AdminPageHeader } from '@/app/[locale]/admin/(dashboard)/components/admin-layout/header'
import { AdminPagination } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-pagination'
import { CheckboxWithLabel } from '@/app/[locale]/admin/(dashboard)/components/ui/checkbox'
import { DataList } from '@make-the-change/core/ui'
import { EmptyState } from '@make-the-change/core/ui'
import {
  Select,type ViewMode,
  ViewToggle,
} from '@/app/[locale]/admin/(dashboard)/components/ui/view-toggle'
import { Product } from '@/app/[locale]/admin/(dashboard)/products/components/product'
import {
  ProductCardSkeleton,
  ProductListSkeleton,
} from '@/app/[locale]/admin/(dashboard)/products/components/product-card-skeleton'
import { LocalizedLink } from '@/components/localized-link'
import { Button } from '@/components/ui/button'
import {
  CustomSelect,
  type SelectOption as CustomSelectOption,
} from '@/components/ui/custom-select'
import type { RouterOutputs } from '@/lib/trpc'
import { trpc } from '@/lib/trpc'

const pageSize = 18

type Categories = RouterOutputs['admin']['categories']['list']

type SortOption =
  | 'created_at_desc'
  | 'created_at_asc'
  | 'name_asc'
  | 'name_desc'
  | 'price_asc'
  | 'price_desc'
  | 'featured_first'

/**
 * Crée les options riches pour le filtre de producteurs
 */
const createProducerOptions = (
  producers: { id: string; name: string }[] | undefined,
  t: (key: string) => string,
): CustomSelectOption[] => {
  const baseOptions: CustomSelectOption[] = [
    {
      value: 'all',
      title: t('admin.products.filters.all_partners'),
      subtitle: 'Voir tous les produits',
      icon: <Circle className="h-4 w-4 text-muted-foreground" />,
    },
  ]

  if (!producers) return baseOptions

  return [
    ...baseOptions,
    ...producers.map((producer) => ({
      value: producer.id,
      title: producer.name,
      subtitle: 'Partenaire producteur',
      icon: <Building2 className="h-4 w-4 text-primary" />,
    })),
  ]
}

/**
 * Crée les options riches pour le filtre de catégories avec hiérarchie
 */
const createCategoryOptions = (
  categories: Categories | undefined,
  t: (key: string) => string,
): CustomSelectOption[] => {
  const baseOptions: CustomSelectOption[] = [
    {
      value: 'all',
      title: t('admin.products.filters.all_categories'),
      subtitle: 'Toutes les catégories',
      icon: <Circle className="h-4 w-4 text-muted-foreground" />,
    },
  ]

  if (!categories) return baseOptions

  const rootCategories = categories.filter((cat) => !cat.parent_id)
  const subCategories = categories.filter((cat) => cat.parent_id)

  const options: CustomSelectOption[] = [...baseOptions]

  for (const root of rootCategories) {
    options.push({
      value: root.id,
      title: root.name,
      subtitle: 'Catégorie principale',
      icon: <Folder className="h-4 w-4 text-accent" />,
    })

    const children = subCategories.filter((sub) => sub.parent_id === root.id)
    for (const child of children) {
      options.push({
        value: child.id,
        title: `└── ${child.name}`,
        subtitle: 'Sous-catégorie',
        icon: <Tag className="h-4 w-4 text-primary" />,
      })
    }
  }

  const orphanCategories = subCategories.filter(
    (sub) =>
      !rootCategories.some((root) => root.id === sub.parent_id) &&
      !subCategories.some((other) => other.id === sub.parent_id),
  )
  for (const orphan of orphanCategories) {
    options.push({
      value: orphan.id,
      title: `⚠️ ${orphan.name}`,
      subtitle: 'Catégorie orpheline',
      icon: <Circle className="h-4 w-4 text-destructive" />,
    })
  }

  return options
}

/**
 * Crée les options riches pour le filtre de tri
 */
const createSortOptions = (t: (key: string) => string): CustomSelectOption[] => [
  {
    value: 'created_at_desc',
    title: t('admin.products.sort.newest'),
    subtitle: 'Plus récents en premier',
    icon: <TrendingDown className="h-4 w-4 text-primary" />,
  },
  {
    value: 'created_at_asc',
    title: t('admin.products.sort.oldest'),
    subtitle: 'Plus anciens en premier',
    icon: <TrendingUp className="h-4 w-4 text-primary" />,
  },
  {
    value: 'name_asc',
    title: t('admin.products.sort.name_asc'),
    subtitle: 'Ordre alphabétique A-Z',
    icon: <SortAsc className="h-4 w-4 text-primary" />,
  },
  {
    value: 'name_desc',
    title: t('admin.products.sort.name_desc'),
    subtitle: 'Ordre alphabétique Z-A',
    icon: <SortDesc className="h-4 w-4 text-primary" />,
  },
  {
    value: 'price_asc',
    title: t('admin.products.sort.price_asc'),
    subtitle: 'Du moins cher au plus cher',
    icon: <DollarSign className="h-4 w-4 text-success" />,
  },
  {
    value: 'price_desc',
    title: t('admin.products.sort.price_desc'),
    subtitle: 'Du plus cher au moins cher',
    icon: <DollarSign className="h-4 w-4 text-destructive" />,
  },
  {
    value: 'featured_first',
    title: t('admin.products.sort.featured'),
    subtitle: 'Produits mis en avant',
    icon: <Star className="h-4 w-4 text-accent" />,
  },
]

/**
 * Crée les options riches pour le filtre de tags
 */
const createTagOptions = (tags: string[] | undefined): CustomSelectOption[] => {
  if (!tags || tags.length === 0) return []

  return tags.map((tag) => ({
    value: tag,
    title: tag,
    subtitle: 'Ajouter ce tag au filtre',
    icon: <Hash className="h-4 w-4 text-primary" />,
  }))
}

const getSortSelectionItems = (t: (key: string) => string) =>
  createSortOptions(t).map((option) => ({
    id: option.value,
    name: option.title,
  }))

const ProductsPage: FC = () => {
  const t = useTranslations()

  const [search, setSearch] = useState('')
  const [activeOnly, setActiveOnly] = useState(false)
  const [selectedProducerId, setSelectedProducerId] = useState<string | undefined>()
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>()
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<SortOption>('created_at_desc')
  const [cursor, setCursor] = useState<string | undefined>()
  const [view, setView] = useState<ViewMode>('grid')
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)

  const [isPendingFilters, startFilterTransition] = useTransition()
  const deferredSearch = useDeferredValue(search)
  const [optimisticTags, removeOptimisticTag] = useOptimistic(
    selectedTags,
    (currentTags, tagToRemove: string) => currentTags.filter((tag) => tag !== tagToRemove),
  )

  const queryParams = useMemo(
    () => ({
      cursor,
      search: deferredSearch || undefined,
      activeOnly: activeOnly || undefined,
      producerId: selectedProducerId === 'all' ? undefined : selectedProducerId,
      categoryId: selectedCategoryId === 'all' ? undefined : selectedCategoryId,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      sortBy: sortBy || undefined,
      limit: pageSize,
    }),
    [
      cursor,
      deferredSearch,
      activeOnly,
      selectedProducerId,
      selectedCategoryId,
      selectedTags,
      sortBy,
    ],
  )

  const { data: producers, isPending: isPendingProducers } =
    trpc.admin.products.producers.useQuery()
  const { data: categories, isPending: isPendingCategories } = trpc.admin.categories.list.useQuery({
    activeOnly: true,
  })
  const { data: tagsData, isPending: isPendingTags } = trpc.admin.products.tags.useQuery({
    activeOnly: true,
    withStats: true,
  })
  const {
    data: productsData,
    isPending: isPendingProducts,
    isFetching,
    isError,
    error,
    refetch,
  } = trpc.admin.products.list.useQuery(queryParams, {
    refetchOnMount: 'always', // Force refetch when returning to this page
    refetchOnWindowFocus: true, // Refetch when user returns to tab
  })

  const products = useMemo(() => productsData?.items || [], [productsData?.items])
  const totalProducts = productsData?.total || 0
  const totalPages = Math.ceil(totalProducts / pageSize)

  const isFilterActive = useMemo(
    () =>
      !!(
        deferredSearch ||
        activeOnly ||
        (selectedProducerId && selectedProducerId !== 'all') ||
        (selectedCategoryId && selectedCategoryId !== 'all') ||
        (selectedTags && selectedTags.length > 0) ||
        (sortBy && sortBy !== 'created_at_desc')
      ),
    [deferredSearch, activeOnly, selectedProducerId, selectedCategoryId, selectedTags, sortBy],
  )

  const producerOptions = useMemo(
    (): CustomSelectOption[] => createProducerOptions(producers, t),
    [producers, t],
  )

  const categoryOptions = useMemo(
    (): CustomSelectOption[] => createCategoryOptions(categories, t),
    [categories, t],
  )

  const tagOptions = useMemo(
    (): CustomSelectOption[] => createTagOptions(tagsData?.tags),
    [tagsData],
  )

  const sortOptions = useMemo((): CustomSelectOption[] => createSortOptions(t), [t])
  const sortSelectionItems = useMemo(() => getSortSelectionItems(t), [t])

  const hasActiveFilters = useMemo(
    () =>
      Boolean(
        search.trim() ||
          activeOnly ||
          selectedProducerId ||
          selectedCategoryId ||
          selectedTags.length > 0 ||
          sortBy !== 'created_at_desc',
      ),
    [search, activeOnly, selectedProducerId, selectedCategoryId, selectedTags, sortBy],
  )

  const handleFilterChange = useCallback(
    (filterFn: () => void) => {
      startFilterTransition(filterFn)
    },
    [startFilterTransition],
  )

  const resetFilters = useCallback(() => {
    startFilterTransition(() => {
      setSearch('')
      setActiveOnly(false)
      setSelectedProducerId(undefined)
      setSelectedCategoryId(undefined)
      setSelectedTags([])
      setSortBy('created_at_desc')
      setCursor(undefined)
    })
    refetch()
  }, [refetch, startFilterTransition])

  const handleRemoveTag = useCallback(
    (tagToRemove: string) => {
      removeOptimisticTag(tagToRemove)
      handleFilterChange(() => {
        setSelectedTags((prev) => prev.filter((tag) => tag !== tagToRemove))
      })
    },
    [removeOptimisticTag, handleFilterChange],
  )

  return (
    <AdminPageLayout>
      <AdminPageHeader>
        <div className="space-y-3 md:hidden">
          <div className="flex items-center gap-2">
            <AdminPageHeader.Search
              isLoading={isPendingProducts || isFetching}
              placeholder={t('admin.products.search_placeholder')}
              value={search}
              onChange={setSearch}
            />
            <FilterButton isActive={isFilterActive} onClick={() => setIsFilterModalOpen(true)} />
          </div>
          <LocalizedLink className="w-full" href="/admin/products/new">
            <Button className="w-full" size="sm" variant="accent">
              {t('admin.products.new_product')}
            </Button>
          </LocalizedLink>
        </div>

        <div className="hidden space-y-4 md:block">
          <div className="flex items-center gap-4">
            <div className="max-w-md flex-1">
              <AdminPageHeader.Search
                isLoading={isPendingProducts || isFetching}
                placeholder={t('admin.products.search_placeholder')}
                value={search}
                onChange={setSearch}
              />
            </div>
            <div className="flex items-center gap-3">
              <LocalizedLink className="w-full" href="/admin/products/new">
                <Button className="w-full" icon={<Plus />} size="sm">
                  {t('admin.products.new_product')}
                </Button>
              </LocalizedLink>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-1 flex-wrap items-center gap-3">
              <CustomSelect
                name="producer_filter"
                contextIcon={<Building2 className="h-5 w-5" />}
                className="w-56"
                disabled={isPendingProducers || !producers || isPendingFilters}
                options={producerOptions}
                placeholder={t('admin.products.filters.all_partners')}
                value={selectedProducerId || 'all'}
                onChange={(value) =>
                  handleFilterChange(() =>
                    setSelectedProducerId(value === 'all' ? undefined : value),
                  )
                }
              />

              <CustomSelect
                name="category_filter"
                contextIcon={<Folder className="h-5 w-5" />}
                className="w-64"
                options={categoryOptions}
                placeholder={t('admin.products.filters.all_categories')}
                value={selectedCategoryId || 'all'}
                disabled={isPendingCategories || !categories || isPendingFilters}
                onChange={(value) =>
                  handleFilterChange(() =>
                    setSelectedCategoryId(value === 'all' ? undefined : value),
                  )
                }
              />

              <CustomSelect
                name="sort_filter"
                contextIcon={<ArrowUpDown className="h-5 w-5" />}
                className="w-52"
                disabled={isPendingFilters}
                options={sortOptions}
                placeholder={t('admin.products.filters.sort_by')}
                value={sortBy}
                onChange={(value) => handleFilterChange(() => setSortBy(value as SortOption))}
              />

              <CustomSelect
                name="tag_filter"
                contextIcon={<Hash className="h-5 w-5" />}
                className="w-48"
                disabled={isPendingTags || !tagsData || isPendingFilters}
                options={tagOptions}
                placeholder={t('admin.products.filters.tags_placeholder')}
                value=""
                onChange={(value) => {
                  if (value && !selectedTags.includes(value)) {
                    handleFilterChange(() => setSelectedTags([...selectedTags, value]))
                  }
                }}
              />

              <CheckboxWithLabel
                checked={activeOnly}
                disabled={isPendingFilters}
                label={t('admin.products.filters.active_only')}
                onCheckedChange={(v) => handleFilterChange(() => setActiveOnly(Boolean(v)))}
              />

              <ViewToggle value={view} onChange={setView} />

              {hasActiveFilters && (
                <Button
                  className="text-muted-foreground hover:text-foreground h-auto border-dashed px-3 py-2 text-xs"
                  size="sm"
                  variant="outline"
                  onClick={resetFilters}
                >
                  {t('admin.products.filters.clear_filters')}
                </Button>
              )}

              {optimisticTags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {optimisticTags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 focus:ring-2 focus:ring-primary/20 focus:outline-none inline-flex cursor-pointer items-center gap-1 rounded-md border px-2 py-1 text-xs"
                      role="button"
                      tabIndex={0}
                      onClick={() => handleRemoveTag(tag)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          handleRemoveTag(tag)
                        }
                      }}
                    >
                      {tag}
                      <span className="text-primary/60 hover:text-primary">×</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </AdminPageHeader>

      <AdminPageLayout.Content>
        {isError ? (
          <EmptyState
            icon={Package}
            title={t('admin.products.error.loading_title')}
            variant="muted"
            action={
              <Button size="sm" variant="outline" onClick={() => refetch()}>
                {t('admin.products.error.retry')}
              </Button>
            }
            description={error?.message || t('admin.products.error.loading_description')}
          />
        ) : (
          <DataList
            isLoading={isPendingProducts}
            items={products}
            variant={view === 'map' ? 'grid' : view}
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
            renderItem={(product) => (
              <Product
                key={product.id}
                product={product}
                queryParams={queryParams}
                view={view === 'map' ? 'grid' : view}
                onFilterChange={{
                  setCategory: (categoryId: string) =>
                    handleFilterChange(() => setSelectedCategoryId(categoryId)),
                  setProducer: (producerId: string) =>
                    handleFilterChange(() => setSelectedProducerId(producerId)),
                  addTag: (tag: string) => {
                    if (!selectedTags.includes(tag)) {
                      handleFilterChange(() => setSelectedTags([...selectedTags, tag]))
                    }
                  },
                }}
              />
            )}
            renderSkeleton={() =>
              view === 'grid' ? <ProductCardSkeleton /> : <ProductListSkeleton />
            }
          />
        )}

        {totalProducts > pageSize && (
          <div className="mt-6">
            <AdminPagination
              pagination={{
                currentPage: Math.max(
                  1,
                  Math.floor((totalProducts - products.length) / pageSize) + 1,
                ),
                pageSize,
                totalItems: totalProducts,
                totalPages,
              }}
            />
          </div>
        )}
      </AdminPageLayout.Content>
      <FilterModal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)}>
        <Filters>
          <Filters.View view={view} onViewChange={setView} />

          <Filters.Selection
            allLabel=""
            items={sortSelectionItems}
            label={t('admin.products.filters.sort_by')}
            selectedId={sortBy}
            onSelectionChange={(id) =>
              handleFilterChange(() => setSortBy((id || 'created_at_desc') as SortOption))
            }
          />

          <Filters.Selection
            allLabel={t('admin.products.filters.all_partners')}
            items={producers || []}
            label={t('admin.products.filter_modal.partner')}
            selectedId={selectedProducerId}
            onSelectionChange={(id) => handleFilterChange(() => setSelectedProducerId(id))}
          />

          <Filters.Selection
            allLabel={t('admin.products.filters.all_categories')}
            items={categories?.filter((cat) => !cat.parent_id) || []}
            label={t('admin.products.filter_modal.category')}
            selectedId={selectedCategoryId}
            onSelectionChange={(id) => handleFilterChange(() => setSelectedCategoryId(id))}
          />

          <Filters.Selection
            allLabel=""
            items={tagsData?.tags?.map((tag) => ({ id: tag, name: tag })) || []}
            label={t('admin.products.filter_modal.tags')}
            selectedId=""
            onSelectionChange={(tagId) => {
              if (tagId && !selectedTags.includes(tagId)) {
                handleFilterChange(() => setSelectedTags([...selectedTags, tagId]))
              }
            }}
          />

          <Filters.Toggle
            checked={activeOnly}
            label={t('admin.products.filter_modal.active_only_description')}
            onCheckedChange={(v) => handleFilterChange(() => setActiveOnly(v))}
          />

          {hasActiveFilters && (
            <div className="border-border/30 border-t pt-4">
              <Button
                className="text-muted-foreground hover:text-foreground w-full border-dashed"
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
      </FilterModal>
    </AdminPageLayout>
  )
}

export default ProductsPage
