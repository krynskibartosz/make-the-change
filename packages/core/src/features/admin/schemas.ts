import { z } from 'zod'
import {
  projectTypeEnum,
  projectStatusEnum,
  subscriptionPlanEnum,
  subscriptionStatusEnum,
  billingFrequencyEnum,
  userLevelEnum,
  kycStatusEnum,
} from '../../shared/db/schema'

export const adminProjectSchema = z.object({
  name: z.string().min(3, 'Le nom du projet est requis et doit faire au moins 3 caractères.'),
  slug: z.string().min(3, 'Le slug est requis.'),
  type: z.enum(projectTypeEnum.enumValues, {
    errorMap: () => ({ message: 'Le type de projet est invalide.' }),
  }),
  target_budget: z.coerce.number().positive('Le budget cible doit être un nombre positif.'),
  producer_id: z.string().uuid('Un producteur valide est requis.'),
  description: z.string().optional(),
  long_description: z.string().optional(),
  status: z.enum(projectStatusEnum.enumValues).default('draft'),
  featured: z.coerce.boolean().default(false),
})

export type AdminProjectInput = z.infer<typeof adminProjectSchema>

export const adminSubscriptionSchema = z.object({
  user_id: z.string().uuid('Un utilisateur valide est requis.'),
  stripe_customer_id: z.string().min(1, 'Stripe customer requis.'),
  plan_type: z.enum(subscriptionPlanEnum.enumValues, {
    errorMap: () => ({ message: "Le type d'abonnement est invalide." }),
  }),
  billing_frequency: z.enum(billingFrequencyEnum.enumValues).default('monthly'),
  monthly_points_allocation: z.coerce
    .number()
    .int()
    .positive('Les points mensuels doivent être positifs.'),
  monthly_price: z.coerce.number().nonnegative().optional(),
  annual_price: z.coerce.number().nonnegative().optional(),
  bonus_percentage: z.coerce.number().min(0).max(100).default(0),
  status: z.enum(subscriptionStatusEnum.enumValues).default('active'),
})

export type AdminSubscriptionInput = z.infer<typeof adminSubscriptionSchema>

const passwordSchema = z
  .string()
  .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
  .max(128, 'Le mot de passe ne peut pas dépasser 128 caractères')
  .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
  .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
  .regex(/\d/, 'Le mot de passe doit contenir au moins un chiffre')
  .regex(/[^\dA-Za-z]/, 'Le mot de passe doit contenir au moins un caractère spécial')

export const adminUserSchema = z
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
      .enum(userLevelEnum.enumValues, {
        errorMap: () => ({ message: 'Niveau utilisateur invalide' }),
      })
      .default('explorateur'),

    kyc_status: z
      .enum(kycStatusEnum.enumValues, {
        errorMap: () => ({ message: 'Statut KYC invalide' }),
      })
      .default('pending'),

    address_country_code: z
      .string()
      .length(2, 'Le code pays doit contenir 2 caractères')
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  })
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

export type AdminUserInput = z.infer<typeof adminUserSchema>
