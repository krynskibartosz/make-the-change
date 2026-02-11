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
import { useMutation } from '@tanstack/react-query'
import { CreditCard, Euro, Plus, Settings, User } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { type FC, useCallback, useEffect, useState, useTransition } from 'react'
import { useDebouncedCallback } from '@/app/[locale]/admin/(dashboard)/components/hooks/use-debounced-callback'
import { AdminPageContainer } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-container'
import { AdminPageHeader } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-header'
import { AdminPagination } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-pagination'
import { SubscriptionListItem } from '@/app/[locale]/admin/(dashboard)/components/subscriptions/subscription-list-item'
import {
  type ViewMode,
  ViewToggle,
} from '@/app/[locale]/admin/(dashboard)/components/ui/view-toggle'
import { buildUpdatedSearchParams } from '@/app/[locale]/admin/(dashboard)/components/utils/search-params'
import { LocalizedLink as Link } from '@/components/localized-link'
import { useToast } from '@/hooks/use-toast'
import { usePathname, useRouter } from '@/i18n/navigation'
import type { Subscription } from '@/lib/types/subscription'
import { PAGE_SIZE } from './constants'

type SubscriptionsClientProps = {
  initialData: {
    items: Subscription[]
    total: number
  }
}

const getStatusColor = (status: Subscription['status']) => {
  switch (status) {
    case 'active':
      return 'green'
    case 'cancelled':
    case 'past_due':
    case 'unpaid':
      return 'red'
    case 'trialing':
      return 'blue'
    case 'paused':
    case 'incomplete':
      return 'yellow'
    case 'expired':
    case 'inactive':
    default:
      return 'gray'
  }
}

