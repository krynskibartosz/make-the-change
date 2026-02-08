import { relations } from 'drizzle-orm'
import {
  categories,
  investments,
  orderItems,
  orders,
  producers,
  products,
  profiles,
  projects,
  subscriptions,
} from './schema'

// Products Relations
export const productsRelations = relations(products, ({ one }) => ({
  producer: one(producers, {
    fields: [products.producer_id],
    references: [producers.id],
  }),
  category: one(categories, {
    fields: [products.category_id],
    references: [categories.id],
    relationName: 'primaryCategory',
  }),
  secondaryCategory: one(categories, {
    fields: [products.secondary_category_id],
    references: [categories.id],
    relationName: 'secondaryCategory',
  }),
}))

// Producers Relations
export const producersRelations = relations(producers, ({ many }) => ({
  products: many(products),
  projects: many(projects),
}))

// Categories Relations
export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parentCategory: one(categories, {
    fields: [categories.parent_id],
    references: [categories.id],
    relationName: 'categoryHierarchy',
  }),
  subcategories: many(categories, {
    relationName: 'categoryHierarchy',
  }),
  primaryProducts: many(products, {
    relationName: 'primaryCategory',
  }),
  secondaryProducts: many(products, {
    relationName: 'secondaryCategory',
  }),
}))

// Projects Relations
export const projectsRelations = relations(projects, ({ one }) => ({
  producer: one(producers, {
    fields: [projects.producer_id],
    references: [producers.id],
  }),
}))

// Investments Relations
export const investmentsRelations = relations(investments, ({ one }) => ({
  project: one(projects, {
    fields: [investments.project_id],
    references: [projects.id],
  }),
  user: one(profiles, {
    fields: [investments.user_id],
    references: [profiles.id],
  }),
}))

// Orders Relations
export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(profiles, {
    fields: [orders.user_id],
    references: [profiles.id],
  }),
  items: many(orderItems),
}))

// Order Items Relations
export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.order_id],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.product_id],
    references: [products.id],
  }),
}))

// Subscriptions Relations
export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(profiles, {
    fields: [subscriptions.user_id],
    references: [profiles.id],
  }),
}))

// Profiles Relations
export const profilesRelations = relations(profiles, ({ many }) => ({
  orders: many(orders),
  subscriptions: many(subscriptions),
}))
