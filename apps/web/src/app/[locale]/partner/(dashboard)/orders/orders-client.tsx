'use client'

import { cn } from '@make-the-change/core/shared/utils'
import { Card, CardContent, DataList } from '@make-the-change/core/ui'
import { Receipt } from 'lucide-react'
import type { FC } from 'react'
import { AdminPageLayout } from '@/app/[locale]/admin/(dashboard)/components/admin-layout'
import { AdminPageHeader } from '@/app/[locale]/admin/(dashboard)/components/admin-layout/header'

type Order = {
  id: string
  status: string
  createdAt: string
  total: number
  customerName: string
}

type OrdersClientProps = {
  initialOrders: {
    items: Order[]
    total: number
  }
}

export const OrdersClient: FC<OrdersClientProps> = ({ initialOrders }) => {
  const orders = initialOrders.items

  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success/10 text-success border-success/20'
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20'
      case 'paid':
      case 'in_transit':
        return 'bg-info/10 text-info border-info/20'
      case 'processing':
        return 'bg-accent/10 text-foreground border-accent/20'
      case 'closed':
        return 'bg-muted/30 text-muted-foreground border-border/60'
      default:
        return 'bg-muted/20 text-muted-foreground border-border/50'
    }
  }

  return (
    <AdminPageLayout>
      <AdminPageHeader>
        <h1 className="text-xl font-bold">Commandes contenant mes produits</h1>
      </AdminPageHeader>

      <AdminPageLayout.Content>
        <DataList
          isLoading={false}
          renderSkeleton={() => <div className="h-24 bg-muted animate-pulse rounded-lg" />}
          getItemKey={(item) => item.id}
          items={orders}
          variant="list"
          emptyState={{
            icon: Receipt,
            title: 'Aucune commande',
            description: 'Aucune commande ne contient encore vos produits.',
          }}
          renderItem={(order: Order) => (
            <Card key={order.id} className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="space-y-1">
                    <p className="font-medium">{order.customerName}</p>
                    <p className="text-sm text-muted-foreground">
                      Commande #{order.id.slice(0, 8)}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-medium">{order.total} points</p>
                    <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                  </div>
                  <span
                    className={cn(
                      'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
                      getStatusBadgeClass(order.status),
                    )}
                  >
                    {order.status}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        />
      </AdminPageLayout.Content>
    </AdminPageLayout>
  )
}
