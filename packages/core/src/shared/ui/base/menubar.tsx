'use client'

import { Menubar as MenubarPrimitive } from '@base-ui/react/menubar'
import type { ComponentPropsWithoutRef, ElementRef } from 'react'
import { forwardRef } from 'react'
import { cn } from '../utils'

const Menubar = forwardRef<
  ElementRef<typeof MenubarPrimitive>,
  ComponentPropsWithoutRef<typeof MenubarPrimitive>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive
    ref={ref}
    className={cn('flex items-center gap-1 rounded-md border border-border p-1', className)}
    {...props}
  />
))
Menubar.displayName = 'Menubar'

export { Menubar }
