# Base UI Vague 3 Core Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrer les composants moyens hand-rolled de `web-client` (confirmation destructive, switches, tabs, radio groups, sliders, progress/meter) vers Base UI, en créant 2 composants partagés pour les patterns dupliqués (`ConfirmDestructiveDialog`, `NotificationToggleRow`).

**Architecture:** 6 sprints incrémentaux S1→S6. Composants partagés vivent dans `apps/web-client/src/components/ui/`. Les wrappers Base UI utilisés sont déjà dans `packages/core` (Switch, AlertDialog, Tabs, Radio, Slider, Progress, Meter — APIs vérifiées avant rédaction du plan).

**Tech Stack:** TypeScript, React 19, Next.js 16 App Router, `@base-ui/react` ^1.1, Tailwind CSS 4, `tw-animate-css` (déjà installé en vague 2 finale).

**Spec source:** `docs/superpowers/specs/2026-06-04-base-ui-vague-3-core-design.md`

---

## APIs Base UI vérifiées (référence)

Avant chaque sprint, l'implémenteur peut se référer aux wrappers core déjà existants :

```
packages/core/src/shared/ui/base/
  alert-dialog.tsx  → AlertDialog, AlertDialogTrigger, AlertDialogPortal, AlertDialogOverlay,
                      AlertDialogContent (auto-Portal+Overlay+Viewport+Popup, centered modal),
                      AlertDialogTitle, AlertDialogDescription, AlertDialogAction,
                      AlertDialogCancel, AlertDialogClose
                      → utiliser <AlertDialog open={...} onOpenChange={...}>
                                  <AlertDialogContent>
                                    <AlertDialogTitle>...</AlertDialogTitle>
                                    <AlertDialogDescription>...</AlertDialogDescription>
                                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                                    <AlertDialogAction>Confirmer</AlertDialogAction>
                                  </AlertDialogContent>
                                </AlertDialog>

  switch.tsx        → Switch (Root déjà inclut un Thumb interne avec animations)
                      → utiliser <Switch checked={...} onCheckedChange={...} className="..." />
                      → le Thumb est rendu automatiquement, override via className global

  tabs.tsx          → Tabs (Root), TabsList, TabsTrigger, TabsContent
                      → utiliser <Tabs value={...} onValueChange={(v: string) => ...}>
                                  <TabsList>
                                    <TabsTrigger value="...">Label</TabsTrigger>
                                  </TabsList>
                                  <TabsContent value="...">...</TabsContent>
                                </Tabs>
                      → data-[selected] pour styler le tab actif

  radio.tsx         → RadioGroup, Radio (avec Indicator interne)
                      → utiliser <RadioGroup value={...} onValueChange={(v: string) => ...}>
                                  <label><Radio value="..." /> Texte</label>
                                </RadioGroup>
                      → data-[checked] pour styler

  slider.tsx        → Slider (Root + Control + Track + Indicator imbriqués), SliderThumb
                      → utiliser <Slider value={[x]} onValueChange={(v: number[]) => ...} min={0} max={100} step={5}>
                                  <SliderThumb />
                                </Slider>

  progress.tsx (custom wrapper)
                    → Progress {value, max=100, className, indicatorClassName}
                      → utiliser <Progress value={x} className="..." indicatorClassName="bg-lime-400" />

  meter.tsx         → Meter (Root), MeterTrack, MeterIndicator, MeterValue, MeterLabel
                      → utiliser <Meter value={x} min={0} max={100} className="...">
                                  <MeterTrack className="...">
                                    <MeterIndicator className="..." />
                                  </MeterTrack>
                                </Meter>
```

---

## Setup — Worktree isolé

**Files:**
- None — git operations only

- [ ] **Step 0.1 — Sync main and create worktree**

Run from main repo root:
```bash
cd "c:\Users\utilisateur\Downloads\make-the-change-main\make-the-change-main\repo-propre5"
git fetch origin
git worktree add -b feat/base-ui-vague-3-core .worktrees/base-ui-vague-3-core origin/main
cd .worktrees/base-ui-vague-3-core
pnpm install
```
Expected: new worktree at `.worktrees/base-ui-vague-3-core/`, on branch `feat/base-ui-vague-3-core`.

- [ ] **Step 0.2 — Baseline checks pass**

```bash
pnpm --filter @make-the-change/core test
pnpm --filter @make-the-change/web-client type-check
```
Expected: tests pass, type-check exit 0 (the vague 2 fixes already cleaned all pre-existing errors).

---

## S1 — `ConfirmDestructiveDialog` + 2 migrations Academy/Streak

### Task S1.1 — Create `ConfirmDestructiveDialog` shared component

**Files:**
- Create: `apps/web-client/src/components/ui/confirm-destructive-dialog.tsx`

- [ ] **Step S1.1.1 — Write the component file**

Create `apps/web-client/src/components/ui/confirm-destructive-dialog.tsx`:

