'use server'

import { revalidatePath } from 'next/cache'

import { requireAdmin } from '@/lib/auth-guards'
import {
  type ProductFormData,
  productFormSchema,
  productPatchSchema,
} from '@/lib/validators/product'

export type ProductActionResult = {
  success: boolean
  data?: { id: string } & Record<string, unknown>
  error?: string
  errors?: Record<string, string[]>
}

import type { NewProduct } from '@make-the-change/core/schema'

// ...

// Adapter to map form data to schema-compatible format
// Adapter to map form data to schema-compatible format
function adaptProductDataForSchema(data: ProductFormData | Partial<ProductFormData>): Partial<NewProduct> {
  const patch: Partial<NewProduct> = {}

  // Mapped fields
  if ('name' in data) patch.name_default = data.name
  if ('description' in data) patch.description_default = data.description
  if ('short_description' in data) patch.short_description_default = data.short_description

  // Direct fields
  if ('slug' in data) patch.slug = data.slug
  if ('is_active' in data) patch.is_active = data.is_active
  if ('featured' in data) patch.featured = data.featured
  if ('is_hero_product' in data) patch.is_hero_product = data.is_hero_product
  
  if ('category_id' in data) patch.category_id = data.category_id
  if ('producer_id' in data) patch.producer_id = data.producer_id
  if ('secondary_category_id' in data) patch.secondary_category_id = data.secondary_category_id
  
  if ('price_points' in data) patch.price_points = data.price_points
  if ('price_eur_equivalent' in data) patch.price_eur_equivalent = data.price_eur_equivalent
  
  if ('stock_quantity' in data) patch.stock_quantity = data.stock_quantity
  if ('stock_management' in data) patch.stock_management = data.stock_management
  if ('min_tier' in data) patch.min_tier = data.min_tier
  if ('fulfillment_method' in data) patch.fulfillment_method = data.fulfillment_method
  
  if ('images' in data) patch.images = data.images
  if ('tags' in data) patch.tags = data.tags
  if ('allergens' in data) patch.allergens = data.allergens as any // Enum array casting might be needed if types mismatch slightly
  if ('certifications' in data) patch.certifications = data.certifications as any
  
  if ('weight_grams' in data) patch.weight_grams = data.weight_grams
  if ('dimensions' in data) patch.dimensions = data.dimensions
  if ('nutrition_facts' in data) patch.nutrition_facts = data.nutrition_facts
  if ('seasonal_availability' in data) patch.seasonal_availability = data.seasonal_availability
  if ('variants' in data) patch.variants = data.variants
  if ('metadata' in data) patch.metadata = data.metadata
  
  if ('origin_country' in data) patch.origin_country = data.origin_country
  if ('partner_source' in data) patch.partner_source = data.partner_source
  
  if ('launch_date' in data) patch.launch_date = data.launch_date
  if ('discontinue_date' in data) patch.discontinue_date = data.discontinue_date
  
  // SEO & Translations
  if ('seo_title' in data) patch.seo_title = data.seo_title
  if ('seo_description' in data) patch.seo_description = data.seo_description
  
  if ('name_i18n' in data) patch.name_i18n = data.name_i18n
  if ('description_i18n' in data) patch.description_i18n = data.description_i18n
  if ('short_description_i18n' in data) patch.short_description_i18n = data.short_description_i18n
  if ('seo_title_i18n' in data) patch.seo_title_i18n = data.seo_title_i18n
  if ('seo_description_i18n' in data) patch.seo_description_i18n = data.seo_description_i18n

  return patch
}

export async function createProductAction(input: ProductFormData): Promise<ProductActionResult> {
  await requireAdmin()
  const parsed = productFormSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Validation failed',
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  const db = await import('@make-the-change/core/db').then((m) => m.db)
  const { products } = await import('@make-the-change/core/schema')

  try {
    const adapted = adaptProductDataForSchema(parsed.data)
    const [data] = await db
      .insert(products)
      .values(adapted as NewProduct)
      .returning()

    revalidatePath('/admin/products')
    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create product',
    }
  }
}

export async function updateProductAction(
  id: string,
  patch: Partial<ProductFormData>,
): Promise<ProductActionResult> {
  await requireAdmin()
  const parsed = productPatchSchema.safeParse(patch)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Validation failed',
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  const db = await import('@make-the-change/core/db').then((m) => m.db)
  const { products } = await import('@make-the-change/core/schema')
  const { eq } = await import('drizzle-orm')

  try {
    const adapted = adaptProductDataForSchema(parsed.data)
    const [data] = await db.update(products).set(adapted).where(eq(products.id, id)).returning()

    if (!data) {
      return { success: false, error: 'Product not found' }
    }

    revalidatePath('/admin/products')
    revalidatePath(`/admin/products/${id}`)
    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update product',
    }
  }
}
