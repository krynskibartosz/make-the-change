# Base UI Native Forms — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrer tous les formulaires de `web-client` vers le pattern Base UI 2026 (`<Form errors><Field.Root><Field.Control render={<Input/>}/><Field.Error/></Field.Root></Form>`), supprimer `react-hook-form` du core, et nettoyer la dette technique du composant `Input` monolithique.

**Architecture:** Coexistence transitoire `LegacyInput` (ancien API) + `Input` (nouveau minimaliste) dans le même fichier pendant les étapes intermédiaires pour éviter de casser TypeScript. cva pour les variants. Field.Control avec `render={<Input/>}` est le pattern canonique. Server Actions retournent `{ errors: Record<string,string>, formError?: string }` câblés automatiquement via `<Form errors={state.errors}>`. Cleanup final en P9 supprime les Legacy.

**Tech Stack:** TypeScript, React 19, Next.js 16 App Router, `@base-ui/react` ^1.5, `class-variance-authority`, Tailwind CSS 4, Vitest + @testing-library/react.

**Spec source:** `docs/superpowers/specs/2026-06-02-base-ui-native-forms-design.md`

---

## Setup — Worktree isolé

**Files:**
- None — git operations only

- [ ] **Step 0.1 — Sync main and create worktree**

Run:
```bash
git fetch origin
git worktree add -b feat/base-ui-native-forms .worktrees/base-ui-native-forms origin/main
cd .worktrees/base-ui-native-forms
```
Expected: new worktree at `.worktrees/base-ui-native-forms/`, on branch `feat/base-ui-native-forms`.

- [ ] **Step 0.2 — Verify baseline tests pass before any change**

Run:
```bash
pnpm install
pnpm --filter @make-the-change/core test
```
Expected: 36 tests passed.

Run:
```bash
pnpm --filter @make-the-change/web-client type-check
```
Expected: only pre-existing errors in `species-helpers.test.ts` and `species-context.service.ts` (unrelated).

---

## P0 — Foundations core

Crée le nouveau `Input`/`TextArea` minimaliste, ajoute `inputVariants`/`textareaVariants` via cva, `PasswordInput`, doc `forms.md`. Renomme l'ancien Input/TextArea en `LegacyInput`/`LegacyTextArea`. Supprime `form-input.tsx`, `field-shell.tsx` et `react-hook-form`. **Aucun consumer migré dans P0 — tous continuent d'utiliser `LegacyInput` via alias d'import.**

### Task P0.1 — Create `input-variants.ts`

**Files:**
- Create: `packages/core/src/shared/ui/base/input-variants.ts`

- [ ] **Step P0.1.1 — Write the file**

Create `packages/core/src/shared/ui/base/input-variants.ts`:

```ts
import { cva, type VariantProps } from 'class-variance-authority'

export const inputVariants = cva(
  'flex w-full rounded-2xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 data-[invalid]:border-destructive data-[invalid]:ring-destructive/30',
  {
    variants: {
      variant: {
        default:
          'bg-background/70 backdrop-blur-sm border border-[hsl(var(--border)/0.8)] shadow-sm text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-primary/30 focus-visible:border-primary/70 [&:-webkit-autofill]:[-webkit-text-fill-color:var(--foreground)] [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s]',
        outlined:
          'bg-transparent border-2 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-primary/30 [&:-webkit-autofill]:[-webkit-text-fill-color:var(--foreground)] [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s]',
        filled:
          'bg-muted/70 backdrop-blur-sm border shadow-sm text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-primary/30 [&:-webkit-autofill]:[-webkit-text-fill-color:var(--foreground)] [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s]',
        ghost:
          'bg-white/[0.04] border border-white/10 text-white placeholder:text-white/25 focus-visible:ring-lime-300/30 focus-visible:border-lime-300/50 [&:-webkit-autofill]:[-webkit-text-fill-color:white] [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s]',
      },
      size: {
        sm: 'h-9 px-3 text-base sm:text-sm',
        md: 'h-11 px-4 text-base sm:text-sm',
        lg: 'h-13 px-4 text-base',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  },
)

export type InputVariantProps = VariantProps<typeof inputVariants>

export const textareaVariants = cva(
  'flex w-full rounded-xl resize-y transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 data-[invalid]:border-destructive data-[invalid]:ring-destructive/30',
  {
    variants: {
      variant: {
        default:
          'bg-background/70 backdrop-blur-sm border shadow-sm text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-primary/30',
        outlined:
          'bg-transparent border-2 border-[hsl(var(--border))] text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-primary/30',
        filled:
          'bg-muted/70 backdrop-blur-sm border border-[hsl(var(--border)/0.7)] shadow-sm text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-primary/30',
        ghost:
          'bg-white/[0.04] border border-white/10 text-white placeholder:text-white/25 focus-visible:ring-lime-300/30 focus-visible:border-lime-300/50',
      },
      size: {
        sm: 'min-h-[80px] text-sm px-3 py-2',
        md: 'min-h-[100px] text-sm px-4 py-3',
        lg: 'min-h-[120px] text-base px-4 py-3',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  },
)

export type TextAreaVariantProps = VariantProps<typeof textareaVariants>
```

### Task P0.2 — Refactor `input.tsx` with coexistence

**Files:**
- Modify: `packages/core/src/shared/ui/base/input.tsx` (complete rewrite)

- [ ] **Step P0.2.1 — Replace file content**

Replace `packages/core/src/shared/ui/base/input.tsx` content with:

```tsx
'use client'

import { Input as InputPrimitive } from '@base-ui/react/input'
import { Eye, EyeOff } from 'lucide-react'
import type { ForwardedRef, InputHTMLAttributes, ReactNode } from 'react'
import { forwardRef, useId, useState } from 'react'
import { cn } from '../utils'
import { inputVariants, type InputVariantProps } from './input-variants'

/* ============================================================================
 * NEW API — composable, Field-aware
 * ========================================================================= */

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> &
  InputVariantProps

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, ...props }, ref) => (
    <InputPrimitive
      ref={ref}
      className={cn(inputVariants({ variant, size }), className)}
      {...props}
    />
  ),
)
Input.displayName = 'Input'

/* ============================================================================
 * LEGACY API — kept during transition, removed in P9
 * ========================================================================= */

export type LegacyInputVariant = 'default' | 'outlined' | 'filled' | 'ghost'

export type LegacyInputProps = {
  label?: string
  error?: string
  helpText?: string
  description?: string
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
  showPasswordToggle?: boolean
  variant?: LegacyInputVariant
  size?: 'sm' | 'md' | 'lg'
  containerClassName?: string
  inputWrapperClassName?: string
  labelClassName?: string
  messageClassName?: string
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>

export const LegacyInput = forwardRef<HTMLInputElement, LegacyInputProps>(
  (
    {
      className,
      type,
      label,
      error,
      helpText,
      description,
      leadingIcon,
      trailingIcon,
      showPasswordToggle = false,
      variant = 'default',
      size = 'md',
      required,
      containerClassName,
      inputWrapperClassName,
      labelClassName,
      messageClassName,
      id,
      ...props
    },
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    const [isFocused, setIsFocused] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [shakeAnimation, setShakeAnimation] = useState('')
    const resolvedHelpText = helpText ?? description
    const generatedId = useId()
    const inputId = id ?? (label || error || resolvedHelpText ? `input-${generatedId}` : undefined)
    const describedByBaseId = inputId ?? `input-${generatedId}`
    const ariaDescribedBy = error
      ? `${describedByBaseId}-error`
      : resolvedHelpText
        ? `${describedByBaseId}-help`
        : undefined

    const inputType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type
    const hasTrailingAffordance =
      Boolean(trailingIcon) || (showPasswordToggle && type === 'password') || Boolean(error)

    const handleErrorShake = () => {
      if (error) {
        setShakeAnimation('animate-shake')
        setTimeout(() => setShakeAnimation(''), 500)
      }
    }

    const sizeClasses = {
      sm: 'h-9 px-3 text-base sm:text-sm',
      md: 'h-11 px-4 text-base sm:text-sm',
      lg: 'h-13 px-4 text-base',
    }

    const variantClasses = {
      default:
        'bg-background/70 backdrop-blur-sm border border-[hsl(var(--border)/0.8)] shadow-sm dark:bg-background/90 text-foreground placeholder:text-muted-foreground/60',
      outlined:
        'bg-transparent border-2 dark:border-[hsl(var(--border)/0.8)] text-foreground placeholder:text-muted-foreground/60',
      filled:
        'bg-muted/70 backdrop-blur-sm border border-[hsl(var(--border)/0.7)] shadow-sm dark:bg-muted/50 dark:border-[hsl(var(--border))] text-foreground placeholder:text-muted-foreground/60',
      ghost:
        'bg-white/[0.04] border border-white/10 text-white placeholder:text-white/25',
    }

    return (
      <div className={cn('space-y-1.5 w-full', containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'flex items-center gap-1 text-sm font-medium transition-colors',
              error ? 'text-destructive' : 'text-muted-foreground dark:text-foreground/80',
              labelClassName,
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
            inputWrapperClassName,
          )}
        >
          {leadingIcon && (
            <div className="absolute left-4 flex items-center text-muted-foreground/70 z-10 pointer-events-none">
              {leadingIcon}
            </div>
          )}

          <InputPrimitive
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
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-1',
              'focus-visible:border-primary/70 focus-visible:shadow-md',
              'disabled:cursor-not-allowed disabled:opacity-50',
              leadingIcon && 'pl-12',
              hasTrailingAffordance && 'pr-12',
              error
                ? 'border-destructive bg-destructive/5 focus-visible:ring-destructive/30 focus-visible:border-destructive dark:bg-destructive/10'
                : 'hover:shadow-sm dark:hover:border-[hsl(var(--border)/0.9)] dark:hover:bg-background/95',
              className,
            )}
            style={{
              WebkitTextFillColor: variant === 'ghost' ? 'white' : 'var(--foreground)',
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

        {(error ?? resolvedHelpText) && (
          <p
            className={cn(
              'text-sm transition-colors',
              error ? 'text-destructive' : 'text-muted-foreground',
              messageClassName,
            )}
            id={ariaDescribedBy}
          >
            {error ?? resolvedHelpText}
          </p>
        )}
      </div>
    )
  },
)
LegacyInput.displayName = 'LegacyInput'

export const LegacyPasswordInput = forwardRef<
  HTMLInputElement,
  Omit<LegacyInputProps, 'type' | 'showPasswordToggle'>
>((props, ref: ForwardedRef<HTMLInputElement>) => (
  <LegacyInput showPasswordToggle type="password" {...props} ref={ref} />
))
LegacyPasswordInput.displayName = 'LegacyPasswordInput'
```

