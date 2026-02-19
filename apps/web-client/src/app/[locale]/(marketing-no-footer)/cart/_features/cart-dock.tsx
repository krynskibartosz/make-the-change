'use client'

import { ShoppingCart } from 'lucide-react'
import { usePathname } from '@/i18n/navigation'
import { cn, formatCurrency, formatPoints } from '@/lib/utils'
import { useCartUI } from './cart-ui-provider'
import { useCartTotals } from './use-cart'

export function CartDock() {
  const pathname = usePathname()
  const { itemsCount, totalPoints, totalEuros } = useCartTotals()
  const { isCartOpen, openCart, snackbar } = useCartUI()

  const isProjectDetail = pathname.startsWith('/projects/') && pathname.split('/').length > 2
  const isProductDetail = pathname.startsWith('/products/') && pathname.split('/').length > 2

  const hidden =
    itemsCount === 0 ||
    isCartOpen ||
    Boolean(snackbar) ||
    pathname.startsWith('/cart') ||
    pathname.startsWith('/checkout') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/forgot-password') ||
    isProjectDetail ||
    isProductDetail

  if (hidden) return null

  return (
    <div className="fixed inset-x-0 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-40 px-4 md:hidden">
      <button
        type="button"
        onClick={openCart}
        className={cn(
          'mx-auto flex max-w-xl items-center justify-between gap-3 rounded-full border bg-background/95 px-4 py-3 shadow-lg backdrop-blur transition',
          'hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
        )}
        aria-label="Ouvrir le panier"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
            <ShoppingCart className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Panier</p>
            <p className="truncate text-sm font-semibold text-foreground">
              {itemsCount} article(s)
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <p className="text-sm font-semibold text-primary">{formatPoints(totalPoints)} pts</p>
          {totalEuros > 0 && (
            <p className="text-[10px] text-muted-foreground">{formatCurrency(totalEuros)}</p>
          )}
        </div>
      </button>
    </div>
  )
}
