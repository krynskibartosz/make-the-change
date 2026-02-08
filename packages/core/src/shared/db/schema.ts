import {
  bigint,
  boolean,
  customType,
  date,
  integer,
  jsonb,
  numeric,
  pgSchema,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'

// Custom Types
const ltree = customType<{ data: string }>({
  dataType() {
    return 'ltree'
  },
})

const tsvector = customType<{ data: string }>({
  dataType() {
    return 'tsvector'
  },
})

const point = customType<{ data: string }>({
  dataType() {
    return 'point'
  },
})

export const commerce = pgSchema('commerce')
export const investment = pgSchema('investment')
export const content = pgSchema('content')
export const identity = pgSchema('identity')

// Enums (schema-scoped)
export const fulfillmentMethodEnum = commerce.enum('fulfillment_method', [
  'ship',
  'pickup',
  'digital',
  'experience',
])
export const productPartnerSourceEnum = commerce.enum('product_partner_source', [
  'direct',
  'cooperative',
  'partner',
  'marketplace',
])
export const allergenEnum = commerce.enum('allergen_enum', [
  'gluten',
  'lactose',
  'nuts',
  'peanuts',
  'eggs',
  'fish',
  'shellfish',
  'soy',
  'sesame',
  'sulfites',
  'celery',
  'mustard',
  'lupin',
])
export const certificationEnum = commerce.enum('certification_enum', [
  'bio',
  'organic',
  'fair_trade',
  'vegan',
  'vegetarian',
  'halal',
  'kosher',
  'gluten_free',
  'non_gmo',
  'rainforest_alliance',
  'msc',
  'fsc',
  'ecocert',
  'demeter',
])
export const orderStatusEnum = commerce.enum('order_status_enum', [
  'pending',
  'paid',
  'processing',
  'in_transit',
  'completed',
  'closed',
])
export const paymentMethodEnum = commerce.enum('payment_method_enum', [
  'points',
  'stripe_card',
  'stripe_sepa',
  'stripe_bank_transfer',
  'mixed',
])
export const subscriptionPlanEnum = commerce.enum('subscription_plan_enum_v2', [
  'monthly_standard',
  'monthly_premium',
  'annual_standard',
  'annual_premium',
])
export const subscriptionStatusEnum = commerce.enum('subscription_status_type', [
  'active',
  'inactive',
  'cancelled',
  'past_due',
  'unpaid',
  'trialing',
  'expired',
  'incomplete',
  'paused',
])
export const billingFrequencyEnum = commerce.enum('billing_frequency', ['monthly', 'annual'])

export const userLevelEnum = identity.enum('user_level_enum', [
  'explorateur',
  'protecteur',
  'ambassadeur',
])
export const kycStatusEnum = identity.enum('kyc_status_enum', [
  'pending',
  'light',
  'complete',
  'rejected',
])
export const userRoleEnum = identity.enum('user_role_enum', [
  'user',
  'admin',
  'superadmin',
  'producer',
  'moderator',
])
export const producerStatusEnum = investment.enum('producer_status_enum', [
  'pending',
  'active',
  'inactive',
  'suspended',
  'archived',
])
export const producerTypeEnum = investment.enum('producer_type_enum', [
  'farmer',
  'cooperative',
  'association',
  'company',
  'individual',
])
export const producerPartnershipEnum = investment.enum('producer_partnership_enum', [
  'exclusive',
  'preferred',
  'standard',
  'trial',
])
export const conservationStatusEnum = investment.enum('conservation_status_enum', [
  'LC',
  'NT',
  'VU',
  'EN',
  'CR',
  'EW',
  'EX',
])
export const investmentStatusEnum = investment.enum('investment_status_enum', [
  'pending',
  'approved',
  'active',
  'completed',
  'cancelled',
  'defaulted',
])
export const projectStatusEnum = investment.enum('project_status_enum', [
  'draft',
  'active',
  'funded',
  'completed',
  'archived',
])
export const projectTypeEnum = investment.enum('project_type', [
  'beehive',
  'olive_tree',
  'vineyard',
])
export const updateTypeEnum = investment.enum('update_type_enum', [
  'production',
  'maintenance',
  'harvest',
  'impact',
  'news',
  'milestone',
])

export const userRoles = identity.table('user_roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').notNull(),
  role: userRoleEnum('role').notNull(),
  granted_at: timestamp('granted_at', { withTimezone: true }).defaultNow().notNull(),
  granted_by: uuid('granted_by'),
  revoked_at: timestamp('revoked_at', { withTimezone: true }),
  metadata: jsonb('metadata').default({}).notNull(),
  deleted_at: timestamp('deleted_at', { withTimezone: true }),
})

