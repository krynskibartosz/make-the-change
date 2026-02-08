'use client'

import { Input } from '@make-the-change/core/ui'
import { type ForwardedRef, forwardRef } from 'react'
import { useController, useFormContext } from 'react-hook-form'
import { cn } from '@make-the-change/core/shared/utils'

export type FormNumberFieldProps = {
  name: string
  label?: string
  placeholder?: string
  required?: boolean
  className?: string
  kind?: 'int' | 'float'
  emptyValue?: number | null | undefined
  step?: number | string
} & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange' | 'onBlur' | 'size' | 'type' | 'step'
>

const FormNumberFieldComponent = (
  {
    name,
    label,
    placeholder,
    required,
    className,
    kind = 'int',
    emptyValue,
    step,
    ...props
  }: FormNumberFieldProps,
  ref: ForwardedRef<HTMLInputElement>,
) => {
  const { control } = useFormContext()
  const { field, fieldState } = useController({ control, name })

  const rawValue = field.value as number | null | undefined
  const value = rawValue === null || rawValue === undefined ? '' : String(rawValue)
  const errorMessage = fieldState.error?.message

  const handleChange = (s: string) => {
    if (s === '') {
      field.onChange(emptyValue)
      return
    }
    if (kind === 'float') {
      const n = Number.parseFloat(s)
      field.onChange(Number.isNaN(n) ? emptyValue : n)
    } else {
      const n = Number.parseInt(s, 10)
      field.onChange(Number.isNaN(n) ? emptyValue : n)
    }
  }

  return (
    <div className="space-y-1">
      {/* label non rendu ici par défaut, DetailView gère l'affichage du label */}
      <Input
        ref={ref}
        placeholder={placeholder}
        step={step}
        type="number"
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

export const FormNumberField = forwardRef(FormNumberFieldComponent)
