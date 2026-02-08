'use client'

import { cn } from '@make-the-change/core/shared/utils'
import {
  BottomSheet,
  BottomSheetBody,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
  Button,
} from '@make-the-change/core/ui'
import { Filter, X } from 'lucide-react'
import type { FC, ReactNode } from 'react'

export type AdminFilterButtonProps = {
  onClick: () => void
  isActive?: boolean
  ariaLabel?: string
}

/**
 * Compact filter button used on mobile list headers.
 *
 * Uses a clear pressed/active state to provide immediate visual feedback.
 */
export const AdminFilterButton: FC<AdminFilterButtonProps> = ({
  onClick,
  isActive = false,
  ariaLabel = 'Ouvrir les filtres',
}) => (
  <Button
    aria-label={ariaLabel}
    aria-pressed={isActive ? 'true' : 'false'}
    className={cn(
      'h-11 w-11 p-0 rounded-2xl focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
      isActive && 'border-primary/30',
    )}
    size="sm"
    variant={isActive ? 'default' : 'outline'}
    onClick={onClick}
  >
    <Filter className="h-4 w-4" aria-hidden="true" />
  </Button>
)

export type AdminFilterSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  children: ReactNode
  testId?: string
}

/**
 * Bottom sheet used to host secondary filters on mobile.
 *
 * The sheet reduces choice overload (Hick) by keeping only 1–2 primary controls
 * visible above the fold, while preserving access to all filters.
 */
export const AdminFilterSheet: FC<AdminFilterSheetProps> = ({
  open,
  onOpenChange,
  title = 'Filtres',
  children,
  testId = 'admin-filter-sheet',
}) => (
  <BottomSheet open={open} onOpenChange={onOpenChange}>
    <BottomSheetContent data-testid={testId} onSwipeClose={() => onOpenChange(false)}>
      <BottomSheetHeader>
        <BottomSheetTitle>{title}</BottomSheetTitle>
        <BottomSheetClose
          render={(props) => (
            <Button
              {...props}
              aria-label="Fermer"
              className={cn('h-8 w-8 p-0', props.className)}
              size="sm"
              variant="ghost"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </Button>
          )}
        />
      </BottomSheetHeader>
      <BottomSheetBody>{children}</BottomSheetBody>
    </BottomSheetContent>
  </BottomSheet>
)
