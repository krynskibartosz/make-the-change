'use client'

import { Button } from '@make-the-change/core/ui'
import { Clock, ShoppingCart } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCartUI } from '@/app/[locale]/(marketing-no-footer)/cart/_features/cart-ui-provider'
import { useCart } from '@/app/[locale]/(marketing-no-footer)/cart/_features/use-cart'
import { QuantityStepper } from '@/components/ui/quantity-stepper'
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
  const { addItem, items, removeItem, setQuantity } = useCart()
  const { openCart, showSnackbar } = useCartUI()

  const cartItem = items.find((item) => item.productId === productId)
  const quantity = cartItem?.quantity || 0

  const handleIncrement = () => {
    if (!inStock) return
    if (stockQuantity && quantity >= stockQuantity) return

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
  }

  const handleDecrement = () => {
    if (quantity <= 1) {
      removeItem(productId)
    } else {
      setQuantity(productId, quantity - 1)
    }
  }

  const addToCart = () => {
    handleIncrement()
    // Only show snackbar on initial add if desired, or relying on stepper feedback
  }

  return { addToCart, handleIncrement, handleDecrement, quantity, t }
}

export function ProductDetailAddToCartButton({
  className,
  ...payload
}: ProductDetailAddToCartButtonProps) {
  const { addToCart, handleIncrement, handleDecrement, quantity, t } =
    useProductAddToCart(payload)

  if (quantity > 0) {
    return (
      <QuantityStepper
        quantity={quantity}
        maxQuantity={payload.stockQuantity}
        onIncrement={handleIncrement}
        onDecrement={handleDecrement}
        className={className}
      />
    )
  }

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
  const { addToCart, handleIncrement, handleDecrement, quantity, t } =
    useProductAddToCart(payload)

  if (quantity > 0) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-background/95 p-4 backdrop-blur-lg md:hidden">
        <QuantityStepper
          quantity={quantity}
          maxQuantity={payload.stockQuantity}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
          className="h-14 w-full shadow-lg"
        />
      </div>
    )
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-background/95 p-4 backdrop-blur-lg md:hidden">
      <Button
        className="h-14 w-full rounded-full bg-primary text-lg font-bold text-marketing-overlay-light shadow-lg transition-all duration-300 hover:bg-primary/90"
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
