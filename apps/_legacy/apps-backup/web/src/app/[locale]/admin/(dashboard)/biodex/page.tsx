'use client';
import {
  Bug,
  Plus,
  ArrowUpDown,
  SortAsc,
  SortDesc,
  Circle,
  TrendingDown,
  TrendingUp,
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
import { DataList } from '@make-the-change/core/ui';
import { EmptyState } from '@make-the-change/core/ui';

import { LocalizedLink } from '@/components/localized-link';
import { Button } from '@/components/ui/button';
import {
  CustomSelect,
  type SelectOption as CustomSelectOption,
} from '@/components/ui/custom-select';
import { trpc } from '@/lib/trpc';
import { ViewMode, ViewToggle } from '../components/ui';
import { SpeciesCardSkeleton, SpeciesListSkeleton } from './components/species-card-skeleton';
import { Species } from './components/species';

const pageSize = 18;

type SortOption =
  | 'created_at_desc'
  | 'created_at_asc'
  | 'name_asc'
  | 'name_desc';

/**
 * Crée les options riches pour le filtre de tri
 */
const createSortOptions = (t: (key: string) => string): CustomSelectOption[] => [
  {
    value: 'created_at_desc',
    title: t('admin.biodex.sort.newest'),
    subtitle: 'Plus récentes en premier',
    icon: <TrendingDown className="h-4 w-4 text-primary" />,
  },
  {
    value: 'created_at_asc',
    title: t('admin.biodex.sort.oldest'),
    subtitle: 'Plus anciennes en premier',
    icon: <TrendingUp className="h-4 w-4 text-primary" />,
  },
  {
    value: 'name_asc',
    title: t('admin.biodex.sort.name_asc'),
    subtitle: 'Ordre alphabétique A-Z',
    icon: <SortAsc className="h-4 w-4 text-primary" />,
  },
  {
    value: 'name_desc',
    title: t('admin.biodex.sort.name_desc'),
    subtitle: 'Ordre alphabétique Z-A',
    icon: <SortDesc className="h-4 w-4 text-primary" />,
  },
];

const getSortSelectionItems = (t: (key: string) => string) =>
  createSortOptions(t).map(option => ({
    id: option.value,
    name: option.title,
  }));

const BiodesPage: FC = () => {
  const t = useTranslations();

  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('created_at_desc');
  const [cursor, setCursor] = useState<string | undefined>();
  const [view, setView] = useState<ViewMode>('grid');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const [isPendingFilters, startFilterTransition] = useTransition();
  const deferredSearch = useDeferredValue(search);

  const queryParams = useMemo(
    () => ({
      cursor,
      search: deferredSearch || undefined,
      sortBy: sortBy || undefined,
      limit: pageSize,
    }),
    [cursor, deferredSearch, sortBy]
  );

  const {
    data: speciesData,
    isPending: isPendingSpeciesList,
    isFetching,
    isError,
    error,
    refetch,
  } = trpc.admin.species.list.useQuery(queryParams, {
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  const species = useMemo(
    () => speciesData?.items || [],
    [speciesData?.items]
  );
  const totalSpecies = speciesData?.total || 0;
  const totalPages = Math.ceil(totalSpecies / pageSize);

  const isFilterActive = useMemo(
    () => !!(deferredSearch || (sortBy && sortBy !== 'created_at_desc')),
    [deferredSearch, sortBy]
  );

  const sortOptions = useMemo(
    (): CustomSelectOption[] => createSortOptions(t),
    [t]
  );

  const sortSelectionItems = useMemo(() => getSortSelectionItems(t), [t]);

  const hasActiveFilters = useMemo(
    () => Boolean(search.trim() || sortBy !== 'created_at_desc'),
    [search, sortBy]
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
      setSortBy('created_at_desc');
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
              isLoading={isPendingSpeciesList || isFetching}
              placeholder={t('admin.biodex.search_placeholder')}
              value={search}
              onChange={setSearch}
            />
            <FilterButton
              isActive={isFilterActive}
              onClick={() => setIsFilterModalOpen(true)}
            />
          </div>
          <LocalizedLink className="w-full" href="/admin/biodex/new">
            <Button className="w-full" size="sm" variant="accent">
              {t('admin.biodex.new_species')}
            </Button>
          </LocalizedLink>
        </div>

        <div className="hidden space-y-4 md:block">
          <div className="flex items-center gap-4">
            <div className="max-w-md flex-1">
              <AdminPageHeader.Search
                isLoading={isPendingSpeciesList || isFetching}
                placeholder={t('admin.biodex.search_placeholder')}
                value={search}
                onChange={setSearch}
              />
            </div>
            <div className="flex items-center gap-3">
              <LocalizedLink className="w-full" href="/admin/biodex/new">
                <Button className="w-full" icon={<Plus />} size="sm">
                  {t('admin.biodex.new_species')}
                </Button>
              </LocalizedLink>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-1 flex-wrap items-center gap-3">
              <CustomSelect
                name="sort_filter"
                contextIcon={<ArrowUpDown className="h-5 w-5" />}
                className="w-52"
                disabled={isPendingFilters}
                options={sortOptions}
                placeholder={t('admin.biodex.filters.sort_by')}
                value={sortBy}
                onChange={value =>
                  handleFilterChange(() => setSortBy(value as SortOption))
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
                  {t('admin.biodex.filters.clear_filters')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </AdminPageHeader>

      <AdminPageLayout.Content>
        {isError ? (
          <EmptyState
            icon={Bug}
            title={t('admin.biodex.error.loading_title')}
            variant="muted"
            action={
              <Button size="sm" variant="outline" onClick={() => refetch()}>
                {t('admin.biodex.error.retry')}
              </Button>
            }
            description={
              error?.message || t('admin.biodex.error.loading_description')
            }
          />
        ) : (
          <DataList
            isLoading={isPendingSpeciesList}
            items={species}
            variant={view === 'map' ? 'grid' : view}
            emptyState={{
              icon: Bug,
              title: t('admin.biodex.empty_state.title'),
              description: t('admin.biodex.empty_state.description'),
              action: (
                <Button size="sm" variant="outline" onClick={resetFilters}>
                  {t('admin.biodex.filters.reset')}
                </Button>
              ),
            }}
            renderItem={species => (
              <Species
                key={species.id}
                species={species}
                view={view === 'map' ? 'grid' : view}
                queryParams={queryParams}
              />
            )}
            renderSkeleton={() =>
              view === 'grid' ? (
                <SpeciesCardSkeleton />
              ) : (
                <SpeciesListSkeleton />
              )
            }
          />
        )}

        {totalSpecies > pageSize && (
          <div className="mt-6">
            <AdminPagination
              pagination={{
                currentPage: Math.max(
                  1,
                  Math.floor((totalSpecies - species.length) / pageSize) + 1
                ),
                pageSize,
                totalItems: totalSpecies,
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
            label={t('admin.biodex.filters.sort_by')}
            selectedId={sortBy}
            onSelectionChange={id =>
              handleFilterChange(() =>
                setSortBy((id || 'created_at_desc') as SortOption)
              )
            }
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
                {t('admin.biodex.filters.clear_all_filters')}
              </Button>
            </div>
          )}
        </Filters>
      </FilterModal>
    </AdminPageLayout>
  );
};

export default BiodesPage;