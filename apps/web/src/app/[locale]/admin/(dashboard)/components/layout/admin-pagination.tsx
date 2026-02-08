'use client'

import { Pagination } from '@make-the-change/core/ui'
import type { FC } from 'react'

type PaginationInfo = {
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
}

type AdminPaginationProps = {
  pagination: PaginationInfo
  className?: string
  onPageChange?: (page: number) => void
}

export const AdminPagination: FC<AdminPaginationProps> = ({
  pagination,
  className = '',
  onPageChange,
}) => (
  <div className={`mt-6 ${className}`}>
    <Pagination pagination={pagination} onPageChange={onPageChange} />
  </div>
)