// Investment Schema
export const producers = investment.table('producers', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull(),
  type: producerTypeEnum('type').notNull().default('farmer'),
  location: text('location'),
  social_media: jsonb('social_media').default({}),
  certifications: text('certifications').array(),
  specialties: text('specialties').array(),
  capacity_info: jsonb('capacity_info').default({}),
  partnership_start: date('partnership_start'),
  partnership_type: producerPartnershipEnum('partnership_type').notNull().default('standard'),
  commission_rate: numeric('commission_rate'),
  payment_terms: integer('payment_terms').notNull().default(30),
  status: producerStatusEnum('status').notNull().default('pending'),
  images: text('images').array(),
  documents: text('documents').array(),
  notes: text('notes'),
  metadata: jsonb('metadata').default({}),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  deleted_at: timestamp('deleted_at', { withTimezone: true }),
  name_i18n: jsonb('name_i18n').default({ en: '', fr: '' }),
  description_i18n: jsonb('description_i18n').default({ en: '' }),
  story_i18n: jsonb('story_i18n').default({ en: '' }),
  name_default: text('name_default').notNull(),
  description_default: text('description_default'),

  // Address fields
  address_street: text('address_street'),
  address_city: text('address_city'),
  address_postal_code: text('address_postal_code'),
  address_country_code: text('address_country_code'),
  address_region: text('address_region'),
  address_coordinates: point('address_coordinates'),
  contact_email: text('contact_email'),
  contact_phone: text('contact_phone'),
  contact_website: text('contact_website'),
  contact_person_name: text('contact_person_name'),
  owner_user_id: uuid('owner_user_id'),
  created_by: uuid('created_by'),
  updated_by: uuid('updated_by'),
  story_default: text('story_default'),
})

export const species = investment.table('species', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name'),
  scientific_name: text('scientific_name'),
  description: text('description'),
  iucn_status: conservationStatusEnum('iucn_status'),
  habitat: text('habitat'),
  image_url: text('image_url'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at'),
  created_by: uuid('created_by'),
  updated_by: uuid('updated_by'),
})

export const projectUpdates = investment.table('project_updates', {
  id: uuid('id').primaryKey().defaultRandom(),
  project_id: uuid('project_id'),
  title: text('title'),
  content: text('content'),
  type: updateTypeEnum('type'),
  metrics: jsonb('metrics').default({}),
  images: text('images').array(),
  published_at: timestamp('published_at'),
  created_at: timestamp('created_at').defaultNow(),
  created_by: uuid('created_by'),
  updated_by: uuid('updated_by'),
})

export const projects = investment.table('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  type: projectTypeEnum('type').notNull(),
  slug: text('slug').notNull(),
  location: text('location'),
  producer_id: uuid('producer_id').notNull(),
  target_budget: bigint('target_budget', { mode: 'number' }).notNull(),
  current_funding: bigint('current_funding', { mode: 'number' }).notNull().default(0),
  launch_date: date('launch_date'),
  maturity_date: date('maturity_date'),
  certification_labels: text('certification_labels').array(),
  impact_metrics: jsonb('impact_metrics').default({}),
  metadata: jsonb('metadata').default({}),
  seo_title: text('seo_title'),
  seo_description: text('seo_description'),
  featured: boolean('featured').notNull().default(false),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  species_id: uuid('species_id'),
  deleted_at: timestamp('deleted_at', { withTimezone: true }),
  name_i18n: jsonb('name_i18n').default({ en: '', fr: '' }),
  description_i18n: jsonb('description_i18n').default({ en: '' }),
  long_description_i18n: jsonb('long_description_i18n').default({ en: '' }),
  seo_title_i18n: jsonb('seo_title_i18n').default({ en: '' }),
  seo_description_i18n: jsonb('seo_description_i18n').default({ en: '' }),
  status: projectStatusEnum('status').notNull().default('draft'),
  name_default: text('name_default').notNull(),
  description_default: text('description_default'),
  funding_progress: numeric('funding_progress'),

  // Address fields
  address_street: text('address_street'),
  address_city: text('address_city'),
  address_postal_code: text('address_postal_code'),
  address_country_code: text('address_country_code'),
  address_region: text('address_region'),
  address_coordinates: point('address_coordinates'),
  created_by: uuid('created_by'),
  updated_by: uuid('updated_by'),
  hero_image_url: text('hero_image_url'),
  avatar_image_url: text('avatar_image_url'),
  gallery_image_urls: text('gallery_image_urls').array(),
  long_description_default: text('long_description_default'),
})

