import { z } from 'zod';

import {
  defaultUserValues as baseDefaultCreateValues,
  userFormSchema as baseUserCreateSchema,
} from '@/lib/validators/user';

const emptyStringToUndefined = (value: string | null | undefined) => {
  if (value === undefined || value === null) {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length === 0 ? undefined : trimmed;
};

/**
 * Zod schema for user form validation - mirrors partners structure
 * Updated to match partner form patterns for consistency
 */
export const userDetailFormSchema = z.object({
  // Essential Info
  first_name: z
    .string()
    .max(50, 'Le prénom ne peut pas dépasser 50 caractères')
    .optional()
    .or(z.literal('')),

  last_name: z
    .string()
    .max(50, 'Le nom ne peut pas dépasser 50 caractères')
    .optional()
    .or(z.literal('')),

  email: z
    .string()
    .min(1, "L'email est requis")
    .max(255, "L'email ne peut pas dépasser 255 caractères")
    .email("Format d'email invalide")
    .trim(),

  user_level: z
    .enum(['explorateur', 'protecteur', 'ambassadeur'])
    .default('explorateur'),

  // Status fields
  role: z.enum(['user', 'admin']).default('user'),
  is_active: z.boolean().default(true),

  // Contact Info
  phone: z
    .string()
    .max(50, 'Le numéro de téléphone ne peut pas dépasser 50 caractères')
    .optional()
    .or(z.literal('')),

  // KYC Info
  kyc_status: z
    .enum(['none', 'pending', 'verified', 'rejected'])
    .default('none'),

  kyc_level: z
    .number({ invalid_type_error: 'Le niveau KYC doit être un nombre' })
    .int('Le niveau KYC doit être un entier')
    .min(0, 'Le niveau KYC ne peut pas être négatif')
    .max(3, 'Le niveau KYC ne peut pas dépasser 3')
    .default(0),

  // Points
  points_balance: z
    .number({ invalid_type_error: 'Les points doivent être un nombre' })
    .int('Les points doivent être un entier')
    .min(0, 'Les points ne peuvent pas être négatifs')
    .default(0),

  // Metadata
  bio: z
    .string()
    .max(280, 'La bio ne peut pas dépasser 280 caractères')
    .optional()
    .or(z.literal('')),

  last_login_at: z.string().optional().or(z.literal('')),

  // Images (using same structure as partners)
  images: z
    .array(z.string().url("URL d'image invalide"))
    .max(2, 'Maximum 2 images par utilisateur (cover + avatar)')
    .default([]),
});

export type UserFormData = z.infer<typeof userDetailFormSchema>;

/**
 * Raw user data from database
 */
export interface RawUserData {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  email: string;
  user_level: 'explorateur' | 'protecteur' | 'ambassadeur';
  role: 'user' | 'admin';
  is_active: boolean;
  kyc_status: 'none' | 'pending' | 'verified' | 'rejected';
  kyc_level: number;
  phone?: string | null;
  points_balance: number;
  bio?: string | null;
  last_login_at?: string | null;
  images?: string[] | null;
  created_at?: string;
  updated_at?: string;
}

/**
 * Enriched user data (for consistency with partners structure)
 */
export interface EnrichedUserData extends RawUserData {
  // Future: add translations or additional fields if needed
}

export const defaultUserDetailValues: UserFormData = {
  first_name: '',
  last_name: '',
  email: '',
  user_level: 'explorateur',
  role: 'user',
  is_active: true,
  points_balance: 0,
  kyc_status: 'none',
  kyc_level: 0,
  phone: '',
  last_login_at: '',
  bio: '',
  images: [],
};

// NOTE: Commented out because baseUserCreateSchema is a ZodEffects, not a ZodObject
// If needed, create a new schema instead of extending
// export const userCreateFormSchemaRHF = baseUserCreateSchema.extend({
//   bio: z
//     .string()
//     .max(280, 'La bio ne peut pas dépasser 280 caractères')
//     .optional()
//     .or(z.literal('')),
//   images: z
//     .array(z.string().url("URL d'image invalide"))
//     .max(2, 'Maximum 2 images')
//     .default([]),
// });

// export type UserCreateFormData = z.infer<typeof userCreateFormSchemaRHF>;

// export const defaultUserCreateValues: UserCreateFormData = {
//   ...baseDefaultCreateValues,
//   bio: '',
//   images: [],
// };

/**
 * Convert raw user data to form data
 * Handles null values from database
 */
export function normalizeUserFormValues(
  user: RawUserData | EnrichedUserData | null
): UserFormData {
  if (!user) {
    return defaultUserDetailValues;
  }

  return {
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    email: user.email || '',
    user_level: user.user_level || 'explorateur',
    role: user.role || 'user',
    is_active: user.is_active ?? true,
    kyc_status: user.kyc_status || 'none',
    kyc_level: user.kyc_level || 0,
    phone: user.phone || '',
    points_balance: user.points_balance || 0,
    bio: user.bio || '',
    last_login_at: user.last_login_at || '',
    images: user.images || [],
  };
}

/**
 * API User Update Payload - matching API schema
 * Based on packages/api/src/routers/admin/users.ts (updated to support all fields)
 */
export interface UserUpdatePayload {
  // Users table fields
  email?: string;
  user_level?: 'explorateur' | 'protecteur' | 'ambassadeur';
  points_balance?: number;
  kyc_level?: number;
  kyc_status?: 'none' | 'pending' | 'verified' | 'rejected';
  phone?: string | null;
  role?: 'user' | 'admin';
  is_active?: boolean;
  last_login_at?: string | null;

  // User_profiles table fields
  first_name?: string | null;
  last_name?: string | null;
  bio?: string | null;

  // Images array (will be split into avatar_url and cover_url by API)
  images?: string[];
}

/**
 * Convert form data to database update payload
 * Mirrors partner form to update payload pattern
 * Now sends ALL fields to the updated API
 */
export function userFormToUpdatePayload(
  formData: UserFormData
): UserUpdatePayload {
  const patch: UserUpdatePayload = {
    // Required fields - always include
    email: formData.email,
    user_level: formData.user_level,
    role: formData.role,
    is_active: formData.is_active,
    kyc_status: formData.kyc_status,
    kyc_level: formData.kyc_level,
    points_balance: formData.points_balance,
  };

  // Optional fields - send value or null (allows clearing fields)
  const firstName = formData.first_name?.trim();
  if (firstName !== undefined && firstName !== '') {
    patch.first_name = firstName;
  } else if (firstName === '') {
    patch.first_name = null;
  }

  const lastName = formData.last_name?.trim();
  if (lastName !== undefined && lastName !== '') {
    patch.last_name = lastName;
  } else if (lastName === '') {
    patch.last_name = null;
  }

  const phone = formData.phone?.trim();
  if (phone !== undefined && phone !== '') {
    patch.phone = phone;
  } else if (phone === '') {
    patch.phone = null;
  }

  const bio = formData.bio?.trim();
  if (bio !== undefined && bio !== '') {
    patch.bio = bio;
  } else if (bio === '') {
    patch.bio = null;
  }

  if (formData.images && formData.images.length > 0) {
    patch.images = formData.images;
  }

  // last_login_at is read-only, we don't send it back

  return patch;
}

/**
 * Legacy function for backwards compatibility
 */
export const buildUserPatch = (values: UserFormData) => {
  return userFormToUpdatePayload(values);
};
