ALTER TABLE "commerce"."products" ADD COLUMN IF NOT EXISTS "images" text[] DEFAULT '{}'::text[];
