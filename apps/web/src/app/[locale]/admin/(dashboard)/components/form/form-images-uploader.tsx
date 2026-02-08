'use client'

import {
  type Control,
  type FieldPath,
  type FieldValues,
  type RegisterOptions,
  useController,
  useFormContext,
} from 'react-hook-form'

import { ImageUploaderField } from '@/components/images/image-uploader'

export type FormImagesUploaderProps<TFieldValues extends FieldValues> = {
  name: FieldPath<TFieldValues>
  control?: Control<TFieldValues>
  rules?: RegisterOptions<TFieldValues>
  productId?: string
  multiple?: boolean
  disabled?: boolean
  width?: string
  height?: string
}

export const FormImagesUploader = <TFieldValues extends FieldValues>({
  name,
  control,
  rules,
  productId,
  multiple = true,
  disabled = false,
  width = 'w-full',
  height = 'h-48',
}: FormImagesUploaderProps<TFieldValues>) => {
  const context = useFormContext<TFieldValues>()
  const { field } = useController({
    control: control ?? context.control,
    name,
    rules,
  })

  const value = Array.isArray(field.value) ? field.value : []

  return (
    <ImageUploaderField
      disabled={disabled}
      height={height}
      multiple={multiple}
      productId={productId}
      width={width}
      field={{
        state: { value },
        handleChange: (updater) => {
          const next = typeof updater === 'function' ? updater(value) : updater
          field.onChange(next)
        },
      }}
      onImagesChange={(images) => field.onChange(images)}
    />
  )
}
