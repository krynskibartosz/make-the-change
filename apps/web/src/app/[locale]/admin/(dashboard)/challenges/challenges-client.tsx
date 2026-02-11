'use client'

import { Button, Input, SimpleSelect, Badge } from '@make-the-change/core/ui'
import { Trophy, Plus, Calendar, Flame } from 'lucide-react'
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
import { challengesSearchParams } from './challenges-search-params'

type Challenge = {
  id: string
  title: string
  slug: string
  type: string
  status: string
  reward_points: number
  reward_badge: string | null
  created_at: string
}

type ChallengesClientProps = {
  initialData: {
    items: Challenge[]
    total: number
  }
}

const PAGE_SIZE = 10

export const ChallengesClient: FC<ChallengesClientProps> = ({ initialData }) => {
  const t = useTranslations()

  const [filters, setFilters] = useQueryStates(challengesSearchParams, {
    shallow: false,
    throttleMs: 400,
  })

  const { q: search, page, sort } = filters

  const challengeList = initialData.items
  const totalItems = initialData.total
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE))

  const debouncedSearch = useDebouncedCallback((value: string) => {
    void setFilters({ q: value, page: 1 })
  }, 400)

  const sortOptions = [
    { value: 'created_at_desc', label: t('admin.common.sort.newest') },
    { value: 'created_at_asc', label: t('admin.common.sort.oldest') },
    { value: 'title_asc', label: t('admin.common.sort.name_asc') },
    { value: 'title_desc', label: t('admin.common.sort.name_desc') },
  ]

  return (
    <AdminPageContainer>
      <AdminPageHeader title="Challenges & Gamification">
        <div className="flex items-center gap-2">
          <LocalizedLink href="/admin/challenges/new">
            <Button icon={<Plus />} size="sm">
              Nouveau Challenge
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
            renderSkeleton={() => <div className="h-16 bg-muted animate-pulse rounded-lg" />}
            items={challengeList}
            variant="list"
            getItemKey={(item) => item.id}
            emptyState={{
                icon: Trophy,
                title: "Aucun challenge trouvé",
                description: "Commencez par créer un nouveau challenge pour engager vos utilisateurs.",
                action: (
                    <LocalizedLink href="/admin/challenges/new">
                        <Button size="sm" variant="outline">
                            Créer un challenge
                        </Button>
                    </LocalizedLink>
                )
            }}
            renderItem={(challenge) => (
                <AdminListItem
                    key={challenge.id}
                    href={`/admin/challenges/${challenge.id}`}
                    header={
                        <div className="flex flex-col gap-1">
                            <span className="font-semibold text-foreground">{challenge.title}</span>
                            <span className="text-sm text-muted-foreground">/{challenge.slug}</span>
                        </div>
                    }
                    metadata={
                        <div className="flex items-center gap-3 text-sm">
                            <Badge variant="secondary" className="rounded-full capitalize">
                              {challenge.type}
                            </Badge>
                            <Badge className="rounded-full">
                              {challenge.reward_points > 0 ? `+${challenge.reward_points} pts` : challenge.reward_badge || 'Badge'}
                            </Badge>
                            <Badge variant={challenge.status === 'active' ? 'success' : 'outline'} className="rounded-full">
                              {challenge.status}
                            </Badge>
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
