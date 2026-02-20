import { Badge, Button, Card, CardContent } from '@make-the-change/core/ui'
import {
  ArrowLeft,
  Award,
  Building2,
  Clock,
  Globe,
  Leaf,
  Package,
  Share2,
  ShoppingCart,
  Sparkles,
  Star,
} from 'lucide-react'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { MarketingCtaBand } from '@/app/[locale]/(marketing)/_features/marketing-cta-band'
import { MarketingHeroShell } from '@/app/[locale]/(marketing)/_features/marketing-hero-shell'
import { SectionContainer } from '@/components/ui/section-container'
import { Link } from '@/i18n/navigation'
import { sanitizeImageUrl } from '@/lib/image-url'
import { formatCurrency } from '@/lib/utils'
import { getEntityViewTransitionName } from '@/lib/view-transition'
import { FloatingActionButtons, ProductDetailAddToCartButton } from './floating-action-buttons'
import type { ProductWithRelations } from './product-detail-data'

type ProductDetailsProps = {
  product: ProductWithRelations
  includeFloatingActions?: boolean
  includeStructuredData?: boolean
}

export async function ProductDetails({
  product,
  includeFloatingActions = true,
  includeStructuredData = true,
}: ProductDetailsProps) {
  const t = await getTranslations('products')

  // Determine cover image using image_url from public_products view
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

  // Calculate price display
  const displayPoints = product.price_points || 0
  const displayPrice = displayPoints > 0 ? displayPoints / 100 : 0

  // Stock status
  const inStock = (product.stock_quantity || 0) > 0
  const stockStatus = inStock
    ? t('detail_page.stock_available', { count: product.stock_quantity || 0 })
    : t('card.out_of_stock')
  const productName = product.name_default || ''
  const productDescription = product.description_default || ''
  const mediaTransitionName = getEntityViewTransitionName('product', product.id, 'media')
  const titleTransitionName = getEntityViewTransitionName('product', product.id, 'title')
  const parsedPriceEuros =
    product.price_eur_equivalent === null || product.price_eur_equivalent === undefined
      ? Number.NaN
      : Number(product.price_eur_equivalent)
  const priceEuros = Number.isFinite(parsedPriceEuros) ? parsedPriceEuros : null
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productName,
    description: productDescription,
    image: coverImage ? [coverImage] : [],
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: product.producer?.name_default || 'Make the Change',
    },
    offers: {
      '@type': 'Offer',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${product.id}`,
      priceCurrency: 'EUR',
      price: displayPrice,
      availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  }
  const structuredDataJson = JSON.stringify(structuredData).replace(/</g, '\\u003c')

  return (
    <>
      {/* Modern Hero Section - 2026 Style */}
      <MarketingHeroShell
        minHeightClassName="min-h-[90vh]"
        background={
          <>
            <div className="absolute top-[-20%] left-[-10%] h-200 w-200 rounded-full bg-primary/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse duration-3000" />
            <div className="absolute bottom-[-20%] right-[-10%] h-200 w-200 rounded-full bg-marketing-positive-400/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse duration-5000 delay-1000" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9ImN1cnJlbnRDb2xvciIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')] opacity-100 text-foreground/20 mask-image-gradient" />
          </>
        }
      >
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          {/* Content Column */}
          <div className="space-y-8 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-md mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-sm">
              <Sparkles className="h-4 w-4" />
              <span className="uppercase tracking-widest text-xs font-bold">
                {t('detail_page.authentic_badge')}
              </span>
            </div>

            <h1
              className={`
                font-black tracking-tighter mb-8 text-foreground animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100 drop-shadow-sm
                ${
                  productName.length > 40
                    ? 'text-4xl sm:text-5xl lg:text-6xl'
                    : productName.length > 25
                      ? 'text-5xl sm:text-6xl lg:text-7xl'
                      : 'text-6xl sm:text-7xl lg:text-8xl'
                }
              `}
              style={{ viewTransitionName: titleTransitionName }}
            >
              {productName}
            </h1>

            <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 max-w-xl">
              {productDescription}
            </p>

            {/* Product Meta Info */}
            <div className="flex flex-wrap gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
              {product.category && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 backdrop-blur-sm border border-border/50">
                  <Package className="h-4 w-4 text-primary" />
                  <span className="font-medium">{product.category?.name_default || ''}</span>
                </div>
              )}
              {product.producer && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 backdrop-blur-sm border border-border/50">
                  <Building2 className="h-4 w-4 text-primary" />
                  <span className="font-medium">{product.producer?.name_default || ''}</span>
                </div>
              )}
              {product.featured && (
                <Badge className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400 bg-linear-to-r from-marketing-warning-500 to-marketing-warning-500 text-marketing-overlay-light border-none">
                  <Star className="h-3 w-3 mr-1" />
                  {t('featured')}
                </Badge>
              )}
              {product.is_hero_product && (
                <Badge className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400 bg-linear-to-r from-marketing-accent-alt-500 to-marketing-accent-alt-500 text-marketing-overlay-light border-none">
                  <Award className="h-3 w-3 mr-1" />
                  {t('detail_page.hero_product_badge')}
                </Badge>
              )}
            </div>

            {/* Tags */}
            {product.tags && Array.isArray(product.tags) && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
                {product.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs bg-primary/5 border-primary/20 text-primary"
                  >
                    {tag ?? ''}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Image Column */}
          <div className="relative order-1 lg:order-2">
            <div
              className="aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/20 border border-border/50 bg-muted relative z-10 rotate-3 transition-transform duration-700 hover:rotate-0"
              style={{ viewTransitionName: mediaTransitionName }}
            >
              {coverImage ? (
                <Image
                  src={coverImage}
                  alt={productName || t('card.default_name')}
                  fill
                  priority
                  className="object-cover scale-110 transition-transform duration-700 hover:scale-100"
                />
              ) : (
                <div className="h-full w-full bg-linear-to-br from-primary/20 to-muted flex items-center justify-center">
                  <Package className="h-24 w-24 text-primary/50" />
                </div>
              )}
              <div className="absolute inset-0 bg-linear-to-t from-marketing-overlay-dark/60 via-transparent to-transparent opacity-60" />
            </div>

            {/* Floating Element - Price & Stock Badge */}
            <div className="absolute -bottom-10 -left-10 z-20 p-6 rounded-3xl bg-background/90 backdrop-blur-xl shadow-[0_8px_30px_hsl(var(--marketing-overlay-dark) / 0.12)] border border-marketing-overlay-light/20 animate-in slide-in-from-left-4 duration-1000 delay-300">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-linear-to-br from-primary to-marketing-positive-600 flex items-center justify-center text-marketing-overlay-light shadow-lg shadow-primary/30">
                  {inStock ? <ShoppingCart className="h-7 w-7" /> : <Clock className="h-7 w-7" />}
                </div>
                <div>
                  <p className="text-3xl font-black leading-none mb-1">
                    {formatCurrency(displayPrice)}
                  </p>
                  <p className="text-sm text-muted-foreground font-medium">{stockStatus}</p>
                </div>
              </div>
            </div>

            {/* Decorative blob behind */}
            <div className="absolute inset-0 bg-primary/20 blur-[80px] -z-10 rounded-full scale-125" />
          </div>
        </div>
      </MarketingHeroShell>

      {/* Enhanced Product Details Section */}
      <SectionContainer size="lg" className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="group relative overflow-hidden rounded-[2.5rem] border-border/50 bg-background/50 backdrop-blur-sm transition-all hover:bg-background/80 hover:shadow-xl hover:-translate-y-1">
              <CardContent className="p-10">
                <div className="mb-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
                    <Globe className="h-3 w-3" />
                    <span>{t('detail.description')}</span>
                  </div>
                  <h2 className="text-4xl font-black tracking-tight mb-4">
                    {t('detail.description')}
                  </h2>
                </div>

                <div className="prose prose-lg max-w-none">
                  <p className="whitespace-pre-wrap text-lg leading-relaxed text-muted-foreground font-medium">
                    {product.description_default}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            <Card className="group top-24 relative overflow-hidden rounded-[2.5rem] border-border/50 bg-background/50 backdrop-blur-sm transition-all hover:bg-background/80 hover:shadow-xl hover:-translate-y-1">
              <CardContent className="p-8 space-y-8">
                {/* Price Section */}
                <div className="relative">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Leaf className="h-16 w-16" />
                  </div>
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <span className="text-5xl font-black text-primary">
                        {formatCurrency(displayPrice)}
                      </span>
                      {displayPoints > 0 && (
                        <span className="ml-3 text-2xl font-bold text-muted-foreground">
                          {t('detail_page.or_points', { points: displayPoints })}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-tight">
                      {stockStatus}
                    </p>
                    {inStock && (
                      <div className="h-2 w-2 rounded-full bg-marketing-positive-500 animate-pulse" />
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <ProductDetailAddToCartButton
                    className="w-full h-14 text-lg font-bold rounded-full bg-primary hover:bg-primary/90 hover:scale-105 transition-all shadow-lg"
                    productId={product.id}
                    productName={productName || t('card.default_name')}
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
                    className="w-full h-14 text-lg font-bold rounded-full border-border/50 hover:bg-primary hover:text-marketing-overlay-light hover:border-primary transition-all"
                  >
                    <Share2 className="mr-2 h-5 w-5" />
                    {t('detail.exchange')}
                  </Button>
                </div>

                {/* Enhanced Producer Section */}
                {product.producer && (
                  <div className="pt-8 border-t border-border/50">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-marketing-warning-500/10 text-marketing-warning-600 text-xs font-bold uppercase tracking-wider mb-6">
                      <Building2 className="h-3 w-3" />
                      <span>{t('detail.producer')}</span>
                    </div>
                    <div className="group relative overflow-hidden p-6 rounded-3xl border border-border/50 bg-background/50 backdrop-blur-sm transition-all hover:bg-background/80 hover:shadow-xl hover:-translate-y-1">
                      <div className="flex items-start gap-4">
                        {producerImage ? (
                          <div className="h-16 w-16 rounded-2xl overflow-hidden bg-muted shrink-0 border border-border/50 group-hover:scale-110 transition-transform">
                            <Image
                              src={producerImage}
                              alt={product.producer?.name_default || 'Producer'}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-16 w-16 rounded-2xl bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary font-bold shrink-0 text-xl">
                            {product.producer?.name_default?.[0]?.toUpperCase() || 'P'}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-black text-xl leading-tight mb-2">
                            {product.producer?.name_default || ''}
                          </div>
                          <div className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-3">
                            {product.producer?.description_default || ''}
                          </div>
                          {product.producer.address_city && (
                            <div className="text-xs text-muted-foreground mb-2">
                              📍 {product.producer?.address_city || ''}
                              {product.producer?.address_country_code
                                ? `, ${product.producer.address_country_code}`
                                : ''}
                            </div>
                          )}
                          {product.producer?.contact_website && (
                            <a
                              href={product.producer?.contact_website || ''}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline group-hover:gap-3 transition-all"
                            >
                              {t('detail_page.visit_website')}
                              <ArrowLeft className="h-3 w-3 rotate-180" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Product Certifications */}
                {product.certifications &&
                  Array.isArray(product.certifications) &&
                  product.certifications.length > 0 && (
                    <div className="pt-6 border-t border-border/50">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-marketing-positive-500/10 text-marketing-positive-600 text-xs font-bold uppercase tracking-wider mb-4">
                        <Award className="h-3 w-3" />
                        <span>{t('detail.certifications')}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {product.certifications.map((cert: string, index: number) => (
                          <Badge
                            key={index}
                            className="bg-marketing-positive-50 text-marketing-positive-700 border-marketing-positive-200"
                          >
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modern Navigation */}
        <div className="mt-16">
          <Link href="/products">
            <Button variant="ghost" className="pl-0 hover:pl-2 transition-all group">
              <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">{t('detail_page.back_to_products')}</span>
            </Button>
          </Link>
        </div>
      </SectionContainer>

      {/* Modern CTA Section - Eco-Futurism Style */}
      <div className="container mx-auto px-4 pb-20 lg:pb-32 pt-20">
        <MarketingCtaBand
          badge={
            <>
              <Globe className="h-5 w-5 text-marketing-positive-400" />
              <span className="text-sm font-bold tracking-widest uppercase text-marketing-positive-100">
                {t('detail_page.cta.badge')}
              </span>
            </>
          }
          title={
            <>
              <span className="block text-marketing-overlay-light">
                {t('detail_page.cta.title_line1')}
              </span>
              <span className="block mt-2 text-transparent bg-clip-text bg-linear-to-r from-marketing-positive-400 via-marketing-gradient-mid-300 to-marketing-positive-400 bg-300% animate-gradient">
                {t('detail_page.cta.title_line2')}
              </span>
            </>
          }
          description={t('detail_page.cta.description')}
          primaryAction={
            <Link href="/products">
              <Button
                size="lg"
                className="h-16 px-10 text-lg rounded-full font-bold bg-marketing-positive-500 text-marketing-overlay-light hover:bg-marketing-positive-400 hover:scale-105 transition-all shadow-[0_0_50px_-10px_hsl(var(--marketing-positive) / 0.4)] border-none"
              >
                {t('detail_page.cta.primary')}
              </Button>
            </Link>
          }
          secondaryAction={
            <Link href="/about">
              <Button
                size="lg"
                variant="outline"
                className="h-16 px-10 text-lg rounded-full font-bold border-marketing-overlay-light/20 bg-transparent text-marketing-overlay-light hover:bg-marketing-overlay-light/10 hover:border-marketing-overlay-light/40 transition-all backdrop-blur-sm"
              >
                {t('detail_page.cta.secondary')}
              </Button>
            </Link>
          }
        />
      </div>

      {includeFloatingActions && (
        <FloatingActionButtons
          productId={product.id}
          productName={productName || t('card.default_name')}
          productSlug={product.slug}
          pricePoints={displayPoints}
          priceEuros={priceEuros}
          imageUrl={coverImage || null}
          fulfillmentMethod={product.fulfillment_method}
          stockQuantity={product.stock_quantity}
          displayPrice={displayPrice}
          inStock={inStock}
        />
      )}

      {includeStructuredData && (
        <script type="application/ld+json">{structuredDataJson}</script>
      )}
    </>
  )
}
