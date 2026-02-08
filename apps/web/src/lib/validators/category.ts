import { z } from 'zod';

/**
 * Schema for Category Form
 */
export const categoryFormSchema = z.object({
  name_i18n: z.object({
    fr: z.string().min(1, 'Le nom en français est requis'),
    en: z.string().min(1, 'Le nom en anglais est requis'),
    nl: z.string().optional(),
  }),
  description_i18n: z.object({
    fr: z.string().optional(),
    en: z.string().optional(),
    nl: z.string().optional(),
  }).optional(),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, "Le slug ne doit contenir que des lettres minuscules, des chiffres et des tirets"),
  parent_id: z.string().uuid().optional().nullable(),
  sort_order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
  seo_title: z.string().max(70).optional().or(z.literal('')),
  seo_description: z.string().min(50).max(160).optional().or(z.literal('')),
  metadata: z.record(z.any()).default({}),
});

export type CategoryFormData = z.infer<typeof categoryFormSchema>;
