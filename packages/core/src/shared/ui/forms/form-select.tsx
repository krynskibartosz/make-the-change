'use client'

import {
  type Control,
  type FieldPath,
  type FieldValues,
  type RegisterOptions,
  useController,
  useFormContext,
} from 'react-hook-form'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../base/select'
import { FieldShell, type FieldShellProps } from './field-shell'

export type FormSelectOption = { value: string; label: string; disabled?: boolean }

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
    <FieldShell
      className={className}
      description={description}
      error={errorMessage}
      fieldId={fieldId}
      label={label}
      required={required}
    >
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
        <SelectTrigger id={fieldId} name={field.name}>
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
    </FieldShell>
  )
}
