'use client'

import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip'
import type { ComponentPropsWithoutRef, ElementRef } from 'react'
import { forwardRef } from 'react'
import { cn } from '../utils'

const TooltipProvider = TooltipPrimitive.Provider
const Tooltip = TooltipPrimitive.Root
const TooltipTrigger = TooltipPrimitive.Trigger
const TooltipPortal = TooltipPrimitive.Portal

type TooltipContentProps = ComponentPropsWithoutRef<typeof TooltipPrimitive.Popup> & {
  sideOffset?: number
}

const TooltipContent = forwardRef<ElementRef<typeof TooltipPrimitive.Popup>, TooltipContentProps>(
  ({ className, sideOffset = 8, ...props }, ref) => (
    <TooltipPortal>
      <TooltipPrimitive.Positioner sideOffset={sideOffset}>
        <TooltipPrimitive.Popup
          ref={ref}
          className={cn(
            'z-[var(--z-overlay)] max-w-xs rounded-md border border-border bg-popover px-3 py-1.5 text-xs text-popover-foreground shadow-md data-[starting-style]:animate-in data-[ending-style]:animate-out',
            className,
          )}
          {...props}
        />
      </TooltipPrimitive.Positioner>
    </TooltipPortal>
  ),
)
TooltipContent.displayName = 'TooltipContent'

export { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent, TooltipPortal }
