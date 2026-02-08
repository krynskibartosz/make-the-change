'use client';
import {
  Folder,
  Plus,
  Circle,
  TrendingDown,
  TrendingUp,
  SortAsc,
  SortDesc,
  Tag,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  type FC,
  useCallback,
  useMemo,
  useState,
  useTransition,
  useDeferredValue,
} from 'react';

import {
  AdminPageLayout,
  Filters,
  FilterModal,
} from '@/app/[locale]/admin/(dashboard)/components/admin-layout';
import { FilterButton } from '@/app/[locale]/admin/(dashboard)/components/admin-layout/filter-modal';
import { AdminPageHeader } from '@/app/[locale]/admin/(dashboard)/components/admin-layout/header';
import { AdminPagination } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-pagination';
import { CheckboxWithLabel } from '@/app/[locale]/admin/(dashboard)/components/ui/checkbox';
import { DataList } from '@make-the-change/core/ui';
import { EmptyState } from '@make-the-change/core/ui';
import {
  ViewToggle,
  type ViewMode,
} from '@/app/[locale]/admin/(dashboard)/components/ui/view-toggle';
import { Category } from '@/app/[locale]/admin/(dashboard)/categories/components/category';
import {
  CategoryCardSkeleton,
  CategoryListSkeleton,
} from '@/app/[locale]/admin/(dashboard)/categories/components/category-card-skeleton';
import { LocalizedLink } from '@/components/localized-link';
import { Button } from '@/components/ui/button';
import {
  CustomSelect,
  type SelectOption as CustomSelectOption,
} from '@/components/ui/custom-select';
import { trpc } from '@/lib/trpc';

const pageSize = 18;

type SortOption =
  | 'created_at_desc'
  | 'created_at_asc'
  | 'name_asc'
  | 'name_desc'
  | 'sort_order_asc'
  | 'sort_order_desc';

const createParentOptions = (
  categories: any[] | undefined,
  t: (key: string) => string
): CustomSelectOption[] => {
  const baseOptions: CustomSelectOption[] = [
    {
      value: 'all',
      title: t('admin.categories.filters.all_parents'),
      subtitle: 'Toutes les catégories',
      icon: <Circle className="h-4 w-4 text-muted-foreground" />,
    },
    {
      value: 'root',
      title: t('admin.categories.filters.root_only'),
      subtitle: 'Catégories principales uniquement',
      icon: <Folder className="h-4 w-4 text-accent" />,
    },
  ];

  if (!categories) return baseOptions;

  const rootCategories = categories.filter(cat => !cat.parent_id);

  return [
    ...baseOptions,
    ...rootCategories.map(cat => ({
      value: cat.id,
      title: cat.name,
      subtitle: 'Sous-catégories de cette catégorie',
      icon: <Folder className="h-4 w-4 text-primary" />,
    })),
  ];
};

const createSortOptions = (t: (key: string) => string): CustomSelectOption[] => [
  {
    value: 'created_at_desc',
    title: t('admin.categories.sort.newest'),
    subtitle: 'Plus récentes en premier',
    icon: <TrendingDown className="h-4 w-4 text-primary" />,
  },
  {
    value: 'created_at_asc',
    title: t('admin.categories.sort.oldest'),
    subtitle: 'Plus anciennes en premier',
    icon: <TrendingUp className="h-4 w-4 text-primary" />,
  },
  {
    value: 'name_asc',
    title: t('admin.categories.sort.name_asc'),
    subtitle: 'Ordre alphabétique A-Z',
    icon: <SortAsc className="h-4 w-4 text-primary" />,
  },
  {
    value: 'name_desc',
    title: t('admin.categories.sort.name_desc'),
    subtitle: 'Ordre alphabétique Z-A',
    icon: <SortDesc className="h-4 w-4 text-primary" />,
  },
  {
    value: 'sort_order_asc',
    title: t('admin.categories.sort.order_asc'),
    subtitle: 'Ordre croissant',
    icon: <SortAsc className="h-4 w-4 text-success" />,
  },
  {
    value: 'sort_order_desc',
    title: t('admin.categories.sort.order_desc'),
    subtitle: 'Ordre décroissant',
    icon: <SortDesc className="h-4 w-4 text-destructive" />,
  },
];

const getSortSelectionItems = (t: (key: string) => string) =>
  createSortOptions(t).map(option => ({
    id: option.value,
    name: option.title,
  }));

