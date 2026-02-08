'use client';

import {
  Truck,
  CheckCircle,
  Clock,
  Circle,
  XCircle,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Filter as FilterIcon,
  ArrowUpDown,
} from 'lucide-react';
import { useDeferredValue, useMemo, useState, useTransition, useCallback, FC } from 'react';

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
import {
  ViewToggle,
  type ViewMode,
} from '@/app/[locale]/admin/(dashboard)/components/ui/view-toggle';
import {
  CustomSelect,
  type SelectOption as CustomSelectOption,
} from '@/components/ui/custom-select';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';

import { Order } from '@/app/[locale]/admin/(dashboard)/orders/components/order';
import {
  OrderCardSkeleton,
  OrderListSkeleton,
} from '@/app/[locale]/admin/(dashboard)/orders/components/order-card-skeleton';

const pageSize = 20;

type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

type SortOption =
  | 'created_at_desc'
  | 'created_at_asc'
  | 'total_points_desc'
  | 'total_points_asc';

const createStatusOptions = (): CustomSelectOption[] => [
  {
    value: 'all',
    title: 'Tous les statuts',
    subtitle: 'Inclut toutes les commandes',
    icon: <Circle className="h-4 w-4 text-muted-foreground" />,
  },
  {
    value: 'pending',
    title: 'En attente',
    subtitle: 'Commande enregistrée',
    icon: <Clock className="h-4 w-4 text-amber-500" />,
  },
  {
    value: 'processing',
    title: 'En traitement',
    subtitle: 'Préparation en cours',
    icon: <FilterIcon className="h-4 w-4 text-orange-500" />,
  },
  {
    value: 'shipped',
    title: 'Expédiée',
    subtitle: 'Colis remis au transporteur',
    icon: <Truck className="h-4 w-4 text-blue-500" />,
  },
  {
    value: 'delivered',
    title: 'Livrée',
    subtitle: 'Commande reçue',
    icon: <CheckCircle className="h-4 w-4 text-emerald-500" />,
  },
  {
    value: 'cancelled',
    title: 'Annulée',
    subtitle: 'Commande invalidée',
    icon: <XCircle className="h-4 w-4 text-destructive" />,
  },
  {
    value: 'refunded',
    title: 'Remboursée',
    subtitle: 'Points recrédités',
    icon: <DollarSign className="h-4 w-4 text-purple-500" />,
  },
];

const createSortOptions = (): CustomSelectOption[] => [
  {
    value: 'created_at_desc',
    title: 'Plus récentes',
    subtitle: 'Commandes les plus récentes en premier',
    icon: <TrendingDown className="h-4 w-4 text-primary" />,
  },
  {
    value: 'created_at_asc',
    title: 'Plus anciennes',
    subtitle: 'Commandes les plus anciennes en premier',
    icon: <TrendingUp className="h-4 w-4 text-primary" />,
  },
  {
    value: 'total_points_desc',
    title: 'Montant décroissant',
    subtitle: 'Commandes avec le plus de points',
    icon: <DollarSign className="h-4 w-4 text-emerald-500" />,
  },
  {
    value: 'total_points_asc',
    title: 'Montant croissant',
    subtitle: 'Commandes avec le moins de points',
    icon: <DollarSign className="h-4 w-4 text-amber-500" />,
  },
];

const statusOptions = createStatusOptions();
const sortOptions = createSortOptions();

const statusSelectionItems = statusOptions
  .filter(option => option.value !== 'all')
  .map(option => ({ id: option.value, name: option.title }));

const sortSelectionItems = sortOptions.map(option => ({
  id: option.value,
  name: option.title,
}));

const formatStatusLabel = (status: OrderStatus | undefined) => {
  switch (status) {
    case 'pending':
      return 'En attente';
    case 'confirmed':
      return 'Confirmée';
    case 'processing':
      return 'En traitement';
    case 'shipped':
      return 'Expédiée';
    case 'delivered':
      return 'Livrée';
    case 'cancelled':
      return 'Annulée';
    case 'refunded':
      return 'Remboursée';
    default:
      return 'Tous les statuts';
  }
};

