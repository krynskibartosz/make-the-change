'use client'

import { Field } from '@base-ui/react'
import { type ComponentPropsWithoutRef, forwardRef } from 'react'

import { cn } from '@/lib/utils/cn'

type TextareaProps = Omit<ComponentPropsWithoutRef<'textarea'>, 'id'> &
  Readonly<{
    error?: string
    help?: string
    id?: string
    label: string
  }>

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, error, help, id, label, ...props },
  ref,
) {
  return (
    <Field.Root
      className="grid gap-2 text-sm font-semibold text-foreground"
      id={id}
      invalid={!!error}
    >
      <Field.Label>{label}</Field.Label>
      <Field.Control
        render={<textarea />}
        className={cn(
          'min-h-[var(--size-textarea)] w-full resize-y rounded-[var(--radius-control)] border border-border bg-surface px-3 py-3 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary disabled:opacity-50',
          error && 'border-danger focus:border-danger',
          className,
        )}
        ref={ref}
        {...props}
      />
      {help ? (
        <Field.Description className="text-xs font-medium leading-5 text-muted-foreground">
          {help}
        </Field.Description>
      ) : null}
      {error ? (
        <Field.Error className="text-xs font-semibold leading-5 text-danger" forceMatch>
          {error}
        </Field.Error>
      ) : null}
    </Field.Root>
  )
})
