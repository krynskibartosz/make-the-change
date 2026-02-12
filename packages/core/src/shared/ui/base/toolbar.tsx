'use client'

import { Toolbar as ToolbarPrimitive } from '@base-ui/react/toolbar'
import type { ComponentPropsWithoutRef, ElementRef } from 'react'
import { forwardRef } from 'react'
import { cn } from '../utils'

const Toolbar = forwardRef<
  ElementRef<typeof ToolbarPrimitive.Root>,
  ComponentPropsWithoutRef<typeof ToolbarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <ToolbarPrimitive.Root
    ref={ref}
    className={cn(
      'flex w-full items-center gap-1 rounded-md border border-border bg-background p-1',
      className,
    )}
    {...props}
  />
))
Toolbar.displayName = 'Toolbar'

const ToolbarGroup = forwardRef<
  ElementRef<typeof ToolbarPrimitive.Group>,
  ComponentPropsWithoutRef<typeof ToolbarPrimitive.Group>
>(({ className, ...props }, ref) => (
  <ToolbarPrimitive.Group
    ref={ref}
    className={cn('flex items-center gap-1', className)}
    {...props}
  />
))
ToolbarGroup.displayName = 'ToolbarGroup'

const ToolbarButton = forwardRef<
  ElementRef<typeof ToolbarPrimitive.Button>,
  ComponentPropsWithoutRef<typeof ToolbarPrimitive.Button>
>(({ className, ...props }, ref) => (
  <ToolbarPrimitive.Button
    ref={ref}
    className={cn(
      'inline-flex h-8 cursor-pointer items-center justify-center rounded px-2 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none data-[focus-visible]:ring-2 data-[focus-visible]:ring-primary/60 disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    {...props}
  />
))
ToolbarButton.displayName = 'ToolbarButton'

const ToolbarLink = forwardRef<
  ElementRef<typeof ToolbarPrimitive.Link>,
  ComponentPropsWithoutRef<typeof ToolbarPrimitive.Link>
>(({ className, ...props }, ref) => (
  <ToolbarPrimitive.Link
    ref={ref}
    className={cn(
      'inline-flex h-8 items-center justify-center rounded px-2 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none data-[focus-visible]:ring-2 data-[focus-visible]:ring-primary/60',
      className,
    )}
    {...props}
  />
))
ToolbarLink.displayName = 'ToolbarLink'

const ToolbarInput = forwardRef<
  ElementRef<typeof ToolbarPrimitive.Input>,
  ComponentPropsWithoutRef<typeof ToolbarPrimitive.Input>
>(({ className, ...props }, ref) => (
  <ToolbarPrimitive.Input
    ref={ref}
    className={cn(
      'h-8 rounded border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60',
      className,
    )}
    {...props}
  />
))
ToolbarInput.displayName = 'ToolbarInput'

const ToolbarSeparator = forwardRef<
  ElementRef<typeof ToolbarPrimitive.Separator>,
  ComponentPropsWithoutRef<typeof ToolbarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <ToolbarPrimitive.Separator
    ref={ref}
    className={cn('mx-1 h-6 w-px bg-border', className)}
    {...props}
  />
))
ToolbarSeparator.displayName = 'ToolbarSeparator'

export { Toolbar, ToolbarGroup, ToolbarButton, ToolbarLink, ToolbarInput, ToolbarSeparator }
