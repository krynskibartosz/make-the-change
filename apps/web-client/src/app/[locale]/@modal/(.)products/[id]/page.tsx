import { notFound } from 'next/navigation'
import { getLocale } from 'next-intl/server'
import { InterceptedRouteDialog } from '@/app/[locale]/@modal/_components/intercepted-route-dialog'
import { QUICK_VIEW_MODAL_CONTENT_CLASSNAME } from '@/app/[locale]/@modal/_components/modal-content-presets'
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
    <InterceptedRouteDialog
      title={productName}
      contentClassName={QUICK_VIEW_MODAL_CONTENT_CLASSNAME}
    >
      <ProductQuickView product={product} />
    </InterceptedRouteDialog>
  )
}
