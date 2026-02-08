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
  const { field } = useController({
    control: control ?? context.control,
    name,
    rules,
  })

  const checked = Boolean(field.value)

  return (
    <label
      className={`flex items-center gap-3 cursor-pointer p-2 rounded-md hover:bg-muted/50 transition-colors${
        className ? ` ${className}` : ''
      }`}
    >
      <Checkbox
        checked={checked}
        id={field.name}
        onBlur={field.onBlur}
        onCheckedChange={(next) => field.onChange(Boolean(next))}
      />
      <div className="flex-1">
        <span className="text-sm font-medium text-foreground">{label}</span>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      {checked && trueBadge && <Badge variant="success">{trueBadge}</Badge>}
      {!checked && falseBadge && <Badge variant="secondary">{falseBadge}</Badge>}
    </label>
  )
}