### Task P0.3 — Refactor `textarea.tsx` with coexistence

**Files:**
- Modify: `packages/core/src/shared/ui/base/textarea.tsx` (complete rewrite)

- [ ] **Step P0.3.1 — Replace file content**

Replace `packages/core/src/shared/ui/base/textarea.tsx` content with:

```tsx
'use client'

import type { ForwardedRef, InputHTMLAttributes, ReactNode } from 'react'
import { forwardRef, useId, useState } from 'react'

import { cn } from '../utils'
import { textareaVariants, type TextAreaVariantProps } from './input-variants'

/* ============================================================================
 * NEW API
 * ========================================================================= */

export type TextAreaProps = Omit<InputHTMLAttributes<HTMLTextAreaElement>, 'size'> &
  TextAreaVariantProps

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, variant, size, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(textareaVariants({ variant, size }), className)}
      {...props}
    />
  ),
)
TextArea.displayName = 'TextArea'

/* ============================================================================
 * LEGACY API
 * ========================================================================= */

export type LegacyTextAreaVariant = 'default' | 'outlined' | 'filled' | 'ghost'

export type LegacyTextAreaProps = {
  label?: string
  error?: string
  helpText?: string
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
  variant?: LegacyTextAreaVariant
  size?: 'sm' | 'md' | 'lg'
  rows?: number
} & Omit<InputHTMLAttributes<HTMLTextAreaElement>, 'size'>

export const LegacyTextArea = forwardRef<HTMLTextAreaElement, LegacyTextAreaProps>(
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
    ref: ForwardedRef<HTMLTextAreaElement>,
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
      default:
        'bg-background/70 backdrop-blur-sm border shadow-sm text-foreground placeholder:text-muted-foreground/60',
      outlined:
        'bg-transparent border-2 border-[hsl(var(--border))] text-foreground placeholder:text-muted-foreground/60',
      filled:
        'bg-muted/70 backdrop-blur-sm border border-[hsl(var(--border)/0.7)] shadow-sm text-foreground placeholder:text-muted-foreground/60',
      ghost:
        'bg-white/[0.04] border border-white/10 text-white placeholder:text-white/25',
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
LegacyTextArea.displayName = 'LegacyTextArea'
```

### Task P0.4 — Create `password-input.tsx`

**Files:**
- Create: `packages/core/src/shared/ui/base/password-input.tsx`

- [ ] **Step P0.4.1 — Write the file**

Create `packages/core/src/shared/ui/base/password-input.tsx`:

```tsx
'use client'

import { Eye, EyeOff } from 'lucide-react'
import { forwardRef, useState } from 'react'
import { cn } from '../utils'
import { Input, type InputProps } from './input'

export type PasswordInputProps = Omit<InputProps, 'type'>

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const [visible, setVisible] = useState(false)
    return (
      <div className="relative">
        <Input
          ref={ref}
          type={visible ? 'text' : 'password'}
          className={cn('pr-12', className)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    )
  },
)
PasswordInput.displayName = 'PasswordInput'
```

### Task P0.5 — Delete `form-input.tsx` and `field-shell.tsx`

**Files:**
- Delete: `packages/core/src/shared/ui/forms/form-input.tsx`
- Delete: `packages/core/src/shared/ui/forms/field-shell.tsx`
- Delete: `packages/core/src/shared/ui/forms/__tests__/field-shell.test.tsx`
- Modify: `packages/core/src/shared/ui/forms/index.ts`

- [ ] **Step P0.5.1 — Delete files**

Run:
```bash
rm packages/core/src/shared/ui/forms/form-input.tsx
rm packages/core/src/shared/ui/forms/field-shell.tsx
rm packages/core/src/shared/ui/forms/__tests__/field-shell.test.tsx
```

- [ ] **Step P0.5.2 — Update `forms/index.ts`**

Replace `packages/core/src/shared/ui/forms/index.ts` content with:

```ts
export * from './form-checkbox'
export * from './form-field'
export * from './form-select'
export * from './form-submit-button'
export * from './form-textarea'
```

### Task P0.6 — Remove `react-hook-form` from package and verify no apps depend on it

**Files:**
- Modify: `packages/core/package.json`

- [ ] **Step P0.6.1 — Verify no app imports react-hook-form**

Run:
```bash
grep -rn "react-hook-form" apps/web-client/src
```
Expected: no matches (only `useFormStatus` from `react-dom` may appear — that is fine).

- [ ] **Step P0.6.2 — Check other core files use react-hook-form**

Run:
```bash
grep -rn "react-hook-form" packages/core/src
```
If any matches exist outside the deleted `form-input.tsx`, the dependency must remain. Otherwise proceed.

- [ ] **Step P0.6.3 — Remove from `package.json`**

In `packages/core/package.json`, delete the line:
```json
    "react-hook-form": "^7.52.2",
```
from the `dependencies` block.

- [ ] **Step P0.6.4 — Reinstall**

Run:
```bash
pnpm install
```
Expected: no errors; `react-hook-form` is removed from `node_modules`.

### Task P0.7 — Update `packages/core/src/shared/ui/index.ts` exports

**Files:**
- Modify: `packages/core/src/shared/ui/index.ts`

- [ ] **Step P0.7.1 — Replace the Input export line**

Find this line in `packages/core/src/shared/ui/index.ts`:
```ts
export { Input, PasswordInput } from './base/input'
```
Replace with:
```ts
export { Input, LegacyInput, LegacyPasswordInput, type InputProps, type LegacyInputProps } from './base/input'
export { PasswordInput, type PasswordInputProps } from './base/password-input'
export {
  inputVariants,
  textareaVariants,
  type InputVariantProps,
  type TextAreaVariantProps,
} from './base/input-variants'
```

- [ ] **Step P0.7.2 — Replace the TextArea export line**

Find this line:
```ts
export { TextArea, TextArea as Textarea } from './base/textarea'
```
Replace with:
```ts
export {
  TextArea,
  TextArea as Textarea,
  LegacyTextArea,
  type TextAreaProps,
  type LegacyTextAreaProps,
} from './base/textarea'
```

### Task P0.8 — Rewrite `input.test.tsx`

**Files:**
- Modify: `packages/core/src/shared/ui/base/__tests__/input.test.tsx`

- [ ] **Step P0.8.1 — Replace test file content**

Replace `packages/core/src/shared/ui/base/__tests__/input.test.tsx` with:

```tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  Field,
  FieldControl,
  FieldError,
  FieldLabel,
} from '../field'
import { Form } from '../form'
import { Input } from '../input'
import { inputVariants } from '../input-variants'

describe('Input (new minimal API)', () => {
  it('1. variants produce expected classes', () => {
    const ghost = inputVariants({ variant: 'ghost' })
    expect(ghost).toContain('bg-white/[0.04]')
    expect(ghost).toContain('text-white')

    const def = inputVariants({ variant: 'default' })
    expect(def).toContain('text-foreground')
  })

  it('2. Field composition propagates data-attributes on blur', async () => {
    const user = userEvent.setup()

    render(
      <Field name="email">
        <FieldLabel>Email</FieldLabel>
        <FieldControl render={<Input variant="ghost" />} type="email" required />
        <FieldError>Email is required</FieldError>
      </Field>,
    )

    const input = screen.getByRole('textbox')
    await user.click(input)
    await user.tab() // blur

    await waitFor(() => {
      expect(input).toHaveAttribute('data-touched')
    })
  })

  it('3. FieldLabel correctly associates with the control id', () => {
    render(
      <Field name="email">
        <FieldLabel>Email</FieldLabel>
        <FieldControl render={<Input variant="ghost" />} />
      </Field>,
    )

    const input = screen.getByRole('textbox')
    const label = screen.getByText('Email')
    const inputId = input.getAttribute('id')

    expect(inputId).toBeTruthy()
    expect(label).toHaveAttribute('for', inputId!)
  })

  it('4. Form errors prop wires Field.Error message automatically', () => {
    render(
      <Form errors={{ email: 'Email already in use' }}>
        <Field name="email">
          <FieldLabel>Email</FieldLabel>
          <FieldControl render={<Input variant="ghost" />} />
          <FieldError />
        </Field>
      </Form>,
    )

    expect(screen.getByText('Email already in use')).toBeVisible()
  })

  it('5. validate async returns string and Field.Error displays it', async () => {
    const user = userEvent.setup()

    render(
      <Field
        name="user"
        validationMode="onBlur"
        validate={(value) => (value === 'admin' ? 'Reserved' : null)}
      >
        <FieldLabel>User</FieldLabel>
        <FieldControl render={<Input variant="ghost" />} />
        <FieldError />
      </Field>,
    )

    const input = screen.getByRole('textbox')
    await user.type(input, 'admin')
    await user.tab() // blur to trigger validate

    await waitFor(() => {
      expect(screen.getByText('Reserved')).toBeVisible()
    })
  })
})
```

