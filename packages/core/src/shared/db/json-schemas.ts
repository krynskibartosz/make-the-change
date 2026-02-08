import { z } from 'zod';

// ============================================================================
// SHARED TYPES (JSONB STRUCTURES)
// ============================================================================

/**
 * Interface for investment.species.content_levels
 */
export const contentLevelsSchema = z.object({
  beginner: z.object({
    title: z.string(),
    description: z.string(),
    unlocked_at_level: z.literal(0),
  }),
  intermediate: z.object({
    title: z.string(),
    description: z.string(),
    unlocked_at_level: z.literal(5),
  }),
  advanced: z.object({
    title: z.string(),
    description: z.string(),
    unlocked_at_level: z.literal(10),
  }),
});

export type SpeciesContentLevels = z.infer<typeof contentLevelsSchema>;

/**
 * Interface for commerce.products.variants
 */
export const productVariantsSchema = z.object({
  attributes: z.array(
    z.object({
      name: z.string(), // ex: "Taille"
      values: z.array(z.string()), // ex: ["S", "M", "L"]
    })
  ),
  skus: z.array(
    z.object({
      id: z.string(),
      sku: z.string(),
      attributes: z.record(z.string()), // { "Taille": "M" }
      price_adjustment: z.number().optional(), // Delta prix en points
      stock_quantity: z.number(),
    })
  ),
});

export type ProductVariants = z.infer<typeof productVariantsSchema>;

/**
 * Interface for commerce.products.seasonal_availability
 */
export const seasonalAvailabilitySchema = z.object({
  months: z.array(z.number().min(1).max(12)), // [1, 2, 12] pour Hiver
  is_preorder_allowed: z.boolean(),
  harvest_period: z
    .object({
      start: z.string(), // "MM-DD" or "YYYY-MM-DD"
      end: z.string(),
    })
    .optional(),
});

export type SeasonalAvailability = z.infer<typeof seasonalAvailabilitySchema>;

/**
 * Interface for investment.producers.social_media
 */
export const producerSocialsSchema = z.object({
  website: z.string().url().optional().or(z.literal('')),
  facebook: z.string().url().optional().or(z.literal('')),
  instagram: z.string().url().optional().or(z.literal('')),
  linkedin: z.string().url().optional().or(z.literal('')),
  twitter: z.string().url().optional().or(z.literal('')),
});

export type ProducerSocials = z.infer<typeof producerSocialsSchema>;

/**
 * Interface for investment.producers.capacity_info
 */
export const producerCapacitySchema = z.object({
  annual_production: z.number().nonnegative(),
  unit: z.string(), // "kg", "liters", "units"
  surface_area_hectares: z.number().nonnegative().optional(),
  employees_count: z.number().nonnegative().optional(),
  established_year: z.number().int().min(1800).max(2100).optional(),
});

export type ProducerCapacity = z.infer<typeof producerCapacitySchema>;

/**
 * Interface for content.blog_posts.content (TipTap JSON)
 */
export const tipTapContentSchema = z.object({
  type: z.literal('doc'),
  content: z.array(
    z.object({
      type: z.string(),
      attrs: z.record(z.any()).optional(),
      content: z.array(z.any()).optional(),
      marks: z.array(z.any()).optional(),
      text: z.string().optional(),
    })
  ),
});

export type TipTapContent = z.infer<typeof tipTapContentSchema>;

// ============================================================================
// ENTITY SCHEMAS
// ============================================================================

/**
 * Schema for Biodex Species Form
 */
export const speciesFormSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(200),
  scientific_name: z.string().max(200).optional().or(z.literal('')),
  description: z.string().max(5000).optional().or(z.literal('')),
  images: z.array(z.string().url()).max(10).default([]),
  content_levels: contentLevelsSchema.optional(), // Can be partial during edit
  conservation_status: z.enum([
    'least_concern',
    'near_threatened',
    'vulnerable',
    'endangered',
    'critically_endangered',
    'extinct_in_the_wild',
    'extinct',
  ]).optional(),
});

export type SpeciesFormData = z.infer<typeof speciesFormSchema>;

/**
 * Schema for Product Form
 */
export const productFormSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(100),
  slug: z.string().min(1).max(80).regex(/^[\da-z-]+$/),
  price_points: z.number().int().positive().max(50000),
  price_eur_equivalent: z.number().nonnegative().optional(),
  stock_quantity: z.number().int().nonnegative().default(0),
  category_id: z.string().uuid(),
  producer_id: z.string().uuid().optional().or(z.literal('')),
  fulfillment_method: z.enum(['stock', 'dropship', 'ondemand', 'ship', 'pickup', 'digital', 'experience']).default('stock'),
  is_active: z.boolean().default(true),
  variants: productVariantsSchema.optional(),
  seasonal_availability: seasonalAvailabilitySchema.optional(),
  seo_keywords: z.string().optional(),
  images: z.array(z.string().url()).max(10).default([]),
});

export type ProductFormData = z.infer<typeof productFormSchema>;

/**
 * Schema for Producer Form
 */
export const producerFormSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  status: z.enum(['active', 'inactive', 'suspended', 'pending', 'archived']).default('pending'),
  type: z.enum(['farmer', 'cooperative', 'association', 'company', 'individual']).default('farmer'),
  contact_email: z.string().email().optional().or(z.literal('')),
  social_media: producerSocialsSchema.optional(),
  capacity_info: producerCapacitySchema.optional(),
  images: z.array(z.string().url()).max(10).default([]),
  address_street: z.string().optional(),
  address_city: z.string().optional(),
  address_country_code: z.string().length(2).optional(),
});

export type ProducerFormData = z.infer<typeof producerFormSchema>;
