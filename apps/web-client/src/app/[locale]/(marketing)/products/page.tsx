import { getTranslations } from 'next-intl/server'
import { PageHero } from '@/components/ui/page-hero'
import { SectionContainer } from '@/components/ui/section-container'
import {
  applyProductsFilters,
  applyProductsSort,
  clampPage,
  getPaginationRange,
  toProductsPagination,
} from '@/features/commerce/products/products-query'
import {
  PRODUCTS_PAGE_SIZE,
  parseProductsQueryState,
} from '@/features/commerce/products/query-state'
import { createClient } from '@/lib/supabase/server'
import { type Category, type Producer, type Product, ProductsClient } from './products-client'

interface ProductsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const t = await getTranslations('products')
  const params = await searchParams
  const queryState = parseProductsQueryState(params)
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

  const { data: tagsRows } = await supabase.from('public_products').select('tags')

  let countQuery = supabase.from('public_products').select('id', { count: 'exact', head: true })

  countQuery = applyProductsFilters(countQuery, queryState)

  const { count, error: countError } = await countQuery

  if (countError) {
    console.error('[products] fetch count failed', countError)
  }

  const totalItems = count ?? 0
  const pagination = toProductsPagination(totalItems, queryState.page, PRODUCTS_PAGE_SIZE)
  const currentPage = clampPage(queryState.page, pagination.totalPages)
  const { from, to } = getPaginationRange(currentPage, PRODUCTS_PAGE_SIZE)

  let productsQuery = supabase.from('public_products').select('*')

  productsQuery = applyProductsFilters(productsQuery, queryState)
  productsQuery = applyProductsSort(productsQuery, queryState.sort)
  productsQuery = productsQuery.range(from, to)

  const { data: productsList, error: productsError } = await productsQuery

  if (productsError) {
    console.error('[products] fetch products failed', productsError)
  }

  const products = (productsList || []).map((product) => ({
    ...product,
    price: product.price_points ? product.price_points / 100 : 0,
    price_points: product.price_points || 0,
  })) as Product[]

  const availableTags = Array.from(
    new Set<string>((tagsRows || []).flatMap((row: { tags?: string[] | null }) => row.tags || [])),
  ).sort((a, b) => a.localeCompare(b))

  const serializedProducts = JSON.parse(JSON.stringify(products))

  return (
    <>
      <PageHero
        title={t('title')}
        description={t('subtitle')}
        hideDescriptionOnMobile={false}
        size="sm"
        variant="default"
        className="py-8 md:pb-12 md:pt-24"
      />
      <SectionContainer size="sm" className="pt-0 md:pt-2">
        <ProductsClient
          products={serializedProducts}
          categories={(categoriesList || []) as Category[]}
          producers={(producersList || []) as Producer[]}
          availableTags={availableTags}
          pagination={{
            ...pagination,
            currentPage,
          }}
          initialQueryState={{
            ...queryState,
            page: currentPage,
          }}
        />
      </SectionContainer>
    </>
  )
}
