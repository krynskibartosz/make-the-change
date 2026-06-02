# Input Unification — ghost variant + web-client migration

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `ghost` variant to the `Input` and `TextArea` components in `packages/core`, then replace every raw `<input>`/`<textarea>` used as a form field in `web-client` with those design-system components.

**Architecture:** The `Input` component (`packages/core/src/shared/ui/base/input.tsx`) wraps `@base-ui/react/input` and already handles label, error, aria-describedby, and password toggle. The `ghost` variant extends it with hardcoded dark-theme colours (`bg-white/[0.04] border-white/10 text-white`) for screens that use a fixed `#0B0F15` background rather than CSS theme variables. Text colours are moved from the shared base classes into each variant so that `ghost` can override them cleanly via `tailwind-merge`. The same pattern applies to `TextArea`. Web-client migrations then import `Input`/`TextArea` from `@make-the-change/core/ui` and drop the duplicated `INPUT_BASE`/`INPUT_CLASS` string constants that had already diverged between files.

**Tech Stack:** TypeScript, React 19, Next.js 16 App Router, `@base-ui/react` ^1.1, Tailwind CSS, `tailwind-merge`, Vitest + @testing-library/react

---

## Scope

### In scope
| File | What changes |
|---|---|
| `packages/core/src/shared/ui/base/input.tsx` | Add `ghost` variant, move text colours into variant map |
| `packages/core/src/shared/ui/base/textarea.tsx` | Same |
| `packages/core/src/shared/ui/base/__tests__/input.test.tsx` | **New** — ghost variant tests |
| `apps/web-client/src/app/[locale]/(screens)/products/checkout/infos/infos-client.tsx` | Replace 4 raw inputs, drop `INPUT_BASE`/`INPUT_CLASS` |
| `apps/web-client/src/app/[locale]/(screens)/profile/settings/addresses/addresses-client.tsx` | Replace 2 raw inputs, drop constants, fix h-12/h-13 divergence |
| `apps/web-client/src/app/[locale]/(site)/contact/actions.ts` | **New** — server action (form is currently non-functional) |
| `apps/web-client/src/app/[locale]/(site)/contact/page.tsx` | Wire server action, replace email `<input>` + `<textarea>` |
| `apps/web-client/src/app/[locale]/(screens)/projects/[slug]/contribute/_components/project-contribute-one-flow.tsx` | Replace guest-email input only |
| `apps/web-client/src/app/[locale]/(screens)/projects/[slug]/support/_components/project-support-one-flow.tsx` | Replace guest-email input only |

### Intentionally NOT migrated
- **`account-client.tsx`** — transparent borderless "iOS-settings" inputs inside a card; the container provides the visual affordance, adding a border via `ghost` would change the design.
- **Amount inputs** in contribute/support — `text-7xl` auto-sizing custom layout, not a form field.
- **Search bars** in courses/atlas — "label as container" pattern with icon outside; the Input component would restructure the DOM.
- **`<input type="range">`** in academy — use Slider from core (separate scope).
- **`<input type="radio">`** in experience-slot-picker — use Radio from core (separate scope).
- **`<select>`** everywhere — separate component (separate scope).

---

## Task 1 — Add `ghost` variant to `Input` (core)

**Files:**
- Create: `packages/core/src/shared/ui/base/__tests__/input.test.tsx`
- Modify: `packages/core/src/shared/ui/base/input.tsx`

- [ ] **Step 1.1 — Write the failing tests**

Create `packages/core/src/shared/ui/base/__tests__/input.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { Input } from '../input'

describe('Input', () => {
  it('renders an accessible text input for ghost variant', () => {
    render(<Input variant="ghost" placeholder="Email" />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('associates label with input via htmlFor', () => {
    render(<Input id="test-email" label="Email" variant="ghost" />)
    expect(screen.getByText('Email')).toHaveAttribute('for', 'test-email')
    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'test-email')
  })

  it('shows error text and marks input aria-invalid', () => {
    render(<Input variant="ghost" error="Champ requis" />)
    expect(screen.getByText('Champ requis')).toBeVisible()
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('shows helpText when no error', () => {
    render(<Input variant="ghost" helpText="Format : vous@email.com" />)
    expect(screen.getByText('Format : vous@email.com')).toBeVisible()
  })

  it('shows required marker in label', () => {
    render(<Input variant="ghost" label="Email" required />)
    expect(screen.getByRole('textbox')).toHaveAttribute('required')
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('default variant still renders', () => {
    render(<Input variant="default" label="Name" />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })
})
```

