'use client'

import { Separator as SeparatorPrimitive } from '@base-ui/react/separator'
import type { ComponentPropsWithoutRef, ElementRef } from 'react'
import { forwardRef } from 'react'
import { cn } from '../utils'

const Separator = forwardRef<
  ElementRef<typeof SeparatorPrimitive>,
  ComponentPropsWithoutRef<typeof SeparatorPrimitive>
>(({ className, orientation = 'horizontal', ...props }, ref) => (
  <SeparatorPrimitive
    ref={ref}
    className={cn(
      'shrink-0 bg-border',
      orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
      className,
    )}
    orientation={orientation}
    {...props}
  />
))
Separator.displayName = 'Separator'

export { Separator }
