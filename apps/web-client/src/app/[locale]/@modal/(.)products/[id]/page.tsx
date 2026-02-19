import { notFound } from 'next/navigation'
import { InterceptedRouteDialog } from '@/app/[locale]/@modal/_components/intercepted-route-dialog'
import { QUICK_VIEW_MODAL_CONTENT_CLASSNAME } from '@/app/[locale]/@modal/_components/modal-content-presets'
import { getPublicProductById } from '@/app/[locale]/(marketing)/products/[id]/product-detail-data'
import { ProductQuickView } from '@/app/[locale]/(marketing)/products/[id]/product-quick-view'

interface InterceptedProductPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function InterceptedProductPage({ params }: InterceptedProductPageProps) {
  const { id } = await params
  const product = await getPublicProductById(id)

  if (!product) {
    notFound()
  }

  return (
    <InterceptedRouteDialog
      title={product.name_default || 'Product details'}
      contentClassName={QUICK_VIEW_MODAL_CONTENT_CLASSNAME}
    >
      <ProductQuickView product={product} />
    </InterceptedRouteDialog>
  )
}
