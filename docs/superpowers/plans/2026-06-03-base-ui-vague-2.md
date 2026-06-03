# Base UI Vague 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrer 4 catégories de patterns UI hand-rolled de `web-client` (selects HTML, accordions custom, AddressAutocompleteInput, modales/sheets) vers leurs équivalents Base UI, en préservant l'API publique des wrappers réutilisés (FullScreenSlideModal × 55+, MobileSheet × 6+).

**Architecture:** Sprints S1 → S4 dans l'ordre simple → complexe. Pour les wrappers internes (FullScreenSlideModal, MobileSheet, AddressAutocompleteInput), réécriture interne basée sur Base UI sans changer l'API publique. Pour les patterns inline (selects, accordions), migration directe au consommateur. Pré-requis : ajout d'un `SelectTriggerBare` (S1.0) pour bypasser les styles "Material" du `SelectTrigger` core sur les forms ghost dark, et ajout d'un wrapper `Drawer` au core (S4.0).

**Tech Stack:** TypeScript, React 19, Next.js 16 App Router, `@base-ui/react` ^1.5, Tailwind CSS 4, Vitest. Pas de Framer Motion ajoutée — les animations existantes peuvent être retirées (validation user).

**Spec source:** `docs/superpowers/specs/2026-06-03-base-ui-vague-2-design.md`

---

## Setup — Worktree isolé

**Files:**
- None — git operations only

- [ ] **Step 0.1 — Sync main and create worktree**

Run:
```bash
git fetch origin
git worktree add -b feat/base-ui-vague-2 .worktrees/base-ui-vague-2 origin/main
cd .worktrees/base-ui-vague-2
pnpm install
```
Expected: new worktree at `.worktrees/base-ui-vague-2/`, on branch `feat/base-ui-vague-2`, dependencies installed.

- [ ] **Step 0.2 — Verify baseline tests pass before any change**

Run:
```bash
pnpm --filter @make-the-change/core test
```
Expected: 33+ tests passed.

Run:
```bash
pnpm --filter @make-the-change/web-client type-check
```
Expected: only pre-existing errors in `species-helpers.test.ts` and `species-context.service.ts` (unrelated).

---

## S1 — Selects HTML → Base UI Select

### Task S1.0 — Add `SelectTriggerBare` to core for ghost dark forms

**Files:**
- Modify: `packages/core/src/shared/ui/base/select.tsx`

The existing `SelectTrigger` hardcodes "Material" hover/gradient/scale effects via `baseTrigger` constant. These don't fit our ghost dark forms (checkout, addresses). We add a "bare" trigger that takes className without prepending baseTrigger.

- [ ] **Step S1.0.1 — Add `SelectTriggerBare` component**

In `packages/core/src/shared/ui/base/select.tsx`, after the `SelectTrigger` export (around line 42), add:

```tsx
const SelectTriggerBare = forwardRef<
  ElementRef<typeof Select.Trigger>,
  ComponentPropsWithoutRef<typeof Select.Trigger>
>(({ className, children, ...props }, ref) => (
  <Select.Trigger
    ref={ref}
    className={`group flex items-center justify-between cursor-pointer outline-none disabled:cursor-not-allowed disabled:opacity-50${className ? ` ${className}` : ''}`}
    {...props}
  >
    {children}
    <Select.Icon className="transition-transform group-data-[popup-open]:rotate-180">
      <ChevronDown className="h-4 w-4 opacity-70" />
    </Select.Icon>
  </Select.Trigger>
))
SelectTriggerBare.displayName = 'SelectTriggerBare'
```

- [ ] **Step S1.0.2 — Export `SelectTriggerBare`**

At the bottom of `packages/core/src/shared/ui/base/select.tsx`, in the `export { ... }` block, add `SelectTriggerBare`:

```tsx
export {
  SelectRoot as Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectTriggerBare,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
```

- [ ] **Step S1.0.3 — Verify type-check**

Run:
```bash
pnpm --filter @make-the-change/core type-check
```
Expected: passes.

Run:
```bash
pnpm --filter @make-the-change/core test
```
Expected: existing tests still pass.

- [ ] **Step S1.0.4 — Commit**

```bash
git add packages/core/src/shared/ui/base/select.tsx
git commit -m "feat(core): add SelectTriggerBare for forms with custom styling"
```

### Task S1.1 — Migrate `addresses-client.tsx` country select

**Files:**
- Modify: `apps/web-client/src/app/[locale]/(screens)/profile/settings/addresses/addresses-client.tsx`

- [ ] **Step S1.1.1 — Sync**

```bash
git fetch origin
git rebase origin/main
```

- [ ] **Step S1.1.2 — Add imports**

Read `apps/web-client/src/app/[locale]/(screens)/profile/settings/addresses/addresses-client.tsx`. Find the existing `@make-the-change/core/ui` import block. Add to it:

```tsx
  Select,
  SelectContent,
  SelectItem,
  SelectTriggerBare,
  SelectValue,
```

Remove `ChevronDown` from `lucide-react` import if it's only used by the country select (check usage — it may also be used elsewhere; keep if so).

- [ ] **Step S1.1.3 — Replace the country select**

Find the country select block (around lines 43-56) which currently has:
```tsx
<div className="relative">
  <select
    value={form.country}
    onChange={(e) => onChange({ ...form, country: e.target.value, street: '', postalCode: '', city: '' })}
    className={`${INPUT_CLASS} appearance-none pr-10`}
  >
    {CHECKOUT_COUNTRIES.map((c) => (
      <option key={c.code} value={c.code} className="bg-[#0B0F15]">{c.label}</option>
    ))}
  </select>
  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" aria-hidden="true" />
</div>
```

Note: `INPUT_CLASS` was removed in vague 1 — verify what className constant is actually used now. The current implementation may inline the classes directly. Adapt accordingly.

