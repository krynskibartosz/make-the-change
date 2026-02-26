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
  ecosystems,
  species,
  items,
  userInventory,
  properties,
  quests,
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
export const projectsRelations = relations(projects, ({ one, many }) => ({
  producer: one(producers, {
    fields: [projects.producer_id],
    references: [producers.id],
  }),
  ecosystem: one(ecosystems, {
    fields: [projects.ecosystem_id],
    references: [ecosystems.id],
  }),
  species: one(species, {
    fields: [projects.species_id],
    references: [species.id],
  }),
  properties: many(properties),
  quests: many(quests),
}))

// Properties Relations
export const propertiesRelations = relations(properties, ({ one, many }) => ({
  project: one(projects, {
    fields: [properties.project_id],
    references: [projects.id],
  }),
  quests: many(quests),
}))

// Quests Relations
export const questsRelations = relations(quests, ({ one }) => ({
  project: one(projects, {
    fields: [quests.project_id],
    references: [projects.id],
  }),
  property: one(properties, {
    fields: [quests.property_id],
    references: [properties.id],
  }),
}))

// Items Relations
export const itemsRelations = relations(items, ({ many }) => ({
  inventory: many(userInventory),
}))

// User Inventory Relations
export const userInventoryRelations = relations(userInventory, ({ one }) => ({
  user: one(profiles, {
    fields: [userInventory.user_id],
    references: [profiles.id],
  }),
  item: one(items, {
    fields: [userInventory.item_id],
    references: [items.id],
  }),
}))

// Ecosystems Relations
export const ecosystemsRelations = relations(ecosystems, ({ many }) => ({
  projects: many(projects),
}))

// Species Relations
export const speciesRelations = relations(species, ({ many }) => ({
  projects: many(projects),
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
