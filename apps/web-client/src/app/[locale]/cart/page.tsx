'use client'

import { Badge, Button, Card, CardContent } from '@make-the-change/core/ui'
import { ArrowLeft, ArrowRight, ShoppingBag } from 'lucide-react'
import { useRef } from 'react'
import { SectionContainer } from '@/components/ui/section-container'
import { CartLineItem } from '@/features/commerce/cart/cart-line-item'
import { useCartUI } from '@/features/commerce/cart/cart-ui-provider'
import { useCart, useCartTotals } from '@/features/commerce/cart/use-cart'
import { Link, useRouter } from '@/i18n/navigation'
import { formatPoints } from '@/lib/utils'

const isOutOfStockSnapshot = (stockQuantity?: number | null) =>
  stockQuantity !== null && stockQuantity !== undefined && stockQuantity <= 0

export default function CartPage() {
  const router = useRouter()
  const { items, hydrated, setQuantity, removeItem, replaceItems, clear } = useCart()
  const { itemsCount, totalPoints } = useCartTotals()
  const { showSnackbar } = useCartUI()
  const itemsRef = useRef(items)
  itemsRef.current = items

  const hasOutOfStock = items.some((i) => isOutOfStockSnapshot(i.snapshot.stockQuantity))
  const canCheckout = itemsCount > 0 && !hasOutOfStock
  const handleBack = () => {
    // Explicitly go to products to avoid history loops between checkout and cart
    router.push('/products')
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

  return (
    <SectionContainer
      size="md"
      className="min-h-[calc(100svh-4rem)] bg-gradient-to-b from-background via-background to-muted/20 py-4 sm:py-6"
    >
      <div className="space-y-5 pb-[calc(7rem+env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <Button variant="ghost" size="sm" onClick={handleBack} aria-label="Retour">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Panier</h1>
              <p className="text-sm text-muted-foreground">
                {itemsCount > 0 ? `${itemsCount} article(s)` : 'Votre panier est vide'}
              </p>
            </div>
          </div>
          {itemsCount > 0 ? (
            <Button variant="ghost" onClick={handleClear} className="text-muted-foreground">
              Vider
            </Button>
          ) : null}
        </div>

        {!hydrated ? (
          <Card className="border bg-background/70 shadow-sm backdrop-blur">
            <CardContent className="space-y-3 py-12">
              <div className="mx-auto h-14 w-14 animate-pulse rounded-full bg-muted" />
              <div className="mx-auto h-5 w-48 animate-pulse rounded-md bg-muted" />
              <div className="mx-auto h-4 w-72 max-w-full animate-pulse rounded-md bg-muted" />
            </CardContent>
          </Card>
        ) : itemsCount === 0 ? (
          <Card className="border bg-background/70 shadow-sm backdrop-blur">
            <CardContent className="flex flex-col items-center justify-center gap-4 py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <ShoppingBag className="h-7 w-7 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-semibold">Aucun article</p>
                <p className="text-sm text-muted-foreground">
                  Explorez la boutique et ajoutez vos produits préférés.
                </p>
              </div>
              <Button asChild>
                <Link href="/products">
                  Explorer la boutique
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {hasOutOfStock ? (
              <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                Un article est en rupture. Retirez-le pour continuer.
              </div>
            ) : null}
            {items.map((item) => (
              <CartLineItem
                key={item.productId}
                item={item}
                onQuantityChange={(next) => setQuantity(item.productId, next)}
                onRemove={() => handleRemove(item.productId)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/90 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between gap-3 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Total</p>
            <p className="truncate text-base font-semibold text-foreground">
              {formatPoints(totalPoints)} pts
            </p>
            <p className="text-[11px] text-muted-foreground">Livraison 0 • Taxes 0</p>
          </div>
          <div className="flex items-center gap-2">
            {itemsCount > 0 ? (
              <Badge variant="secondary" className="hidden rounded-full sm:inline-flex">
                {itemsCount} article(s)
              </Badge>
            ) : null}
            <Button
              className="min-w-[140px]"
              size="lg"
              disabled={!canCheckout}
              onClick={() => router.push('/checkout')}
              variant="accent"
            >
              Passer commande
            </Button>
          </div>
        </div>
      </div>
    </SectionContainer>
  )
}