Replace with:
```tsx
<Select
  value={form.country}
  onValueChange={(value) => {
    const next = typeof value === 'string' ? value : String(value)
    onChange({ ...form, country: next, street: '', postalCode: '', city: '' })
  }}
>
  <SelectTriggerBare className="h-13 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-base text-white w-full">
    <SelectValue placeholder="Pays" />
  </SelectTriggerBare>
  <SelectContent>
    {CHECKOUT_COUNTRIES.map((c) => (
      <SelectItem key={c.code} value={c.code}>
        {c.label}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

- [ ] **Step S1.1.4 — Type-check**

```bash
pnpm --filter @make-the-change/web-client type-check
```
Expected: only pre-existing errors.

- [ ] **Step S1.1.5 — Commit**

```bash
git add "apps/web-client/src/app/[locale]/(screens)/profile/settings/addresses/addresses-client.tsx"
git commit -m "refactor(addresses): migrate country select to Base UI Select (S1.1)"
```

### Task S1.2 — Migrate `checkout/infos-client.tsx` country select

**Files:**
- Modify: `apps/web-client/src/app/[locale]/(screens)/products/checkout/infos/infos-client.tsx`

- [ ] **Step S1.2.1 — Sync**

```bash
git fetch origin
git rebase origin/main
```

- [ ] **Step S1.2.2 — Add imports**

Read the current file. In the import block from `@make-the-change/core/ui`, add:
```tsx
  Select,
  SelectContent,
  SelectItem,
  SelectTriggerBare,
  SelectValue,
```

Remove `ChevronDown` from `lucide-react` import if only used for the country select trigger.

- [ ] **Step S1.2.3 — Replace the country select**

Find the country select block. It currently uses a raw `<select>` element with an absolute-positioned `<ChevronDown>` icon. Replace the whole `<div className="relative">...select...ChevronDown...</div>` block with:

```tsx
<Select
  value={customer.country}
  onValueChange={(value) => {
    const next = typeof value === 'string' ? value : String(value)
    handleCountryChange(next)
  }}
