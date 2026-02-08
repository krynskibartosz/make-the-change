import { requireAdminPage } from '@/lib/auth-guards'
import { getCategories, getProducers } from '@/lib/queries/admin'
import ProductsNewClient from './products-new-client'

export default async function ProductsNewPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await requireAdminPage(locale)

  const [categoriesResult, producersResult] = await Promise.all([getCategories(), getProducers()])

  return <ProductsNewClient categories={categoriesResult.data} producers={producersResult.data} />
}