```tsx
'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@make-the-change/core/ui'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ConfirmDestructiveDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void | Promise<void>
  isPending?: boolean
}

export function ConfirmDestructiveDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  onConfirm,
  isPending = false,
}: ConfirmDestructiveDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        className={cn(
          // Override defaults: dark surface, z-index above FullScreenSlideModal (z-100)
          'z-[120] max-w-sm rounded-2xl border-white/10 bg-[#0B0F15] p-6 shadow-2xl',
        )}
      >
        <AlertDialogTitle className="text-lg font-bold text-white">
          {title}
        </AlertDialogTitle>
        <AlertDialogDescription className="mt-2 text-sm text-white/70">
          {description}
        </AlertDialogDescription>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <AlertDialogCancel
            disabled={isPending}
            className="border border-white/10 bg-transparent text-white/80 hover:bg-white/5"
          >
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={(event) => {
              event.preventDefault()
              void Promise.resolve(onConfirm())
            }}
            className="inline-flex items-center gap-2 bg-red-500 text-white hover:bg-red-600"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {confirmLabel}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

Note about `onClick` on `AlertDialogAction`: Base UI's `AlertDialogAction` is `AlertDialog.Close`, so clicking it closes the dialog automatically. We call `event.preventDefault()` only when `isPending=true` would be problematic — but actually, since we want close-on-click to happen AFTER `onConfirm` (or to let the parent dismiss via `onOpenChange`), we instead let Base UI handle the close and trigger `onConfirm` before the close. Using `preventDefault` here keeps the dialog open if the caller chooses to control closing via `isPending` → `onOpenChange(false)` after success.

- [ ] **Step S1.1.2 — Type-check**

```bash
pnpm --filter @make-the-change/web-client type-check
```
Expected: exit 0.

- [ ] **Step S1.1.3 — Commit**

```bash
git add "apps/web-client/src/components/ui/confirm-destructive-dialog.tsx"
git commit -m "feat(web-client): add ConfirmDestructiveDialog shared component (S1.1)"
```

### Task S1.2 — Migrate Academy reset confirmation

**Files:**
- Modify: `apps/web-client/src/app/[locale]/(screens)/academy/page.tsx`

- [ ] **Step S1.2.1 — Sync before starting**

```bash
git fetch origin
git rebase origin/main
```

- [ ] **Step S1.2.2 — Read current implementation**

Read `apps/web-client/src/app/[locale]/(screens)/academy/page.tsx`. Locate the `ResetConfirmModal` JSX block — typically around lines 207-248 — that uses `setShowResetConfirm` + `<FullScreenSlideModal>`.

- [ ] **Step S1.2.3 — Add import**

In the imports block at the top, add:
```tsx
import { ConfirmDestructiveDialog } from '@/components/ui/confirm-destructive-dialog'
```

- [ ] **Step S1.2.4 — Replace the modal block**

Find the block that renders the reset confirmation (uses `FullScreenSlideModal`, has "Réinitialiser ta progression" and "Annuler"/"Réinitialiser" buttons). Replace it with:

```tsx
<ConfirmDestructiveDialog
  open={showResetConfirm}
  onOpenChange={setShowResetConfirm}
  title="Réinitialiser ta progression ?"
  description="Cette action supprimera l'ensemble de ta progression d'apprentissage. Cette action est irréversible."
  confirmLabel="Réinitialiser"
  onConfirm={handleReset}
/>
```

Adapt:
- The `title` and `description` text to the EXACT wording from the original (read the original to copy verbatim).
- `handleReset` should be the existing function name in the file. If it has a different name (e.g., `resetProgress`, `confirmReset`), use that.
- If the reset call is inline (not in a function), extract it into `handleReset` first.

If `FullScreenSlideModal` is no longer imported elsewhere in the file, remove it from the imports.

- [ ] **Step S1.2.5 — Verify type-check**

```bash
pnpm --filter @make-the-change/web-client type-check
```
Expected: exit 0.

- [ ] **Step S1.2.6 — Commit**

```bash
git add "apps/web-client/src/app/[locale]/(screens)/academy/page.tsx"
git commit -m "refactor(academy): migrate reset confirm to ConfirmDestructiveDialog (S1.2)"
```

### Task S1.3 — Migrate Streak reset confirmation

**Files:**
- Modify: `apps/web-client/src/app/[locale]/(screens)/academy/streak/page.tsx`

- [ ] **Step S1.3.1 — Sync**

```bash
git fetch origin
git rebase origin/main
```

- [ ] **Step S1.3.2 — Read and locate the modal**

Read `apps/web-client/src/app/[locale]/(screens)/academy/streak/page.tsx`. Find the `setShowResetConfirm` state and the `<FullScreenSlideModal>` block that renders the reset confirmation (around lines 141-162).

- [ ] **Step S1.3.3 — Add import**

Add at the top:
```tsx
import { ConfirmDestructiveDialog } from '@/components/ui/confirm-destructive-dialog'
```

- [ ] **Step S1.3.4 — Replace the modal block**

Replace the `<FullScreenSlideModal>` reset block with:

```tsx
<ConfirmDestructiveDialog
  open={showResetConfirm}
  onOpenChange={setShowResetConfirm}
  title="Réinitialiser ta série ?"
  description="Ta série actuelle sera remise à zéro. Tes prochaines connexions reconstruiront une nouvelle série."
  confirmLabel="Réinitialiser"
  onConfirm={handleStreakReset}