>
  <SelectTriggerBare
    id="checkout-country"
    className="h-13 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-base text-white w-full"
  >
    <SelectValue placeholder="Pays" />
  </SelectTriggerBare>
  <SelectContent>
    {CHECKOUT_COUNTRIES.map((c) => (
      <SelectItem key={c.code} value={c.code}>
        {c.label}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

The `autoComplete="country"` attribute from the original `<select>` is lost (Base UI Select doesn't relay form autocomplete the same way). Note: the country value is still sent via the form (the Select stores it in state and a hidden mechanism). Verify no regression in checkout submission flow.

- [ ] **Step S1.2.4 — Type-check**

```bash
pnpm --filter @make-the-change/web-client type-check
```

- [ ] **Step S1.2.5 — Commit**

```bash
git add "apps/web-client/src/app/[locale]/(screens)/products/checkout/infos/infos-client.tsx"
git commit -m "refactor(checkout): migrate country select to Base UI Select (S1.2)"
```

### Task S1.3 — Migrate `ecosystem-detail.tsx` perspective select

**Files:**
- Modify: `apps/web-client/src/app/[locale]/(screens)/ecosysteme/_components/ecosystem-detail.tsx`

- [ ] **Step S1.3.1 — Sync and read file**

```bash
git fetch origin
git rebase origin/main
```

Read `apps/web-client/src/app/[locale]/(screens)/ecosysteme/_components/ecosystem-detail.tsx` and locate the perspective select (around line 218). Note its className, value, and options structure.

- [ ] **Step S1.3.2 — Add imports**

In the import block from `@make-the-change/core/ui`, add:
```tsx
  Select,
  SelectContent,
  SelectItem,
  SelectTriggerBare,
  SelectValue,
```

- [ ] **Step S1.3.3 — Replace the perspective select**

Find the perspective select block (raw `<select>` element). Replace it with:

```tsx
<Select
  value={perspective}
  onValueChange={(value) => {
    const next = typeof value === 'string' ? value : String(value)
    setPerspective(next as PerspectiveOption)
  }}
>
  <SelectTriggerBare className="h-10 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm text-white">
    <SelectValue placeholder="Perspective" />
  </SelectTriggerBare>
  <SelectContent>
    {PERSPECTIVE_OPTIONS.map((option) => (
      <SelectItem key={option.value} value={option.value}>
        {option.label}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

Adjust the variable names (`perspective`, `setPerspective`, `PerspectiveOption`, `PERSPECTIVE_OPTIONS`) to match what's actually in the file.

- [ ] **Step S1.3.4 — Type-check and commit**

```bash
pnpm --filter @make-the-change/web-client type-check
git add "apps/web-client/src/app/[locale]/(screens)/ecosysteme/_components/ecosystem-detail.tsx"
git commit -m "refactor(ecosystem): migrate perspective select to Base UI Select (S1.3)"
```

### Task S1.4 — `learn/courses/page.tsx` — Server Component handling

**Files:**
- Read: `apps/web-client/src/app/[locale]/(screens)/learn/courses/page.tsx`
- Potentially create: `apps/web-client/src/app/[locale]/(screens)/learn/courses/_components/course-filters.tsx`

The courses page submits filters via a native GET form. Native `<select>` works well here — Base UI Select would require `useState` and turning the page into a Client Component just for filters, losing the SSR benefits.

- [ ] **Step S1.4.1 — Sync and inspect the page**

```bash
git fetch origin
git rebase origin/main
```

Read `apps/web-client/src/app/[locale]/(screens)/learn/courses/page.tsx`. Check:
- Is it a Server Component (no `'use client'` directive at top)?
- Are the selects inside a `<form action="..." method="GET">` for native submission?

- [ ] **Step S1.4.2 — Decision and either migrate or document skip**

**If Server Component with native form GET**: do NOT migrate the selects. The native `<select>` is the right tool for SSR forms. Add a single-line comment above each select:
```tsx
{/* Native select: Server Component form GET — see docs/superpowers/specs/2026-06-03-base-ui-vague-2-design.md §3.6 */}
```

Skip the migration. No code changes. No commit needed for this task — just close it as documented.

**If Client Component or uses client-side state**: migrate using the same pattern as S1.1-S1.3, adding `'use client'` if needed.

- [ ] **Step S1.4.3 — Commit (if any change)**

If a change was made (Client Component path):
```bash
git add "apps/web-client/src/app/[locale]/(screens)/learn/courses/page.tsx"
git commit -m "refactor(learn): migrate course filters to Base UI Select (S1.4)"
```

If no change (Server Component path), commit just the comment additions:
```bash
git add "apps/web-client/src/app/[locale]/(screens)/learn/courses/page.tsx"
git commit -m "docs(learn): note native select retention for SSR form GET (S1.4)"
```

---

## S2 — Accordions custom → Base UI Accordion

### Task S2.1 — Migrate FAQ public accordion

**Files:**
- Modify: `apps/web-client/src/app/[locale]/(site)/faq/_features/faq-accordion.tsx`

- [ ] **Step S2.1.1 — Sync and read file**

```bash
git fetch origin
git rebase origin/main
```

Read `apps/web-client/src/app/[locale]/(site)/faq/_features/faq-accordion.tsx` fully. Identify:
- The `items` prop or local data
- The current state management (likely `useState` + Framer Motion)
- The styling classes for the trigger and panel

- [ ] **Step S2.1.2 — Replace imports**

Replace the top imports of the file with:
```tsx
'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@make-the-change/core/ui'
```

Add other imports as needed (icons, types). Remove `useState`, `motion`, `AnimatePresence`, and any unused imports.

- [ ] **Step S2.1.3 — Replace the component body**

Replace the entire JSX returning the accordion with the following structure. Keep the existing wrapper `<div>` / `<section>` and headings (if any) — only replace the accordion items rendering:

```tsx
<Accordion type="single" collapsible className="space-y-4">
  {items.map((item) => (
    <AccordionItem
      key={item.id}
      value={item.id}
      className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden"
    >
      <AccordionTrigger className="flex w-full items-center justify-between px-5 py-4 text-left text-base font-medium text-white hover:no-underline">
        {item.question}
      </AccordionTrigger>
      <AccordionContent className="px-5 pb-4 text-sm leading-relaxed text-white/70">
        {item.answer}
      </AccordionContent>
    </AccordionItem>
  ))}
</Accordion>
```

Note: `AccordionTrigger` from core already includes a ChevronDown that rotates on open via `group-data-[panel-open]:rotate-180`. No need to add it manually. The `hover:no-underline` override is to neutralize the default `hover:underline` in the core wrapper.

- [ ] **Step S2.1.4 — Verify type-check and visual**

```bash
pnpm --filter @make-the-change/web-client type-check
```

Manual verify: open `/fr/faq`, click accordion items, confirm they open/close smoothly. The animation is now CSS-based (no Framer Motion).

- [ ] **Step S2.1.5 — Commit**

```bash
git add "apps/web-client/src/app/[locale]/(site)/faq/_features/faq-accordion.tsx"
git commit -m "refactor(faq): migrate accordion to Base UI Accordion (S2.1)"
```

### Task S2.2 — Migrate product information sections accordion

**Files:**
- Modify: `apps/web-client/src/app/[locale]/(screens)/products/[id]/_components/product-information-sections.tsx`

- [ ] **Step S2.2.1 — Sync and read**

```bash
git fetch origin
git rebase origin/main
```

Read `apps/web-client/src/app/[locale]/(screens)/products/[id]/_components/product-information-sections.tsx`. Locate the inline `AccordionSection` sub-component (around lines 10-36) and its usage in the parent component.

- [ ] **Step S2.2.2 — Replace imports**

Update the top imports of the file:
```tsx
'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@make-the-change/core/ui'
```

Remove `useState` and any inline AccordionSection subcomponent (you'll delete it next step).

- [ ] **Step S2.2.3 — Delete the inline `AccordionSection` subcomponent and replace its usages**

Delete the `function AccordionSection(...)` definition entirely (lines 10-36 in the current file).

Replace all `<AccordionSection title="..." defaultOpen={...}>...</AccordionSection>` usages with the Accordion composition. Wrap them in a single `<Accordion type="multiple">` (multiple sections can be open at once, mimicking the current independent behavior):

```tsx
<Accordion type="multiple" className="divide-y divide-white/5">
  <AccordionItem value="ingredients" className="border-0">
    <AccordionTrigger className="py-4 text-left text-sm font-semibold text-white hover:no-underline">
      Ingrédients
    </AccordionTrigger>
    <AccordionContent className="pb-4 text-sm text-white/70">
      {/* original content of "Ingredients" section */}
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="usage" className="border-0">
    <AccordionTrigger className="py-4 text-left text-sm font-semibold text-white hover:no-underline">
      Utilisation
    </AccordionTrigger>
    <AccordionContent className="pb-4 text-sm text-white/70">
      {/* original content */}
    </AccordionContent>
  </AccordionItem>
  {/* and so on for each section originally rendered */}
</Accordion>
```

Adapt the section titles and contents to match what was originally in the file.

If `defaultOpen` was used on some sections, pass `defaultValue={['ingredients', 'usage']}` (or whichever values) to `<Accordion>`.

- [ ] **Step S2.2.4 — Type-check and commit**

```bash
pnpm --filter @make-the-change/web-client type-check
git add "apps/web-client/src/app/[locale]/(screens)/products/[id]/_components/product-information-sections.tsx"
git commit -m "refactor(products): migrate product info sections to Base UI Accordion (S2.2)"
```

### Task S2.3 — Migrate home FAQ section

**Files:**
- Modify: `apps/web-client/src/app/[locale]/(site)/(home)/_components/sections/home-faq-section.tsx`

- [ ] **Step S2.3.1 — Sync and read**

```bash
git fetch origin
git rebase origin/main
```

Read `apps/web-client/src/app/[locale]/(site)/(home)/_components/sections/home-faq-section.tsx`. Note the use of `Plus`/`Minus` icons (custom toggle indicator) and `useState`/`AnimatePresence` from Framer Motion.

- [ ] **Step S2.3.2 — Replace imports**

Update the top imports:
```tsx
'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@make-the-change/core/ui'
import { Minus, Plus } from 'lucide-react'
```

Remove `useState`, `motion`, `AnimatePresence`, and other Framer imports.

- [ ] **Step S2.3.3 — Replace the accordion**

Replace the items rendering block with:
```tsx
<Accordion type="single" collapsible className="mx-auto max-w-3xl space-y-3">
  {items.map((item) => (
    <AccordionItem
      key={item.id}
      value={item.id}
      className="rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-1 overflow-hidden"
    >
      <AccordionTrigger className="group flex w-full items-center justify-between py-4 text-left text-base font-medium text-white hover:no-underline [&>svg]:hidden">
        <span>{item.question}</span>
        <Plus className="h-5 w-5 shrink-0 text-white/60 transition-opacity group-data-[panel-open]:opacity-0 group-data-[panel-open]:hidden" />
        <Minus className="h-5 w-5 shrink-0 text-white/60 hidden group-data-[panel-open]:block" />
      </AccordionTrigger>
      <AccordionContent className="pb-4 text-sm leading-relaxed text-white/70">
        {item.answer}
      </AccordionContent>
    </AccordionItem>
  ))}
</Accordion>
```

The `[&>svg]:hidden` neutralizes the default ChevronDown rendered by `AccordionTrigger` from core. Plus/Minus are toggled via `data-[panel-open]`.

Adapt to the actual data structure of the file (the items array, its prop or import).

- [ ] **Step S2.3.4 — Manual visual verification**

Open `/fr` (home), scroll to the FAQ section, click items. The animation is CSS-based now (height transition). Test on Chrome desktop and Safari (DevTools mobile view OK).

If Safari `height: auto` interpolation looks broken, fall back to a fixed `max-h-[500px]` on `AccordionContent` data-[open] state via Tailwind override.

- [ ] **Step S2.3.5 — Commit**

```bash
git add "apps/web-client/src/app/[locale]/(site)/(home)/_components/sections/home-faq-section.tsx"
git commit -m "refactor(home): migrate FAQ section to Base UI Accordion (S2.3)"
```

---

## S3 — AddressAutocompleteInput → Base UI Autocomplete

### Task S3.1 — Refactor internal implementation

**Files:**
- Modify: `apps/web-client/src/app/[locale]/(screens)/_components/address-autocomplete-input.tsx`

The component is a 216-line custom combobox. We rewrite its internals to use Base UI Autocomplete primitives while preserving its public API exactly:
```ts
type Props = {
  id: string
  value: string
  country: string
  placeholder?: string
  className?: string
  onChange: (value: string) => void
  onSelect: (suggestion: Pick<AddressSuggestion, 'street' | 'postalCode' | 'city'>) => void
  onBlur?: () => void
}
```

- [ ] **Step S3.1.1 — Sync and read current file**

```bash
git fetch origin
git rebase origin/main
```

Read the full file `apps/web-client/src/app/[locale]/(screens)/_components/address-autocomplete-input.tsx` to understand:
- The `AddressSuggestion` type (from `@/lib/address-autocomplete`)
- The fetch URL `/api/address-autocomplete?q=...&country=...`
- The debounce (300ms)
- The AbortController cancellation
- The loading spinner positioning

- [ ] **Step S3.1.2 — Replace file content entirely**

Replace `apps/web-client/src/app/[locale]/(screens)/_components/address-autocomplete-input.tsx` content with:

```tsx
'use client'

import {
  Autocomplete,
  AutocompleteCollection,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
  AutocompletePopup,
  AutocompletePortal,
  AutocompletePositioner,
} from '@make-the-change/core/ui'
import { useEffect, useRef, useState } from 'react'
import type { AddressSuggestion } from '@/lib/address-autocomplete'

type Props = {
  id: string
  value: string
  country: string
  placeholder?: string
  className?: string
  onChange: (value: string) => void
  onSelect: (suggestion: Pick<AddressSuggestion, 'street' | 'postalCode' | 'city'>) => void
  onBlur?: () => void
}

export function AddressAutocompleteInput({
  id,
  value,
  country,
  placeholder,
  className,
  onChange,
  onSelect,
  onBlur,
}: Props) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [query, setQuery] = useState(value)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  // Cancel in-flight work on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort()
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  // Reset on country change
  useEffect(() => {
    abortRef.current?.abort()
    if (debounceRef.current) clearTimeout(debounceRef.current)
    setSuggestions([])
    setIsLoading(false)
  }, [country])

  // Sync external value into local query (when parent updates value, e.g. on select)
  useEffect(() => {
    setQuery(value)
  }, [value])

  // Debounced fetch on query change
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (query.trim().length < 2) {
      setSuggestions([])
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    debounceRef.current = setTimeout(async () => {
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller
      try {
        const params = new URLSearchParams({ q: query, country: country.toLowerCase() })
        const res = await fetch(`/api/address-autocomplete?${params.toString()}`, {
          signal: controller.signal,
        })
        if (!res.ok) {
          setSuggestions([])
          return
        }
        const data = (await res.json()) as AddressSuggestion[]
        setSuggestions(data)
      } catch (e) {
        if (e instanceof Error && e.name === 'AbortError') return
        setSuggestions([])
      } finally {
        setIsLoading(false)
      }
    }, 300)
  }, [query, country])

  return (
    <div className="relative">
      <Autocomplete
        items={suggestions}
        inputValue={query}
        onInputValueChange={(next) => {
          const str = String(next)
          setQuery(str)
          onChange(str)
        }}
        onValueChange={(selected) => {
          if (!selected || typeof selected !== 'object') return
          const s = selected as AddressSuggestion
          setQuery(s.street)
          onChange(s.street)
          onSelect({ street: s.street, postalCode: s.postalCode, city: s.city })
        }}
      >
        <AutocompleteInput
          id={id}
          placeholder={placeholder}
          autoComplete="off"
          className={className}
          onBlur={onBlur}
        />
        {isLoading && (
          <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
            <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/20 border-t-white/60" aria-hidden="true" />
          </div>
        )}
        <AutocompletePortal>
          <AutocompletePositioner sideOffset={4} className="z-[9999]">
            <AutocompletePopup className="max-h-52 w-[var(--anchor-width)] overflow-y-auto rounded-xl border border-white/10 bg-[#0B0F15] shadow-2xl">
              <AutocompleteList>
                <AutocompleteCollection>
                  {(item: AddressSuggestion, index: number) => (
                    <AutocompleteItem
                      key={`${item.label}-${index}`}
                      value={item}
                      className="cursor-pointer px-4 py-3 text-sm text-white/70 transition-colors data-[highlighted]:bg-white/[0.08] data-[highlighted]:text-white hover:bg-white/[0.05] hover:text-white"
                    >
                      {item.label}
                    </AutocompleteItem>
                  )}
                </AutocompleteCollection>
                <AutocompleteEmpty className="px-4 py-3 text-sm text-white/40">
                  Aucune adresse trouvée
                </AutocompleteEmpty>
              </AutocompleteList>
            </AutocompletePopup>
          </AutocompletePositioner>
        </AutocompletePortal>
      </Autocomplete>
    </div>
  )
}
```

Notes on Base UI API used:
- `Autocomplete.Root` accepts `items` (the array to display), `inputValue` (controlled input), `onInputValueChange` (input typing callback), and `onValueChange` (selection callback with the chosen item).
- `AutocompleteCollection` renders each item via a function child `(item, index) => <AutocompleteItem .../>`.
- The portal + positioner replaces our manual `getBoundingClientRect` logic.
- `data-[highlighted]` selector replaces the manual `activeIndex` state.

- [ ] **Step S3.1.3 — Verify type-check**

```bash
pnpm --filter @make-the-change/web-client type-check
```

If the `Autocomplete.Root` signature differs from what was assumed (e.g., the items prop name is `collection` not `items`, or onValueChange signature differs), adapt. Read `node_modules/@base-ui/react/autocomplete/Autocomplete.d.ts` if needed.

- [ ] **Step S3.1.4 — Manual verification**

Run `pnpm --filter @make-the-change/web-client dev` and open `/fr/products/checkout/infos`. Test:
1. Type a street name (3+ chars) — loading spinner appears, then suggestions dropdown.
2. Click a suggestion — fills in street, postal code, city.
3. Use keyboard: Arrow Down/Up to navigate, Enter to select, Escape to close.
4. Type then quickly type more — old request cancelled, new fires.
5. Change country — suggestions reset.

If something doesn't work, debug: check the items rendering, the onValueChange signature, the popup positioning.

- [ ] **Step S3.1.5 — Commit**

```bash
git add "apps/web-client/src/app/[locale]/(screens)/_components/address-autocomplete-input.tsx"
git commit -m "refactor(address): rewrite AddressAutocompleteInput on Base UI Autocomplete (S3.1)"
```

---

## S4 — Modales et Sheets

### Task S4.0 — Add Drawer wrapper to core

**Files:**
- Create: `packages/core/src/shared/ui/base/drawer.tsx`
- Modify: `packages/core/src/shared/ui/index.ts`

- [ ] **Step S4.0.1 — Sync**

```bash
git fetch origin
git rebase origin/main
```

- [ ] **Step S4.0.2 — Create drawer.tsx**

Create `packages/core/src/shared/ui/base/drawer.tsx`:

```tsx
'use client'

import { Drawer as DrawerPrimitive } from '@base-ui/react/drawer'

const Drawer = DrawerPrimitive.Root
const DrawerTrigger = DrawerPrimitive.Trigger
const DrawerPortal = DrawerPrimitive.Portal
const DrawerBackdrop = DrawerPrimitive.Backdrop
const DrawerPopup = DrawerPrimitive.Popup
const DrawerTitle = DrawerPrimitive.Title
const DrawerDescription = DrawerPrimitive.Description
const DrawerClose = DrawerPrimitive.Close
const DrawerHandle = DrawerPrimitive.Handle

export {
  Drawer,
  DrawerTrigger,
  DrawerPortal,
  DrawerBackdrop,
  DrawerPopup,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
  DrawerHandle,
}
```

- [ ] **Step S4.0.3 — Verify Base UI Drawer is available**

Check that `@base-ui/react/drawer` exports exist in `node_modules`. Run:
```bash
ls node_modules/@base-ui/react/drawer
```
Expected: directory exists with files.

If `node_modules/@base-ui/react/drawer` does NOT exist, the Drawer component is not in the installed version of `@base-ui/react`. **STOP** and check the installed version against the spec (Drawer was announced in v1.5+):
```bash
cat node_modules/@base-ui/react/package.json | grep version
```

If the version is < 1.5.0, the spec mentions Drawer is in v1.5.0 (May 2026). Either upgrade `@base-ui/react` in `packages/core/package.json` or skip S4.2/S4.3 in favor of using Dialog for sheets too.

- [ ] **Step S4.0.4 — Update core barrel export**

In `packages/core/src/shared/ui/index.ts`, find an alphabetical spot (between `Dialog` and `Field`) and add:
```ts
export {
  Drawer,
  DrawerTrigger,
  DrawerPortal,
  DrawerBackdrop,
  DrawerPopup,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
  DrawerHandle,
} from './base/drawer'
```

- [ ] **Step S4.0.5 — Type-check and commit**

```bash
pnpm --filter @make-the-change/core type-check
git add packages/core/src/shared/ui/base/drawer.tsx packages/core/src/shared/ui/index.ts
git commit -m "feat(core): add Drawer wrapper around @base-ui/react/drawer (S4.0)"
```

### Task S4.1 — Refactor `FullScreenSlideModal` internally on `Dialog`

**Files:**
- Modify: `apps/web-client/src/app/[locale]/@modal/_components/full-screen-slide-modal.tsx`
- Create: `apps/web-client/src/app/[locale]/@modal/_components/use-scroll-elevation.ts`

The component is used by ~55 intercepted route screens. **Its public API MUST stay identical** — only internals change.

- [ ] **Step S4.1.1 — Sync and read current implementation**

```bash
git fetch origin
git rebase origin/main
```

Read `apps/web-client/src/app/[locale]/@modal/_components/full-screen-slide-modal.tsx` fully. Note:
- The exact public props (`title`, `fallbackHref`, `headerMode`, `onClose`, `className`, `contentClassName`, `children`)
- The current animation classes (probably `animate-in slide-in-from-right`)
- The scroll-elevation behavior (header shadow when content is scrolled)
- The close behavior (router.back fallback to fallbackHref)
- Any focus management

- [ ] **Step S4.1.2 — Create the `useScrollElevation` hook**

Create `apps/web-client/src/app/[locale]/@modal/_components/use-scroll-elevation.ts`:

```ts
'use client'

import { useEffect, useState, type RefObject } from 'react'

export function useScrollElevation<T extends HTMLElement>(
  ref: RefObject<T | null>,
  threshold = 4,
): boolean {
  const [elevated, setElevated] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setElevated(el.scrollTop > threshold)
    update()
    el.addEventListener('scroll', update, { passive: true })
    return () => el.removeEventListener('scroll', update)
  }, [ref, threshold])
  return elevated
}
```

- [ ] **Step S4.1.3 — Rewrite `full-screen-slide-modal.tsx`**

Replace the file content with the following. Preserve the exact public API:

```tsx
'use client'

