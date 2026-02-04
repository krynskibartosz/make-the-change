'use client'

import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox'
import { Check } from 'lucide-react'
import type { ComponentPropsWithoutRef, ElementRef, ForwardedRef } from 'react'
import { forwardRef, useId } from 'react'

const Checkbox = forwardRef<
  ElementRef<typeof CheckboxPrimitive.Root>,
  ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref: ForwardedRef<ElementRef<typeof CheckboxPrimitive.Root>>) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={`peer h-5 w-5 shrink-0 rounded-[var(--radius-control)] border-2 border-[hsl(var(--border))] bg-background transition-all duration-[var(--transition-normal)] ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform cursor-pointer hover:border-primary/60 hover:bg-primary/5 hover:scale-105 hover:shadow-sm hover:shadow-primary/20 data-[focus-visible]:outline-none data-[focus-visible]:ring-2 data-[focus-visible]:ring-primary/60 data-[focus-visible]:ring-offset-2 data-[focus-visible]:ring-offset-background data-[focus-visible]:border-primary/70 data-[checked]:bg-primary data-[checked]:border-primary data-[checked]:text-primary-foreground data-[checked]:shadow-sm data-[checked]:hover:bg-primary/90 data-[checked]:hover:scale-105 data-[indeterminate]:bg-primary data-[indeterminate]:border-primary data-[indeterminate]:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-background${
      className ? ` ${className}` : ''
    }`}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current data-[checked]:animate-in data-[checked]:zoom-in-75 data-[checked]:duration-200 data-[indeterminate]:animate-in data-[indeterminate]:zoom-in-75 data-[indeterminate]:duration-200">
      <Check className="h-3.5 w-3.5 font-bold drop-shadow-sm" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = 'Checkbox'

type CheckboxWithLabelProps = {
  label?: string
  description?: string
  error?: string
} & ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>

const CheckboxWithLabel = forwardRef<
  ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxWithLabelProps
>(
  (
    { className, label, description, error, id, ...props },
    ref: ForwardedRef<ElementRef<typeof CheckboxPrimitive.Root>>,
  ) => {
    const reactId = useId()
    const checkboxId = id ?? `checkbox-${reactId}`

    return (
      <div className="space-y-[var(--density-spacing-sm)]">
        <div className="flex items-center gap-[var(--density-spacing-sm)] group">
          <Checkbox
            ref={ref}
            id={checkboxId}
            className={`group-hover:border-primary/70 group-hover:bg-primary/8 group-hover:scale-105 group-hover:shadow-md group-hover:shadow-primary/25${
              className ? ` ${className}` : ''
            }`}
            {...props}
          />
          {label && (
            <label
              htmlFor={checkboxId}
              className="text-sm font-medium text-foreground leading-relaxed tracking-wide cursor-pointer select-none transition-all duration-[var(--transition-normal)] group-hover:text-primary group-hover:scale-[1.02] peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
            >
              {label}
            </label>
          )}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground/80 leading-relaxed tracking-wide ml-7">
            {description}
          </p>
        )}
        {error && (
          <p className="text-xs text-destructive font-medium leading-tight ml-7 flex items-center gap-1">
            <span className="inline-block w-1 h-1 bg-destructive rounded-full" />
            {error}
          </p>
        )}
      </div>
    )
  },
)
CheckboxWithLabel.displayName = 'CheckboxWithLabel'

export { Checkbox, CheckboxWithLabel }
