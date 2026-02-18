'use client'

import type { Product } from '@make-the-change/core/schema'
import { Button } from '@make-the-change/core/ui'
import { ProductCard as SharedProductCard } from '@make-the-change/core/ui/next'
import { Heart, Plus, ShoppingBag } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useCartUI } from '@/features/commerce/cart/cart-ui-provider'
import { useCart } from '@/features/commerce/cart/use-cart'
import { buildProductCardBadges } from '@/features/commerce/products/product-card-badges'
import { getRandomProductImage } from '@/lib/placeholder-images'
import { sanitizeImageUrl } from '@/lib/image-url'

type ProductCardProps = {
  product: Product
  className?: string
  priority?: boolean
}

export function ProductCard({ product, className, priority = false }: ProductCardProps) {
  const t = useTranslations('products.card')
  const { addItem } = useCart()
  const { openCart, showSnackbar } = useCartUI()
  const [isAdding, setIsAdding] = useState(false)

  const isOutOfStock = product.stock_quantity !== null && product.stock_quantity <= 0

  const metadata = product.metadata as Record<string, unknown> | null
  const columnImages = (product.images as string[] | null | undefined) || []
  const metadataImages = (metadata?.images as string[] | undefined) || []
  const mainImage =
    sanitizeImageUrl(columnImages[0]) ||
    sanitizeImageUrl(metadata?.image_url as string | undefined) ||
    sanitizeImageUrl(metadataImages[0]) ||
    getRandomProductImage(product.name_default?.length || 0)
  const secondaryImage = sanitizeImageUrl(columnImages[1]) || sanitizeImageUrl(metadataImages[1]) || mainImage
  const badges = buildProductCardBadges({
    featured: product.featured,
    stockQuantity: product.stock_quantity,
    labels: {
      featuredLabel: t('best_seller'),
      lowStockLabel: t('low_stock'),
      outOfStockLabel: t('sold_out'),
    },
  })

  const handleAddToCart = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    if (isOutOfStock) {
      return
    }

    setIsAdding(true)

    setTimeout(() => {
      addItem({
        productId: product.id,
        quantity: 1,
        snapshot: {
          name: product.name_default || t('default_name'),
          slug: product.slug || '',
          pricePoints: Number(product.price_points || 0),
          priceEuros: product.price_eur_equivalent
            ? Number(product.price_eur_equivalent)
            : undefined,
          imageUrl: mainImage,
          fulfillmentMethod: product.fulfillment_method,
          stockQuantity: product.stock_quantity,
        },
      })

      showSnackbar({
        message: t('added_message'),
        actionLabel: t('view_action'),
        onAction: openCart,
        durationMs: 3000,
      })

      setIsAdding(false)
    }, 400)
  }

  return (
    <SharedProductCard
      context="clientHome"
      model={{
        id: product.id,
        href: `/products/${product.id}`,
        title: product.name_default || t('default_name'),
        description: product.short_description_default || t('default_description'),
        image: {
          src: mainImage,
          alt: product.name_default || t('default_name'),
        },
        imagePriority: priority,
        hoverImageSrc: secondaryImage !== mainImage ? secondaryImage : null,
        pricePoints: Number(product.price_points || 0),
        priceEuro: product.price_eur_equivalent ? Number(product.price_eur_equivalent) : null,
        stockQuantity: product.stock_quantity,
        featured: !!product.featured,
        badges,
      }}
      labels={{
        pointsLabel: t('points'),
        viewLabel: '',
        featuredLabel: t('best_seller'),
        lowStockLabel: t('low_stock'),
        outOfStockLabel: t('sold_out'),
      }}
      className={className}
      slots={{
        topRight: (
          <button
            type="button"
            data-card-action
            className="rounded-full bg-background/80 p-2 text-muted-foreground backdrop-blur transition-colors hover:bg-background hover:text-destructive"
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
            }}
            aria-label={t('wishlist_action')}
          >
            <Heart className="h-4 w-4" />
          </button>
        ),
        mediaOverlay: (
          <>
            <div className="absolute bottom-4 left-4 right-4 z-10 translate-y-4 opacity-0 transition-all duration-300 ease-out md:group-hover:translate-y-0 md:group-hover:opacity-100">
              <Button
                data-card-action
                className="w-full shadow-lg"
                onClick={handleAddToCart}
                disabled={isOutOfStock || isAdding}
              >
                {isAdding ? (
                  <span className="animate-pulse">{t('adding')}</span>
                ) : isOutOfStock ? (
                  t('out_of_stock')
                ) : (
                  <>
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    {t('add_to_cart')}
                  </>
                )}
              </Button>
            </div>

            <Button
              data-card-action
              size="icon"
              className="absolute bottom-3 right-3 h-10 w-10 rounded-full shadow-md md:hidden"
              onClick={handleAddToCart}
              disabled={isOutOfStock || isAdding}
              aria-label={isOutOfStock ? t('out_of_stock') : t('add_to_cart')}
            >
              <Plus className="h-5 w-5" />
            </Button>
          </>
        ),
        metaChips:
          product.tags && product.tags.length > 0 ? (
            <div className="flex flex-wrap gap-1 pt-1">
              {product.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="rounded-sm border px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : undefined,
      }}
    />
  )
}