import { Dialog } from '@make-the-change/core/ui'
import { cn } from '@/lib/utils'
import { ChevronLeft, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useScrollElevation } from './use-scroll-elevation'

type FullScreenSlideModalProps = {
  title: string
  fallbackHref?: string
  headerMode?: 'back' | 'close'
  onClose?: () => void
  className?: string
  contentClassName?: string
  children: ReactNode
}

export function FullScreenSlideModal({
  title,
  fallbackHref,
  headerMode = 'close',
  onClose,
  className,
  contentClassName,
  children,
}: FullScreenSlideModalProps) {
  const router = useRouter()
  const [open, setOpen] = useState(true)
  const contentRef = useRef<HTMLDivElement>(null)
  const elevated = useScrollElevation(contentRef)

  // When the dialog wants to close (via Escape, backdrop click, or close button)
  const handleClose = () => {
    setOpen(false)
    onClose?.()
    // wait for close animation, then navigate back
    setTimeout(() => {
      if (fallbackHref) {
        router.push(fallbackHref)
      } else {
        router.back()
      }
    }, 200)
  }

  // Forward escape and click-outside through Dialog.Root
  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && handleClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-200 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0"
        />
        <Dialog.Popup
          className={cn(
            'fixed inset-y-0 right-0 z-50 flex h-[100dvh] w-full flex-col bg-[#0B0F15] text-white shadow-2xl',
            'transition-transform duration-200 ease-out',
            'data-[ending-style]:translate-x-full data-[starting-style]:translate-x-full',
            'sm:max-w-md',
            className,
          )}
        >
          <header
            className={cn(
              'sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between border-b border-white/5 bg-[#0B0F15]/80 px-4 backdrop-blur-xl transition-shadow',
              elevated && 'shadow-[0_4px_12px_rgba(0,0,0,0.3)]',
            )}
          >
            <Dialog.Close
              render={(props) => (
                <button
                  {...props}
                  aria-label="Fermer"
                  className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/5"
                >
                  {headerMode === 'back' ? (
                    <ChevronLeft className="h-5 w-5" />
                  ) : (
                    <X className="h-5 w-5" />
                  )}
                </button>
              )}
            />
            <Dialog.Title className="text-sm font-semibold">{title}</Dialog.Title>
            <div className="w-10" aria-hidden="true" />
          </header>
          <div
            ref={contentRef}
            className={cn('flex-1 overflow-y-auto overscroll-contain', contentClassName)}
          >
            {children}
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
```

If the actual previous implementation included additional behavior (e.g., specific focus management, a custom backdrop click handler), preserve it.

- [ ] **Step S4.1.4 — Type-check**

```bash
pnpm --filter @make-the-change/web-client type-check
```

Note: `Dialog` from core may have a different sub-component naming convention. Check `packages/core/src/shared/ui/base/dialog.tsx` to see if it exports `Dialog.Root` (namespace) or `DialogRoot, DialogPortal, ...` (named exports). Adapt the imports accordingly.

If named exports (e.g. `DialogRoot, DialogContent, DialogClose, DialogTitle`), change:
```tsx
import { Dialog } from '@make-the-change/core/ui'
// ...
<Dialog.Root>...<Dialog.Title>...
```
to:
```tsx
import { DialogRoot, DialogPortal, DialogBackdrop, DialogPopup, DialogClose, DialogTitle } from '@make-the-change/core/ui'
// ...
<DialogRoot>...<DialogTitle>...
```

- [ ] **Step S4.1.5 — Manual verification on 5 representative screens**

Run dev server. Test these screens (each opens the modal via interception):
1. `/fr/login` — login modal
2. `/fr/register` — register wizard modal
3. `/fr/products/balance` — balance modal
4. `/fr/profile/settings/addresses` — addresses modal
5. Any project detail intercepted route

For each:
- Modal slides in from the right
- Header sticky at top with title
- Close button (X or ChevronLeft based on `headerMode`) works
- Escape key closes
- Backdrop click closes
- Scroll inside content area causes the header to gain a subtle shadow (elevation)
- After close, router navigates back (or to fallbackHref)

If any visual regression, adjust the animation classes (`translate-x-full` → `slide-in-from-right` pattern using tailwindcss-animate plugin if it's already in the project).

- [ ] **Step S4.1.6 — Commit**

```bash
git add "apps/web-client/src/app/[locale]/@modal/_components/full-screen-slide-modal.tsx" \
  "apps/web-client/src/app/[locale]/@modal/_components/use-scroll-elevation.ts"
git commit -m "refactor(modal): rewrite FullScreenSlideModal on Base UI Dialog (S4.1)"
```

### Task S4.2 — Refactor `MobileSheet` internally on `Drawer`

**Files:**
- Modify: `apps/web-client/src/app/[locale]/(screens)/projects/[slug]/_components/shared/mobile-sheet.tsx`

- [ ] **Step S4.2.1 — Sync and read current file**

```bash
git fetch origin
git rebase origin/main
```

Read `apps/web-client/src/app/[locale]/(screens)/projects/[slug]/_components/shared/mobile-sheet.tsx`. Note the exact public API (props names like `open`, `onOpenChange`, `title`, `children`, `className`).

- [ ] **Step S4.2.2 — Rewrite the file**

Replace `apps/web-client/src/app/[locale]/(screens)/projects/[slug]/_components/shared/mobile-sheet.tsx` content with:

```tsx
'use client'

import {
  Drawer,
  DrawerBackdrop,
  DrawerHandle,
  DrawerPopup,
  DrawerPortal,
  DrawerTitle,
} from '@make-the-change/core/ui'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

type MobileSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  className?: string
  children: ReactNode
}

