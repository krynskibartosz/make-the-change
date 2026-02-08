'use client';
import {
  FileText,
  Plus,
  TrendingDown,
  TrendingUp,
  SortAsc,
  SortDesc,
  User,
  Folder,
  Eye,
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
import {
  ViewToggle,
  type ViewMode,
} from '@/app/[locale]/admin/(dashboard)/components/ui/view-toggle';
import { BlogPost } from '@/app/[locale]/admin/(dashboard)/blog/components/blog-post';
import {
  BlogPostCardSkeleton,
  BlogPostListSkeleton,
} from '@/app/[locale]/admin/(dashboard)/blog/components/blog-post-card-skeleton';
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
  | 'published_at_desc'
  | 'published_at_asc'
  | 'title_asc'
  | 'title_desc'
  | 'view_count_desc'
  | 'view_count_asc';

type StatusFilter = 'all' | 'draft' | 'published' | 'archived';

const createStatusOptions = (t: (key: string) => string): CustomSelectOption[] => [
  {
    value: 'all',
    title: 'Tous les statuts',
    subtitle: 'Afficher tous les articles',
    icon: <FileText className="h-4 w-4 text-muted-foreground" />,
  },
  {
    value: 'published',
    title: 'Publiés',
    subtitle: 'Articles visibles publiquement',
    icon: <Eye className="h-4 w-4 text-success" />,
  },
  {
    value: 'draft',
    title: 'Brouillons',
    subtitle: 'Articles en cours de rédaction',
    icon: <FileText className="h-4 w-4 text-warning" />,
  },
  {
    value: 'archived',
    title: 'Archivés',
    subtitle: 'Articles archivés',
    icon: <FileText className="h-4 w-4 text-muted-foreground" />,
  },
];

const createSortOptions = (t: (key: string) => string): CustomSelectOption[] => [
  {
    value: 'created_at_desc',
    title: 'Plus récents',
    subtitle: 'Derniers créés en premier',
    icon: <TrendingDown className="h-4 w-4 text-primary" />,
  },
  {
    value: 'created_at_asc',
    title: 'Plus anciens',
    subtitle: 'Premiers créés en premier',
    icon: <TrendingUp className="h-4 w-4 text-primary" />,
  },
  {
    value: 'published_at_desc',
    title: 'Récemment publiés',
    subtitle: 'Derniers publiés en premier',
    icon: <TrendingDown className="h-4 w-4 text-success" />,
  },
  {
    value: 'published_at_asc',
    title: 'Anciennement publiés',
    subtitle: 'Premiers publiés en premier',
    icon: <TrendingUp className="h-4 w-4 text-success" />,
  },
  {
    value: 'title_asc',
    title: 'Titre A-Z',
    subtitle: 'Ordre alphabétique',
    icon: <SortAsc className="h-4 w-4 text-primary" />,
  },
  {
    value: 'title_desc',
    title: 'Titre Z-A',
    subtitle: 'Ordre alphabétique inverse',
    icon: <SortDesc className="h-4 w-4 text-primary" />,
  },
  {
    value: 'view_count_desc',
    title: 'Plus vus',
    subtitle: 'Articles les plus consultés',
    icon: <Eye className="h-4 w-4 text-accent" />,
  },
  {
    value: 'view_count_asc',
    title: 'Moins vus',
    subtitle: 'Articles les moins consultés',
    icon: <Eye className="h-4 w-4 text-muted-foreground" />,
  },
];

const getSortSelectionItems = (t: (key: string) => string) =>
  createSortOptions(t).map(option => ({
    id: option.value,
    name: option.title,
  }));

const getStatusSelectionItems = (t: (key: string) => string) =>
  createStatusOptions(t)
    .filter(opt => opt.value !== 'all')
    .map(option => ({
      id: option.value,
      name: option.title,
    }));

const BlogPage: FC = () => {
  const t = useTranslations();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<
    string | undefined
  >();
  const [selectedAuthorFilter, setSelectedAuthorFilter] = useState<
    string | undefined
  >();
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
      status: statusFilter === 'all' ? undefined : statusFilter,
      categoryId: selectedCategoryFilter,
      authorId: selectedAuthorFilter,
      sortBy: sortBy || undefined,
      limit: pageSize,
    }),
    [cursor, deferredSearch, statusFilter, selectedCategoryFilter, selectedAuthorFilter, sortBy]
  );

  // Fetch all categories for filter
  const { data: allCategories, isPending: isPendingCategories } =
    trpc.admin.blogCategories.list.useQuery({ search: undefined });

  // Fetch all authors for filter
  const { data: allAuthors, isPending: isPendingAuthors } =
    trpc.admin.blogAuthors.list.useQuery({ search: undefined });

  const {
    data: postsData,
    isPending: isPendingPosts,
    isFetching,
    isError,
    error,
    refetch,
  } = trpc.admin.blogPosts.listPaginated.useQuery(queryParams, {
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  const posts = useMemo(() => postsData?.items || [], [postsData?.items]);
  const totalPosts = postsData?.total || 0;
  const totalPages = Math.ceil(totalPosts / pageSize);

  const isFilterActive = useMemo(
    () =>
      !!(
        deferredSearch ||
        statusFilter !== 'all' ||
        selectedCategoryFilter ||
        selectedAuthorFilter ||
        (sortBy && sortBy !== 'created_at_desc')
      ),
    [deferredSearch, statusFilter, selectedCategoryFilter, selectedAuthorFilter, sortBy]
  );

  const categoryOptions = useMemo((): CustomSelectOption[] => {
    const baseOptions: CustomSelectOption[] = [
      {
        value: 'all',
        title: 'Toutes les catégories',
        subtitle: 'Toutes les catégories',
        icon: <Folder className="h-4 w-4 text-muted-foreground" />,
      },
    ];

    if (!allCategories) return baseOptions;

    return [
      ...baseOptions,
      ...allCategories.map(cat => ({
        value: cat.id,
        title: cat.name,
        subtitle: cat.slug,
        icon: <Folder className="h-4 w-4 text-primary" />,
      })),
    ];
  }, [allCategories]);

  const authorOptions = useMemo((): CustomSelectOption[] => {
    const baseOptions: CustomSelectOption[] = [
      {
        value: 'all',
        title: 'Tous les auteurs',
        subtitle: 'Tous les auteurs',
        icon: <User className="h-4 w-4 text-muted-foreground" />,
      },
    ];

    if (!allAuthors) return baseOptions;

    return [
      ...baseOptions,
      ...allAuthors.map(author => ({
        value: author.id,
        title: author.name,
        subtitle: author.bio || '',
        icon: <User className="h-4 w-4 text-primary" />,
      })),
    ];
  }, [allAuthors]);

  const statusOptions = useMemo((): CustomSelectOption[] => createStatusOptions(t), [t]);
  const sortOptions = useMemo((): CustomSelectOption[] => createSortOptions(t), [t]);
  const sortSelectionItems = useMemo(() => getSortSelectionItems(t), [t]);
  const statusSelectionItems = useMemo(() => getStatusSelectionItems(t), [t]);

  const hasActiveFilters = useMemo(
    () =>
      Boolean(
        search.trim() ||
          statusFilter !== 'all' ||
          selectedCategoryFilter ||
          selectedAuthorFilter ||
          sortBy !== 'created_at_desc'
      ),
    [search, statusFilter, selectedCategoryFilter, selectedAuthorFilter, sortBy]
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
      setStatusFilter('all');
      setSelectedCategoryFilter(undefined);
      setSelectedAuthorFilter(undefined);
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
              isLoading={isPendingPosts || isFetching}
              placeholder="Rechercher des articles..."
              value={search}
              onChange={setSearch}
            />
            <FilterButton
              isActive={isFilterActive}
              onClick={() => setIsFilterModalOpen(true)}
            />
          </div>
          <LocalizedLink className="w-full" href="/admin/blog/new">
            <Button className="w-full" size="sm" variant="accent">
              Nouvel article
            </Button>
          </LocalizedLink>
        </div>

        <div className="hidden space-y-4 md:block">
          <div className="flex items-center gap-4">
            <div className="max-w-md flex-1">
              <AdminPageHeader.Search
                isLoading={isPendingPosts || isFetching}
                placeholder="Rechercher des articles..."
                value={search}
                onChange={setSearch}
              />
            </div>
            <div className="flex items-center gap-3">
              <LocalizedLink className="w-full" href="/admin/blog/new">
                <Button className="w-full" icon={<Plus />} size="sm">
                  Nouvel article
                </Button>
              </LocalizedLink>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-1 flex-wrap items-center gap-3">
              <CustomSelect
                name="status_filter"
                contextIcon={<FileText className="h-5 w-5" />}
                className="w-52"
                disabled={isPendingFilters}
                options={statusOptions}
                placeholder="Tous les statuts"
                value={statusFilter}
                onChange={value =>
                  handleFilterChange(() =>
                    setStatusFilter(value as StatusFilter)
                  )
                }
              />

              <CustomSelect
                name="category_filter"
                contextIcon={<Folder className="h-5 w-5" />}
                className="w-64"
                disabled={isPendingCategories || !allCategories || isPendingFilters}
                options={categoryOptions}
                placeholder="Toutes les catégories"
                value={selectedCategoryFilter || 'all'}
                onChange={value =>
                  handleFilterChange(() =>
                    setSelectedCategoryFilter(value === 'all' ? undefined : value)
                  )
                }
              />

              <CustomSelect
                name="author_filter"
                contextIcon={<User className="h-5 w-5" />}
                className="w-52"
                disabled={isPendingAuthors || !allAuthors || isPendingFilters}
                options={authorOptions}
                placeholder="Tous les auteurs"
                value={selectedAuthorFilter || 'all'}
                onChange={value =>
                  handleFilterChange(() =>
                    setSelectedAuthorFilter(value === 'all' ? undefined : value)
                  )
                }
              />

              <CustomSelect
                name="sort_filter"
                contextIcon={<SortAsc className="h-5 w-5" />}
                className="w-52"
                disabled={isPendingFilters}
                options={sortOptions}
                placeholder="Trier par..."
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
                  Réinitialiser les filtres
                </Button>
              )}
            </div>
          </div>
        </div>
      </AdminPageHeader>

      <AdminPageLayout.Content>
        {isError ? (
          <EmptyState
            icon={FileText}
            title="Erreur de chargement"
            variant="muted"
            action={
              <Button size="sm" variant="outline" onClick={() => refetch()}>
                Réessayer
              </Button>
            }
            description={error?.message || 'Impossible de charger les articles'}
          />
        ) : (
          <DataList
            isLoading={isPendingPosts}
            items={posts}
            variant={view === 'map' ? 'grid' : view}
            emptyState={{
              icon: FileText,
              title: 'Aucun article trouvé',
              description: 'Commencez par créer votre premier article de blog.',
              action: (
                <LocalizedLink href="/admin/blog/new">
                  <Button icon={<Plus />} size="sm" variant="accent">
                    Créer un article
                  </Button>
                </LocalizedLink>
              ),
            }}
            renderItem={post => (
              <BlogPost
                key={post.id}
                post={post}
                queryParams={queryParams}
                view={view === 'map' ? 'grid' : view}
              />
            )}
            renderSkeleton={() =>
              view === 'grid' ? <BlogPostCardSkeleton /> : <BlogPostListSkeleton />
            }
          />
        )}

        {totalPosts > pageSize && (
          <div className="mt-6">
            <AdminPagination
              pagination={{
                currentPage: Math.max(
                  1,
                  Math.floor((totalPosts - posts.length) / pageSize) + 1
                ),
                pageSize,
                totalItems: totalPosts,
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
            label="Trier par"
            selectedId={sortBy}
            onSelectionChange={id =>
              handleFilterChange(() =>
                setSortBy((id || 'created_at_desc') as SortOption)
              )
            }
          />

          <Filters.Selection
            allLabel="Tous les statuts"
            items={statusSelectionItems}
            label="Statut"
            selectedId={statusFilter === 'all' ? undefined : statusFilter}
            onSelectionChange={id =>
              handleFilterChange(() => setStatusFilter((id || 'all') as StatusFilter))
            }
          />

          <Filters.Selection
            allLabel="Toutes les catégories"
            items={allCategories?.map(cat => ({
              id: cat.id,
              name: cat.name,
            })) || []}
            label="Catégorie"
            selectedId={selectedCategoryFilter}
            onSelectionChange={id =>
              handleFilterChange(() => setSelectedCategoryFilter(id))
            }
          />

          <Filters.Selection
            allLabel="Tous les auteurs"
            items={allAuthors?.map(author => ({
              id: author.id,
              name: author.name,
            })) || []}
            label="Auteur"
            selectedId={selectedAuthorFilter}
            onSelectionChange={id =>
              handleFilterChange(() => setSelectedAuthorFilter(id))
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
                Réinitialiser tous les filtres
              </Button>
            </div>
          )}
        </Filters>
      </FilterModal>
    </AdminPageLayout>
  );
};

export default BlogPage;
