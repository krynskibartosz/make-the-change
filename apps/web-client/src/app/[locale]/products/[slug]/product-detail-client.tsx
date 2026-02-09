'use client'

import type { Product } from '@make-the-change/core/schema'
import {
  Badge,
  BottomSheet,
  BottomSheetContent,
  Button,
  Card,
  CardContent,
} from '@make-the-change/core/ui'
import { ArrowLeft, ArrowRight, Award, MapPin, Minus, Plus, ShoppingCart } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useCartUI } from '@/features/commerce/cart/cart-ui-provider'
import { useCart, useCartTotals } from '@/features/commerce/cart/use-cart'
import { Link } from '@/i18n/navigation'
import { getRandomProductImage } from '@/lib/placeholder-images'
import { formatPoints } from '@/lib/utils'

/** Safe public producer fields (no PII) */
interface PublicProducer {
  id: string
  slug: string
  name_default: string
  description_default: string | null
  address_city: string | null
  address_country_code: string | null
  location: string | null
  contact_website: string | null
  social_media: unknown
  images: string[] | null
  metadata: unknown
}

interface ProductDetailClientProps {
  product: Product
  producer: PublicProducer | null
  relatedProducts: Product[]
}

export function ProductDetailClient({
  product,
  producer,
  relatedProducts,
}: ProductDetailClientProps) {
  const t = useTranslations('products')
  const [quantity, setQuantity] = useState(1)
  const [addedOpen, setAddedOpen] = useState(false)
  const { addItem } = useCart()
  const { itemsCount } = useCartTotals()
  const { openCart } = useCartUI()

  const isOutOfStock = product.stock_quantity !== null && product.stock_quantity <= 0
  const totalPoints = (product.price_points || 0) * quantity
  const metadata = product.metadata as Record<string, unknown> | null
  const imageUrl =
    (product.images as string[] | undefined)?.[0] ||
    (metadata?.image_url as string | undefined) ||
    (metadata?.images as string[] | undefined)?.[0] ||
    getRandomProductImage(product.name_default?.length || 0)

  // Get location display for producer
  const producerLocation = producer
    ? [producer.address_city, producer.address_country_code].filter(Boolean).join(', ') ||
      producer.location
    : null

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      quantity,
      snapshot: {
        name: product.name_default || 'Produit',
        slug: product.slug || '',
        pricePoints: Number(product.price_points || 0),
        imageUrl,
        fulfillmentMethod: product.fulfillment_method,
        stockQuantity: product.stock_quantity,
      },
    })
    setAddedOpen(true)
  }

  // Parse variants if available
  const variants = product.variants as any;
  const hasVariants = variants && variants.skus && variants.skus.length > 0;

  return (
    <div className="min-h-screen pb-28 md:pb-24">
      {/* Back Navigation */}
      <div className="container mx-auto px-4 py-4">
        <Link href="/products">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        </Link>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-2xl bg-muted">
              <img
                src={imageUrl}
                alt={product.name_default || 'Produit'}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="mb-2 text-3xl font-bold">{product.name_default}</h1>
              {product.short_description_default && (
                <p className="text-lg text-muted-foreground">{product.short_description_default}</p>
              )}
            </div>

            <div className="text-4xl font-bold text-primary">
              {formatPoints(product.price_points || 0)} pts
            </div>

            {/* Variants (New Feature) */}
            {hasVariants && (
              <div className="space-y-4 p-4 bg-muted/20 rounded-lg">
                <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Options</h3>
                {variants.attributes.map((attr: any) => (
                  <div key={attr.name} className="space-y-2">
                    <label className="text-sm font-medium">{attr.name}</label>
                    <div className="flex flex-wrap gap-2">
                      {attr.values.map((val: string) => (
                        <Badge key={val} variant="outline" className="cursor-pointer hover:bg-primary/10">
                          {val}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-sm font-medium">Quantité:</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={product.stock_quantity !== null && quantity >= product.stock_quantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {product.stock_quantity !== null &&
              product.stock_quantity > 0 &&
              product.stock_quantity <= 10 ? (
                <Badge variant="secondary" className="rounded-full">
                  Plus que {product.stock_quantity}
                </Badge>
              ) : null}
            </div>

            {/* Exchange Button */}
            <Button
              size="lg"
              className="hidden w-full md:inline-flex"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
            >
              {isOutOfStock ? (
                t('card.out_of_stock')
              ) : (
                <>Ajouter au panier • {formatPoints(totalPoints)} pts</>
              )}
            </Button>

            {/* Product Info */}
            <div className="space-y-4 rounded-xl border p-6">
              <h3 className="font-semibold">{t('detail.description')}</h3>
              {product.description_default ? (
                <p className="text-muted-foreground">{product.description_default}</p>
              ) : (
                <p className="italic text-muted-foreground">Aucune description disponible</p>
              )}

              {product.origin_country && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>Origine: {product.origin_country}</span>
                </div>
              )}

              {product.weight_grams && (
                <div className="text-sm text-muted-foreground">Poids: {product.weight_grams}g</div>
              )}
            </div>

            {/* Certifications */}
            {product.certifications && product.certifications.length > 0 && (
              <div className="space-y-3">
                <h3 className="flex items-center gap-2 font-semibold">
                  <Award className="h-4 w-4" />
                  {t('detail.certifications')}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.certifications.map((cert) => (
                    <Badge key={cert} variant="secondary">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Allergens */}
            {product.allergens && product.allergens.length > 0 && (
              <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-950/30">
                <h4 className="mb-2 font-semibold text-amber-800 dark:text-amber-400">
                  Allergènes
                </h4>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  {product.allergens.join(', ')}
                </p>
              </div>
            )}

            {/* Producer */}
            {producer && (
              <div className="rounded-xl border p-6">
                <h3 className="mb-3 font-semibold">{t('detail.producer')}</h3>
                <div className="flex flex-col items-start gap-4 sm:flex-row">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-lg font-bold text-primary">
                      {(producer.name_default || 'P').charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium">{producer.name_default}</h4>
                    {producerLocation && (
                      <p className="text-sm text-muted-foreground">{producerLocation}</p>
                    )}
                    {producer.description_default && (
                      <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                        {producer.description_default}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 text-2xl font-bold">Produits similaires</h2>
            <div className="flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-4">
              {relatedProducts.map((relatedProduct) => (
                <Link key={relatedProduct.id} href={`/products/${relatedProduct.slug}`}>
                  <Card className="h-full min-w-[200px] transition-shadow hover:shadow-lg sm:min-w-0">
                    <div className="aspect-square overflow-hidden rounded-t-xl bg-muted">
                      {(() => {
                        const metadata = relatedProduct.metadata as Record<string, unknown> | null
                        const imageUrl =
                          (relatedProduct.images as string[] | undefined)?.[0] ||
                          (metadata?.image_url as string | undefined) ||
                          (metadata?.images as string[] | undefined)?.[0] ||
                          getRandomProductImage(relatedProduct.name_default?.length || 0)
                        return (
                          <img
                            src={imageUrl}
                            alt={relatedProduct.name_default || 'Produit'}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        )
                      })()}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="mb-2 line-clamp-1 font-semibold">
                        {relatedProduct.name_default}
                      </h3>
                      <span className="font-bold text-primary">
                        {formatPoints(relatedProduct.price_points || 0)} pts
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/90 backdrop-blur md:hidden">
        <div className="container mx-auto flex items-center gap-3 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3">
          {itemsCount > 0 ? (
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-11 w-11"
              aria-label="Ouvrir le panier"
              onClick={openCart}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          ) : null}
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="truncate text-base font-semibold text-foreground">
              {formatPoints(totalPoints)} pts
            </p>
          </div>
          <Button className="flex-1" disabled={isOutOfStock} onClick={handleAddToCart}>
            {isOutOfStock ? t('card.out_of_stock') : 'Ajouter'}
          </Button>
        </div>
      </div>

      <BottomSheet open={addedOpen} onOpenChange={setAddedOpen}>
        <BottomSheetContent>
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">Ajouté au panier</p>
                <p className="text-xs text-muted-foreground">
                  {product.name_default} • x{quantity}
                </p>
              </div>
              <Badge variant="secondary" className="rounded-full">
                {formatPoints(totalPoints)} pts
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                className="w-full"
                onClick={() => {
                  setAddedOpen(false)
                  openCart()
                }}
              >
                Voir panier
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="w-full" onClick={() => setAddedOpen(false)}>
                Continuer
              </Button>
            </div>
          </div>
        </BottomSheetContent>
      </BottomSheet>
    </div>
  )
}
