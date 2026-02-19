import { Badge, Button } from '@make-the-change/core/ui'
import { Award, Building2, Package, Share2, Sparkles, Star } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { sanitizeImageUrl } from '@/lib/image-url'
import { cn, formatCurrency } from '@/lib/utils'
import { getEntityViewTransitionName } from '@/lib/view-transition'
import { Link } from '@/i18n/navigation'
import { ProductDetailAddToCartButton } from './floating-action-buttons'
import type { ProductWithRelations } from './product-detail-data'

type ProductQuickViewProps = {
  product: ProductWithRelations
}

export async function ProductQuickView({ product }: ProductQuickViewProps) {
  const t = await getTranslations('products')

  const coverImage =
    sanitizeImageUrl(product.image_url) ||
    (Array.isArray(product.images) && product.images.length > 0
      ? sanitizeImageUrl(product.images[0])
      : undefined)

  const producerImage =
    product.producer?.images &&
      Array.isArray(product.producer.images) &&
      product.producer.images.length > 0
      ? sanitizeImageUrl(product.producer.images[0])
      : undefined

  const displayPoints = product.price_points || 0
  const displayPrice = displayPoints > 0 ? displayPoints / 100 : 0

  const inStock = (product.stock_quantity || 0) > 0
  const LOW_STOCK_THRESHOLD = 10
  const isLowStock = (product.stock_quantity || 0) <= LOW_STOCK_THRESHOLD

  const stockStatus = inStock
    ? isLowStock
      ? t('detail_page.stock_available', { count: product.stock_quantity || 0 }) // "Only X left" if translation supports it, or similar
      : t('card.in_stock') // Generic "In Stock" message
    : t('card.out_of_stock')

  const productName = product.name_default || t('card.default_name')
  const productDescription = product.description_default || ''
  const mediaTransitionName = getEntityViewTransitionName('product', product.id, 'media')
  const titleTransitionName = getEntityViewTransitionName('product', product.id, 'title')

  const parsedPriceEuros =
    product.price_eur_equivalent === null || product.price_eur_equivalent === undefined
      ? Number.NaN
      : Number(product.price_eur_equivalent)
  const priceEuros = Number.isFinite(parsedPriceEuros) ? parsedPriceEuros : null

  return (
    <div className="relative flex h-full min-h-[calc(100dvh-2rem)] flex-col bg-transparent">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-24 h-72 w-72 rounded-full bg-marketing-positive-500/10 blur-3xl" />
      </div>

      <div className="relative flex h-full flex-col">
        <div className="flex-1 overflow-y-auto overscroll-contain pb-4 sm:px-5 sm:pt-5 lg:px-6 lg:pt-6">
          <div className="grid gap-4 md:grid-cols-[1.08fr_0.92fr] lg:gap-6">
            <section>
              <div
                className="relative h-[clamp(220px,34vh,360px)] overflow-hidden rounded-none border-b border-border/50 bg-muted/40 sm:rounded-3xl sm:border"
                style={{ viewTransitionName: mediaTransitionName }}
              >
                {coverImage ? (
                  <img src={coverImage} alt={productName} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-muted">
                    <Package className="h-16 w-16 text-primary/50" />
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-marketing-overlay-dark/30 via-transparent to-transparent" />
              </div>
            </section>

            <aside className="space-y-4 px-4 sm:px-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{t('detail_page.authentic_badge')}</span>
              </div>

              <div className="space-y-3">
                <h1
                  className="text-3xl font-black tracking-tight text-foreground sm:text-4xl"
                  style={{ viewTransitionName: titleTransitionName }}
                >
                  {productName}
                </h1>
                <div className="flex flex-wrap gap-2">
                  {product.category?.name_default && (
                    <Badge
                      variant="outline"
                      className="border-primary/25 bg-primary/5 text-primary"
                    >
                      <Package className="mr-1 h-3.5 w-3.5" />
                      {product.category.name_default}
                    </Badge>
                  )}
                  {product.producer?.name_default && (
                    <Badge variant="outline" className="border-border/60 bg-muted/40">
                      <Building2 className="mr-1 h-3.5 w-3.5" />
                      {product.producer.name_default}
                    </Badge>
                  )}
                  {product.featured && (
                    <Badge className="border-none bg-marketing-warning-500 text-marketing-overlay-light">
                      <Star className="mr-1 h-3.5 w-3.5" />
                      {t('featured')}
                    </Badge>
                  )}
                  {product.is_hero_product && (
                    <Badge className="border-none bg-marketing-accent-alt-500 text-marketing-overlay-light">
                      <Award className="mr-1 h-3.5 w-3.5" />
                      {t('detail_page.hero_product_badge')}
                    </Badge>
                  )}
                </div>
              </div>
            </aside>
          </div>

          <div className="mt-4 space-y-4 px-4 pb-36 sm:px-0 sm:pb-40">
            {productDescription && (
              <section className="rounded-2xl border border-white/10 bg-background/40 p-4">
                <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                  {t('detail.description')}
                </h2>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {productDescription}
                </p>
              </section>
            )}

            {product.producer && (
              <section className="rounded-2xl border border-white/10 bg-background/40 p-4 transition-colors hover:bg-background/60">
                <Link href={`/producers/${product.producer.slug || product.producer.id}`}>
                  <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                    {t('detail.producer')}
                  </h2>
                  <div className="flex items-start gap-3">
                    {producerImage ? (
                      <img
                        src={producerImage}
                        alt={product.producer.name_default || 'Producer'}
                        className="h-14 w-14 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
                        {product.producer.name_default?.[0]?.toUpperCase() || 'P'}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-base font-bold text-foreground underline-offset-4 group-hover:underline">
                          {product.producer.name_default || ''}
                        </p>
                        <Share2 className="h-4 w-4 text-muted-foreground opacity-50" />
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {product.producer.description_default || ''}
                      </p>
                    </div>
                  </div>
                </Link>
              </section>
            )}

            {product.certifications && product.certifications.length > 0 && (
              <section className="rounded-2xl border border-white/10 bg-background/40 p-4">
                <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                  {t('detail.certifications')}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {product.certifications.map((certification, index) => (
                    <Badge
                      key={`${certification}-${index}`}
                      variant="outline"
                      className="border-marketing-positive-600/30 bg-marketing-positive-500/10 text-marketing-positive-700"
                    >
                      {certification}
                    </Badge>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        <div className="relative shrink-0 border-t border-white/10 bg-background/40 p-4 backdrop-blur-xl sm:p-5">
          <div className="pointer-events-none absolute inset-x-0 -top-10 h-10 bg-gradient-to-t from-transparent to-background/5" />
          <div className="grid items-end gap-3 md:grid-cols-[1fr_auto]">
            <div>
              <div className="flex items-end justify-between gap-3">
                <div className="text-4xl font-black text-primary">
                  {formatCurrency(displayPrice)}
                </div>
                {displayPoints > 0 && (
                  <div className="pb-1 text-lg font-bold text-muted-foreground">
                    {t('detail_page.or_points', { points: displayPoints })}
                  </div>
                )}
              </div>
              <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <span>{stockStatus}</span>
                {inStock && (
                  <span
                    className={cn(
                      'h-2 w-2 rounded-full',
                      isLowStock ? 'bg-marketing-warning-500' : 'bg-marketing-positive-500',
                    )}
                  />
                )}
              </div>
            </div>

            <div className="flex w-full gap-2 md:w-[360px]">
              <ProductDetailAddToCartButton
                className="h-12 flex-1 rounded-xl text-base font-bold"
                productId={product.id}
                productName={productName}
                productSlug={product.slug}
                pricePoints={displayPoints}
                priceEuros={priceEuros}
                imageUrl={coverImage || null}
                fulfillmentMethod={product.fulfillment_method}
                stockQuantity={product.stock_quantity}
                inStock={inStock}
              />
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 shrink-0 rounded-xl"
                title={t('detail.exchange')}
              >
                <Share2 className="h-5 w-5" />
                <span className="sr-only">{t('detail.exchange')}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
