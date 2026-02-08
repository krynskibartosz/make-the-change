'use client'

import type { Product } from '@make-the-change/core/schema'
import { Button } from '@make-the-change/core/ui'
import { Check, Plus } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { useCartUI } from './cart-ui-provider'
import { useCart } from './use-cart'

type QuickAddButtonProps = {
  product: Product
  imageUrl: string
  className?: string
}

export function QuickAddButton({ product, imageUrl, className }: QuickAddButtonProps) {
  const { addItem } = useCart()
  const { openCart, showSnackbar } = useCartUI()
  const [justAdded, setJustAdded] = useState(false)
  const timerRef = useRef<number | null>(null)

  const isOutOfStock = product.stock_quantity !== null && product.stock_quantity <= 0

  const triggerJustAdded = useCallback(() => {
    setJustAdded(true)
    if (timerRef.current) window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => {
      setJustAdded(false)
      timerRef.current = null
    }, 900)
  }, [])

  return (
    <Button
      type="button"
      variant="glass"
      size="icon"
      className={cn(
        'absolute bottom-2 right-2 h-11 w-11 rounded-full shadow-md md:hidden',
        isOutOfStock && 'opacity-40 pointer-events-none',
        className,
      )}
      aria-label="Ajouter au panier"
      disabled={isOutOfStock}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        if (isOutOfStock) return

        addItem({
          productId: product.id,
          quantity: 1,
          snapshot: {
            name: product.name_default || 'Produit',
            slug: product.slug || '',
            pricePoints: Number(product.price_points || 0),
            imageUrl,
            fulfillmentMethod: product.fulfillment_method,
            stockQuantity: product.stock_quantity,
          },
        })

        triggerJustAdded()
        showSnackbar({
          message: 'Ajouté au panier',
          actionLabel: 'Voir',
          onAction: openCart,
          durationMs: 3500,
        })
      }}
    >
      {justAdded ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
    </Button>
  )
}