- [ ] **Step 1.2 — Run tests to verify they fail (ghost variant doesn't exist yet)**

```bash
pnpm --filter @make-the-change/core test
```

Expected: tests for ghost variant **fail** with type error on `variant="ghost"`.

- [ ] **Step 1.3 — Add ghost variant to `input.tsx`**

Open `packages/core/src/shared/ui/base/input.tsx`.

**a) Extend the type (line 9):**
```ts
// Before
export type InputVariant = 'default' | 'outlined' | 'filled'

// After
export type InputVariant = 'default' | 'outlined' | 'filled' | 'ghost'
```

**b) Move text colours into variant map and add ghost (around line 75):**
```ts
// Before
const variantClasses = {
  default:
    'bg-background/70 backdrop-blur-sm border border-[hsl(var(--border)/0.8)] shadow-sm dark:dark:bg-background/90',
  outlined: 'bg-transparent border-2 dark:border-[hsl(var(--border)/0.8)]',
  filled:
    'bg-muted/70 backdrop-blur-sm border border-[hsl(var(--border)/0.7)] shadow-sm dark:bg-muted/50 dark:border-[hsl(var(--border))]',
}

// After
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
```

**c) Remove the standalone text-colour line from the `cn()` call (around line 128):**
```tsx
// Before — inside the InputPrimitive className={cn(...)}
'text-foreground placeholder:text-muted-foreground/60',

// After — delete that line entirely (colours now live in variantClasses)
```

The final `cn()` call for `InputPrimitive` should look like:
```tsx
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
```

- [ ] **Step 1.4 — Run tests to verify they pass**

```bash
pnpm --filter @make-the-change/core test
```

Expected: all 6 tests pass.

- [ ] **Step 1.5 — Commit**

```bash
git add packages/core/src/shared/ui/base/input.tsx packages/core/src/shared/ui/base/__tests__/input.test.tsx
git commit -m "feat(core): add ghost variant to Input for dark-bg screens"
```

---

## Task 2 — Add `ghost` variant to `TextArea` (core)

**Files:**
- Modify: `packages/core/src/shared/ui/base/textarea.tsx`

- [ ] **Step 2.1 — Extend type and add variant**

Open `packages/core/src/shared/ui/base/textarea.tsx`.

**a) Extend the type (line 8):**
```ts
// Before
export type TextAreaVariant = 'default' | 'outlined' | 'filled'

// After
export type TextAreaVariant = 'default' | 'outlined' | 'filled' | 'ghost'
```

**b) Move text colours into variant map and add ghost (around line 62):**
```ts
// Before
const variantClasses = {
  default: 'bg-background/70 backdrop-blur-sm border shadow-sm',
  outlined: 'bg-transparent border-2 border-[hsl(var(--border))]',
  filled: 'bg-muted/70 backdrop-blur-sm border border-[hsl(var(--border)/0.7)] shadow-sm',
}

// After
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
```

**c) Remove standalone text-colour line from `cn()` (around line 107):**
```tsx
// Delete this line:
'text-foreground placeholder:text-muted-foreground/60',
```

- [ ] **Step 2.2 — Run tests**

```bash
pnpm --filter @make-the-change/core test
```

Expected: all tests still pass.

- [ ] **Step 2.3 — Commit**

```bash
git add packages/core/src/shared/ui/base/textarea.tsx
git commit -m "feat(core): add ghost variant to TextArea for dark-bg screens"
```

---

## Task 3 — Migrate `infos-client.tsx` (checkout)

**Files:**
- Modify: `apps/web-client/src/app/[locale]/(screens)/products/checkout/infos/infos-client.tsx`

- [ ] **Step 3.1 — Update imports**

At the top of the file, add `Input` to the existing import block (create it if there is none from core):