export const SubscriptionsClient: FC<SubscriptionsClientProps> = ({ initialData }) => {
  const { toast } = useToast()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // State from URL
  const q = searchParams.get('q') || ''
  const status = searchParams.get('status') || undefined
  const plan = searchParams.get('plan') || undefined
  const page = Number(searchParams.get('page') || '1')

  const [view, setView] = useState<ViewMode>('grid')

  // Local state for optimistic updates
  const [subscriptionsState, setSubscriptionsState] = useState<Subscription[]>(
    initialData.items || [],
  )

  // Sync with prop updates
  useEffect(() => {
    setSubscriptionsState(initialData.items)
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

  const updateSubscription = useMutation({
    mutationFn: async (vars: { id: string; patch: Record<string, any> }) => {
      const res = await fetch(`/api/admin/subscriptions/${vars.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vars.patch),
      })
      if (!res.ok) throw new Error('Update failed')
      return res.json()
    },
    onSuccess: (updated, vars) => {
      toast({ variant: 'success', title: 'Abonnement mis à jour' })
      setSubscriptionsState((prev) =>
        prev.map((subscription) =>
          subscription.id === vars.id
            ? { ...subscription, ...vars.patch, ...(updated || {}) }
            : subscription,
        ),
      )
      router.refresh()
    },
    onError: () => toast({ variant: 'destructive', title: 'Mise à jour échouée' }),
  })

  return (
    <AdminPageContainer>
      <AdminPageHeader>
        <Input
          className="max-w-xs"
          aria-label="Rechercher des abonnements"
          placeholder="Rechercher un abonnement..."
          defaultValue={q}
          onChange={(e) => {
            debouncedSearch(e.target.value)
          }}
        />
        <SimpleSelect
          className="w-[150px]"
          placeholder="Statut"
          value={status ?? 'all'}
          options={[
            { value: 'all', label: 'Tous' },
            { value: 'active', label: 'Actif' },
            { value: 'cancelled', label: 'Annulé' },
            { value: 'inactive', label: 'Inactif' },
            { value: 'past_due', label: 'En retard' },
            { value: 'unpaid', label: 'Impayé' },
            { value: 'trialing', label: 'Essai' },
            { value: 'expired', label: 'Expiré' },
            { value: 'incomplete', label: 'Incomplet' },
            { value: 'paused', label: 'Suspendu' },
          ]}
          onValueChange={(val) => updateFilters({ status: val })}
        />
        <SimpleSelect
          className="w-[150px]"
          placeholder="Plan"
          value={plan ?? 'all'}
          options={[
            { value: 'all', label: 'Tous' },
            { value: 'monthly_standard', label: 'Mensuel Standard' },
            { value: 'monthly_premium', label: 'Mensuel Premium' },
            { value: 'annual_standard', label: 'Annuel Standard' },
            { value: 'annual_premium', label: 'Annuel Premium' },
          ]}
          onValueChange={(val) => updateFilters({ plan: val })}
        />
        {isPending && (
          <span aria-live="polite" className="text-xs text-muted-foreground animate-pulse">
            Chargement…
          </span>
        )}
        <Link href="/admin/subscriptions/new">
          <Button className="flex items-center gap-2" size="sm">
            <Plus className="h-4 w-4" />
            Nouvel abonnement
          </Button>
        </Link>
        <ViewToggle availableViews={['grid', 'list']} value={view} onChange={setView} />
      </AdminPageHeader>

      {view === 'grid' ? (
        <DataList
          gridCols={3}
          isLoading={isPending}
          items={subscriptionsState}
          emptyState={{
            title: 'Aucun abonnement trouvé',
            description: 'Aucun résultat pour ces filtres.',
            action: (
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateFilters({ q: undefined, status: undefined, plan: undefined })}
              >
                Réinitialiser les filtres
              </Button>
            ),
          }}
          renderItem={(s: Subscription) => (
            <DataCard href={`/admin/subscriptions/${s.id}`}>
              <DataCard.Header>
                <DataCard.Title>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">
                      {s.users?.first_name} {s.users?.last_name}
                    </span>
                    <Badge color={getStatusColor(s.status)}>{s.status}</Badge>
                  </div>
                </DataCard.Title>
              </DataCard.Header>
              <DataCard.Content>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <User className="w-3.5 h-3.5" />
                  <span>{s.users?.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Settings className="w-3.5 h-3.5" />
                  <span>{s.plan_type}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Euro className="w-3.5 h-3.5" />
                  <span>
                    €
                    {s.billing_frequency === 'monthly'
                      ? (s.monthly_price ?? 0)
                      : (s.annual_price ?? 0)}{' '}
                    / {s.billing_frequency === 'monthly' ? 'mois' : 'an'}
                  </span>
                </div>
              </DataCard.Content>
              <DataCard.Footer>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault()
                      updateSubscription.mutate({
                        id: s.id!,
                        patch: { status: s.status === 'active' ? 'inactive' : 'active' },
                      })
                    }}
                  >
                    {s.status === 'active' ? 'Désactiver' : 'Activer'}
                  </Button>
                </div>
                <span className="text-xs text-muted-foreground">
                  ID: {(s.id || '').substring(0, 8)}...
                </span>
              </DataCard.Footer>
            </DataCard>
          )}
          renderSkeleton={() => (
            <div className="p-4 border rounded-lg bg-card text-card-foreground shadow-sm animate-pulse h-[180px]" />
          )}
        />
      ) : subscriptionsState.length === 0 ? (
        <div className="text-center py-8">
          <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Aucun abonnement trouvé</h3>
          <p className="text-muted-foreground mb-4">Aucun résultat pour ces filtres.</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => updateFilters({ q: undefined, status: undefined, plan: undefined })}
          >
            Réinitialiser les filtres
          </Button>
        </div>
      ) : (
        <ListContainer>
          {subscriptionsState.map((subscription: Subscription) => (
            <SubscriptionListItem
              key={subscription.id}
              subscription={subscription}
              actions={
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault()
                      updateSubscription.mutate({
                        id: subscription.id!,
                        patch: {
                          status: subscription.status === 'active' ? 'inactive' : 'active',
                        },
                      })
                    }}
                  >
                    {subscription.status === 'active' ? 'Désactiver' : 'Activer'}
                  </Button>
                </div>
              }
            />
          ))}
        </ListContainer>
      )}

      <AdminPagination
        pagination={{
          currentPage: page,
          pageSize: PAGE_SIZE,
          totalItems: totalItems,
          totalPages: Math.ceil(totalItems / PAGE_SIZE),
        }}
      />
    </AdminPageContainer>
  )
}

export default SubscriptionsClient