### Task P0.9 — Write the forms guide doc

**Files:**
- Create: `docs/02-product/design-system/forms.md`

- [ ] **Step P0.9.1 — Write the guide**

Create `docs/02-product/design-system/forms.md`:

```markdown
# Forms — design system pattern

> Pattern Base UI 2026 utilisé partout dans `web-client`. Applique pour tout formulaire (login, contact, checkout, etc.).

## TL;DR

```tsx
import { Field, FieldControl, FieldError, FieldLabel, Form, Input } from '@make-the-change/core/ui'

const [state, formAction] = useActionState(myServerAction, {})

return (
  <Form action={formAction} errors={state.errors}>
    <Field name="email">
      <FieldLabel>Email</FieldLabel>
      <FieldControl render={<Input variant="ghost" />} type="email" required />
      <FieldError match="valueMissing">Email requis</FieldError>
      <FieldError match="typeMismatch">Format invalide</FieldError>
      <FieldError /> {/* catch-all : affiche state.errors.email */}
    </Field>
    <button type="submit">Envoyer</button>
  </Form>
)
```

## Pourquoi ce pattern

- **Accessibility automatique** : `aria-invalid`, `aria-describedby`, `for=` câblés par `Field` sans code applicatif.
- **Validation HTML native** + `validate` prop pour le custom + `<Form errors>` pour les erreurs serveur, le tout uniforme.
- **Pas de state local `touched`** : `data-touched` est exposé par Field et stylé via Tailwind `data-[touched]:`.

## Server Action shape

```ts
// apps/web-client/src/lib/server-actions.ts
export type ServerActionState = {
  success?: boolean
  errors?: Record<string, string>  // key = Field.Root name
  formError?: string                // erreur globale hors champ
  redirectUrl?: string
}
```

Retourner `{ errors: { email: 'X' } }` depuis un Server Action affiche automatiquement "X" sous le champ `email` via `<FieldError />` (sans `match`). Quand l'utilisateur modifie le champ, l'erreur disparaît.

## Validation custom (async)

```tsx
<Field
  name="username"
  validationMode="onBlur"
  validate={async (value) => {
    if (typeof value !== 'string' || value.length < 3) return 'Trop court'
    const res = await fetch(`/api/check-username?u=${value}`).then((r) => r.json())
    return res.taken ? 'Déjà pris' : null
  }}
>
  <FieldLabel>Username</FieldLabel>
  <FieldControl render={<Input variant="ghost" />} />
  <FieldError />
</Field>
```

## Password

Utiliser `PasswordInput` (toggle eye/eyeOff inclus) :

```tsx
import { PasswordInput } from '@make-the-change/core/ui'

<Field name="password">
  <FieldLabel>Mot de passe</FieldLabel>
  <FieldControl render={<PasswordInput variant="ghost" />} required minLength={8} />
  <FieldError match="valueMissing">Requis</FieldError>
  <FieldError match="tooShort">8 caractères minimum</FieldError>
</Field>
```

## Variants

| Variant | Quand l'utiliser |
|---|---|
| `default` | Forms standard sur fond clair (auth modals, dashboard) |
| `ghost` | Écrans dark mode hardcodés `#0B0F15` (checkout, contribute, support) |
| `outlined` / `filled` | Cas spéciaux — rarement utilisés |

## Autofill Safari/Chrome

Géré par `inputVariants` directement. Pas besoin de `style={{WebkitTextFillColor:...}}` côté composant — la cva inclut un sélecteur `[&:-webkit-autofill]:[-webkit-text-fill-color:...]` adapté à chaque variant.

## TextArea

Même pattern :

```tsx
import { TextArea } from '@make-the-change/core/ui'

<Field name="message">
  <FieldLabel>Message</FieldLabel>
  <FieldControl render={<TextArea variant="ghost" rows={4} />} required minLength={10} />
  <FieldError match="valueMissing">Requis</FieldError>
  <FieldError match="tooShort">10 caractères minimum</FieldError>
</Field>
```

## Anti-patterns

❌ N'utilisez **plus** `<Input label="..." error="..." helpText="..." />` (API monolithique legacy). Cette forme est temporairement disponible sous le nom `LegacyInput` mais sera supprimée en P9.

❌ N'utilisez **pas** `react-hook-form` ou `useController` — la composition Field + native HTML validation couvre tous nos cas.

❌ Ne posez **pas** `<Input>` directement à côté de `<FieldLabel>` sans `<FieldControl render={<Input />}>` — sinon les data-attributes ne sont pas posés sur le bon élément DOM.
```

### Task P0.10 — Migrate existing consumers to `LegacyInput` alias

The 4 files currently importing `Input` from core (`login-form.tsx`, `register-form.tsx`, `forgot-password-form.tsx`, `theme-selection.tsx`) use the monolithic API. Without renaming their imports, **TypeScript breaks** because the new `Input` no longer accepts `label`, `error`, `leadingIcon` props.

**Files:**
- Modify: `apps/web-client/src/app/[locale]/(auth)/_components/login-form.tsx` (line 12)
- Modify: `apps/web-client/src/app/[locale]/(auth)/_components/register-form.tsx` (line 12)
- Modify: `apps/web-client/src/app/[locale]/(auth)/_components/forgot-password-form.tsx` (line 13)
- Modify: `apps/web-client/src/app/[locale]/(lab)/appearance/_features/theme/theme-selection.tsx` (around line 23)

- [ ] **Step P0.10.1 — Rename Input → LegacyInput in login-form.tsx**

In `apps/web-client/src/app/[locale]/(auth)/_components/login-form.tsx`, find the import line:
```tsx
  Input,
```
Replace with:
```tsx
  LegacyInput as Input,
```
(Keep the `Input` local name so the JSX `<Input />` usage continues to work without touching it.)

- [ ] **Step P0.10.2 — Rename Input → LegacyInput in register-form.tsx**

Same change at the import block (around line 12 of `register-form.tsx`):
```tsx
  LegacyInput as Input,
```

- [ ] **Step P0.10.3 — Rename Input → LegacyInput in forgot-password-form.tsx**

Same change at the import block (around line 13 of `forgot-password-form.tsx`):
```tsx
  LegacyInput as Input,
```

- [ ] **Step P0.10.4 — Rename Input → LegacyInput in theme-selection.tsx**

Find the import block in `apps/web-client/src/app/[locale]/(lab)/appearance/_features/theme/theme-selection.tsx` (around line 23), locate `Input,` and replace with:
```tsx
  LegacyInput as Input,
```

### Task P0.11 — Run all checks and commit

- [ ] **Step P0.11.1 — Run core tests**

Run:
```bash
pnpm --filter @make-the-change/core test
```
Expected: all tests pass (5 new tests in `input.test.tsx`, others unchanged). If `theme-builder.snapshot.test.tsx` fails, re-run with `--update` flag (snapshot drift from class-order changes is expected). Re-run without `--update` to confirm.

- [ ] **Step P0.11.2 — Run web-client type-check**

Run:
```bash
pnpm --filter @make-the-change/web-client type-check
```
Expected: only the pre-existing errors in `species-helpers.test.ts` / `species-context.service.ts`. No new errors related to forms.

- [ ] **Step P0.11.3 — Commit**

```bash
git add packages/core/src/shared/ui/base/input.tsx \
  packages/core/src/shared/ui/base/textarea.tsx \
  packages/core/src/shared/ui/base/input-variants.ts \
  packages/core/src/shared/ui/base/password-input.tsx \
  packages/core/src/shared/ui/base/__tests__/input.test.tsx \
  packages/core/src/shared/ui/forms/index.ts \
  packages/core/src/shared/ui/index.ts \
  packages/core/package.json \
  pnpm-lock.yaml \
  docs/02-product/design-system/forms.md \
  "apps/web-client/src/app/[locale]/(auth)/_components/login-form.tsx" \
  "apps/web-client/src/app/[locale]/(auth)/_components/register-form.tsx" \
  "apps/web-client/src/app/[locale]/(auth)/_components/forgot-password-form.tsx" \
  "apps/web-client/src/app/[locale]/(lab)/appearance/_features/theme/theme-selection.tsx"
git rm packages/core/src/shared/ui/forms/form-input.tsx \
  packages/core/src/shared/ui/forms/field-shell.tsx \
  packages/core/src/shared/ui/forms/__tests__/field-shell.test.tsx
git commit -m "feat(core): introduce composable Input + Field-aware pattern, keep Legacy* for transition"
```

---

## P1 — Contact form (POC du pattern)

**Files:**
- Create: `apps/web-client/src/lib/server-actions.ts`
- Modify: `apps/web-client/src/app/[locale]/(site)/contact/actions.ts`
- Modify: `apps/web-client/src/app/[locale]/(site)/contact/page.tsx`

### Task P1.1 — Create shared ServerActionState type

- [ ] **Step P1.1.1 — Sync before starting**

```bash
git fetch origin
git rebase origin/main
```
Run tests and type-check, resolve any conflicts.

- [ ] **Step P1.1.2 — Create the file**

Create `apps/web-client/src/lib/server-actions.ts`:

```ts
export type ServerActionState = {
  success?: boolean
  errors?: Record<string, string>
  formError?: string
  redirectUrl?: string
}
```

### Task P1.2 — Update contact server action to new shape

- [ ] **Step P1.2.1 — Replace actions.ts content**

Replace `apps/web-client/src/app/[locale]/(site)/contact/actions.ts` with:

```ts
'use server'

import type { ServerActionState } from '@/lib/server-actions'

function isValidEmail(email: string): boolean {
  const parts = email.split('@')
  return parts.length === 2 && (parts[1]?.includes('.') ?? false)
}

