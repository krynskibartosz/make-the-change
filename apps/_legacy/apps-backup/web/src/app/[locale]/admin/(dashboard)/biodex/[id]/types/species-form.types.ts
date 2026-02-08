import { z } from 'zod';
import { type RouterOutputs } from '@/lib/trpc';

export type SpeciesDetailData = RouterOutputs['admin']['species']['byId'];

/**
 * Zod schema for species form validation
 * Aligns with database structure with validation rules
 */
export const speciesFormSchema = z
  .object({
    // Essential Info
    name: z
      .string()
      .min(1, "Le nom de l'espèce est requis")
      .max(200, 'Le nom ne peut pas dépasser 200 caractères')
      .trim(),

    scientific_name: z
      .string()
      .max(200, 'Le nom scientifique ne peut pas dépasser 200 caractères')
      .optional()
      .or(z.literal('')),

    description: z
      .string()
      .max(5000, 'La description ne peut pas dépasser 5000 caractères')
      .optional()
      .or(z.literal('')),

    // Images
    images: z
      .array(z.string().url("URL d'image invalide"))
      .max(10, 'Maximum 10 images par espèce')
      .default([]),

    // Content Levels
    content_levels: z.record(
      z.object({
        title: z.string().min(1, 'Le titre est requis'),
        description: z.string().min(1, 'La description est requise'),
      })
    ).default({}),
  })
  .refine(
    (data) => {
      // At least one content level should be defined
      return Object.keys(data.content_levels).length > 0;
    },
    {
      message: 'Au moins un niveau de contenu doit être défini',
      path: ['content_levels'],
    }
  );

/**
 * TypeScript type inferred from Zod schema
 */
export type SpeciesFormData = z.infer<typeof speciesFormSchema>;

/**
 * Raw species data from database
 */
export interface RawSpeciesData {
  id: string;
  name: string;
  scientific_name?: string | null;
  description?: string | null;
  icon_url?: string | null;
  image_url?: string | null;
  images?: string[] | null;
  content_levels?: Record<string, { title: string; description: string }> | null;
  created_at?: string;
  updated_at?: string;
}

/**
 * Enriched species data with translations
 */
export interface EnrichedSpeciesData extends RawSpeciesData {
  translations?: Array<{
    id: string;
    entity_type: string;
    entity_id: string;
    field_name: string;
    language: string;
    value: string;
    created_at?: string;
    updated_at?: string;
  }>;
}

/**
 * Default values for new species form
 */
export const DEFAULT_SPECIES_FORM_VALUES: SpeciesFormData = {
  name: '',
  scientific_name: '',
  description: '',
  images: [],
  content_levels: {
    beginner: { title: '', description: '' },
    intermediate: { title: '', description: '' },
    advanced: { title: '', description: '' },
  },
};

/**
 * Convert raw species data to form data
 * Handles null values from database
 */
export function normalizeSpeciesFormValues(
  species: RawSpeciesData | EnrichedSpeciesData | null
): SpeciesFormData {
  if (!species) {
    return DEFAULT_SPECIES_FORM_VALUES;
  }

  // Migrate old structure (icon_url, image_url) to new images array
  const images: string[] = [];
  if (species.images && Array.isArray(species.images)) {
    images.push(...species.images);
  } else {
    // Fallback to old structure
    if (species.image_url) images.push(species.image_url);
    if (species.icon_url) images.push(species.icon_url);
  }

  return {
    name: species.name || '',
    scientific_name: species.scientific_name || '',
    description: species.description || '',
    images,
    content_levels: species.content_levels || DEFAULT_SPECIES_FORM_VALUES.content_levels,
  };
}

/**
 * Convert form data to database update payload
 * - Required fields (name) always included
 * - Optional fields with values included
 * - Empty strings converted to null
 */
export function speciesToUpdatePayload(
  formData: SpeciesFormData
): Partial<RawSpeciesData> {
  const payload: Partial<RawSpeciesData> = {
    // Required field
    name: formData.name,
  };

  // Optional fields - send value or null
  const scientificName = formData.scientific_name?.trim();
  if (scientificName !== undefined && scientificName !== '') {
    payload.scientific_name = scientificName;
  } else if (scientificName === '') {
    payload.scientific_name = null;
  }

  const desc = formData.description?.trim();
  if (desc !== undefined && desc !== '') {
    payload.description = desc;
  } else if (desc === '') {
    payload.description = null;
  }

  // Images array (new structure)
  if (formData.images && formData.images.length > 0) {
    payload.images = formData.images;
    // Also set legacy fields for backwards compatibility
    payload.image_url = formData.images[0] || null;
    payload.icon_url = formData.images[1] || null;
  }

  // Content levels
  if (formData.content_levels) {
    payload.content_levels = formData.content_levels;
  }

  return payload;
}

/**
 * Fields that support translation
 */
export const TRANSLATABLE_SPECIES_FIELDS = ['name', 'description', 'scientific_name'] as const;

export type TranslatableSpeciesField = (typeof TRANSLATABLE_SPECIES_FIELDS)[number];

/**
 * Check if a field is translatable
 */
export function isTranslatableSpeciesField(
  field: string
): field is TranslatableSpeciesField {
  return TRANSLATABLE_SPECIES_FIELDS.includes(field as TranslatableSpeciesField);
}