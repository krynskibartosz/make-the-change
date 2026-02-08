'use client'

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
import { cn } from '@make-the-change/core/shared/utils'

type FilterButtonProps = {
  onClick: () => void
  isActive?: boolean
}

const FilterButton: FC<FilterButtonProps> = ({ onClick, isActive = false }) => (
  <Button
    size="sm"
    variant={isActive ? 'default' : 'outline'}
    className={`h-9 w-9 p-0 relative focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 ${
      isActive ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''
    }`}
    onClick={onClick}
  >
    <Filter className="h-4 w-4" />
  </Button>
)

type FilterModalProps = {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

const FilterModal: FC<FilterModalProps> = ({ isOpen, onClose, children }) => (
  <BottomSheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
    <BottomSheetContent onSwipeClose={onClose}>
      <BottomSheetHeader>
        <BottomSheetTitle>Filtres</BottomSheetTitle>
        <BottomSheetClose
          render={(props) => (
            <Button
              {...props}
              className={cn('h-8 w-8 p-0', props.className)}
              size="sm"
              variant="ghost"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        />
      </BottomSheetHeader>
      <BottomSheetBody>{children}</BottomSheetBody>
    </BottomSheetContent>
  </BottomSheet>
)

export { FilterButton, FilterModal }
