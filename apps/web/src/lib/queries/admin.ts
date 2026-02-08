// Server-side Admin Queries
// For use in React Server Components (RSC)

import { db } from '@make-the-change/core/db'
import { categories, producers, products } from '@make-the-change/core/schema'
import { and, asc, eq, isNotNull } from 'drizzle-orm'

// Fetch producers for RSC
export async function getProducers() {
  const rows = await db.query.producers.findMany({
    columns: {
      id: true,
      name_default: true,
    },
    orderBy: [asc(producers.name_default)],
  })

  return {
    data: rows.map((p) => ({
      id: p.id,
      name: p.name_default,
    })),
  }
}

// Fetch categories for RSC
export async function getCategories(params: { activeOnly?: boolean } = {}) {
  const whereConditions = []
  if (params.activeOnly) {
    whereConditions.push(eq(categories.is_active, true))
  }

  const rows = await db.query.categories.findMany({
    columns: {
      id: true,
      name_default: true,
      parent_id: true,
    },
    where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
    orderBy: [asc(categories.name_default)],
  })

  return {
    data: rows.map((c) => ({
      id: c.id,
      name: c.name_default ?? '',
      parent_id: c.parent_id,
    })),
  }
}

// Fetch product tags for RSC
export async function getProductTags() {
  const rows = await db
    .select({ tags: products.tags })
    .from(products)
    .where(isNotNull(products.tags))

  // Extract unique tags
  const allTags = rows
    .flatMap((p) => p.tags || [])
    .filter((tag: string, index: number, self: string[]) => self.indexOf(tag) === index)

  return { data: allTags }
}
