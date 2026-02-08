import { Badge, Button, Card, CardContent } from '@make-the-change/core/ui'
import { ArrowRight, CheckCircle2, ShoppingBag } from 'lucide-react'
import { notFound } from 'next/navigation'
import { getLocale } from 'next-intl/server'
import { SectionContainer } from '@/components/ui/section-container'
import { Link, redirect } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/server'
import { formatDate, formatPoints } from '@/lib/utils'

interface CheckoutSuccessPageProps {
  searchParams: Promise<{ orderId?: string }>
}

export default async function CheckoutSuccessPage({ searchParams }: CheckoutSuccessPageProps) {
  const { orderId } = await searchParams
  if (!orderId) notFound()

  const supabase = await createClient()
  const locale = await getLocale()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    const returnTo = encodeURIComponent(`/checkout/success?orderId=${orderId}`)
    return redirect({ href: `/login?returnTo=${returnTo}`, locale })
  }

  const { data: order } = await supabase
    .from('orders')
    .select(
      `
      id,
      status,
      total_points,
      created_at,
      items:order_items(
        id,
        quantity,
        unit_price_points,
        total_price_points,
        product_snapshot
      )
    `,
    )
    .eq('id', orderId)
    .single()

  if (!order) notFound()

  type OrderItemRow = {
    id: string
    quantity: number
    unit_price_points: number | null
    total_price_points: number | null
    product_snapshot: unknown
  }

  const items = (order.items ?? []) as unknown as OrderItemRow[]

  return (
    <SectionContainer
      size="md"
      className="min-h-[calc(100svh-4rem)] bg-gradient-to-b from-background via-background to-muted/20 py-4 sm:py-6"
    >
      <div className="space-y-6">
        <Card className="border bg-background/70 shadow-sm backdrop-blur">
          <CardContent className="space-y-4 p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/15">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <p className="text-lg font-semibold">Commande confirmée</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatDate(order.created_at || new Date(), locale === 'en' ? 'en-US' : 'fr-FR')}
                </p>
              </div>
              <Badge variant="success" className="rounded-full">
                Payée
              </Badge>
            </div>

            <div className="rounded-2xl border bg-muted/30 px-4 py-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total</span>
                <span className="font-semibold text-foreground">
                  {formatPoints(Number(order.total_points || 0))} pts
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {items.slice(0, 3).map((item) => {
                const snapshot = (item.product_snapshot || {}) as Record<string, unknown>
                const name = (snapshot.name as string | undefined) || 'Produit'
                return (
                  <div key={item.id} className="flex items-center justify-between gap-3 text-sm">
                    <span className="truncate">
                      {name} <span className="text-muted-foreground">x{item.quantity}</span>
                    </span>
                    <span className="font-semibold tabular-nums">
                      {formatPoints(Number(item.total_price_points || 0))} pts
                    </span>
                  </div>
                )
              })}
              {items.length > 3 ? (
                <p className="text-xs text-muted-foreground">
                  +{items.length - 3} autre(s) article(s)
                </p>
              ) : null}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Link href="/dashboard/orders">
                <Button className="w-full">
                  Voir mes commandes
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/products">
                <Button variant="outline" className="w-full">
                  Continuer mes achats
                  <ShoppingBag className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </SectionContainer>
  )
}