/>
```

Adapt the title, description, and function name to match the original file exactly.

If `FullScreenSlideModal` is no longer used elsewhere in the file, remove the import.

- [ ] **Step S1.3.5 — Type-check + commit**

```bash
pnpm --filter @make-the-change/web-client type-check
git add "apps/web-client/src/app/[locale]/(screens)/academy/streak/page.tsx"
git commit -m "refactor(streak): migrate reset confirm to ConfirmDestructiveDialog (S1.3)"
```

---

## S2 — `NotificationToggleRow` + Switch migrations

### Task S2.1 — Create `NotificationToggleRow` shared component

**Files:**
- Create: `apps/web-client/src/components/ui/notification-toggle-row.tsx`

- [ ] **Step S2.1.1 — Sync**

```bash
git fetch origin
git rebase origin/main
```

- [ ] **Step S2.1.2 — Write the component**

Create `apps/web-client/src/components/ui/notification-toggle-row.tsx`:

```tsx
'use client'

import { Switch } from '@make-the-change/core/ui'
import { cn } from '@/lib/utils'

export type NotificationToggleRowProps = {
  label: string
  description?: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

export function NotificationToggleRow({
  label,
  description,
  checked,
  onCheckedChange,
  disabled = false,
  className,
}: NotificationToggleRowProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 px-5 py-4 bg-transparent transition-colors active:bg-white/[0.02]',
        className,
      )}
    >
      <div className="flex flex-col justify-center flex-1 min-w-0">
        <h3 className="text-base font-medium text-white mb-0.5">{label}</h3>
        {description && (
          <span className="text-xs text-gray-500 leading-snug">{description}</span>
        )}
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className={cn(
          'h-7 w-12 border-2 border-transparent transition-colors duration-200',
          'data-[checked]:bg-lime-400 data-[unchecked]:bg-white/10',
          '[&>span]:h-6 [&>span]:w-6 [&>span]:rounded-full [&>span]:transition-transform [&>span]:duration-200',
          '[&>span]:data-[checked]:translate-x-5 [&>span]:data-[unchecked]:translate-x-0',
          '[&>span]:data-[checked]:bg-[#0B0F15] [&>span]:data-[unchecked]:bg-white',
        )}
      />
    </div>
  )
}
```

Note: the `[&>span]:...` selectors style the Switch.Thumb that is rendered automatically inside `Switch.Root`. This preserves the exact visual of the original local `ToggleSwitch`.

- [ ] **Step S2.1.3 — Type-check**

```bash
pnpm --filter @make-the-change/web-client type-check
```
Expected: exit 0.

- [ ] **Step S2.1.4 — Commit**

```bash
git add "apps/web-client/src/components/ui/notification-toggle-row.tsx"
git commit -m "feat(web-client): add NotificationToggleRow shared component (S2.1)"
```

### Task S2.2 — Migrate notifications-client.tsx

**Files:**
- Modify: `apps/web-client/src/app/[locale]/(screens)/profile/settings/notifications/notifications-client.tsx`

- [ ] **Step S2.2.1 — Sync and read**

```bash
git fetch origin
git rebase origin/main
```

Read `apps/web-client/src/app/[locale]/(screens)/profile/settings/notifications/notifications-client.tsx`. Note the local `ToggleSwitch` definition (around lines 26-39) and `SettingRow` (around lines 41-61), and the 8 usages of `<SettingRow>` further down.

- [ ] **Step S2.2.2 — Replace import block at top**

Add the import:
```tsx
import { NotificationToggleRow } from '@/components/ui/notification-toggle-row'
```

- [ ] **Step S2.2.3 — Delete the local `ToggleSwitch` and `SettingRow` components**

Delete both function definitions (lines ~26-61):
- `function ToggleSwitch(...)` — entire definition
- `function SettingRow(...)` — entire definition

- [ ] **Step S2.2.4 — Replace all `<SettingRow>` usages with `<NotificationToggleRow>`**

The component's API maps directly:
- `title` prop → `label`
- `description` prop unchanged
- `checked` prop unchanged
- `onToggle` prop → `onCheckedChange={(v) => /* update setting */}` (note: original `onToggle` is `() => void`, now we get `(checked: boolean) => void`)

Find each `<SettingRow title="..." description="..." checked={...} onToggle={...} />` and replace with:
```tsx
<NotificationToggleRow
  label="..."
  description="..."
  checked={...}
  onCheckedChange={(checked) => {
    setSettings((prev) => ({ ...prev, <SETTING_KEY>: checked }))
    void updateNotifications({ ...settings, <SETTING_KEY>: checked })
  }}
