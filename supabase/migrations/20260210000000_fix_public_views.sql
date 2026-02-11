-- Migration: Fix and Create Public Views
-- Date: 2026-02-10
-- Description: Recreates public views pointing to the correct schemas (investment/commerce)

-- Drop existing views if they exist
DROP VIEW IF EXISTS public.public_featured_projects CASCADE;
DROP VIEW IF EXISTS public.public_projects CASCADE;
DROP VIEW IF EXISTS public.public_products CASCADE;
DROP VIEW IF EXISTS public.public_producers CASCADE;
DROP VIEW IF EXISTS public.public_categories CASCADE;

-- Public Categories View (from commerce.categories)
CREATE VIEW public.public_categories AS
SELECT 
    id,
    slug,
    name_default,
    description_default,
    NULL as image_url, -- Not in schema currently? Or in metadata?
    NULL as icon, -- Not in schema currently?
    sort_order,
    is_active,
    created_at,
    updated_at
FROM commerce.categories
WHERE is_active = true;

-- Public Producers View (from investment.producers)
CREATE VIEW public.public_producers AS
SELECT 
    id,
    slug,
    name_default,
    description_default,
    address_city,
    address_country_code,
    location,
    contact_website,
    social_media,
    images,
    metadata,
    status,
    created_at,
    updated_at
FROM investment.producers
WHERE status = 'active';

-- Public Products View (from commerce.products)
CREATE VIEW public.public_products AS
SELECT 
    p.id,
    p.slug,
    p.name_default,
    p.short_description_default,
    p.description_default,
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
FROM commerce.products p
WHERE p.is_active = true;

-- Public Projects View (from investment.projects)
CREATE VIEW public.public_projects AS
SELECT
    p.id,
    p.slug,
    p.name_default,
    p.description_default,
    p.long_description_default,
    p.target_budget,
    p.current_funding,
    p.funding_progress,
    p.address_city,
    p.address_country_code,
    p.featured,
    p.launch_date,
    p.maturity_date,
    p.hero_image_url,
    p.type,
    p.status,
    p.created_at,
    p.producer_id,
    p.seo_title,
    p.seo_description
FROM investment.projects p
WHERE p.status IN ('active', 'funded', 'completed');

-- Public Featured Projects View
CREATE VIEW public.public_featured_projects AS
SELECT *
FROM public.public_projects
WHERE featured = true;

-- Set permissions for anonymous users
GRANT SELECT ON public.public_categories TO anon;
GRANT SELECT ON public.public_producers TO anon;
GRANT SELECT ON public.public_products TO anon;
GRANT SELECT ON public.public_projects TO anon;
GRANT SELECT ON public.public_featured_projects TO anon;

-- Set permissions for authenticated users  
GRANT SELECT ON public.public_categories TO authenticated;
GRANT SELECT ON public.public_producers TO authenticated;
GRANT SELECT ON public.public_products TO authenticated;
GRANT SELECT ON public.public_projects TO authenticated;
GRANT SELECT ON public.public_featured_projects TO authenticated;

-- Comments
COMMENT ON VIEW public.public_projects IS 'Public view of active projects for frontend consumption';
COMMENT ON VIEW public.public_featured_projects IS 'Public view of featured projects for frontend consumption';
COMMENT ON VIEW public.public_products IS 'Public view of active products for frontend consumption';
COMMENT ON VIEW public.public_producers IS 'Public view of active producers for frontend consumption';
COMMENT ON VIEW public.public_categories IS 'Public view of active categories for frontend consumption';
