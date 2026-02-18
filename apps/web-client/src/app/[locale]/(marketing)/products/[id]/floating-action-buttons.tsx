'use client'

import { Button } from '@make-the-change/core/ui'
import { Clock, ShoppingCart } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCartUI } from '@/app/[locale]/(marketing-no-footer)/cart/_features/cart-ui-provider'
import { useCart } from '@/app/[locale]/(marketing-no-footer)/cart/_features/use-cart'
import { formatCurrency } from '@/lib/utils'

interface ProductCartPayload {
  productId: string
  productName: string
  productSlug?: string | null
  pricePoints: number
  priceEuros?: number | null
  imageUrl: string | null
  fulfillmentMethod?: string | null
  stockQuantity?: number | null
  inStock: boolean
}

interface ProductDetailAddToCartButtonProps extends ProductCartPayload {
  className?: string
}

interface FloatingActionButtonsProps extends ProductCartPayload {
  displayPrice: number
}

const normalizePricePoints = (value: number) =>
  Number.isFinite(value) ? Math.max(0, Math.round(value)) : 0

const normalizePriceEuros = (value: number | null | undefined) =>
  typeof value === 'number' && Number.isFinite(value) ? Math.max(0, value) : undefined

function useProductAddToCart({
  productId,
  productName,
  productSlug,
  pricePoints,
  priceEuros,
  imageUrl,
  fulfillmentMethod,
  stockQuantity,
  inStock,
}: ProductCartPayload) {
  const t = useTranslations('products')
  const { addItem } = useCart()
  const { openCart, showSnackbar } = useCartUI()

  const addToCart = () => {
    if (!inStock) return

    addItem({
      productId,
      quantity: 1,
      snapshot: {
        name: productName || t('card.default_name'),
        slug: productSlug || '',
        pricePoints: normalizePricePoints(pricePoints),
        priceEuros: normalizePriceEuros(priceEuros),
        imageUrl,
        fulfillmentMethod,
        stockQuantity,
      },
    })

    showSnackbar({
      message: t('card.added_message'),
      actionLabel: t('card.view_action'),
      onAction: openCart,
      durationMs: 3000,
    })
  }

  return { addToCart, t }
}

export function ProductDetailAddToCartButton({
  className,
  ...payload
}: ProductDetailAddToCartButtonProps) {
  const { addToCart, t } = useProductAddToCart(payload)

  return (
    <Button className={className} size="lg" disabled={!payload.inStock} onClick={addToCart}>
      {payload.inStock ? (
        <>
          <ShoppingCart className="mr-2 h-5 w-5" />
          {t('card.add_to_cart')}
        </>
      ) : (
        <>
          <Clock className="mr-2 h-5 w-5" />
          {t('card.out_of_stock')}
        </>
      )}
    </Button>
  )
}

export function FloatingActionButtons({ displayPrice, ...payload }: FloatingActionButtonsProps) {
  const { addToCart, t } = useProductAddToCart(payload)

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border/50 p-4 md:hidden">
      <Button
        className="w-full h-14 rounded-full bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg text-marketing-overlay-light font-bold text-lg"
        disabled={!payload.inStock}
        onClick={addToCart}
      >
        {payload.inStock ? (
          <>
            <ShoppingCart className="mr-3 h-6 w-6" />
            {t('card.add_to_cart')} - {formatCurrency(displayPrice)}
          </>
        ) : (
          <>
            <Clock className="mr-3 h-6 w-6" />
            {t('card.out_of_stock')}
          </>
        )}
      </Button>
    </div>
  )
}