const CategoriesPage: FC = () => {
  const t = useTranslations();

  const [search, setSearch] = useState('');
  const [activeOnly, setActiveOnly] = useState(false);
  const [selectedParentFilter, setSelectedParentFilter] = useState<
    string | undefined
  >();
  const [sortBy, setSortBy] = useState<SortOption>('sort_order_asc');
  const [cursor, setCursor] = useState<string | undefined>();
  const [view, setView] = useState<ViewMode>('grid');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const [isPendingFilters, startFilterTransition] = useTransition();
  const deferredSearch = useDeferredValue(search);

  const queryParams = useMemo(
    () => ({
      cursor,
      search: deferredSearch || undefined,
      activeOnly: activeOnly || undefined,
      parentId:
        selectedParentFilter === 'all' || selectedParentFilter === 'root'
          ? undefined
          : selectedParentFilter,
      rootOnly: selectedParentFilter === 'root' ? true : undefined,
      sortBy: sortBy || undefined,
      limit: pageSize,
    }),
    [cursor, deferredSearch, activeOnly, selectedParentFilter, sortBy]
  );

  const { data: allCategories, isPending: isPendingAllCategories } =
    trpc.admin.categories.list.useQuery({ activeOnly: false });

  const {
    data: categoriesData,
    isPending: isPendingCategories,
    isFetching,
    isError,
    error,
    refetch,
  } = trpc.admin.categories.listPaginated.useQuery(queryParams, {
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  const categories = useMemo(
    () => categoriesData?.items || [],
    [categoriesData?.items]
  );
  const totalCategories = categoriesData?.total || 0;
  const totalPages = Math.ceil(totalCategories / pageSize);

  const isFilterActive = useMemo(
    () =>
      !!(
        deferredSearch ||
        activeOnly ||
        (selectedParentFilter &&
          selectedParentFilter !== 'all') ||
        (sortBy && sortBy !== 'sort_order_asc')
      ),
    [deferredSearch, activeOnly, selectedParentFilter, sortBy]
  );

  const parentOptions = useMemo(
    (): CustomSelectOption[] => createParentOptions(allCategories, t),
    [allCategories, t]
  );

  const sortOptions = useMemo(
    (): CustomSelectOption[] => createSortOptions(t),
    [t]
  );
  const sortSelectionItems = useMemo(() => getSortSelectionItems(t), [t]);

  const hasActiveFilters = useMemo(
    () =>
      Boolean(
        search.trim() ||
          activeOnly ||
          selectedParentFilter ||
          sortBy !== 'sort_order_asc'
      ),
    [search, activeOnly, selectedParentFilter, sortBy]
  );

  const handleFilterChange = useCallback(
    (filterFn: () => void) => {
      startFilterTransition(filterFn);
    },
    [startFilterTransition]
  );

  const resetFilters = useCallback(() => {
    startFilterTransition(() => {
      setSearch('');
      setActiveOnly(false);
      setSelectedParentFilter(undefined);
      setSortBy('sort_order_asc');
      setCursor(undefined);
    });
    refetch();
  }, [refetch, startFilterTransition]);

  return (
    <AdminPageLayout>
      <AdminPageHeader>
        <div className="space-y-3 md:hidden">
          <div className="flex items-center gap-2">
            <AdminPageHeader.Search
              isLoading={isPendingCategories || isFetching}
              placeholder={t('admin.categories.search_placeholder')}
              value={search}
              onChange={setSearch}
            />
            <FilterButton
              isActive={isFilterActive}
              onClick={() => setIsFilterModalOpen(true)}
            />
          </div>
          <LocalizedLink className="w-full" href="/admin/categories/new">
            <Button className="w-full" size="sm" variant="accent">
              {t('admin.categories.new_category')}
            </Button>
          </LocalizedLink>
        </div>

        <div className="hidden space-y-4 md:block">
          <div className="flex items-center gap-4">
            <div className="max-w-md flex-1">
              <AdminPageHeader.Search
                isLoading={isPendingCategories || isFetching}
                placeholder={t('admin.categories.search_placeholder')}
                value={search}
                onChange={setSearch}
              />
            </div>
            <div className="flex items-center gap-3">
              <LocalizedLink className="w-full" href="/admin/categories/new">
                <Button className="w-full" icon={<Plus />} size="sm">
                  {t('admin.categories.new_category')}
                </Button>
              </LocalizedLink>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-1 flex-wrap items-center gap-3">
              <CustomSelect
                name="parent_filter"
                contextIcon={<Folder className="h-5 w-5" />}
                className="w-64"
                disabled={isPendingAllCategories || !allCategories || isPendingFilters}
                options={parentOptions}
                placeholder={t('admin.categories.filters.all_parents')}
                value={selectedParentFilter || 'all'}
                onChange={value =>
                  handleFilterChange(() =>
                    setSelectedParentFilter(value === 'all' ? undefined : value)
                  )
                }
              />

              <CustomSelect
                name="sort_filter"
                contextIcon={<Tag className="h-5 w-5" />}
                className="w-52"
                disabled={isPendingFilters}
                options={sortOptions}
                placeholder={t('admin.categories.filters.sort_by')}
                value={sortBy}
                onChange={value =>
                  handleFilterChange(() => setSortBy(value as SortOption))
                }
              />

              <CheckboxWithLabel
                checked={activeOnly}
                disabled={isPendingFilters}
                label={t('admin.categories.filters.active_only')}
                onCheckedChange={v =>
                  handleFilterChange(() => setActiveOnly(Boolean(v)))
                }
              />

              <ViewToggle value={view} onChange={setView} />

              {hasActiveFilters && (
                <Button
                  className="text-muted-foreground hover:text-foreground h-auto border-dashed px-3 py-2 text-xs"
                  size="sm"
                  variant="outline"
                  onClick={resetFilters}
                >
                  {t('admin.categories.filters.clear_filters')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </AdminPageHeader>

      <AdminPageLayout.Content>
        {isError ? (
          <EmptyState
            icon={Folder}
            title={t('admin.categories.error.loading_title')}
            variant="muted"
            action={
              <Button size="sm" variant="outline" onClick={() => refetch()}>
                {t('admin.categories.error.retry')}
              </Button>
            }
            description={
              error?.message || t('admin.categories.error.loading_description')
            }
          />
        ) : (
          <DataList
            isLoading={isPendingCategories}
            items={categories}
            variant={view === 'map' ? 'grid' : view}
            emptyState={{
              icon: Folder,
              title: t('admin.categories.empty_state.title'),
              description: t('admin.categories.empty_state.description'),
              action: (
                <Button size="sm" variant="outline" onClick={resetFilters}>
                  {t('admin.categories.filters.reset')}
                </Button>
              ),
            }}
            renderItem={category => (
              <Category
                key={category.id}
                category={category}
                queryParams={queryParams}
                view={view === 'map' ? 'grid' : view}
                onFilterChange={{
                  setParent: (parentId: string) =>
                    handleFilterChange(() => setSelectedParentFilter(parentId)),
                }}
              />
            )}
            renderSkeleton={() =>
              view === 'grid' ? (
                <CategoryCardSkeleton />
              ) : (
                <CategoryListSkeleton />
              )
            }
          />
        )}

        {totalCategories > pageSize && (
          <div className="mt-6">
            <AdminPagination
              pagination={{
                currentPage: Math.max(
                  1,
                  Math.floor((totalCategories - categories.length) / pageSize) + 1
                ),
                pageSize,
                totalItems: totalCategories,
                totalPages,
              }}
            />
          </div>
        )}
      </AdminPageLayout.Content>
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      >
        <Filters>
          <Filters.View view={view} onViewChange={setView} />

          <Filters.Selection
            allLabel=""
            items={sortSelectionItems}
            label={t('admin.categories.filters.sort_by')}
            selectedId={sortBy}
            onSelectionChange={id =>
              handleFilterChange(() =>
                setSortBy((id || 'sort_order_asc') as SortOption)
              )
            }
          />

          <Filters.Selection
            allLabel={t('admin.categories.filters.all_parents')}
            items={allCategories?.filter(cat => !cat.parent_id).map(cat => ({
              id: cat.id,
              name: cat.name,
            })) || []}
            label={t('admin.categories.filter_modal.parent')}
            selectedId={selectedParentFilter}
            onSelectionChange={id =>
              handleFilterChange(() => setSelectedParentFilter(id))
            }
          />

          <Filters.Toggle
            checked={activeOnly}
            label={t('admin.categories.filter_modal.active_only_description')}
            onCheckedChange={v => handleFilterChange(() => setActiveOnly(v))}
          />

          {hasActiveFilters && (
            <div className="border-border/30 border-t pt-4">
              <Button
                className="text-muted-foreground hover:text-foreground w-full border-dashed"
                size="sm"
                variant="outline"
                onClick={() => {
                  resetFilters();
                  setIsFilterModalOpen(false);
                }}
              >
                {t('admin.categories.filters.clear_all_filters')}
              </Button>
            </div>
          )}
        </Filters>
      </FilterModal>
    </AdminPageLayout>
  );
};

export default CategoriesPage;
