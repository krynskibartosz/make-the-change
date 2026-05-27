import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import { Screen } from '@/app/[locale]/(screens)/_components/screen'
import { parseProductsQueryState } from '@/app/[locale]/(screens)/products/_features/query-state'
import { Link } from '@/i18n/navigation'
import { getCurrentMockCart } from '@/lib/mock/mock-commerce-server'
import { getLocalizedContent } from '@/lib/utils'
import { getProducts } from './_features/get-products'
import { type Product, ProductsClient } from './products-client'

type ProductsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Boutique partenaire',
    openGraph: {
      title: 'Boutique partenaire',
    },
  }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const locale = await getLocale()
  const params = await searchParams
  const queryState = parseProductsQueryState(params)

  const [{ products: productsList, pagination, resolvedCategory }, cart] = await Promise.all([
    getProducts(queryState),
    getCurrentMockCart(),
  ])

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
    price: product.price,
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
              Boutique
            </p>
            <h1 className="truncate text-sm font-black text-white">Produits partenaires</h1>
          </div>
        </div>
      }
      className="bg-[#0B0F15]"
      headerClassName="bg-[#0B0F15]/90"
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
          cartCount={cart.lines.reduce((sum, line) => sum + line.quantity, 0)}
        />
      </section>
    </Screen>
  )
}
