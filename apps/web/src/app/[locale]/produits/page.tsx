import { Suspense } from 'react'
import { ProductsClient } from './products-client'
import { db } from '@/lib/db'
import { products, categories } from '@make-the-change/core/schema'
import { eq, isNull, and, desc, asc } from 'drizzle-orm'

async function getProducts() {
  return db.query.products.findMany({
    where: and(eq(products.is_active, true), isNull(products.deleted_at)),
    orderBy: [desc(products.created_at)],
    limit: 50,
  })
}

async function getCategories() {
  return db.query.categories.findMany({
    where: and(eq(categories.is_active, true), isNull(categories.deleted_at)),
    orderBy: [asc(categories.sort_order)],
  })
}

export default async function ProductsPage() {
  const [initialProducts, initialCategories] = await Promise.all([
    getProducts(),
    getCategories(),
  ])

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div>Chargement...</div>}>
        <ProductsClient initialProducts={initialProducts} categories={initialCategories} />
      </Suspense>
    </div>
  )
}
