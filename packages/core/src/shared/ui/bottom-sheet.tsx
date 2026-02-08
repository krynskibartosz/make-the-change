'use client'

import type * as React from 'react'
import { forwardRef, useState } from 'react'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from './base/dialog'
import { cn } from './utils'

export {
  Dialog as BottomSheet,
  DialogTrigger as BottomSheetTrigger,
  DialogTitle as BottomSheetTitle,
  DialogDescription as BottomSheetDescription,
  DialogClose as BottomSheetClose,
}

export type BottomSheetContentProps = React.ComponentPropsWithoutRef<typeof DialogContent> & {
  showHandle?: boolean
  enableSwipeToClose?: boolean
  onSwipeClose?: () => void
}

type DialogContentProps = React.ComponentPropsWithoutRef<typeof DialogContent>
type TouchStartEvent = Parameters<NonNullable<DialogContentProps['onTouchStart']>>[0]
type TouchMoveEvent = Parameters<NonNullable<DialogContentProps['onTouchMove']>>[0]
type TouchEndEvent = Parameters<NonNullable<DialogContentProps['onTouchEnd']>>[0]

export const BottomSheetContent = forwardRef<
  React.ElementRef<typeof DialogContent>,
  BottomSheetContentProps
>(
  (
    {
      className,
      children,
      showHandle = true,
      enableSwipeToClose,
      onSwipeClose,
      style,
      onTouchEnd,
      onTouchMove,
      onTouchStart,
      ...props
    },
    ref,
  ) => {
    const shouldEnableSwipe = Boolean(onSwipeClose) || Boolean(enableSwipeToClose)
    const [startY, setStartY] = useState<number | null>(null)
    const [currentY, setCurrentY] = useState<number | null>(null)
    const [translateY, setTranslateY] = useState(0)

    const handleTouchStart = (event: TouchStartEvent) => {
      onTouchStart?.(event)
      if (!shouldEnableSwipe) return
      if (!event.touches[0]) return
      setStartY(event.touches[0].clientY)
      setCurrentY(event.touches[0].clientY)
    }

    const handleTouchMove = (event: TouchMoveEvent) => {
      onTouchMove?.(event)
      if (!shouldEnableSwipe) return
      if (startY === null) return
      if (!event.touches[0]) return

      const currentTouchY = event.touches[0].clientY
      setCurrentY(currentTouchY)

      const diff = currentTouchY - startY
      // Only allow swipe down
      if (diff > 0) setTranslateY(diff)
    }

    const handleTouchEnd = (event: TouchEndEvent) => {
      onTouchEnd?.(event)
      if (!shouldEnableSwipe) return
      if (startY === null || currentY === null) return

      const diff = currentY - startY
      if (diff > 100) onSwipeClose?.()

      setStartY(null)
      setCurrentY(null)
      setTranslateY(0)
    }

    return (
      <DialogContent
        ref={ref}
        size="full"
        className={cn(
          // Turn the centered dialog into a bottom sheet.
          'overlay-sheet left-0 right-0 bottom-0 top-auto w-full max-w-none translate-x-0 translate-y-0 rounded-t-3xl border bg-background/98 p-4 shadow-2xl backdrop-blur',
          'max-h-[85svh] overflow-y-auto',
          'pb-[calc(1rem+env(safe-area-inset-bottom))]',
          'data-[open]:duration-300 data-[closed]:duration-200 data-[open]:slide-in-from-bottom-6 data-[closed]:slide-out-to-bottom-6',
          className,
        )}
        style={{
          ...style,
          transform:
            shouldEnableSwipe && translateY > 0 ? `translateY(${translateY}px)` : undefined,
          transition: shouldEnableSwipe && translateY > 0 ? 'none' : undefined,
        }}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchStart}
        {...props}
      >
        {showHandle && <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-muted" />}
        {children}
      </DialogContent>
    )
  },
)
BottomSheetContent.displayName = 'BottomSheetContent'

export type BottomSheetHeaderProps = React.HTMLAttributes<HTMLDivElement>

export const BottomSheetHeader = ({ className, ...props }: BottomSheetHeaderProps) => (
  <div
    className={cn(
      'flex items-center justify-between p-4 border-b border-[hsl(var(--border))]',
      className,
    )}
    {...props}
  />
)
BottomSheetHeader.displayName = 'BottomSheetHeader'

export type BottomSheetBodyProps = React.HTMLAttributes<HTMLDivElement>

export const BottomSheetBody = ({ className, ...props }: BottomSheetBodyProps) => (
  <div className={cn('flex-1 overflow-y-auto p-4', className)} {...props} />
)
BottomSheetBody.displayName = 'BottomSheetBody'
