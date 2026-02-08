import { z } from 'zod';

/**
 * Zod schema for category form validation
 * Mirrors the categories table structure with validation rules
 */
export const categoryFormSchema = z.object({
  // Essential Info
  name: z
    .string()
    .min(1, 'Le nom de la catégorie est requis')
    .max(200, 'Le nom ne peut pas dépasser 200 caractères')
    .trim(),

  slug: z
    .string()
    .min(1, 'Le slug est requis')
    .max(100, 'Le slug ne peut pas dépasser 100 caractères')
    .regex(
      /^[a-z0-9-]+$/,
      'Le slug ne peut contenir que des lettres minuscules, chiffres et tirets'
    )
    .trim(),

  description: z
    .string()
    .max(2000, 'La description ne peut pas dépasser 2000 caractères')
    .optional()
    .or(z.literal('')),

  // Configuration
  parent_id: z.string().uuid().optional().nullable(),

  sort_order: z.number().int().min(0).default(0),

  is_active: z.boolean().default(true),

  // Image
  image_url: z
    .string()
    .url("URL d'image invalide")
    .max(500, "L'URL ne peut pas dépasser 500 caractères")
    .optional()
    .or(z.literal('')),

  // SEO
  seo_title: z
    .string()
    .max(200, 'Le titre SEO ne peut pas dépasser 200 caractères')
    .optional()
    .or(z.literal('')),

  seo_description: z
    .string()
    .max(500, 'La description SEO ne peut pas dépasser 500 caractères')
    .optional()
    .or(z.literal('')),
});

/**
 * TypeScript type inferred from Zod schema
 */
export type CategoryFormData = z.infer<typeof categoryFormSchema>;

/**
 * Raw category data from database
 */
export interface RawCategoryData {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  parent_id?: string | null;
  image_url?: string | null;
  sort_order: number;
  is_active: boolean;
  seo_title?: string | null;
  seo_description?: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Default values for new category form
 */
export const DEFAULT_CATEGORY_FORM_VALUES: CategoryFormData = {
  name: '',
  slug: '',
  description: '',
  parent_id: null,
  image_url: '',
  sort_order: 0,
  is_active: true,
  seo_title: '',
  seo_description: '',
};

/**
 * Convert raw category data to form data
 * Handles null values from database
 */
export function normalizeCategoryFormValues(
  category: RawCategoryData | null
): CategoryFormData {
  if (!category) {
    return DEFAULT_CATEGORY_FORM_VALUES;
  }

  return {
    name: category.name || '',
    slug: category.slug || '',
    description: category.description || '',
    parent_id: category.parent_id || null,
    image_url: category.image_url || '',
    sort_order: category.sort_order ?? 0,
    is_active: category.is_active ?? true,
    seo_title: category.seo_title || '',
    seo_description: category.seo_description || '',
  };
}

/**
 * Convert form data to database update payload
 * - Required fields are always included
 * - Optional fields with values are included
 * - Empty strings are converted to null (allows clearing fields)
 */
export function categoryFormToUpdatePayload(
  formData: CategoryFormData
): Partial<RawCategoryData> {
  const payload: Partial<RawCategoryData> = {
    // Required fields - always include
    name: formData.name,
    slug: formData.slug,
    is_active: formData.is_active,
    sort_order: formData.sort_order,
  };

  // Optional fields - send value or null
  const description = formData.description?.trim();
  if (description !== undefined && description !== '') {
    payload.description = description;
  } else if (description === '') {
    payload.description = null;
  }

  // Parent ID can be null (root category) or a valid UUID
  if (formData.parent_id !== undefined) {
    payload.parent_id = formData.parent_id || null;
  }

  const imageUrl = formData.image_url?.trim();
  if (imageUrl !== undefined && imageUrl !== '') {
    payload.image_url = imageUrl;
  } else if (imageUrl === '') {
    payload.image_url = null;
  }

  const seoTitle = formData.seo_title?.trim();
  if (seoTitle !== undefined && seoTitle !== '') {
    payload.seo_title = seoTitle;
  } else if (seoTitle === '') {
    payload.seo_title = null;
  }

  const seoDescription = formData.seo_description?.trim();
  if (seoDescription !== undefined && seoDescription !== '') {
    payload.seo_description = seoDescription;
  } else if (seoDescription === '') {
    payload.seo_description = null;
  }

  return payload;
}
