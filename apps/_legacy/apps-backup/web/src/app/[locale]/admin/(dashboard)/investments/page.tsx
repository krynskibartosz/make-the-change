'use client';

import {
  ArrowUpDown,
  BarChart2,
  Calendar,
  Circle,
  Coins,
  Leaf,
  ListChecks,
  SlidersHorizontal,
  TrendingUp,
} from 'lucide-react';
import {
  useCallback,
  useDeferredValue,
  useMemo,
  useState,
  useTransition,
} from 'react';

import {
  AdminPageLayout,
  Filters,
  FilterModal,
} from '@/app/[locale]/admin/(dashboard)/components/admin-layout';
import { FilterButton } from '@/app/[locale]/admin/(dashboard)/components/admin-layout/filter-modal';
import { AdminPageHeader } from '@/app/[locale]/admin/(dashboard)/components/admin-layout/header';
import { AdminPagination } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-pagination';
import { EmptyState } from '@make-the-change/core/ui';
import {
  ViewToggle,
  type ViewMode,
} from '@/app/[locale]/admin/(dashboard)/components/ui/view-toggle';
import { DataList } from '@make-the-change/core/ui';
import { InvestmentCard } from '@/app/[locale]/admin/(dashboard)/components/investments/investment-card';
import {
  InvestmentCardSkeleton,
  InvestmentListSkeleton,
} from '@/app/[locale]/admin/(dashboard)/components/investments/investment-card-skeleton';
import { InvestmentListItem } from '@/app/[locale]/admin/(dashboard)/components/investments/investment-list-item';
import { Button } from '@/components/ui/button';
import {
  CustomSelect,
  type SelectOption as CustomSelectOption,
} from '@/components/ui/custom-select';
import { trpc } from '@/lib/trpc';
import type { RouterOutputs } from '@/lib/trpc';

const pageSize = 20;

type InvestmentsListResponse = RouterOutputs['admin']['investments']['list'];
type Investment = InvestmentsListResponse['items'][number];

type InvestmentStatusFilter =
  | 'active'
  | 'pending'
  | 'completed'
  | 'cancelled'
  | 'expired'
  | 'defaulted';

type SortOption =
  | 'created_at_desc'
  | 'created_at_asc'
  | 'amount_eur_desc'
  | 'amount_eur_asc'
  | 'amount_points_desc'
  | 'amount_points_asc'
  | 'maturity_date_desc'
  | 'maturity_date_asc'
  | 'last_return_desc'
  | 'last_return_asc';

const statusOptions: CustomSelectOption[] = [
  {
    value: 'all',
    title: 'Tous les statuts',
    subtitle: 'Inclure tous les investissements',
    icon: <Circle className="h-4 w-4 text-muted-foreground" />,
  },
  {
    value: 'active',
    title: 'Actifs',
    subtitle: 'Investissements en cours',
    icon: <TrendingUp className="h-4 w-4 text-emerald-500" />,
  },
  {
    value: 'pending',
    title: 'En attente',
    subtitle: 'En traitement ou validation',
    icon: <SlidersHorizontal className="h-4 w-4 text-amber-500" />,
  },
  {
    value: 'completed',
    title: 'Terminés',
    subtitle: 'Retours versés intégralement',
    icon: <BarChart2 className="h-4 w-4 text-sky-500" />,
  },
  {
    value: 'cancelled',
    title: 'Annulés',
    subtitle: 'Investissements annulés',
    icon: <Circle className="h-4 w-4 text-destructive" />,
  },
  {
    value: 'expired',
    title: 'Expirés',
    subtitle: 'Arrivés à maturité sans renouvellement',
    icon: <Circle className="h-4 w-4 text-slate-500" />,
  },
  {
    value: 'defaulted',
    title: 'En défaut',
    subtitle: 'Requiert une attention particulière',
    icon: <Circle className="h-4 w-4 text-purple-500" />,
  },
];

