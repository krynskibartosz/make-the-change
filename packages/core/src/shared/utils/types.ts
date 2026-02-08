/**
 * Shared Types
 * Common types used across all modules
 */

// API Response Types
export type ApiResponse<T = unknown> = {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Pagination Types
export type PaginationParams = {
  page: number
  limit: number
}

export type PaginatedResponse<T> = ApiResponse<T[]> & {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Filter Types
export type DateRange = {
  from: Date
  to: Date
}

export type SortParams = {
  field: string
  direction: 'asc' | 'desc'
}

// Generic ID type
export type EntityId = string

// Timestamps
export type Timestamps = {
  createdAt: Date
  updatedAt: Date
}
