'use client'

import { Collapsible as CollapsiblePrimitive } from '@base-ui/react/collapsible'
import type { ComponentPropsWithoutRef, ElementRef } from 'react'
import { forwardRef } from 'react'
import { cn } from '../utils'

const Collapsible = CollapsiblePrimitive.Root

const CollapsibleTrigger = forwardRef<
  ElementRef<typeof CollapsiblePrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <CollapsiblePrimitive.Trigger ref={ref} className={cn(className)} {...props} />
))
CollapsibleTrigger.displayName = 'CollapsibleTrigger'

const CollapsibleContent = forwardRef<
  ElementRef<typeof CollapsiblePrimitive.Panel>,
  ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Panel>
>(({ className, ...props }, ref) => (
  <CollapsiblePrimitive.Panel ref={ref} className={cn(className)} {...props} />
))
CollapsibleContent.displayName = 'CollapsibleContent'

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
