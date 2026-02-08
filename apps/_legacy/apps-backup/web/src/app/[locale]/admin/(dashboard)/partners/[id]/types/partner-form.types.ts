import { z } from 'zod';

/**
 * Zod schema for partner form validation
 * Mirrors the producers table structure with validation rules
 */
export const partnerFormSchema = z
  .object({
    // Essential Info
    name: z
      .string()
      .min(1, 'Le nom du partenaire est requis')
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

    status: z
      .enum(['active', 'inactive', 'suspended'])
      .default('inactive'),

    // Contact Info
    contact_email: z
      .string()
      .email('Email invalide')
      .max(255, "L'email ne peut pas dépasser 255 caractères")
      .optional()
      .or(z.literal('')),

    website: z
      .string()
      .url('URL invalide')
      .max(500, "L'URL ne peut pas dépasser 500 caractères")
      .optional()
      .or(z.literal('')),

    // Address Info
    address_street: z
      .string()
      .max(255, "L'adresse ne peut pas dépasser 255 caractères")
      .optional()
      .or(z.literal('')),

    address_city: z
      .string()
      .max(100, 'La ville ne peut pas dépasser 100 caractères')
      .optional()
      .or(z.literal('')),

    address_postal_code: z
      .string()
      .max(20, 'Le code postal ne peut pas dépasser 20 caractères')
      .optional()
      .or(z.literal('')),

    address_country: z
      .string()
      .max(100, 'Le pays ne peut pas dépasser 100 caractères')
      .optional()
      .or(z.literal('')),

    // Metadata
    description: z
      .string()
      .max(2000, 'La description ne peut pas dépasser 2000 caractères')
      .optional()
      .or(z.literal('')),

    // Images
    images: z
      .array(z.string().url("URL d'image invalide"))
      .max(10, 'Maximum 10 images par partenaire')
      .default([]),
  })
  .refine(
    (data) => {
      // If any address field is filled, at least city and country should be provided
      const hasAnyAddress =
        data.address_street ||
        data.address_city ||
        data.address_postal_code ||
        data.address_country;

      if (hasAnyAddress) {
        return !!(data.address_city && data.address_country);
      }
      return true;
    },
    {
      message:
        'Si vous renseignez une adresse, la ville et le pays sont requis',
      path: ['address_city'],
    }
  );

/**
 * TypeScript type inferred from Zod schema
 */
export type PartnerFormData = z.infer<typeof partnerFormSchema>;

/**
 * Raw partner data from database (producers table)
 */
export interface RawPartnerData {
  id: string;
  name: string;
  slug: string;
  status: 'active' | 'inactive' | 'suspended';
  contact_email?: string | null;
  website?: string | null;
  address_street?: string | null;
  address_city?: string | null;
  address_postal_code?: string | null;
  address_country?: string | null;
  description?: string | null;
  images?: string[] | null;
  created_at?: string;
  updated_at?: string;
}

/**
 * Enriched partner data with translations
 */
export interface EnrichedPartnerData extends RawPartnerData {
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
 * Default values for new partner form
 */
export const DEFAULT_PARTNER_FORM_VALUES: PartnerFormData = {
  name: '',
  slug: '',
  status: 'inactive',
  contact_email: '',
  website: '',
  address_street: '',
  address_city: '',
  address_postal_code: '',
  address_country: '',
  description: '',
  images: [],
};

/**
 * Convert raw partner data to form data
 * Handles null values from database
 */
export function normalizePartnerFormValues(
  partner: RawPartnerData | EnrichedPartnerData | null
): PartnerFormData {
  if (!partner) {
    return DEFAULT_PARTNER_FORM_VALUES;
  }

  return {
    name: partner.name || '',
    slug: partner.slug || '',
    status: partner.status || 'inactive',
    contact_email: partner.contact_email || '',
    website: partner.website || '',
    address_street: partner.address_street || '',
    address_city: partner.address_city || '',
    address_postal_code: partner.address_postal_code || '',
    address_country: partner.address_country || '',
    description: partner.description || '',
    images: partner.images || [],
  };
}

/**
 * Convert form data to database update payload
 * - Required fields (name, slug, status) are always included
 * - Optional fields with values are included (for JSONB merge on server)
 * - Empty strings are converted to null (allows clearing fields)
 *
 * Note: The server will merge these into JSONB fields (address, contact_info)
 */
export function partnerFormToUpdatePayload(
  formData: PartnerFormData
): Partial<RawPartnerData> {
  const payload: Partial<RawPartnerData> = {
    // Required fields - always include
    name: formData.name,
    slug: formData.slug,
    status: formData.status,
  };

  // Optional fields - send value or null (server handles JSONB merge)
  // Convert empty strings to null to allow clearing fields
  const email = formData.contact_email?.trim();
  if (email !== undefined && email !== '') {
    payload.contact_email = email;
  } else if (email === '') {
    payload.contact_email = null;
  }

  const web = formData.website?.trim();
  if (web !== undefined && web !== '') {
    payload.website = web;
  } else if (web === '') {
    payload.website = null;
  }

  const street = formData.address_street?.trim();
  if (street !== undefined && street !== '') {
    payload.address_street = street;
  } else if (street === '') {
    payload.address_street = null;
  }

  const city = formData.address_city?.trim();
  if (city !== undefined && city !== '') {
    payload.address_city = city;
  } else if (city === '') {
    payload.address_city = null;
  }

  const postal = formData.address_postal_code?.trim();
  if (postal !== undefined && postal !== '') {
    payload.address_postal_code = postal;
  } else if (postal === '') {
    payload.address_postal_code = null;
  }

  const country = formData.address_country?.trim();
  if (country !== undefined && country !== '') {
    payload.address_country = country;
  } else if (country === '') {
    payload.address_country = null;
  }

  const desc = formData.description?.trim();
  if (desc !== undefined && desc !== '') {
    payload.description = desc;
  } else if (desc === '') {
    payload.description = null;
  }

  if (formData.images && formData.images.length > 0) {
    payload.images = formData.images;
  }

  return payload;
}

/**
 * Fields that support translation
 */
export const TRANSLATABLE_PARTNER_FIELDS = ['description'] as const;

export type TranslatablePartnerField = (typeof TRANSLATABLE_PARTNER_FIELDS)[number];

/**
 * Check if a field is translatable
 */
export function isTranslatablePartnerField(
  field: string
): field is TranslatablePartnerField {
  return TRANSLATABLE_PARTNER_FIELDS.includes(field as TranslatablePartnerField);
}
