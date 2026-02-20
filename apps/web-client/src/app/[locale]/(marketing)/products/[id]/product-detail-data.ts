import { createClient } from '@/lib/supabase/server'
import { asNumber, asString, asStringArray, isRecord } from '@/lib/type-guards'

export type ProductProducer = {
  id: string
  slug: string | null
  name_default: string | null
  name_i18n?: Record<string, string> | null
  description_default: string | null
  description_i18n?: Record<string, string> | null
  images: string[] | null
  address_city: string | null
  address_country_code: string | null
  contact_website: string | null
}

export type ProductCategory = {
  name_default: string | null
  name_i18n?: Record<string, string> | null
}

export type PublicProduct = {
  id: string
  name_default: string
  name_i18n?: Record<string, string> | null
  slug: string | null
  description_default: string
  description_i18n?: Record<string, string> | null
  producer_id: string | null
  category_id: string | null
  featured: boolean | null
  is_hero_product: boolean | null
  tags: (string | null)[] | null
  stock_quantity: number | null
  price_points: number | null
  price_eur_equivalent: number | null
  fulfillment_method: 'ship' | 'pickup' | 'digital' | 'experience' | null
  image_url: string | null
  images: string[] | null
  certifications: string[] | null
}

export type ProductWithRelations = PublicProduct & {
  producer: ProductProducer | null
  category: ProductCategory | null
}

const toLocalizedRecord = (value: unknown): Record<string, string> | null => {
  if (!isRecord(value)) {
    return null
  }

  return Object.fromEntries(
    Object.entries(value).filter(
      (entry): entry is [string, string] => typeof entry[1] === 'string',
    ),
  )
}

const toNullableString = (value: unknown): string | null => {
  const parsed = asString(value)
  return parsed || null
}

const toNullableNumber = (value: unknown): number | null => {
  if (value === null || value === undefined) {
    return null
  }

  const parsed = asNumber(value, Number.NaN)
  return Number.isFinite(parsed) ? parsed : null
}

const toNullableBoolean = (value: unknown): boolean | null => {
  if (value === null || value === undefined) {
    return null
  }

  return typeof value === 'boolean' ? value : null
}

const toFulfillmentMethod = (value: unknown): PublicProduct['fulfillment_method'] =>
  value === 'ship' || value === 'pickup' || value === 'digital' || value === 'experience'
    ? value
    : null

const toProductProducer = (value: unknown): ProductProducer | null => {
  if (!isRecord(value)) {
    return null
  }

  const id = asString(value.id)
  if (!id) {
    return null
  }

  return {
    id,
    slug: toNullableString(value.slug),
    name_default: toNullableString(value.name_default),
    name_i18n: toLocalizedRecord(value.name_i18n),
    description_default: toNullableString(value.description_default),
    description_i18n: toLocalizedRecord(value.description_i18n),
    images: asStringArray(value.images),
    address_city: toNullableString(value.address_city),
    address_country_code: toNullableString(value.address_country_code),
    contact_website: toNullableString(value.contact_website),
  }
}

const toProductCategory = (value: unknown): ProductCategory | null => {
  if (!isRecord(value)) {
    return null
  }

  return {
    name_default: toNullableString(value.name_default),
    name_i18n: toLocalizedRecord(value.name_i18n),
  }
}

const toPublicProduct = (value: unknown): PublicProduct | null => {
  if (!isRecord(value)) {
    return null
  }

  const id = asString(value.id)
  const nameDefault = asString(value.name_default)
  if (!id || !nameDefault) {
    return null
  }

  return {
    id,
    name_default: nameDefault,
    name_i18n: toLocalizedRecord(value.name_i18n),
    slug: toNullableString(value.slug),
    description_default: asString(value.description_default),
    description_i18n: toLocalizedRecord(value.description_i18n),
    producer_id: toNullableString(value.producer_id),
    category_id: toNullableString(value.category_id),
    featured: toNullableBoolean(value.featured),
    is_hero_product: toNullableBoolean(value.is_hero_product),
    tags: asStringArray(value.tags),
    stock_quantity: toNullableNumber(value.stock_quantity),
    price_points: toNullableNumber(value.price_points),
    price_eur_equivalent: toNullableNumber(value.price_eur_equivalent),
    fulfillment_method: toFulfillmentMethod(value.fulfillment_method),
    image_url: toNullableString(value.image_url),
    images: asStringArray(value.images),
    certifications: asStringArray(value.certifications),
  }
}

export async function getPublicProductById(id: string): Promise<ProductWithRelations | null> {
  const supabase = await createClient()
  const { data: productData, error } = await supabase
    .from('public_products')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (error || !productData) {
    console.error('Error fetching product:', error)
    return null
  }

  const product = toPublicProduct(productData)
  if (!product) {
    return null
  }

  const [producerResult, categoryResult] = await Promise.all([
    product.producer_id
      ? supabase.from('producers').select('*').eq('id', product.producer_id).single()
      : Promise.resolve({ data: null }),
    product.category_id
      ? supabase.from('categories').select('*').eq('id', product.category_id).single()
      : Promise.resolve({ data: null }),
  ])

  const producer = toProductProducer(producerResult.data)
  const category = toProductCategory(categoryResult.data)

  return {
    ...product,
    producer,
    category,
  }
}