/>
```

Adapt the closure body to match the existing `onToggle` body, but use the new `checked` argument value instead of `!settings.<key>`. If the original uses a generic `handleToggle(key)`, refactor it to `handleCheckedChange(key, checked)` or inline the closure.

Use the **exact** title and description strings from the original — copy them character-by-character.

- [ ] **Step S2.2.5 — Type-check and commit**

```bash
pnpm --filter @make-the-change/web-client type-check
```
Expected: exit 0.

```bash
git add "apps/web-client/src/app/[locale]/(screens)/profile/settings/notifications/notifications-client.tsx"
git commit -m "refactor(notifications): migrate 8 toggles to NotificationToggleRow (S2.2)"
```

### Task S2.3 — Migrate checkout "Sauvegarder cette adresse" toggle

**Files:**
- Modify: `apps/web-client/src/app/[locale]/(screens)/products/checkout/infos/infos-client.tsx`

- [ ] **Step S2.3.1 — Sync and read**

```bash
git fetch origin
git rebase origin/main
```

Read the file. Find the toggle block around lines 314-335 (the "Sauvegarder cette adresse" toggle that uses div + translate-x animations on click).

- [ ] **Step S2.3.2 — Add Switch import**

In the existing import block from `@make-the-change/core/ui`, add `Switch`:

```tsx
  Switch,
```

(Alphabetical position within the import block.)

- [ ] **Step S2.3.3 — Replace the toggle block**

Find the block (around lines 314-335) that renders the "Sauvegarder cette adresse" toggle as a div + nested div with translate-x animations. Replace the entire `<button>` (or `<div role="switch">`) block with:

```tsx
<div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
  <div className="flex flex-col flex-1 min-w-0">
    <span className="text-sm font-medium text-white">Sauvegarder cette adresse</span>
    <span className="text-xs text-white/40 mt-0.5">Pour la retrouver à ta prochaine commande</span>
  </div>
  <Switch
    checked={saveAddress}
    onCheckedChange={setSaveAddress}
    className="h-6 w-11 border-2 border-transparent data-[checked]:bg-lime-300 data-[unchecked]:bg-white/20 [&>span]:h-5 [&>span]:w-5 [&>span]:rounded-full [&>span]:bg-white [&>span]:data-[checked]:translate-x-5 [&>span]:data-[unchecked]:translate-x-0.5"
  />
</div>
```

If the original wording is different (e.g., "Mémoriser pour la prochaine fois", or no description), preserve the original strings.

- [ ] **Step S2.3.4 — Type-check and commit**

```bash
pnpm --filter @make-the-change/web-client type-check
```
Expected: exit 0.

```bash
git add "apps/web-client/src/app/[locale]/(screens)/products/checkout/infos/infos-client.tsx"
git commit -m "refactor(checkout): migrate save-address toggle to Base UI Switch (S2.3)"
```

---

## S3 — Tabs migration

### Task S3.1 — Migrate `project-detail-tabs.tsx`

**Files:**
- Modify: `apps/web-client/src/app/[locale]/(screens)/projects/[slug]/_components/project-detail-tabs.tsx`

- [ ] **Step S3.1.1 — Sync and read full file**

```bash
git fetch origin
git rebase origin/main
```

Read the entire file. Identify:
- The `ProjectDetailTabId` type definition
- The `tabs` array (list of `{ id, label }`)
- The state: `const [activeTab, setActiveTab] = useState<ProjectDetailTabId>(...)`
- The JSX: `role="tablist"` div with `<button role="tab">` children
- Any sticky behavior or scroll handlers

- [ ] **Step S3.1.2 — Update imports**

In the import block from `@make-the-change/core/ui` (or add it if absent), add:
```tsx
  Tabs,
  TabsList,
  TabsTrigger,
```

Note: we do NOT import `TabsContent` because the panels (content per tab) are typically rendered elsewhere in the page — this component just owns the tablist. If TabsContent is needed (the file contains both list and panels), add it too.

- [ ] **Step S3.1.3 — Replace tablist block**

Replace the manual tab navigation block. Pattern:

```tsx
// BEFORE — manual tablist
<div role="tablist" className="...">
  {tabs.map((tab) => (
    <button
      key={tab.id}
      role="tab"
      aria-selected={activeTab === tab.id}
      onClick={() => setActiveTab(tab.id)}
      className={cn(/* pill styles, isActive variant */)}
    >
      {tab.label}
    </button>
  ))}
</div>

// AFTER — Base UI Tabs
<Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ProjectDetailTabId)}>
  <TabsList className="<original className from the manual tablist div, minus role>">
    {tabs.map((tab) => (
      <TabsTrigger
        key={tab.id}
        value={tab.id}
        className={cn(
          // Preserve original active/inactive pill styling using data-[selected]:
          // Example based on typical pattern observed:
          'whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold shrink-0 transition-colors',
          'data-[selected]:bg-lime-400 data-[selected]:text-[#0B0F15]',
          'border border-white/10 text-gray-400 data-[selected]:border-transparent',
        )}
      >
        {tab.label}
      </TabsTrigger>
    ))}
  </TabsList>
