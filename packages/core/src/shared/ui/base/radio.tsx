'use client'

import { Radio as RadioPrimitive } from '@base-ui/react/radio'
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group'
import type { ComponentPropsWithoutRef, ElementRef } from 'react'
import { forwardRef } from 'react'
import { cn } from '../utils'

const RadioGroup = forwardRef<
  ElementRef<typeof RadioGroupPrimitive>,
  ComponentPropsWithoutRef<typeof RadioGroupPrimitive>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive ref={ref} className={cn('grid gap-2', className)} {...props} />
))
RadioGroup.displayName = 'RadioGroup'

const Radio = forwardRef<
  ElementRef<typeof RadioPrimitive.Root>,
  ComponentPropsWithoutRef<typeof RadioPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadioPrimitive.Root
    ref={ref}
    className={cn(
      'peer inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-primary text-primary shadow focus-visible:outline-none data-[focus-visible]:ring-2 data-[focus-visible]:ring-primary/60 disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    {...props}
  >
    <RadioPrimitive.Indicator className="h-2.5 w-2.5 rounded-full bg-current" />
  </RadioPrimitive.Root>
))
Radio.displayName = 'Radio'

const RadioIndicator = RadioPrimitive.Indicator

export { Radio, RadioIndicator, RadioGroup }
