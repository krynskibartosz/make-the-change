'use client'

import { ToggleGroup as ToggleGroupPrimitive } from '@base-ui/react/toggle-group'
import type { ComponentPropsWithoutRef, ElementRef } from 'react'
import { forwardRef } from 'react'
import { cn } from '../utils'

const ToggleGroup = forwardRef<
  ElementRef<typeof ToggleGroupPrimitive>,
  ComponentPropsWithoutRef<typeof ToggleGroupPrimitive>
>(({ className, ...props }, ref) => (
  <ToggleGroupPrimitive
    ref={ref}
    className={cn('inline-flex items-center rounded-md border border-border p-1', className)}
    {...props}
  />
))
ToggleGroup.displayName = 'ToggleGroup'

export { ToggleGroup }