const AdminOrdersPage: FC = () => {
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'all' | undefined>();
  const [sortBy, setSortBy] = useState<SortOption>('created_at_desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState<ViewMode>('grid');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const [isPendingFilters, startFilterTransition] = useTransition();
  const deferredSearch = useDeferredValue(search);

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      limit: pageSize,
      search: deferredSearch || undefined,
      status: selectedStatus && selectedStatus !== 'all' ? selectedStatus : undefined,
      sortBy,
    }),
    [currentPage, deferredSearch, selectedStatus, sortBy]
  );

  const {
    data: ordersData,
    isPending: isPendingOrders,
    isFetching,
    isError,
    error,
    refetch,
  } = trpc.admin.orders.list.useQuery(queryParams, {
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  const orders = useMemo(() => ordersData?.items ?? [], [ordersData?.items]);
  const totalOrders = ordersData?.total ?? 0;
  const totalPages = ordersData?.totalPages ?? Math.max(1, Math.ceil(totalOrders / pageSize));

  const isFilterActive = useMemo(
    () =>
      Boolean(
        deferredSearch ||
          (selectedStatus && selectedStatus !== 'all') ||
          sortBy !== 'created_at_desc'
      ),
    [deferredSearch, selectedStatus, sortBy]
  );

  const handleFilterChange = useCallback(
    (updater: () => void) => {
      startFilterTransition(updater);
    },
    [startFilterTransition]
  );

  const resetFilters = useCallback(() => {
    startFilterTransition(() => {
      setSearch('');
      setSelectedStatus(undefined);
      setSortBy('created_at_desc');
      setCurrentPage(1);
      setView('grid');
    });
    void refetch();
  }, [refetch, startFilterTransition]);

  const handlePageChange = useCallback(
    (page: number) => {
      handleFilterChange(() => setCurrentPage(page));
    },
    [handleFilterChange]
  );

  const ordersEmptyState = {
    icon: CheckCircle,
    title: 'Aucune commande',
    description: 'Aucun résultat ne correspond à vos filtres actuels.',
    action: (
      <Button size="sm" variant="outline" onClick={resetFilters}>
        Réinitialiser
      </Button>
    ),
  };

  return (
    <AdminPageLayout>
      <AdminPageHeader>
        <div className="space-y-3 md:hidden">
          <div className="flex items-center gap-2">
            <AdminPageHeader.Search
              isLoading={isPendingOrders || isFetching}
              placeholder="Rechercher par client ou ID"
              value={search}
              onChange={setSearch}
            />
            <FilterButton
              isActive={isFilterActive}
              onClick={() => setIsFilterModalOpen(true)}
            />
          </div>
        </div>

        <div className="hidden space-y-4 md:block">
          <div className="flex items-center gap-4">
            <div className="max-w-md flex-1">
              <AdminPageHeader.Search
                isLoading={isPendingOrders || isFetching}
                placeholder="Rechercher par client ou ID"
                value={search}
                onChange={setSearch}
              />
            </div>

            <div className="flex items-center gap-3">
              <CustomSelect
                name="order-status-filter"
                contextIcon={<CheckCircle className="h-5 w-5" />}
                className="w-52"
                disabled={isPendingFilters}
                options={statusOptions}
                placeholder="Statut de la commande"
                value={selectedStatus || 'all'}
                onChange={value =>
                  handleFilterChange(() => {
                    setSelectedStatus((value as OrderStatus | 'all') ?? undefined);
                    setCurrentPage(1);
                  })
                }
              />

              <CustomSelect
                name="order-sort-filter"
                contextIcon={<ArrowUpDown className="h-5 w-5" />}
                className="w-52"
                disabled={isPendingFilters}
                options={sortOptions}
                placeholder="Trier par"
                value={sortBy}
                onChange={value =>
                  handleFilterChange(() => {
                    setSortBy((value as SortOption) ?? 'created_at_desc');
                    setCurrentPage(1);
                  })
                }
              />

              <ViewToggle value={view} onChange={setView} />

              {isFilterActive && (
                <Button
                  className="text-muted-foreground hover:text-foreground h-auto border-dashed px-3 py-2 text-xs"
                  size="sm"
                  variant="outline"
                  onClick={resetFilters}
                >
                  Effacer les filtres
                </Button>
              )}
            </div>
          </div>
        </div>
      </AdminPageHeader>

      <AdminPageLayout.Content>
        {isError ? (
          <EmptyState
            icon={XCircle}
            title="Erreur de chargement"
            description={error?.message ?? 'Impossible de charger les commandes.'}
            variant="muted"
            action={
              <Button size="sm" variant="outline" onClick={() => refetch()}>
                Réessayer
              </Button>
            }
          />
        ) : (
          <DataList
            isLoading={isPendingOrders}
            items={orders}
            variant={view}
            emptyState={ordersEmptyState}
            renderItem={order => (
              <Order
                key={order.id}
                order={order}
                view={view}
                queryParams={{
                  search: deferredSearch || undefined,
                  status: selectedStatus && selectedStatus !== 'all' ? selectedStatus : undefined,
                  sortBy,
                  limit: pageSize,
                  page: currentPage,
                }}
                onFilterChange={{
                  setStatus: (status: string) =>
                    handleFilterChange(() => {
                      setSelectedStatus(status as OrderStatus);
                      setCurrentPage(1);
                    }),
                }}
              />
            )}
            renderSkeleton={() =>
              view === 'grid' ? <OrderCardSkeleton /> : <OrderListSkeleton />
            }
          />
        )}

        {totalOrders > pageSize && (
          <AdminPagination
            pagination={{
              currentPage,
              pageSize,
              totalItems: totalOrders,
              totalPages,
            }}
            onPageChange={handlePageChange}
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
            selectedId={selectedStatus}
            onSelectionChange={id =>
              handleFilterChange(() => {
                setSelectedStatus((id as OrderStatus | 'all') ?? undefined);
                setCurrentPage(1);
              })
            }
          />

          <Filters.Selection
            allLabel="Par défaut"
            items={sortSelectionItems}
            label="Tri"
            selectedId={sortBy}
            onSelectionChange={id =>
              handleFilterChange(() => {
                setSortBy((id as SortOption) ?? 'created_at_desc');
                setCurrentPage(1);
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

export default AdminOrdersPage;
