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
import { Calendar, DollarSign, ShoppingCart, User } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { type FC, useCallback, useState, useTransition } from 'react'
import { useDebouncedCallback } from '@/app/[locale]/admin/(dashboard)/components/hooks/use-debounced-callback'
import { AdminPageContainer } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-container'
import { AdminPageHeader } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-header'
import { AdminPagination } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-pagination'
import { OrderListItem } from '@/app/[locale]/admin/(dashboard)/components/orders/order-list-item'
import {
  type ViewMode,
  ViewToggle,
} from '@/app/[locale]/admin/(dashboard)/components/ui/view-toggle'
import { buildUpdatedSearchParams } from '@/app/[locale]/admin/(dashboard)/components/utils/search-params'
import { usePathname, useRouter } from '@/i18n/navigation'
import type { Order } from '@/lib/types/order'
import { PAGE_SIZE } from './constants'

type OrdersClientProps = {
  initialData: {
    items: Order[]
    total: number
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': {
      return 'yellow'
    }
    case 'paid': {
      return 'blue'
    }
    case 'processing': {
      return 'yellow'
    }
    case 'in_transit': {
      return 'blue'
    }
    case 'completed': {
      return 'green'
    }
    case 'closed': {
      return 'gray'
    }
    default: {
      return 'gray'
    }
  }
}

export const OrdersClient: FC<OrdersClientProps> = ({ initialData }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // State from URL
  const q = searchParams.get('q') || ''
  const status = searchParams.get('status') || undefined
  const page = Number(searchParams.get('page') || '1')

  const [view, setView] = useState<ViewMode>('grid')

  // Data from props (Server Component)
  const orders = initialData.items
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

  return (
    <AdminPageContainer>
      <AdminPageHeader>
        <Input
          className="max-w-xs"
          aria-label="Rechercher des commandes"
          placeholder="Rechercher par client ou ID"
          defaultValue={q}
          onChange={(e) => {
            debouncedSearch(e.target.value)
          }}
        />
        <SimpleSelect
          className="w-[180px]"
          placeholder="Filtrer par statut"
          value={status ?? 'all'}
          options={[
            { value: 'all', label: 'Tous' },
            { value: 'pending', label: 'En attente' },
            { value: 'paid', label: 'Payée' },
            { value: 'processing', label: 'En préparation' },
            { value: 'in_transit', label: 'En transit' },
            { value: 'completed', label: 'Terminée' },
            { value: 'closed', label: 'Clôturée' },
          ]}
          onValueChange={(val) => updateFilters({ status: val })}
        />
        {isPending && (
          <span aria-live="polite" className="text-xs text-muted-foreground animate-pulse">
            Chargement…
          </span>
        )}
        <ViewToggle availableViews={['grid', 'list']} value={view} onChange={setView} />
      </AdminPageHeader>

      {view === 'grid' ? (
        <DataList
          gridCols={3}
          isLoading={isPending}
          items={orders}
          emptyState={{
            title: 'Aucune commande',
            description: 'Aucun résultat pour ces filtres.',
            action: (
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateFilters({ q: undefined, status: undefined })}
              >
                Réinitialiser
              </Button>
            ),
          }}
          renderItem={(o: Order) => (
            <DataCard href={`/admin/orders/${o.id}`}>
              <DataCard.Header>
                <DataCard.Title>
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Commande #{o.id.slice(0, 8)}</span>
                    <Badge color={getStatusColor(o.status ?? 'pending')}>{o.status}</Badge>
                  </div>
                </DataCard.Title>
              </DataCard.Header>
              <DataCard.Content>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <User className="w-3.5 h-3.5" />
                  <span>{o.customerName}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(o.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-semibold">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>{(o.total ?? 0).toFixed(2)} €</span>
                </div>
              </DataCard.Content>
            </DataCard>
          )}
          renderSkeleton={() => (
            <div className="p-4 border rounded-lg bg-card text-card-foreground shadow-sm animate-pulse h-[180px]" />
          )}
        />
      ) : orders.length === 0 ? (
        <div className="text-center py-8">
          <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Aucune commande</h3>
          <p className="text-muted-foreground mb-4">Aucun résultat pour ces filtres.</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => updateFilters({ q: undefined, status: undefined })}
          >
            Réinitialiser
          </Button>
        </div>
      ) : (
        <ListContainer>
          {orders.map((order: Order) => (
            <OrderListItem key={order.id} order={order} />
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

export default OrdersClient
