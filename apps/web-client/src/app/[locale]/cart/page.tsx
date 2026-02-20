'use client'

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Separator,
} from '@make-the-change/core/ui'
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Leaf,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRef, useState } from 'react'
import { CartLineItem } from '@/app/[locale]/(marketing-no-footer)/cart/_features/cart-line-item'
import { useCartUI } from '@/app/[locale]/(marketing-no-footer)/cart/_features/cart-ui-provider'
import {
  useCart,
  useCartTotals,
} from '@/app/[locale]/(marketing-no-footer)/cart/_features/use-cart'
import { Link, useRouter } from '@/i18n/navigation'
import { cn, formatCurrency, formatPoints } from '@/lib/utils'

const isOutOfStockSnapshot = (stockQuantity?: number | null) =>
  stockQuantity != null && stockQuantity <= 0

const CartPage = () => {
  const t = useTranslations('checkout')
  const tCommon = useTranslations('common')
  const router = useRouter()
  const { items, hydrated, setQuantity, removeItem, replaceItems, clear } = useCart()
  const { itemsCount, totalPoints, totalEuros } = useCartTotals()
  const { showSnackbar } = useCartUI()
  const itemsRef = useRef(items)
  const [isMobileSummaryOpen, setIsMobileSummaryOpen] = useState(false)
  itemsRef.current = items

  const currentStep = 1
  const hasOutOfStock = items.some((i) => isOutOfStockSnapshot(i.snapshot.stockQuantity))
  const firstOutOfStockItem = items.find((i) => isOutOfStockSnapshot(i.snapshot.stockQuantity))
  const canCheckout = itemsCount > 0 && !hasOutOfStock
  const checkoutSteps = [
    { id: 1, label: t('steps.cart'), hint: t('steps.hints.cart') },
    { id: 2, label: t('steps.address'), hint: t('steps.hints.address') },
    { id: 3, label: t('steps.confirm'), hint: t('steps.hints.confirm') },
  ]
  const mobileCtaLabel = !hydrated
    ? tCommon('loading')
    : itemsCount === 0
      ? t('empty.cta')
      : hasOutOfStock
        ? t('cart_page.mobile_bar.remove_unavailable')
        : t('cart_page.mobile_bar.continue_to_address')
  const mobileCtaContext = !hydrated
    ? tCommon('loading')
    : itemsCount === 0
      ? t('cart_page.mobile_bar.empty_state')
      : hasOutOfStock
        ? t('cart_page.mobile_bar.out_of_stock_state')
        : t('cart_page.mobile_bar.next_step')
  const desktopCtaLabel = !hydrated
    ? tCommon('loading')
    : itemsCount === 0
      ? t('empty.cta')
      : hasOutOfStock
        ? t('cart_page.mobile_bar.remove_unavailable')
        : t('cart_page.mobile_bar.continue_to_address')
  const desktopCtaContext = !hydrated
    ? tCommon('loading')
    : itemsCount === 0
      ? t('cart_page.mobile_bar.empty_state')
      : hasOutOfStock
        ? t('cart_page.mobile_bar.out_of_stock_state')
        : t('cart_page.mobile_bar.next_step')

  const handleBack = () => {
    router.push('/products')
  }

  const handleProceedToCheckout = () => {
    router.push('/checkout')
  }

  const handleClear = () => {
    const previous = items
    clear()
    showSnackbar({
      message: t('cart_page.snackbar.cleared'),
      actionLabel: t('cart_page.snackbar.undo'),
      onAction: () => replaceItems(previous),
    })
  }

  const handleRemove = (productId: string) => {
    const removedIndex = items.findIndex((i) => i.productId === productId)
    const removedItem = items[removedIndex]
    if (!removedItem) return

    removeItem(productId)
    showSnackbar({
      message: t('cart_page.snackbar.item_removed'),
      actionLabel: t('cart_page.snackbar.undo'),
      onAction: () => {
        const current = itemsRef.current
        const existingIndex = current.findIndex((i) => i.productId === removedItem.productId)

        if (existingIndex >= 0) {
          const next = [...current]
          const existing = next[existingIndex]
          if (!existing) {
            const insertAt = Math.min(Math.max(0, removedIndex), next.length)
            next.splice(insertAt, 0, removedItem)
            replaceItems(next)
            return
          }

          next[existingIndex] = {
            ...existing,
            quantity: (existing.quantity || 0) + (removedItem.quantity || 0),
            snapshot: { ...existing.snapshot, ...removedItem.snapshot },
          }
          replaceItems(next)
          return
        }

        const next = [...current]
        const insertAt = Math.min(Math.max(0, removedIndex), next.length)
        next.splice(insertAt, 0, removedItem)
        replaceItems(next)
      },
    })
  }

  const handlePrimaryAction = () => {
    if (!hydrated) return
    if (itemsCount === 0) {
      router.push('/products')
      return
    }

    if (hasOutOfStock && firstOutOfStockItem) {
      handleRemove(firstOutOfStockItem.productId)
      return
    }

    handleProceedToCheckout()
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background selection:bg-primary/20">
      {/* Background Elements (Dribbble 2026 Style) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] h-125 w-125 rounded-full bg-primary/5 blur-[100px] animate-pulse duration-4000" />
        <div className="absolute bottom-[-10%] left-[-10%] h-150 w-150 rounded-full bg-client-teal-400/5 blur-[120px] animate-pulse duration-6000" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <div className="container relative z-10 mx-auto px-4 pt-8 pb-40 md:pt-10 md:pb-12 lg:py-24">
        {/* Header Section */}
        <div className="mb-8 md:mb-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="hover:bg-primary/10 hover:text-primary transition-colors rounded-full"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('cart_page.continue_shopping')}
              </Button>
              <Badge
                variant="secondary"
                className="hidden md:inline-flex rounded-full border border-border/60 bg-background/80 text-muted-foreground"
              >
                {t('summary.items_label', { count: itemsCount })}
              </Badge>
            </div>

            {itemsCount > 0 && (
              <Button
                variant="outline"
                onClick={handleClear}
                className="hidden md:inline-flex text-muted-foreground hover:text-destructive hover:border-destructive/30 hover:bg-destructive/5 rounded-full transition-all"
              >
                {t('cart_page.clear_cart')}
              </Button>
            )}
          </div>

          <div className="mt-4 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-bold text-primary backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Sparkles className="h-3 w-3" />
                <span className="uppercase tracking-widest">{t('cart_page.badge')}</span>
              </div>
              <h1 className="text-4xl sm:text-5xl xl:text-[4.25rem] font-black tracking-tight text-foreground animate-in fade-in slide-in-from-bottom-6 duration-700">
                {t('cart_page.hero_title_prefix')}{' '}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-client-teal-400">
                  {t('cart_page.hero_title_highlight')}
                </span>
              </h1>
              <p className="mt-2 hidden md:block text-sm font-medium text-muted-foreground">
                {desktopCtaContext}
              </p>
            </div>
          </div>

          <div className="mt-6 hidden md:block sticky top-16 z-20">
            <div className="rounded-2xl border border-border/60 bg-background/85 p-2 backdrop-blur-xl">
              <div className="grid gap-2 md:grid-cols-3">
                {checkoutSteps.map((step) => {
                  const isCurrent = step.id === currentStep
                  return (
                    <div
                      key={step.id}
                      className={cn(
                        'rounded-xl border px-3 py-2 transition-all',
                        isCurrent
                          ? 'border-primary/50 bg-primary/10'
                          : 'border-border/60 bg-background/60',
                      )}
                    >
                      <div className="flex items-start gap-2">
                        <div
                          className={cn(
                            'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-black',
                            isCurrent
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground',
                          )}
                        >
                          {step.id}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{step.label}</p>
                          <p className="text-[11px] text-muted-foreground">{step.hint}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="sticky top-14 z-30 -mx-4 mb-6 border-y border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl md:hidden">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              {t('steps.step_indicator', { current: currentStep, total: checkoutSteps.length })}
            </p>
            {itemsCount > 0 ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="h-7 rounded-full px-3 text-[11px] font-semibold"
              >
                {t('cart_page.clear_cart')}
              </Button>
            ) : null}
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {checkoutSteps.map((step) => {
              const isCurrent = step.id === currentStep
              return (
                <div
                  key={`mobile-step-${step.id}`}
                  className={cn(
                    'rounded-xl border px-2 py-2 text-center transition-colors',
                    isCurrent
                      ? 'border-primary/40 bg-primary/10 text-foreground'
                      : 'border-border/60 bg-background/70 text-muted-foreground',
                  )}
                >
                  <div
                    className={cn(
                      'mx-auto mb-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black',
                      isCurrent
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground',
                    )}
                  >
                    {step.id}
                  </div>
                  <p className="truncate text-[11px] font-semibold">{step.label}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Cart Items */}
          <div className="lg:col-span-8 space-y-6">
            {!hydrated ? (
              // Loading State
              <div className="space-y-4 animate-pulse">
                {[1, 2].map((i) => (
                  <div key={i} className="h-32 rounded-4xl bg-muted/50 border border-border/50" />
                ))}
              </div>
            ) : itemsCount === 0 ? (
              // Empty State
              <Card className="border-border/50 bg-background/50 backdrop-blur-sm shadow-xl rounded-[2.5rem] overflow-hidden animate-in zoom-in-95 duration-500">
                <CardContent className="flex flex-col items-center justify-center gap-6 py-14 sm:py-20 text-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                    <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-linear-to-br from-background to-muted border border-client-white/10 shadow-inner">
                      <ShoppingBag className="h-10 w-10 text-primary" />
                    </div>
                  </div>
                  <div className="space-y-2 max-w-md">
                    <h3 className="text-2xl font-black tracking-tight">{t('empty.title')}</h3>
                    <p className="text-muted-foreground font-medium">{t('empty.description')}</p>
                  </div>
                  <Button
                    asChild
                    size="lg"
                    className="mt-4 rounded-full px-8 font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                  >
                    <Link href="/products">
                      {t('empty.cta')}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              // Items List
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                {hasOutOfStock && (
                  <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-6 py-4 flex items-center gap-3 text-destructive animate-pulse">
                    <div className="h-2 w-2 rounded-full bg-destructive" />
                    <span className="font-semibold">{t('cart_page.out_of_stock_alert')}</span>
                  </div>
                )}

                <div className="hidden md:grid grid-cols-[minmax(0,1fr)_176px_140px_44px] items-center rounded-xl border border-border/60 bg-background/70 px-6 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  <span>{t('cart_page.desktop_columns.product')}</span>
                  <span className="text-center">{t('cart_page.desktop_columns.quantity')}</span>
                  <span className="text-right">{t('cart_page.desktop_columns.total')}</span>
                  <span />
                </div>

                <div className="space-y-4 md:hidden">
                  {items.map((item, index) => (
                    <div
                      key={`mobile-item-${item.productId}`}
                      className="group relative transition-all duration-300 hover:-translate-y-1"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CartLineItem
                        item={item}
                        onQuantityChange={(next) => setQuantity(item.productId, next)}
                        onRemove={() => handleRemove(item.productId)}
                        className="border-border/50 bg-background/60 backdrop-blur-md shadow-sm hover:shadow-xl hover:border-primary/20 rounded-4xl transition-all duration-300"
                      />
                    </div>
                  ))}
                </div>

                <div className="hidden space-y-4 md:block">
                  {items.map((item, index) => (
                    <div
                      key={`desktop-item-${item.productId}`}
                      className="group relative transition-all duration-300"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CartLineItem
                        item={item}
                        layout="desktop"
                        onQuantityChange={(next) => setQuantity(item.productId, next)}
                        onRemove={() => handleRemove(item.productId)}
                        className="rounded-4xl border-border/50 bg-background/60 backdrop-blur-md shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Summary (Sticky) */}
          <div className="hidden md:block lg:col-span-4">
            <div className="sticky top-24 space-y-4 animate-in fade-in slide-in-from-right-8 duration-700 delay-300 xl:max-w-107.5 xl:ml-auto">
              <Card className="border-border/50 bg-background/80 backdrop-blur-xl shadow-2xl shadow-primary/5 rounded-[2.5rem] overflow-hidden">
                <CardHeader className="bg-muted/30 border-b border-border/50 pb-5">
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-xl font-black tracking-tight flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      {t('summary.total_order')}
                    </CardTitle>
                    <Badge
                      variant="secondary"
                      className="rounded-full border border-primary/20 bg-primary/10 text-primary"
                    >
                      {t('steps.step_indicator', { current: 1, total: 3 })}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6 xl:p-7 space-y-5">
                  <div className="rounded-2xl border border-border/60 bg-background/70 px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                      {t('summary.items_label', { count: itemsCount })}
                    </p>
                    <p className="mt-1 text-sm font-medium text-foreground">{desktopCtaContext}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground font-medium">
                        {t('cart_page.subtotal')}
                      </span>
                      <span className="font-bold">{formatPoints(totalPoints)} pts</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground font-medium">
                        {t('cart_page.shipping')}
                      </span>
                      <span className="text-client-emerald-500 font-bold">
                        {t('cart_page.free_shipping')}
                      </span>
                    </div>
                    <Separator className="bg-border/50" />
                    <div className="flex justify-between items-end">
                      <span className="text-lg font-black uppercase tracking-tight">
                        {t('summary.total')}
                      </span>
                      <div className="text-right">
                        <div className="text-3xl font-black text-primary leading-none">
                          {formatPoints(totalPoints)} <span className="text-lg">pts</span>
                        </div>
                        {totalEuros > 0 && (
                          <div className="text-sm text-muted-foreground font-medium mt-1">
                            ~ {formatCurrency(totalEuros)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] transition-all bg-linear-to-r from-primary to-client-teal-500 border-none"
                    size="lg"
                    disabled={!hydrated || (hasOutOfStock && !firstOutOfStockItem)}
                    onClick={handlePrimaryAction}
                  >
                    {desktopCtaLabel}
                    {itemsCount > 0 && !hasOutOfStock ? (
                      <ArrowRight className="ml-2 h-5 w-5" />
                    ) : null}
                  </Button>

                  {!canCheckout && hasOutOfStock ? (
                    <p className="text-xs font-medium text-destructive">
                      {t('cart_page.out_of_stock_alert')}
                    </p>
                  ) : null}

                  <p className="text-xs text-muted-foreground font-medium">
                    {t('footer.no_hidden_fees')} • {t('cart_page.free_shipping')}
                  </p>

                  {/* Trust Badges */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-muted/50 border border-border/50 text-center">
                      <ShieldCheck className="h-5 w-5 text-client-emerald-500 mb-2" />
                      <span className="text-[10px] font-bold uppercase text-muted-foreground">
                        {t('cart_page.trust.payment_secure')}
                      </span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-muted/50 border border-border/50 text-center">
                      <Leaf className="h-5 w-5 text-client-emerald-500 mb-2" />
                      <span className="text-[10px] font-bold uppercase text-muted-foreground">
                        {t('cart_page.trust.impact')}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Info */}
              <div className="rounded-3xl bg-client-blue-500/5 border border-client-blue-500/10 p-5 backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-client-blue-500/10 text-client-blue-500">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm mb-1">
                      {t('cart_page.instant_delivery.title')}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {t('cart_page.instant_delivery.description')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/90 backdrop-blur-xl md:hidden">
        <div className="mx-auto w-full max-w-2xl px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3">
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-xl border border-border/50 bg-background/70 px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => setIsMobileSummaryOpen((prev) => !prev)}
          >
            <span className="inline-flex items-center gap-2">
              {isMobileSummaryOpen ? (
                <ChevronDown className="h-3.5 w-3.5" />
              ) : (
                <ChevronUp className="h-3.5 w-3.5" />
              )}
              {isMobileSummaryOpen
                ? t('cart_page.mobile_bar.hide_details')
                : t('cart_page.mobile_bar.view_details')}
            </span>
            <span className="font-bold text-foreground tabular-nums">
              {formatPoints(totalPoints)} pts
            </span>
          </button>

          {isMobileSummaryOpen ? (
            <div className="mt-3 rounded-2xl border border-border/50 bg-background/70 p-3 text-xs">
              <div className="space-y-2 text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>{t('cart_page.subtotal')}</span>
                  <span className="font-semibold text-foreground tabular-nums">
                    {formatPoints(totalPoints)} pts
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{t('cart_page.shipping')}</span>
                  <span className="font-semibold text-client-emerald-500">
                    {t('cart_page.free_shipping')}
                  </span>
                </div>
              </div>
              <Separator className="my-3 bg-border/50" />
              <div className="grid grid-cols-2 gap-2 text-[10px] font-bold uppercase text-muted-foreground">
                <div className="rounded-xl border border-border/50 bg-muted/40 px-2 py-2 text-center">
                  {t('cart_page.trust.payment_secure')}
                </div>
                <div className="rounded-xl border border-border/50 bg-muted/40 px-2 py-2 text-center">
                  {t('cart_page.trust.impact')}
                </div>
              </div>
            </div>
          ) : null}

          <div className="mt-3 flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-[11px] font-medium text-muted-foreground">
                {mobileCtaContext}
              </p>
              <p className="text-xl font-black leading-tight text-foreground tabular-nums">
                {formatPoints(totalPoints)}{' '}
                <span className="text-sm font-semibold text-muted-foreground">pts</span>
              </p>
            </div>
            <Badge
              variant="secondary"
              className="shrink-0 rounded-full border border-primary/20 bg-primary/10 text-primary"
            >
              {t('steps.step_indicator', { current: currentStep, total: checkoutSteps.length })}
            </Badge>
          </div>

          <Button
            type="button"
            className="mt-3 h-12 w-full rounded-xl border-none bg-linear-to-r from-primary to-client-teal-500 text-sm font-bold shadow-lg shadow-primary/20"
            disabled={!hydrated || (hasOutOfStock && !firstOutOfStockItem)}
            onClick={handlePrimaryAction}
          >
            {mobileCtaLabel}
            {itemsCount > 0 && !hasOutOfStock ? <ArrowRight className="ml-2 h-4 w-4" /> : null}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CartPage
