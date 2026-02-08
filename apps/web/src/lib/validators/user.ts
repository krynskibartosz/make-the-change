import { z } from 'zod'

const passwordSchema = z
  .string()
  .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
  .max(128, 'Le mot de passe ne peut pas dépasser 128 caractères')
  .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
  .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
  .regex(/\d/, 'Le mot de passe doit contenir au moins un chiffre')
  .regex(/[^\dA-Za-z]/, 'Le mot de passe doit contenir au moins un caractère spécial')

export const userFormSchema = z
  .object({
    email: z
      .string()
      .min(1, "L'email est requis")
      .email("Format d'email invalide")
      .max(100, "L'email ne peut pas dépasser 100 caractères")
      .toLowerCase()
      .trim(),

    password: passwordSchema,

    confirmPassword: z.string().min(1, 'Confirmation du mot de passe requise'),

    first_name: z
      .string()
      .max(50, 'Le prénom ne peut pas dépasser 50 caractères')
      .transform((val) => val?.trim())
      .optional(),

    last_name: z
      .string()
      .max(50, 'Le nom ne peut pas dépasser 50 caractères')
      .transform((val) => val?.trim())
      .optional(),

    user_level: z
      .enum(['explorateur', 'protecteur', 'ambassadeur'], {
        errorMap: () => ({ message: 'Niveau utilisateur invalide' }),
      })
      .default('explorateur'),

    kyc_status: z
      .enum(['pending', 'light', 'complete', 'rejected'], {
        errorMap: () => ({ message: 'Statut KYC invalide' }),
      })
      .default('pending'),

    address_country_code: z
      .string()
      .length(2, 'Le code pays doit contenir 2 caractères')
      .default('FR'),
  })
  .refine(
    (data) => {
      return data.password === data.confirmPassword
    },
    {
      message: 'Les mots de passe ne correspondent pas',
      path: ['confirmPassword'],
    },
  )
  .refine(
    (data) => {
      if (data.user_level === 'ambassadeur' && data.kyc_status !== 'complete') {
        return false
      }
      return true
    },
    {
      message: 'Les ambassadeurs doivent avoir un statut KYC complet',
      path: ['kyc_status'],
    },
  )

export const userEditFormSchema = z.object({
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Format d'email invalide")
    .max(100, "L'email ne peut pas dépasser 100 caractères")
    .toLowerCase()
    .trim(),

  first_name: z
    .string()
    .max(50, 'Le prénom ne peut pas dépasser 50 caractères')
    .transform((val) => val?.trim())
    .optional(),

  last_name: z
    .string()
    .max(50, 'Le nom ne peut pas dépasser 50 caractères')
    .transform((val) => val?.trim())
    .optional(),

  user_level: z
    .enum(['explorateur', 'protecteur', 'ambassadeur'], {
      errorMap: () => ({ message: 'Niveau utilisateur invalide' }),
    })
    .default('explorateur'),

  kyc_status: z
    .enum(['pending', 'light', 'complete', 'rejected'], {
      errorMap: () => ({ message: 'Statut KYC invalide' }),
    })
    .default('pending'),

  address_country_code: z.string().length(2, 'Le code pays doit contenir 2 caractères').optional(),
})

export const userAsyncSchema = z.object({
  email: z.string().refine(async (email) => {
    if (!email) return true
    return !email.includes('admin@')
  }, 'Cet email est déjà utilisé'),
})

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, 'Mot de passe actuel requis'),
    newPassword: passwordSchema,
    confirmNewPassword: z.string().min(1, 'Confirmation requise'),
  })
  .refine(
    (data) => {
      return data.newPassword === data.confirmNewPassword
    },
    {
      message: 'Les nouveaux mots de passe ne correspondent pas',
      path: ['confirmNewPassword'],
    },
  )
  .refine(
    (data) => {
      return data.currentPassword !== data.newPassword
    },
    {
      message: "Le nouveau mot de passe doit être différent de l'ancien",
      path: ['newPassword'],
    },
  )

export type UserFormData = z.infer<typeof userFormSchema>
export type UserEditFormData = z.infer<typeof userEditFormSchema>
export type PasswordChangeData = z.infer<typeof passwordChangeSchema>

export const defaultUserValues: UserFormData = {
  email: '',
  password: '',
  confirmPassword: '',
  first_name: '',
  last_name: '',
  user_level: 'explorateur',
  kyc_status: 'pending',
  address_country_code: 'FR',
}

export const userLevelLabels = {
  explorateur: 'Explorateur',
  protecteur: 'Protecteur',
  ambassadeur: 'Ambassadeur',
} as const

export const kycStatusLabels = {
  pending: 'En attente',
  light: 'KYC léger',
  complete: 'KYC complet',
  rejected: 'Rejeté',
} as const

export const countryOptions = ['FR', 'BE', 'CH', 'LU', 'CA', 'MG'] as const

export const userLevelRules = {
  explorateur: {
    maxPoints: 100,
    features: ['browse_projects', 'basic_shop'],
    description: 'Accès de base à la plateforme',
  },
  protecteur: {
    maxPoints: 1000,
    features: ['invest_projects', 'premium_products', 'basic_analytics'],
    description: 'Investissements et produits premium',
  },
  ambassadeur: {
    maxPoints: 10_000,
    features: ['all_features', 'priority_support', 'advanced_analytics'],
    description: 'Accès complet avec support prioritaire',
  },
} as const

export function getValidationRulesForLevel(level: keyof typeof userLevelRules) {
  return userLevelRules[level]
}