export const investments = investment.table('investments', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id'),
  project_id: uuid('project_id'),
  amount_points: bigint('amount_points', { mode: 'number' }),
  amount_eur_equivalent: numeric('amount_eur_equivalent'),
  status: investmentStatusEnum('status'),
  expected_return_rate: numeric('expected_return_rate'),
  maturity_date: date('maturity_date'),
  returns_received_points: bigint('returns_received_points', { mode: 'number' }),
  last_return_date: timestamp('last_return_date', { withTimezone: true }),
  investment_terms: jsonb('investment_terms'),
  notes: text('notes'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }),
  deleted_at: timestamp('deleted_at', { withTimezone: true }),
  created_by: uuid('created_by'),
  updated_by: uuid('updated_by'),
})

// Commerce Schema
export const categories = commerce.table('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug'),
  parent_id: uuid('parent_id'),
  sort_order: integer('sort_order'),
  is_active: boolean('is_active'),
  seo_title: text('seo_title'),
  seo_description: text('seo_description'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  metadata: jsonb('metadata'),
  path_ltree: ltree('path_ltree'),
  depth: integer('depth'),
  root_id: uuid('root_id'),
  name_i18n: jsonb('name_i18n'),
  description_i18n: jsonb('description_i18n'),
  name_default: text('name_default'),
  description_default: text('description_default'),
  deleted_at: timestamp('deleted_at'),
  created_by: uuid('created_by'),
  updated_by: uuid('updated_by'),
})

// Content Schema
export const blogAuthors = content.table('blog_authors', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name'),
  role: text('role'),
  bio: text('bio'),
  avatar_url: text('avatar_url'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  updated_by: uuid('updated_by'),
})

export const blogPosts = content.table('blog_posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull(),
  title: text('title').notNull(),
  excerpt: text('excerpt'),
  content: text('content'),
  cover_image: text('cover_image'),
  author_id: uuid('author_id'),
  published_at: timestamp('published_at'),
  status: text('status').default('draft'),
  tags: text('tags').array(),
  featured: boolean('featured').default(false),
  seo_title: text('seo_title'),
  seo_description: text('seo_description'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  created_by: uuid('created_by'),
  updated_by: uuid('updated_by'),
})

