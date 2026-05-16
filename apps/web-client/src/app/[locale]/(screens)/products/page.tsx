import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import { parseProductsQueryState } from '@/app/[locale]/(screens)/products/_features/query-state'
import { Screen } from '@/app/[locale]/(screens)/_components/screen'
import { Link } from '@/i18n/navigation'
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
    <Screen
      header={
        <div className="flex w-full items-center justify-between gap-3">
          <Link
            href="/advantages"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors active:bg-white/10"
            aria-label="Retour aux avantages"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/35">
              Avantages
            </p>
            <p className="truncate text-sm font-black text-white">Catalogue complet</p>
          </div>
        </div>
      }
      className="bg-[#0B0F15]"
    >
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
    </Screen>
  )
}
