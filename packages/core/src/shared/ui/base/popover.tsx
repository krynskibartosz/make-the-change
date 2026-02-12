'use client'

import { Popover as PopoverPrimitive } from '@base-ui/react/popover'
import type { ComponentPropsWithoutRef, ElementRef } from 'react'
import { forwardRef } from 'react'
import { cn } from '../utils'

const Popover = PopoverPrimitive.Root
const PopoverTrigger = PopoverPrimitive.Trigger
const PopoverPortal = PopoverPrimitive.Portal

const PopoverContent = forwardRef<
  ElementRef<typeof PopoverPrimitive.Popup>,
  ComponentPropsWithoutRef<typeof PopoverPrimitive.Popup>
>(({ className, ...props }, ref) => (
  <PopoverPortal>
    <PopoverPrimitive.Positioner>
      <PopoverPrimitive.Popup
        ref={ref}
        className={cn(
          'z-[var(--z-overlay)] rounded-md border border-border bg-popover p-4 text-popover-foreground shadow-md',
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Positioner>
  </PopoverPortal>
))
PopoverContent.displayName = 'PopoverContent'

const PopoverArrow = PopoverPrimitive.Arrow
const PopoverBackdrop = PopoverPrimitive.Backdrop
const PopoverPositioner = PopoverPrimitive.Positioner
const PopoverTitle = PopoverPrimitive.Title
const PopoverDescription = PopoverPrimitive.Description
const PopoverClose = PopoverPrimitive.Close
const PopoverViewport = PopoverPrimitive.Viewport

export {
  Popover,
  PopoverTrigger,
  PopoverPortal,
  PopoverContent,
  PopoverArrow,
  PopoverBackdrop,
  PopoverPositioner,
  PopoverTitle,
  PopoverDescription,
  PopoverClose,
  PopoverViewport,
}
