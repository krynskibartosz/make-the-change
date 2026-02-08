'use client'

import { Button } from '@make-the-change/core/ui'
import { ShoppingCart } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { useCartUI } from './cart-ui-provider'
import { useCartTotals } from './use-cart'

type CartButtonProps = {
  className?: string
  variant?: 'ghost' | 'outline' | 'default'
}

export function CartButton({ className, variant = 'ghost' }: CartButtonProps) {
  const { itemsCount } = useCartTotals()
  const { openCart } = useCartUI()

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size="icon"
        className={cn('relative h-11 w-11 md:hidden', className)}
        aria-label="Ouvrir le panier"
        onClick={openCart}
      >
        <ShoppingCart className="h-5 w-5" />
        {itemsCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-primary-foreground shadow">
            {itemsCount > 99 ? '99+' : itemsCount}
          </span>
        )}
      </Button>

      <Button
        asChild
        variant={variant}
        size="icon"
        className={cn('relative hidden h-11 w-11 md:inline-flex', className)}
        aria-label="Ouvrir le panier"
      >
        <Link href="/cart" aria-label="Panier">
          <ShoppingCart className="h-5 w-5" />
          {itemsCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-primary-foreground shadow">
              {itemsCount > 99 ? '99+' : itemsCount}
            </span>
          )}
        </Link>
      </Button>
    </>
  )
}
