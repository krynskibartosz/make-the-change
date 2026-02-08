'use client'

import { Button, Input, SimpleSelect } from '@make-the-change/core/ui'
import { FolderTree, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useQueryStates } from 'nuqs'
import { type FC, useMemo } from 'react'
import { useDebouncedCallback } from '@/app/[locale]/admin/(dashboard)/components/hooks/use-debounced-callback'
import { AdminPageContainer } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-container'
import { AdminPageHeader } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-header'
import { AdminPagination } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-pagination'
import { AdminListItem } from '@/app/[locale]/admin/(dashboard)/components/ui/admin-list-item'
import { LocalizedLink } from '@/components/localized-link'
import { DataList } from '@make-the-change/core/ui'
import { categorySearchParams } from './categories-search-params'

type Category = {
  id: string
  name_default: string | null
  description_default: string | null
  slug: string
  parent_id: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  _count?: {
    products: number
    children: number
  }
}

type CategoriesClientProps = {
  initialData: {
    items: Category[]
    total: number
  }
}

const PAGE_SIZE = 10

export const CategoriesClient: FC<CategoriesClientProps> = ({ initialData }) => {
  const t = useTranslations()

  const [filters, setFilters] = useQueryStates(categorySearchParams, {
    shallow: false,
    throttleMs: 400,
  })

  const { q: search, page, sort } = filters

  const categories = initialData.items
  const totalCategories = initialData.total
  const totalPages = Math.max(1, Math.ceil(totalCategories / PAGE_SIZE))

  const debouncedSearch = useDebouncedCallback((value: string) => {
    void setFilters({ q: value, page: 1 })
  }, 400)

  const sortOptions = [
    { value: 'created_at_desc', label: t('admin.common.sort.newest') },
    { value: 'created_at_asc', label: t('admin.common.sort.oldest') },
    { value: 'name_asc', label: t('admin.common.sort.name_asc') },
    { value: 'name_desc', label: t('admin.common.sort.name_desc') },
  ]

  return (
    <AdminPageContainer>
      <AdminPageHeader title={t('admin.categories.title')}>
        <div className="flex items-center gap-2">
          <LocalizedLink href="/admin/categories/new">
            <Button icon={<Plus />} size="sm">
              {t('admin.categories.new_category')}
            </Button>
          </LocalizedLink>
        </div>
      </AdminPageHeader>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 max-w-md">
            <Input
              placeholder={t('admin.common.search')}
              defaultValue={search}
              onChange={(e) => debouncedSearch(e.target.value)}
            />
          </div>
          <SimpleSelect
            className="w-44"
            options={sortOptions}
            value={sort}
            onValueChange={(value) => setFilters({ sort: value })}
          />
        </div>

        <DataList
            isLoading={false}
            items={categories}
            variant="list"
            getItemKey={(item) => item.id}
            emptyState={{
                icon: FolderTree,
                title: t('admin.categories.empty_state.title'),
                description: t('admin.categories.empty_state.description'),
                action: (
                    <LocalizedLink href="/admin/categories/new">
                        <Button size="sm" variant="outline">
                            {t('admin.categories.new_category')}
                        </Button>
                    </LocalizedLink>
                )
            }}
            renderItem={(category) => (
                <LocalizedLink key={category.id} href={`/admin/categories/${category.id}`} className="block">
                    <AdminListItem
                        title={category.name_default || 'Sans nom'}
                        subtitle={category.slug}
                        status={category.is_active ? 'active' : 'inactive'}
                        image={null} // No image for category list for now, or maybe icon
                        meta={[
                            category.parent_id ? 'Sous-catégorie' : 'Catégorie racine',
                            `${category._count?.products ?? 0} produits`
                        ]}
                    />
                </LocalizedLink>
            )}
        />

        {totalPages > 1 && (
          <div className="mt-6">
            <AdminPagination
              pagination={{
                currentPage: page,
                pageSize: PAGE_SIZE,
                totalItems: totalCategories,
                totalPages,
              }}
              onPageChange={(p) => setFilters({ page: p })}
            />
          </div>
        )}
      </div>
    </AdminPageContainer>
  )
}

export default CategoriesClient