const typeOptions: CustomSelectOption[] = [
  {
    value: 'all',
    title: 'Tous les types',
    subtitle: 'Afficher tous les projets',
    icon: <Leaf className="h-4 w-4 text-muted-foreground" />,
  },
  {
    value: 'beehive',
    title: 'Ruches',
    subtitle: 'Apiculture et pollinisation',
    icon: <Leaf className="h-4 w-4 text-amber-500" />,
  },
  {
    value: 'olive_tree',
    title: 'Oliviers',
    subtitle: 'Agroforesterie méditerranéenne',
    icon: <Leaf className="h-4 w-4 text-emerald-500" />,
  },
  {
    value: 'family_plot',
    title: 'Parcelles familiales',
    subtitle: 'Projets à long terme',
    icon: <Leaf className="h-4 w-4 text-sky-500" />,
  },
  {
    value: 'forest',
    title: 'Forêts',
    subtitle: 'Reforestation et captation carbone',
    icon: <Leaf className="h-4 w-4 text-green-600" />,
  },
  {
    value: 'agroforestry',
    title: 'Agroforesterie',
    subtitle: 'Systèmes mixtes',
    icon: <Leaf className="h-4 w-4 text-lime-600" />,
  },
];

const sortOptions: CustomSelectOption[] = [
  {
    value: 'created_at_desc',
    title: 'Plus récents',
    subtitle: 'Investissements les plus récents',
    icon: <ArrowUpDown className="h-4 w-4 text-primary" />,
  },
  {
    value: 'created_at_asc',
    title: 'Plus anciens',
    subtitle: 'Investissements les plus anciens',
    icon: <ArrowUpDown className="h-4 w-4 rotate-180 text-primary" />,
  },
  {
    value: 'amount_eur_desc',
    title: 'Montant décroissant',
    subtitle: 'Montants en euros les plus élevés',
    icon: <Coins className="h-4 w-4 text-emerald-500" />,
  },
  {
    value: 'amount_eur_asc',
    title: 'Montant croissant',
    subtitle: 'Montants en euros les plus faibles',
    icon: <Coins className="h-4 w-4 text-amber-500" />,
  },
  {
    value: 'amount_points_desc',
    title: 'Points décroissants',
    subtitle: 'Plus grande allocation de points',
    icon: <ListChecks className="h-4 w-4 text-blue-500" />,
  },
  {
    value: 'amount_points_asc',
    title: 'Points croissants',
    subtitle: 'Points investis les plus faibles',
    icon: <ListChecks className="h-4 w-4 text-slate-500" />,
  },
  {
    value: 'maturity_date_desc',
    title: 'Maturité imminente',
    subtitle: 'Échéances les plus proches',
    icon: <Calendar className="h-4 w-4 text-fuchsia-500" />,
  },
  {
    value: 'maturity_date_asc',
    title: 'Maturité lointaine',
    subtitle: 'Échéances les plus éloignées',
    icon: <Calendar className="h-4 w-4 text-indigo-500" />,
  },
  {
    value: 'last_return_desc',
    title: 'Dernier retour récent',
    subtitle: 'Investissements récemment rémunérés',
    icon: <TrendingUp className="h-4 w-4 text-teal-500" />,
  },
  {
    value: 'last_return_asc',
    title: 'Retour le plus ancien',
    subtitle: 'Risque d’inaction prolongée',
    icon: <TrendingUp className="h-4 w-4 rotate-180 text-teal-500" />,
  },
];

const statusSelectionItems = statusOptions
  .filter(option => option.value !== 'all')
  .map(option => ({ id: option.value, name: option.title }));

const typeSelectionItems = typeOptions
  .filter(option => option.value !== 'all')
  .map(option => ({ id: option.value, name: option.title }));

const sortSelectionItems = sortOptions.map(option => ({
  id: option.value,
  name: option.title,
}));

const InvestmentStatusBadgeLabel: Record<InvestmentStatusFilter, string> = {
  active: 'Actifs',
  pending: 'En attente',
  completed: 'Terminés',
  cancelled: 'Annulés',
  expired: 'Expirés',
  defaulted: 'En défaut',
};

const InvestmentTypeLabel: Record<string, string> = {
  beehive: 'Ruches',
  ruche: 'Ruches',
  'bee-hive': 'Ruches',
  olive_tree: 'Oliviers',
  olivier: 'Oliviers',
  family_plot: 'Parcelles familiales',
  parcelle_familiale: 'Parcelles familiales',
  forest: 'Forêts',
  agroforestry: 'Agroforesterie',
};

