import { createClient } from '@/lib/supabase/server'

export type ProductProducer = {
  id: string
  slug: string | null
  name_default: string | null
  description_default: string | null
  images: string[] | null
  address_city: string | null
  address_country_code: string | null
  contact_website: string | null
}

export type ProductCategory = {
  name_default: string | null
}

export type PublicProduct = {
  id: string
  name_default: string
  slug: string | null
  description_default: string
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

type PublicProductsClient = {
  from: (table: string) => {
    select: (columns: string) => {
      eq: (
        column: string,
        value: unknown,
      ) => {
        eq: (
          column: string,
          value: unknown,
        ) => {
          single: () => Promise<{ data: PublicProduct | null; error: unknown }>
        }
      }
    }
  }
}

export async function getPublicProductById(id: string): Promise<ProductWithRelations | null> {
  const supabase = await createClient()
  const publicProductsClient = supabase as unknown as PublicProductsClient

  const { data: productData, error } = await publicProductsClient
    .from('public_products')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (error || !productData) {
    console.error('Error fetching product:', error)
    return null
  }

  const [producerResult, categoryResult] = await Promise.all([
    productData.producer_id
      ? supabase.from('producers').select('*').eq('id', productData.producer_id).single()
      : Promise.resolve({ data: null }),
    productData.category_id
      ? supabase.from('categories').select('*').eq('id', productData.category_id).single()
      : Promise.resolve({ data: null }),
  ])

  const producer = (producerResult.data as ProductProducer | null) || null
  const category = (categoryResult.data as ProductCategory | null) || null

  return {
    ...productData,
    producer,
    category,
  }
}