</Tabs>
```

**Important adaptations**:
- Read the EXACT current className strings on the manual buttons. Translate `${isActive ? 'A' : 'B'}` into `data-[selected]:A` + base `B`. The active class set goes to `data-[selected]:` selectors, the inactive set stays as base classes.
- Preserve the original `role="tablist"` container className verbatim on `<TabsList>` (with role removed since Base UI sets it).
- The `tab.id` is a `string` from `ProjectDetailTabId` (a string literal union). `onValueChange` receives `string`, cast to `ProjectDetailTabId`.

- [ ] **Step S3.1.4 — Type-check and commit**

```bash
pnpm --filter @make-the-change/web-client type-check
```
Expected: exit 0.

```bash
git add "apps/web-client/src/app/[locale]/(screens)/projects/[slug]/_components/project-detail-tabs.tsx"
git commit -m "refactor(projects): migrate project detail tabs to Base UI Tabs (S3.1)"
```

### Task S3.2 — Check `project-quick-view.tsx` for internal tabs

**Files:**
- Read: `apps/web-client/src/app/[locale]/(screens)/projects/[slug]/project-quick-view.tsx`
- Possibly modify: same file

- [ ] **Step S3.2.1 — Read and check for tab patterns**

Read `apps/web-client/src/app/[locale]/(screens)/projects/[slug]/project-quick-view.tsx`. Search for:
- `role="tab"`
- `role="tablist"`
- `setActiveTab` or similar useState pattern

If FOUND: apply the same migration pattern as S3.1, adapting to the local tab variable names and styling.

If NOT FOUND: this task is skipped — record as "no internal tabs found" in the commit log of S3.1 (no separate commit needed).

- [ ] **Step S3.2.2 — Commit (if any change)**

```bash
git add "apps/web-client/src/app/[locale]/(screens)/projects/[slug]/project-quick-view.tsx"
git commit -m "refactor(projects): migrate quick-view internal tabs to Base UI Tabs (S3.2)"
```

If no change was made, skip this step entirely.

---

## S4 — RadioGroup migration

### Task S4.1 — Migrate `experience-slot-picker.tsx`

**Files:**
- Modify: `apps/web-client/src/app/[locale]/(screens)/advantages/[id]/_features/experience-slot-picker.tsx`

- [ ] **Step S4.1.1 — Sync and read**

```bash
git fetch origin
git rebase origin/main
```

Read `apps/web-client/src/app/[locale]/(screens)/advantages/[id]/_features/experience-slot-picker.tsx`. Note:
- The `slots` array structure (likely `{ id, dateLabel, timeLabel, capacity?, isSelected? }[]`)
- The state: `selectedSlotId` or similar
- The manual `role="radiogroup"` wrapper
- The `<input type="radio" sr-only>` inside each `<label>`

- [ ] **Step S4.1.2 — Add imports**

In the imports block from `@make-the-change/core/ui` (add the import if absent), add:
```tsx
  Radio,
  RadioGroup,
```

- [ ] **Step S4.1.3 — Replace the radiogroup block**

Pattern:

```tsx
// BEFORE — manual radio group
<div role="radiogroup">
  {slots.map((slot) => (
    <label key={slot.id} className={cn('card classes', selected && 'selected classes')}>
      <input
        type="radio"
        name="experience-slot"
        value={slot.id}
        checked={selectedSlotId === slot.id}
        onChange={() => onSelect(slot.id)}
        className="sr-only"
      />
      {/* visual content: date, time, capacity badge */}
    </label>
  ))}
</div>

// AFTER — Base UI RadioGroup
<RadioGroup
  value={selectedSlotId ?? ''}
  onValueChange={(value) => onSelect(String(value))}
  className="grid gap-3"
>
  {slots.map((slot) => (
    <label
      key={slot.id}
      className={cn(
        'cursor-pointer rounded-xl border bg-white/[0.02] p-4 transition-colors',
        'has-data-[checked]:border-lime-300/40 has-data-[checked]:bg-lime-300/[0.06]',
        'border-white/10',
      )}
    >
      <Radio value={slot.id} className="sr-only" />
      {/* visual content: date, time, capacity badge — preserve EXACT existing JSX */}
    </label>
  ))}
