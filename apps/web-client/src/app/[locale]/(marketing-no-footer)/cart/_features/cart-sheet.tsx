'use client'

import {
  Badge,
  BottomSheet,
  BottomSheetContent,
  Button,
  Card,
  CardContent,
  Skeleton,
} from '@make-the-change/core/ui'
import { ShoppingBag, X } from 'lucide-react'
import { useRef } from 'react'
import { Link, useRouter } from '@/i18n/navigation'
import { cn, formatCurrency, formatPoints } from '@/lib/utils'
import { CartLineItem } from './cart-line-item'
import { useCartUI } from './cart-ui-provider'
import { useCart, useCartTotals } from './use-cart'

const isOutOfStockSnapshot = (stockQuantity?: number | null) =>
  stockQuantity !== null && stockQuantity !== undefined && stockQuantity <= 0

export function CartSheet() {
  const router = useRouter()
  const { items, hydrated, setQuantity, removeItem, replaceItems, clear } = useCart()
  const { itemsCount, totalPoints, totalEuros } = useCartTotals()
  const { isCartOpen, openCart, closeCart, showSnackbar } = useCartUI()
  const itemsRef = useRef(items)
  itemsRef.current = items

  const hasOutOfStock = items.some((i) => isOutOfStockSnapshot(i.snapshot.stockQuantity))
  const canCheckout = itemsCount > 0 && !hasOutOfStock

  const handleRemove = (productId: string) => {
    const removedIndex = items.findIndex((i) => i.productId === productId)
    const removedItem = items[removedIndex]
    if (!removedItem) return

    removeItem(productId)
    showSnackbar({
      message: 'Article supprimé',
      actionLabel: 'Annuler',
      onAction: () => {
        const current = itemsRef.current
        const existingIndex = current.findIndex((i) => i.productId === removedItem.productId)

        if (existingIndex >= 0) {
          const next = [...current]
          const existing = next[existingIndex]
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

  const handleClear = () => {
    const previous = items
    clear()
    showSnackbar({
      message: 'Panier vidé',
      actionLabel: 'Annuler',
      onAction: () => replaceItems(previous),
    })
  }

  return (
    <BottomSheet
      open={isCartOpen}
      onOpenChange={(open) => {
        if (open) openCart()
        else closeCart()
      }}
    >
      <BottomSheetContent
        showHandle={false}
        showCloseButton={false}
        className="overflow-y-hidden p-0"
      >
        <div className="flex max-h-[85svh] flex-col">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 border-b bg-background/95 px-4 py-3 backdrop-blur">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                Votre panier <span className="text-muted-foreground">({itemsCount})</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Paiement en points • Aucun frais caché
              </p>
            </div>

            <div className="flex items-center gap-2">
              {itemsCount > 0 ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-11"
                  onClick={handleClear}
                >
                  Vider
                </Button>
              ) : null}

              {/* Removed redundant "Voir tout" link that caused loops if already on /cart or similar flows.
                  On mobile, this sheet IS the main cart view. */}

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-11 w-11"
                aria-label="Fermer"
                onClick={closeCart}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Body (scroll) */}
          <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
            {!hydrated ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <Card key={idx} className="border bg-background/70 shadow-sm backdrop-blur">
                    <CardContent className="flex gap-4 p-4">
                      <Skeleton className="h-20 w-20 rounded-2xl" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-3/5" />
                        <Skeleton className="h-4 w-2/5" />
                        <Skeleton className="h-10 w-32 rounded-xl" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : itemsCount === 0 ? (
              <Card className="border bg-background/70 shadow-sm backdrop-blur">
                <CardContent className="flex flex-col items-center justify-center gap-4 py-10 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <ShoppingBag className="h-7 w-7 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-semibold">Votre panier est vide</p>
                    <p className="text-sm text-muted-foreground">
                      Ajoutez un produit en un tap avec le bouton +
                    </p>
                  </div>
                  <Button asChild className="w-full sm:w-auto" onClick={closeCart}>
                    <Link href="/products">Explorer la boutique</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {hasOutOfStock ? (
                  <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    Un article est en rupture. Retirez-le pour continuer.
                  </div>
                ) : null}

                {items.map((item) => (
                  <CartLineItem
                    key={item.productId}
                    item={item}
                    density="compact"
                    onQuantityChange={(next) => setQuantity(item.productId, next)}
                    onRemove={() => handleRemove(item.productId)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t bg-background/95 px-4 py-4 backdrop-blur">
            <div className="space-y-3">
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Sous-total</span>
                  <span className="tabular-nums">{formatPoints(totalPoints)} pts</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Livraison</span>
                  <span className="tabular-nums">0 pts</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Taxes</span>
                  <span className="tabular-nums">0 pts</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">Total</span>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-semibold text-foreground tabular-nums">
                    {formatPoints(totalPoints)} pts
                  </span>
                  {totalEuros > 0 && (
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {formatCurrency(totalEuros)}
                    </span>
                  )}
                </div>
              </div>

              <Button
                type="button"
                size="lg"
                variant="accent"
                className="w-full"
                disabled={!canCheckout}
                onClick={() => {
                  closeCart()
                  router.push('/checkout')
                }}
              >
                Passer commande
                {itemsCount > 0 ? (
                  <Badge
                    variant="secondary"
                    className={cn(
                      'ml-2 rounded-full bg-background/60 text-foreground',
                      'border border-[hsl(var(--border)/0.6)]',
                    )}
                  >
                    {itemsCount}
                  </Badge>
                ) : null}
              </Button>
            </div>
          </div>
        </div>
      </BottomSheetContent>
    </BottomSheet>
  )
}
