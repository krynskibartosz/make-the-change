'use client'

import type { ForwardedRef, ReactElement } from 'react'
import { forwardRef } from 'react'
import {
  type Control,
  type FieldPath,
  type FieldValues,
  type RegisterOptions,
  useController,
  useFormContext,
} from 'react-hook-form'

import { Input, type InputProps } from '../base/input'

export type FormInputProps<TFieldValues extends FieldValues> = Omit<
  InputProps,
  'value' | 'onChange' | 'onBlur' | 'name' | 'defaultValue'
> & {
  name: FieldPath<TFieldValues>
  control?: Control<TFieldValues>
  rules?: RegisterOptions<TFieldValues>
  description?: string
  parseAsNumber?: boolean
  emptyValue?: number | null
  onBlur?: InputProps['onBlur']
  onChange?: InputProps['onChange']
}

const FormInputComponent = <TFieldValues extends FieldValues>(
  {
    name,
    control,
    rules,
    description,
    parseAsNumber,
    emptyValue,
    type,
    onBlur,
    onChange,
    id,
    ...inputProps
  }: FormInputProps<TFieldValues>,
  ref: ForwardedRef<HTMLInputElement>,
) => {
  const context = useFormContext<TFieldValues>()
  const { field, fieldState } = useController({
    control: control ?? context.control,
    name,
    rules,
  })

  const fieldId = id ?? `field-${name}`
  const errorMessage = fieldState.error?.message

  const resolvedValue =
    typeof field.value === 'string' || typeof field.value === 'number'
      ? field.value
      : field.value == null
        ? ''
        : String(field.value)

  const shouldParseNumber = parseAsNumber ?? type === 'number'

  return (
    <Input
      ref={ref}
      id={fieldId}
      name={field.name}
      type={type}
      value={resolvedValue}
      error={errorMessage}
      helpText={description}
      onBlur={(event) => {
        field.onBlur()
        onBlur?.(event)
      }}
      onChange={(event) => {
        const raw = event.target.value
        if (shouldParseNumber) {
          if (raw === '') {
            field.onChange(emptyValue ?? undefined)
          } else {
            const parsed = Number(raw)
            field.onChange(Number.isNaN(parsed) ? (emptyValue ?? undefined) : parsed)
          }
        } else {
          field.onChange(raw)
        }
        onChange?.(event)
      }}
      {...inputProps}
    />
  )
}

FormInputComponent.displayName = 'FormInput'

export const FormInput = forwardRef(FormInputComponent) as <TFieldValues extends FieldValues>(
  props: FormInputProps<TFieldValues> & { ref?: ForwardedRef<HTMLInputElement> },
) => ReactElement