export async function sendContactMessage(
  _prev: ServerActionState,
  formData: FormData,
): Promise<ServerActionState> {
  const email = String(formData.get('email') ?? '').trim()
  const message = String(formData.get('message') ?? '').trim()

  const errors: Record<string, string> = {}
  if (!isValidEmail(email)) errors.email = 'Adresse e-mail invalide.'
  if (message.length < 10) errors.message = 'Message trop court (10 caractères minimum).'

  if (Object.keys(errors).length > 0) return { errors }

  // TODO: wire to email service (Resend or similar)
  console.log('[contact] new message from', email)
  return { success: true }
}
```

### Task P1.3 — Migrate contact page to Field composition

- [ ] **Step P1.3.1 — Read current file to understand structure**

Read `apps/web-client/src/app/[locale]/(site)/contact/page.tsx` to locate the form section (around lines 113-186).

- [ ] **Step P1.3.2 — Update imports**

In `apps/web-client/src/app/[locale]/(site)/contact/page.tsx`, replace the top imports block (lines 1-13) with:

```tsx
'use client'

import {
  Field,
  FieldControl,
  FieldError,
  FieldLabel,
  Form,
  Input,
  TextArea,
} from '@make-the-change/core/ui'
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  HelpCircle,
  Instagram,
  Linkedin,
  Mail,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useActionState, useState } from 'react'
import { sendContactMessage } from './actions'
import type { ServerActionState } from '@/lib/server-actions'
```

- [ ] **Step P1.3.3 — Replace `useState(false)` + fake onSubmit with `useActionState`**

In the `ContactPage` component body, find:
```tsx
const [selectedSubject, setSelectedSubject] = useState<Subject>('bug')
const [isSent, setIsSent] = useState(false)
const router = useRouter()
```
Replace with:
```tsx
const [selectedSubject, setSelectedSubject] = useState<Subject>('bug')
const [state, formAction, isPending] = useActionState<ServerActionState, FormData>(
  sendContactMessage,
  {},
)
const isSent = state.success === true
const router = useRouter()
```

- [ ] **Step P1.3.4 — Replace the `<form>` element with `<Form>`**

Find the `<form>` block (around line 113):
```tsx
<form
  onSubmit={(e) => { e.preventDefault(); setIsSent(true); }}
  className="relative z-10 px-6 mb-20 flex flex-col gap-6"
>
```
Replace with:
```tsx
<Form
  action={formAction}
  errors={state.errors}
  className="relative z-10 px-6 mb-20 flex flex-col gap-6"
>
```

Also find the closing `</form>` at the end of the form block and replace with `</Form>`.

- [ ] **Step P1.3.5 — Replace email + textarea inputs**

Find the "Inset grouped fields" block (around lines 156-175):
```tsx
<div className="bg-[#1A1F26] rounded-2xl border border-white/5 overflow-hidden flex flex-col">
  <div className="px-4 py-3 border-b border-white/5 focus-within:bg-white/[0.02] transition-colors">
    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Votre email</label>
    <input
      type="email"
      required
      placeholder="Pour vous recontacter..."
      className="w-full bg-transparent text-white text-base focus:outline-none placeholder:text-gray-600 font-medium"
    />
  </div>
  <div className="px-4 py-3 focus-within:bg-white/[0.02] transition-colors">
    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Votre message</label>
    <textarea
      rows={4}
      required
      placeholder="Décrivez votre demande en détail..."
      className="w-full bg-transparent text-white text-base focus:outline-none placeholder:text-gray-600 font-medium resize-none"
    />
  </div>
</div>
```
Replace with:
```tsx
<div className="bg-[#1A1F26] rounded-2xl border border-white/5 overflow-hidden flex flex-col">
  <input type="hidden" name="subject" value={selectedSubject} />
  <Field name="email" className="px-4 py-3 border-b border-white/5">
    <FieldLabel className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">
      Votre email
    </FieldLabel>
    <FieldControl
      render={
        <Input
          variant="ghost"
          className="bg-transparent border-0 shadow-none focus-visible:ring-0 px-0 text-base font-medium h-auto"
        />
      }
      type="email"
      required
      placeholder="Pour vous recontacter..."
    />
    <FieldError className="mt-1 text-xs text-red-400" />
  </Field>
  <Field name="message" className="px-4 py-3">
    <FieldLabel className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">
      Votre message
    </FieldLabel>
    <FieldControl
      render={
        <TextArea
          variant="ghost"
          className="bg-transparent border-0 shadow-none focus-visible:ring-0 px-0 text-base font-medium resize-none min-h-0"
          rows={4}
        />
      }
      required
      minLength={10}
      placeholder="Décrivez votre demande en détail..."
    />
    <FieldError className="mt-1 text-xs text-red-400" />
  </Field>
</div>
```

- [ ] **Step P1.3.6 — Add formError display + disable submit while pending**

Just before the submit button (find `<button type="submit"`), add:
```tsx
{state.formError && (
  <p className="text-sm font-medium text-red-400" role="alert">
    {state.formError}
  </p>
)}
```

Update the submit button:
```tsx
// Before
<button
  type="submit"
  className="w-full bg-lime-400 text-[#0B0F15] font-black text-lg h-14 rounded-2xl active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(132,204,22,0.15)] flex items-center justify-center"
>
  Envoyer le message
</button>

// After
<button
  type="submit"
  disabled={isPending}
  className="w-full bg-lime-400 text-[#0B0F15] font-black text-lg h-14 rounded-2xl active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(132,204,22,0.15)] flex items-center justify-center disabled:opacity-60"
>
  {isPending ? 'Envoi…' : 'Envoyer le message'}
</button>
```

### Task P1.4 — Verify and commit

- [ ] **Step P1.4.1 — Type-check**

Run:
```bash
pnpm --filter @make-the-change/web-client type-check
```
Expected: no new errors in contact files.

- [ ] **Step P1.4.2 — Manual verify (browser)**

Use the `verify` skill or run the dev server and test:
1. Open `/fr/contact`
2. Submit empty → both fields show error messages.
3. Type valid email + 5-char message → submit → "Message trop court (10 caractères minimum)." appears under message.
4. Fix message to 10+ chars → submit → success screen appears.

- [ ] **Step P1.4.3 — Commit**

```bash
git add apps/web-client/src/lib/server-actions.ts \
  "apps/web-client/src/app/[locale]/(site)/contact/actions.ts" \
  "apps/web-client/src/app/[locale]/(site)/contact/page.tsx"
git commit -m "refactor(contact): migrate to Field + Form pattern with server-side errors"
```

---

## P2 — Forgot password

**Files:**
- Modify: `apps/web-client/src/app/[locale]/(auth)/actions.ts` (forgotPassword function)
- Modify: `apps/web-client/src/app/[locale]/(auth)/_components/forgot-password-form.tsx`

### Task P2.1 — Sync and update server action

- [ ] **Step P2.1.1 — Sync**

```bash
git fetch origin
git rebase origin/main
```
Resolve conflicts if any.

- [ ] **Step P2.1.2 — Update `AuthState` type in actions.ts**

In `apps/web-client/src/app/[locale]/(auth)/actions.ts`, find:
```ts
export type AuthState = {
  error?: string
  success?: string
  redirectUrl?: string
}
```
Replace with:
```ts
export type AuthState = {
  error?: string
  success?: string
  redirectUrl?: string
  errors?: Record<string, string>
  formError?: string
}
```
(We keep `error` for backwards compat with login/register which migrate later; we add `errors` and `formError` for new pattern.)

- [ ] **Step P2.1.3 — Update `forgotPassword` to use field-level errors**

In the same file, find:
```ts
export async function forgotPassword(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const supabase = await createClient()

  const email = getFormDataString(formData, 'email')

  if (!email) {
    return { error: 'Email is required' }
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: buildPublicAppUrl('/reset-password'),
  })

  if (error) {
    return { error: error.message }
  }

  return { success: 'Check your email for a password reset link' }
}
```
Replace with:
```ts
export async function forgotPassword(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const supabase = await createClient()

  const email = getFormDataString(formData, 'email')

  if (!email) {
    return { errors: { email: 'Email is required' } }
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: buildPublicAppUrl('/reset-password'),
  })

  if (error) {
    return { formError: error.message }
  }

  return { success: 'Check your email for a password reset link' }
}
```

### Task P2.2 — Migrate `forgot-password-form.tsx`

- [ ] **Step P2.2.1 — Replace imports**

In `apps/web-client/src/app/[locale]/(auth)/_components/forgot-password-form.tsx`, replace the top import block (lines 1-22) with:

```tsx
'use client'

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Field,
  FieldControl,
  FieldError,
  FieldLabel,
  Form,
  Input,
} from '@make-the-change/core/ui'
import { ArrowLeft, Mail, Sparkles } from 'lucide-react'
import { AuthSubmitButton } from '@/app/[locale]/(auth)/_components/auth-submit-button'
import { FormErrorAlert } from '@/app/[locale]/(auth)/_components/form-error-alert'
import { useTranslations } from 'next-intl'
import { useActionState } from 'react'
import { type AuthState, forgotPassword } from '@/app/[locale]/(auth)/actions'
import { Link } from '@/i18n/navigation'
```

(Removed `LegacyInput as Input`, added `FieldControl, FieldError, FieldLabel`.)

- [ ] **Step P2.2.2 — Replace the email field**

Find the field block (around lines 70-82):
```tsx
<Field className="relative group">
  <Mail className="absolute left-4 top-[38px] h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
  <Input
    id="email"
    name="email"
    type="email"
    label={t('email')}
    placeholder={t('email_placeholder')}
    className="pl-12 h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-primary/20"
    required
    autoComplete="email"
  />
</Field>
```
Replace with:
```tsx
<Field name="email" className="relative group">
  <FieldLabel className="block text-sm font-medium text-muted-foreground mb-1.5">
    {t('email')}
  </FieldLabel>
  <div className="relative">
    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary z-10 pointer-events-none" />
    <FieldControl
      render={
        <Input
          className="pl-12 h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-primary/20"
        />
      }
      type="email"
      required
      placeholder={t('email_placeholder')}
      autoComplete="email"
    />
  </div>
  <FieldError className="mt-1.5 text-sm text-destructive" />
