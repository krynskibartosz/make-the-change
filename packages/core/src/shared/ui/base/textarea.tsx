'use client'

import type { InputHTMLAttributes, ReactNode } from 'react'
import { forwardRef, useId, useState } from 'react'

import { cn } from '../utils'

export type TextAreaVariant = 'default' | 'outlined' | 'filled'

export type TextAreaProps = {
  label?: string
  error?: string
  helpText?: string
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
  variant?: TextAreaVariant
  size?: 'sm' | 'md' | 'lg'
  rows?: number
} & Omit<InputHTMLAttributes<HTMLTextAreaElement>, 'size'>

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      className,
      label,
      error,
      helpText,
      leadingIcon,
      trailingIcon,
      variant = 'default',
      size = 'md',
      required,
      id,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false)
    const [shakeAnimation, setShakeAnimation] = useState('')
    const generatedId = useId()
    const textAreaId = id ?? (label || error || helpText ? `textarea-${generatedId}` : undefined)
    const describedByBaseId = textAreaId ?? `textarea-${generatedId}`
    const ariaDescribedBy = error
      ? `${describedByBaseId}-error`
      : helpText
        ? `${describedByBaseId}-help`
        : undefined

    const handleErrorShake = () => {
      if (error) {
        setShakeAnimation('animate-shake')
        setTimeout(() => setShakeAnimation(''), 500)
      }
    }

    const sizeClasses = {
      sm: 'min-h-[80px] text-sm px-3 py-2',
      md: 'min-h-[100px] text-sm px-4 py-3',
      lg: 'min-h-[120px] text-base px-4 py-3',
    }

    const variantClasses = {
      default: 'bg-background/70 backdrop-blur-sm border shadow-sm',
      outlined: 'bg-transparent border-2 border-[hsl(var(--border))]',
      filled: 'bg-muted/70 backdrop-blur-sm border border-[hsl(var(--border)/0.7)] shadow-sm',
    }

    const hasTrailingAffordance = Boolean(trailingIcon) || Boolean(error)

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            className={cn(
              'flex items-center gap-1 text-sm font-medium transition-colors',
              error ? 'text-destructive' : 'text-muted-foreground',
            )}
            htmlFor={textAreaId}
          >
            {label}
            {required && <span className="text-destructive animate-pulse">*</span>}
          </label>
        )}

        <div
          className={cn(
            'relative flex items-start transition-all duration-300 rounded-xl',
            isFocused && 'ring-2 ring-primary/25 ring-offset-1 shadow-lg',
            error && 'ring-2 ring-destructive/25 ring-offset-1',
            shakeAnimation,
          )}
        >
          {leadingIcon && (
            <div className="absolute left-4 top-3 flex items-center text-muted-foreground/70">
              {leadingIcon}
            </div>
          )}

          <textarea
            ref={ref}
            aria-describedby={ariaDescribedBy}
            aria-invalid={error ? 'true' : undefined}
            className={cn(
              'flex w-full rounded-xl resize-y transition-all duration-300',
              variantClasses[variant],
              sizeClasses[size],
              'text-foreground placeholder:text-muted-foreground/60',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-1',
              'focus-visible:border-primary/70 focus-visible:shadow-md',
              'disabled:cursor-not-allowed disabled:opacity-50',
              leadingIcon && 'pl-12',
              hasTrailingAffordance && 'pr-12',
              error
                ? 'border-destructive bg-destructive/5 focus-visible:ring-destructive/30 focus-visible:border-destructive'
                : 'hover:border-[hsl(var(--border)/0.8)] hover:shadow-sm dark:hover:border-[hsl(var(--border))]',
              className,
            )}
            id={textAreaId}
            required={required}
            onBlur={() => setIsFocused(false)}
            onFocus={() => setIsFocused(true)}
            onChange={(e) => {
              handleErrorShake()
              props.onChange?.(e)
            }}
            {...props}
          />

          {trailingIcon && (
            <div className="absolute right-4 top-3 flex items-center gap-2">{trailingIcon}</div>
          )}
        </div>

        {(error ?? helpText) && (
          <p
            className={cn(
              'text-sm transition-colors',
              error ? 'text-destructive' : 'text-muted-foreground',
            )}
            id={ariaDescribedBy}
          >
            {error ?? helpText}
          </p>
        )}
      </div>
    )
  },
)

TextArea.displayName = 'TextArea'