export function MobileSheet({ open, onOpenChange, title, className, children }: MobileSheetProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerPortal>
        <DrawerBackdrop
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-200 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0"
        />
        <DrawerPopup
          className={cn(
            'fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[90dvh] w-full max-w-screen-sm flex-col rounded-t-3xl bg-[#0B0F15] text-white shadow-2xl',
            'transition-transform duration-200 ease-out',
            'data-[ending-style]:translate-y-full data-[starting-style]:translate-y-full',
            className,
          )}
        >
          <DrawerHandle className="mx-auto mt-3 h-1 w-12 cursor-grab rounded-full bg-white/20" />
          {title && (
            <DrawerTitle className="px-4 pt-2 text-center text-base font-semibold">
              {title}
            </DrawerTitle>
          )}
          <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-[env(safe-area-inset-bottom)] pt-4">
            {children}
          </div>
        </DrawerPopup>
      </DrawerPortal>
    </Drawer>
  )
}
```

If the original `MobileSheet` had different props (e.g., it didn't use `open/onOpenChange` controlled, but used `isOpen/setIsOpen` or similar), preserve the original prop signature exactly. The internals can be adapted.

- [ ] **Step S4.2.3 — Type-check**

```bash
pnpm --filter @make-the-change/web-client type-check
```

Note: if `DrawerHandle` doesn't exist in `@base-ui/react/drawer` (Base UI may name it differently), remove the `DrawerHandle` import and replace with a manual handle `<div className="..." />`. Check `node_modules/@base-ui/react/drawer/*.d.ts` for the actual exports.

- [ ] **Step S4.2.4 — Manual verification**

Open `/fr/projects/[any-slug]` and trigger any sheet that uses `MobileSheet` (e.g., FundingSheet, BiodexSheet via project quick-view). Test:
- Sheet slides up smoothly
- Handle bar visible at top
- Title centered (if provided)
- Swipe down on the handle area dismisses (Base UI Drawer native gesture)
- Tap backdrop dismisses
- Escape key dismisses

If swipe doesn't work, ensure Base UI Drawer auto-enables it; if not, the API may require an explicit prop.

- [ ] **Step S4.2.5 — Commit**

```bash
git add "apps/web-client/src/app/[locale]/(screens)/projects/[slug]/_components/shared/mobile-sheet.tsx"
git commit -m "refactor(projects): rewrite MobileSheet on Base UI Drawer (S4.2)"
```

### Task S4.3 — Migrate `SavedAddressesSheet` to use the new `MobileSheet`

**Files:**
- Modify: `apps/web-client/src/app/[locale]/(screens)/products/checkout/infos/saved-addresses-sheet.tsx`

The current `SavedAddressesSheet` is a custom bottom sheet (not using `MobileSheet`). We migrate it to use `MobileSheet` for consistency.

- [ ] **Step S4.3.1 — Sync and read**

```bash
git fetch origin
git rebase origin/main
```

Read `apps/web-client/src/app/[locale]/(screens)/products/checkout/infos/saved-addresses-sheet.tsx`. Note:
- Props: `addresses`, `onSelect`, `onClose`
- The custom backdrop + fixed positioning
- The list rendering of addresses

- [ ] **Step S4.3.2 — Rewrite using MobileSheet**

Replace the file content with:

```tsx
'use client'

import { MobileSheet } from '@/app/[locale]/(screens)/projects/[slug]/_components/shared/mobile-sheet'
import type { MockUserAddress } from '@/lib/mock/mock-addresses'
import { AddressLine } from '@/app/[locale]/(screens)/profile/settings/addresses/address-line'

type Props = {
  addresses: MockUserAddress[]
  onSelect: (address: MockUserAddress) => void
  onClose: () => void
}

export function SavedAddressesSheet({ addresses, onSelect, onClose }: Props) {
  return (
    <MobileSheet open={true} onOpenChange={(open) => { if (!open) onClose() }} title="Mes adresses">
      <ul className="space-y-2 pb-6">
        {addresses.map((address) => (
          <li key={address.id}>
            <button
              type="button"
              onClick={() => { onSelect(address); onClose() }}
              className="flex w-full items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-left active:bg-white/[0.05]"
            >
              <AddressLine address={address} showIcon />
            </button>
          </li>
        ))}
        {addresses.length === 0 && (
          <p className="px-4 text-center text-sm text-white/40">Aucune adresse sauvegardée.</p>
        )}
      </ul>
    </MobileSheet>
  )
}
```

Verify the import path of `AddressLine` matches the actual location in the codebase. Adapt if it lives elsewhere.

- [ ] **Step S4.3.3 — Type-check and verify**

```bash
pnpm --filter @make-the-change/web-client type-check
```

Manual: open `/fr/products/checkout/infos`, click "Utiliser une adresse sauvegardée" (if user has saved addresses) — the sheet should slide up using the new MobileSheet/Drawer base.

- [ ] **Step S4.3.4 — Commit**

```bash
git add "apps/web-client/src/app/[locale]/(screens)/products/checkout/infos/saved-addresses-sheet.tsx"
git commit -m "refactor(checkout): migrate SavedAddressesSheet to MobileSheet (S4.3)"
```

### Task S4.4 — Migrate `KinnuBottomSheet` to Drawer directly

**Files:**
- Modify: `apps/web-client/src/app/[locale]/(lab)/kinnu/_components/kinnu-bottom-sheet.tsx`

This sheet has more custom structure (animated cards, particles, etc.). We migrate the outer shell to use Drawer directly (not MobileSheet), preserving the inner Framer Motion animations.

- [ ] **Step S4.4.1 — Sync and read**

```bash
git fetch origin
git rebase origin/main
```

Read `apps/web-client/src/app/[locale]/(lab)/kinnu/_components/kinnu-bottom-sheet.tsx` (~219 lines). Identify:
- The outer sheet wrapper (with backdrop, animation)
- The inner content (Framer-animated cards, progress bars, particles)
- The props: typically `open`, `onClose`, `children` or specific content props

- [ ] **Step S4.4.2 — Refactor outer shell to use Drawer**

Replace the outer wrapper (backdrop + animated div + close button) with Drawer composition, KEEPING the inner Framer Motion content untouched.

Identify the outer block:
```tsx
<AnimatePresence>
  {open && (
    <>
      <motion.div className="fixed inset-0 bg-black/40 ..." onClick={onClose} />
      <motion.div className="fixed inset-x-0 bottom-0 ..." initial={...} animate={...} exit={...}>
        {/* inner content with cards, particles, etc. */}
      </motion.div>
    </>
  )}