const InvestmentSortLabel: Record<SortOption, string> = {
  created_at_desc: 'Plus récents',
  created_at_asc: 'Plus anciens',
  amount_eur_desc: 'Montant décroissant',
  amount_eur_asc: 'Montant croissant',
  amount_points_desc: 'Points décroissants',
  amount_points_asc: 'Points croissants',
  maturity_date_desc: 'Maturité imminente',
  maturity_date_asc: 'Maturité lointaine',
  last_return_desc: 'Retour récent',
  last_return_asc: 'Retour ancien',
};

const emptyState = {
  title: 'Aucun investissement trouvé',
  description:
    'Essayez d’ajuster votre recherche ou les filtres pour voir davantage de résultats.',
};

const formatEuro = (value: number) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(value);

const formatPointsTotal = (investments: Investment[]) =>
  investments.reduce((acc, item) => acc + (item?.amount_points ?? 0), 0);

const AdminInvestmentsPage = () => {
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] =
    useState<InvestmentStatusFilter | 'all' | undefined>();
  const [selectedType, setSelectedType] = useState<string | 'all' | undefined>();
  const [sortBy, setSortBy] = useState<SortOption>('created_at_desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState<ViewMode>('grid');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const [, startFilterTransition] = useTransition();
  const deferredSearch = useDeferredValue(search);

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      limit: pageSize,
      search: deferredSearch || undefined,
      status:
        selectedStatus && selectedStatus !== 'all'
          ? (selectedStatus as InvestmentStatusFilter)
          : undefined,
      projectType:
        selectedType && selectedType !== 'all' ? selectedType : undefined,
      sortBy,
    }),
    [currentPage, deferredSearch, selectedStatus, selectedType, sortBy]
  );

  const {
    data: investmentsData,
    isPending,
    isFetching,
    isError,
    error,
    refetch,
  } = trpc.admin.investments.list.useQuery(queryParams, {
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  const investments = useMemo(
    () => investmentsData?.items ?? [],
    [investmentsData?.items]
  );
  const totalInvestments = investmentsData?.total ?? 0;
  const totalPages = investmentsData?.totalPages ?? 1;

  const handleFilterChange = useCallback(
    (updater: () => void) => {
      startFilterTransition(() => {
        updater();
        setCurrentPage(1);
      });
    },
    []
  );

  const resetFilters = useCallback(() => {
    startFilterTransition(() => {
      setSearch('');
      setSelectedStatus(undefined);
      setSelectedType(undefined);
      setSortBy('created_at_desc');
      setCurrentPage(1);
    });
    refetch();
  }, [refetch]);

  const isFilterActive = useMemo(
    () =>
      Boolean(
        search.trim() ||
          (selectedStatus && selectedStatus !== 'all') ||
          (selectedType && selectedType !== 'all') ||
          sortBy !== 'created_at_desc'
      ),
    [search, selectedStatus, selectedType, sortBy]
  );

  const statusLabel =
    selectedStatus && selectedStatus !== 'all'
      ? InvestmentStatusBadgeLabel[selectedStatus]
      : undefined;

  const typeLabel =
    selectedType && selectedType !== 'all'
      ? InvestmentTypeLabel[selectedType] ?? selectedType
      : undefined;

  const sortLabel = InvestmentSortLabel[sortBy];

  const summaryPoints = formatPointsTotal(investments);
  const summaryEuros = investments.reduce(
    (acc, item) => acc + (item?.amount_eur ?? 0),
    0
  );

  return (
    <AdminPageLayout>
      <AdminPageHeader>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <AdminPageHeader.Search
              className="md:max-w-md"
              isLoading={isPending || isFetching}
              placeholder="Rechercher un investisseur ou un projet..."
              value={search}
              onChange={value => {
                setSearch(value);
                setCurrentPage(1);
              }}
            />

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-3">
              <div className="flex items-center gap-2">
                <CustomSelect
                  name="investment-status-filter"
                  options={statusOptions}
                  placeholder="Statut"
                  value={selectedStatus ?? 'all'}
                  contextIcon={<SlidersHorizontal className="h-5 w-5 text-muted-foreground" />}
                  onChange={option =>
                    handleFilterChange(() => {
                      setSelectedStatus(
                        (option?.value as
                          | InvestmentStatusFilter
                          | 'all'
                          | undefined) ?? undefined
                      );
                    })
                  }
                />
                <CustomSelect
                  name="investment-type-filter"
                  options={typeOptions}
                  placeholder="Type"
                  value={selectedType ?? 'all'}
                  contextIcon={<Leaf className="h-5 w-5 text-muted-foreground" />}
                  onChange={option =>
                    handleFilterChange(() => {
                      setSelectedType(
                        (option?.value as string | 'all' | undefined) ?? undefined
                      );
                    })
                  }
                />
                <CustomSelect
                  name="investment-sort-filter"
                  options={sortOptions}
                  placeholder="Trier par"
                  value={sortBy}
                  contextIcon={<ArrowUpDown className="h-5 w-5 text-muted-foreground" />}
                  onChange={option =>
                    handleFilterChange(() => {
                      setSortBy(
                        (option?.value as SortOption) ?? 'created_at_desc'
                      );
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between gap-2 md:justify-end">
                <ViewToggle value={view} onChange={setView} />
                <FilterButton
                  isActive={isFilterActive}
                  onClick={() => setIsFilterModalOpen(true)}
                />
              </div>
            </div>
          </div>

          {isFilterActive && (
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              {statusLabel && (
                <span className="rounded-full border border-border/40 px-3 py-1">
                  Statut: {statusLabel}
                </span>
              )}
              {typeLabel && (
                <span className="rounded-full border border-border/40 px-3 py-1">
                  Type: {typeLabel}
                </span>
              )}
              {sortLabel && (
                <span className="rounded-full border border-border/40 px-3 py-1">
                  Tri: {sortLabel}
                </span>
              )}
              <Button
                className="text-muted-foreground hover:text-foreground h-auto border-dashed px-3 py-1"
                size="sm"
                variant="outline"
                onClick={resetFilters}
              >
                Effacer les filtres
              </Button>
            </div>
          )}
        </div>
      </AdminPageHeader>

      <AdminPageLayout.Content>
        {isError ? (
          <EmptyState
            description={
              error?.message ?? 'Impossible de charger les investissements.'
            }
            icon={Circle}
            title="Erreur de chargement"
            action={
              <Button size="sm" variant="outline" onClick={() => refetch()}>
                Réessayer
              </Button>
            }
          />
        ) : (
          <DataList
            className="pb-6"
            emptyState={{
              ...emptyState,
              action: (
                <Button size="sm" variant="outline" onClick={resetFilters}>
                  Réinitialiser les filtres
                </Button>
              ),
            }}
            isLoading={isPending}
            items={investments}
            variant={view}
            renderItem={investment =>
              view === 'grid' ? (
                <InvestmentCard investment={investment} />
              ) : (
                <InvestmentListItem investment={investment} />
              )
            }
            renderSkeleton={() =>
              view === 'grid' ? (
                <InvestmentCardSkeleton />
              ) : (
                <InvestmentListSkeleton />
              )
            }
          />
        )}

        {totalInvestments > pageSize && (
          <AdminPagination
            pagination={{
              currentPage,
              pageSize,
              totalItems: totalInvestments,
              totalPages,
            }}
            onPageChange={page => setCurrentPage(page)}
          />
        )}
      </AdminPageLayout.Content>

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      >
        <Filters>
          <Filters.View view={view} onViewChange={setView} />

          <Filters.Selection
            allLabel="Tous les statuts"
            items={statusSelectionItems}
            label="Statut"
            selectedId={
              selectedStatus && selectedStatus !== 'all'
                ? selectedStatus
                : undefined
            }
            onSelectionChange={id =>
              handleFilterChange(() => {
                setSelectedStatus(
                  (id as InvestmentStatusFilter | undefined) ?? undefined
                );
              })
            }
          />

          <Filters.Selection
            allLabel="Tous les types"
            items={typeSelectionItems}
            label="Type d'investissement"
            selectedId={
              selectedType && selectedType !== 'all' ? selectedType : undefined
            }
            onSelectionChange={id =>
              handleFilterChange(() => {
                setSelectedType((id as string | undefined) ?? undefined);
              })
            }
          />

          <Filters.Selection
            allLabel="Par défaut"
            items={sortSelectionItems}
            label="Trier par"
            selectedId={sortBy}
            onSelectionChange={id =>
              handleFilterChange(() => {
                setSortBy((id as SortOption) ?? 'created_at_desc');
              })
            }
          />

          {isFilterActive && (
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
                Effacer les filtres
              </Button>
            </div>
          )}
        </Filters>
      </FilterModal>
    </AdminPageLayout>
  );
};

export default AdminInvestmentsPage;
