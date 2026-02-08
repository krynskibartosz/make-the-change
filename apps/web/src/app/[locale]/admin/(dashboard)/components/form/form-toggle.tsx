'use client'

import { useController, useFormContext } from 'react-hook-form'

export type FormToggleProps = {
  name: string
  label: string
  description?: string
  className?: string
  hideLabel?: boolean
}

export const FormToggle = ({
  name,
  label,
  description,
  className,
  hideLabel = false,
}: FormToggleProps) => {
  const { control } = useFormContext()
  const { field, fieldState } = useController({ control, name })
  const checked = Boolean(field.value)
  const errorMessage = fieldState.error?.message

  return (
    <div className="space-y-1">
      <div className="flex items-center space-x-2">
        <input
          aria-label={hideLabel ? label : undefined}
          checked={checked}
          className={`h-4 w-4 rounded border-input text-primary focus:ring-ring ${className}`}
          id={hideLabel ? undefined : label}
          type="checkbox"
          onBlur={field.onBlur}
          onChange={(e) => field.onChange(e.target.checked)}
        />
        <div className="grid gap-1.5 leading-none">
          {!hideLabel && (
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor={label}
            >
              {label}
            </label>
          )}
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
      </div>
      {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}
    </div>
  )
}