```tsx
import { Input } from '@make-the-change/core/ui'
```

- [ ] **Step 3.2 — Delete the two CSS string constants**

Remove lines 30-33:
```tsx
// DELETE these two lines entirely:
const INPUT_BASE =
  'h-13 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-base text-white placeholder:text-white/25'
const INPUT_CLASS = `${INPUT_BASE} w-full`
```

- [ ] **Step 3.3 — Replace the email `<input>` (around line 192)**

```tsx
// Before
<div className="space-y-1">
  <label htmlFor="checkout-email" className="block text-xs font-bold text-white/55">E-mail</label>
  <input
    id="checkout-email"
    value={customer.email}
    onChange={(e) => setCustomer((v) => ({ ...v, email: e.target.value }))}
    onBlur={() => touch('email')}
    placeholder="votre@email.com"
    type="email"
    autoComplete="email"
    className={INPUT_CLASS}
  />
  {touched.email && errors.email && <p className={ERROR_CLASS}>{errors.email}</p>}
</div>

// After
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

- [ ] **Step 3.4 — Replace the name `<input>` (around line 208)**

```tsx
// Before
<div className="space-y-1">
  <label htmlFor="checkout-name" className="block text-xs font-bold text-white/55">Nom complet</label>
  <input
    id="checkout-name"
    value={customer.name}
    onChange={(e) => setCustomer((v) => ({ ...v, name: e.target.value }))}
    onBlur={() => touch('name')}
    placeholder="Prénom Nom"
    autoComplete="name"
    className={INPUT_CLASS}
  />
  {touched.name && errors.name && <p className={ERROR_CLASS}>{errors.name}</p>}
</div>

// After
<Input
  id="checkout-name"
  label="Nom complet"
  variant="ghost"
  size="lg"
  value={customer.name}
  onChange={(e) => setCustomer((v) => ({ ...v, name: e.target.value }))}
  onBlur={() => touch('name')}
  placeholder="Prénom Nom"
  autoComplete="name"
  error={touched.name && errors.name ? errors.name : undefined}
/>
```

- [ ] **Step 3.5 — Replace the postal + city `<input>` pair (around line 242)**

Replace the entire "Code postal et ville" block:

```tsx
// Before
<div className="space-y-1">
  <label className="block text-xs font-bold text-white/55">Code postal et ville</label>
  <div className="flex gap-3">
    <div className="w-[38%]">
      <input
        id="checkout-postal"
        value={customer.postalCode}
        onChange={(e) => { setCustomer((v) => ({ ...v, postalCode: e.target.value })); resetValidation() }}
        onBlur={() => touch('postalCode')}
        placeholder="1000"
        inputMode="numeric"
        autoComplete="postal-code"
        className={`${INPUT_BASE} w-full`}
      />
      {touched.postalCode && errors.postalCode && <p className={ERROR_CLASS}>{errors.postalCode}</p>}
    </div>
    <div className="flex-1">
      <input
        id="checkout-city"
        value={customer.city}
        onChange={(e) => { setCustomer((v) => ({ ...v, city: e.target.value })); resetValidation() }}
        onBlur={() => touch('city')}
        placeholder="Bruxelles"
        autoComplete="address-level2"
        className={`${INPUT_BASE} w-full`}
      />
      {touched.city && errors.city && <p className={ERROR_CLASS}>{errors.city}</p>}
    </div>
  </div>
</div>

// After
<div className="flex gap-3">
  <div className="w-[38%]">
    <Input
      id="checkout-postal"
      label="Code postal"
      variant="ghost"
      size="lg"
      value={customer.postalCode}
      onChange={(e) => { setCustomer((v) => ({ ...v, postalCode: e.target.value })); resetValidation() }}
      onBlur={() => touch('postalCode')}
      placeholder="1000"
      inputMode="numeric"
      autoComplete="postal-code"
      error={touched.postalCode && errors.postalCode ? errors.postalCode : undefined}
    />
  </div>
  <div className="flex-1">
    <Input
      id="checkout-city"
      label="Ville"
      variant="ghost"
      size="lg"
      value={customer.city}
      onChange={(e) => { setCustomer((v) => ({ ...v, city: e.target.value })); resetValidation() }}
      onBlur={() => touch('city')}
      placeholder="Bruxelles"
      autoComplete="address-level2"
      error={touched.city && errors.city ? errors.city : undefined}
    />
  </div>
