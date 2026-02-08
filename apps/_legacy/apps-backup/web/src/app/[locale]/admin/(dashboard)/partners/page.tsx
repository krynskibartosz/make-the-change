'use client';
import {
  Building2,
  Plus,
  CheckCircle,
  XCircle,
  AlertCircle,
  Circle,
  Globe,
  ArrowUpDown,
  TrendingDown,
  TrendingUp,
  SortAsc,
  SortDesc,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  type FC,
  type ReactNode,
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
import { Partner } from '@/app/[locale]/admin/(dashboard)/partners/components/partner';
import {
  PartnerCardSkeleton,
  PartnerListSkeleton,
} from '@/app/[locale]/admin/(dashboard)/partners/components/partner-card-skeleton';
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
  | 'name_desc';

/**
 * Crée les options riches pour le filtre de statut
 */
const createStatusOptions = (t: (key: string) => string): CustomSelectOption[] => [
  {
    value: 'all',
    title: t('admin.partners.filters.all_statuses'),
    subtitle: 'Tous les partenaires',
    icon: <Circle className="h-4 w-4 text-muted-foreground" />,
  },
  {
    value: 'active',
    title: t('admin.partners.filters.status_active'),
    subtitle: 'Partenaires actifs',
    icon: <CheckCircle className="h-4 w-4 text-success" />,
  },
  {
    value: 'inactive',
    title: t('admin.partners.filters.status_inactive'),
    subtitle: 'Partenaires inactifs',
    icon: <XCircle className="h-4 w-4 text-muted-foreground" />,
  },
  {
    value: 'suspended',
    title: t('admin.partners.filters.status_suspended'),
    subtitle: 'Partenaires suspendus',
    icon: <AlertCircle className="h-4 w-4 text-destructive" />,
  },
];

/**
 * Crée les options riches pour le filtre de pays
 */
const createCountryOptions = (
  countries: { id: string; name: string }[] | undefined,
  t: (key: string) => string
): CustomSelectOption[] => {
  const baseOptions: CustomSelectOption[] = [
    {
      value: 'all',
      title: t('admin.partners.filters.all_countries'),
      subtitle: 'Tous les pays',
      icon: <Circle className="h-4 w-4 text-muted-foreground" />,
    },
  ];

  if (!countries) return baseOptions;

  return [
    ...baseOptions,
    ...countries.map(country => ({
      value: country.id,
      title: country.name,
      subtitle: 'Pays partenaire',
      icon: <Globe className="h-4 w-4 text-primary" />,
    })),
  ];
};

/**
 * Crée les options riches pour le filtre de tri
 */
const createSortOptions = (t: (key: string) => string): CustomSelectOption[] => [
  {
    value: 'created_at_desc',
    title: t('admin.partners.sort.newest'),
    subtitle: 'Plus récents en premier',
    icon: <TrendingDown className="h-4 w-4 text-primary" />,
  },
  {
    value: 'created_at_asc',
    title: t('admin.partners.sort.oldest'),
    subtitle: 'Plus anciens en premier',
    icon: <TrendingUp className="h-4 w-4 text-primary" />,
  },
  {
    value: 'name_asc',
    title: t('admin.partners.sort.name_asc'),
    subtitle: 'Ordre alphabétique A-Z',
    icon: <SortAsc className="h-4 w-4 text-primary" />,
  },
  {
    value: 'name_desc',
    title: t('admin.partners.sort.name_desc'),
    subtitle: 'Ordre alphabétique Z-A',
    icon: <SortDesc className="h-4 w-4 text-primary" />,
  },
];

const getSortSelectionItems = (t: (key: string) => string) =>
  createSortOptions(t).map(option => ({
    id: option.value,
    name: option.title,
  }));

const PartnersPage: FC = () => {
  const t = useTranslations();

  const [search, setSearch] = useState('');
  const [activeOnly, setActiveOnly] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>();
  const [selectedCountry, setSelectedCountry] = useState<string | undefined>();
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
      status:
        selectedStatus === 'all' || !selectedStatus
          ? undefined
      : (selectedStatus as 'active' | 'inactive' | 'suspended'),
      country: selectedCountry === 'all' ? undefined : selectedCountry,
      sortBy: sortBy || undefined,
      limit: pageSize,
    }),
    [cursor, deferredSearch, selectedStatus, selectedCountry, sortBy]
  );

  const { data: countries, isPending: isPendingCountries } =
    trpc.admin.partners.countries.useQuery(undefined);

  const {
    data: partnersData,
    isPending: isPendingPartnersList,
    isFetching,
    isError,
    error,
    refetch,
  } = trpc.admin.partners.list.useQuery(queryParams, {
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  const partners = useMemo(
    () => partnersData?.items || [],
    [partnersData?.items]
  );
  const totalPartners = partnersData?.total || 0;
  const totalPages = Math.ceil(totalPartners / pageSize);

  const isFilterActive = useMemo(
    () =>
      !!(
        deferredSearch ||
        activeOnly ||
        (selectedStatus && selectedStatus !== 'all') ||
        (selectedCountry && selectedCountry !== 'all') ||
        (sortBy && sortBy !== 'created_at_desc')
      ),
    [deferredSearch, activeOnly, selectedStatus, selectedCountry, sortBy]
  );

  const countryOptions = useMemo(
    (): CustomSelectOption[] => createCountryOptions(countries, t),
    [countries, t]
  );

  const statusOptions = useMemo(
    (): CustomSelectOption[] => createStatusOptions(t),
    [t]
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
          selectedStatus ||
          selectedCountry ||
          sortBy !== 'created_at_desc'
      ),
    [search, activeOnly, selectedStatus, selectedCountry, sortBy]
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
      setSelectedStatus(undefined);
      setSelectedCountry(undefined);
      setSortBy('created_at_desc');
      setCursor(undefined);
    });
    refetch();
  }, [refetch, startFilterTransition]);

  const statusesForSelection = useMemo(
    () => [
      { id: 'active', name: t('admin.partners.filters.status_active') },
      { id: 'inactive', name: t('admin.partners.filters.status_inactive') },
      { id: 'suspended', name: t('admin.partners.filters.status_suspended') },
    ],
    [t]
  );

  return (
    <AdminPageLayout>
      <AdminPageHeader>
        <div className="space-y-3 md:hidden">
          <div className="flex items-center gap-2">
            <AdminPageHeader.Search
              isLoading={isPendingPartnersList || isFetching}
              placeholder={t('admin.partners.search_placeholder')}
              value={search}
              onChange={setSearch}
            />
            <FilterButton
              isActive={isFilterActive}
              onClick={() => setIsFilterModalOpen(true)}
            />
          </div>
          <LocalizedLink className="w-full" href="/admin/partners/new">
            <Button className="w-full" size="sm" variant="accent">
              {t('admin.partners.new_partner')}
            </Button>
          </LocalizedLink>
        </div>

        <div className="hidden space-y-4 md:block">
          <div className="flex items-center gap-4">
            <div className="max-w-md flex-1">
              <AdminPageHeader.Search
                isLoading={isPendingPartnersList || isFetching}
                placeholder={t('admin.partners.search_placeholder')}
                value={search}
                onChange={setSearch}
              />
            </div>
            <div className="flex items-center gap-3">
              <LocalizedLink className="w-full" href="/admin/partners/new">
                <Button className="w-full" icon={<Plus />} size="sm">
                  {t('admin.partners.new_partner')}
                </Button>
              </LocalizedLink>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-1 flex-wrap items-center gap-3">
              <CustomSelect
                name="status_filter"
                contextIcon={<CheckCircle className="h-5 w-5" />}
                className="w-56"
                disabled={isPendingFilters}
                options={statusOptions}
                placeholder={t('admin.partners.filters.status')}
                value={selectedStatus || 'all'}
                onChange={value =>
                  handleFilterChange(() =>
                    setSelectedStatus(value === 'all' ? undefined : value)
                  )
                }
              />

              <CustomSelect
                name="country_filter"
                contextIcon={<Globe className="h-5 w-5" />}
                className="w-56"
                disabled={isPendingCountries || !countries || isPendingFilters}
                options={countryOptions}
                placeholder={t('admin.partners.filters.country')}
                value={selectedCountry || 'all'}
                onChange={value =>
                  handleFilterChange(() =>
                    setSelectedCountry(value === 'all' ? undefined : value)
                  )
                }
              />

              <CustomSelect
                name="sort_filter"
                contextIcon={<ArrowUpDown className="h-5 w-5" />}
                className="w-52"
                disabled={isPendingFilters}
                options={sortOptions}
                placeholder={t('admin.partners.filters.sort_by')}
                value={sortBy}
                onChange={value =>
                  handleFilterChange(() => setSortBy(value as SortOption))
                }
              />

              <CheckboxWithLabel
                checked={activeOnly}
                disabled={isPendingFilters}
                label={t('admin.partners.filters.active_only')}
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
                  {t('admin.partners.filters.clear_filters')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </AdminPageHeader>

      <AdminPageLayout.Content>
        {isError ? (
          <EmptyState
            icon={Building2}
            title={t('admin.partners.error.loading_title')}
            variant="muted"
            action={
              <Button size="sm" variant="outline" onClick={() => refetch()}>
                {t('admin.partners.error.retry')}
              </Button>
            }
            description={
              error?.message || t('admin.partners.error.loading_description')
            }
          />
        ) : (
          <DataList
            isLoading={isPendingPartnersList}
            items={partners}
            variant={view === 'map' ? 'grid' : view}
            emptyState={{
              icon: Building2,
              title: t('admin.partners.empty_state.title'),
              description: t('admin.partners.empty_state.description'),
              action: (
                <Button size="sm" variant="outline" onClick={resetFilters}>
                  {t('admin.partners.filters.reset')}
                </Button>
              ),
            }}
            renderItem={partner => (
              <Partner
                key={partner.id}
                partner={partner}
                view={view === 'map' ? 'grid' : view}
                queryParams={queryParams}
                onFilterChange={{
                  setStatus: (status: string) =>
                    handleFilterChange(() => setSelectedStatus(status)),
                  setCountry: (country: string) =>
                    handleFilterChange(() => setSelectedCountry(country)),
                }}
              />
            )}
            renderSkeleton={() =>
              view === 'grid' ? (
                <PartnerCardSkeleton />
              ) : (
                <PartnerListSkeleton />
              )
            }
          />
        )}

        {totalPartners > pageSize && (
          <div className="mt-6">
            <AdminPagination
              pagination={{
                currentPage: Math.max(
                  1,
                  Math.floor((totalPartners - partners.length) / pageSize) + 1
                ),
                pageSize,
                totalItems: totalPartners,
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
            label={t('admin.partners.filters.sort_by')}
            selectedId={sortBy}
            onSelectionChange={id =>
              handleFilterChange(() =>
                setSortBy((id || 'created_at_desc') as SortOption)
              )
            }
          />

          <Filters.Selection
            allLabel={t('admin.partners.filters.all_statuses')}
            items={statusesForSelection}
            label={t('admin.partners.filter_modal.status')}
            selectedId={selectedStatus}
            onSelectionChange={id =>
              handleFilterChange(() => setSelectedStatus(id))
            }
          />

          <Filters.Selection
            allLabel={t('admin.partners.filters.all_countries')}
            items={countries || []}
            label={t('admin.partners.filter_modal.country')}
            selectedId={selectedCountry}
            onSelectionChange={id =>
              handleFilterChange(() => setSelectedCountry(id))
            }
          />

          <Filters.Toggle
            checked={activeOnly}
            label={t('admin.partners.filter_modal.active_only_description')}
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
                {t('admin.partners.filters.clear_all_filters')}
              </Button>
            </div>
          )}
        </Filters>
      </FilterModal>
    </AdminPageLayout>
  );
};

export default PartnersPage;
