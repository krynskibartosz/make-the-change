'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
} from '@make-the-change/core/ui'
import { CreditCard, ShieldCheck, Sparkles, Truck, Wallet } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useCart, useCartTotals } from '@/features/commerce/cart/use-cart'
import { Link, useRouter } from '@/i18n/navigation'
import { cn, formatCurrency, formatPoints } from '@/lib/utils'
import { placeEuroOrderAction } from './place-euro-order.action'
import { placePointsOrderAction } from './place-points-order.action'

type TranslateFn = (key: string, values?: Record<string, unknown>) => string

const createAddressSchema = (t: TranslateFn) =>
  z.object({
    firstName: z.string().min(1, t('validation.first_name_required')),
    lastName: z.string().min(1, t('validation.last_name_required')),
    street: z.string().min(1, t('validation.address_required')),
    city: z.string().min(1, t('validation.city_required')),
    postalCode: z.string().min(1, t('validation.postal_code_required')),
    country: z.string().min(1, t('validation.country_required')),
  })

// Static schema for type inference
const StaticAddressFormSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  street: z.string(),
  city: z.string(),
  postalCode: z.string(),
  country: z.string(),
})

type AddressFormValues = z.infer<typeof StaticAddressFormSchema>

type CheckoutClientProps = {
  pointsBalance: number
  defaultAddress: Partial<AddressFormValues>
}

type PointsOrderErrorCode = Exclude<
  Awaited<ReturnType<typeof placePointsOrderAction>>,
  { orderId: string }
>['errorCode']

type EuroOrderErrorCode = Exclude<
  Awaited<ReturnType<typeof placeEuroOrderAction>>,
  { orderId: string }
>['errorCode']

type ServerErrorCode = PointsOrderErrorCode | EuroOrderErrorCode

