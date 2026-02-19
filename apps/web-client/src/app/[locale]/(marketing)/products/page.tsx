import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { parseProductsQueryState } from '@/app/[locale]/(marketing)/products/_features/query-state'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { getProductStaticResources, getProducts } from './_features/get-products'
import { type Category, type Producer, type Product, ProductsClient } from './products-client'

interface ProductsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('products')
  return {
    title: t('title'),
    openGraph: {
      title: t('title'),
    },
  }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const _t = await getTranslations('products')
  const navT = await getTranslations('navigation')
  const params = await searchParams
  const queryState = parseProductsQueryState(params)

  // Parallel fetch: Static resources + Dynamic products list
  const [staticData, productsData] = await Promise.all([
    getProductStaticResources(),
    getProducts(queryState),
  ])

  const { categories, producers, availableTags } = staticData
  const { products: productsList, pagination } = productsData

  const products = (productsList || []).map((product) => ({
    ...product,
    price: product.price_points ? product.price_points / 100 : 0,
    price_points: product.price_points || 0,
  })) as Product[]

  const serializedProducts = JSON.parse(JSON.stringify(products))

  return (
    <>
      <section className="container pb-12 pt-0 md:pb-16 md:pt-2">
        <Breadcrumbs items={[{ label: navT('products'), href: '/products' }]} />
        <ProductsClient
          products={serializedProducts}
          categories={(categories || []) as Category[]}
          producers={(producers || []) as Producer[]}
          availableTags={availableTags}
          pagination={pagination}
          initialQueryState={{
            ...queryState,
            page: pagination.currentPage,
          }}
        />
      </section>
    </>
  )
}
