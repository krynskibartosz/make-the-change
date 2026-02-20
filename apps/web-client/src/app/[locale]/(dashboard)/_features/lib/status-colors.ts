/**
 * Centralized status → badge variant mapping
 * Eliminates duplication across order/investment pages
 */

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'completed'
  | 'cancelled'
export type InvestmentStatus = 'active' | 'completed' | 'pending'

// Badge variants available in @make-the-change/core/ui
export type BadgeVariant = 'default' | 'secondary' | 'success' | 'destructive' | 'outline'

const orderStatusColors = {
  pending: 'secondary',
  processing: 'secondary',
  shipped: 'default',
  delivered: 'success',
  completed: 'success',
  cancelled: 'destructive',
} satisfies Record<OrderStatus, BadgeVariant>

const investmentStatusColors = {
  active: 'success',
  completed: 'secondary',
  pending: 'default',
} satisfies Record<InvestmentStatus, BadgeVariant>

export function getOrderStatusColor(status: string): BadgeVariant {
  return orderStatusColors[status as OrderStatus] ?? 'secondary'
}

export function getInvestmentStatusColor(status: string): BadgeVariant {
  return investmentStatusColors[status as InvestmentStatus] ?? 'secondary'
}
