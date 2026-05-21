import { notFound } from 'next/navigation'
import { getLocale } from 'next-intl/server'
import { FullScreenSlideModal } from '@/app/[locale]/@modal/_components/full-screen-slide-modal'
import { getPublicProductById } from '@/app/[locale]/(screens)/products/[id]/product-detail-data'
import { ProductQuickView } from '@/app/[locale]/(screens)/products/[id]/product-quick-view'
import { getLocalizedContent } from '@/lib/utils'
import { getCurrentProfile } from '@/lib/mock/mock-session-server'

interface InterceptedProductPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function InterceptedProductPage({ params }: InterceptedProductPageProps) {
  const { id } = await params
  const locale = await getLocale()
  const [product, profile] = await Promise.all([getPublicProductById(id), getCurrentProfile()])

  if (!product) {
    notFound()
  }

  const userBalance = profile?.impactCreditsBalance ?? 0

  const productName = getLocalizedContent(
    product.name_i18n,
    locale,
    product.name_default || 'Product details',
  )

  return (
    <FullScreenSlideModal
      title={productName}
      fallbackHref={`/products/${product.id}`}
      headerMode="dynamic"
    >
      <ProductQuickView product={product} userBalance={userBalance} />
    </FullScreenSlideModal>
  )
}
