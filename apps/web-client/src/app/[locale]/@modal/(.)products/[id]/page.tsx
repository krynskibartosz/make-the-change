import { notFound } from 'next/navigation'
import { InterceptedRouteDialog } from '@/app/[locale]/@modal/_components/intercepted-route-dialog'
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
      contentClassName="w-[calc(100vw-1rem)] sm:w-[calc(100vw-2rem)] max-w-[1420px] h-[calc(100dvh-1rem)] sm:h-[calc(100dvh-2rem)] max-h-[calc(100dvh-1rem)] sm:max-h-[calc(100dvh-2rem)] overflow-hidden rounded-[28px] border border-border/60 bg-background/95 p-0 shadow-[0_25px_100px_hsl(var(--marketing-overlay-dark)/0.5)] backdrop-blur-2xl"
    >
      <ProductQuickView product={product} />
    </InterceptedRouteDialog>
  )
}
