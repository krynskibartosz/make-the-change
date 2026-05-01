import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPublicProductById } from './product-detail-data'
import { ProductDetails } from './product-details'

interface ProductDetailPageProps {
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
  const product = await getPublicProductById(id)

  if (!product) {
    notFound()
  }

  return <ProductDetails product={product} />
}
