import { getTranslations } from 'next-intl/server'
import { PageHero } from '@/components/ui/page-hero'
import { SectionContainer } from '@/components/ui/section-container'
import { createClient } from '@/lib/supabase/server'
import { ProductsClient, type Product, type Category, type Producer } from './products-client'

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string
    search?: string
    producer?: string
  }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const t = await getTranslations('products')
  const params = await searchParams
  const supabase = await createClient()

  // Fetch categories using public view
  const { data: categoriesList } = await supabase
    .from('categories')
    .select('*')
    .order('name_default', { ascending: true })

  // Fetch producers using public view
  const { data: producersList } = await supabase
    .from('producers')
    .select('id, name_default')
    .order('name_default', { ascending: true })

  const category =
    typeof params.category === 'string' && /^[0-9a-f-]{36}$/i.test(params.category)
      ? params.category
      : ''
  
  const producer =
    typeof params.producer === 'string' && /^[0-9a-f-]{36}$/i.test(params.producer)
      ? params.producer
      : ''

  const search = typeof params.search === 'string' ? params.search.trim() : ''

  let productsQuery = (supabase as any)
    .from('public_products')
    .select('*')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(48)

  if (category) {
    productsQuery = productsQuery.eq('category_id', category)
  }

  if (producer) {
    productsQuery = productsQuery.eq('producer_id', producer)
  }

  if (search.length >= 2) {
    productsQuery = productsQuery.ilike('name_default', `%${search}%`)
  }

  const { data: productsList, error: productsError } = await productsQuery

  if (productsError) {
    console.error('[products] fetch products failed', productsError)
  }

  const products = (productsList || []).map((product: any) => ({
    ...product,
    price: product.price_points ? product.price_points / 100 : 0,
    price_points: product.price_points || 0,
  })) as Product[]

  const serializedProducts = JSON.parse(JSON.stringify(products))

  return (
    <>
      <PageHero
        title={t('title')}
        description={t('subtitle')}
        hideDescriptionOnMobile
        size="sm"
        variant="default"
        className="pb-0 md:pb-8"
      />
      <SectionContainer size="sm" className="pt-0 md:pt-4">
        <ProductsClient
          products={serializedProducts}
          categories={(categoriesList || []) as Category[]}
          producers={(producersList || []) as Producer[]}
          initialCategory={category}
          initialProducer={producer}
          initialSearch={search}
        />
      </SectionContainer>
    </>
  )
}