</Field>
```

- [ ] **Step P2.2.3 — Replace the Form wrapper to pass errors**

Find:
```tsx
<Form action={formAction} className="space-y-6">
  <FormErrorAlert error={state.error} />
```
Replace with:
```tsx
<Form action={formAction} errors={state.errors} className="space-y-6">
  <FormErrorAlert error={state.formError ?? state.error} />
```

### Task P2.3 — Verify and commit

- [ ] **Step P2.3.1 — Type-check**

```bash
pnpm --filter @make-the-change/web-client type-check
```
Expected: no new errors.

- [ ] **Step P2.3.2 — Commit**

```bash
git add "apps/web-client/src/app/[locale]/(auth)/actions.ts" \
  "apps/web-client/src/app/[locale]/(auth)/_components/forgot-password-form.tsx"
git commit -m "refactor(auth): migrate forgot-password to Field + Form errors pattern"
```

---

## P3 — Login

**Files:**
- Modify: `apps/web-client/src/app/[locale]/(auth)/actions.ts` (login function)
- Modify: `apps/web-client/src/app/[locale]/(auth)/_components/login-form.tsx`

### Task P3.1 — Sync and update server action

- [ ] **Step P3.1.1 — Sync**

```bash
git fetch origin
git rebase origin/main
```

- [ ] **Step P3.1.2 — Update `login` action**

In `apps/web-client/src/app/[locale]/(auth)/actions.ts`, find:
```ts
export async function login(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = getFormDataString(formData, 'email')
  const password = getFormDataString(formData, 'password')
  const returnToRaw = getFormDataString(formData, 'returnTo')

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }
```
Replace the validation block with:
```ts
export async function login(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = getFormDataString(formData, 'email')
  const password = getFormDataString(formData, 'password')
  const returnToRaw = getFormDataString(formData, 'returnTo')

  const errors: Record<string, string> = {}
  if (!email) errors.email = 'Email is required'
  if (!password) errors.password = 'Password is required'
  if (Object.keys(errors).length > 0) return { errors }
```

Then find the two `return { error: error.message }` lines (one in the mock branch, one in supabase) — change both to:
```ts
return { formError: error.message }
```
(For mock branch where the message comes from `error.message` of `signInWithPassword`.)

### Task P3.2 — Migrate `login-form.tsx`

- [ ] **Step P3.2.1 — Replace imports**

In `apps/web-client/src/app/[locale]/(auth)/_components/login-form.tsx`, replace the top imports (lines 1-22) with:

```tsx
'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Field,
  FieldControl,
  FieldError,
  FieldLabel,
  Form,
  Input,
  PasswordInput,
} from '@make-the-change/core/ui'
import { Lock, Mail } from 'lucide-react'
import { AuthSubmitButton } from '@/app/[locale]/(auth)/_components/auth-submit-button'
import { FormErrorAlert } from '@/app/[locale]/(auth)/_components/form-error-alert'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useActionState, useEffect } from 'react'
import { type AuthState, login } from '@/app/[locale]/(auth)/actions'
import { Link, useRouter } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
```

- [ ] **Step P3.2.2 — Update Form wrapper**

Find:
```tsx
<Form action={formAction} className="space-y-6">
  <input type="hidden" name="returnTo" value={returnTo} />
  <FormErrorAlert error={state.error} />
```
Replace with:
```tsx
<Form action={formAction} errors={state.errors} className="space-y-6">
  <input type="hidden" name="returnTo" value={returnTo} />
  <FormErrorAlert error={state.formError ?? state.error} />
```

- [ ] **Step P3.2.3 — Replace email field**

Find:
```tsx
<Field className="relative group">
  <Mail className="absolute left-4 top-9.5 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
  <Input
    id="email"
    name="email"
    type="email"
    label={t('email')}
    placeholder={t('email_placeholder')}
    className="pl-12 h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-primary/20"
    required
    autoComplete="email"
  />
</Field>
```
Replace with:
```tsx
<Field name="email" className="relative group">
  <FieldLabel className="block text-sm font-medium text-muted-foreground mb-1.5">
    {t('email')}
  </FieldLabel>
  <div className="relative">
    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary z-10 pointer-events-none" />
    <FieldControl
      render={
        <Input
          className="pl-12 h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-primary/20"
        />
      }
      type="email"
      required
      placeholder={t('email_placeholder')}
      autoComplete="email"
    />
  </div>
  <FieldError className="mt-1.5 text-sm text-destructive" />
</Field>
```

- [ ] **Step P3.2.4 — Replace password field**

Find:
```tsx
<Field className="relative group">
  <Lock className="absolute left-4 top-9.5 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
  <Input
    id="password"
    name="password"
    type="password"
    label={t('password')}
    placeholder="••••••••"
    className="pl-12 h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-primary/20"
    required
    autoComplete="current-password"
  />
</Field>
```
Replace with:
```tsx
<Field name="password" className="relative group">
  <FieldLabel className="block text-sm font-medium text-muted-foreground mb-1.5">
    {t('password')}
  </FieldLabel>
  <div className="relative">
    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary z-10 pointer-events-none" />
    <FieldControl
      render={
        <PasswordInput
          className="pl-12 h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-primary/20"
        />
      }
      required
      placeholder="••••••••"
      autoComplete="current-password"
    />
  </div>
  <FieldError className="mt-1.5 text-sm text-destructive" />
</Field>
```

### Task P3.3 — Verify and commit

- [ ] **Step P3.3.1 — Type-check**

```bash
pnpm --filter @make-the-change/web-client type-check
```

- [ ] **Step P3.3.2 — Manual verify autofill**

Use `verify` skill or run dev server:
1. Open `/fr/login` in Chrome with a saved password.
2. Confirm the autofill text is readable (not invisible) on both fields.
3. Try Safari if available.

- [ ] **Step P3.3.3 — Commit**

```bash
git add "apps/web-client/src/app/[locale]/(auth)/actions.ts" \
  "apps/web-client/src/app/[locale]/(auth)/_components/login-form.tsx"
git commit -m "refactor(auth): migrate login to Field + PasswordInput pattern"
```

---

## P4 — Addresses

**Files:**
- Modify: `apps/web-client/src/app/[locale]/(screens)/profile/settings/addresses/addresses-client.tsx`

### Task P4.1 — Migrate addresses-client to Field composition

- [ ] **Step P4.1.1 — Sync**

```bash
git fetch origin && git rebase origin/main
```

- [ ] **Step P4.1.2 — Update imports**

In `apps/web-client/src/app/[locale]/(screens)/profile/settings/addresses/addresses-client.tsx`, find the `@make-the-change/core/ui` import (`import { Input } from '@make-the-change/core/ui'` if you added it in P0 unification, otherwise around top of file). Replace with:

```tsx
import { Field, FieldControl, FieldError, FieldLabel, Input } from '@make-the-change/core/ui'
```

- [ ] **Step P4.1.3 — Refactor the `AddressFields` sub-component (postal + city)**

Find the postal + city block in `AddressFields` (around lines 73-89 — the two `<Input>` calls in the flex container after the postal/city label).

Replace the entire `<div className="flex gap-3">...</div>` block with:
```tsx
<div className="flex gap-3">
  <Field name="postalCode" className="w-[38%]">
    <FieldLabel className="block text-xs font-bold text-white/55 mb-1.5">
      Code postal
    </FieldLabel>
    <FieldControl
      render={<Input variant="ghost" size="lg" />}
      value={form.postalCode}
      onChange={(e) => onChange({ ...form, postalCode: (e.target as HTMLInputElement).value })}
      placeholder="1000"
      inputMode="numeric"
    />
    <FieldError className="mt-1 text-xs text-red-400" />
  </Field>
  <Field name="city" className="flex-1">
    <FieldLabel className="block text-xs font-bold text-white/55 mb-1.5">
      Ville
    </FieldLabel>
    <FieldControl
      render={<Input variant="ghost" size="lg" />}
      value={form.city}
      onChange={(e) => onChange({ ...form, city: (e.target as HTMLInputElement).value })}
      placeholder="Bruxelles"
    />
    <FieldError className="mt-1 text-xs text-red-400" />
  </Field>
</div>
```

(Note: the label "Code postal et ville" above the original block is removed since each Field now has its own label.)

### Task P4.2 — Verify and commit

- [ ] **Step P4.2.1 — Type-check**

```bash
pnpm --filter @make-the-change/web-client type-check
```

- [ ] **Step P4.2.2 — Commit**

```bash
git add "apps/web-client/src/app/[locale]/(screens)/profile/settings/addresses/addresses-client.tsx"
git commit -m "refactor(addresses): migrate AddressFields to Field composition"
```

---

## P5 — Account

**Files:**
- Modify: `apps/web-client/src/app/[locale]/(screens)/profile/account/_features/account-client.tsx`

### Task P5.1 — Migrate firstName + lastName to Field composition

- [ ] **Step P5.1.1 — Sync**

```bash
git fetch origin && git rebase origin/main
```

- [ ] **Step P5.1.2 — Add imports**

In `apps/web-client/src/app/[locale]/(screens)/profile/account/_features/account-client.tsx`, add at the top:
```tsx
import { Field, FieldControl, FieldError, FieldLabel, Input } from '@make-the-change/core/ui'
```

- [ ] **Step P5.1.3 — Replace firstName block**

Find (around lines 77-92):
```tsx
<div className="px-4 py-3.5 border-b border-white/5 focus-within:bg-white/[0.02] transition-colors">
  <label
    htmlFor="firstName"
    className="text-[10px] font-bold text-white/50 uppercase tracking-widest block mb-0.5"
  >
    Prénom
  </label>
  <input
    id="firstName"
    type="text"
    value={form.firstName}
    onChange={(e) => setForm((prev) => ({ ...prev, firstName: e.target.value }))}
    className="w-full bg-transparent text-white text-base focus:outline-none font-medium"
  />
