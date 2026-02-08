'use client';

import {
  Coins,
  ArrowUpDown,
  TrendingDown,
  TrendingUp,
  Filter as FilterIcon,
  XCircle,
  Calendar,
  MoreVertical,
  Eye,
  ExternalLink,
  CalendarIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
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
import { EmptyState } from '@make-the-change/core/ui';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import {
  CustomSelect,
  type SelectOption as CustomSelectOption,
} from '@/components/ui/custom-select';
import { trpc } from '@/lib/trpc';
import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';

const pageSize = 50;

type TransactionType =
  | 'earned_subscription'
  | 'earned_purchase'
  | 'earned_referral'
  | 'spent_order'
  | 'spent_investment'
  | 'adjustment_admin'
  | 'bonus_welcome'
  | 'bonus_milestone';

type SortOption =
  | 'created_at_desc'
  | 'created_at_asc'
  | 'amount_desc'
  | 'amount_asc';

const createTypeOptions = (t: (key: string) => string): CustomSelectOption[] => [
  {
    value: 'all',
    title: t('admin.pointsTransactions.filters.all_types'),
    subtitle: 'Tous les types de transactions',
    icon: <Coins className="h-4 w-4 text-muted-foreground" />,
  },
  {
    value: 'earned_subscription',
    title: t('admin.pointsTransactions.types.earned_subscription'),
    subtitle: 'Points gagnés',
    icon: <span className="text-lg">🟢</span>,
  },
  {
    value: 'earned_purchase',
    title: t('admin.pointsTransactions.types.earned_purchase'),
    subtitle: 'Points gagnés',
    icon: <span className="text-lg">🟢</span>,
  },
  {
    value: 'earned_referral',
    title: t('admin.pointsTransactions.types.earned_referral'),
    subtitle: 'Points gagnés',
    icon: <span className="text-lg">🟢</span>,
  },
  {
    value: 'spent_order',
    title: t('admin.pointsTransactions.types.spent_order'),
    subtitle: 'Points dépensés',
    icon: <span className="text-lg">🔴</span>,
  },
  {
    value: 'spent_investment',
    title: t('admin.pointsTransactions.types.spent_investment'),
    subtitle: 'Points dépensés',
    icon: <span className="text-lg">🔴</span>,
  },
  {
    value: 'adjustment_admin',
    title: t('admin.pointsTransactions.types.adjustment_admin'),
    subtitle: 'Ajustement',
    icon: <span className="text-lg">🟡</span>,
  },
  {
    value: 'bonus_welcome',
    title: t('admin.pointsTransactions.types.bonus_welcome'),
    subtitle: 'Bonus',
    icon: <span className="text-lg">🔵</span>,
  },
  {
    value: 'bonus_milestone',
    title: t('admin.pointsTransactions.types.bonus_milestone'),
    subtitle: 'Bonus',
    icon: <span className="text-lg">🔵</span>,
  },
];

const createSortOptions = (t: (key: string) => string): CustomSelectOption[] => [
  {
    value: 'created_at_desc',
    title: t('admin.pointsTransactions.sort.newest'),
    subtitle: 'Plus récentes en premier',
    icon: <TrendingDown className="h-4 w-4 text-primary" />,
  },
  {
    value: 'created_at_asc',
    title: t('admin.pointsTransactions.sort.oldest'),
    subtitle: 'Plus anciennes en premier',
    icon: <TrendingUp className="h-4 w-4 text-primary" />,
  },
  {
    value: 'amount_desc',
    title: t('admin.pointsTransactions.sort.amount_desc'),
    subtitle: 'Montant décroissant',
    icon: <ArrowUpDown className="h-4 w-4 text-emerald-500" />,
  },
  {
    value: 'amount_asc',
    title: t('admin.pointsTransactions.sort.amount_asc'),
    subtitle: 'Montant croissant',
    icon: <ArrowUpDown className="h-4 w-4 text-amber-500" />,
  },
];

const getTypeConfig = (type: TransactionType) => {
  const configs = {
    earned_subscription: { color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', icon: '🟢' },
    earned_purchase: { color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', icon: '🟢' },
    earned_referral: { color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', icon: '🟢' },
    spent_order: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: '🔴' },
    spent_investment: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: '🔴' },
    adjustment_admin: { color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', icon: '🟡' },
    bonus_welcome: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: '🔵' },
    bonus_milestone: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: '🔵' },
  };
  return configs[type] || configs.adjustment_admin;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

/**
 * Modern shimmer animation for skeleton loading
 */
const shimmerClasses =
  'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent';

/**
 * Transaction Row Skeleton - Table View
 */
const TransactionRowSkeleton: FC = () => (
  <tr className="border-b border-border/50">
    {/* Date */}
    <td className="whitespace-nowrap px-4 py-3">
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <div className={`h-4 w-32 rounded-md bg-muted/30 ${shimmerClasses}`} />
      </div>
    </td>
    {/* User */}
    <td className="px-4 py-3">
      <div className="space-y-1">
        <div className={`h-4 w-36 rounded-md bg-muted/40 ${shimmerClasses}`} />
        <div className={`h-3 w-48 rounded-md bg-muted/30 ${shimmerClasses}`} />
      </div>
    </td>
    {/* Type */}
    <td className="px-4 py-3">
      <div className={`h-6 w-32 rounded-md bg-muted/40 ${shimmerClasses}`} />
    </td>
    {/* Amount */}
    <td className="whitespace-nowrap px-4 py-3 text-right">
      <div className={`ml-auto h-4 w-24 rounded-md bg-muted/40 ${shimmerClasses}`} />
    </td>
    {/* Balance */}
    <td className="whitespace-nowrap px-4 py-3 text-right">
      <div className={`ml-auto h-4 w-24 rounded-md bg-muted/30 ${shimmerClasses}`} />
    </td>
    {/* Description */}
    <td className="max-w-md px-4 py-3">
      <div className="space-y-1">
        <div className={`h-3 w-full rounded-md bg-muted/30 ${shimmerClasses}`} />
        <div className={`h-3 w-3/4 rounded-md bg-muted/30 ${shimmerClasses}`} />
      </div>
    </td>
    {/* Actions */}
    <td className="px-4 py-3">
      <div className="flex justify-center">
        <div className={`h-8 w-8 rounded-md bg-muted/30 ${shimmerClasses}`} />
      </div>
    </td>
  </tr>
);

const PointsTransactionsPage: FC = () => {
  const t = useTranslations();
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<TransactionType[] | undefined>();
  const [sortBy, setSortBy] = useState<SortOption>('created_at_desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState<string | undefined>();
  const [dateTo, setDateTo] = useState<string | undefined>();

  const [isPendingFilters, startFilterTransition] = useTransition();
  const deferredSearch = useDeferredValue(search);

  const queryParams = useMemo(
    () => ({
      limit: pageSize,
      search: deferredSearch || undefined,
      type: selectedTypes && selectedTypes.length > 0 ? selectedTypes : undefined,
      sortBy,
      dateFrom,
      dateTo,
    }),
    [deferredSearch, selectedTypes, sortBy, dateFrom, dateTo]
  );

  const {
    data: transactionsData,
    isPending: isPendingTransactions,
    isFetching,
    isError,
    error,
    refetch,
  } = trpc.admin.pointsTransactions.list.useQuery(queryParams, {
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  const transactions = useMemo(
    () => transactionsData?.items || [],
    [transactionsData?.items]
  );
  const totalTransactions = transactionsData?.total || 0;
  const totalPages = Math.ceil(totalTransactions / pageSize);

  const typeOptions = useMemo(() => createTypeOptions(t), [t]);
  const sortOptions = useMemo(() => createSortOptions(t), [t]);

  const isFilterActive = useMemo(
    () =>
      Boolean(
        deferredSearch ||
          (selectedTypes && selectedTypes.length > 0) ||
          sortBy !== 'created_at_desc' ||
          dateFrom ||
          dateTo
      ),
    [deferredSearch, selectedTypes, sortBy, dateFrom, dateTo]
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
      setSelectedTypes(undefined);
      setSortBy('created_at_desc');
      setCurrentPage(1);
      setDateFrom(undefined);
      setDateTo(undefined);
    });
    void refetch();
  }, [refetch, startFilterTransition]);

  const handleViewDetails = useCallback((transactionId: string) => {
    router.push(`/admin/points-transactions/${transactionId}`);
  }, [router]);

  const getReferenceLink = useCallback((referenceType: string | null, referenceId: string | null) => {
    if (!referenceType || !referenceId) return null;
    
    switch (referenceType) {
      case 'order':
        return `/admin/orders/${referenceId}`;
      case 'investment':
        return `/admin/investments/${referenceId}`;
      case 'subscription':
        return `/admin/subscriptions/${referenceId}`;
      default:
        return null;
    }
  }, []);

  const handlePageChange = useCallback(
    (page: number) => {
      handleFilterChange(() => setCurrentPage(page));
    },
    [handleFilterChange]
  );

  const typeSelectionItems = useMemo(
    () =>
      typeOptions
        .filter(option => option.value !== 'all')
        .map(option => ({ id: option.value, name: option.title })),
    [typeOptions]
  );

  const sortSelectionItems = useMemo(
    () => sortOptions.map(option => ({ id: option.value, name: option.title })),
    [sortOptions]
  );

  return (
    <AdminPageLayout>
      <AdminPageHeader>
        {/* Mobile View */}
        <div className="space-y-3 md:hidden">
          <div className="flex items-center gap-2">
            <AdminPageHeader.Search
              isLoading={isPendingTransactions || isFetching}
              placeholder={t('admin.pointsTransactions.search_placeholder')}
              value={search}
              onChange={setSearch}
            />
            <FilterButton
              isActive={isFilterActive}
              onClick={() => setIsFilterModalOpen(true)}
            />
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden space-y-4 md:block">
          <div className="flex items-center gap-4">
            <div className="max-w-md flex-1">
              <AdminPageHeader.Search
                isLoading={isPendingTransactions || isFetching}
                placeholder={t('admin.pointsTransactions.search_placeholder')}
                value={search}
                onChange={setSearch}
              />
            </div>

            <div className="flex items-center gap-3">
              <CustomSelect
                name="transaction-type-filter"
                contextIcon={<FilterIcon className="h-5 w-5" />}
                className="w-64"
                disabled={isPendingFilters}
                options={typeOptions}
                placeholder={t('admin.pointsTransactions.filters.all_types')}
                value={selectedTypes?.[0] || 'all'}
                onChange={value =>
                  handleFilterChange(() => {
                    if (value === 'all') {
                      setSelectedTypes(undefined);
                    } else {
                      setSelectedTypes([value as TransactionType]);
                    }
                    setCurrentPage(1);
                  })
                }
              />

              <CustomSelect
                name="transaction-sort-filter"
                contextIcon={<ArrowUpDown className="h-5 w-5" />}
                className="w-52"
                disabled={isPendingFilters}
                options={sortOptions}
                placeholder={t('admin.pointsTransactions.filters.sort_by')}
                value={sortBy}
                onChange={value =>
                  handleFilterChange(() => {
                    setSortBy((value as SortOption) ?? 'created_at_desc');
                    setCurrentPage(1);
                  })
                }
              />

              {isFilterActive && (
                <Button
                  className="text-muted-foreground hover:text-foreground h-auto border-dashed px-3 py-2 text-xs"
                  size="sm"
                  variant="outline"
                  onClick={resetFilters}
                >
                  {t('admin.pointsTransactions.filters.clear_filters')}
                </Button>
              )}
            </div>
          </div>

          {/* Date Filters */}
          <div className="flex items-center gap-3">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={dateFrom ? dateFrom.split('T')[0] : ''}
                onChange={(e) =>
                  handleFilterChange(() => {
                    if (e.target.value) {
                      // Début de journée (00:00:00)
                      const date = new Date(e.target.value);
                      date.setHours(0, 0, 0, 0);
                      setDateFrom(date.toISOString());
                    } else {
                      setDateFrom(undefined);
                    }
                    setCurrentPage(1);
                  })
                }
                className={cn(
                  'rounded-lg border border-border bg-surface-1 px-3 py-2 text-sm',
                  'focus:ring-primary/30 focus:border-primary focus:ring-2 focus:outline-none',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
                disabled={isPendingFilters}
                placeholder={t('admin.pointsTransactions.filters.date_from')}
              />
              <span className="text-muted-foreground">→</span>
              <input
                type="date"
                value={dateTo ? dateTo.split('T')[0] : ''}
                onChange={(e) =>
                  handleFilterChange(() => {
                    if (e.target.value) {
                      // Fin de journée (23:59:59)
                      const date = new Date(e.target.value);
                      date.setHours(23, 59, 59, 999);
                      setDateTo(date.toISOString());
                    } else {
                      setDateTo(undefined);
                    }
                    setCurrentPage(1);
                  })
                }
                className={cn(
                  'rounded-lg border border-border bg-surface-1 px-3 py-2 text-sm',
                  'focus:ring-primary/30 focus:border-primary focus:ring-2 focus:outline-none',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
                disabled={isPendingFilters}
                placeholder={t('admin.pointsTransactions.filters.date_to')}
              />
            </div>
          </div>
        </div>
      </AdminPageHeader>

      <AdminPageLayout.Content>
        {isError ? (
          <EmptyState
            icon={XCircle}
            title={t('admin.pointsTransactions.error.loading_title')}
            description={
              error?.message || t('admin.pointsTransactions.error.loading_description')
            }
            variant="muted"
            action={
              <Button size="sm" variant="outline" onClick={() => refetch()}>
                {t('admin.pointsTransactions.error.retry')}
              </Button>
            }
          />
        ) : isPendingTransactions ? (
          <div className="overflow-hidden rounded-lg border border-border bg-surface-1">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {t('admin.pointsTransactions.columns.date')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {t('admin.pointsTransactions.columns.user')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {t('admin.pointsTransactions.columns.type')}
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {t('admin.pointsTransactions.columns.amount')}
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {t('admin.pointsTransactions.columns.balance')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {t('admin.pointsTransactions.columns.description')}
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {t('admin.pointsTransactions.columns.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <TransactionRowSkeleton key={i} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : transactions.length === 0 ? (
          <EmptyState
            icon={Coins}
            title={t('admin.pointsTransactions.empty_state.title')}
            description={t('admin.pointsTransactions.empty_state.description')}
            variant="muted"
            action={
              <Button size="sm" variant="outline" onClick={resetFilters}>
                {t('admin.pointsTransactions.filters.clear_filters')}
              </Button>
            }
          />
        ) : (
          <div className="overflow-hidden rounded-lg border border-border bg-surface-1">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {t('admin.pointsTransactions.columns.date')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {t('admin.pointsTransactions.columns.user')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {t('admin.pointsTransactions.columns.type')}
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {t('admin.pointsTransactions.columns.amount')}
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {t('admin.pointsTransactions.columns.balance')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {t('admin.pointsTransactions.columns.description')}
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {t('admin.pointsTransactions.columns.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {transactions.map((transaction: any) => {
                    const typeConfig = getTypeConfig(transaction.type);
                    const isPositive = transaction.amount > 0;
                    
                    return (
                      <tr
                        key={transaction.id}
                        className="transition-colors hover:bg-muted/20"
                      >
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-foreground/80">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {formatDate(transaction.created_at)}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm">
                            <div className="font-medium text-foreground">
                              {transaction.users?.user_profiles?.first_name
                                ? `${transaction.users.user_profiles.first_name} ${transaction.users.user_profiles?.last_name || ''}`
                                : transaction.users?.email || 'N/A'}
                            </div>
                            {transaction.users?.user_profiles?.first_name && (
                              <div className="text-xs text-muted-foreground">
                                {transaction.users.email}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              'inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium',
                              typeConfig.color
                            )}
                          >
                            <span>{typeConfig.icon}</span>
                            {t(`admin.pointsTransactions.types.${transaction.type}`)}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                          <span
                            className={cn(
                              'font-semibold',
                              isPositive
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-red-600 dark:text-red-400'
                            )}
                          >
                            {isPositive ? '+' : ''}
                            {transaction.amount.toLocaleString()} pts
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium text-foreground">
                          {transaction.balance_after.toLocaleString()} pts
                        </td>
                        <td className="max-w-md px-4 py-3 text-sm">
                          <div className="space-y-1">
                            <div className="line-clamp-2 text-foreground/70">
                              {transaction.description || '—'}
                            </div>
                            {transaction.reference_id && transaction.reference_type && (
                              <Link
                                href={getReferenceLink(transaction.reference_type, transaction.reference_id) || '#'}
                                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                              >
                                <ExternalLink className="h-3 w-3" />
                                {t(`admin.pointsTransactions.references.${transaction.reference_type}`)}
                              </Link>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                  <span className="sr-only">{t('admin.pointsTransactions.actions.open_menu')}</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewDetails(transaction.id)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  {t('admin.pointsTransactions.actions.view_details')}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {totalTransactions > pageSize && (
          <div className="mt-6">
            <AdminPagination
              pagination={{
                currentPage,
                pageSize,
                totalItems: totalTransactions,
                totalPages,
              }}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </AdminPageLayout.Content>

      {/* Mobile Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      >
        <Filters>
          <Filters.Selection
            allLabel={t('admin.pointsTransactions.filters.all_types')}
            items={typeSelectionItems}
            label={t('admin.pointsTransactions.columns.type')}
            selectedId={selectedTypes?.[0]}
            onSelectionChange={id =>
              handleFilterChange(() => {
                if (id) {
                  setSelectedTypes([id as TransactionType]);
                } else {
                  setSelectedTypes(undefined);
                }
                setCurrentPage(1);
              })
            }
          />

          <Filters.Selection
            allLabel={t('admin.pointsTransactions.sort.newest')}
            items={sortSelectionItems}
            label={t('admin.pointsTransactions.filters.sort_by')}
            selectedId={sortBy}
            onSelectionChange={id =>
              handleFilterChange(() => {
                setSortBy((id as SortOption) || 'created_at_desc');
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
                {t('admin.pointsTransactions.filters.clear_filters')}
              </Button>
            </div>
          )}
        </Filters>
      </FilterModal>
    </AdminPageLayout>
  );
};

export default PointsTransactionsPage;
