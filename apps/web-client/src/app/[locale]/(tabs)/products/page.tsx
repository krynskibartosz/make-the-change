import type { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import { parseProductsQueryState } from '@/app/[locale]/(tabs)/products/_features/query-state'
import { getLocalizedContent } from '@/lib/utils'
import { getProducts } from './_features/get-products'
import { type Product, ProductsClient } from './products-client'

type ProductsPageProps = {
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
  const locale = await getLocale()
  const params = await searchParams
  const queryState = parseProductsQueryState(params)

  const { products: productsList, pagination, resolvedCategory } = await getProducts(queryState)

  const products: Product[] = productsList.map((product) => ({
    ...product,
    name_default: getLocalizedContent(product.name_i18n, locale, product.name_default),
    short_description_default: getLocalizedContent(
      product.short_description_i18n,
      locale,
      product.short_description_default || '',
    ),
    description_default: getLocalizedContent(
      product.description_i18n,
      locale,
      product.description_default || '',
    ),
    price: product.price ?? (product.price_points ? product.price_points / 100 : 0),
    price_points: product.price_points ?? 0,
  }))

  return (
    <>
      <section className="pb-12 pt-0 md:pb-16 md:pt-2">
        <ProductsClient
          products={products}
          pagination={pagination}
          initialQueryState={{
            ...queryState,
            category: resolvedCategory,
            page: pagination.currentPage,
          }}
        />
      </section>
    </>
  )
}