</AnimatePresence>
```

Replace with:

```tsx
<Drawer open={open} onOpenChange={(v) => !v && onClose()}>
  <DrawerPortal>
    <DrawerBackdrop className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-200 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
    <DrawerPopup
      className={cn(
        'fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[90dvh] w-full max-w-screen-sm flex-col rounded-t-3xl bg-[#0B0F15] text-white shadow-2xl',
        'transition-transform duration-200 ease-out',
        'data-[ending-style]:translate-y-full data-[starting-style]:translate-y-full',
      )}
    >
      <DrawerHandle className="mx-auto mt-3 h-1 w-12 rounded-full bg-white/20" />
      {/* PRESERVE the existing inner content (Framer-animated cards, etc.) AS-IS */}
      <div className="flex-1 overflow-y-auto overscroll-contain p-4 pb-[env(safe-area-inset-bottom)]">
        {/* paste the existing inner content here */}
      </div>
    </DrawerPopup>
  </DrawerPortal>
</Drawer>
```

Update imports: add `Drawer, DrawerPortal, DrawerBackdrop, DrawerPopup, DrawerHandle` from `@make-the-change/core/ui`. Add `cn` from `@/lib/utils`. Remove `AnimatePresence` and the outer `motion.div`/backdrop usages (keep Framer Motion for inner content).

- [ ] **Step S4.4.3 — Type-check**

```bash
pnpm --filter @make-the-change/web-client type-check
```

- [ ] **Step S4.4.4 — Manual verification**

Open `/fr/lab/kinnu` (or wherever the sheet is triggered). Test that the sheet still opens, the inner animations still play, swipe-down dismisses, and there's no visual regression.

- [ ] **Step S4.4.5 — Commit**

```bash
git add "apps/web-client/src/app/[locale]/(lab)/kinnu/_components/kinnu-bottom-sheet.tsx"
git commit -m "refactor(kinnu): migrate KinnuBottomSheet outer shell to Drawer (S4.4)"
```

---

## Final verification (after S4.4)

Run all criteria from spec section 10.

- [ ] **F.1 — Zero raw `<select>` form controls (except documented Server Component case)**

```bash
grep -rn "<select " apps/web-client/src/app --include="*.tsx" | grep -v "Native select:"
```
Expected: empty (or only the documented Server Component cases in S1.4).

- [ ] **F.2 — Zero hand-rolled accordion with useState + Framer in the 3 migrated files**

```bash
grep -rn "AnimatePresence" \
  "apps/web-client/src/app/[locale]/(site)/faq/_features/faq-accordion.tsx" \
  "apps/web-client/src/app/[locale]/(screens)/products/[id]/_components/product-information-sections.tsx" \
  "apps/web-client/src/app/[locale]/(site)/(home)/_components/sections/home-faq-section.tsx"
