'use client';
import {
  User as UserIcon,
  Plus,
  CheckCircle,
  XCircle,
  Circle,
  Shield,
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
import { User } from '@/app/[locale]/admin/(dashboard)/users/components/user';
import {
  UserCardSkeleton,
  UserListSkeleton,
} from '@/app/[locale]/admin/(dashboard)/users/components/user-card-skeleton';
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
    title: t('admin.users.filters.all_statuses'),
    subtitle: 'Tous les utilisateurs',
    icon: <Circle className="h-4 w-4 text-muted-foreground" />,
  },
  {
    value: 'active',
    title: t('admin.users.filters.status_active'),
    subtitle: 'Utilisateurs actifs',
    icon: <CheckCircle className="h-4 w-4 text-success" />,
  },
  {
    value: 'inactive',
    title: t('admin.users.filters.status_inactive'),
    subtitle: 'Utilisateurs inactifs',
    icon: <XCircle className="h-4 w-4 text-muted-foreground" />,
  },
];

/**
 * Crée les options riches pour le filtre de rôle
 */
const createRoleOptions = (t: (key: string) => string): CustomSelectOption[] => [
  {
    value: 'all',
    title: t('admin.users.filters.all_roles'),
    subtitle: 'Tous les niveaux',
    icon: <Circle className="h-4 w-4 text-muted-foreground" />,
  },
  {
    value: 'explorateur',
    title: 'Explorateur',
    subtitle: 'Niveau 1 - Exploration',
    icon: <UserIcon className="h-4 w-4 text-muted-foreground" />,
  },
  {
    value: 'protecteur',
    title: 'Protecteur',
    subtitle: 'Niveau 2 - Investissements',
    icon: <Shield className="h-4 w-4 text-primary" />,
  },
  {
    value: 'ambassadeur',
    title: 'Ambassadeur',
    subtitle: 'Niveau 3 - Subscriptions',
    icon: <Shield className="h-4 w-4 text-accent" />,
  },
];

/**
 * Crée les options riches pour le filtre de tri
 */
const createSortOptions = (t: (key: string) => string): CustomSelectOption[] => [
  {
    value: 'created_at_desc',
    title: t('admin.users.sort.newest'),
    subtitle: 'Plus récents en premier',
    icon: <TrendingDown className="h-4 w-4 text-primary" />,
  },
  {
    value: 'created_at_asc',
    title: t('admin.users.sort.oldest'),
    subtitle: 'Plus anciens en premier',
    icon: <TrendingUp className="h-4 w-4 text-primary" />,
  },
  {
    value: 'name_asc',
    title: t('admin.users.sort.name_asc'),
    subtitle: 'Ordre alphabétique A-Z',
    icon: <SortAsc className="h-4 w-4 text-primary" />,
  },
  {
    value: 'name_desc',
    title: t('admin.users.sort.name_desc'),
    subtitle: 'Ordre alphabétique Z-A',
    icon: <SortDesc className="h-4 w-4 text-primary" />,
  },
];

const getSortSelectionItems = (t: (key: string) => string) =>
  createSortOptions(t).map(option => ({
    id: option.value,
    name: option.title,
  }));

