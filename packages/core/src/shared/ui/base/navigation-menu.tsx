'use client'

import { NavigationMenu as NavigationMenuPrimitive } from '@base-ui/react/navigation-menu'
import type { ComponentPropsWithoutRef, ElementRef } from 'react'
import { forwardRef } from 'react'
import { cn } from '../utils'

const NavigationMenu = NavigationMenuPrimitive.Root

const NavigationMenuList = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.List>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn('flex list-none items-center gap-1', className)}
    {...props}
    aria-orientation={undefined}
  />
))
NavigationMenuList.displayName = 'NavigationMenuList'

const NavigationMenuItem = NavigationMenuPrimitive.Item

const NavigationMenuTrigger = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none data-[focus-visible]:ring-2 data-[focus-visible]:ring-primary/60',
      className,
    )}
    {...props}
  />
))
NavigationMenuTrigger.displayName = 'NavigationMenuTrigger'

const NavigationMenuContent = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.Content>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(
      'z-[var(--z-overlay)] rounded-md border border-border bg-popover p-4 text-popover-foreground shadow-md',
      className,
    )}
    {...props}
  />
))
NavigationMenuContent.displayName = 'NavigationMenuContent'

const NavigationMenuLink = NavigationMenuPrimitive.Link
const NavigationMenuPortal = NavigationMenuPrimitive.Portal
const NavigationMenuPositioner = NavigationMenuPrimitive.Positioner
const NavigationMenuViewport = NavigationMenuPrimitive.Viewport
const NavigationMenuBackdrop = NavigationMenuPrimitive.Backdrop
const NavigationMenuPopup = NavigationMenuPrimitive.Popup
const NavigationMenuArrow = NavigationMenuPrimitive.Arrow
const NavigationMenuIcon = NavigationMenuPrimitive.Icon

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuPortal,
  NavigationMenuPositioner,
  NavigationMenuViewport,
  NavigationMenuBackdrop,
  NavigationMenuPopup,
  NavigationMenuArrow,
  NavigationMenuIcon,
}
