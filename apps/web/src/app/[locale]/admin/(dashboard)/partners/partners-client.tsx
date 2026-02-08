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
import { Building2, Mail, Plus } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { type FC, useCallback, useMemo, useState, useTransition } from 'react'
import { useDebouncedCallback } from '@/app/[locale]/admin/(dashboard)/components/hooks/use-debounced-callback'
import { AdminPageContainer } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-container'
import { AdminPageHeader } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-header'
import { AdminPagination } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-pagination'
import { PartnerListItem } from '@/app/[locale]/admin/(dashboard)/components/partners/partner-list-item'
import {
  type ViewMode,
  ViewToggle,
} from '@/app/[locale]/admin/(dashboard)/components/ui/view-toggle'
import { buildUpdatedSearchParams } from '@/app/[locale]/admin/(dashboard)/components/utils/search-params'
import { LocalizedLink as Link } from '@/components/localized-link'
import { usePathname, useRouter } from '@/i18n/navigation'
import type { Partner } from '@/lib/types/partner'
import { PAGE_SIZE } from './constants'

type Props = {
  initialConvertData: Partner[]
  total: number
}

const partnerStatusLabels: Record<string, string> = {
  active: 'Actif',
  inactive: 'Inactif',
  pending: 'En attente',
  suspended: 'Suspendu',
  archived: 'Archivé',
}

const statusOptions = [
  { value: 'all', label: 'Tous' },
  ...Object.entries(partnerStatusLabels).map(([value, label]) => ({
    value,
    label,
  })),
]

export const PartnersClient: FC<Props> = ({ initialConvertData, total }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // State from URL
  const q = searchParams.get('q') || ''
  const status = searchParams.get('status') || undefined
  const page = Number(searchParams.get('page') || '1')

  const [view, setView] = useState<ViewMode>('grid')

  // Sync with props
  const [data, setData] = useState<Partner[]>(initialConvertData)

  useMemo(() => {
    setData(initialConvertData)
  }, [initialConvertData])

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

  return (
    <AdminPageContainer>
      <AdminPageHeader>
        <Input
          className="max-w-xs"
          aria-label="Rechercher des partenaires"
          placeholder="Rechercher par nom ou email..."
          defaultValue={q}
          onChange={(e) => {
            debouncedSearch(e.target.value)
          }}
        />
        <SimpleSelect
          className="w-[180px]"
          options={statusOptions}
          placeholder="Filtrer par statut"
          value={status ?? 'all'}
          onValueChange={(val) => updateFilters({ status: val })}
        />

        <Link href="/admin/partners/new">
          <Button className="flex items-center gap-2" size="sm">
            <Plus className="h-4 w-4" />
            Nouveau partenaire
          </Button>
        </Link>
        <ViewToggle availableViews={['grid', 'list']} value={view} onChange={setView} />
      </AdminPageHeader>
      {view === 'grid' ? (
        <DataList
          gridCols={3}
          isLoading={isPending}
          items={data}
          emptyState={{
            icon: Building2,
            title: 'Aucun partenaire trouvé',
            description: 'Aucun partenaire ne correspond à vos filtres.',
            action: (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  updateFilters({ q: undefined, status: undefined })
                }}
              >
                Réinitialiser les filtres
              </Button>
            ),
          }}
          renderItem={(partner: Partner) => (
            <DataCard href={`/admin/partners/${partner.id}`}>
              <DataCard.Header>
                <DataCard.Title>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{partner.name}</span>
                    <Badge
                      color={
                        partner.status === 'active'
                          ? 'green'
                          : partner.status === 'pending'
                            ? 'yellow'
                            : partner.status === 'suspended'
                              ? 'orange'
                              : 'gray'
                      }
                    >
                      {partnerStatusLabels[partner.status as keyof typeof partnerStatusLabels] ||
                        partner.status}
                    </Badge>
                  </div>
                </DataCard.Title>
              </DataCard.Header>
              <DataCard.Content>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{partner.contact_email}</span>
                </div>
              </DataCard.Content>
            </DataCard>
          )}
          renderSkeleton={() => (
            <div className="p-4 border rounded-lg bg-card text-card-foreground shadow-sm animate-pulse h-[180px]" />
          )}
        />
      ) : (
        <ListContainer>
          {data.map((partner) => (
            <PartnerListItem
              key={partner.id}
              partner={{
                ...partner,
                name: partner.name,
                contact_email: partner.contact_email ?? '',
                status: partner.status as
                  | 'active'
                  | 'inactive'
                  | 'pending'
                  | 'suspended'
                  | 'archived',
              }}
            />
          ))}
        </ListContainer>
      )}

      <AdminPagination
        pagination={{
          currentPage: page,
          pageSize: PAGE_SIZE,
          totalItems: total,
          totalPages: Math.ceil(total / PAGE_SIZE),
        }}
      />
    </AdminPageContainer>
  )
}
