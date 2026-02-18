import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@make-the-change/core/ui'
import { ArrowRight, Package, ShoppingBag } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { DashboardPageContainer } from '@/components/layout/dashboard-page-container'
import { Link } from '@/i18n/navigation'
import { requireAuth } from '@/app/[locale]/(auth)/_features/auth-guards'
import { getOrderStatusColor } from '@/app/[locale]/(dashboard)/_features/lib/status-colors'
import { createClient } from '@/lib/supabase/server'
import { formatDate, formatPoints, formatCurrency } from '@/lib/utils'

export default async function OrdersPage() {
  const t = await getTranslations('orders')
  const _user = await requireAuth()
  const supabase = await createClient()

  // Fetch user orders with items using RLS
  const { data: userOrders } = await supabase
    .from('orders')
    .select(`
      id,
      status,
      total_points,
      created_at,
      items:order_items(
        id,
        quantity,
        unit_price_points,
        total_price_points,
        product_snapshot,
        product:public_products!product_id(
          id,
          name_default,
          slug
        )
      )
    `)
    .order('created_at', { ascending: false })

  // Status colors now centralized in lib/status-colors.ts

  return (
    <DashboardPageContainer className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">{t('title')}</h1>
          <p className="hidden text-muted-foreground sm:block">{t('history')}</p>
        </div>
        <Link href="/products">
          <Button className="w-full sm:w-auto">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Boutique
          </Button>
        </Link>
      </div>

      {/* Orders List */}
      {userOrders && userOrders.length > 0 ? (
        <div className="space-y-4">
          {userOrders.map((order) => {
            const items = (order.items as unknown) as any[] || []
            const firstItem = items[0]
            // Supabase returns joined fields as arrays, extract first element
            const firstProduct = firstItem
              ? Array.isArray(firstItem.product)
                ? firstItem.product[0]
                : firstItem.product
              : null
            const itemCount = items.reduce((sum, item) => sum + (item.quantity || 0), 0)
            const totalEuros = (Array.isArray(items) ? items : []).reduce((sum: number, item: any) => {
              const snapshot = item?.product_snapshot as { priceEuros?: number } | null
              const priceEuros = snapshot?.priceEuros || 0
              return sum + (priceEuros * (item?.quantity || 0))
            }, 0)

            return (
              <Link key={order.id} href={`/dashboard/orders/${order.id}`} className="block">
                <Card className="transition hover:bg-muted/30">
                  <CardHeader className="flex flex-col gap-3 p-5 pb-4 sm:flex-row sm:items-center sm:justify-between sm:p-8 sm:pb-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <Package className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-base sm:text-lg">
                          Commande #{order.id?.slice(0, 8) || '...'}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(order.created_at || new Date())}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={getOrderStatusColor(order?.status || 'pending')}
                        className="w-fit"
                      >
                        {t(`status.${order.status}`)}
                      </Badge>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-5 pt-3 sm:p-8 sm:pt-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium">
                            {firstProduct?.name_default || 'Produit'}
                            {items.length > 1 && ` (+${items.length - 1} autres)`}
                          </p>
                          <p className="text-sm text-muted-foreground">{itemCount} article(s)</p>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="font-bold text-primary">
                          {formatPoints(order.total_points || 0)} pts
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ShoppingBag className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="mb-4 text-lg text-muted-foreground">{t('empty')}</p>
            <Link href="/products">
              <Button>
                {t('browse_products')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </DashboardPageContainer>
  )
}