</div>
```

- [ ] **Step 3.6 — Delete the `ERROR_CLASS` constant**

With error now passed via the `error` prop, `ERROR_CLASS` is no longer needed. Remove it:
```tsx
// DELETE:
const ERROR_CLASS = 'mt-1 px-1 text-xs text-red-400/90'
```

- [ ] **Step 3.7 — Verify TypeScript**

```bash
pnpm --filter @make-the-change/web-client type-check
```

Expected: no errors.

- [ ] **Step 3.8 — Commit**

```bash
git add apps/web-client/src/app/[locale]/\(screens\)/products/checkout/infos/infos-client.tsx
git commit -m "refactor(checkout): replace raw inputs with Input ghost variant"
```

---

## Task 4 — Migrate `addresses-client.tsx`

**Files:**
- Modify: `apps/web-client/src/app/[locale]/(screens)/profile/settings/addresses/addresses-client.tsx`

- [ ] **Step 4.1 — Update imports**

```tsx
import { Input } from '@make-the-change/core/ui'
```

- [ ] **Step 4.2 — Delete the CSS constants (lines 28-30)**

```tsx
// DELETE:
const INPUT_BASE =
  'h-12 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-base text-white placeholder:text-white/25'
const INPUT_CLASS = `${INPUT_BASE} w-full`
```

- [ ] **Step 4.3 — Replace the postal + city inputs inside `AddressFields` (around line 75)**

```tsx
// Before
<div className="space-y-1.5">
  <label className="block text-xs font-bold text-white/55">Code postal et ville</label>
  <div className="flex gap-3">
    <input
      value={form.postalCode}
      onChange={(e) => onChange({ ...form, postalCode: e.target.value })}
      placeholder="1000"
      inputMode="numeric"
      className={`${INPUT_BASE} w-[38%]`}
    />
    <input
      value={form.city}
      onChange={(e) => onChange({ ...form, city: e.target.value })}
      placeholder="Bruxelles"
      className={`${INPUT_BASE} flex-1`}
    />
  </div>
</div>

// After
<div className="flex gap-3">
  <div className="w-[38%]">
    <Input
      label="Code postal"
      variant="ghost"
      size="lg"
      value={form.postalCode}
      onChange={(e) => onChange({ ...form, postalCode: e.target.value })}
      placeholder="1000"
      inputMode="numeric"
    />
  </div>
  <div className="flex-1">
    <Input
      label="Ville"
      variant="ghost"
      size="lg"
      value={form.city}
      onChange={(e) => onChange({ ...form, city: e.target.value })}
      placeholder="Bruxelles"
    />
  </div>
</div>
```

Note: `INPUT_BASE` in this file used `h-12` while checkout used `h-13` — migrating both to `size="lg"` (`h-13`) standardises them.

- [ ] **Step 4.4 — Verify TypeScript**

```bash
pnpm --filter @make-the-change/web-client type-check
```

Expected: no errors.

- [ ] **Step 4.5 — Commit**

```bash
git add apps/web-client/src/app/[locale]/\(screens\)/profile/settings/addresses/addresses-client.tsx
git commit -m "refactor(addresses): replace raw inputs with Input ghost variant, standardise height to lg"
```

---

## Task 5 — Fix contact form + migrate inputs

The contact form currently calls `onSubmit={(e) => { e.preventDefault(); setIsSent(true) }}` — it never sends anything. This task wires a real server action and migrates the inputs.

**Files:**
- Create: `apps/web-client/src/app/[locale]/(site)/contact/actions.ts`
- Modify: `apps/web-client/src/app/[locale]/(site)/contact/page.tsx`

- [ ] **Step 5.1 — Create the server action**

Create `apps/web-client/src/app/[locale]/(site)/contact/actions.ts`:

```ts
'use server'

export type ContactActionState = {
  success?: boolean
  error?: string
}