</div>
```
Replace with:
```tsx
<Field name="firstName" className="px-4 py-3.5 border-b border-white/5 focus-within:bg-white/[0.02] transition-colors">
  <FieldLabel className="text-[10px] font-bold text-white/50 uppercase tracking-widest block mb-0.5">
    Prénom
  </FieldLabel>
  <FieldControl
    render={
      <Input
        variant="ghost"
        className="w-full bg-transparent border-0 shadow-none focus-visible:ring-0 px-0 text-base font-medium h-auto rounded-none"
      />
    }
    value={form.firstName}
    onChange={(e) => setForm((prev) => ({ ...prev, firstName: (e.target as HTMLInputElement).value }))}
  />
  <FieldError className="mt-1 text-xs text-red-400" />
</Field>
```

- [ ] **Step P5.1.4 — Replace lastName block**

Find (around lines 94-109):
```tsx
<div className="px-4 py-3.5 focus-within:bg-white/[0.02] transition-colors">
  <label
    htmlFor="lastName"
    className="text-[10px] font-bold text-white/50 uppercase tracking-widest block mb-0.5"
  >
    Nom
  </label>
  <input
    id="lastName"
    type="text"
    value={form.lastName}
    onChange={(e) => setForm((prev) => ({ ...prev, lastName: e.target.value }))}
    className="w-full bg-transparent text-white text-base focus:outline-none font-medium"
  />
</div>
```
Replace with:
```tsx
<Field name="lastName" className="px-4 py-3.5 focus-within:bg-white/[0.02] transition-colors">
  <FieldLabel className="text-[10px] font-bold text-white/50 uppercase tracking-widest block mb-0.5">
    Nom
  </FieldLabel>
  <FieldControl
    render={
      <Input
        variant="ghost"
        className="w-full bg-transparent border-0 shadow-none focus-visible:ring-0 px-0 text-base font-medium h-auto rounded-none"
      />
    }
    value={form.lastName}
    onChange={(e) => setForm((prev) => ({ ...prev, lastName: (e.target as HTMLInputElement).value }))}
  />
  <FieldError className="mt-1 text-xs text-red-400" />
</Field>
```

### Task P5.2 — Verify and commit

- [ ] **Step P5.2.1 — Type-check**

```bash
pnpm --filter @make-the-change/web-client type-check
```

- [ ] **Step P5.2.2 — Commit**

```bash
git add "apps/web-client/src/app/[locale]/(screens)/profile/account/_features/account-client.tsx"
git commit -m "refactor(account): migrate firstName/lastName to Field composition"
```

---

## P6 — Checkout infos (validation custom async)

**Files:**
- Modify: `apps/web-client/src/app/[locale]/(screens)/products/checkout/infos/infos-client.tsx`

This step is the most complex. The original file uses a manual state machine (`ValidationPhase`) for async address validation. We replace it with `validate` prop on `Field.Root` for the `street` field (async API call). The other fields use HTML constraints.

### Task P6.1 — Migrate checkout infos to Field composition

- [ ] **Step P6.1.1 — Sync**

```bash
git fetch origin && git rebase origin/main
```

- [ ] **Step P6.1.2 — Update imports**

In `apps/web-client/src/app/[locale]/(screens)/products/checkout/infos/infos-client.tsx`, find:
```tsx
import { Input } from '@make-the-change/core/ui'
```
Replace with:
```tsx
import {
  Field,
  FieldControl,
  FieldError,
  FieldLabel,
  Form,
  Input,
} from '@make-the-change/core/ui'
```

- [ ] **Step P6.1.3 — Remove manual `errors` object and `touched` state**

Find (around lines 41-63):
```tsx
const [touched, setTouched] = useState<Record<string, boolean>>({})

// Address validation state machine
const [validationPhase, setValidationPhase] = useState<ValidationPhase>('idle')
const [validationSuggestion, setValidationSuggestion] = useState<ValidationSuggestion | null>(null)

const hasSavedAddresses = savedAddresses.length > 0

const errors = {
  email: !isValidEmail(customer.email) ? 'Adresse e-mail invalide' : null,
  name: customer.name.trim().length < 2 ? 'Au moins 2 caractères requis' : null,
  street: customer.street.trim().length < 4 ? 'Adresse trop courte' : null,
  postalCode: customer.postalCode.trim().length < 4 ? 'Code postal invalide' : null,
  city: customer.city.trim().length < 2 ? 'Ville requise' : null,
}

const canContinue = Object.values(errors).every((e) => e === null)

function touch(field: string) {
  setTouched((v) => ({ ...v, [field]: true }))
}
```
Replace with:
```tsx
// Address validation state machine
const [validationPhase, setValidationPhase] = useState<ValidationPhase>('idle')
const [validationSuggestion, setValidationSuggestion] = useState<ValidationSuggestion | null>(null)

const hasSavedAddresses = savedAddresses.length > 0

const canContinue =
  isValidEmail(customer.email) &&
  customer.name.trim().length >= 2 &&
  customer.street.trim().length >= 4 &&
  customer.postalCode.trim().length >= 4 &&
  customer.city.trim().length >= 2
```

(The `errors`/`touched` machinery is replaced by Field native validation + `data-touched`.)

- [ ] **Step P6.1.4 — Remove all `touch()` calls and `touched.X &&` usage**

In the JSX further down, remove every occurrence of `onBlur={() => touch('X')}` from the Input components and remove every `touched.X && errors.X ? errors.X : undefined` from the `error` props (these props won't exist on the new `Input`).

- [ ] **Step P6.1.5 — Replace email Input block**

Find:
```tsx
<Input
  id="checkout-email"
  label="E-mail"
  variant="ghost"
  size="lg"
  value={customer.email}
  onChange={(e) => setCustomer((v) => ({ ...v, email: e.target.value }))}
  onBlur={() => touch('email')}
  placeholder="votre@email.com"
  type="email"
  autoComplete="email"
  error={touched.email && errors.email ? errors.email : undefined}
/>
```
Replace with:
```tsx
<Field name="email">
  <FieldLabel className="block text-xs font-bold text-white/55 mb-1.5">E-mail</FieldLabel>
  <FieldControl
    render={<Input variant="ghost" size="lg" />}
    type="email"
    required
    value={customer.email}
    onChange={(e) => setCustomer((v) => ({ ...v, email: (e.target as HTMLInputElement).value }))}
    placeholder="votre@email.com"
    autoComplete="email"
  />
  <FieldError className="mt-1 text-xs text-red-400" match="valueMissing">
    E-mail requis
  </FieldError>
  <FieldError className="mt-1 text-xs text-red-400" match="typeMismatch">
    Format e-mail invalide
  </FieldError>
</Field>
```

- [ ] **Step P6.1.6 — Replace name Input block**

Find the name Input and replace with:
```tsx
<Field name="name">
  <FieldLabel className="block text-xs font-bold text-white/55 mb-1.5">Nom complet</FieldLabel>
  <FieldControl
    render={<Input variant="ghost" size="lg" />}
    required
    minLength={2}
    value={customer.name}
    onChange={(e) => setCustomer((v) => ({ ...v, name: (e.target as HTMLInputElement).value }))}
    placeholder="Prénom Nom"
    autoComplete="name"
  />
  <FieldError className="mt-1 text-xs text-red-400" match="valueMissing">
    Nom requis
  </FieldError>
  <FieldError className="mt-1 text-xs text-red-400" match="tooShort">
    Au moins 2 caractères requis
  </FieldError>
</Field>
```

- [ ] **Step P6.1.7 — Replace street Field (with async validate)**

Find the street block using `AddressAutocompleteInput` and replace the outer container with:
```tsx
<Field
  name="street"
  validationMode="onBlur"
  validate={async (value) => {
    if (typeof value !== 'string' || value.trim().length < 4) {
      return 'Adresse trop courte'
    }
    return null
  }}
>
  <FieldLabel className="block text-xs font-bold text-white/55 mb-1.5">
    Rue et numéro
  </FieldLabel>
  <AddressAutocompleteInput
    id="checkout-street"
    value={customer.street}
    country={customer.country}
    placeholder="Rue de la Paix 10"
    className="h-13 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-base text-white placeholder:text-white/25 w-full"
    onChange={(street) => { setCustomer((v) => ({ ...v, street })); resetValidation() }}
    onSelect={({ street, postalCode, city }) => {
      setCustomer((v) => ({ ...v, street, postalCode, city }))
      resetValidation()
    }}
  />
  <FieldError className="mt-1 text-xs text-red-400" />
</Field>
```

(The full address validation API call is handled by the existing `validateAddress()` function on submit — `validate` prop only checks the local length constraint to avoid spamming the API on every blur.)

- [ ] **Step P6.1.8 — Replace postal + city Field block**

Find the flex block containing both postal and city Inputs and replace with:
```tsx
<div className="flex gap-3">
  <Field name="postalCode" className="w-[38%]">
    <FieldLabel className="block text-xs font-bold text-white/55 mb-1.5">
      Code postal
    </FieldLabel>
    <FieldControl
      render={<Input variant="ghost" size="lg" />}
      required
      minLength={4}
      value={customer.postalCode}
      onChange={(e) => {
        setCustomer((v) => ({ ...v, postalCode: (e.target as HTMLInputElement).value }))
        resetValidation()
      }}
      placeholder="1000"
      inputMode="numeric"
      autoComplete="postal-code"
    />
    <FieldError className="mt-1 text-xs text-red-400" match="valueMissing">
      Requis
    </FieldError>
    <FieldError className="mt-1 text-xs text-red-400" match="tooShort">
      Code postal invalide
    </FieldError>
  </Field>
  <Field name="city" className="flex-1">
    <FieldLabel className="block text-xs font-bold text-white/55 mb-1.5">
      Ville
    </FieldLabel>
    <FieldControl
      render={<Input variant="ghost" size="lg" />}
      required
      minLength={2}
      value={customer.city}
      onChange={(e) => {
        setCustomer((v) => ({ ...v, city: (e.target as HTMLInputElement).value }))
        resetValidation()
      }}
      placeholder="Bruxelles"
      autoComplete="address-level2"
    />
    <FieldError className="mt-1 text-xs text-red-400" match="valueMissing">
      Ville requise
    </FieldError>
  </Field>