</RadioGroup>
```

**Important adaptations**:
- Read the EXACT current visual JSX inside each radio button (dates, times, badges). Copy verbatim into the new `<label>`.
- `selectedSlotId` may be a different state variable name — read the file to use the actual name.
- The `has-data-[checked]:` Tailwind selector targets the parent when a child has `data-checked`. This replaces the JS-side `isSelected` className conditional.
- If the original used `aria-label` on the radio button (e.g., `${slot.dateLabel} ${slot.timeLabel}`), apply that as `aria-label` on the `<Radio>`.

- [ ] **Step S4.1.4 — Type-check and commit**

```bash
pnpm --filter @make-the-change/web-client type-check
```
Expected: exit 0.

```bash
git add "apps/web-client/src/app/[locale]/(screens)/advantages/[id]/_features/experience-slot-picker.tsx"
git commit -m "refactor(advantages): migrate experience slot picker to Base UI RadioGroup (S4.1)"
```

---

## S5 — Slider migrations

### Task S5.1 — Migrate academy confidence slider

**Files:**
- Modify: `apps/web-client/src/app/[locale]/(screens)/academy/[chapter]/[unit]/page.tsx`

- [ ] **Step S5.1.1 — Sync and read**

```bash
git fetch origin
git rebase origin/main
```

Read the file and locate the `<input type="range">` element around line 727. Note the state variable (likely `confidence`, `setConfidence`), the min/max/step values, and the surrounding label/visual context.

- [ ] **Step S5.1.2 — Add imports**

In the imports block, add:
```tsx
import { Slider, SliderThumb } from '@make-the-change/core/ui'
```

(If the file already imports from `@make-the-change/core/ui`, add `Slider` and `SliderThumb` to that block.)

- [ ] **Step S5.1.3 — Replace the input range**

Find the input range block. Pattern:

```tsx
// BEFORE
<input
  type="range"
  min={0}
  max={100}
  step={5}
  value={confidence}
  onChange={(e) => setConfidence(Number(e.target.value))}
  aria-label="Niveau de confiance"
  className="... accent-emerald-500 ..."
/>

// AFTER
<Slider
  value={[confidence]}
  onValueChange={(values) => setConfidence(values[0] ?? 0)}
  min={0}
  max={100}
  step={5}
  aria-label="Niveau de confiance"
  className="h-6 w-full"
>
  <SliderThumb className="h-5 w-5 border-emerald-500/40 bg-emerald-500" />
</Slider>
```

**Important**:
- Base UI `Slider` takes `value` as `number[]` (it supports multi-thumb). For single-thumb, wrap the value: `[confidence]`.
- `onValueChange` receives `number[]`. For single-thumb, read `values[0]`.
- The internal Track + Indicator are rendered automatically. To preserve the green `accent-emerald-500` color, we override on `SliderThumb` (which is the visible thumb).
- If a green track is desired, use a className with `[&_[data-orientation]_>_:nth-child(1)_>_:nth-child(1)]:bg-emerald-500` on the `<Slider>` — but simpler: read the existing visual; if green only on thumb is enough, that's done above.

- [ ] **Step S5.1.4 — Type-check and commit**

```bash
pnpm --filter @make-the-change/web-client type-check
```
Expected: exit 0.

```bash
git add "apps/web-client/src/app/[locale]/(screens)/academy/[chapter]/[unit]/page.tsx"
git commit -m "refactor(academy): migrate confidence slider to Base UI Slider (S5.1)"
```

### Task S5.2 — Migrate ecosystem-interactions-lab slider

**Files:**
- Modify: `apps/web-client/src/app/[locale]/(screens)/ecosysteme/_components/ecosystem-interactions-lab.tsx`

- [ ] **Step S5.2.1 — Sync and locate**

```bash
git fetch origin
git rebase origin/main
```

Read the file. Search for `<input type="range">`. Identify the state and styling.

- [ ] **Step S5.2.2 — Add imports + replace**

Add to imports:
```tsx
import { Slider, SliderThumb } from '@make-the-change/core/ui'
```

Replace the `<input type="range">` with the same pattern as S5.1.3, adapting:
- The state variable name (could be `interactionStrength`, `intensity`, etc.)
- The min/max/step values
- The aria-label
- Any existing accent color (preserve via className on `SliderThumb`)

- [ ] **Step S5.2.3 — Type-check and commit**

```bash
pnpm --filter @make-the-change/web-client type-check
git add "apps/web-client/src/app/[locale]/(screens)/ecosysteme/_components/ecosystem-interactions-lab.tsx"
git commit -m "refactor(ecosystem): migrate interactions slider to Base UI Slider (S5.2)"
```

---

## S6 — Progress + Meter batch

### Task S6.1 — Migrate Progress instances (8 files)

**Files:**
- Modify: 6 files (note: 8 instances but some files have multiple)

- [ ] **Step S6.1.1 — Sync before batch**

```bash
git fetch origin
git rebase origin/main
```

- [ ] **Step S6.1.2 — Migrate `funding-sheet.tsx`**

Read `apps/web-client/src/app/[locale]/(screens)/projects/[slug]/_components/quick-view/funding-sheet.tsx`. Find the progress bar block (around lines 120-125) — typically:

```tsx
<div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
  <div
    className="h-full bg-lime-400"
    style={{ width: `${progress}%` }}
  />
