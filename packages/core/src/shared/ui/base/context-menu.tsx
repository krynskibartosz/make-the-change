'use client'

import { ContextMenu as ContextMenuPrimitive } from '@base-ui/react/context-menu'
import type { ComponentPropsWithoutRef, ElementRef } from 'react'
import { forwardRef } from 'react'
import { cn } from '../utils'

const ContextMenu = ContextMenuPrimitive.Root
const ContextMenuTrigger = ContextMenuPrimitive.Trigger

const ContextMenuContent = forwardRef<
  ElementRef<typeof ContextMenuPrimitive.Popup>,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Popup>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.Positioner>
      <ContextMenuPrimitive.Popup
        ref={ref}
        className={cn(
          'z-[var(--z-overlay)] min-w-[10rem] rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md',
          className,
        )}
        {...props}
      />
    </ContextMenuPrimitive.Positioner>
  </ContextMenuPrimitive.Portal>
))
ContextMenuContent.displayName = 'ContextMenuContent'

const ContextMenuItem = forwardRef<
  ElementRef<typeof ContextMenuPrimitive.Item>,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-muted data-[highlighted]:bg-muted',
      className,
    )}
    {...props}
  />
))
ContextMenuItem.displayName = 'ContextMenuItem'

const ContextMenuGroup = ContextMenuPrimitive.Group
const ContextMenuGroupLabel = ContextMenuPrimitive.GroupLabel
const ContextMenuCheckboxItem = ContextMenuPrimitive.CheckboxItem
const ContextMenuCheckboxItemIndicator = ContextMenuPrimitive.CheckboxItemIndicator
const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup
const ContextMenuRadioItem = ContextMenuPrimitive.RadioItem
const ContextMenuRadioItemIndicator = ContextMenuPrimitive.RadioItemIndicator
const ContextMenuSub = ContextMenuPrimitive.SubmenuRoot
const ContextMenuSubTrigger = ContextMenuPrimitive.SubmenuTrigger
const ContextMenuBackdrop = ContextMenuPrimitive.Backdrop
const ContextMenuPortal = ContextMenuPrimitive.Portal
const ContextMenuPositioner = ContextMenuPrimitive.Positioner
const ContextMenuArrow = ContextMenuPrimitive.Arrow
const ContextMenuSeparator = ContextMenuPrimitive.Separator

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuGroup,
  ContextMenuGroupLabel,
  ContextMenuCheckboxItem,
  ContextMenuCheckboxItemIndicator,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuRadioItemIndicator,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuBackdrop,
  ContextMenuPortal,
  ContextMenuPositioner,
  ContextMenuArrow,
  ContextMenuSeparator,
}
