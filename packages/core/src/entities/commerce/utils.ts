/**
 * Commerce Module Utilities
 */

import type { Address, OrderStatus } from './types'

// Format price in EUR
export const formatPrice = (amount: number, currency = 'EUR'): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
  }).format(amount)
}

// Format address
export const formatAddress = (address: Address): string => {
  return `${address.street}, ${address.postalCode} ${address.city}, ${address.country}`
}

// Calculate order totals
export const calculateOrderTotals = (
  items: { unitPrice: number; quantity: number }[],
  shippingCost = 0,
  taxRate = 0.2,
): { subtotal: number; tax: number; total: number } => {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  const tax = subtotal * taxRate
  const total = subtotal + tax + shippingCost

  return { subtotal, tax, total }
}

// Get order status label (French)
export const getOrderStatusLabel = (status: OrderStatus): string => {
  const labels: Record<OrderStatus, string> = {
    pending: 'En attente',
    paid: 'Payée',
    processing: 'En préparation',
    in_transit: 'En transit',
    completed: 'Livrée',
    closed: 'Clôturée',
  }
  return labels[status]
}

// Check if order can be cancelled
export const canCancelOrder = (status: OrderStatus): boolean => {
  return ['pending', 'paid'].includes(status)
}

// Check if order can be refunded
export const canRefundOrder = (status: OrderStatus): boolean => {
  return ['completed', 'in_transit'].includes(status)
}