</div>
```

Add the import:
```tsx
import { Progress } from '@make-the-change/core/ui'
```

Replace the block with:
```tsx
<Progress
  value={progress}
  max={100}
  className="h-2 bg-white/10"
  indicatorClassName="bg-lime-400 transition-all duration-300"
/>
```

If the original uses a gradient (e.g., `bg-gradient-to-r from-lime-400 to-emerald-500`), preserve via `indicatorClassName="bg-gradient-to-r from-lime-400 to-emerald-500"`. Read the original to copy gradient stops exactly.

Commit after this file:
```bash
git add "apps/web-client/src/app/[locale]/(screens)/projects/[slug]/_components/quick-view/funding-sheet.tsx"
git commit -m "refactor(funding-sheet): migrate progress bar to Base UI Progress (S6.1.2)"
```

- [ ] **Step S6.1.3 — Migrate `impact-tab-client.tsx`**

Read `apps/web-client/src/app/[locale]/(screens)/impact/_features/impact-tab-client.tsx`. Find the progress block around line 507-510 (collective goal progress).

Add `Progress` to the import from `@make-the-change/core/ui` if not present.

Replace the `<div style={{ width: 'X%' }}>` block with `<Progress value={...} className="..." indicatorClassName="..." />` — preserving the original height, background, gradient.

If a second progress bar exists in the same file, migrate it the same way.

Commit:
```bash
git add "apps/web-client/src/app/[locale]/(screens)/impact/_features/impact-tab-client.tsx"
git commit -m "refactor(impact-tab): migrate progress bars to Base UI Progress (S6.1.3)"
```

- [ ] **Step S6.1.4 — Migrate `reward/page.tsx`**

Read `apps/web-client/src/app/[locale]/(screens)/impact/reward/page.tsx`. Find the collective goal progress around line 100-105.

Add `Progress` import, replace block, commit:
```bash
git add "apps/web-client/src/app/[locale]/(screens)/impact/reward/page.tsx"
git commit -m "refactor(reward): migrate collective goal progress to Base UI Progress (S6.1.4)"
```

- [ ] **Step S6.1.5 — Migrate `academy/page.tsx` chapter progress**

Read the file. Find the chapter progress bar around line 761-763. Migrate with the same pattern. Commit:
```bash
git add "apps/web-client/src/app/[locale]/(screens)/academy/page.tsx"
git commit -m "refactor(academy): migrate chapter progress to Base UI Progress (S6.1.5)"
```

- [ ] **Step S6.1.6 — Migrate `guided-path-experience.tsx`**

Read `apps/web-client/src/app/[locale]/(screens)/learn/parcours/[pathId]/_components/guided-path-experience.tsx`. Find the path completion progress around line 154-156. Migrate. Commit:
```bash
git add "apps/web-client/src/app/[locale]/(screens)/learn/parcours/[pathId]/_components/guided-path-experience.tsx"
git commit -m "refactor(parcours): migrate path progress to Base UI Progress (S6.1.6)"
```

- [ ] **Step S6.1.7 — Migrate `step-3-contract.tsx`**

Read `apps/web-client/src/app/[locale]/(screens)/onboarding/_features/step-3-contract.tsx` line ~76-78. This may be a coupled slider+progress background. If the visualization is purely a background bar (no interaction), migrate to `<Progress>`. If it's the slider track, leave it alone (slider already has its own track).

Commit if changed:
```bash
git add "apps/web-client/src/app/[locale]/(screens)/onboarding/_features/step-3-contract.tsx"
git commit -m "refactor(onboarding): migrate impact level progress to Base UI Progress (S6.1.7)"
```

If skipped (it's part of a slider), no commit needed.

### Task S6.2 — Migrate Meter instances (4 files)

**Files:**
- Modify: 4 files (kinnu-bottom-sheet, kinnu-hud, kinnu-world-card, ecosystem-interactions-lab)

- [ ] **Step S6.2.1 — Migrate Kinnu Bottom Sheet health bar**

Read `apps/web-client/src/app/[locale]/(lab)/kinnu/_components/kinnu-bottom-sheet.tsx`. Find the health bar around line 157.

Add to imports:
```tsx
import { Meter, MeterIndicator, MeterTrack } from '@make-the-change/core/ui'
```

Replace the `<div className="h-X bg-Y"><div style={{ width: 'Z%' }}>...</div></div>` block with:

```tsx
<Meter
  value={health}
  min={0}
  max={100}
  aria-label="Intégrité du bouclier"
  className="relative h-2 w-full overflow-hidden rounded-full bg-white/10"
>
  <MeterTrack className="h-full w-full">
    <MeterIndicator
      className={cn(
        'h-full transition-all duration-300',
        // Preserve the dynamic color from the original (e.g., red < 30%, yellow < 70%, green otherwise)
        health < 30 ? 'bg-red-400' : health < 70 ? 'bg-yellow-400' : 'bg-emerald-400',
      )}
    />
  </MeterTrack>
