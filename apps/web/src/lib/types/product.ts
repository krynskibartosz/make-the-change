import type { Database } from '@make-the-change/core/database-types'

type ProductRow = Database['public']['Views']['products']['Row']
export type Product = ProductRow & {
  // Relations often fetched with products
  producer?: { id: string; name_default: string | null } | null
  category?: { id: string; name_default: string | null } | null
  secondary_category?: { id: string; name_default: string | null } | null
  images?: string[]
  cover_blur_data_url?: string | null
  cover_blur_hash?: string | null
}
