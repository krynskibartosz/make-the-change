import type { Database } from '@make-the-change/core/database-types'

type OrderRow = Database['public']['Views']['orders']['Row']
type OrderItemRow = Database['public']['Views']['order_items']['Row']
type ProfileRow = Database['public']['Tables']['profiles']['Row']

export type Order = {
  id: string // OrderRow['id'] is string | null, but UI expects string
  status: OrderRow['status']
  createdAt: string // OrderRow['created_at'] is string | null
  total: number | null // OrderRow['total_points']
  customerName: string
  items?: OrderItemRow[]
  user?: Pick<ProfileRow, 'email' | 'first_name' | 'last_name'>
}
