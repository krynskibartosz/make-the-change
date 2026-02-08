'use client'

import type { FC, ReactNode } from 'react'

import { cn } from '../utils'

export type FieldShellProps = {
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
  label,
  description,
  className,
  required = false,
  children,
  error,
  isValidating = false,
  validatingText = 'Validation en cours...',
  fieldId,
}) => (
  <div className={cn('space-y-2', className)}>
    {label && (
      <label
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        htmlFor={fieldId}
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
    )}

    {description && <p className="text-sm text-muted-foreground">{description}</p>}

    <div className="relative">{children}</div>

    {error && (
      <div className="text-sm text-destructive">
        <p>{error}</p>
      </div>
    )}

    {isValidating && <p className="text-sm text-muted-foreground">{validatingText}</p>}
  </div>
)

FieldShell.displayName = 'FieldShell'
