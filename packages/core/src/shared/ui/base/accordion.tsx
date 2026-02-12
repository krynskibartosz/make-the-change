'use client'

import { Accordion as AccordionPrimitive } from '@base-ui/react/accordion'
import { ChevronDown } from 'lucide-react'
import type { ComponentPropsWithoutRef, ElementRef } from 'react'
import { forwardRef } from 'react'
import { cn } from '../utils'

type AccordionProps = Omit<
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>,
  'value' | 'defaultValue' | 'multiple' | 'onValueChange'
> & {
  type?: 'single' | 'multiple'
  collapsible?: boolean
  value?: string | string[]
  defaultValue?: string | string[]
  onValueChange?: (value: string | string[]) => void
}

const toArrayValue = (value: AccordionProps['value']) => {
  if (value === undefined) return undefined
  if (Array.isArray(value)) return value
  return value ? [value] : []
}

const Accordion = forwardRef<ElementRef<typeof AccordionPrimitive.Root>, AccordionProps>(
  (
    { type = 'single', value, defaultValue, onValueChange, collapsible: _collapsible, ...props },
    ref,
  ) => (
    <AccordionPrimitive.Root
      ref={ref}
      defaultValue={toArrayValue(defaultValue)}
      multiple={type === 'multiple'}
      onValueChange={(nextValue) => {
        if (!onValueChange) return
        if (type === 'multiple') {
          onValueChange(nextValue as string[])
          return
        }

        onValueChange((nextValue[0] as string | undefined) ?? '')
      }}
      value={toArrayValue(value)}
      {...props}
    />
  ),
)
Accordion.displayName = 'Accordion'

const AccordionItem = forwardRef<
  ElementRef<typeof AccordionPrimitive.Item>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={cn('border-b', className)} {...props} />
))
AccordionItem.displayName = 'AccordionItem'

const AccordionTrigger = forwardRef<
  ElementRef<typeof AccordionPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'group flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline',
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[panel-open]:rotate-180 group-data-[open]:rotate-180" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = 'AccordionTrigger'

const AccordionContent = forwardRef<
  ElementRef<typeof AccordionPrimitive.Panel>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Panel>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Panel
    ref={ref}
    className={cn(
      'overflow-hidden text-sm data-[starting-style]:animate-in data-[ending-style]:animate-out',
      className,
    )}
    {...props}
  >
    <div className="pb-4 pt-0">{children}</div>
  </AccordionPrimitive.Panel>
))
AccordionContent.displayName = 'AccordionContent'

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
