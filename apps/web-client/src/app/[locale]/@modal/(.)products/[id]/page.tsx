import { notFound } from 'next/navigation'
import { getLocale } from 'next-intl/server'
import { FullScreenSlideModal } from '@/app/[locale]/@modal/_components/full-screen-slide-modal'
import { getPublicProductById } from '@/app/[locale]/(marketing)/products/[id]/product-detail-data'
import { ProductQuickView } from '@/app/[locale]/(marketing)/products/[id]/product-quick-view'
import { getLocalizedContent } from '@/lib/utils'

interface InterceptedProductPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function InterceptedProductPage({ params }: InterceptedProductPageProps) {
  const { id } = await params
  const locale = await getLocale()
  const product = await getPublicProductById(id)

  if (!product) {
    notFound()
  }

  const productName = getLocalizedContent(
    product.name_i18n,
    locale,
    product.name_default || 'Product details',
  )

  return (
    <FullScreenSlideModal
      title={productName}
      fallbackHref={`/products/${product.id}`}
    >
      <ProductQuickView product={product} />
    </FullScreenSlideModal>
  )
}
