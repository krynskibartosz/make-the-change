'use client'
import { Input } from '@make-the-change/core/ui'
import { Search } from 'lucide-react'
import type { FC, ReactNode } from 'react'
import { cn } from '../cn'

// Types pour les sous-composants
type AdminPageHeaderProps = {
  children: ReactNode
  className?: string
}

type AdminPageHeaderSearchProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  isLoading?: boolean
  className?: string
  inputAriaLabel?: string
}

/**
 * Admin page header container (legacy admin-layout).
 *
 * Kept for backward compatibility while the dashboard progressively converges
 * to a single layout kit.
 */
const AdminPageHeaderComponent: FC<AdminPageHeaderProps> = ({ children, className }) => {
  return (
    <div className={cn('admin-header', className)}>
      <div className="p-6">{children}</div>
    </div>
  )
}

/**
 * Search input optimized for admin list pages.
 *
 * Uses design system tokens (no hardcoded colors) and exposes an accessible
 * label for screen readers.
 */
const AdminPageHeaderSearch: FC<AdminPageHeaderSearchProps> = ({
  value,
  onChange,
  placeholder = 'Rechercher...',
  isLoading = false,
  className,
  inputAriaLabel = 'Rechercher',
}) => (
  <div className={cn('relative w-full', className)}>
    <Input
      aria-label={inputAriaLabel}
      leadingIcon={<Search className="h-4 w-4" aria-hidden="true" />}
      placeholder={placeholder}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    {isLoading && (
      <div
        role="status"
        aria-label="Chargement"
        aria-live="polite"
        className="absolute right-3 top-1/2 -translate-y-1/2"
      >
        <div className="h-4 w-4 border-2 border-muted-foreground/30 border-t-primary rounded-full animate-spin" />
      </div>
    )}
  </div>
)

export const AdminPageHeader = Object.assign(AdminPageHeaderComponent, {
  Search: AdminPageHeaderSearch,
})
