'use client'

import { Button } from '@make-the-change/core/ui'
import { ShoppingCart } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { useCartUI } from './cart-ui-provider'
import { useCartTotals } from './use-cart'

type CartButtonProps = {
  className?: string
  variant?: 'ghost' | 'outline' | 'default'
}

export function CartButton({ className, variant = 'ghost' }: CartButtonProps) {
  const t = useTranslations('navigation')
  const { itemsCount } = useCartTotals()
  const { openCart } = useCartUI()

  const badge = itemsCount > 0 && (
    <span className="pointer-events-none absolute -right-1 -top-1 z-10 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-primary-foreground shadow">
      {itemsCount > 99 ? '99+' : itemsCount}
    </span>
  )

  return (
    <>
      <div className={cn('relative inline-flex md:hidden', className)}>
        <Button
          type="button"
          variant={variant}
          size="icon"
          className="h-11 w-11"
          aria-label={t('open_cart')}
          onClick={openCart}
        >
          <ShoppingCart className="h-5 w-5" />
        </Button>
        {badge}
      </div>

      <div className={cn('relative hidden md:inline-flex', className)}>
        <Button
          asChild
          variant={variant}
          size="icon"
          className="h-11 w-11"
          aria-label={t('open_cart')}
        >
          <Link href="/cart" aria-label={t('cart')}>
            <ShoppingCart className="h-5 w-5" />
          </Link>
        </Button>
        {badge}
      </div>
    </>
  )
}
