import { z } from 'zod';

// Schema for content levels (gamification) defined locally to avoid import issues
const contentLevelSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  unlocked_at_level: z.number().optional(),
});

const contentLevelsSchema = z.object({
  beginner: contentLevelSchema.optional(),
  intermediate: contentLevelSchema.optional(),
  advanced: contentLevelSchema.optional(),
}).optional();

/**
 * Schema for Species Form (Admin)
 * Adapts the DB schema for the admin UI form
 */
export const speciesAdminFormSchema = z.object({
  scientific_name: z.string().max(200).optional().or(z.literal('')),
  
  // I18n Fields
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
  habitat_i18n: z.object({
    fr: z.string().optional(),
    en: z.string().optional(),
    nl: z.string().optional(),
  }).optional(),

  // Content Levels (Gamification)
  content_levels: contentLevelsSchema.optional(),

  // Classification
  conservation_status: z.enum([
    'least_concern',
    'near_threatened',
    'vulnerable',
    'endangered',
    'critically_endangered',
    'extinct_in_the_wild',
    'extinct',
  ]).optional(),
  
  is_featured: z.boolean().default(false),
  is_endemic: z.boolean().default(false),
});

export type SpeciesAdminFormData = z.infer<typeof speciesAdminFormSchema>;
