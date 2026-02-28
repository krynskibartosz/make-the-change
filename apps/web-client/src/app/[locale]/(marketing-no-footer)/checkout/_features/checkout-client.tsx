'use client'

import { Badge, Button, Card, CardContent } from '@make-the-change/core/ui'
import { AlertTriangle, ArrowLeft, MapPin, ShoppingBag, Wallet } from 'lucide-react'
import { useLocale } from 'next-intl'
import { useCartTotals } from '@/app/[locale]/(marketing-no-footer)/cart/_features/use-cart'
import { Link } from '@/i18n/navigation'
import { getCheckoutUnavailableCopy } from '@/lib/checkout-status'
import { formatCurrency, formatPoints } from '@/lib/utils'

interface CheckoutClientProps {
  pointsBalance: number
  defaultAddress: {
    firstName: string
    lastName: string
    street: string
    city: string
    postalCode: string
    country: string
  }
}

export function CheckoutClient({ pointsBalance, defaultAddress }: CheckoutClientProps) {
  const locale = useLocale()
  const copy = getCheckoutUnavailableCopy(locale)
  const { itemsCount, totalPoints, totalEuros } = useCartTotals()
  const hasAddress = Boolean(
    defaultAddress.street ||
      defaultAddress.city ||
      defaultAddress.postalCode ||
      defaultAddress.country,
  )

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Card className="overflow-hidden border border-warning/20 bg-background/80 shadow-xl shadow-primary/5 backdrop-blur">
        <CardContent className="space-y-6 p-6 sm:p-8">
          <Badge
            variant="secondary"
            className="w-fit gap-2 rounded-full border border-warning/20 bg-warning/10 px-3 py-1 text-warning"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            {copy.statusValue}
          </Badge>

          <div className="space-y-2">
            <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              {copy.title}
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
              {copy.description}
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">
                {copy.statusLabel}
              </p>
              <p className="mt-2 text-sm font-semibold text-foreground">{copy.statusValue}</p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">
                <Wallet className="h-3.5 w-3.5" />
                <span>{copy.balanceLabel}</span>
              </div>
              <p className="mt-2 text-sm font-semibold text-foreground">
                {formatPoints(pointsBalance)} pts
              </p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>Panier</span>
              </div>
              <p className="mt-2 text-sm font-semibold text-foreground">
                {itemsCount} article(s) • {formatPoints(totalPoints)} pts
              </p>
              {totalEuros > 0 ? (
                <p className="text-xs text-muted-foreground">{formatCurrency(totalEuros)}</p>
              ) : null}
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-muted/25 p-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span>{copy.shippingLabel}</span>
            </div>
            <p className="mt-2 text-sm text-foreground">
              {hasAddress
                ? [defaultAddress.firstName, defaultAddress.lastName, defaultAddress.street]
                    .filter(Boolean)
                    .join(' ')
                : copy.addressMissing}
            </p>
            {hasAddress ? (
              <p className="text-sm text-muted-foreground">
                {[defaultAddress.postalCode, defaultAddress.city, defaultAddress.country]
                  .filter(Boolean)
                  .join(' ')}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild className="sm:flex-1">
              <Link href="/cart">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {copy.backToCart}
              </Link>
            </Button>
            <Button asChild variant="outline" className="sm:flex-1">
              <Link href="/products">{copy.continueShopping}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
