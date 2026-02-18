import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ProductsPaginationData } from './products-query'

type ProductsPaginationLabels = {
  previous: string
  next: string
  page: string
  of: string
  itemsCount: (count: number) => string
}

type ProductsPaginationProps = {
  pagination: ProductsPaginationData
  labels: ProductsPaginationLabels
  onPageChange: (page: number) => void
  isPending?: boolean
  className?: string
}

const buildPageWindow = (currentPage: number, totalPages: number): Array<number | 'ellipsis'> => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, 'ellipsis', totalPages]
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      'ellipsis',
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ]
  }

  return [1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages]
}

export function ProductsPagination({
  pagination,
  labels,
  onPageChange,
  isPending = false,
  className,
}: ProductsPaginationProps) {
  if (pagination.totalPages <= 1) {
    return null
  }

  const pageWindow = buildPageWindow(pagination.currentPage, pagination.totalPages)

  return (
    <nav
      className={cn('rounded-2xl border border-border bg-card p-3 shadow-sm md:p-4', className)}
      aria-label="Products pagination"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-medium text-muted-foreground sm:text-sm">
          {labels.page} {pagination.currentPage} {labels.of} {pagination.totalPages} •{' '}
          {labels.itemsCount(pagination.totalItems)}
        </p>

        <div className="flex items-center justify-between gap-1 sm:justify-end">
          <button
            type="button"
            disabled={isPending || pagination.currentPage <= 1}
            onClick={() => onPageChange(pagination.currentPage - 1)}
            className="inline-flex h-9 items-center gap-1 rounded-lg border border-border px-2 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">{labels.previous}</span>
          </button>

          <div className="hidden items-center gap-1 sm:flex">
            {pageWindow.map((entry, index) =>
              entry === 'ellipsis' ? (
                <span
                  key={`ellipsis-${index}`}
                  className="inline-flex h-9 w-9 items-center justify-center text-muted-foreground"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </span>
              ) : (
                <button
                  key={entry}
                  type="button"
                  aria-current={entry === pagination.currentPage ? 'page' : undefined}
                  disabled={isPending}
                  onClick={() => onPageChange(entry)}
                  className={cn(
                    'inline-flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-semibold transition',
                    entry === pagination.currentPage
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background text-foreground hover:border-primary/40 hover:text-primary',
                    isPending && 'cursor-not-allowed opacity-70',
                  )}
                >
                  {entry}
                </button>
              ),
            )}
          </div>

          <button
            type="button"
            disabled={isPending || pagination.currentPage >= pagination.totalPages}
            onClick={() => onPageChange(pagination.currentPage + 1)}
            className="inline-flex h-9 items-center gap-1 rounded-lg border border-border px-2 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span className="hidden sm:inline">{labels.next}</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </nav>
  )
}