</div>
```

### Task P6.2 — Verify and commit

- [ ] **Step P6.2.1 — Type-check**

```bash
pnpm --filter @make-the-change/web-client type-check
```

- [ ] **Step P6.2.2 — Manual verify (critical)**

Use `verify` skill or run dev server:
1. Open `/fr/products/checkout/infos`.
2. Try to submit with empty fields → each field shows native error.
3. Type invalid email → blur → "Format e-mail invalide".
4. Type too-short address → blur → "Adresse trop courte".
5. Type valid address that fails server validation → "Adresse non reconnue" card shows (existing flow preserved).

- [ ] **Step P6.2.3 — Commit**

```bash
git add "apps/web-client/src/app/[locale]/(screens)/products/checkout/infos/infos-client.tsx"
git commit -m "refactor(checkout): migrate infos to Field composition with async validate"
```

---

## P7 — Register wizard

**Files:**
- Modify: `apps/web-client/src/app/[locale]/(auth)/actions.ts` (register function)
- Modify: `apps/web-client/src/app/[locale]/(auth)/_components/register-form.tsx`

Strategy from spec section 4.6: single `<Form action={formAction}>` wraps all 3 steps. Steps 1-2 buttons are `type="button"` (navigation only), step 3 button is `type="submit"`. All Fields stay mounted (`hidden` attribute or conditional rendering with state preservation via `formValues`).

### Task P7.1 — Migrate register server action

- [ ] **Step P7.1.1 — Sync**

```bash
git fetch origin && git rebase origin/main
```

- [ ] **Step P7.1.2 — Update `register` action**

In `apps/web-client/src/app/[locale]/(auth)/actions.ts`, find the validation block in `register`:
```ts
if (!email || !password) {
  return { error: 'Email and password are required' }
}

if (password !== confirmPassword) {
  return { error: 'Passwords do not match' }
}

if (password.length < 8) {
  return { error: 'Password must be at least 8 characters' }
}
```
Replace with:
```ts
const errors: Record<string, string> = {}
if (!firstName) errors.firstName = 'Prénom requis'
if (!lastName) errors.lastName = 'Nom requis'
if (!email) errors.email = 'Email requis'
if (!password) errors.password = 'Mot de passe requis'
if (password && password.length < 8) errors.password = '8 caractères minimum'
if (password && password !== confirmPassword) errors.confirmPassword = 'Les mots de passe ne correspondent pas'
if (Object.keys(errors).length > 0) return { errors }
```

Find the existing `return { error: error.message }` for supabase signup and replace with:
```ts
return { formError: error.message }
```
Same for "An account with this email already exists" — change to:
```ts
return { errors: { email: 'Un compte avec cet email existe déjà' } }
```

### Task P7.2 — Migrate register-form.tsx

- [ ] **Step P7.2.1 — Update imports**

In `apps/web-client/src/app/[locale]/(auth)/_components/register-form.tsx`, replace the imports block (lines 1-13) with:

```tsx
'use client'

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Field,
  FieldControl,
  FieldError,
  FieldLabel,
  Form,
  Input,
  PasswordInput,
} from '@make-the-change/core/ui'
```

(Removed `LegacyInput as Input`; added `FieldControl, FieldError, FieldLabel, PasswordInput`.)

Update the import in the same file from `Form,` block to use `errors` prop later.

- [ ] **Step P7.2.2 — Pass errors to Form wrapper**

Find:
```tsx
<Form action={formAction} onSubmit={handleFormSubmit} className="space-y-8">
```
Replace with:
```tsx
<Form action={formAction} errors={state.errors} onSubmit={handleFormSubmit} className="space-y-8">
```

Find `<FormErrorAlert error={state.error} />` and replace with:
```tsx
<FormErrorAlert error={state.formError ?? state.error} />
```

- [ ] **Step P7.2.3 — Migrate step 1 fields (firstName, lastName)**

Find the `{step === 1 && (...)}` block. Replace its content with:
```tsx
{step === 1 && (
  <div className="grid gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
    <Field name="firstName" className="relative group">
      <FieldLabel className="block text-sm font-medium text-muted-foreground mb-1.5">
        {t('first_name')}
      </FieldLabel>
      <div className="relative">
        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary z-10 pointer-events-none" />
        <FieldControl
          render={
            <Input className="pl-12 h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-primary/20" />
          }
          type="text"
          required
          placeholder={t('first_name_placeholder')}
          autoComplete="given-name"
          value={formValues.firstName}
          onChange={(event) =>
            setFormValues((prev) => ({ ...prev, firstName: (event.target as HTMLInputElement).value }))
          }
        />
      </div>
      <FieldError className="mt-1.5 text-sm text-destructive" />
    </Field>
    <Field name="lastName" className="relative group">
      <FieldLabel className="block text-sm font-medium text-muted-foreground mb-1.5">
        {t('last_name')}
      </FieldLabel>
      <div className="relative">
        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary z-10 pointer-events-none" />
        <FieldControl
          render={
            <Input className="pl-12 h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-primary/20" />
          }
          type="text"
          required
          placeholder={t('last_name_placeholder')}
          autoComplete="family-name"
          value={formValues.lastName}
          onChange={(event) =>
            setFormValues((prev) => ({ ...prev, lastName: (event.target as HTMLInputElement).value }))
          }
        />
      </div>
      <FieldError className="mt-1.5 text-sm text-destructive" />
    </Field>
  </div>
)}
```

- [ ] **Step P7.2.4 — Migrate step 2 fields (email, password, confirmPassword)**

Find the `{step === 2 && (...)}` block. Replace its content with:
```tsx
{step === 2 && (
  <div className="grid gap-4 animate-in fade-in slide-in-from-right-4 duration-500">
    <Field name="email">
      <FieldLabel className="block text-sm font-medium text-muted-foreground mb-1.5">
        {t('email')}
      </FieldLabel>
      <FieldControl
        render={
          <Input className="h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-primary/20" />
        }
        type="email"
        required
        placeholder={t('email_placeholder')}
        autoComplete="email"
        value={formValues.email}
        onChange={(event) =>
          setFormValues((prev) => ({ ...prev, email: (event.target as HTMLInputElement).value }))
        }
      />
      <FieldError className="mt-1.5 text-sm text-destructive" />
    </Field>

    <Field name="password">
      <FieldLabel className="block text-sm font-medium text-muted-foreground mb-1.5">
        {t('password')}
      </FieldLabel>
      <FieldControl
        render={
          <PasswordInput className="h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-primary/20" />
        }
        required
        minLength={8}
        placeholder="••••••••"
        autoComplete="new-password"
        value={formValues.password}
        onChange={(event) =>
          setFormValues((prev) => ({ ...prev, password: (event.target as HTMLInputElement).value }))
        }
      />
      <FieldError className="mt-1.5 text-sm text-destructive" match="valueMissing">
        Requis
      </FieldError>
      <FieldError className="mt-1.5 text-sm text-destructive" match="tooShort">
        8 caractères minimum
      </FieldError>
    </Field>

    <Field
      name="confirmPassword"
      validationMode="onBlur"
      validate={(value) =>
        typeof value === 'string' && value !== formValues.password ? t('passwords_mismatch') : null
      }
    >
      <FieldLabel className="block text-sm font-medium text-muted-foreground mb-1.5">
        {t('confirm_password')}
      </FieldLabel>
      <FieldControl
        render={
          <PasswordInput className="h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-primary/20" />
        }
        required
        placeholder="••••••••"
        autoComplete="new-password"
        value={formValues.confirmPassword}
        onChange={(event) =>
          setFormValues((prev) => ({ ...prev, confirmPassword: (event.target as HTMLInputElement).value }))
        }
      />
      <FieldError className="mt-1.5 text-sm text-destructive" />
    </Field>
  </div>
)}
```

- [ ] **Step P7.2.5 — Verify hidden inputs are still in place**

The current file has hidden inputs at the bottom (around lines 500-514) that propagate values between steps. **Keep them as-is** — they ensure that when step 3 submits the form, the server receives all values even if Field state is unmounted (steps 1-2 are now conditional). They are the safety net.

### Task P7.3 — Verify and commit

- [ ] **Step P7.3.1 — Type-check**

```bash
pnpm --filter @make-the-change/web-client type-check
```

- [ ] **Step P7.3.2 — Manual verify wizard flow**

Use `verify` skill or run dev server:
1. Open `/fr/register`.
2. Fill step 1 (firstName, lastName) → click "Continuer".
3. Reload the page → step 1 should be restored (sessionStorage works).
4. Re-fill step 1 → step 2 → empty password → "Requis" error.
5. Password < 8 chars → "8 caractères minimum".
6. Password mismatch in confirmPassword → "Les mots de passe ne correspondent pas".
7. Valid step 2 → step 3 → accept terms → submit → success screen.
8. Try browser back button at any step → navigates between steps correctly.

- [ ] **Step P7.3.3 — Commit**

```bash
git add "apps/web-client/src/app/[locale]/(auth)/actions.ts" \
  "apps/web-client/src/app/[locale]/(auth)/_components/register-form.tsx"
