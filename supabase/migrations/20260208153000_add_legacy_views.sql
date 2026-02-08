-- View: public_products
-- Purpose: Expose product data to the frontend (apps/web-client) with specific fields needed for the new features (variants, seo, etc.)
CREATE OR REPLACE VIEW public.public_products AS
 SELECT pr.id,
    pr.slug,
    pr.name_default,
    pr.short_description_default,
    pr.description_default,
    pr.price_points,
    pr.price_eur_equivalent,
    pr.origin_country,
    pr.tags,
    pr.certifications,
    pr.allergens,
    pr.stock_quantity,
    pr.featured,
    pr.is_active,
    pr.created_at,
    pr.category_id,
    pr.producer_id,
    pr.fulfillment_method,
    pr.metadata,
    pr.variants,
    pr.weight_grams,
    pr.seo_keywords,
    pr.images
   FROM commerce.products pr
  WHERE (pr.deleted_at IS NULL) AND (pr.is_active IS TRUE);

-- View: public_producers
-- Purpose: Expose producer data including capacity info for the new "Producers" page
CREATE OR REPLACE VIEW public.public_producers AS
 SELECT p.id,
    p.slug,
    p.name_default,
    p.description_default,
    p.story_default,
    p.type,
    p.address_city,
    p.address_country_code,
    p.location,
    p.contact_website,
    p.social_media,
    p.certifications,
    p.specialties,
    p.images,
    p.metadata,
    p.capacity_info
   FROM investment.producers p
  WHERE (p.deleted_at IS NULL) AND (p.status = 'active'::investment.producer_status_enum);
