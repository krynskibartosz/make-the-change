'use client'

import {
  type Control,
  type FieldPath,
  type FieldValues,
  type RegisterOptions,
  useController,
  useFormContext,
} from 'react-hook-form'

import { Field, FieldDescription, FieldError, FieldLabel } from '../base/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../base/select'
import { cn } from '../utils'

export type FormSelectOption = { value: string; label: string; disabled?: boolean }

export type FieldShellProps = {
  fieldName?: string
  label?: string
  description?: string
  className?: string
  required?: boolean
  error?: string
  fieldId?: string
}

export type FormSelectProps<TFieldValues extends FieldValues> = FieldShellProps & {
  name: FieldPath<TFieldValues>
  control?: Control<TFieldValues>
  rules?: RegisterOptions<TFieldValues>
  placeholder?: string
  options: FormSelectOption[]
  disabled?: boolean
}

export const FormSelect = <TFieldValues extends FieldValues>({
  name,
  control,
  rules,
  label,
  description,
  className,
  required,
  placeholder = 'Sélectionner...',
  options,
  disabled,
}: FormSelectProps<TFieldValues>) => {
  const context = useFormContext<TFieldValues>()
  const { field, fieldState } = useController({
    control: control ?? context.control,
    name,
    rules,
  })

  const fieldId = `field-${name}`
  const errorMessage = fieldState.error?.message
  const value =
    typeof field.value === 'string' || typeof field.value === 'number' ? String(field.value) : ''

  return (
    <Field className={cn('space-y-2', className)} name={String(name)}>
      {label && (
        <FieldLabel
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          htmlFor={fieldId}
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </FieldLabel>
      )}
      {description && (
        <FieldDescription className="text-sm text-muted-foreground">{description}</FieldDescription>
      )}
      <div className="relative">
        <Select
          disabled={disabled}
          value={value}
          onOpenChange={(open) => {
            if (!open) field.onBlur()
          }}
          onValueChange={(nextValue) => {
            field.onChange(nextValue)
          }}
        >
          <SelectTrigger
            aria-invalid={errorMessage ? 'true' : undefined}
            aria-required={required ? 'true' : undefined}
            id={fieldId}
            name={field.name}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} disabled={option.disabled} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {errorMessage && (
        <FieldError className="text-sm text-destructive" match={true}>
          {errorMessage}
        </FieldError>
      )}
    </Field>
  )
}
