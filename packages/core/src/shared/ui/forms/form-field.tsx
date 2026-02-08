'use client'

import type { ReactNode } from 'react'
import {
  type Control,
  type ControllerFieldState,
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
  type RegisterOptions,
  useController,
  useFormContext,
} from 'react-hook-form'

export type FormFieldProps<TFieldValues extends FieldValues> = {
  name: FieldPath<TFieldValues>
  control?: Control<TFieldValues>
  rules?: RegisterOptions<TFieldValues>
  shouldUnregister?: boolean
  children: (
    field: ControllerRenderProps<TFieldValues, FieldPath<TFieldValues>>,
    fieldState: ControllerFieldState,
  ) => ReactNode
}

export const FormField = <TFieldValues extends FieldValues>({
  name,
  control,
  rules,
  shouldUnregister,
  children,
}: FormFieldProps<TFieldValues>) => {
  const context = useFormContext<TFieldValues>()
  const { field, fieldState } = useController({
    control: control ?? context.control,
    name,
    rules,
    shouldUnregister,
  })

  return <>{children(field, fieldState)}</>
}
