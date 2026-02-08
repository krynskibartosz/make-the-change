import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProductDetailClient } from './product-detail-client'

// ... existing imports ...

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('public_products')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!product) {
    return {
      title: 'Produit non trouvé',
    }
  }

  return {
    title: product.name_default || 'Produit',
    description: product.description_default,
    keywords: product.seo_keywords || [],
    openGraph: {
      title: product.name_default || 'Produit',
      description: product.description_default || undefined,
      // No explicit image column in schema, omit images for now
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch product using Supabase client without relations first (views don't support joins easily)
  const { data: product } = await supabase
    .from('public_products')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!product) {
    notFound()
  }

  // Fetch producer separately
  const { data: producer } = await supabase
    .from('public_producers')
    .select('*')
    .eq('id', product.producer_id)
    .single()

  // Fetch related products
  const { data: relatedProducts } = await supabase
    .from('public_products')
    .select('*')
    .eq('category_id', product.category_id)
    .neq('id', product.id)
    .limit(4)

  return (
    <ProductDetailClient
      product={product}
      producer={producer}
      relatedProducts={relatedProducts || []}
    />
  )
}
