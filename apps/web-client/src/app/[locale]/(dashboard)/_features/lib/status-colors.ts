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

const orderStatusColors: Record<OrderStatus, BadgeVariant> = {
  pending: 'secondary',
  processing: 'secondary',
  shipped: 'default',
  delivered: 'success',
  completed: 'success',
  cancelled: 'destructive',
}

const investmentStatusColors: Record<InvestmentStatus, BadgeVariant> = {
  active: 'success',
  completed: 'secondary',
  pending: 'default',
}

export function getOrderStatusColor(status: string): BadgeVariant {
  return orderStatusColors[status as OrderStatus] ?? 'secondary'
}

export function getInvestmentStatusColor(status: string): BadgeVariant {
  return investmentStatusColors[status as InvestmentStatus] ?? 'secondary'
}