export const mediaAssets = content.table('media_assets', {
  id: uuid('id').primaryKey().defaultRandom(),
  filename: text('filename'),
  url: text('url'),
  mime_type: text('mime_type'),
  size_bytes: integer('size_bytes'),
  dimensions: jsonb('dimensions'),
  alt_text: text('alt_text'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at'),
  updated_by: uuid('updated_by'),
})

export const translationBatches = content.table('translation_batches', {
  id: uuid('id').primaryKey().defaultRandom(),
  entity_type: text('entity_type'),
  entity_id: uuid('entity_id'),
  language: text('language'),
  fields_count: integer('fields_count').default(0),
  completed_at: timestamp('completed_at'),
  created_at: timestamp('created_at').defaultNow(),
})

export const products = commerce.table('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull(),
  category_id: uuid('category_id').notNull(),
  producer_id: uuid('producer_id').notNull(),
  price_points: bigint('price_points', { mode: 'number' }).notNull(),
  price_eur_equivalent: numeric('price_eur_equivalent'),
  fulfillment_method: fulfillmentMethodEnum('fulfillment_method').notNull(),
  is_hero_product: boolean('is_hero_product').notNull().default(false),
  stock_quantity: integer('stock_quantity').default(0),
  stock_management: boolean('stock_management').notNull().default(true),
  weight_grams: integer('weight_grams'),
  dimensions: jsonb('dimensions'),
  tags: text('tags').array(),
  variants: jsonb('variants').default({}),
  nutrition_facts: jsonb('nutrition_facts').default({}),
  allergens: allergenEnum('allergens').array(),
  certifications: certificationEnum('certifications').array(),
  seasonal_availability: jsonb('seasonal_availability').default({}),
  min_tier: userLevelEnum('min_tier').notNull().default('explorateur'),
  featured: boolean('featured').notNull().default(false),
  is_active: boolean('is_active').notNull().default(true),
  launch_date: date('launch_date'),
  discontinue_date: date('discontinue_date'),
  seo_title: text('seo_title'),
  seo_description: text('seo_description'),
  metadata: jsonb('metadata').default({}),
  images: text('images').array(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  secondary_category_id: uuid('secondary_category_id'),
  partner_source: productPartnerSourceEnum('partner_source').notNull().default('direct'),
  deleted_at: timestamp('deleted_at', { withTimezone: true }),
  name_i18n: jsonb('name_i18n').default({ en: '', fr: '' }),
  description_i18n: jsonb('description_i18n').default({ en: '' }),
  short_description_i18n: jsonb('short_description_i18n').default({ en: '' }),
  seo_title_i18n: jsonb('seo_title_i18n').default({ en: '' }),
  seo_description_i18n: jsonb('seo_description_i18n').default({ en: '' }),
  name_default: text('name_default'),
  description_default: text('description_default'),
  search_vector: tsvector('search_vector'),
  origin_country: text('origin_country'), // bpchar in DB, mapped to text
  created_by: uuid('created_by'),
  updated_by: uuid('updated_by'),
  short_description_default: text('short_description_default'), // Consider varchar(200) if strict enforcement needed
})

export const orders = commerce.table('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').notNull(),
  status: orderStatusEnum('status').notNull().default('pending'),

  // Pricing
  subtotal_points: bigint('subtotal_points', { mode: 'number' }).notNull(),
  shipping_cost_points: bigint('shipping_cost_points', { mode: 'number' }).notNull().default(0),
  tax_points: bigint('tax_points', { mode: 'number' }).notNull().default(0),
  total_points: bigint('total_points', { mode: 'number' }).notNull(),
  points_used: bigint('points_used', { mode: 'number' }).notNull(),
  points_earned: bigint('points_earned', { mode: 'number' }).notNull().default(0),

  // Payment
  payment_method: paymentMethodEnum('payment_method'),
  stripe_payment_intent_id: text('stripe_payment_intent_id'),

  // Addresses
  shipping_address: jsonb('shipping_address').notNull(),
  billing_address: jsonb('billing_address'),

  // Fulfillment
  tracking_number: text('tracking_number'),
  carrier: text('carrier'),

  // Notes
  notes: text('notes'),
  admin_notes: text('admin_notes'),

  // Timestamps
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  shipped_at: timestamp('shipped_at', { withTimezone: true }),
  delivered_at: timestamp('delivered_at', { withTimezone: true }),
  deleted_at: timestamp('deleted_at', { withTimezone: true }),
  updated_by: uuid('updated_by'),
})

export const orderItems = commerce.table('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  order_id: uuid('order_id').notNull(),
  product_id: uuid('product_id').notNull(),
  quantity: integer('quantity').notNull(),
  unit_price_points: integer('unit_price_points').notNull(),
  total_price_points: integer('total_price_points').notNull(),
  product_snapshot: jsonb('product_snapshot'),
  created_at: timestamp('created_at').defaultNow(),
  deleted_at: timestamp('deleted_at'),
})

// Public Schema (Profiles + Subscriptions)
export const publicProfiles = pgTable('public_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email'),
  first_name: text('first_name'),
  last_name: text('last_name'),
})

