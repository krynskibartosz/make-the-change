import { Badge, Button, DetailView } from '@make-the-change/core/ui'
import { ArrowLeft, Package, Truck } from 'lucide-react'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getOrderStatusColor } from '@/app/[locale]/(dashboard)/_features/lib/status-colors'
import {
  parseOrderItems,
  parseShippingAddress,
} from '@/app/[locale]/(dashboard)/dashboard/orders/_features/order-parsers'
import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency, formatDate, formatPoints } from '@/lib/utils'

interface OrderDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params
  const t = await getTranslations('orders')
  const supabase = await createClient()

  const { data: order } = await supabase
    .from('orders')
    .select(
      `
      id,
      status,
      subtotal_points,
      shipping_cost_points,
      tax_points,
      total_points,
      created_at,
      tracking_number,
      carrier,
      shipping_address,
      items:order_items(
        id,
        quantity,
        unit_price_points,
        total_price_points,
        product_snapshot
      )
    `,
    )
    .eq('id', id)
    .single()

  if (!order) notFound()

  const items = parseOrderItems(order.items)
  const address = parseShippingAddress(order.shipping_address)

  const totalEuros = items.reduce((sum, item) => {
    return sum + item.snapshot.priceEuros * item.quantity
  }, 0)

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link href="/dashboard/orders">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour
              </Button>
            </Link>
            <Badge
              variant={getOrderStatusColor(order.status || 'pending')}
              className="rounded-full"
            >
              {t(`status.${order.status}`)}
            </Badge>
          </div>
          <h1 className="text-2xl font-bold sm:text-3xl">Commande #{order.id?.slice(0, 8)}</h1>
          <p className="text-sm text-muted-foreground">
            {formatDate(order.created_at || new Date())}
          </p>
        </div>
      </div>

      <DetailView variant="sidebar" spacing="md">
        <DetailView.Section title="Articles" icon={Package} span={3}>
          <div className="space-y-3">
            {items.map((item) => {
              const name = item.snapshot.name || 'Produit'
              const priceEuros = item.snapshot.priceEuros
              return (
                <div
                  key={item.id}
                  className="flex flex-col gap-2 rounded-xl border bg-background/60 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{name}</p>
                    <p className="text-sm text-muted-foreground">
                      x{item.quantity} • {formatPoints(item.unitPricePoints)} pts
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-sm font-semibold text-primary tabular-nums">
                      {formatPoints(item.totalPricePoints)} pts
                    </p>
                    {priceEuros > 0 && (
                      <p className="text-xs text-muted-foreground tabular-nums">
                        {formatCurrency(priceEuros * item.quantity)}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </DetailView.Section>

        <DetailView.Section title="Livraison" icon={Truck} span={3}>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border bg-muted/30 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Destinataire
              </p>
              <p className="mt-2 text-sm font-semibold">
                {address.firstName} {address.lastName}
              </p>
            </div>
            <div className="rounded-xl border bg-muted/30 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Adresse</p>
              <p className="mt-2 text-sm">{address.street || '—'}</p>
              <p className="text-sm text-muted-foreground">
                {address.postalCode} {address.city}
              </p>
              <p className="text-sm text-muted-foreground">{address.country}</p>
            </div>
            <div className="rounded-xl border bg-muted/30 p-4 sm:col-span-2">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Tracking</p>
              <p className="mt-2 text-sm">
                {order.carrier || order.tracking_number
                  ? `${order.carrier || 'Transporteur'} • ${order.tracking_number || '—'}`
                  : 'Aucune information pour le moment.'}
              </p>
            </div>
          </div>
        </DetailView.Section>

        <DetailView.Section title="Résumé" span={1}>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Sous-total</span>
              <span className="font-semibold">
                {formatPoints(Number(order.subtotal_points || 0))} pts
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Livraison</span>
              <span className="font-semibold">
                {formatPoints(Number(order.shipping_cost_points || 0))} pts
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Taxes</span>
              <span className="font-semibold">
                {formatPoints(Number(order.tax_points || 0))} pts
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl border bg-muted/30 px-3 py-2">
              <span className="text-muted-foreground">Total</span>
              <div className="flex flex-col items-end">
                <span className="font-semibold text-primary">
                  {formatPoints(Number(order.total_points || 0))} pts
                </span>
                {totalEuros > 0 && (
                  <span className="text-xs text-muted-foreground font-medium">
                    {formatCurrency(totalEuros)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </DetailView.Section>
      </DetailView>
    </div>
  )
}
