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
      contentClassName="overflow-hidden p-0 !bg-background/95 sm:h-[calc(100dvh-2rem)] sm:w-[calc(100vw-2rem)] sm:max-h-[calc(100dvh-2rem)] sm:max-w-[1420px] sm:rounded-[28px] sm:border sm:border-border/60 sm:shadow-[0_25px_100px_hsl(var(--marketing-overlay-dark)/0.5)] sm:backdrop-blur-2xl"
    >
      <ProductQuickView product={product} />
    </InterceptedRouteDialog>
  )
}
