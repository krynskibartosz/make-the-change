import { zodResolver } from '@hookform/resolvers/zod'
import { type FieldValues, type UseFormProps, useForm } from 'react-hook-form'
import type { ZodTypeAny } from 'zod'

import { useToast } from '@/components/ui/use-toast'

type UseFormWithToastOptions<TData extends FieldValues> = UseFormProps<TData> & {
  schema?: ZodTypeAny
  toasts?: {
    success?: { title: string; description: string }
    error?: { title: string; description: string }
  }
  onSubmit?: (value: TData) => unknown | Promise<unknown>
}

export function useFormWithToast<TData extends FieldValues>(
  options: UseFormWithToastOptions<TData>,
) {
  const { toast } = useToast()
  const { onSubmit, toasts, schema, ...formOptions } = options

  const form = useForm<TData>({
    mode: formOptions.mode ?? 'onChange',
    ...formOptions,
    resolver: schema ? zodResolver(schema) : formOptions.resolver,
  })

  const handleSubmit = form.handleSubmit(async (value) => {
    try {
      if (onSubmit) {
        await onSubmit(value)
      }

      if (toasts?.success) {
        toast({
          title: toasts.success.title,
          description: toasts.success.description,
          variant: 'success',
        })
      }
    } catch (error) {
      if (toasts?.error) {
        toast({
          title: toasts.error.title,
          description: toasts.error.description,
          variant: 'destructive',
        })
      }
      console.error(error)
    }
  })

  return {
    form,
    handleSubmit,
    isSubmitting: form.formState.isSubmitting,
  }
}
