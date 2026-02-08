import { db } from '@make-the-change/core/db'
import { products } from '@make-the-change/core/schema'
import { eq } from 'drizzle-orm'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { requireAdminPage } from '@/lib/auth-guards'
import { getCategories, getProducers } from '@/lib/queries/admin'
import { defaultProductValues, type ProductFormData } from '@/lib/validators/product'
import { ProductDetailController } from './components/product-detail-controller'

export async function generateMetadata(props: {
  params: Promise<{ id: string; locale: string }>
}): Promise<Metadata> {
  const params = await props.params
  const t = await getTranslations({ locale: params.locale, namespace: 'admin.products.edit' })

  const product = await db.query.products.findFirst({
    where: eq(products.id, params.id),
    columns: { name_default: true, slug: true },
  })

  return {
    title: product ? `${product.name_default} | Admin` : t('title_not_found'),
  }
}

export default async function AdminProductEditPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>
}) {
  const { id, locale } = await params
  await requireAdminPage(locale)

  const [product, categoriesResult, producersResult] = await Promise.all([
    db.query.products.findFirst({
      where: eq(products.id, id),
      with: {
        producer: true,
        category: true,
      },
    }),
    getCategories(),
    getProducers(),
  ])

  if (!product) {
    return <div className="p-8">Produit non trouvé</div>
  }

  // Map DB product to Form Data
  const productData: ProductFormData & { id: string } = {
    ...defaultProductValues,
    id: product.id,
    name: product.name_default ?? '',
    slug: product.slug ?? '',
    description: product.description_default ?? '',
    short_description: product.short_description_default ?? '',
    price_points: product.price_points ?? 0,
    stock_quantity: product.stock_quantity ?? 0,
    category_id: product.category_id ?? '',
    producer_id: product.producer_id ?? '',
    min_tier: (product.min_tier as ProductFormData['min_tier']) ?? 'explorateur',
    fulfillment_method:
      (product.fulfillment_method as ProductFormData['fulfillment_method']) ?? 'ship',
    is_active: product.is_active ?? true,
    featured: product.featured ?? false,
    is_hero_product: product.is_hero_product ?? false,
    price_eur_equivalent: product.price_eur_equivalent?.toString(),
    weight_grams: product.weight_grams ?? undefined,
    origin_country: product.origin_country ?? '',
    partner_source: product.partner_source ?? '',
    secondary_category_id: product.secondary_category_id ?? undefined,
    tags: (product.tags as string[]) ?? [],
    allergens: (product.allergens as string[]) ?? [],
    certifications: (product.certifications as string[]) ?? [],
    images: product.images ?? [],
    seo_title: product.seo_title ?? '',
    seo_description: product.seo_description ?? '',
    launch_date: product.launch_date ? new Date(product.launch_date).toISOString() : undefined,
    discontinue_date: product.discontinue_date
      ? new Date(product.discontinue_date).toISOString()
      : undefined,
    name_i18n: (product.name_i18n as Record<string, string>) ?? {},
    description_i18n: (product.description_i18n as Record<string, string>) ?? {},
    short_description_i18n: (product.short_description_i18n as Record<string, string>) ?? {},
    seo_title_i18n: (product.seo_title_i18n as Record<string, string>) ?? {},
    seo_description_i18n: (product.seo_description_i18n as Record<string, string>) ?? {},
  }

  return (
    <ProductDetailController
      categories={categoriesResult.data}
      producers={producersResult.data}
      productData={productData}
    />
  )
}
