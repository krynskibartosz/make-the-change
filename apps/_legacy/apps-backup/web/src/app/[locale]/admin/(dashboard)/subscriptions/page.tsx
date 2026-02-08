'use client';

import {
  CreditCard,
  User,
  Calendar,
  DollarSign,
  ArrowUpDown,
  Circle,
  CheckCircle,
  PauseCircle,
  XCircle,
  Zap,
  Star,
  Plus,
} from 'lucide-react';
import Link from 'next/link';
import {
  useCallback,
  useDeferredValue,
  useEffect,
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
import { DataList } from '@make-the-change/core/ui';
import { EmptyState } from '@make-the-change/core/ui';
import {
  ViewToggle,
  type ViewMode,
} from '@/app/[locale]/admin/(dashboard)/components/ui/view-toggle';
import { SubscriptionListItem } from '@/app/[locale]/admin/(dashboard)/components/subscriptions/subscription-list-item';
import { Button } from '@/components/ui/button';
import {
  CustomSelect,
  type SelectOption as CustomSelectOption,
} from '@/components/ui/custom-select';
import { useToast } from '@/hooks/use-toast';
import { trpc } from '@/lib/trpc';
import type { Subscription } from '@/lib/types/subscription';

const pageSize = 20;

type SubscriptionStatus = 'active' | 'cancelled' | 'paused' | 'expired';
type SubscriptionTier = 'ambassadeur_standard' | 'ambassadeur_premium';

type SortOption =
  | 'created_at_desc'
  | 'created_at_asc'
  | 'next_billing_desc'
  | 'next_billing_asc'
  | 'amount_desc'
  | 'amount_asc';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(amount || 0);
};