export function CheckoutClient({ pointsBalance, defaultAddress }: CheckoutClientProps) {
  const t = useTranslations('checkout')
  const router = useRouter()
  const { items, clear } = useCart()
  const { itemsCount, totalPoints, totalEuros } = useCartTotals()

  const steps = useMemo(
    () => [
      { id: 1 as const, label: t('steps.cart'), hint: t('steps.hints.cart') },
      { id: 2 as const, label: t('steps.address'), hint: t('steps.hints.address') },
      { id: 3 as const, label: t('steps.confirm'), hint: t('steps.hints.confirm') },
    ],
    [t],
  )

  const AddressFormSchema = useMemo(() => createAddressSchema(t), [t])

  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [paymentMethod, setPaymentMethod] = useState<'points' | 'euros'>('points')

  // Detect stale cart (items without Euro price)
  const hasStaleItems = useMemo(() => {
    return items.some((item) => item.snapshot.priceEuros === undefined)
  }, [items])

  const [serverError, setServerError] = useState<string | null>(null)
  const [serverErrorCode, setServerErrorCode] = useState<ServerErrorCode | null>(null)
  const [placing, setPlacing] = useState(false)

  const remainingPoints = useMemo(() => pointsBalance - totalPoints, [pointsBalance, totalPoints])
  const hasEnoughPoints = remainingPoints >= 0
  const canConfirmOrder = paymentMethod === 'points' ? hasEnoughPoints : !hasStaleItems

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(AddressFormSchema),
    defaultValues: {
      firstName: defaultAddress.firstName || '',
      lastName: defaultAddress.lastName || '',
      street: defaultAddress.street || '',
      city: defaultAddress.city || '',
      postalCode: defaultAddress.postalCode || '',
      country: defaultAddress.country || '',
    },
    mode: 'onBlur',
  })

  const watchedAddress = form.watch()
  const addressPreview = useMemo(() => {
    const segments = [
      [watchedAddress.firstName, watchedAddress.lastName].filter(Boolean).join(' ').trim(),
      watchedAddress.street,
      [watchedAddress.postalCode, watchedAddress.city].filter(Boolean).join(' ').trim(),
      watchedAddress.country,
    ].filter(Boolean)

    return segments.join(', ')
  }, [
    watchedAddress.city,
    watchedAddress.country,
    watchedAddress.firstName,
    watchedAddress.lastName,
    watchedAddress.postalCode,
    watchedAddress.street,
  ])

  const paymentLabel =
    paymentMethod === 'points' ? t('summary.points_method') : t('summary.card_method')

  const handleTopBack = () => {
    if (step === 1) {
      router.push('/cart')
      return
    }
    setStep((prev) => Math.max(1, prev - 1) as 1 | 2 | 3)
  }

  const submitAddress = form.handleSubmit(() => {
    setServerError(null)
    setServerErrorCode(null)
    setStep(3)
  })

  const confirmOrder = async () => {
    setServerError(null)
    setServerErrorCode(null)
    setPlacing(true)
    try {
      const address = form.getValues()
      let result:
        | Awaited<ReturnType<typeof placeEuroOrderAction>>
        | Awaited<ReturnType<typeof placePointsOrderAction>>

      if (paymentMethod === 'euros') {
        if (hasStaleItems) {
          setServerError(t('errors.stale_cart.description'))
          setPlacing(false)
          return
        }
        result = await placeEuroOrderAction({
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          shippingAddress: address,
        })
      } else {
        result = await placePointsOrderAction({
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          shippingAddress: address,
        })
      }

      if ('orderId' in result) {
        clear()
        router.push(`/checkout/success?orderId=${encodeURIComponent(result.orderId)}`)
        return
      }

      setServerError(result.message)
      setServerErrorCode(result.errorCode)
    } catch {
      setServerError(t('errors.generic'))
    } finally {
      setPlacing(false)
    }
  }

  const handlePrimaryMobileAction = () => {
    if (step === 1) {
      setStep(2)
      return
    }
    if (step === 2) {
      submitAddress()
      return
    }
    void confirmOrder()
  }

  const mobilePrimaryLabel =
    step < 3
      ? t('actions.continue')
      : paymentMethod === 'points'
        ? t('actions.confirm_points')
        : t('actions.pay_simulation')

  const mobilePrimaryDisabled = step === 3 ? !canConfirmOrder || placing : false

  const footerStatusVariant =
    paymentMethod === 'points'
      ? hasEnoughPoints
        ? 'success'
        : 'destructive'
      : hasStaleItems
        ? 'warning'
        : 'success'

  const footerStatusLabel =
    paymentMethod === 'points'
      ? hasEnoughPoints
        ? t('footer.status.ok')
        : t('footer.status.insufficient')
      : hasStaleItems
        ? t('footer.status.update_required')
        : t('footer.status.ok')

  if (itemsCount === 0) {
    return (
      <Card className="border bg-background/70 shadow-sm backdrop-blur">
        <CardContent className="space-y-4 p-6 text-center">
          <p className="text-lg font-semibold">{t('empty.title')}</p>
          <p className="text-sm text-muted-foreground">{t('empty.description')}</p>
          <Button asChild>
            <Link href="/products">{t('empty.cta')}</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-5 pb-[calc(7rem+env(safe-area-inset-bottom))] sm:space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-background/70 p-4 shadow-xl shadow-primary/5 backdrop-blur-md sm:p-7">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute -bottom-16 -left-20 h-64 w-64 rounded-full bg-marketing-positive-500/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.08),transparent_55%)]" />
        </div>

        <div className="relative">
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div className="space-y-3">
                <Badge
                  variant="secondary"
                  className="w-fit gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-primary"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span className="text-[11px] font-black uppercase tracking-[0.16em]">
                    {t('hero.badge')}
                  </span>
                </Badge>
                <div>
                  <h1 className="text-[2rem] font-black tracking-tight text-foreground sm:text-4xl">
                    {t('title')}
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {t('hero.description', { count: itemsCount })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start rounded-full border border-border/60 bg-background/70 p-1">
                <Button variant="ghost" size="sm" onClick={handleTopBack} className="rounded-full">
                  {t('header.back')}
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="rounded-full border-border/60"
                >
                  <Link href="/cart">{t('header.edit')}</Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-2.5 md:grid-cols-3">
              {steps.map((item) => {
                const isCurrent = item.id === step
                const isDone = item.id < step

                return (
                  <div
                    key={item.id}
                    className={cn(
                      'rounded-2xl border px-3.5 py-3 transition-all',
                      isCurrent
                        ? 'border-primary/50 bg-primary/10'
                        : isDone
                          ? 'border-marketing-positive-500/40 bg-marketing-positive-500/10'
                          : 'border-border/60 bg-background/60',
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          'inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black',
                          isCurrent
                            ? 'bg-primary text-primary-foreground'
                            : isDone
                              ? 'bg-marketing-positive-500 text-marketing-overlay-light'
                              : 'bg-muted text-muted-foreground',
                        )}
                      >
                        {item.id}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-foreground">{item.label}</p>
                        <p
                          className={cn(
                            'text-xs text-muted-foreground sm:block',
                            !isCurrent && 'hidden',
                          )}
                        >
                          {item.hint}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2">
              <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/70 px-3 py-2">
                <ShieldCheck className="h-4 w-4 text-marketing-positive-500" />
                <p className="text-xs font-semibold text-muted-foreground">
                  {t('hero.security_note')}
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/70 px-3 py-2">
                <Truck className="h-4 w-4 text-primary" />
                <p className="text-xs font-semibold text-muted-foreground">
                  {t('hero.shipping_note')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {serverError ? (
        <div
          className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          {serverError}
        </div>
      ) : null}

      {hasStaleItems && paymentMethod === 'euros' ? (
        <div className="rounded-2xl border border-client-yellow-500/30 bg-client-yellow-500/10 px-4 py-3 text-sm text-client-yellow-600">
          <p className="font-semibold">{t('errors.stale_cart.title')}</p>
          <p>{t('errors.stale_cart.description')}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => {
              clear()
              router.push('/products')
            }}
          >
            {t('errors.stale_cart.action')}
          </Button>
        </div>
      ) : null}

      {serverErrorCode === 'INSUFFICIENT_POINTS' ? (
        <div className="rounded-2xl border bg-muted/30 px-4 py-3 text-sm">
          <p className="text-muted-foreground">{t('errors.insufficient_points_server')}</p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/projects">{t('actions.earn_points')}</Link>
            </Button>
            <Button asChild className="w-full sm:w-auto">
              <Link href="/dashboard/points">{t('actions.view_balance')}</Link>
            </Button>
          </div>
        </div>
      ) : null}

      <div className="grid gap-5 lg:gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-5">
          {step === 1 ? (
            <Card className="overflow-hidden border border-border/70 bg-background/75 shadow-xl shadow-primary/5 backdrop-blur">
              <CardHeader className="border-b border-border/60 p-5 sm:p-7">
                <CardTitle className="text-lg font-black tracking-tight">
                  {t('summary.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-5 sm:p-7">
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-background/70 px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {item.snapshot.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          x{item.quantity} • {formatPoints(item.snapshot.pricePoints)} pts
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-foreground tabular-nums">
                          {formatPoints(item.quantity * item.snapshot.pricePoints)} pts
                        </p>
                        <p className="text-xs text-muted-foreground tabular-nums">
                          {formatCurrency((item.snapshot.priceEuros || 0) * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-border/60 bg-muted/40 px-4 py-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t('summary.total')}</span>
                    <span className="font-bold text-foreground">
                      {formatPoints(totalPoints)} pts / {formatCurrency(totalEuros || 0)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                  <Button variant="outline" onClick={() => router.push('/cart')}>
                    {t('header.edit')}
                  </Button>
                  <Button variant="accent" onClick={() => setStep(2)}>
                    {t('actions.continue')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : null}

          {step === 2 ? (
            <Card className="overflow-hidden border border-border/70 bg-background/75 shadow-xl shadow-primary/5 backdrop-blur">
              <CardHeader className="border-b border-border/60 p-5 sm:p-7">
                <CardTitle className="text-lg font-black tracking-tight">
                  {t('address.title')}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{t('address.subtitle')}</p>
              </CardHeader>
              <CardContent className="p-5 sm:p-7">
                <form onSubmit={submitAddress} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {(() => {
                      const { ref, ...rest } = form.register('firstName')
                      return (
                        <Input
                          label={t('address.labels.first_name')}
                          autoComplete="given-name"
                          error={form.formState.errors.firstName?.message}
                          {...rest}
                          ref={ref}
                        />
                      )
                    })()}
                    {(() => {
                      const { ref, ...rest } = form.register('lastName')
                      return (
                        <Input
                          label={t('address.labels.last_name')}
                          autoComplete="family-name"
                          error={form.formState.errors.lastName?.message}
                          {...rest}
                          ref={ref}
                        />
                      )
                    })()}
                  </div>

                  {(() => {
                    const { ref, ...rest } = form.register('street')
                    return (
                      <Input
                        label={t('address.labels.street')}
                        autoComplete="address-line1"
                        error={form.formState.errors.street?.message}
                        {...rest}
                        ref={ref}
                      />
                    )
                  })()}

                  <div className="grid gap-4 sm:grid-cols-2">
                    {(() => {
                      const { ref, ...rest } = form.register('city')
                      return (
                        <Input
                          label={t('address.labels.city')}
                          autoComplete="address-level2"
                          error={form.formState.errors.city?.message}
                          {...rest}
                          ref={ref}
                        />
                      )
                    })()}
                    {(() => {
                      const { ref, ...rest } = form.register('postalCode')
                      return (
                        <Input
                          label={t('address.labels.postal_code')}
                          autoComplete="postal-code"
                          error={form.formState.errors.postalCode?.message}
                          {...rest}
                          ref={ref}
                        />
                      )
                    })()}
                  </div>

                  {(() => {
                    const { ref, ...rest } = form.register('country')
                    return (
                      <Input
                        label={t('address.labels.country')}
                        autoComplete="country-name"
                        error={form.formState.errors.country?.message}
                        {...rest}
                        ref={ref}
                      />
                    )
                  })()}

                  <div className="rounded-2xl border border-border/60 bg-muted/30 px-4 py-3">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">
                      {t('address.preview')}
                    </p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {addressPreview || t('summary.no_address')}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <Button type="button" variant="outline" onClick={() => setStep(1)}>
                      {t('header.back')}
                    </Button>
                    <Button type="submit" variant="accent" className="w-full sm:w-auto">
                      {t('actions.continue')}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : null}

          {step === 3 ? (
            <Card className="overflow-hidden border border-border/70 bg-background/75 shadow-xl shadow-primary/5 backdrop-blur">
              <CardHeader className="border-b border-border/60 p-5 sm:p-7">
                <CardTitle className="text-lg font-black tracking-tight">
                  {t('payment.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-5 sm:p-7">
                <div
                  role="radiogroup"
                  aria-label={t('payment.title')}
                  className="grid gap-3 sm:grid-cols-2"
                >
                  <button
                    type="button"
                    role="radio"
                    aria-checked={paymentMethod === 'points'}
                    className={cn(
                      'rounded-2xl border p-4 text-left transition-all',
                      paymentMethod === 'points'
                        ? 'border-primary/50 bg-primary/10'
                        : 'border-border/60 bg-background/70 hover:border-primary/30',
                    )}
                    onClick={() => setPaymentMethod('points')}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          'mt-0.5 flex h-10 w-10 items-center justify-center rounded-full',
                          paymentMethod === 'points'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground',
                        )}
                      >
                        <Wallet className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-foreground">{t('payment.points')}</p>
                          {paymentMethod === 'points' ? (
                            <Badge variant="secondary" className="rounded-full px-2">
                              {t('payment.selected')}
                            </Badge>
                          ) : null}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {t('payment.balance', { amount: formatPoints(pointsBalance) })}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {t('payment.points_help')}
                        </p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    role="radio"
                    aria-checked={paymentMethod === 'euros'}
                    className={cn(
                      'rounded-2xl border p-4 text-left transition-all',
                      paymentMethod === 'euros'
                        ? 'border-primary/50 bg-primary/10'
                        : 'border-border/60 bg-background/70 hover:border-primary/30',
                    )}
                    onClick={() => setPaymentMethod('euros')}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          'mt-0.5 flex h-10 w-10 items-center justify-center rounded-full',
                          paymentMethod === 'euros'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground',
                        )}
                      >
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-foreground">{t('payment.card')}</p>
                          {paymentMethod === 'euros' ? (
                            <Badge variant="secondary" className="rounded-full px-2">
                              {t('payment.selected')}
                            </Badge>
                          ) : null}
                        </div>
                        <p className="text-xs text-muted-foreground">{t('payment.simulation')}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {t('payment.card_help')}
                        </p>
                      </div>
                    </div>
                  </button>
                </div>

                <div className="space-y-4 border-t border-border/60 pt-5">
                  <h3 className="text-sm font-black uppercase tracking-[0.16em] text-muted-foreground">
                    {t('payment.preview_title')}
                  </h3>

                  {paymentMethod === 'points' ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                          {t('payment.current_balance')}
                        </p>
                        <p className="mt-2 text-lg font-semibold tabular-nums">
                          {formatPoints(pointsBalance)} pts
                        </p>
                      </div>
                      <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                          {t('payment.after_purchase')}
                        </p>
                        <p
                          className={cn(
                            'mt-2 text-lg font-semibold tabular-nums',
                            !hasEnoughPoints && 'text-destructive',
                          )}
                        >
                          {formatPoints(Math.max(0, remainingPoints))} pts
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        {t('payment.total_to_pay')}
                      </p>
                      <p className="mt-2 text-2xl font-black tabular-nums text-primary">
                        {formatCurrency(totalEuros || 0)}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {t('payment.simulated_notice')}
                      </p>
                    </div>
                  )}

                  {paymentMethod === 'points' && !hasEnoughPoints ? (
                    <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                      {t('errors.insufficient_points')}
                    </div>
                  ) : null}

                  <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/70 px-4 py-3">
                    <span className="text-sm text-muted-foreground">
                      {t('summary.total_order')}
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {paymentMethod === 'points'
                        ? `${formatPoints(totalPoints)} pts`
                        : formatCurrency(totalEuros || 0)}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:items-center sm:justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(2)}
                      disabled={placing}
                    >
                      {t('header.back')}
                    </Button>
                    <Button
                      className="w-full sm:w-auto"
                      variant="accent"
                      onClick={() => void confirmOrder()}
                      disabled={!canConfirmOrder || placing}
                      loading={placing}
                    >
                      {paymentMethod === 'points'
                        ? t('actions.confirm_points')
                        : t('actions.pay_simulation')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>

        <aside className="hidden lg:block lg:sticky lg:top-6 lg:self-start">
          <Card className="overflow-hidden border border-border/70 bg-background/80 shadow-xl shadow-primary/5 backdrop-blur">
            <CardHeader className="border-b border-border/60 p-5 pb-4">
              <CardTitle className="text-lg font-black tracking-tight">
                {t('summary.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-5">
              <div className="space-y-2.5">
                {items.slice(0, 5).map((item) => (
                  <div key={item.productId} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {item.snapshot.name}
                      </p>
                      <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                    </div>
                    <p className="text-xs font-bold text-foreground tabular-nums">
                      {formatPoints(item.snapshot.pricePoints * item.quantity)} pts
                    </p>
                  </div>
                ))}
                {items.length > 5 ? (
                  <p className="text-xs text-muted-foreground">
                    {t('summary.other_items', { count: items.length - 5 })}
                  </p>
                ) : null}
              </div>

              <div className="rounded-2xl border border-border/60 bg-muted/35 px-4 py-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>{t('summary.items_label', { count: itemsCount })}</span>
                    <span className="tabular-nums">{formatPoints(totalPoints)} pts</span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>{t('summary.shipping')}</span>
                    <span>{t('summary.shipping_free')}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-border/60 pt-2">
                    <span className="font-semibold text-foreground">{t('summary.total')}</span>
                    <span className="font-black text-foreground tabular-nums">
                      {formatPoints(totalPoints)} pts
                    </span>
                  </div>
                  {totalEuros > 0 ? (
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{t('payment.total_to_pay')}</span>
                      <span className="tabular-nums">{formatCurrency(totalEuros)}</span>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="rounded-2xl border border-border/60 bg-background/75 px-4 py-3">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">
                  {t('summary.payment_method')}
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">{paymentLabel}</p>
              </div>

              <div className="rounded-2xl border border-border/60 bg-background/75 px-4 py-3">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">
                  {t('summary.saved_address')}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-foreground">
                  {addressPreview || t('summary.no_address')}
                </p>
              </div>

              <p className="text-xs text-muted-foreground">{t('summary.sticky_note')}</p>
            </CardContent>
          </Card>
        </aside>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/90 backdrop-blur md:hidden">
        <div className="container mx-auto flex items-center justify-between gap-3 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">{t('summary.total')}</p>
            <p className="truncate text-base font-semibold text-foreground">
              {formatPoints(totalPoints)} pts / {formatCurrency(totalEuros || 0)}
            </p>
            <p className="text-[11px] text-muted-foreground">{t('footer.no_hidden_fees')}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={footerStatusVariant} className="rounded-full">
              {footerStatusLabel}
            </Badge>
            <Button
              size="sm"
              variant="accent"
              className="rounded-full px-4"
              onClick={handlePrimaryMobileAction}
              disabled={mobilePrimaryDisabled}
              loading={placing && step === 3}
            >
              {mobilePrimaryLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
