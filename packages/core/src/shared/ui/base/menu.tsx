'use client'

import { Menu as MenuPrimitive } from '@base-ui/react/menu'
import type { ComponentPropsWithoutRef, ElementRef } from 'react'
import { forwardRef } from 'react'
import { cn } from '../utils'

const Menu = MenuPrimitive.Root
const MenuTrigger = MenuPrimitive.Trigger

const MenuContent = forwardRef<
  ElementRef<typeof MenuPrimitive.Popup>,
  ComponentPropsWithoutRef<typeof MenuPrimitive.Popup>
>(({ className, ...props }, ref) => (
  <MenuPrimitive.Portal>
    <MenuPrimitive.Positioner>
      <MenuPrimitive.Popup
        ref={ref}
        className={cn(
          'z-[var(--z-overlay)] min-w-[10rem] rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md',
          className,
        )}
        {...props}
      />
    </MenuPrimitive.Positioner>
  </MenuPrimitive.Portal>
))
MenuContent.displayName = 'MenuContent'

const MenuItem = forwardRef<
  ElementRef<typeof MenuPrimitive.Item>,
  ComponentPropsWithoutRef<typeof MenuPrimitive.Item>
>(({ className, ...props }, ref) => (
  <MenuPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-muted data-[highlighted]:bg-muted',
      className,
    )}
    {...props}
  />
))
MenuItem.displayName = 'MenuItem'

const MenuArrow = MenuPrimitive.Arrow
const MenuBackdrop = MenuPrimitive.Backdrop
const MenuPortal = MenuPrimitive.Portal
const MenuPositioner = MenuPrimitive.Positioner
const MenuGroup = MenuPrimitive.Group
const MenuGroupLabel = MenuPrimitive.GroupLabel
const MenuCheckboxItem = MenuPrimitive.CheckboxItem
const MenuCheckboxItemIndicator = MenuPrimitive.CheckboxItemIndicator
const MenuRadioGroup = MenuPrimitive.RadioGroup
const MenuRadioItem = MenuPrimitive.RadioItem
const MenuRadioItemIndicator = MenuPrimitive.RadioItemIndicator
const MenuSub = MenuPrimitive.SubmenuRoot
const MenuSubTrigger = MenuPrimitive.SubmenuTrigger
const MenuSeparator = MenuPrimitive.Separator

export {
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuArrow,
  MenuBackdrop,
  MenuPortal,
  MenuPositioner,
  MenuGroup,
  MenuGroupLabel,
  MenuCheckboxItem,
  MenuCheckboxItemIndicator,
  MenuRadioGroup,
  MenuRadioItem,
  MenuRadioItemIndicator,
  MenuSub,
  MenuSubTrigger,
  MenuSeparator,
}