```
Expected: empty.

- [ ] **F.3 — AddressAutocompleteInput uses Base UI Autocomplete**

```bash
grep -n "@base-ui/react/autocomplete\|core/ui.*Autocomplete" \
  "apps/web-client/src/app/[locale]/(screens)/_components/address-autocomplete-input.tsx"
```
Expected: shows the Base UI import.

- [ ] **F.4 — FullScreenSlideModal uses Dialog**

```bash
grep -n "core/ui.*Dialog\|DialogPopup" \
  "apps/web-client/src/app/[locale]/@modal/_components/full-screen-slide-modal.tsx"
```
Expected: shows the Dialog import/usage.

- [ ] **F.5 — MobileSheet uses Drawer**

```bash
grep -n "Drawer" \
  "apps/web-client/src/app/[locale]/(screens)/projects/[slug]/_components/shared/mobile-sheet.tsx"
```
Expected: shows Drawer.

- [ ] **F.6 — SavedAddressesSheet uses MobileSheet**

```bash
grep -n "MobileSheet" \
  "apps/web-client/src/app/[locale]/(screens)/products/checkout/infos/saved-addresses-sheet.tsx"
```
Expected: shows MobileSheet import.

- [ ] **F.7 — Tests pass**

```bash
pnpm --filter @make-the-change/core test
pnpm --filter @make-the-change/web-client type-check
```
Expected: all core tests pass, type-check shows only pre-existing errors.

- [ ] **F.8 — Documentation**

Verify or create documentation for Disclosure patterns (Accordion, Collapsible) and Overlay patterns (Dialog, Drawer). Append to `docs/02-product/design-system/forms.md` or create a sibling file.

If not done during the sprints, do it now:

Add the following section to `docs/02-product/design-system/forms.md` (or create `docs/02-product/design-system/overlays.md`):

```markdown
## Disclosure patterns

