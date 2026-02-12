'use client'

import { CheckboxGroup as CheckboxGroupPrimitive } from '@base-ui/react/checkbox-group'
import type { ComponentPropsWithoutRef, ElementRef } from 'react'
import { forwardRef } from 'react'
import { cn } from '../utils'

const CheckboxGroup = forwardRef<
  ElementRef<typeof CheckboxGroupPrimitive>,
  ComponentPropsWithoutRef<typeof CheckboxGroupPrimitive>
>(({ className, ...props }, ref) => (
  <CheckboxGroupPrimitive ref={ref} className={cn('grid gap-2', className)} {...props} />
))
CheckboxGroup.displayName = 'CheckboxGroup'

export { CheckboxGroup }
