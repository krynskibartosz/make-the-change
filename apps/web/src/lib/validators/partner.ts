import { z } from 'zod'

export const partnerStatusLabels = {
  active: 'Actif',
  inactive: 'Inactif',
  pending: 'En attente',
  suspended: 'Suspendu',
  archived: 'Archivé',
}

export const partnerFormSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  slug: z
    .string()
    .min(1, 'Le slug est requis')
    .regex(
      /^[\da-z-]+$/,
      'Le slug ne peut contenir que des lettres minuscules, chiffres et tirets',
    ),
  description: z.string().optional(),
  contact_website: z.string().url('URL invalide').optional().or(z.literal('')),
  contact_email: z.string().email('Email invalide').optional().or(z.literal('')),
  status: z.enum(['pending', 'active', 'inactive', 'suspended', 'archived']).default('pending'),
  // Add other fields as needed based on usage
})

export type PartnerFormData = z.infer<typeof partnerFormSchema>

export const defaultPartnerValues: PartnerFormData = {
  name: '',
  slug: '',
  description: '',
  contact_website: '',
  contact_email: '',
  status: 'pending',
}
