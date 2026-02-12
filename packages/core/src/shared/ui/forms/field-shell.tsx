'use client'

import type { FC, ReactNode } from 'react'
import { useId } from 'react'

import { Field, FieldDescription, FieldError, FieldLabel } from '../base/field'
import { cn } from '../utils'

export type FieldShellProps = {
  fieldName?: string
  label?: string
  description?: string
  className?: string
  required?: boolean
  children?: ReactNode
  error?: string
  isValidating?: boolean
  validatingText?: string
  fieldId?: string
}

export const FieldShell: FC<FieldShellProps> = ({
  fieldName,
  label,
  description,
  className,
  required = false,
  children,
  error,
  isValidating = false,
  validatingText = 'Validation en cours...',
  fieldId,
}) => {
  const generatedId = useId()
  const resolvedFieldId = fieldId ?? `field-${generatedId.replace(/:/g, '')}`
  const resolvedFieldName = fieldName ?? resolvedFieldId

  return (
    <Field className={cn('space-y-2', className)} name={resolvedFieldName}>
      {label && (
        <FieldLabel
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          htmlFor={resolvedFieldId}
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </FieldLabel>
      )}

      {description && <FieldDescription className="text-sm text-muted-foreground">{description}</FieldDescription>}

      <div className="relative">{children}</div>

      {error && (
        <FieldError className="text-sm text-destructive" match={true}>
          {error}
        </FieldError>
      )}

      {isValidating && (
        <FieldDescription className="text-sm text-muted-foreground">{validatingText}</FieldDescription>
      )}
    </Field>
  )
}

FieldShell.displayName = 'FieldShell'
