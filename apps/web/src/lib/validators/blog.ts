import { z } from 'zod';

export const blogPostFormSchema = z.object({
  title: z.string().min(1, 'Le titre est requis').max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/, "Le slug ne doit contenir que des lettres minuscules, des chiffres et des tirets"),
  excerpt: z.string().max(500).optional().or(z.literal('')),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  
  // Content (TipTap JSON) - We'll handle it as any in form and validate structure on submit if possible
  // or provide a helper to convert text to TipTap
  content: z.any().optional(), 
  
  cover_image_url: z.string().url().optional().or(z.literal('')),
  
  author_id: z.string().uuid().optional().nullable(),
  category_id: z.string().uuid().optional().nullable(),
  project_id: z.string().uuid().optional().nullable(),
  
  seo_title: z.string().max(70).optional().or(z.literal('')),
  seo_description: z.string().max(160).optional().or(z.literal('')),
  seo_keywords: z.string().optional(),
});

export type BlogPostFormData = z.infer<typeof blogPostFormSchema>;
