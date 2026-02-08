'use client'

import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { FC } from 'react'

export type PaginationData = {
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export type PaginationLabels = {
  previous?: string
  next?: string
  previousAria?: string
  nextAria?: string
}

export type PaginationProps = {
  pagination?: PaginationData
  className?: string
  onPageChange?: (page: number) => void
  labels?: PaginationLabels
}

export const Pagination: FC<PaginationProps> = ({
  pagination,
  className = '',
  onPageChange,
  labels,
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  if (!pagination) return null

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page)
    } else {
      const params = new URLSearchParams(searchParams.toString())
      params.set('page', page.toString())
      router.push(`${pathname}?${params.toString()}`)
    }
  }

  const { currentPage, totalPages, totalItems } = pagination

  if (totalPages <= 1) return null

  const generatePageNumbers = () => {
    const pages: (number | 'ellipsis')[] = []

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, 'ellipsis', totalPages)
      } else if (currentPage >= totalPages - 3) {
        pages.push(
          1,
          'ellipsis',
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        )
      } else {
        pages.push(
          1,
          'ellipsis',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          'ellipsis',
          totalPages,
        )
      }
    }

    return pages
  }

  return (
    <div
      className={`flex flex-col py-4 px-4 sm:px-6 md:px-8 sm:flex-row items-center justify-between gap-2 sm:gap-4 ${className} border-t shadow-2xl  w-full`}
    >
      <div className="hidden sm:block text-sm text-muted-foreground">
        Page {currentPage} sur {totalPages} • {totalItems.toLocaleString()} éléments
      </div>

      <div className="flex items-center gap-1">
        <button
          className="group cursor-pointer flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 text-sm text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:pointer-events-none transition-colors rounded-md hover:bg-muted/40"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          aria-label={labels?.previousAria ?? 'Previous page'}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">{labels?.previous ?? 'Précédent'}</span>
        </button>

        <div className="hidden sm:flex items-center gap-1 mx-2">
          {generatePageNumbers().map((page, index) =>
            page === 'ellipsis' ? (
              <div
                key={`ellipsis-${index}`}
                className="flex h-8 w-8 items-center justify-center text-muted-foreground"
              >
                <MoreHorizontal className="h-4 w-4" />
              </div>
            ) : (
              <button
                key={page}
                aria-current={currentPage === page ? 'page' : undefined}
                className={`h-8 cursor-pointer w-8 rounded-md text-sm font-medium transition-all duration-200 relative overflow-hidden ${
                  currentPage === page
                    ? 'bg-gradient-to-br from-primary via-primary/90 to-orange-500 text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-105'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                }`}
                onClick={() => handlePageChange(page)}
              >
                {currentPage === page && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/20 pointer-events-none" />
                )}
                <span className="relative z-10">{page}</span>
              </button>
            ),
          )}
        </div>

        <div className="flex sm:hidden items-center px-2 py-1 text-sm text-muted-foreground">
          {currentPage} / {totalPages}
        </div>

        <button
          className="group cursor-pointer flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 text-sm text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:pointer-events-none transition-colors rounded-md hover:bg-muted/40"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          aria-label={labels?.nextAria ?? 'Next page'}
        >
          <span className="hidden sm:inline">{labels?.next ?? 'Suivant'}</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="sm:hidden text-xs text-muted-foreground text-center leading-none">
        {totalItems.toLocaleString()} éléments
      </div>
    </div>
  )
}
