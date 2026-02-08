/**
 * Admin API helpers - replacement for tRPC hooks
 * Use with React Query for data fetching
 */

import type { Database } from '@make-the-change/core/database-types'

// Types
export type OrdersListParams = {
  status?: string
  limit?: number
  cursor?: string
}

export type PartnersListParams = {
  q?: string
  status?: string
  limit?: number
  cursor?: string
}

export type ProjectsListParams = {
  status?: string
  type?: string
  search?: string
  limit?: number
  cursor?: string
}

export type UsersListParams = {
  q?: string
  limit?: number
  cursor?: string
}

// Helper to build query string
function buildParams(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value))
    }
  }
  return searchParams.toString()
}

// Orders
export const adminOrdersApi = {
  list: async (params: OrdersListParams = {}) => {
    const query = buildParams(params)
    const res = await fetch(`/api/admin/orders${query ? `?${query}` : ''}`)
    if (!res.ok) throw new Error('Failed to fetch orders')
    return res.json()
  },

  detail: async (id: string) => {
    const res = await fetch(`/api/admin/orders/${id}`)
    if (!res.ok) throw new Error('Failed to fetch order')
    return res.json()
  },

  update: async (id: string, data: Database['public']['Views']['orders']['Update']) => {
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to update order')
    return res.json()
  },
}

// Partners
export const adminPartnersApi = {
  list: async (params: PartnersListParams = {}) => {
    const query = buildParams(params)
    const res = await fetch(`/api/admin/partners${query ? `?${query}` : ''}`)
    if (!res.ok) throw new Error('Failed to fetch partners')
    return res.json()
  },

  detail: async (id: string) => {
    const res = await fetch(`/api/admin/partners/${id}`)
    if (!res.ok) throw new Error('Failed to fetch partner')
    return res.json()
  },

  create: async (data: Database['public']['Views']['producers']['Insert']) => {
    const res = await fetch('/api/admin/partners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to create partner')
    return res.json()
  },

  update: async (id: string, data: Database['public']['Views']['producers']['Update']) => {
    const res = await fetch(`/api/admin/partners/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to update partner')
    return res.json()
  },
}

// Projects
export const adminProjectsApi = {
  list: async (params: ProjectsListParams = {}) => {
    const query = buildParams(params)
    const res = await fetch(`/api/admin/projects${query ? `?${query}` : ''}`)
    if (!res.ok) throw new Error('Failed to fetch projects')
    return res.json()
  },

  detail: async (id: string) => {
    const res = await fetch(`/api/admin/projects/${id}`)
    if (!res.ok) throw new Error('Failed to fetch project')
    return res.json()
  },

  update: async (id: string, data: Database['public']['Views']['projects']['Update']) => {
    const res = await fetch(`/api/admin/projects/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to update project')
    return res.json()
  },
}

// Users
export const adminUsersApi = {
  list: async (params: UsersListParams = {}) => {
    const query = buildParams(params)
    const res = await fetch(`/api/admin/users${query ? `?${query}` : ''}`)
    if (!res.ok) throw new Error('Failed to fetch users')
    return res.json()
  },

  detail: async (id: string) => {
    const res = await fetch(`/api/admin/users/${id}`)
    if (!res.ok) throw new Error('Failed to fetch user')
    return res.json()
  },

  update: async (id: string, data: Database['public']['Tables']['profiles']['Update']) => {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to update user')
    return res.json()
  },
}

// Subscriptions
export const adminSubscriptionsApi = {
  list: async (params: { status?: string; limit?: number; cursor?: string } = {}) => {
    const query = buildParams(params)
    const res = await fetch(`/api/admin/subscriptions${query ? `?${query}` : ''}`)
    if (!res.ok) throw new Error('Failed to fetch subscriptions')
    return res.json()
  },

  detail: async (id: string) => {
    const res = await fetch(`/api/admin/subscriptions/${id}`)
    if (!res.ok) throw new Error('Failed to fetch subscription')
    return res.json()
  },

  update: async (id: string, data: Database['public']['Views']['subscriptions']['Update']) => {
    const res = await fetch(`/api/admin/subscriptions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to update subscription')
    return res.json()
  },
}

// Categories
export const adminCategoriesApi = {
  list: async (params: { activeOnly?: boolean; parentId?: string } = {}) => {
    const query = buildParams(params)
    const res = await fetch(`/api/admin/categories${query ? `?${query}` : ''}`)
    if (!res.ok) throw new Error('Failed to fetch categories')
    return res.json()
  },

  tree: async () => {
    const res = await fetch('/api/admin/categories/tree')
    if (!res.ok) throw new Error('Failed to fetch category tree')
    return res.json()
  },
}
