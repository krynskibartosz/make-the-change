import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@make-the-change/core/ui'
import { ArrowRight, CheckCircle2, ShoppingBag, Sparkles } from 'lucide-react'
import { notFound } from 'next/navigation'
import { getLocale, getTranslations } from 'next-intl/server'
import { parseOrderItems } from '@/app/[locale]/(dashboard)/dashboard/orders/_features/order-parsers'
import { SectionContainer } from '@/components/ui/section-container'
import { Link, redirect } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency, formatDate, formatPoints } from '@/lib/utils'

interface CheckoutSuccessPageProps {
  searchParams: Promise<{ orderId?: string }>
}

export default async function CheckoutSuccessPage({ searchParams }: CheckoutSuccessPageProps) {
  const { orderId } = await searchParams
  if (!orderId) notFound()

  const supabase = await createClient()
  const locale = await getLocale()
  const t = await getTranslations('checkout.success')

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

  const items = parseOrderItems(order.items)
  const dateLocale = locale === 'fr' ? 'fr-FR' : locale === 'nl' ? 'nl-NL' : 'en-US'

  const totalEuros = items.reduce((sum, item) => {
    return sum + item.snapshot.priceEuros * item.quantity
  }, 0)

  const totalPoints = Number(order.total_points || 0)
  const showEuroAsPrimary = totalEuros > 0 && totalPoints <= 0

  return (
    <section className="relative min-h-[calc(100svh-4rem)] overflow-hidden bg-muted/25">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-0 h-[440px] w-[440px] rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute -right-40 bottom-0 h-[420px] w-[420px] rounded-full bg-marketing-positive-500/10 blur-[100px]" />
      </div>

      <SectionContainer size="lg" className="relative py-6 sm:py-10">
        <div className="space-y-6">
          <section className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-background/75 p-6 shadow-xl shadow-primary/5 backdrop-blur-md sm:p-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.08),transparent_55%)]" />
            <div className="relative flex flex-col gap-4">
              <Badge
                variant="secondary"
                className="w-fit gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-primary"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span className="text-[11px] font-black uppercase tracking-[0.16em]">
                  {t('badge')}
                </span>
              </Badge>

              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-client-emerald-500/15">
                      <CheckCircle2 className="h-5 w-5 text-client-emerald-600 dark:text-client-emerald-400" />
                    </div>
                    <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                      {t('title')}
                    </h1>
                  </div>
                  <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
                    {t('subtitle', { orderId: order.id.slice(0, 8).toUpperCase() })}
                  </p>
                </div>
                <Badge variant="success" className="rounded-full">
                  {t('paid')}
                </Badge>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border/60 bg-background/70 px-4 py-3">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">
                    {t('date')}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {formatDate(order.created_at || new Date(), dateLocale)}
                  </p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-background/70 px-4 py-3">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">
                    {t('total')}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground tabular-nums">
                    {showEuroAsPrimary
                      ? formatCurrency(totalEuros)
                      : `${formatPoints(totalPoints)} pts`}
                  </p>
                  {totalEuros > 0 && !showEuroAsPrimary ? (
                    <p className="text-xs text-muted-foreground tabular-nums">
                      {formatCurrency(totalEuros)}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </section>

          <Card className="overflow-hidden border border-border/70 bg-background/80 shadow-xl shadow-primary/5 backdrop-blur">
            <CardHeader className="border-b border-border/60 p-5 pb-4">
              <CardTitle className="text-lg font-black tracking-tight">
                {t('order_summary')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-5">
              <div className="space-y-3">
                {items.slice(0, 4).map((item) => {
                  const name = item.snapshot.name || t('fallback_product')
                  const priceEuros = item.snapshot.priceEuros
                  const itemPoints = item.totalPricePoints
                  const itemEuros = priceEuros * item.quantity
                  const showItemEuroAsPrimary = itemEuros > 0 && itemPoints <= 0
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-background/70 px-4 py-3 text-sm"
                    >
                      <span className="truncate">
                        {name} <span className="text-muted-foreground">x{item.quantity}</span>
                      </span>
                      <div className="flex flex-col items-end">
                        <span className="font-semibold tabular-nums">
                          {showItemEuroAsPrimary
                            ? formatCurrency(itemEuros)
                            : `${formatPoints(itemPoints)} pts`}
                        </span>
                        {priceEuros > 0 && !showItemEuroAsPrimary ? (
                          <span className="text-xs text-muted-foreground tabular-nums">
                            {formatCurrency(itemEuros)}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  )
                })}
                {items.length > 4 ? (
                  <p className="text-xs text-muted-foreground">
                    {t('more_items', { count: items.length - 4 })}
                  </p>
                ) : null}
              </div>

              <div className="rounded-2xl border border-border/60 bg-muted/35 px-4 py-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t('total')}</span>
                  <div className="flex flex-col items-end">
                    <span className="font-bold text-foreground">
                      {showEuroAsPrimary
                        ? formatCurrency(totalEuros)
                        : `${formatPoints(totalPoints)} pts`}
                    </span>
                    {totalEuros > 0 && !showEuroAsPrimary ? (
                      <span className="text-xs text-muted-foreground font-medium">
                        {formatCurrency(totalEuros)}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Link href="/dashboard/orders">
                  <Button className="w-full">
                    {t('actions.orders')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/products">
                  <Button variant="outline" className="w-full">
                    {t('actions.continue')}
                    <ShoppingBag className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </SectionContainer>
    </section>
  )
}
