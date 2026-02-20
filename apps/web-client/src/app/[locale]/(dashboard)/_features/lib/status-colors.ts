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

const isOrderStatus = (value: string): value is OrderStatus => value in orderStatusColors

const isInvestmentStatus = (value: string): value is InvestmentStatus =>
  value in investmentStatusColors

export function getOrderStatusColor(status: string): BadgeVariant {
  return isOrderStatus(status) ? orderStatusColors[status] : 'secondary'
}

export function getInvestmentStatusColor(status: string): BadgeVariant {
  return isInvestmentStatus(status) ? investmentStatusColors[status] : 'secondary'
}
