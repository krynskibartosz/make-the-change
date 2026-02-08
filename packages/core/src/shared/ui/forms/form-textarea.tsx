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

import { TextArea, type TextAreaProps } from '../base/textarea'

export type FormTextAreaProps<TFieldValues extends FieldValues> = Omit<
  TextAreaProps,
  'value' | 'onChange' | 'onBlur' | 'name' | 'defaultValue'
> & {
  name: FieldPath<TFieldValues>
  control?: Control<TFieldValues>
  rules?: RegisterOptions<TFieldValues>
  description?: string
  onBlur?: TextAreaProps['onBlur']
  onChange?: TextAreaProps['onChange']
}

const FormTextAreaComponent = <TFieldValues extends FieldValues>(
  {
    name,
    control,
    rules,
    description,
    onBlur,
    onChange,
    id,
    ...textAreaProps
  }: FormTextAreaProps<TFieldValues>,
  ref: ForwardedRef<HTMLTextAreaElement>,
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

  return (
    <TextArea
      ref={ref}
      id={fieldId}
      name={field.name}
      value={resolvedValue}
      error={errorMessage}
      helpText={description}
      onBlur={(event) => {
        field.onBlur()
        onBlur?.(event)
      }}
      onChange={(event) => {
        field.onChange(event.target.value)
        onChange?.(event)
      }}
      {...textAreaProps}
    />
  )
}

FormTextAreaComponent.displayName = 'FormTextArea'

export const FormTextArea = forwardRef(FormTextAreaComponent) as <TFieldValues extends FieldValues>(
  props: FormTextAreaProps<TFieldValues> & { ref?: ForwardedRef<HTMLTextAreaElement> },
) => ReactElement
