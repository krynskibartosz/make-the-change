import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getLocale } from 'next-intl/server'
import { FullScreenSlideModal } from '@/app/[locale]/@modal/_components/full-screen-slide-modal'
import { getLocalizedContent } from '@/lib/utils'
import { buildPublicAppUrl } from '@/lib/public-url'
import { getPublicProductById } from './product-detail-data'
import { ProductQuickView } from './product-quick-view'

type ProductDetailPageProps = {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const product = await getPublicProductById(id)

  if (!product) {
    return {}
  }

  return {
    title: product.name_default,
    description: product.description_default,
    openGraph: {
      title: product.name_default,
      description: product.description_default,
      images: product.image_url ? [product.image_url] : [],
    },
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params
  const locale = await getLocale()
  const product = await getPublicProductById(id)

  if (!product) {
    notFound()
  }

  const productName = getLocalizedContent(product.name_i18n, locale, product.name_default || '')

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productName,
    description: product.description_default,
    image: product.image_url ? [product.image_url] : [],
    sku: product.id,
    offers: {
      '@type': 'Offer',
      url: buildPublicAppUrl(`/products/${product.id}`),
      priceCurrency: 'EUR',
      price: product.price_eur_equivalent ?? 0,
      availability:
        (product.stock_quantity ?? 0) > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  }
  const structuredDataJson = JSON.stringify(structuredData).replace(/</g, '\\u003c')

  return (
    <>
      <FullScreenSlideModal
        title={productName}
        fallbackHref="/products"
        headerMode="dynamic"
        asPage
      >
        <ProductQuickView product={product} />
      </FullScreenSlideModal>
      <script type="application/ld+json">{structuredDataJson}</script>
    </>
  )
}
