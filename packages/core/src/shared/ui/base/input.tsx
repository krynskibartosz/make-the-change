'use client'

import { Eye, EyeOff } from 'lucide-react'
import type { ForwardedRef, InputHTMLAttributes, ReactNode } from 'react'
import { forwardRef, useId, useState } from 'react'
import { cn } from '../utils'

export type InputVariant = 'default' | 'outlined' | 'filled'

export type InputProps = {
  label?: string
  error?: string
  helpText?: string
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
  showPasswordToggle?: boolean
  variant?: InputVariant
  size?: 'sm' | 'md' | 'lg'
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      label,
      error,
      helpText,
      leadingIcon,
      trailingIcon,
      showPasswordToggle = false,
      variant = 'default',
      size = 'md',
      required,
      ...props
    },
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    const [isFocused, setIsFocused] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [shakeAnimation, setShakeAnimation] = useState('')
    const inputId = useId()
    const ariaDescribedBy = error ? `${inputId}-error` : helpText ? `${inputId}-help` : undefined

    const inputType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type

    const handleErrorShake = () => {
      if (error) {
        setShakeAnimation('animate-shake')
        setTimeout(() => setShakeAnimation(''), 500)
      }
    }

    const sizeClasses = {
      sm: 'h-9 text-sm px-3',
      md: 'h-11 text-sm px-4',
      lg: 'h-13 text-base px-4',
    }

    const variantClasses = {
      default:
        'bg-background/70 backdrop-blur-sm border border-[hsl(var(--border)/0.8)] shadow-sm dark:dark:bg-background/90',
      outlined: 'bg-transparent border-2 dark:border-[hsl(var(--border)/0.8)]',
      filled:
        'bg-muted/70 backdrop-blur-sm border border-[hsl(var(--border)/0.7)] shadow-sm dark:bg-muted/50 dark:border-[hsl(var(--border))]',
    }

    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'flex items-center gap-1 text-sm font-medium transition-colors',
              error ? 'text-destructive' : 'text-muted-foreground dark:text-foreground/80',
            )}
          >
            {label}
            {required && <span className="text-destructive animate-pulse">*</span>}
          </label>
        )}

        <div
          className={cn(
            'relative flex items-center transition-all duration-300 rounded-2xl',
            isFocused && 'ring-2 ring-primary/25 ring-offset-1 shadow-lg',
            error && 'ring-2 ring-destructive/25 ring-offset-1',
            shakeAnimation,
          )}
        >
          {leadingIcon && (
            <div className="absolute left-4 flex items-center text-muted-foreground/70 z-10 pointer-events-none">
              {leadingIcon}
            </div>
          )}

          <input
            ref={ref}
            aria-describedby={ariaDescribedBy}
            aria-invalid={error ? 'true' : undefined}
            id={inputId}
            type={inputType}
            required={required}
            className={cn(
              'flex w-full rounded-2xl transition-all duration-300',
              variantClasses[variant],
              sizeClasses[size],
              'text-foreground placeholder:text-muted-foreground/60',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-1',
              'focus-visible:border-primary/70 focus-visible:shadow-md',
              'disabled:cursor-not-allowed disabled:opacity-50',
              leadingIcon && 'pl-12',
              (trailingIcon ?? (showPasswordToggle && type === 'password') ?? error) && 'pr-12',
              error
                ? 'border-destructive bg-destructive/5 focus-visible:ring-destructive/30 focus-visible:border-destructive dark:bg-destructive/10'
                : 'hover:hover:shadow-sm dark:hover:border-[hsl(var(--border)/0.9)] dark:hover:bg-background/95',
              className,
            )}
            style={{
              WebkitTextFillColor: 'var(--foreground)',
              transition: 'background-color 5000s ease-in-out 0s',
            }}
            onBlur={() => setIsFocused(false)}
            onFocus={() => setIsFocused(true)}
            onChange={(e) => {
              handleErrorShake()
              props.onChange?.(e)
            }}
            {...props}
          />

          {(trailingIcon ?? (showPasswordToggle && type === 'password')) && (
            <div className="absolute right-4 flex items-center gap-2">
              {trailingIcon}
              {showPasswordToggle && type === 'password' && (
                <button
                  className="text-muted-foreground/70 cursor-pointer hover:text-foreground transition-colors p-1 rounded-lg hover:bg-muted/50"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              )}
            </div>
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

const PasswordInput = forwardRef<HTMLInputElement, Omit<InputProps, 'type' | 'showPasswordToggle'>>(
  (props, ref: ForwardedRef<HTMLInputElement>) => (
    <Input showPasswordToggle type="password" {...props} ref={ref} />
  ),
)

PasswordInput.displayName = 'PasswordInput'
Input.displayName = 'Input'

export { Input, PasswordInput }
