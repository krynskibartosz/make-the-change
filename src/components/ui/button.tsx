'use client'

import { Button as BaseUIButton } from '@base-ui/react'
import { type ComponentPropsWithoutRef, forwardRef, type ReactNode } from 'react'

import { cn } from '@/lib/utils/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'primary' | 'secondary' | 'compact'

type ButtonProps = Omit<ComponentPropsWithoutRef<'button'>, 'children'> &
  Readonly<{
    children: ReactNode
    fullWidth?: boolean
    leftIcon?: ReactNode
    rightIcon?: ReactNode
    size?: ButtonSize
    variant?: ButtonVariant
  }>

const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'border-transparent bg-primary text-primary-foreground shadow-[var(--shadow-elevated)]',
  secondary: 'border-border bg-surface-elevated text-foreground',
  ghost: 'border-transparent bg-transparent text-foreground',
  danger: 'border-transparent bg-danger text-danger-foreground',
}

const buttonSizes: Record<ButtonSize, string> = {
  primary: 'min-h-[var(--size-primary-button)] px-5 text-base',
  secondary: 'min-h-[var(--size-secondary-button)] px-4 text-sm',
  compact: 'min-h-[var(--size-choice)] px-3 text-sm',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    className,
    fullWidth = false,
    leftIcon,
    rightIcon,
    size = 'primary',
    type = 'button',
    variant = 'primary',
    ...props
  },
  ref,
) {
  return (
    <BaseUIButton
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-[var(--radius-control)] border font-semibold transition-colors disabled:opacity-50',
        buttonVariants[variant],
        buttonSizes[size],
        fullWidth && 'w-full',
        className,
      )}
      ref={ref}
      type={type}
      {...props}
    >
      {leftIcon ? (
        <span className="flex size-5 items-center justify-center">{leftIcon}</span>
      ) : null}
      <span>{children}</span>
      {rightIcon ? (
        <span className="flex size-5 items-center justify-center">{rightIcon}</span>
      ) : null}
    </BaseUIButton>
  )
})

type IconButtonProps = Omit<ComponentPropsWithoutRef<'button'>, 'aria-label'> &
  Readonly<{
    'aria-label': string
    variant?: Exclude<ButtonVariant, 'primary'> | 'primary'
  }>

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { children, className, type = 'button', variant = 'secondary', ...props },
  ref,
) {
  return (
    <BaseUIButton
      className={cn(
        'inline-flex size-[var(--size-icon-button)] shrink-0 items-center justify-center rounded-[var(--radius-control)] border transition-colors disabled:opacity-50',
        buttonVariants[variant],
        className,
      )}
      ref={ref}
      type={type}
      {...props}
    >
      {children}
    </BaseUIButton>
  )
})
