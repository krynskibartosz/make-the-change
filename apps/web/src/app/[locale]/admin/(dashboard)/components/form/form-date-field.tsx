'use client'

import { Input } from '@make-the-change/core/ui'
import { type ForwardedRef, forwardRef } from 'react'
import { useController, useFormContext } from 'react-hook-form'
import { cn } from '@make-the-change/core/shared/utils'

// Helper function extracted to outer scope for better performance
const toErrorMessage = (u: unknown): string => {
  if (typeof u === 'string') return u
  if (typeof u === 'object' && u && 'message' in u) {
    const msg = (u as { message?: unknown }).message
    if (typeof msg === 'string') return msg
  }
  try {
    return JSON.stringify(u)
  } catch {
    return String(u)
  }
}

export type FormDateFieldProps = {
  name: string
  label?: string
  placeholder?: string
  required?: boolean
  className?: string
  min?: string
  max?: string
} & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange' | 'onBlur' | 'size' | 'type' | 'min' | 'max'
>

const FormDateFieldComponent = (
  { name, label, placeholder, required, className, min, max, ...props }: FormDateFieldProps,
  ref: ForwardedRef<HTMLInputElement>,
) => {
  const { control } = useFormContext()
  const { field, fieldState } = useController({ control, name })
  const value = typeof field.value === 'string' ? field.value : ''
  const errorMessage = fieldState.error ? toErrorMessage(fieldState.error) : undefined

  const handleChange = (s: string) => {
    field.onChange(s || undefined)
  }

  return (
    <div className="space-y-1">
      <Input
        ref={ref}
        max={max}
        min={min}
        placeholder={placeholder}
        type="date"
        value={value}
        className={cn(errorMessage && 'border-destructive focus:border-destructive', className)}
        onBlur={field.onBlur}
        onChange={(e) => handleChange(e.target.value)}
        {...props}
      />
      {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}
    </div>
  )
}

export const FormDateField = forwardRef(FormDateFieldComponent)
