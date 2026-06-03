'use client'

import { Eye, EyeOff } from 'lucide-react'
import { createContext, forwardRef, useContext, useState, type ReactNode } from 'react'
import { cn } from '../utils'
import { Input, type InputProps } from './input'

const PasswordVisibilityContext = createContext<{
  visible: boolean
  toggle: () => void
} | null>(null)

export type PasswordInputFieldProps = {
  children: ReactNode
  className?: string
}

/**
 * Container that manages password visibility state and provides positioning for the input + toggle button.
 *
 * Usage with Field composition:
 *   <Field name="password">
 *     <FieldLabel>Password</FieldLabel>
 *     <PasswordInputField>
 *       <FieldControl render={<PasswordInput />} required minLength={8} />
 *       <PasswordVisibilityToggle />
 *     </PasswordInputField>
 *     <FieldError />
 *   </Field>
 */
export function PasswordInputField({ children, className }: PasswordInputFieldProps) {
  const [visible, setVisible] = useState(false)
  const toggle = () => setVisible((v) => !v)
  return (
    <PasswordVisibilityContext.Provider value={{ visible, toggle }}>
      <div className={cn('relative', className)}>{children}</div>
    </PasswordVisibilityContext.Provider>
  )
}

export type PasswordInputProps = Omit<InputProps, 'type'>

/**
 * Styled password input. Renders an Input with type="password" or "text" based on PasswordVisibilityContext.
 * When used outside PasswordInputField, always renders as type="password".
 *
 * IMPORTANT: PasswordInput's root element IS the <input>, so it correctly receives Field props
 * (id, aria-labelledby, data-invalid, etc.) when used inside <FieldControl render={<PasswordInput/>}>.
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const ctx = useContext(PasswordVisibilityContext)
    const visible = ctx?.visible ?? false
    return (
      <Input
        ref={ref}
        type={visible ? 'text' : 'password'}
        className={cn('pr-12', className)}
        {...props}
      />
    )
  },
)
PasswordInput.displayName = 'PasswordInput'

/**
 * Eye/EyeOff toggle button. Must be a child of PasswordInputField.
 */
export function PasswordVisibilityToggle({ className }: { className?: string }) {
  const ctx = useContext(PasswordVisibilityContext)
  if (!ctx) return null
  const { visible, toggle } = ctx
  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        'absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground',
        className,
      )}
      aria-label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
    >
      {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  )
}