### Accordion (single/multiple expand)

Use `<Accordion>` + `<AccordionItem>` + `<AccordionTrigger>` + `<AccordionContent>` from `@make-the-change/core/ui`. Animations are CSS-native via `data-[panel-open]` / `data-[ending-style]` / `data-[starting-style]` selectors.

\`\`\`tsx
<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Question</AccordionTrigger>
    <AccordionContent>Answer</AccordionContent>
  </AccordionItem>
</Accordion>
\`\`\`

For multiple sections open at once, use `type="multiple"`.

For custom open/close icons (e.g., Plus/Minus instead of ChevronDown), hide the default chevron with `[&>svg]:hidden` on `AccordionTrigger` and add your own icons with `group-data-[panel-open]:hidden` / `data-[panel-open]:block` selectors.

## Overlay patterns

### Full-screen slide modal — `<FullScreenSlideModal>`

Wrapper around Base UI `Dialog`. Used by all `@modal` intercepted routes. Public API:

\`\`\`tsx
<FullScreenSlideModal
  title="Edit address"
  fallbackHref="/profile/settings/addresses"
  headerMode="back"
  onClose={() => { /* optional */ }}
>
  {/* content */}
</FullScreenSlideModal>
\`\`\`

The header gains a shadow when content is scrolled (elevation effect via `useScrollElevation`).

### Bottom sheet — `<MobileSheet>`

Wrapper around Base UI `Drawer`. Slides up from the bottom, includes swipe-down-to-dismiss.

\`\`\`tsx
<MobileSheet open={open} onOpenChange={setOpen} title="My addresses">
  {/* content */}
</MobileSheet>
\`\`\`
```

(Note: when writing the file, replace `\`\`\`` with triple backticks.)

Commit:
```bash
git add docs/02-product/design-system/forms.md  # or overlays.md
git commit -m "docs(design-system): document Accordion + FullScreenSlideModal + MobileSheet patterns"
```

- [ ] **F.9 — Manual verification on representative screens**

Open dev server (`pnpm --filter @make-the-change/web-client dev`) and test:

1. **`/fr/login`** — login modal slides in, escape closes, focus trap works
2. **`/fr/products/checkout/infos`** — country select opens, addresses sheet (if any) slides up, autocomplete works on street field
3. **`/fr/faq`** — accordion opens/closes smoothly, animations OK on Chrome + Safari
4. **`/fr/projects/[any-slug]`** — project detail modal opens, MobileSheets (funding, biodex) work
5. **`/fr/profile/settings/addresses`** — country select in address form works, addresses sheet OK

If any visual regression, file an issue and fix before merge.

---

## Plan complete

Total: 4 sprints (S1, S2, S3, S4), 11 main tasks, ~50 sub-steps.

Each sprint produces working code with tests + type-check passing + commit. The plan is conservative on Base UI's exact API — when in doubt, the implementer should inspect `node_modules/@base-ui/react/*/index.d.ts` to verify component prop names before writing code.
