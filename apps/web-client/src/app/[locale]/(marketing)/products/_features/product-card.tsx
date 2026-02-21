'use client'

import type { Json } from '@make-the-change/core/database-types'
import { Button } from '@make-the-change/core/ui'
import { ProductCard as SharedProductCard } from '@make-the-change/core/ui/next'
import { Heart, Plus, ShoppingBag } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useState } from 'react'
import { useCartUI } from '@/app/[locale]/(marketing-no-footer)/cart/_features/cart-ui-provider'
import { useCart } from '@/app/[locale]/(marketing-no-footer)/cart/_features/use-cart'
import { buildProductCardBadges } from '@/app/[locale]/(marketing)/products/_features/product-card-badges'
import { sanitizeImageUrl } from '@/lib/image-url'
import { getRandomProductImage } from '@/lib/placeholder-images'
import { getLocalizedContent } from '@/lib/utils'

export type ProductCardProduct = {
  id: string
  slug: string | null
  name_default: string | null
  name_i18n?: Record<string, string> | null
  short_description_default: string | null
  short_description_i18n?: Record<string, string> | null
  price_points: number | null
  price_eur_equivalent: number | null
  stock_quantity: number | null
  featured: boolean | null
  fulfillment_method: string | null
  metadata: Json | null
  images: string[]
  tags: string[]
}

type ProductCardProps = {
  product: ProductCardProduct
  className?: string
  priority?: boolean
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const toRecord = (value: unknown): Record<string, unknown> | null =>
  isRecord(value) ? value : null

const toStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return []
  }

  return value.filter((entry): entry is string => typeof entry === 'string')
}

const getFirstString = (value: unknown): string | null => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return null
  }

  return value
}

export function ProductCard({ product, className, priority = false }: ProductCardProps) {
  const t = useTranslations('products.card')
  const locale = useLocale()
  const { addItem } = useCart()
  const { openCart, showSnackbar } = useCartUI()
  const [isAdding, setIsAdding] = useState(false)

  const localizedName = getLocalizedContent(
    product.name_i18n,
    locale,
    product.name_default || t('default_name'),
  )
  const localizedDescription = getLocalizedContent(
    product.short_description_i18n,
    locale,
    product.short_description_default || t('default_description'),
  )

  const isOutOfStock = product.stock_quantity !== null && product.stock_quantity <= 0

  const metadata = toRecord(product.metadata)
  const columnImages = product.images
  const metadataImages = toStringArray(metadata?.images)
  const mainImage =
    sanitizeImageUrl(columnImages[0]) ??
    sanitizeImageUrl(getFirstString(metadata?.image_url)) ??
    sanitizeImageUrl(metadataImages[0]) ??
    getRandomProductImage(product.name_default?.length || 0) ??
    null
  const secondaryImage =
    sanitizeImageUrl(columnImages[1]) ?? sanitizeImageUrl(metadataImages[1]) ?? mainImage
  const badges = buildProductCardBadges({
    featured: product.featured ?? null,
    stockQuantity: product.stock_quantity ?? null,
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
      const normalizedPriceEuros = product.price_eur_equivalent
        ? Number(product.price_eur_equivalent)
        : null

      addItem({
        productId: product.id,
        quantity: 1,
        snapshot: {
          name: localizedName,
          slug: product.slug || '',
          pricePoints: Number(product.price_points || 0),
          imageUrl: mainImage,
          ...(normalizedPriceEuros !== null ? { priceEuros: normalizedPriceEuros } : {}),
          ...(product.fulfillment_method !== undefined
            ? { fulfillmentMethod: product.fulfillment_method }
            : {}),
          ...(product.stock_quantity !== undefined
            ? { stockQuantity: product.stock_quantity }
            : {}),
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
        title: localizedName,
        description: localizedDescription,
        image: {
          src: mainImage,
          alt: localizedName,
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
      {...(className !== undefined ? { className } : {})}
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
          product.tags.length > 0 ? (
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