export const countries = pgTable('countries', {
  code: text('code').primaryKey(), // ISO 2 chars (bpchar(2) in DB)
  code_alpha3: text('code_alpha3'),
  name_en: text('name_en'),
  name_fr: text('name_fr'),
  name_nl: text('name_nl'),
  flag_emoji: text('flag_emoji'),
  is_active: boolean('is_active').default(true),
})

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull(),
  email_verified_at: timestamp('email_verified_at', { withTimezone: true }),
  last_login_at: timestamp('last_login_at', { withTimezone: true }),
  first_name: text('first_name'),
  last_name: text('last_name'),
  date_of_birth: date('date_of_birth'),
  phone: text('phone'),
  bio: text('bio'),
  address_street: text('address_street'),
  address_city: text('address_city'),
  address_postal_code: text('address_postal_code'),
  address_country_code: text('address_country_code'),
  language_code: text('language_code').default('fr'),
  timezone: text('timezone').default('Europe/Paris'),
  notification_preferences: jsonb('notification_preferences').default({}),
  social_links: jsonb('social_links').default({}),
  user_level: userLevelEnum('user_level').default('explorateur'),
  kyc_status: kycStatusEnum('kyc_status').default('pending'),
  kyc_level: integer('kyc_level').default(0),
  metadata: jsonb('metadata').default({}),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  deleted_at: timestamp('deleted_at', { withTimezone: true }),
})

export const subscriptions = commerce.table('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').notNull(),
  stripe_subscription_id: text('stripe_subscription_id'),
  stripe_customer_id: text('stripe_customer_id').notNull(),
  plan_type: subscriptionPlanEnum('plan_type').notNull(),
  status: subscriptionStatusEnum('status').notNull().default('active'),
  monthly_points_allocation: bigint('monthly_points_allocation', { mode: 'number' }).notNull(),
  current_period_start: timestamp('current_period_start', { withTimezone: true }),
  current_period_end: timestamp('current_period_end', { withTimezone: true }),
  next_billing_date: timestamp('next_billing_date', { withTimezone: true }),
  cancel_at_period_end: boolean('cancel_at_period_end').notNull().default(false),
  metadata: jsonb('metadata').default({}),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  cancelled_at: timestamp('cancelled_at', { withTimezone: true }),
  ended_at: timestamp('ended_at', { withTimezone: true }),
  billing_frequency: billingFrequencyEnum('billing_frequency').default('monthly'),
  monthly_price: numeric('monthly_price'),
  annual_price: numeric('annual_price'),
  monthly_points: bigint('monthly_points', { mode: 'number' }).notNull().default(0),
  annual_points: bigint('annual_points', { mode: 'number' }).notNull().default(0),
  bonus_percentage: numeric('bonus_percentage').default('0.00'),
  trial_end: timestamp('trial_end', { withTimezone: true }),
  converted_from: text('converted_from'),
  conversion_date: timestamp('conversion_date', { withTimezone: true }),
  conversion_incentive: jsonb('conversion_incentive').default({}),
  cancellation_reason: text('cancellation_reason'),
  deleted_at: timestamp('deleted_at', { withTimezone: true }),
  updated_by: uuid('updated_by'),
})

// Public Schema (Users)
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name'),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const producerMessages = pgTable('producer_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  producer_id: uuid('producer_id').notNull(),
  sender_user_id: uuid('sender_user_id').notNull(),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  status: text('status').notNull().default('pending'),
  metadata: jsonb('metadata').default({}),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const pointsLedger = commerce.table('points_ledger', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').notNull(),
  delta: bigint('delta', { mode: 'number' }).notNull(),
  reason: text('reason').notNull(),
  reference_type: text('reference_type'),
  reference_id: uuid('reference_id'),
  metadata: jsonb('metadata').default({}),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  created_by: uuid('created_by'),
})

export const stripeEvents = commerce.table('stripe_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  event_id: text('event_id').notNull().unique(),
  type: text('type').notNull(),
  data: jsonb('data').default({}),
  error: text('error'),
  processed_at: timestamp('processed_at', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

// Export Types
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type ProducerMessage = typeof producerMessages.$inferSelect
export type PointsLedgerEntry = typeof pointsLedger.$inferSelect
export type StripeEvent = typeof stripeEvents.$inferSelect

export type Product = typeof products.$inferSelect
export type NewProduct = typeof products.$inferInsert
export type Category = typeof categories.$inferSelect
export type Producer = typeof producers.$inferSelect
export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert
export type Order = typeof orders.$inferSelect
export type OrderItem = typeof orderItems.$inferSelect
export type Subscription = typeof subscriptions.$inferSelect
export type Profile = typeof profiles.$inferSelect
export type NewProfile = typeof profiles.$inferInsert // NOTE: Relations are NOT exported here to avoid circular dependency.
// Import them explicitly when needed for RQB:
// import * as relations from '@make-the-change/core/db/relations'
