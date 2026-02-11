'use client'

import {
  Badge,
  Button,
  DataList,
  Input,
  ListContainer,
  SimpleSelect,
} from '@make-the-change/core/ui'
import { DataCard } from '@make-the-change/core/ui/next'
import { Mail, Plus, Shield, User } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { type FC, useCallback, useEffect, useState, useTransition } from 'react'
import { useDebouncedCallback } from '@/app/[locale]/admin/(dashboard)/components/hooks/use-debounced-callback'
import { AdminPageContainer } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-container'
import { AdminPageHeader } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-header'
import { AdminPagination } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-pagination'
import {
  type ViewMode,
  ViewToggle,
} from '@/app/[locale]/admin/(dashboard)/components/ui/view-toggle'
import { UserListItem } from '@/app/[locale]/admin/(dashboard)/components/users/user-list-item'
import { buildUpdatedSearchParams } from '@/app/[locale]/admin/(dashboard)/components/utils/search-params'
import { LocalizedLink as Link } from '@/components/localized-link'
import { usePathname, useRouter } from '@/i18n/navigation'
import type { UserSummary } from '@/lib/types/user'
import { PAGE_SIZE } from './constants'

type UsersClientProps = {
  initialData: {
    items: UserSummary[]
    total: number
  }
}

export const UsersClient: FC<UsersClientProps> = ({ initialData }) => {
  const t = useTranslations('admin.users')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // State from URL
  const q = searchParams.get('q') || ''
  const role = searchParams.get('role') || undefined
  const page = Number(searchParams.get('page') || '1')

  const [view, setView] = useState<ViewMode>('grid')

  // Local state for optimistic updates
  const [usersState, setUsersState] = useState<UserSummary[]>(initialData.items || [])

  // Sync with prop updates
  useEffect(() => {
    setUsersState(initialData.items)
  }, [initialData.items])

  const totalItems = initialData.total

  const updateFilters = useCallback(
    (updates: Record<string, string | null | undefined>) => {
      const params = buildUpdatedSearchParams(searchParams.toString(), updates)

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`)
      })
    },
    [searchParams, router, pathname],
  )

  const debouncedSearch = useDebouncedCallback((value: string) => {
    updateFilters({ q: value })
  }, 400)

  const users = usersState

  return (
    <AdminPageContainer>
      <AdminPageHeader>
        <Input
          className="max-w-xs"
          aria-label={t('search_placeholder')}
          placeholder={t('search_placeholder')}
          defaultValue={q}
          onChange={(e) => {
            debouncedSearch(e.target.value)
          }}
        />
        <SimpleSelect
          className="w-[180px]"
          placeholder={t('search_placeholder')}
          value={role ?? 'all'}
          options={[
            { value: 'all', label: 'Tous' },
            { value: 'explorateur', label: 'Explorateur' },
            { value: 'protecteur', label: 'Protecteur' },
            { value: 'ambassadeur', label: 'Ambassadeur' },
          ]}
          onValueChange={(val) => updateFilters({ role: val })}
        />
        {isPending && (
          <span aria-live="polite" className="text-xs text-muted-foreground animate-pulse">
            Chargement…
          </span>
        )}
        <Link href="/admin/users/new">
          <Button className="flex items-center gap-2" size="sm">
            <Plus className="h-4 w-4" />
            {t('new_user')}
          </Button>
        </Link>
        <ViewToggle availableViews={['grid', 'list']} value={view} onChange={setView} />
      </AdminPageHeader>

      {view === 'grid' ? (
        <DataList
          gridCols={3}
          isLoading={isPending}
          items={users}
          emptyState={{
            title: t('empty_state.title'),
            description: t('empty_state.description'),
            action: (
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateFilters({ q: undefined, role: undefined })}
              >
                Réinitialiser
              </Button>
            ),
          }}
          renderItem={(u: UserSummary) => (
            <DataCard href={`/admin/users/${u.id}`}>
              <DataCard.Header>
                <DataCard.Title>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{u.name}</span>
                    <Badge color="gray">{u.user_level}</Badge>
                  </div>
                </DataCard.Title>
              </DataCard.Header>
              <DataCard.Content>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{u.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Shield className="w-3.5 h-3.5" />
                  <span>{u.kyc_status}</span>
                </div>
              </DataCard.Content>
            </DataCard>
          )}
          renderSkeleton={() => (
            <div className="p-4 border rounded-lg bg-card text-card-foreground shadow-sm animate-pulse h-[180px]" />
          )}
        />
      ) : users.length === 0 ? (
        <div className="text-center py-8">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">{t('empty_state.title')}</h3>
          <p className="text-muted-foreground mb-4">{t('empty_state.description')}</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => updateFilters({ q: undefined, role: undefined })}
          >
            Réinitialiser
          </Button>
        </div>
      ) : (
        <ListContainer>
          {users.map((user: UserSummary) => (
            <UserListItem key={user.id} user={user} />
          ))}
        </ListContainer>
      )}

      {users.length > 0 && (
        <AdminPagination
          pagination={{
            currentPage: page,
            pageSize: PAGE_SIZE,
            totalItems: totalItems,
            totalPages: Math.ceil(totalItems / PAGE_SIZE),
          }}
        />
      )}
    </AdminPageContainer>
  )
}

export default UsersClient
