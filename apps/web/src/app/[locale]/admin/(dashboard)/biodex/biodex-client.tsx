'use client'

import { Button, Input, SimpleSelect } from '@make-the-change/core/ui'
import { Leaf, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useQueryStates } from 'nuqs'
import { type FC } from 'react'
import { useDebouncedCallback } from '@/app/[locale]/admin/(dashboard)/components/hooks/use-debounced-callback'
import { AdminPageContainer } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-container'
import { AdminPageHeader } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-header'
import { AdminPagination } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-pagination'
import { AdminListItem } from '@/app/[locale]/admin/(dashboard)/components/ui/admin-list-item'
import { LocalizedLink } from '@/components/localized-link'
import { DataList } from '@make-the-change/core/ui'
import { biodexSearchParams } from './biodex-search-params'

type Species = {
  id: string
  name_default: string | null
  scientific_name: string | null
  conservation_status: string | null
  is_featured: boolean
  created_at: string
}

type BiodexClientProps = {
  initialData: {
    items: Species[]
    total: number
  }
}

const PAGE_SIZE = 10

export const BiodexClient: FC<BiodexClientProps> = ({ initialData }) => {
  const t = useTranslations()

  const [filters, setFilters] = useQueryStates(biodexSearchParams, {
    shallow: false,
    throttleMs: 400,
  })

  const { q: search, page, sort } = filters

  const speciesList = initialData.items
  const totalItems = initialData.total
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE))

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
      <AdminPageHeader title={t('admin.biodex.title')}>
        <div className="flex items-center gap-2">
          <LocalizedLink href="/admin/biodex/new">
            <Button icon={<Plus />} size="sm">
              {t('admin.biodex.new_species')}
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
            items={speciesList}
            variant="list"
            getItemKey={(item) => item.id}
            emptyState={{
                icon: Leaf,
                title: t('admin.biodex.empty_state.title'),
                description: t('admin.biodex.empty_state.description'),
                action: (
                    <LocalizedLink href="/admin/biodex/new">
                        <Button size="sm" variant="outline">
                            {t('admin.biodex.new_species')}
                        </Button>
                    </LocalizedLink>
                )
            }}
            renderItem={(species) => (
                <LocalizedLink key={species.id} href={`/admin/biodex/${species.id}`} className="block">
                    <AdminListItem
                        title={species.name_default || 'Sans nom'}
                        subtitle={species.scientific_name}
                        status={species.is_featured ? 'active' : 'inactive'} // Using status for featured visual
                        meta={[
                            species.conservation_status || 'Statut inconnu'
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
                totalItems: totalItems,
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

export default BiodexClient