const UsersPage: FC = () => {
  const t = useTranslations();

  const [search, setSearch] = useState('');
  const [activeOnly, setActiveOnly] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>();
  const [selectedRole, setSelectedRole] = useState<string | undefined>();
  const [sortBy, setSortBy] = useState<SortOption>('created_at_desc');
  const [cursor, setCursor] = useState<string | undefined>();
  const [view, setView] = useState<ViewMode>('grid');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const [isPendingFilters, startFilterTransition] = useTransition();
  const deferredSearch = useDeferredValue(search);

  const statusFilter = useMemo(() => {
    if (selectedStatus && selectedStatus !== 'all') {
      return selectedStatus as 'active' | 'inactive';
    }
    if (activeOnly) {
      return 'active';
    }
    return undefined;
  }, [selectedStatus, activeOnly]);

  const queryParams = useMemo(
    () => ({
      cursor,
      q: deferredSearch || undefined,
      role: selectedRole === 'all' ? undefined : selectedRole,
      status: statusFilter,
      sortBy: sortBy || undefined,
      limit: pageSize,
    }),
    [cursor, deferredSearch, selectedRole, statusFilter, sortBy]
  );

  const {
    data: usersData,
    isPending: isPendingUsers,
    isFetching,
    isError,
    error,
    refetch,
  } = trpc.admin.users.list.useQuery(queryParams, {
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  const users = useMemo(
    () => usersData?.items || [],
    [usersData?.items]
  );
  const totalUsers = usersData?.total || 0;
  const totalPages = Math.ceil(totalUsers / pageSize);

  const isFilterActive = useMemo(
    () =>
      !!(
        deferredSearch ||
        activeOnly ||
        (selectedStatus && selectedStatus !== 'all') ||
        (selectedRole && selectedRole !== 'all') ||
        (sortBy && sortBy !== 'created_at_desc')
      ),
    [deferredSearch, activeOnly, selectedStatus, selectedRole, sortBy]
  );

  const roleOptions = useMemo(
    (): CustomSelectOption[] => createRoleOptions(t),
    [t]
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
          selectedRole ||
          sortBy !== 'created_at_desc'
      ),
    [search, activeOnly, selectedStatus, selectedRole, sortBy]
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
      setSelectedRole(undefined);
      setSortBy('created_at_desc');
      setCursor(undefined);
    });
    refetch();
  }, [refetch, startFilterTransition]);

  const statusesForSelection = useMemo(
    () => [
      { id: 'active', name: t('admin.users.filters.status_active') },
      { id: 'inactive', name: t('admin.users.filters.status_inactive') },
    ],
    [t]
  );

  const rolesForSelection = useMemo(
    () => [
      { id: 'explorateur', name: 'Explorateur' },
      { id: 'protecteur', name: 'Protecteur' },
      { id: 'ambassadeur', name: 'Ambassadeur' },
    ],
    []
  );

  return (
    <AdminPageLayout>
      <AdminPageHeader>
        <div className="space-y-3 md:hidden">
          <div className="flex items-center gap-2">
            <AdminPageHeader.Search
              isLoading={isPendingUsers || isFetching}
              placeholder={t('admin.users.search_placeholder')}
              value={search}
              onChange={setSearch}
            />
            <FilterButton
              isActive={isFilterActive}
              onClick={() => setIsFilterModalOpen(true)}
            />
          </div>
          <LocalizedLink className="w-full" href="/admin/users/new">
            <Button className="w-full" size="sm" variant="accent">
              {t('admin.users.new_user')}
            </Button>
          </LocalizedLink>
        </div>

        <div className="hidden space-y-4 md:block">
          <div className="flex items-center gap-4">
            <div className="max-w-md flex-1">
              <AdminPageHeader.Search
                isLoading={isPendingUsers || isFetching}
                placeholder={t('admin.users.search_placeholder')}
                value={search}
                onChange={setSearch}
              />
            </div>
            <div className="flex items-center gap-3">
              <LocalizedLink className="w-full" href="/admin/users/new">
                <Button className="w-full" icon={<Plus />} size="sm">
                  {t('admin.users.new_user')}
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
                placeholder={t('admin.users.filters.status')}
                value={selectedStatus || 'all'}
                onChange={value =>
                  handleFilterChange(() =>
                    setSelectedStatus(value === 'all' ? undefined : value)
                  )
                }
              />

              <CustomSelect
                name="role_filter"
                contextIcon={<Shield className="h-5 w-5" />}
                className="w-56"
                disabled={isPendingFilters}
                options={roleOptions}
                placeholder={t('admin.users.filters.role')}
                value={selectedRole || 'all'}
                onChange={value =>
                  handleFilterChange(() =>
                    setSelectedRole(value === 'all' ? undefined : value)
                  )
                }
              />

              <CustomSelect
                name="sort_filter"
                contextIcon={<ArrowUpDown className="h-5 w-5" />}
                className="w-52"
                disabled={isPendingFilters}
                options={sortOptions}
                placeholder={t('admin.users.filters.sort_by')}
                value={sortBy}
                onChange={value =>
                  handleFilterChange(() => setSortBy(value as SortOption))
                }
              />

              <CheckboxWithLabel
                checked={activeOnly}
                disabled={isPendingFilters}
                label={t('admin.users.filters.active_only')}
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
                  {t('admin.users.filters.clear_filters')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </AdminPageHeader>

      <AdminPageLayout.Content>
        {isError ? (
          <EmptyState
            icon={UserIcon}
            title={t('admin.users.error.loading_title')}
            variant="muted"
            action={
              <Button size="sm" variant="outline" onClick={() => refetch()}>
                {t('admin.users.error.retry')}
              </Button>
            }
            description={
              error?.message || t('admin.users.error.loading_description')
            }
          />
        ) : (
          <DataList
            isLoading={isPendingUsers}
            items={users}
            variant={view === 'map' ? 'grid' : view}
            emptyState={{
              icon: UserIcon,
              title: t('admin.users.empty_state.title'),
              description: t('admin.users.empty_state.description'),
              action: (
                <Button size="sm" variant="outline" onClick={resetFilters}>
                  {t('admin.users.filters.reset')}
                </Button>
              ),
            }}
            renderItem={user => (
              <User
                key={user.id}
                user={user}
                view={view === 'map' ? 'grid' : view}
                queryParams={queryParams}
                onFilterChange={{
                  setStatus: (status: string) =>
                    handleFilterChange(() => setSelectedStatus(status)),
                  setRole: (role: string) =>
                    handleFilterChange(() => setSelectedRole(role)),
                }}
              />
            )}
            renderSkeleton={() =>
              view === 'grid' ? (
                <UserCardSkeleton />
              ) : (
                <UserListSkeleton />
              )
            }
          />
        )}

        {totalUsers > pageSize && (
          <div className="mt-6">
            <AdminPagination
              pagination={{
                currentPage: Math.max(
                  1,
                  Math.floor((totalUsers - users.length) / pageSize) + 1
                ),
                pageSize,
                totalItems: totalUsers,
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
            label={t('admin.users.filters.sort_by')}
            selectedId={sortBy}
            onSelectionChange={id =>
              handleFilterChange(() =>
                setSortBy((id || 'created_at_desc') as SortOption)
              )
            }
          />

          <Filters.Selection
            allLabel={t('admin.users.filters.all_statuses')}
            items={statusesForSelection}
            label={t('admin.users.filter_modal.status')}
            selectedId={selectedStatus}
            onSelectionChange={id =>
              handleFilterChange(() => setSelectedStatus(id))
            }
          />

          <Filters.Selection
            allLabel={t('admin.users.filters.all_roles')}
            items={rolesForSelection}
            label={t('admin.users.filter_modal.role')}
            selectedId={selectedRole}
            onSelectionChange={id =>
              handleFilterChange(() => setSelectedRole(id))
            }
          />

          <Filters.Toggle
            checked={activeOnly}
            label={t('admin.users.filter_modal.active_only_description')}
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
                {t('admin.users.filters.clear_all_filters')}
              </Button>
            </div>
          )}
        </Filters>
      </FilterModal>
    </AdminPageLayout>
  );
};

export default UsersPage;
