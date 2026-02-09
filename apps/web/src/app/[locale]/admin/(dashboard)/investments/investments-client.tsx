'use client'

import { Input, SimpleSelect } from '@make-the-change/core/ui'
import { TrendingUp } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useQueryStates } from 'nuqs'
import { type FC } from 'react'
import { useDebouncedCallback } from '@/app/[locale]/admin/(dashboard)/components/hooks/use-debounced-callback'
import { AdminPageContainer } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-container'
import { AdminPageHeader } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-header'
import { AdminPagination } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-pagination'
import { AdminListItem } from '@/app/[locale]/admin/(dashboard)/components/ui/admin-list-item'
import { DataList } from '@make-the-change/core/ui'
import { investmentSearchParams } from './investments-search-params'

type Investment = {
  id: string
  user_email?: string | null
  project_name?: string | null
  amount_points: number
  status: string
  created_at: string
}

type InvestmentsClientProps = {
  initialData: {
    items: Investment[]
    total: number
  }
}

const PAGE_SIZE = 20

export const InvestmentsClient: FC<InvestmentsClientProps> = ({ initialData }) => {
  const t = useTranslations()

  const [filters, setFilters] = useQueryStates(investmentSearchParams, {
    shallow: false,
    throttleMs: 400,
  })

  const { q: search, page, sort } = filters

  const investments = initialData.items
  const totalItems = initialData.total
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE))

  const debouncedSearch = useDebouncedCallback((value: string) => {
    void setFilters({ q: value, page: 1 })
  }, 400)

  const sortOptions = [
    { value: 'created_at_desc', label: t('admin.common.sort.newest') },
    { value: 'created_at_asc', label: t('admin.common.sort.oldest') },
  ]

  return (
    <AdminPageContainer>
      <AdminPageHeader title={t('admin.investments.title')} />

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
            renderSkeleton={() => <div className="h-16 bg-muted animate-pulse rounded-lg" />}
            items={investments}
            variant="list"
            getItemKey={(item) => item.id}
            emptyState={{
                icon: TrendingUp,
                title: t('admin.investments.empty_state.title'),
                description: t('admin.investments.empty_state.description'),
            }}
            renderItem={(inv) => (
                <AdminListItem
                    key={inv.id}
                    href="#"
                    header={
                        <div className="flex flex-col gap-1">
                            <span className="font-semibold text-foreground">{inv.amount_points} Points</span>
                            <span className="text-sm text-muted-foreground">{inv.project_name || 'Projet inconnu'}</span>
                        </div>
                    }
                    metadata={
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{inv.user_email || 'Utilisateur inconnu'}</span>
                            <span>•</span>
                            <span>{new Date(inv.created_at).toLocaleString()}</span>
                            {inv.status === 'completed' && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                                    Complété
                                </span>
                            )}
                        </div>
                    }
                />
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

export default InvestmentsClient
