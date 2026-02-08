import type { Database } from '@make-the-change/core/database-types'

type ProjectRow = Database['public']['Views']['projects']['Row']

export type Project = ProjectRow & {
  name: string
  description: string
  address: {
    city: string | null
    country: string | null
    street: string | null
    postal_code: string | null
    region: string | null
  }
  images: string[]
  producer?: { id: string; name_default: string | null } | null
  // Deprecated: used in old code, migrating to relation object
  producer_name?: string | null
  description_i18n?: Record<string, string> | null
  long_description_i18n?: Record<string, string> | null
  name_i18n?: Record<string, string> | null
  impact_metrics?: Record<string, unknown> | null
  metadata?: Record<string, unknown> | null
  location?: unknown
  address_coordinates?: unknown
}