git commit -m "refactor(auth): migrate register wizard to Field composition, single Form"
```

---

## P8 — Contribute + Support guest emails

**Files:**
- Modify: `apps/web-client/src/app/[locale]/(screens)/projects/[slug]/contribute/_components/project-contribute-one-flow.tsx`
- Modify: `apps/web-client/src/app/[locale]/(screens)/projects/[slug]/support/_components/project-support-one-flow.tsx`

### Task P8.1 — Migrate contribute guest email

- [ ] **Step P8.1.1 — Sync**

```bash
git fetch origin && git rebase origin/main
```

- [ ] **Step P8.1.2 — Update imports**

In `apps/web-client/src/app/[locale]/(screens)/projects/[slug]/contribute/_components/project-contribute-one-flow.tsx`, find the `@make-the-change/core/ui` import (it contains `Input` from P0 unification). Add `Field`, `FieldControl`, `FieldError`, `FieldLabel`:

```tsx
import {
  // ... existing imports
  Field,
  FieldControl,
  FieldError,
  FieldLabel,
  Input,
} from '@make-the-change/core/ui'
```

- [ ] **Step P8.1.3 — Replace the guest-email block**

Find (around lines 636-648):
```tsx
<div className="w-full">
  <Input
    label="Email de confirmation"
    type="email"
    variant="ghost"
    size="lg"
    value={guestEmail}
    onChange={(event) => setGuestEmail(event.target.value)}
    placeholder="vous@email.com"
    required
    error={guestEmailError || undefined}
    helpText="Reçu de contribution et suivi du projet. Ce reçu n'est pas un reçu fiscal déductible."
    labelClassName="text-xs font-bold text-white/60"
  />
</div>
```
Replace with:
```tsx
<Field name="guestEmail" className="w-full">
  <FieldLabel className="mb-1.5 block text-xs font-bold text-white/60">
    Email de confirmation
  </FieldLabel>
  <FieldControl
    render={<Input variant="ghost" size="lg" />}
    type="email"
    required
    value={guestEmail}
    onChange={(event) => setGuestEmail((event.target as HTMLInputElement).value)}
    placeholder="vous@email.com"
  />
  <p className="mt-1.5 text-[11px] text-white/35">
    Reçu de contribution et suivi du projet. Ce reçu n&apos;est pas un reçu fiscal déductible.
  </p>
  {guestEmailError && (
    <p className="mt-1.5 text-xs font-semibold text-destructive">{guestEmailError}</p>
  )}
  <FieldError className="mt-1.5 text-xs font-semibold text-destructive" />
</Field>
```

(We keep `guestEmailError` as a local validation message displayed explicitly because it's not server-driven — it comes from local form-state logic. `FieldError` covers native HTML validation.)

### Task P8.2 — Migrate support guest email

- [ ] **Step P8.2.1 — Update imports**

Same change in `project-support-one-flow.tsx` imports.

- [ ] **Step P8.2.2 — Replace the guest-email block**

Find (around lines 964-983):
```tsx
<div className="w-full">
  <Input
    label="Email de confirmation"
    type="email"
    variant="ghost"
    size="lg"
    value={guestEmail}
    onChange={(event) => setGuestEmail(event.target.value)}
    placeholder="vous@email.com"
    required
    error={guestEmailError || undefined}
    helpText="Reçu de contribution et suivi du projet. Ce reçu n'est pas un reçu fiscal déductible."
    labelClassName="text-xs font-bold text-white/60"
  />
</div>
```
Replace with the same block as P8.1.3 (identical structure).

### Task P8.3 — Verify and commit

- [ ] **Step P8.3.1 — Type-check**

```bash
pnpm --filter @make-the-change/web-client type-check
```

- [ ] **Step P8.3.2 — Commit**

```bash
git add "apps/web-client/src/app/[locale]/(screens)/projects/[slug]/contribute/_components/project-contribute-one-flow.tsx" \
  "apps/web-client/src/app/[locale]/(screens)/projects/[slug]/support/_components/project-support-one-flow.tsx"
git commit -m "refactor(projects): migrate guest-email to Field composition in contribute and support"
```

---

## P9 — Cleanup Legacy

**Files:**
- Modify: `packages/core/src/shared/ui/base/input.tsx` (remove Legacy exports)
- Modify: `packages/core/src/shared/ui/base/textarea.tsx` (remove Legacy exports)
- Modify: `packages/core/src/shared/ui/index.ts`

### Task P9.1 — Verify no apps depend on Legacy components

- [ ] **Step P9.1.1 — Sync**

```bash
git fetch origin && git rebase origin/main
```

- [ ] **Step P9.1.2 — Grep for Legacy usage**

Run:
```bash
grep -rn "LegacyInput\|LegacyTextArea\|LegacyPasswordInput" apps/
```
Expected: zero matches. If any match exists, abort P9 and migrate the file first.

- [ ] **Step P9.1.3 — Verify forgot-password/login/register/theme-selection don't import Legacy aliases**

Run:
```bash
grep -rn "LegacyInput as Input" apps/web-client/src
```
Expected: zero matches (P2/P3/P7 should have removed all alias usages).

### Task P9.2 — Remove Legacy components from core

- [ ] **Step P9.2.1 — Strip Legacy from `input.tsx`**

In `packages/core/src/shared/ui/base/input.tsx`, **delete everything from the comment `LEGACY API — kept during transition, removed in P9` onwards** (this includes `LegacyInputVariant`, `LegacyInputProps`, `LegacyInput`, and `LegacyPasswordInput`). The file should end with the new `Input` component only.

The final file should look like:
```tsx
'use client'

import { Input as InputPrimitive } from '@base-ui/react/input'
import type { InputHTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { cn } from '../utils'
import { inputVariants, type InputVariantProps } from './input-variants'

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> &
  InputVariantProps

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, ...props }, ref) => (
    <InputPrimitive
      ref={ref}
      className={cn(inputVariants({ variant, size }), className)}
      {...props}
    />
  ),
)
Input.displayName = 'Input'
```

- [ ] **Step P9.2.2 — Strip Legacy from `textarea.tsx`**

In `packages/core/src/shared/ui/base/textarea.tsx`, delete everything from `LEGACY API` comment onwards. The final file should be:
```tsx
'use client'

import type { InputHTMLAttributes } from 'react'
import { forwardRef } from 'react'

import { cn } from '../utils'
import { textareaVariants, type TextAreaVariantProps } from './input-variants'

export type TextAreaProps = Omit<InputHTMLAttributes<HTMLTextAreaElement>, 'size'> &
  TextAreaVariantProps

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, variant, size, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(textareaVariants({ variant, size }), className)}
      {...props}
    />
  ),
)
TextArea.displayName = 'TextArea'
```

- [ ] **Step P9.2.3 — Remove Legacy exports from `index.ts`**

In `packages/core/src/shared/ui/index.ts`, find the exports block we set up in P0.7. Replace:
```ts
export { Input, LegacyInput, LegacyPasswordInput, type InputProps, type LegacyInputProps } from './base/input'
```
with:
```ts
export { Input, type InputProps } from './base/input'
```

And replace:
```ts
export {
  TextArea,
  TextArea as Textarea,
  LegacyTextArea,
  type TextAreaProps,
  type LegacyTextAreaProps,
} from './base/textarea'
```
with:
```ts
export { TextArea, TextArea as Textarea, type TextAreaProps } from './base/textarea'
```

### Task P9.3 — Verify and commit

- [ ] **Step P9.3.1 — Type-check whole web-client**

```bash
pnpm --filter @make-the-change/web-client type-check
```
Expected: no errors related to Input/TextArea. If any file still imports `LegacyInput`, this catches it.

- [ ] **Step P9.3.2 — Run core tests**

```bash
pnpm --filter @make-the-change/core test
```
Expected: all tests pass.

- [ ] **Step P9.3.3 — Final grep verification**

```bash
grep -rn "Legacy" packages/core/src/shared/ui/
```
Expected: zero matches.

```bash
grep -rn "react-hook-form" packages/core/
```
Expected: zero matches.

- [ ] **Step P9.3.4 — Commit**

```bash
git add packages/core/src/shared/ui/base/input.tsx \
  packages/core/src/shared/ui/base/textarea.tsx \
  packages/core/src/shared/ui/index.ts
git commit -m "feat(core): remove Legacy* components — migration to Field pattern complete"
```

---

## Final verification (after P9)

Run all spec success criteria from section 9 of the spec:

- [ ] **Criterion 1 — Zero raw form `<input>`/`<textarea>` in web-client**

```bash
grep -rn "<input " apps/web-client/src/app --include="*.tsx" | grep -v "type=\"hidden\""
```
Expected: only amount inputs (`type="text"` with `text-7xl`) in contribute/support flows.

- [ ] **Criterion 2 — Zero Legacy usage**

```bash
grep -rn "Legacy\(Input\|TextArea\|PasswordInput\)" apps/
```
Expected: empty.

- [ ] **Criterion 3 — react-hook-form gone**

```bash
grep "react-hook-form" packages/core/package.json
```
Expected: empty.

- [ ] **Criterion 4 — All tests pass**

```bash
pnpm --filter @make-the-change/core test
pnpm --filter @make-the-change/web-client type-check
```
Expected: 36+ tests passing in core, type-check clean except pre-existing errors.

- [ ] **Criterion 8 — Doc exists**

```bash
ls docs/02-product/design-system/forms.md
```
Expected: file present.

---

## Plan complete

Total: 10 étapes (P0–P9), ~35 sous-tâches, ~80 steps.

Each step is bite-sized (2-5 min), includes exact code where needed, and ends with a commit. The plan respects the spec's coexistence strategy (LegacyInput stays until P9) so TypeScript never breaks between steps.
