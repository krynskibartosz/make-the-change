'use client'

import { PreviewCard as PreviewCardPrimitive } from '@base-ui/react/preview-card'
import type { ComponentPropsWithoutRef, ElementRef } from 'react'
import { forwardRef } from 'react'
import { cn } from '../utils'

const PreviewCard = PreviewCardPrimitive.Root
const PreviewCardTrigger = PreviewCardPrimitive.Trigger
const PreviewCardPortal = PreviewCardPrimitive.Portal

const PreviewCardContent = forwardRef<
  ElementRef<typeof PreviewCardPrimitive.Popup>,
  ComponentPropsWithoutRef<typeof PreviewCardPrimitive.Popup>
>(({ className, ...props }, ref) => (
  <PreviewCardPortal>
    <PreviewCardPrimitive.Positioner>
      <PreviewCardPrimitive.Popup
        ref={ref}
        className={cn(
          'z-[var(--z-overlay)] rounded-md border border-border bg-popover p-4 text-popover-foreground shadow-md',
          className,
        )}
        {...props}
      />
    </PreviewCardPrimitive.Positioner>
  </PreviewCardPortal>
))
PreviewCardContent.displayName = 'PreviewCardContent'

const PreviewCardArrow = PreviewCardPrimitive.Arrow
const PreviewCardBackdrop = PreviewCardPrimitive.Backdrop
const PreviewCardPositioner = PreviewCardPrimitive.Positioner
const PreviewCardViewport = PreviewCardPrimitive.Viewport

export {
  PreviewCard,
  PreviewCardTrigger,
  PreviewCardPortal,
  PreviewCardContent,
  PreviewCardArrow,
  PreviewCardBackdrop,
  PreviewCardPositioner,
  PreviewCardViewport,
}