export async function sendContactMessage(
  _prev: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  const email = String(formData.get('email') ?? '').trim()
  const message = String(formData.get('message') ?? '').trim()

  if (!email.includes('@') || !email.split('@')[1]?.includes('.')) {
    return { error: 'Adresse e-mail invalide.' }
  }
  if (message.length < 10) {
    return { error: 'Le message est trop court (10 caractères minimum).' }
  }

  // TODO: wire to email service (Resend or similar)
  console.log('[contact] new message from', email)
  return { success: true }
}
```

- [ ] **Step 5.2 — Update imports in `contact/page.tsx`**

```tsx
import { useActionState } from 'react'
import { Input } from '@make-the-change/core/ui'
import { TextArea } from '@make-the-change/core/ui'
import { sendContactMessage, type ContactActionState } from './actions'
```

- [ ] **Step 5.3 — Replace useState + fake onSubmit with useActionState**

In `ContactPage`, remove:
```tsx
const [isSent, setIsSent] = useState(false)
```

Add:
```tsx
const [state, formAction, isPending] = useActionState<ContactActionState, FormData>(
  sendContactMessage,
  {},
)
const isSent = state.success === true
```

- [ ] **Step 5.4 — Replace the `<form>` onSubmit with action**

```tsx
// Before
<form
  onSubmit={(e) => { e.preventDefault(); setIsSent(true); }}
  className="..."
>

// After
<form
  action={formAction}
  className="..."
>
```

- [ ] **Step 5.5 — Add hidden subject field + replace the email input**

Replace the raw email `<input>` block (around line 157):

```tsx
// Before
<div className="px-4 py-3 border-b border-white/5 focus-within:bg-white/[0.02] transition-colors">
  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Votre email</label>
  <input
    type="email"
    required
    placeholder="Pour vous recontacter..."
    className="w-full bg-transparent text-white text-base focus:outline-none placeholder:text-gray-600 font-medium"
  />
</div>

// After
<div className="px-4 py-3 border-b border-white/5">
  <input type="hidden" name="subject" value={selectedSubject} />
  <Input
    name="email"
    type="email"
    label="Votre email"
    variant="ghost"
    placeholder="Pour vous recontacter..."
    required
    labelClassName="text-[10px] font-bold text-gray-500 uppercase tracking-widest"
    className="bg-transparent border-0 shadow-none focus-visible:ring-0 px-0 text-base font-medium"
  />
</div>
```

- [ ] **Step 5.6 — Replace the textarea**

```tsx
// Before
<div className="px-4 py-3 focus-within:bg-white/[0.02] transition-colors">
  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Votre message</label>
  <textarea
    rows={4}
    required
    placeholder="Décrivez votre demande en détail..."
    className="w-full bg-transparent text-white text-base focus:outline-none placeholder:text-gray-600 font-medium resize-none"
  />
</div>

// After
<div className="px-4 py-3">
  <TextArea
    name="message"
    label="Votre message"
    variant="ghost"
    rows={4}
    required
    placeholder="Décrivez votre demande en détail..."
    labelClassName="text-[10px] font-bold text-gray-500 uppercase tracking-widest"
    className="bg-transparent border-0 shadow-none focus-visible:ring-0 px-0 resize-none text-base font-medium"
  />
</div>
```

- [ ] **Step 5.7 — Show server error if present**

Just before the submit button, add:
```tsx
{state.error && (
  <p className="text-sm font-medium text-red-400">{state.error}</p>
)}
```

- [ ] **Step 5.8 — Disable submit while pending**

```tsx
// Before
<button type="submit" className="...">
  Envoyer le message
</button>

// After
<button type="submit" disabled={isPending} className="... disabled:opacity-60">
  {isPending ? 'Envoi…' : 'Envoyer le message'}
