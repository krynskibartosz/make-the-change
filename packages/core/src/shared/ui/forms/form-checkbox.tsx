'use client'

import {
  type Control,
  type FieldPath,
  type FieldValues,
  type RegisterOptions,
  useController,
  useFormContext,
} from 'react-hook-form'

import { Badge } from '../base/badge'
import { Checkbox } from '../base/checkbox'
import { Field, FieldDescription, FieldError, FieldLabel } from '../base/field'
import { cn } from '../utils'

export type FormCheckboxProps<TFieldValues extends FieldValues> = {
  name: FieldPath<TFieldValues>
  control?: Control<TFieldValues>
  rules?: RegisterOptions<TFieldValues>
  label: string
  description?: string
  trueBadge?: string
  falseBadge?: string
  className?: string
}

export const FormCheckbox = <TFieldValues extends FieldValues>({
  name,
  control,
  rules,
  label,
  description,
  trueBadge,
  falseBadge,
  className,
}: FormCheckboxProps<TFieldValues>) => {
  const context = useFormContext<TFieldValues>()
  const { field, fieldState } = useController({
    control: control ?? context.control,
    name,
    rules,
  })

  const fieldId = `field-${String(name)}`
  const errorMessage = fieldState.error?.message
  const checked = Boolean(field.value)

  return (
    <Field className={cn('space-y-2', className)} name={String(name)}>
      <div className="flex items-center gap-3 cursor-pointer p-2 rounded-md hover:bg-muted/50 transition-colors">
        <Checkbox
          aria-invalid={errorMessage ? 'true' : undefined}
          checked={checked}
          id={fieldId}
          name={field.name}
          onBlur={field.onBlur}
          onCheckedChange={(next) => field.onChange(Boolean(next))}
        />
        <div className="flex-1">
          <FieldLabel className="text-sm font-medium text-foreground cursor-pointer" htmlFor={fieldId}>
            {label}
          </FieldLabel>
          {description && (
            <FieldDescription className="text-xs text-muted-foreground">{description}</FieldDescription>
          )}
        </div>
        {checked && trueBadge && <Badge variant="success">{trueBadge}</Badge>}
        {!checked && falseBadge && <Badge variant="secondary">{falseBadge}</Badge>}
      </div>

      {errorMessage && (
        <FieldError className="text-xs text-destructive" match={true}>
          {errorMessage}
        </FieldError>
      )}
    </Field>
  )
}
