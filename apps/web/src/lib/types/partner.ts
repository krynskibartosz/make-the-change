import type { Database } from '@make-the-change/core/database-types'

type ProducerRow = Database['public']['Views']['producers']['Row']

export type Partner = {
  id: string
  name: string // Mapped from name_default
  contact_email: string | null
  status: ProducerRow['status']
  created_at: string | null
}
