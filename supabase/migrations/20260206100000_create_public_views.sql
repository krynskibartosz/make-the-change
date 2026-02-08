-- Migration: Create Public Views for Products, Producers, and Categories
-- Date: 2026-02-06
-- Description: Creates public views for frontend consumption with proper security

-- Drop existing views if they exist (for idempotency)
DROP VIEW IF EXISTS public.public_products CASCADE;
DROP VIEW IF EXISTS public.public_producers CASCADE;
DROP VIEW IF EXISTS public.public_categories CASCADE;

-- Public Categories View
CREATE VIEW public.public_categories AS
SELECT 
    id,
    slug,
    name_default,
    name_fr,
    name_en,
    description_default,
    description_fr,
    description_en,
    image_url,
    icon,
    sort_order,
    is_active,
    created_at,
    updated_at
FROM public.categories
WHERE is_active = true;

-- Public Producers View  
CREATE VIEW public.public_producers AS
SELECT 
    id,
    slug,
    name_default,
    name_fr,
    name_en,
    description_default,
    description_fr,
    description_en,
    address_city,
    address_country_code,
    location,
    contact_website,
    social_media,
    images,
    metadata,
    is_active,
    created_at,
    updated_at
FROM public.producers
WHERE is_active = true;

-- Public Products View
CREATE VIEW public.public_products AS
SELECT 
    p.id,
    p.slug,
    p.name_default,
    p.name_fr,
    p.name_en,
    p.short_description_default,
    p.short_description_fr,
    p.short_description_en,
    p.description_default,
    p.description_fr,
    p.description_en,
    p.price_points,
    p.origin_country,
    p.weight_grams,
    p.tags,
    p.certifications,
    p.allergens,
    p.stock_quantity,
    p.featured,
    p.is_active,
    p.fulfillment_method,
    p.metadata,
    p.category_id,
    p.producer_id,
    p.created_at,
    p.updated_at
FROM public.products p
WHERE p.is_active = true;

-- Set proper permissions for anonymous users
GRANT SELECT ON public.public_categories TO anon;
GRANT SELECT ON public.public_producers TO anon;
GRANT SELECT ON public.public_products TO anon;

-- Set proper permissions for authenticated users  
GRANT SELECT ON public.public_categories TO authenticated;
GRANT SELECT ON public.public_producers TO authenticated;
GRANT SELECT ON public.public_products TO authenticated;

-- Add helpful comments
COMMENT ON VIEW public.public_products IS 'Public view of active products for frontend consumption';
COMMENT ON VIEW public.public_producers IS 'Public view of active producers for frontend consumption';
COMMENT ON VIEW public.public_categories IS 'Public view of active categories for frontend consumption';