</Meter>
```

Read the original to find the exact color logic and aria-label. If the original uses an `aria-label` like "Shield Integrity" or "Intégrité", preserve it.

Commit:
```bash
git add "apps/web-client/src/app/[locale]/(lab)/kinnu/_components/kinnu-bottom-sheet.tsx"
git commit -m "refactor(kinnu): migrate health bar to Base UI Meter (S6.2.1)"
```

- [ ] **Step S6.2.2 — Migrate Kinnu HUD energy bar**

Read `apps/web-client/src/app/[locale]/(lab)/kinnu/_components/kinnu-hud.tsx`. Find the energy bar around line 61.

Same pattern as S6.2.1 — `Meter` + `MeterTrack` + `MeterIndicator`, with the energy state variable and color logic.

Commit:
```bash
git add "apps/web-client/src/app/[locale]/(lab)/kinnu/_components/kinnu-hud.tsx"
git commit -m "refactor(kinnu): migrate energy bar to Base UI Meter (S6.2.2)"
```

- [ ] **Step S6.2.3 — Migrate Kinnu World Card mastery bar**

Read `apps/web-client/src/app/[locale]/(lab)/kinnu/_components/kinnu-world-card.tsx`. Find the mastery bar around line 96.

Same pattern. Commit:
```bash
git add "apps/web-client/src/app/[locale]/(lab)/kinnu/_components/kinnu-world-card.tsx"
git commit -m "refactor(kinnu): migrate mastery bar to Base UI Meter (S6.2.3)"
```

- [ ] **Step S6.2.4 — Migrate ecosystem edge strength bar**

Read `apps/web-client/src/app/[locale]/(screens)/ecosysteme/_components/ecosystem-interactions-lab.tsx`. Find the edge strength visualization around line 477.

Same pattern with `Meter`. Commit:
```bash
git add "apps/web-client/src/app/[locale]/(screens)/ecosysteme/_components/ecosystem-interactions-lab.tsx"
git commit -m "refactor(ecosystem): migrate edge strength bar to Base UI Meter (S6.2.4)"
```

---

## Final verification

- [ ] **F.1 — Type-check passes**

```bash
pnpm --filter @make-the-change/web-client type-check
```
Expected: exit 0.

- [ ] **F.2 — Core tests pass**

```bash
pnpm --filter @make-the-change/core test
```
Expected: all tests pass.

- [ ] **F.3 — Zero `<FullScreenSlideModal>` for reset confirmation**

```bash
grep -rn "ResetConfirmModal\|setShowResetConfirm.*FullScreenSlideModal" apps/web-client/src
```
Expected: matches only the state variable declarations (which are still needed for `ConfirmDestructiveDialog`), no `<FullScreenSlideModal>` usage for reset.

- [ ] **F.4 — `ToggleSwitch` and `SettingRow` removed from notifications-client**

```bash
grep -n "function ToggleSwitch\|function SettingRow" apps/web-client/src/app/[locale]/\(screens\)/profile/settings/notifications/notifications-client.tsx
```
Expected: zero matches.

- [ ] **F.5 — Zero raw `<button role="tab">`**

```bash
grep -rn 'role="tab"' apps/web-client/src/app --include="*.tsx"
```
Expected: zero matches (Base UI's `TabsTrigger` sets the role internally on the rendered DOM, but the source code shouldn't have explicit `role="tab"`).

- [ ] **F.6 — Zero raw `<input type="radio">` as a form control**

```bash
grep -rn '<input type="radio"' apps/web-client/src/app --include="*.tsx"
```
Expected: zero matches (or only matches in `register-form.tsx`'s hidden form submission inputs which are unrelated to UI radio behavior — these are not part of S4 scope).

- [ ] **F.7 — Zero `<input type="range">`**

```bash
grep -rn '<input type="range"' apps/web-client/src/app --include="*.tsx"
```
Expected: zero matches.

- [ ] **F.8 — Manual visual verification on 4 screens**

Run dev server (`pnpm --filter @make-the-change/web-client dev`) and verify:

1. **`/fr/academy`** → click "Réinitialiser ma progression" → modal centered floating appears with backdrop, "Annuler" + "Réinitialiser" (rouge) buttons. Escape doesn't close (AlertDialog forces decision). Click Cancel closes. Click "Réinitialiser" triggers reset.

2. **`/fr/profile/settings/notifications`** → 8 toggles are visible. Click each one toggles between lime-400 (on) and white/10 (off). Visual is identical to before (description, label, switch position).

3. **`/fr/projects/[any-slug]`** → project detail tabs are clickable, the active tab has lime background, sticky behavior preserved.

4. **`/fr/lab/kinnu`** → kinnu HUD shows energy/health meters that animate correctly when values change.

---

## Plan complete

Total: 6 sprints (S1-S6), ~16 tâches principales, ~50 sub-steps. Effort estimé ~3h.

Each sprint produces a working commit. Final F.3-F.8 grep checks verify spec criteria are met.