const formatDate = (value: string | null | undefined) => {
  if (!value) return 'Date inconnue';
  return new Date(value).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatStatusLabel = (status: SubscriptionStatus | undefined) => {
  switch (status) {
    case 'active':
      return 'Actif';
    case 'paused':
      return 'En pause';
    case 'cancelled':
      return 'Annulé';
    case 'expired':
      return 'Expiré';
    default:
      return 'Tous les statuts';
  }
};

const formatTierLabel = (tier: SubscriptionTier | undefined) => {
  switch (tier) {
    case 'ambassadeur_premium':
      return 'Ambassadeur Premium';
    case 'ambassadeur_standard':
      return 'Ambassadeur Standard';
    default:
      return 'Tous les niveaux';
  }
};

const statusOptions: CustomSelectOption[] = [
  {
    value: 'all',
    title: 'Tous les statuts',
    subtitle: 'Inclure toutes les souscriptions',
    icon: <Circle className="h-4 w-4 text-muted-foreground" />,
  },
  {
    value: 'active',
    title: 'Actif',
    subtitle: 'Facturation en cours',
    icon: <CheckCircle className="h-4 w-4 text-emerald-500" />,
  },
  {
    value: 'paused',
    title: 'En pause',
    subtitle: 'Suspendu temporairement',
    icon: <PauseCircle className="h-4 w-4 text-amber-500" />,
  },
  {
    value: 'cancelled',
    title: 'Annulé',
    subtitle: 'Résilié par l’utilisateur',
    icon: <XCircle className="h-4 w-4 text-destructive" />,
  },
  {
    value: 'expired',
    title: 'Expiré',
    subtitle: 'Fin de période atteinte',
    icon: <Circle className="h-4 w-4 text-muted-foreground" />,
  },
];

const tierOptions: CustomSelectOption[] = [
  {
    value: 'all',
    title: 'Tous les niveaux',
    subtitle: 'Inclure tous les abonnements',
    icon: <Circle className="h-4 w-4 text-muted-foreground" />,
  },
  {
    value: 'ambassadeur_standard',
    title: 'Ambassadeur Standard',
    subtitle: 'Formule découverte',
    icon: <Star className="h-4 w-4 text-blue-500" />,
  },
  {
    value: 'ambassadeur_premium',
    title: 'Ambassadeur Premium',
    subtitle: 'Formule complète',
    icon: <Star className="h-4 w-4 text-amber-500" />,
  },
];

const sortOptions: CustomSelectOption[] = [
  {
    value: 'created_at_desc',
    title: 'Plus récents',
    subtitle: 'Création la plus récente',
    icon: <ArrowUpDown className="h-4 w-4 text-primary" />,
  },
  {
    value: 'created_at_asc',
    title: 'Plus anciens',
    subtitle: 'Création la plus ancienne',
    icon: <ArrowUpDown className="h-4 w-4 text-primary rotate-180" />,
  },
  {
    value: 'next_billing_desc',
    title: 'Facturation à venir',
    subtitle: 'Prochaine échéance la plus proche',
    icon: <Calendar className="h-4 w-4 text-purple-500" />,
  },
  {
    value: 'next_billing_asc',
    title: 'Facturation la plus distante',
    subtitle: 'Échéance la plus tardive',
    icon: <Calendar className="h-4 w-4 text-purple-500 rotate-180" />,
  },
  {
    value: 'amount_desc',
    title: 'Montant décroissant',
    subtitle: 'Montants mensuels les plus élevés',
    icon: <DollarSign className="h-4 w-4 text-emerald-500" />,
  },
  {
    value: 'amount_asc',
    title: 'Montant croissant',
    subtitle: 'Montants mensuels les plus faibles',
    icon: <DollarSign className="h-4 w-4 text-amber-500" />,
  },
];

const statusSelectionItems = statusOptions
  .filter(option => option.value !== 'all')
  .map(option => ({ id: option.value, name: option.title }));

const tierSelectionItems = tierOptions
  .filter(option => option.value !== 'all')
  .map(option => ({ id: option.value, name: option.title }));

const sortSelectionItems = sortOptions.map(option => ({
  id: option.value,
  name: option.title,
}));

const SubscriptionCard = ({
  subscription,
  onToggleStatus,
  disableActions,
}: {
  subscription: Subscription;
  onToggleStatus: (subscription: Subscription) => void;
  disableActions: boolean;
}) => {
  const customerName = subscription.users?.user_profiles
    ? `${subscription.users.user_profiles.first_name ?? ''} ${subscription.users.user_profiles.last_name ?? ''}`.trim() ||
      subscription.users?.email ||
      'Utilisateur inconnu'
    : subscription.users?.email || 'Utilisateur inconnu';

  const status = subscription.status as SubscriptionStatus;
  const statusLabel = formatStatusLabel(status);
  const tierLabel = formatTierLabel(subscription.subscription_tier);
  const frequencyLabel = subscription.billing_frequency === 'monthly' ? 'Mensuel' : 'Annuel';

  const gradientClasses = {
    active: 'from-emerald-500/20 to-emerald-500/40',
    paused: 'from-amber-500/20 to-amber-500/40',
    cancelled: 'from-rose-500/20 to-rose-500/40',
    expired: 'from-slate-500/15 to-slate-500/30',
  } as Record<SubscriptionStatus, string>;

  const badgeClass = {
    active: 'badge-success',
    paused: 'badge-warning',
    cancelled: 'badge-destructive',
    expired: 'badge-muted',
  } as Record<SubscriptionStatus, string>;

  const nextActionLabel = status === 'active' ? 'Mettre en pause' : 'Réactiver';
  const amountLabel = `${formatCurrency(subscription.amount_eur)} / ${frequencyLabel === 'Mensuel' ? 'mois' : 'an'}`;

  return (
    <DataCard href={`/admin/subscriptions/${subscription.id}`} className="!overflow-visible">
      <DataCard.Header className="pb-0 !block !overflow-visible">
        <div className="relative -mx-6 -mt-6 overflow-visible rounded-t-xl">
          <div
            className={`relative h-36 w-full overflow-hidden rounded-t-xl bg-gradient-to-br ${gradientClasses[status] || gradientClasses.expired}`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent" />
            <div className="absolute bottom-4 left-6 right-4 flex items-end justify-between gap-3">
              <div className="bg-background/90 text-foreground flex items-center gap-2 rounded-full border border-border/60 px-3 py-1 text-xs font-medium shadow">
                <Zap className="h-3.5 w-3.5 text-primary" />
                {tierLabel}
              </div>
              <div className="bg-background/80 text-muted-foreground flex items-center gap-2 rounded-full border border-border/50 px-3 py-1 text-xs shadow">
                <Calendar className="h-3.5 w-3.5" />
                Prochaine échéance : {formatDate(subscription.next_billing_date)}
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-6 z-20 flex translate-y-1/2 items-center gap-3">
            <div className="from-primary/20 to-primary/40 flex h-16 w-16 items-center justify-center rounded-full border-4 border-background bg-gradient-to-br shadow-xl">
              <CreditCard className="text-primary h-7 w-7" />
            </div>
          </div>
        </div>
      </DataCard.Header>
      <DataCard.Content className="relative z-10">
        <div className="pt-14 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-lg font-semibold leading-tight text-foreground">
              {customerName}
            </h3>
            <span className={`${badgeClass[status]} capitalize`}>{statusLabel}</span>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <span>{subscription.users?.email ?? 'Email inconnu'}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-500" />
              <span>{amountLabel}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-500" />
              <span>Début : {formatDate(subscription.start_date)}</span>
            </div>
          </div>
        </div>
      </DataCard.Content>
      <DataCard.Footer>
        <div className="flex w-full items-center justify-between gap-3">
          <Button
            size="sm"
            variant="outline"
            disabled={disableActions || status === 'cancelled' || status === 'expired'}
            onClick={e => {
              e.preventDefault();
              onToggleStatus(subscription);
            }}
          >
            {nextActionLabel}
          </Button>
          <span className="text-muted-foreground text-xs">ID {subscription.id.slice(0, 8)}</span>
        </div>
      </DataCard.Footer>
    </DataCard>
  );
};

/**
 * Modern shimmer animation for skeleton loading
 */
const shimmerClasses =
  'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent';

const SubscriptionCardSkeleton = () => (
  <DataCard className="!overflow-visible">
    <DataCard.Header className="pb-0 !block !overflow-visible">
      <div className="relative -mx-6 -mt-6 overflow-visible rounded-t-xl">
        {/* Cover gradient placeholder */}
        <div className="relative h-36 w-full overflow-hidden rounded-t-xl">
          <div className={`bg-gradient-to-br from-primary/20 to-primary/40 h-full w-full ${shimmerClasses}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent" />
          
          {/* Badges on cover */}
          <div className="absolute bottom-4 left-6 right-4 flex items-end justify-between gap-3">
            <div className={`h-7 w-32 rounded-full bg-background/80 border border-border/60 ${shimmerClasses}`} />
            <div className={`h-7 w-48 rounded-full bg-background/80 border border-border/50 ${shimmerClasses}`} />
          </div>
        </div>

        {/* Avatar positioned below cover */}
        <div className="absolute bottom-0 left-6 z-20 flex translate-y-1/2 items-center gap-3">
          <div className="relative h-16 w-16 overflow-hidden rounded-full border-4 border-background shadow-xl">
            <div className={`bg-primary/20 flex h-full w-full items-center justify-center ${shimmerClasses}`}>
              <CreditCard className="text-primary h-7 w-7" />
            </div>
          </div>
        </div>
      </div>
    </DataCard.Header>

    <DataCard.Content className="relative z-10">
      <div className="pt-14 space-y-3">
        {/* Title and badge */}
        <div className="flex items-center justify-between gap-2">
          <div className={`h-5 w-3/4 rounded-md bg-muted/40 ${shimmerClasses}`} />
          <div className={`h-6 w-16 rounded-full bg-muted/40 ${shimmerClasses}`} />
        </div>

        {/* Info lines */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <div className={`h-3.5 w-48 rounded-md bg-muted/30 ${shimmerClasses}`} />
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-emerald-500" />
            <div className={`h-3.5 w-36 rounded-md bg-muted/30 ${shimmerClasses}`} />
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-purple-500" />
            <div className={`h-3.5 w-32 rounded-md bg-muted/30 ${shimmerClasses}`} />
          </div>
        </div>
      </div>
    </DataCard.Content>

    <DataCard.Footer>
      <div className="flex w-full items-center justify-between gap-3">
        <div className={`h-8 w-28 rounded-md bg-muted/40 ${shimmerClasses}`} />
        <div className={`h-4 w-20 rounded-md bg-muted/30 ${shimmerClasses}`} />
      </div>
    </DataCard.Footer>
  </DataCard>
);

const SubscriptionListSkeleton = () => (
  <div className="rounded-xl border border-border/40 bg-surface-1 p-4 shadow-sm">
    <div className="flex items-center justify-between gap-4">
      {/* Left side with avatar and info */}
      <div className="flex items-center gap-3 flex-1">
        <div className="flex-shrink-0">
          <div className={`bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full ${shimmerClasses}`}>
            <CreditCard className="text-primary h-5 w-5" />
          </div>
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3">
            <div className={`h-5 w-48 rounded-md bg-muted/40 ${shimmerClasses}`} />
            <div className={`h-5 w-20 rounded-full bg-muted/40 ${shimmerClasses}`} />
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              <div className={`h-3.5 w-36 rounded-md bg-muted/30 ${shimmerClasses}`} />
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
              <div className={`h-3.5 w-24 rounded-md bg-muted/30 ${shimmerClasses}`} />
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-purple-500" />
              <div className={`h-3.5 w-32 rounded-md bg-muted/30 ${shimmerClasses}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Right side with action button */}
      <div className="flex-shrink-0">
        <div className={`h-8 w-28 rounded-md bg-muted/40 ${shimmerClasses}`} />
      </div>
    </div>
  </div>
);

const AdminSubscriptionsPage = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<SubscriptionStatus | 'all' | undefined>();
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | 'all' | undefined>();
  const [sortBy, setSortBy] = useState<SortOption>('created_at_desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState<ViewMode>('grid');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isPendingFilters, startFilterTransition] = useTransition();

  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    setCurrentPage(1);
  }, [deferredSearch]);

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      limit: pageSize,
      search: deferredSearch || undefined,
      status: selectedStatus && selectedStatus !== 'all' ? selectedStatus : undefined,
      subscriptionTier: selectedTier && selectedTier !== 'all' ? selectedTier : undefined,
      sortBy,
    }),
    [currentPage, deferredSearch, selectedStatus, selectedTier, sortBy]
  );

  const {
    data: subscriptionsData,
    isPending: isPendingSubscriptions,
    isFetching,
    isError,
    error,
    refetch,
  } = trpc.admin.subscriptions.list.useQuery(queryParams, {
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  const utils = trpc.useUtils();

  const updateSubscription = trpc.admin.subscriptions.update.useMutation({
    onSuccess: () => {
      toast({ variant: 'success', title: 'Abonnement mis à jour' });
      void utils.admin.subscriptions.list.invalidate();
    },
    onError: err => {
      toast({ variant: 'destructive', title: 'Impossible de mettre à jour', description: err.message });
    },
  });

  const subscriptions = useMemo(
    () => subscriptionsData?.items ?? [],
    [subscriptionsData?.items]
  );

  const totalSubscriptions = subscriptionsData?.total ?? subscriptions.length;
  const totalPages = subscriptionsData?.totalPages ?? Math.max(1, Math.ceil(totalSubscriptions / pageSize));

  const isFilterActive = useMemo(
    () =>
      Boolean(
        deferredSearch ||
          (selectedStatus && selectedStatus !== 'all') ||
          (selectedTier && selectedTier !== 'all') ||
          sortBy !== 'created_at_desc'
      ),
    [deferredSearch, selectedStatus, selectedTier, sortBy]
  );

  const handleFilterChange = useCallback(
    (fn: () => void) => {
      startFilterTransition(fn);
    },
    [startFilterTransition]
  );

  const resetFilters = useCallback(() => {
    startFilterTransition(() => {
      setSearch('');
      setSelectedStatus(undefined);
      setSelectedTier(undefined);
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

  const handleToggleStatus = useCallback(
    (subscription: Subscription) => {
      const nextStatus: SubscriptionStatus = subscription.status === 'active' ? 'paused' : 'active';
      updateSubscription.mutate({
        subscriptionId: subscription.id,
        patch: { status: nextStatus },
      });
    },
    [updateSubscription]
  );

  const emptyState = {
    icon: CreditCard,
    title: 'Aucun abonnement trouvé',
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
              isLoading={isPendingSubscriptions || isFetching}
              placeholder="Rechercher un abonnement"
              value={search}
              onChange={setSearch}
            />
            <FilterButton
              isActive={isFilterActive}
              onClick={() => setIsFilterModalOpen(true)}
            />
          </div>
          <Link className="w-full" href="/admin/subscriptions/new">
            <Button className="w-full" size="sm" variant="accent">
              Nouvel abonnement
            </Button>
          </Link>
        </div>

        <div className="hidden space-y-4 md:block">
          <div className="flex items-center gap-4">
            <div className="max-w-md flex-1">
              <AdminPageHeader.Search
                isLoading={isPendingSubscriptions || isFetching}
                placeholder="Rechercher un abonnement"
                value={search}
                onChange={setSearch}
              />
            </div>
            <div className="flex items-center gap-3">
              <Link href="/admin/subscriptions/new">
                <Button className="flex items-center gap-2" size="sm">
                  <Plus className="h-4 w-4" />
                  Nouvel abonnement
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-1 flex-wrap items-center gap-3">
              <CustomSelect
                name="subscription-status-filter"
                contextIcon={<CheckCircle className="h-5 w-5" />}
                className="w-56"
                disabled={isPendingFilters}
                options={statusOptions}
                placeholder="Statut d’abonnement"
                value={selectedStatus || 'all'}
                onChange={value =>
                  handleFilterChange(() => {
                    setSelectedStatus((value as SubscriptionStatus | 'all') ?? undefined);
                    setCurrentPage(1);
                  })
                }
              />

              <CustomSelect
                name="subscription-tier-filter"
                contextIcon={<Star className="h-5 w-5" />}
                className="w-56"
                disabled={isPendingFilters}
                options={tierOptions}
                placeholder="Niveau"
                value={selectedTier || 'all'}
                onChange={value =>
                  handleFilterChange(() => {
                    setSelectedTier((value as SubscriptionTier | 'all') ?? undefined);
                    setCurrentPage(1);
                  })
                }
              />

              <CustomSelect
                name="subscription-sort-filter"
                contextIcon={<ArrowUpDown className="h-5 w-5" />}
                className="w-56"
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
            description={error?.message ?? 'Impossible de charger les abonnements.'}
            variant="muted"
            action={
              <Button size="sm" variant="outline" onClick={() => refetch()}>
                Réessayer
              </Button>
            }
          />
        ) : (
          <DataList
            isLoading={isPendingSubscriptions}
            items={subscriptions}
            variant={view}
            emptyState={emptyState}
            renderItem={subscription =>
              view === 'grid' ? (
                <SubscriptionCard
                  subscription={subscription}
                  disableActions={updateSubscription.isPending}
                  onToggleStatus={handleToggleStatus}
                />
              ) : (
                <SubscriptionListItem
                  subscription={subscription}
                  actions={
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={
                        updateSubscription.isPending ||
                        subscription.status === 'cancelled' ||
                        subscription.status === 'expired'
                      }
                      onClick={e => {
                        e.preventDefault();
                        handleToggleStatus(subscription);
                      }}
                    >
                      {subscription.status === 'active' ? 'Mettre en pause' : 'Réactiver'}
                    </Button>
                  }
                />
              )
            }
            renderSkeleton={() =>
              view === 'grid' ? (
                <SubscriptionCardSkeleton />
              ) : (
                <SubscriptionListSkeleton />
              )
            }
          />
        )}

        {totalSubscriptions > pageSize && (
          <AdminPagination
            pagination={{
              currentPage,
              pageSize,
              totalItems: totalSubscriptions,
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
                setSelectedStatus((id as SubscriptionStatus | 'all') ?? undefined);
                setCurrentPage(1);
              })
            }
          />

          <Filters.Selection
            allLabel="Tous les niveaux"
            items={tierSelectionItems}
            label="Niveau"
            selectedId={selectedTier}
            onSelectionChange={id =>
              handleFilterChange(() => {
                setSelectedTier((id as SubscriptionTier | 'all') ?? undefined);
                setCurrentPage(1);
              })
            }
          />

          <Filters.Selection
            allLabel="Tri par défaut"
            items={sortSelectionItems}
            label="Trier par"
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

export default AdminSubscriptionsPage;