</button>
```

- [ ] **Step 5.9 — Verify TypeScript**

```bash
pnpm --filter @make-the-change/web-client type-check
```

Expected: no errors.

- [ ] **Step 5.10 — Commit**

```bash
git add apps/web-client/src/app/[locale]/\(site\)/contact/
git commit -m "fix(contact): wire real server action + replace raw inputs with ghost Input/TextArea"
```

---

## Task 6 — Migrate guest-email in contribute flow

**Files:**
- Modify: `apps/web-client/src/app/[locale]/(screens)/projects/[slug]/contribute/_components/project-contribute-one-flow.tsx`

- [ ] **Step 6.1 — Add import**

Find the existing import from `@make-the-change/core/ui` (already imports `Button` and others) and add `Input`:

```tsx
import {
  // ... existing imports
  Input,
} from '@make-the-change/core/ui'
```

- [ ] **Step 6.2 — Replace the guest-email input (around line 640)**

```tsx
// Before
<div className="w-full">
  <label className="mb-1.5 block text-xs font-bold text-white/60">
    Email de confirmation
  </label>
  <input
    type="email"
    value={guestEmail}
    onChange={(event) => setGuestEmail(event.target.value)}
    placeholder="vous@email.com"
    className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-base text-white outline-none placeholder:text-white/35 focus:border-lime-400/50 focus:ring-0"
    required
  />
  <p className="mt-1.5 text-[11px] text-white/35">
    Reçu de contribution et suivi du projet. Ce reçu n&apos;est pas un reçu fiscal déductible.
  </p>
</div>

// After
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
    helpText="Reçu de contribution et suivi du projet. Ce reçu n'est pas un reçu fiscal déductible."
    labelClassName="text-xs font-bold text-white/60"
  />
</div>
```

- [ ] **Step 6.3 — Verify TypeScript**

```bash
pnpm --filter @make-the-change/web-client type-check
```

- [ ] **Step 6.4 — Commit**

```bash
git add "apps/web-client/src/app/[locale]/(screens)/projects/[slug]/contribute/_components/project-contribute-one-flow.tsx"
git commit -m "refactor(contribute): replace guest-email raw input with Input ghost variant"
```

---

## Task 7 — Migrate guest-email in support flow

**Files:**
- Modify: `apps/web-client/src/app/[locale]/(screens)/projects/[slug]/support/_components/project-support-one-flow.tsx`

- [ ] **Step 7.1 — Add import**

Find the existing import from `@make-the-change/core/ui` and add `Input`:

```tsx
import {
  // ... existing imports
  Input,
} from '@make-the-change/core/ui'
```

- [ ] **Step 7.2 — Replace the guest-email input (around line 968)**

```tsx
// Before
<div className="w-full">
  <label className="mb-1.5 block text-xs font-bold text-white/60">
    Email de confirmation
  </label>
  <input
    type="email"
    value={guestEmail}
    onChange={(event) => setGuestEmail(event.target.value)}
    placeholder="vous@email.com"
    className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-base text-white outline-none placeholder:text-white/35 focus:border-lime-400/50 focus:ring-0"
    required
  />
  <p className="mt-1.5 text-[11px] text-white/35">
    Reçu de contribution et suivi du projet. Ce reçu n&apos;est pas un reçu fiscal déductible.
  </p>
  {guestEmailError ? (
    <p className="mt-1.5 text-xs font-semibold text-destructive">{guestEmailError}</p>
  ) : null}
</div>

// After
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

- [ ] **Step 7.3 — Verify TypeScript**

```bash
pnpm --filter @make-the-change/web-client type-check
```

- [ ] **Step 7.4 — Commit**

```bash
git add "apps/web-client/src/app/[locale]/(screens)/projects/[slug]/support/_components/project-support-one-flow.tsx"
git commit -m "refactor(support): replace guest-email raw input with Input ghost variant"
```

---

## Self-review checklist

| Requirement | Task(s) |
|---|---|
| `ghost` variant added to `Input` | Task 1 |
| `ghost` variant added to `TextArea` | Task 2 |
| Tests cover ghost variant | Task 1 |
| Text colours moved to variant map (no regression on default/outlined/filled) | Tasks 1, 2 |
| `INPUT_BASE`/`INPUT_CLASS` duplication removed | Tasks 3, 4 |
| h-12/h-13 inconsistency fixed | Task 4 |
| Contact form actually submits | Task 5 |
| All guest-email inputs migrated | Tasks 6, 7 |
| TypeScript verified after each file | Tasks 3–7 |
| `account-client.tsx` bare inputs intentionally left | documented in Scope |
| Amount inputs intentionally left | documented in Scope |
