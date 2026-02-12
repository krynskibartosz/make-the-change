'use client'

import { Progress as ProgressPrimitive } from '@base-ui/react/progress'
import type { ComponentPropsWithoutRef, ElementRef } from 'react'
import { forwardRef } from 'react'
import { cn } from '../utils/cn'

export interface ProgressProps extends ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  indicatorClassName?: string
}

export const Progress = forwardRef<ElementRef<typeof ProgressPrimitive.Root>, ProgressProps>(
  ({ className, indicatorClassName, value, max = 100, ...props }, ref) => {
    const clampedValue = typeof value === 'number' ? Math.min(Math.max(value, 0), max) : value

    return (
      <ProgressPrimitive.Root
        ref={ref}
        className={cn('relative h-2 w-full overflow-hidden rounded-full bg-secondary', className)}
        max={max}
        value={clampedValue}
        {...props}
      >
        <ProgressPrimitive.Track className="h-full w-full">
          <ProgressPrimitive.Indicator
            className={cn(
              'h-full bg-primary transition-all duration-300 ease-in-out',
              indicatorClassName,
            )}
          />
        </ProgressPrimitive.Track>
      </ProgressPrimitive.Root>
    )
  },
)

Progress.displayName = 'Progress'
