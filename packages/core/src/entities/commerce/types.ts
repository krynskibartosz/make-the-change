/**
 * Commerce Module Types
 * Products, Orders, Cart
 */

import { z } from 'zod'

// Order Statuses
export const OrderStatusEnum = z.enum([
  'pending',
  'paid',
  'processing',
  'in_transit',
  'completed',
  'closed',
])
export type OrderStatus = z.infer<typeof OrderStatusEnum>

// Payment Methods
export const PaymentMethodEnum = z.enum([
  'points',
  'stripe_card',
  'stripe_sepa',
  'stripe_bank_transfer',
  'mixed',
])
export type PaymentMethod = z.infer<typeof PaymentMethodEnum>

// Order Item Schema
export const OrderItemSchema = z.object({
  id: z.string().uuid(),
  order_id: z.string().uuid(),
  product_id: z.string().uuid(),
  quantity: z.number().int().positive(),
  unit_price_points: z.number().int().nonnegative(),
  total_price_points: z.number().int().nonnegative(),
  product_snapshot: z.unknown().optional(),
})

export type OrderItem = z.infer<typeof OrderItemSchema>

// Address Schema
export const AddressSchema = z.object({
  street: z.string(),
  city: z.string(),
  postalCode: z.string(),
  country: z.string(),
  firstName: z.string(),
  lastName: z.string(),
})

export type Address = z.infer<typeof AddressSchema>

// Order Schema
export const OrderSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  status: OrderStatusEnum.default('pending'),

  subtotal_points: z.number().int().nonnegative(),
  shipping_cost_points: z.number().int().nonnegative().default(0),
  tax_points: z.number().int().nonnegative().default(0),
  total_points: z.number().int().nonnegative(),
  points_used: z.number().int().nonnegative(),
  points_earned: z.number().int().nonnegative().default(0),

  payment_method: PaymentMethodEnum.optional(),
  stripe_payment_intent_id: z.string().optional(),

  shipping_address: AddressSchema,
  billing_address: AddressSchema.optional(),

  tracking_number: z.string().optional(),
  carrier: z.string().optional(),
  notes: z.string().optional(),
  admin_notes: z.string().optional(),

  created_at: z.date(),
  updated_at: z.date(),
  shipped_at: z.date().optional(),
  delivered_at: z.date().optional(),
  deleted_at: z.date().optional(),
})

export type Order = z.infer<typeof OrderSchema>

// Create Order Schema
export const CreateOrderSchema = OrderSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  shipped_at: true,
  delivered_at: true,
  deleted_at: true,
})

export type CreateOrder = z.infer<typeof CreateOrderSchema>

// Product Status
// Product Schema
export const ProductSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(1),
  category_id: z.string().uuid(),
  producer_id: z.string().uuid(),
  price_points: z.number().int().nonnegative(),
  price_eur_equivalent: z.number().optional(),
  fulfillment_method: z.enum(['ship', 'pickup', 'digital', 'experience']),
  is_hero_product: z.boolean().default(false),
  stock_quantity: z.number().int().nonnegative().default(0),
  stock_management: z.boolean().default(true),
  weight_grams: z.number().int().optional(),
  dimensions: z.unknown().optional(),
  tags: z.array(z.string()).default([]),
  variants: z.unknown().optional(),
  nutrition_facts: z.unknown().optional(),
  allergens: z.array(z.string()).default([]),
  certifications: z.array(z.string()).default([]),
  seasonal_availability: z.unknown().optional(),
  min_tier: z.enum(['explorateur', 'protecteur', 'ambassadeur']).default('explorateur'),
  featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
  launch_date: z.date().optional(),
  discontinue_date: z.date().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  created_at: z.date(),
  updated_at: z.date(),
})

export type Product = z.infer<typeof ProductSchema>

// Cart Item
export const CartItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
  usePoints: z.boolean().default(false),
})

export type CartItem = z.infer<typeof CartItemSchema>

// Cart
export const CartSchema = z.object({
  userId: z.string().uuid(),
  items: z.array(CartItemSchema),
  updatedAt: z.date(),
})

export type Cart = z.infer<typeof CartSchema>
