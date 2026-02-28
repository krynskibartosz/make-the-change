'use client'

import { Badge, Button, Separator } from '@make-the-change/core/ui'
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  type LucideIcon,
  MapPin,
  ShoppingBag,
} from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useRef } from 'react'
import { CartLineItem } from '@/app/[locale]/(marketing-no-footer)/cart/_features/cart-line-item'
import { useCartUI } from '@/app/[locale]/(marketing-no-footer)/cart/_features/cart-ui-provider'
import {
  useCart,
  useCartTotals,
} from '@/app/[locale]/(marketing-no-footer)/cart/_features/use-cart'
import { Link, useRouter } from '@/i18n/navigation'
import { CHECKOUT_AVAILABLE, getCheckoutUnavailableCopy } from '@/lib/checkout-status'
import { cn, formatCurrency, formatPoints } from '@/lib/utils'

const isOutOfStockSnapshot = (stockQuantity?: number | null) =>
  stockQuantity != null && stockQuantity <= 0

type StepState = 'completed' | 'active' | 'disabled'

const CartPage = () => {
  const t = useTranslations('checkout')
  const tCommon = useTranslations('common')
  const locale = useLocale()
  const router = useRouter()
  const { items, hydrated, setQuantity, removeItem, replaceItems, clear } = useCart()
  const { itemsCount, totalPoints, totalEuros } = useCartTotals()
  const { showSnackbar } = useCartUI()
  const checkoutCopy = getCheckoutUnavailableCopy(locale)
  const itemsRef = useRef(items)
  itemsRef.current = items

  const currentStep = 1
  const hasOutOfStock = items.some((i) => isOutOfStockSnapshot(i.snapshot.stockQuantity))
  const firstOutOfStockItem = items.find((i) => isOutOfStockSnapshot(i.snapshot.stockQuantity))
  const canCheckout = itemsCount > 0 && !hasOutOfStock && CHECKOUT_AVAILABLE
  const checkoutSteps: Array<{ id: number; label: string; icon: LucideIcon }> = [
    { id: 1, label: t('steps.cart'), icon: ShoppingBag },
    { id: 2, label: t('steps.address'), icon: MapPin },
    { id: 3, label: t('steps.confirm'), icon: CreditCard },
  ]
  const primaryCtaLabel = !hydrated
    ? tCommon('loading')
    : itemsCount === 0
      ? t('empty.cta')
      : hasOutOfStock
        ? t('cart_page.mobile_bar.remove_unavailable')
        : CHECKOUT_AVAILABLE
          ? t('cart_page.mobile_bar.continue_to_address')
          : checkoutCopy.cartActionLabel

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

    if (!CHECKOUT_AVAILABLE) {
      return
    }

    handleProceedToCheckout()
  }

  const primaryActionDisabled =
    !hydrated ||
    (!CHECKOUT_AVAILABLE && itemsCount > 0 && !hasOutOfStock) ||
    (hasOutOfStock && !firstOutOfStockItem)

  const getStepState = (stepId: number): StepState => {
    if (stepId < currentStep) return 'completed'
    if (stepId === currentStep) return 'active'
    return 'disabled'
  }

  return (
    <div className="relative min-h-screen bg-background selection:bg-primary/20">
      <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-border/70 bg-background/95 backdrop-blur">
        <div className="flex h-full items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="h-full rounded-none px-4 font-semibold"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('cart_page.continue_shopping')}
          </Button>
          {itemsCount > 0 ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-full rounded-none px-4 font-semibold text-muted-foreground hover:text-destructive"
            >
              {t('cart_page.clear_cart')}
            </Button>
          ) : (
            <div />
          )}
        </div>
      </header>

      <div className="fixed inset-x-0 top-16 z-40 h-14 border-b border-border/70 bg-background/95 backdrop-blur">
        <div className="grid h-full grid-cols-3">
          {checkoutSteps.map((step) => {
            const stepState = getStepState(step.id)
            const isActive = stepState === 'active'
            const isCompleted = stepState === 'completed'
            const StepIcon = step.icon
            return (
              <div
                key={step.id}
                className={cn(
                  'flex h-full items-center justify-center gap-2 border-r border-border/60 px-2 text-sm font-semibold last:border-r-0',
                  isActive && 'bg-primary/10 text-foreground',
                  isCompleted && 'bg-client-emerald-500/10 text-client-emerald-500',
                  stepState === 'disabled' && 'text-muted-foreground',
                )}
              >
                <span
                  className={cn(
                    'flex h-6 w-6 items-center justify-center rounded-full border',
                    isActive && 'border-primary/40 bg-primary/15 text-primary',
                    isCompleted &&
                      'border-client-emerald-500/30 bg-client-emerald-500/15 text-client-emerald-500',
                    stepState === 'disabled' && 'border-border/60 bg-muted text-muted-foreground',
                  )}
                >
                  <StepIcon className="h-3.5 w-3.5" />
                </span>
                <span className="truncate">{step.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      <main className="min-h-screen pb-24 pt-[7.5rem] lg:pb-6 lg:pr-[26rem]">
        {!hydrated ? (
          <div className="mt-4 space-y-3 animate-pulse">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="mx-3 h-32 border-y border-border/50 bg-muted/40 md:mx-4 lg:mx-5"
              />
            ))}
          </div>
        ) : itemsCount === 0 ? (
          <div className="flex min-h-[calc(100vh-7.5rem)] flex-col items-center justify-center gap-5 border-y border-border/50 px-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border/60 bg-muted/40">
              <ShoppingBag className="h-7 w-7 text-primary" />
            </div>
            <p className="text-lg font-semibold">{t('empty.title')}</p>
            <Button asChild>
              <Link href="/products">
                {t('empty.cta')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {hasOutOfStock ? (
              <div className="mx-3 border-y border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive md:mx-4 lg:mx-5">
                {t('cart_page.out_of_stock_alert')}
              </div>
            ) : null}
            {!CHECKOUT_AVAILABLE && itemsCount > 0 && !hasOutOfStock ? (
              <div className="mx-3 border-y border-warning/30 bg-warning/10 px-4 py-3 text-sm font-medium text-warning md:mx-4 lg:mx-5">
                {checkoutCopy.cartNotice}
              </div>
            ) : null}

            <div className="mx-3 hidden md:grid grid-cols-[minmax(0,1fr)_176px_140px_44px] items-center border-y border-border/60 bg-background/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground md:mx-4 lg:mx-5">
              <span>{t('cart_page.desktop_columns.product')}</span>
              <span className="text-center">{t('cart_page.desktop_columns.quantity')}</span>
              <span className="text-right">{t('cart_page.desktop_columns.total')}</span>
              <span />
            </div>

            <div className="space-y-3 md:hidden">
              {items.map((item) => (
                <CartLineItem
                  key={`mobile-item-${item.productId}`}
                  item={item}
                  onQuantityChange={(next) => setQuantity(item.productId, next)}
                  onRemove={() => handleRemove(item.productId)}
                  className="mx-3 md:mx-4 lg:mx-5"
                />
              ))}
            </div>

            <div className="hidden space-y-3 md:block">
              {items.map((item) => (
                <CartLineItem
                  key={`desktop-item-${item.productId}`}
                  item={item}
                  layout="desktop"
                  onQuantityChange={(next) => setQuantity(item.productId, next)}
                  onRemove={() => handleRemove(item.productId)}
                  className="mx-3 md:mx-4 lg:mx-5"
                />
              ))}
            </div>
          </div>
        )}
      </main>

      <aside className="fixed bottom-0 right-0 top-[7.5rem] z-30 hidden w-[26rem] border-l border-border/70 bg-background lg:block">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-border/70 px-4 py-4">
            <div className="flex items-center gap-2 text-lg font-black tracking-tight">
              <CreditCard className="h-5 w-5 text-primary" />
              <span>{t('summary.total_order')}</span>
            </div>
            <Badge
              variant="secondary"
              className="rounded-full border border-primary/20 bg-primary/10 text-primary"
            >
              {t('steps.step_indicator', { current: currentStep, total: checkoutSteps.length })}
            </Badge>
          </div>

          <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('cart_page.subtotal')}</span>
                <span className="font-bold">{formatPoints(totalPoints)} pts</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('cart_page.shipping')}</span>
                <span className="font-bold text-client-emerald-500">
                  {t('cart_page.free_shipping')}
                </span>
              </div>
              <Separator />
              <div className="flex items-end justify-between">
                <span className="text-lg font-black uppercase tracking-tight">
                  {t('summary.total')}
                </span>
                <div className="text-right">
                  <div className="text-3xl font-black leading-none text-primary">
                    {formatPoints(totalPoints)} <span className="text-lg">pts</span>
                  </div>
                  {totalEuros > 0 ? (
                    <div className="mt-1 text-xs text-muted-foreground">
                      ~ {formatCurrency(totalEuros)}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="mt-auto space-y-3">
              <Button
                className="h-12 w-full border-none bg-linear-to-r from-primary to-client-teal-500 text-base font-bold"
                disabled={primaryActionDisabled}
                onClick={handlePrimaryAction}
              >
                {primaryCtaLabel}
                {itemsCount > 0 && !hasOutOfStock && CHECKOUT_AVAILABLE ? (
                  <ArrowRight className="ml-2 h-4 w-4" />
                ) : null}
              </Button>
              {!canCheckout && hasOutOfStock ? (
                <p className="text-xs font-medium text-destructive">
                  {t('cart_page.out_of_stock_alert')}
                </p>
              ) : null}
              {!CHECKOUT_AVAILABLE && itemsCount > 0 && !hasOutOfStock ? (
                <p className="text-xs font-medium text-warning">{checkoutCopy.cartActionHint}</p>
              ) : null}
            </div>
          </div>
        </div>
      </aside>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/95 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-3 px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3">
          <div className="min-w-0">
            <p className="truncate text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              {t('steps.step_indicator', { current: currentStep, total: checkoutSteps.length })}
            </p>
            <p className="text-lg font-black leading-tight text-foreground">
              {formatPoints(totalPoints)} <span className="text-sm font-semibold">pts</span>
            </p>
          </div>
          <Button
            type="button"
            className="h-11 min-w-[180px] border-none bg-linear-to-r from-primary to-client-teal-500 text-sm font-bold"
            disabled={primaryActionDisabled}
            onClick={handlePrimaryAction}
          >
            {primaryCtaLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CartPage
