'use client'

import { type ComponentPropsWithoutRef, forwardRef, useId } from 'react'

import { cn } from '@/lib/utils/cn'

type InputProps = Omit<ComponentPropsWithoutRef<'input'>, 'id'> &
  Readonly<{
    error?: string
    help?: string
    id?: string
    label: string
  }>

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, error, help, id, label, ...props },
  ref,
) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const helpId = help ? `${inputId}-help` : undefined
  const errorId = error ? `${inputId}-error` : undefined
  const describedBy = [helpId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <label className="grid gap-2 text-sm font-semibold text-foreground" htmlFor={inputId}>
      <span>{label}</span>
      <input
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        className={cn(
          'min-h-[var(--size-input)] w-full rounded-[var(--radius-control)] border border-border bg-surface px-3 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary disabled:opacity-50',
          error && 'border-danger focus:border-danger',
          className,
        )}
        id={inputId}
        ref={ref}
        {...props}
      />
      {help ? (
        <span className="text-xs font-medium leading-5 text-muted-foreground" id={helpId}>
          {help}
        </span>
      ) : null}
      {error ? (
        <span className="text-xs font-semibold leading-5 text-danger" id={errorId}>
          {error}
        </span>
      ) : null}
    </label>
  )
})
