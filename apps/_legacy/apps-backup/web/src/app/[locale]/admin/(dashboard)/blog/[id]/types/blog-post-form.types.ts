import { z } from 'zod';

/**
 * Zod schema for blog post form validation
 * Mirrors the blog_posts table structure with validation rules
 */
export const blogPostFormSchema = z.object({
  // Essential Info
  title: z
    .string()
    .min(1, 'Le titre est requis')
    .max(500, 'Le titre ne peut pas dépasser 500 caractères')
    .trim(),

  slug: z
    .string()
    .min(1, 'Le slug est requis')
    .max(200, 'Le slug ne peut pas dépasser 200 caractères')
    .regex(
      /^[a-z0-9-]+$/,
      'Le slug ne peut contenir que des lettres minuscules, chiffres et tirets'
    )
    .trim(),

  excerpt: z
    .string()
    .max(1000, 'L\'extrait ne peut pas dépasser 1000 caractères')
    .optional()
    .or(z.literal('')),

  content: z.any().optional(), // JSONB content from editor

  // Media
  cover_image_url: z
    .string()
    .url("URL d'image invalide")
    .max(500, "L'URL ne peut pas dépasser 500 caractères")
    .optional()
    .or(z.literal('')),

  // Relations
  author_id: z.string().uuid().optional().nullable(),
  category_id: z.string().uuid().optional().nullable(),
  project_id: z.string().uuid().optional().nullable(),
  producer_id: z.string().uuid().optional().nullable(),

  // Status & Publication
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  published_at: z.string().datetime().optional().nullable(),

  // SEO Metadata (JSONB)
  seo_title: z
    .string()
    .max(200, 'Le titre SEO ne peut pas dépasser 200 caractères')
    .optional()
    .or(z.literal('')),

  seo_description: z
    .string()
    .max(500, 'La description SEO ne peut pas dépasser 500 caractères')
    .optional()
    .or(z.literal('')),

  seo_keywords: z
    .string()
    .max(500, 'Les mots-clés SEO ne peuvent pas dépasser 500 caractères')
    .optional()
    .or(z.literal('')),
});

/**
 * TypeScript type inferred from Zod schema
 */
export type BlogPostFormData = z.infer<typeof blogPostFormSchema>;

/**
 * Raw blog post data from database
 */
export interface RawBlogPostData {
  id: string;
  title: string;
  slug: string;
  content?: any | null; // JSONB
  excerpt?: string | null;
  cover_image_url?: string | null;
  author_id?: string | null;
  category_id?: string | null;
  project_id?: string | null;
  producer_id?: string | null;
  status: 'draft' | 'published' | 'archived';
  published_at?: string | null;
  seo_metadata?: any | null; // JSONB
  view_count: number;
  created_at: string;
  updated_at: string;
  author?: {
    id: string;
    name: string;
    avatar_url?: string | null;
  } | null;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  project?: {
    id: string;
    name: string;
  } | null;
  producer?: {
    id: string;
    name: string;
  } | null;
}

/**
 * Default values for new blog post form
 */
export const DEFAULT_BLOG_POST_FORM_VALUES: BlogPostFormData = {
  title: '',
  slug: '',
  excerpt: '',
  content: null,
  cover_image_url: '',
  author_id: null,
  category_id: null,
  project_id: null,
  producer_id: null,
  status: 'draft',
  published_at: null,
  seo_title: '',
  seo_description: '',
  seo_keywords: '',
};

/**
 * Convert raw blog post data to form data
 * Handles null values from database and extracts SEO metadata from JSONB
 */
export function normalizeBlogPostFormValues(
  post: RawBlogPostData | null
): BlogPostFormData {
  if (!post) {
    return DEFAULT_BLOG_POST_FORM_VALUES;
  }

  const seoMetadata = post.seo_metadata || {};

  return {
    title: post.title || '',
    slug: post.slug || '',
    excerpt: post.excerpt || '',
    content: post.content || null,
    cover_image_url: post.cover_image_url || '',
    author_id: post.author_id || null,
    category_id: post.category_id || null,
    project_id: post.project_id || null,
    producer_id: post.producer_id || null,
    status: post.status || 'draft',
    published_at: post.published_at || null,
    seo_title: seoMetadata.title || '',
    seo_description: seoMetadata.description || '',
    seo_keywords: seoMetadata.keywords || '',
  };
}

/**
 * Convert form data to database update payload
 * - Required fields are always included
 * - Optional fields with values are included
 * - Empty strings are converted to null (allows clearing fields)
 * - SEO fields are bundled into seo_metadata JSONB
 */
export function blogPostFormToUpdatePayload(
  formData: BlogPostFormData
): Partial<RawBlogPostData> {
  const payload: any = {
    // Required fields - always include
    title: formData.title,
    slug: formData.slug,
    status: formData.status,
  };

  // Content (JSONB)
  if (formData.content !== undefined) {
    payload.content = formData.content || null;
  }

  // Optional text fields - send value or null
  const excerpt = formData.excerpt?.trim();
  if (excerpt !== undefined && excerpt !== '') {
    payload.excerpt = excerpt;
  } else if (excerpt === '') {
    payload.excerpt = null;
  }

  const coverImageUrl = formData.cover_image_url?.trim();
  if (coverImageUrl !== undefined && coverImageUrl !== '') {
    payload.cover_image_url = coverImageUrl;
  } else if (coverImageUrl === '') {
    payload.cover_image_url = null;
  }

  // Relations - can be null
  if (formData.author_id !== undefined) {
    payload.author_id = formData.author_id || null;
  }

  if (formData.category_id !== undefined) {
    payload.category_id = formData.category_id || null;
  }

  if (formData.project_id !== undefined) {
    payload.project_id = formData.project_id || null;
  }

  if (formData.producer_id !== undefined) {
    payload.producer_id = formData.producer_id || null;
  }

  // Publication date
  if (formData.published_at !== undefined) {
    payload.published_at = formData.published_at || null;
  }

  // SEO Metadata - bundle into JSONB
  const seoMetadata: any = {};
  let hasSeoData = false;

  const seoTitle = formData.seo_title?.trim();
  if (seoTitle) {
    seoMetadata.title = seoTitle;
    hasSeoData = true;
  }

  const seoDescription = formData.seo_description?.trim();
  if (seoDescription) {
    seoMetadata.description = seoDescription;
    hasSeoData = true;
  }

  const seoKeywords = formData.seo_keywords?.trim();
  if (seoKeywords) {
    seoMetadata.keywords = seoKeywords;
    hasSeoData = true;
  }

  payload.seo_metadata = hasSeoData ? seoMetadata : null;

  return payload;
}
