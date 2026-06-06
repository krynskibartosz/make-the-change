# Base UI Finition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finir la migration Base UI de web-client : cleanup vague 3 (P1), upgrade @base-ui/react 1.1.0 → 1.5.0 (P2), wrapper Drawer + migration sheets (P3), Popover + Tooltip (P4), Avatar + Separator + NumberField (P5). À la fin : couverture Base UI 100% sur tous les patterns hand-rolled identifiés.

**Architecture:** Une seule branche `feat/base-ui-finition` dans worktree dédié. 5 phases séquentielles : cleanup → upgrade → Drawer → Popover/Tooltip → finition. Chaque phase mergeable indépendamment. Vérification systématique : tests core + type-check web-client après chaque sprint, smoke test après P2 et P3.

**Tech Stack:** TypeScript, React 19, Next.js 16, `@base-ui/react` (1.1.0 → 1.5.0), Tailwind CSS 4, `tw-animate-css` (déjà installé), Vitest.

**Spec source:** `docs/superpowers/specs/2026-06-06-base-ui-finition-design.md`

---

## Setup — Worktree isolé

**Files:** none — git operations only

- [ ] **Step 0.1 — Create worktree on main**

```bash
cd "c:\Users\utilisateur\Downloads\make-the-change-main\make-the-change-main\repo-propre5"
git fetch origin
git worktree add -b feat/base-ui-finition .worktrees/base-ui-finition main
cd .worktrees/base-ui-finition
pnpm install
```
Expected: new worktree at `.worktrees/base-ui-finition/`, branch `feat/base-ui-finition`, deps installed.

- [ ] **Step 0.2 — Baseline tests pass before any change**

```bash
pnpm --filter @make-the-change/core test
```
Expected: 33 tests passed.

```bash
cd apps/web-client && ./node_modules/.bin/tsc --noEmit
```
Expected: exit 0.

---

## P1 — Cleanup vague 3

### Task P1.1 — Move `progress.tsx` to `base/`

**Files:**
- Move: `packages/core/src/shared/ui/progress.tsx` → `packages/core/src/shared/ui/base/progress.tsx`
- Modify: `packages/core/src/shared/ui/index.ts`

- [ ] **Step P1.1.1 — Sync**

```bash
cd "c:\Users\utilisateur\Downloads\make-the-change-main\make-the-change-main\repo-propre5\.worktrees\base-ui-finition"
git fetch origin
git rebase origin/main
```

- [ ] **Step P1.1.2 — Move the file**

```bash
git mv packages/core/src/shared/ui/progress.tsx packages/core/src/shared/ui/base/progress.tsx
```

- [ ] **Step P1.1.3 — Fix the `cn` import inside the moved file**

In `packages/core/src/shared/ui/base/progress.tsx`, find:
```ts
import { cn } from '../utils/cn'
```
Replace with:
```ts
import { cn } from '../utils'
```

The other base/ wrappers use `'../utils'` (resolves to `src/shared/ui/utils.ts`). The old path `'../utils/cn'` resolved to `src/shared/utils/cn` — different file but same exported function. Aligning fixes the convention.

- [ ] **Step P1.1.4 — Update barrel export**

In `packages/core/src/shared/ui/index.ts`, find:
```ts
export { Progress, type ProgressProps } from './progress'
```
Replace with:
```ts
export { Progress, type ProgressProps } from './base/progress'
```

- [ ] **Step P1.1.5 — Type-check core**

```bash
pnpm --filter @make-the-change/core type-check
```
Expected: exit 0.

- [ ] **Step P1.1.6 — Tests pass**

```bash
pnpm --filter @make-the-change/core test
```
Expected: 33 tests passed.

- [ ] **Step P1.1.7 — Commit**

```bash
git add packages/core/src/shared/ui/base/progress.tsx packages/core/src/shared/ui/index.ts
git commit -m "chore(core): move progress.tsx into base/ following primitives convention (P1.1)"
```

### Task P1.2 — Fix `NotificationToggleRow` callback signatures

**Files:**
- Modify: `apps/web-client/src/app/[locale]/(screens)/profile/settings/notifications/notifications-client.tsx`

- [ ] **Step P1.2.1 — Apply 7 string replacements**

Read the file. Find all 7 occurrences of the pattern:
```tsx
onCheckedChange={() => handleToggle('<KEY>')}
```
Replace each with:
```tsx
onCheckedChange={(_checked) => handleToggle('<KEY>')}
```

Expected keys: `push`, `email`, `monthly_report`, `project_updates`, `product_updates`, `leaderboard`, `academy`.

The `_checked` underscore is a TypeScript convention indicating the parameter is intentionally unused — the handler reads existing state via closure and negates.

- [ ] **Step P1.2.2 — Type-check**

```bash
cd apps/web-client && ./node_modules/.bin/tsc --noEmit
```
Expected: exit 0.

- [ ] **Step P1.2.3 — Commit**

```bash
cd "c:\Users\utilisateur\Downloads\make-the-change-main\make-the-change-main\repo-propre5\.worktrees\base-ui-finition"
git add "apps/web-client/src/app/[locale]/(screens)/profile/settings/notifications/notifications-client.tsx"
git commit -m "fix(notifications): mark NotificationToggleRow checked param as intentionally unused (P1.2)"
```

### Task P1.3 — Migrate step-3-contract slider

**Files:**
- Modify: `apps/web-client/src/app/[locale]/(screens)/onboarding/_features/step-3-contract.tsx`

- [ ] **Step P1.3.1 — Read the file**

Read `apps/web-client/src/app/[locale]/(screens)/onboarding/_features/step-3-contract.tsx`. Find the slider section around line 76. It uses `style={{ width: '${percentage}%' }}` for the fill plus an absolutely-positioned thumb plus invisible click zones.

Identify:
- The percentage value source (variable name, e.g., `subscriptionLevel` or `level` or `value`)
- The change handler (e.g., `setSubscriptionLevel`)
- The min/max/step (likely 0/100/something)
- The thumb visual class set
- Any invisible click zones (3 buttons that snap to specific values)

- [ ] **Step P1.3.2 — Add Slider primitives import**

At the top of the file, add to the existing `@make-the-change/core/ui` import:

```tsx
import {
  SliderControl,
  SliderIndicator,
  SliderRoot,
  SliderThumb,
  SliderTrack,
} from '@make-the-change/core/ui'
```

(Keep other existing imports.)

- [ ] **Step P1.3.3 — Replace the track + fill markup**

The original pattern is roughly:
```tsx
<div className="..." onClick={...}>
  <div style={{ width: `${percentage}%` }} className="..." />
  <div className="thumb-visual" style={{ left: `${percentage}%` }} />
  {/* invisible click zones */}
</div>
```

Replace the OUTER track wrapper and inner fill with `SliderRoot` composition. Keep the invisible click zones AS-IS (they snap to specific levels — a UX feature, not part of Slider). Keep any thumb visual that's positioned via CSS.

Pattern to apply (adapt to actual variable names from step P1.3.1):
```tsx
<SliderRoot
  value={subscriptionLevel}
  onValueChange={(value) => {
    const next = typeof value === 'number' ? value : Array.isArray(value) ? Number(value[0]) : 0
    setSubscriptionLevel(next)
  }}
  min={0}
  max={100}
  step={1}
  className="relative flex w-full touch-none select-none items-center"
>
  <SliderControl className="relative h-2 w-full grow rounded-full bg-white/10">
    <SliderTrack className="relative h-full w-full rounded-full">
      <SliderIndicator className="absolute h-full rounded-full bg-emerald-500" />
    </SliderTrack>
    <SliderThumb className="block h-5 w-5 rounded-full border border-emerald-500/40 bg-white shadow transition-colors focus-visible:outline-none data-[focus-visible]:ring-2 data-[focus-visible]:ring-emerald-500/60" />
  </SliderControl>
</SliderRoot>
```

If the existing visual is complex (custom thumb, custom fill gradient, glow effects) — PRESERVE these by adapting `SliderIndicator className` and `SliderThumb className` accordingly. Re-use the exact gradient / glow classes from the original.

**If the slider is too custom to map cleanly** (e.g., uses absolutely-positioned thumb that doesn't fit Base UI's Thumb mechanics), document a clear `// TODO: migrate post-finition` above the section and skip the migration. The other P1 tasks are still committed independently.

- [ ] **Step P1.3.4 — Type-check**

```bash
cd apps/web-client && ./node_modules/.bin/tsc --noEmit
```
Expected: exit 0.

- [ ] **Step P1.3.5 — Commit**

```bash
cd "c:\Users\utilisateur\Downloads\make-the-change-main\make-the-change-main\repo-propre5\.worktrees\base-ui-finition"
git add "apps/web-client/src/app/[locale]/(screens)/onboarding/_features/step-3-contract.tsx"
git commit -m "refactor(onboarding): migrate step-3 subscription slider to Base UI Slider (P1.3)"
```

If skipped per P1.3.3 fallback, commit the TODO comment only:
```bash
git commit -m "docs(onboarding): note step-3 slider deferred from finition (P1.3 skipped)"
```

---

## P2 — Upgrade `@base-ui/react` 1.1.0 → 1.5.0

### Task P2.1 — Upgrade dependency

**Files:**
- Modify: `packages/core/package.json`
- Modify: `pnpm-lock.yaml`

- [ ] **Step P2.1.1 — Sync**

```bash
cd "c:\Users\utilisateur\Downloads\make-the-change-main\make-the-change-main\repo-propre5\.worktrees\base-ui-finition"
git fetch origin
git rebase origin/main
```

- [ ] **Step P2.1.2 — Upgrade the package**

```bash
pnpm --filter @make-the-change/core up "@base-ui/react@^1.5.0"
```

Expected: `packages/core/package.json` `@base-ui/react` updated to `^1.5.0`, `pnpm-lock.yaml` updated.

Verify:
```bash
grep '"@base-ui/react"' packages/core/package.json
```
Should output `"@base-ui/react": "^1.5.0",` or similar.

- [ ] **Step P2.1.3 — Type-check core**

```bash
pnpm --filter @make-the-change/core type-check
```
Expected: exit 0.

**If type errors appear** related to renamed/removed APIs: read each error. Per release notes 1.1→1.5, no breaking changes affect our wrappers. If an error occurs anyway, the likely cause is a tightened type signature — adjust the affected wrapper accordingly (e.g., narrow a callback type, add a missing prop). Commit fix together with upgrade.

- [ ] **Step P2.1.4 — Run core tests**

```bash
pnpm --filter @make-the-change/core test
```
Expected: 33 tests passed.

**If `theme-builder.snapshot.test.tsx` fails** due to class-order drift introduced by 1.5 perf optimizations:
```bash
pnpm --filter @make-the-change/core test -- -u
```
Then re-run without `-u`:
```bash
pnpm --filter @make-the-change/core test
```
Confirm pass. The snapshot file change must be included in the commit.

- [ ] **Step P2.1.5 — Type-check web-client**

```bash
cd apps/web-client && ./node_modules/.bin/tsc --noEmit
```
Expected: exit 0.

- [ ] **Step P2.1.6 — Commit**

```bash
cd "c:\Users\utilisateur\Downloads\make-the-change-main\make-the-change-main\repo-propre5\.worktrees\base-ui-finition"
git add packages/core/package.json pnpm-lock.yaml
# Include snapshot if updated:
git add packages/core/src/shared/ui/__tests__/__snapshots__/theme-builder.snapshot.test.tsx.snap 2>/dev/null || true
git commit -m "chore(core): upgrade @base-ui/react 1.1.0 → 1.5.0 (P2)

Per release notes (1.2, 1.3, 1.4, 1.5), no breaking changes affect our code:
- 1.3 'Drawer out of preview' — we don't yet use Drawer (added in P3)
- 1.5 'OTP Field sanitizeValue → normalizeValue' — we don't use OTP

Benefits: +50-85% perf on popup mount/unmount (1.5), iOS VoiceOver fixes,
focus trap improvements, Combobox/Drawer bug fixes, new APIs (Tooltip.closeOnClick,
SwipeArea for Drawer, Label parts on Select/Slider/Combobox)."
```

---

## P3 — Drawer wrapper + sheet migrations

### Task P3.1 — Create Drawer wrapper in core

**Files:**
- Create: `packages/core/src/shared/ui/base/drawer.tsx`
- Modify: `packages/core/src/shared/ui/index.ts`

- [ ] **Step P3.1.1 — Sync**

```bash
cd "c:\Users\utilisateur\Downloads\make-the-change-main\make-the-change-main\repo-propre5\.worktrees\base-ui-finition"
git fetch origin
git rebase origin/main
```

- [ ] **Step P3.1.2 — Verify Drawer is available in 1.5**

```bash
ls node_modules/@base-ui/react/drawer 2>/dev/null && echo "OK" || echo "MISSING"
```
Expected: `OK`. If `MISSING`, P2 didn't succeed — abort and debug.

- [ ] **Step P3.1.3 — Create drawer.tsx**

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
const DrawerSwipeArea = DrawerPrimitive.SwipeArea
const DrawerViewport = DrawerPrimitive.Viewport

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
  DrawerSwipeArea,
  DrawerViewport,
}
```

If a sub-component does NOT exist on `DrawerPrimitive` (e.g., `Viewport` was added later), inspect the actual exports:
```bash
cat node_modules/@base-ui/react/drawer/index.d.ts
```
Adjust the wrapper to only include sub-components that exist. Document in commit message.

- [ ] **Step P3.1.4 — Update barrel export**

In `packages/core/src/shared/ui/index.ts`, find the alphabetical position between `Dialog...` exports and `Field...` exports. Insert:

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
  DrawerSwipeArea,
  DrawerViewport,
} from './base/drawer'
```

- [ ] **Step P3.1.5 — Type-check**

```bash
pnpm --filter @make-the-change/core type-check
```
Expected: exit 0.

- [ ] **Step P3.1.6 — Tests still pass**

```bash
pnpm --filter @make-the-change/core test
```
Expected: 33 tests passed.

- [ ] **Step P3.1.7 — Commit**

```bash
git add packages/core/src/shared/ui/base/drawer.tsx packages/core/src/shared/ui/index.ts
git commit -m "feat(core): add Drawer wrapper (post-upgrade 1.5, with SwipeArea support) (P3.1)"
```

### Task P3.2 — Migrate MobileSheet to Drawer

**Files:**
- Modify: `apps/web-client/src/app/[locale]/(screens)/projects/[slug]/_components/shared/mobile-sheet.tsx`

- [ ] **Step P3.2.1 — Read current MobileSheet**

Read the file. Note current public API (must be preserved):
- `isOpen: boolean`
- `onClose: () => void`
- `title?: string`
- `children: ReactNode`

Note current internals (uses Dialog from vague 2 fallback).

- [ ] **Step P3.2.2 — Replace file content**

Replace `apps/web-client/src/app/[locale]/(screens)/projects/[slug]/_components/shared/mobile-sheet.tsx` content with:

```tsx
'use client'

import {
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerHandle,
  DrawerPopup,
  DrawerPortal,
  DrawerSwipeArea,
  DrawerTitle,
} from '@make-the-change/core/ui'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type MobileSheetProps = {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export function MobileSheet({ isOpen, onClose, title, children }: MobileSheetProps) {
  return (
    <Drawer open={isOpen} onOpenChange={(v) => !v && onClose()}>
      <DrawerPortal>
        <DrawerBackdrop className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-sm transition-opacity duration-200 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <DrawerPopup
          className={cn(
            'fixed inset-x-0 bottom-0 z-[120] mx-auto max-w-xl overflow-hidden rounded-t-3xl border border-white/10',
            'bg-background/80 shadow-[0_-20px_80px_rgba(0,0,0,0.6)] backdrop-blur-lg outline-none',
            'transition-transform duration-300 ease-out',
            'data-[ending-style]:translate-y-full data-[starting-style]:translate-y-full',
          )}
        >
          <DrawerSwipeArea className="flex items-center justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing">
            <DrawerHandle className="h-1 w-12 rounded-full bg-white/20" />
          </DrawerSwipeArea>

          <div className="flex items-center justify-between px-5 pb-2">
            {title ? (
              <DrawerTitle className="text-base font-black text-white">{title}</DrawerTitle>
            ) : (
              <span />
            )}
            <DrawerClose
              render={(props) => (
                <button
                  {...props}
                  type="button"
                  aria-label="Fermer"
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.06] text-white/35 transition-colors hover:bg-white/10 hover:text-white/60"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            />
          </div>

          <div className="max-h-[78dvh] overflow-y-auto overscroll-contain px-5 pb-[max(2rem,env(safe-area-inset-bottom))]">
            {children}
          </div>
        </DrawerPopup>
      </DrawerPortal>
    </Drawer>
  )
}
```

**Key changes vs Dialog version**:
- `Dialog` → `Drawer`
- `DialogBackdrop`, `DialogPopup`, `DialogClose`, `DialogTitle` → `Drawer*` equivalents
- Added `DrawerSwipeArea` wrapping the `DrawerHandle` — enables swipe-down-to-dismiss
- Public API unchanged

- [ ] **Step P3.2.3 — Type-check**

```bash
cd apps/web-client && ./node_modules/.bin/tsc --noEmit
```
Expected: exit 0.

If error on `DrawerClose render={(props) => ...}`: check the Drawer typings in `node_modules/@base-ui/react/drawer/`. If `render` is not supported, replace with `<DrawerClose><button>...</button></DrawerClose>` pattern.

- [ ] **Step P3.2.4 — Commit**

```bash
cd "c:\Users\utilisateur\Downloads\make-the-change-main\make-the-change-main\repo-propre5\.worktrees\base-ui-finition"
git add "apps/web-client/src/app/[locale]/(screens)/projects/[slug]/_components/shared/mobile-sheet.tsx"
git commit -m "refactor(projects): migrate MobileSheet to Drawer with swipe-to-dismiss (P3.2)"
```

### Task P3.3 — Migrate KinnuBottomSheet outer shell to Drawer

**Files:**
- Modify: `apps/web-client/src/app/[locale]/(lab)/kinnu/_components/kinnu-bottom-sheet.tsx`

- [ ] **Step P3.3.1 — Read current file**

Read `apps/web-client/src/app/[locale]/(lab)/kinnu/_components/kinnu-bottom-sheet.tsx`. Note:
- The OUTER shell uses Dialog (post-vague-2)
- The inner content (cards, status, etc.) is unique to Kinnu
- Existing imports

- [ ] **Step P3.3.2 — Update imports**

Find the imports from `@make-the-change/core/ui`. Replace `Dialog`, `DialogBackdrop`, `DialogPopup`, `DialogPortal`, `DialogTitle` (if present) with their Drawer equivalents:

```tsx
import {
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerHandle,
  DrawerPopup,
  DrawerPortal,
  DrawerSwipeArea,
  DrawerTitle,
} from '@make-the-change/core/ui'
```

- [ ] **Step P3.3.3 — Replace outer shell components**

In the JSX, perform these renames (search-and-replace where unambiguous):
- `<Dialog ` → `<Drawer `
- `</Dialog>` → `</Drawer>`
- `<DialogPortal ` → `<DrawerPortal `
- `</DialogPortal>` → `</DrawerPortal>`
- `<DialogBackdrop ` → `<DrawerBackdrop `
- `<DialogPopup ` → `<DrawerPopup `
- `</DialogPopup>` → `</DrawerPopup>`
- `<DialogTitle` → `<DrawerTitle`
- `</DialogTitle>` → `</DrawerTitle>`

Then, INSIDE the DrawerPopup at the top, add a `DrawerSwipeArea` wrapping a handle bar (mirror P3.2):

```tsx
<DrawerSwipeArea className="flex items-center justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing">
  <DrawerHandle className="h-1 w-12 rounded-full bg-white/20" />
</DrawerSwipeArea>
```

Inner content (cards, status meters etc.) stays exactly as-is.

- [ ] **Step P3.3.4 — Type-check**

```bash
cd apps/web-client && ./node_modules/.bin/tsc --noEmit
```
Expected: exit 0.

- [ ] **Step P3.3.5 — Commit**

```bash
cd "c:\Users\utilisateur\Downloads\make-the-change-main\make-the-change-main\repo-propre5\.worktrees\base-ui-finition"
git add "apps/web-client/src/app/[locale]/(lab)/kinnu/_components/kinnu-bottom-sheet.tsx"
git commit -m "refactor(kinnu): migrate KinnuBottomSheet outer shell to Drawer with swipe-to-dismiss (P3.3)"
```

### Task P3.4 — Documentation update

**Files:**
- Modify (or create): `docs/02-product/design-system/forms.md`

- [ ] **Step P3.4.1 — Read existing forms.md**

Read `docs/02-product/design-system/forms.md`. Locate the section about overlays / sheets (if any). It likely mentions a vague 2 limitation about Drawer not being available.

- [ ] **Step P3.4.2 — Update the doc**

Replace the limitation note about Drawer not being available with a section documenting Drawer's availability + the swipe-to-dismiss pattern:

```markdown
## Bottom sheet — `<MobileSheet>`

Wrapper around Base UI `Drawer`. Slides up from the bottom with native swipe-to-dismiss via `<Drawer.SwipeArea>`.

```tsx
<MobileSheet isOpen={open} onClose={() => setOpen(false)} title="My addresses">
  {/* content */}
</MobileSheet>
```

The drag handle at top is wrapped in `Drawer.SwipeArea` — users can drag it down to dismiss. Drawer is available since `@base-ui/react@1.3.0` (stable) and our project uses 1.5+.
```

(Update existing section if present, otherwise add at end of doc.)

- [ ] **Step P3.4.3 — Commit**

```bash
git add docs/02-product/design-system/forms.md
git commit -m "docs(design-system): document Drawer availability + swipe-to-dismiss pattern (P3.4)"
```

---

## P4 — Popover + Tooltip

### Task P4.1 — Migrate 4 Popover/Collapsible patterns

**Files:**
- Modify: `apps/web-client/src/app/[locale]/(screens)/projects/[slug]/_components/shared/impact-disclaimer.tsx`
- Modify: `apps/web-client/src/app/[locale]/(screens)/academy/project-experiences/ruchers-antsirabe/_components/honey-effort-panel.tsx`
- Modify: `apps/web-client/src/app/[locale]/(screens)/academy/project-experiences/ruchers-antsirabe/_components/territory-map.tsx`
- Modify: `apps/web-client/src/app/[locale]/(lab)/appearance/_features/theme/theme-selection.tsx`

- [ ] **Step P4.1.1 — Sync**

```bash
cd "c:\Users\utilisateur\Downloads\make-the-change-main\make-the-change-main\repo-propre5\.worktrees\base-ui-finition"
git fetch origin
git rebase origin/main
```

- [ ] **Step P4.1.2 — Migrate `impact-disclaimer.tsx`**

Read the file. It uses `useState(false)` + AnimatePresence to toggle an info panel triggered by an Info icon.

Choose **Popover** (popup anchored to the Info icon trigger):

```tsx
'use client'

import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverPositioner,
  PopoverTrigger,
} from '@make-the-change/core/ui'
import { Info } from 'lucide-react'

export function ImpactDisclaimer() {
  return (
    <Popover>
      <PopoverTrigger
        render={(props) => (
          <button
            {...props}
            type="button"
            aria-label="Avertissement impact"
            className="inline-flex h-6 w-6 items-center justify-center rounded-full text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white/70"
          >
            <Info className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        )}
      />
      <PopoverPortal>
        <PopoverPositioner sideOffset={8}>
          <PopoverContent className="z-[200] max-w-xs rounded-lg border border-white/10 bg-[#0B0F15] p-3 text-xs text-white/80 shadow-lg">
            {/* PASTE THE ORIGINAL DISCLAIMER TEXT HERE — copy from the original file */}
          </PopoverContent>
        </PopoverPositioner>
      </PopoverPortal>
    </Popover>
  )
}
```

Remove `useState`, `motion`, `AnimatePresence` imports. Preserve the disclaimer text verbatim.

**Adapt** the export names to what core/ui actually exports. Inspect `packages/core/src/shared/ui/base/popover.tsx` if uncertain. Common Base UI Popover sub-components: `Popover.Root`, `Popover.Trigger`, `Popover.Portal`, `Popover.Positioner`, `Popover.Popup` (or `Content`).

- [ ] **Step P4.1.3 — Migrate `honey-effort-panel.tsx` and `territory-map.tsx` (disclose-in-place pattern)**

Both files use `useState` to toggle a "Sources" section that EXPANDS INLINE below a "Masquer/Sources" button — this is NOT a popup, it's an in-place disclosure. Use `Collapsible` (more semantic than Popover):

Read each file. Find the section with `useState` toggling sources visibility.

Replace with:

```tsx
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@make-the-change/core/ui'

<Collapsible>
  <CollapsibleTrigger className="...EXISTING_BUTTON_CLASSES...">
    {/* original button text/icon */}
  </CollapsibleTrigger>
  <CollapsibleContent className="overflow-hidden transition-[height] duration-300 data-[starting-style]:h-0 data-[ending-style]:h-0">
    {/* original sources content */}
  </CollapsibleContent>
</Collapsible>
```

Remove `useState`, `motion`, `AnimatePresence` imports. Preserve the sources content and the trigger button styling.

If the file uses identical patterns (HoneyEffort and TerritoryMap are likely duplicates), apply the same change to both. If they're identical enough, consider extracting into a shared `<SourcesDisclosure>` component in `apps/web-client/src/components/ui/`. Decide based on the actual content overlap — only extract if 80%+ identical.

- [ ] **Step P4.1.4 — Migrate `theme-selection.tsx` naming input**

Read the file. Find the section around line 281-304 where `showNaming` state reveals a naming input via slide-in animation.

The trigger is a button ("Save as preset" or similar) that opens an inline naming input. Choose **Popover** anchored to the trigger button:

```tsx
<Popover>
  <PopoverTrigger render={(props) => (
    <button {...props} type="button" className="...EXISTING_BUTTON_CLASSES...">
      {/* original button content */}
    </button>
  )} />
  <PopoverPortal>
    <PopoverPositioner sideOffset={8}>
      <PopoverContent className="z-[200] ...EXISTING_PANEL_CLASSES...">
        {/* the naming input + save button — original content */}
      </PopoverContent>
    </PopoverPositioner>
  </PopoverPortal>
</Popover>
```

Remove `setShowNaming` state and its associated logic. The Popover's `open` state is managed internally; if the parent needs to control it, use the `open` + `onOpenChange` props.

- [ ] **Step P4.1.5 — Type-check**

```bash
cd apps/web-client && ./node_modules/.bin/tsc --noEmit
```
Expected: exit 0.

- [ ] **Step P4.1.6 — Commit**

```bash
cd "c:\Users\utilisateur\Downloads\make-the-change-main\make-the-change-main\repo-propre5\.worktrees\base-ui-finition"
git add "apps/web-client/src/app/[locale]/(screens)/projects/[slug]/_components/shared/impact-disclaimer.tsx" \
  "apps/web-client/src/app/[locale]/(screens)/academy/project-experiences/ruchers-antsirabe/_components/honey-effort-panel.tsx" \
  "apps/web-client/src/app/[locale]/(screens)/academy/project-experiences/ruchers-antsirabe/_components/territory-map.tsx" \
  "apps/web-client/src/app/[locale]/(lab)/appearance/_features/theme/theme-selection.tsx"
git commit -m "refactor(web-client): migrate 4 hand-rolled disclosure patterns to Base UI Popover/Collapsible (P4.1)"
```

### Task P4.2 — Create InfoTooltip + migrate Info button sites

**Files:**
- Create: `apps/web-client/src/components/ui/info-tooltip.tsx`
- Modify: multiple files (Info button sites — list discovered at sprint start)

- [ ] **Step P4.2.1 — Create InfoTooltip component**

Create `apps/web-client/src/components/ui/info-tooltip.tsx`:

```tsx
'use client'

import { Info } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from '@make-the-change/core/ui'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type InfoTooltipProps = {
  content: ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
  ariaLabel?: string
  className?: string
}

export function InfoTooltip({
  content,
  side = 'top',
  ariaLabel = 'Information',
  className,
}: InfoTooltipProps) {
  return (
    <Tooltip closeOnClick>
      <TooltipTrigger
        render={(props) => (
          <button
            {...props}
            type="button"
            aria-label={ariaLabel}
            className={cn(
              'inline-flex h-6 w-6 items-center justify-center rounded-full text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white/70',
              className,
            )}
          >
            <Info className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        )}
      />
      <TooltipPortal>
        <TooltipContent
          side={side}
          className="z-[200] max-w-xs rounded-lg border border-white/10 bg-[#0B0F15] px-3 py-2 text-xs text-white/80 shadow-lg"
        >
          {content}
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  )
}
```

**Adapt** the export names to what core/ui actually exports. Inspect `packages/core/src/shared/ui/base/tooltip.tsx`. The structure is typically `Tooltip` (Root) + `TooltipTrigger` + `TooltipPortal` + `TooltipPositioner` + `TooltipPopup` (or `Content`). If `Content` doesn't exist as a name, use `Popup` instead.

Verify `closeOnClick` is available on the `Tooltip` Root in 1.5 (added in 1.3 per release notes).

- [ ] **Step P4.2.2 — Find Info button sites**

Run:
```bash
grep -rn 'aria-label.*[Ii]nformation' apps/web-client/src --include="*.tsx" | grep -v info-tooltip.tsx | head -30
grep -rn '<Info ' apps/web-client/src --include="*.tsx" | grep -v info-tooltip.tsx | head -30
```

Cross-reference both lists to identify buttons that render an `<Info />` icon + have an `aria-label` but no actual tooltip currently. Build a list. Expected count: ~10-15 sites.

For each site, note the contextual help message that SHOULD be in the tooltip. If unclear from context (no description text nearby), write a brief explanatory text inferred from the surrounding UI (e.g., "Série locale" → "Cette série compte uniquement sur cet appareil").

- [ ] **Step P4.2.3 — Migrate Info button sites**

For each site found in P4.2.2, replace:

```tsx
<button aria-label="X" className="...">
  <Info className="..." />
</button>
```

with:

```tsx
<InfoTooltip content="<EXPLANATORY_TEXT>" ariaLabel="X" />
```

Add this import where used:
```tsx
import { InfoTooltip } from '@/components/ui/info-tooltip'
```

If a site has additional UX (e.g., the button has an `onClick` that does something OTHER than just open the tooltip), do NOT migrate it — leave as-is and document. Most Info buttons are purely informational and migrate cleanly.

- [ ] **Step P4.2.4 — Type-check**

```bash
cd apps/web-client && ./node_modules/.bin/tsc --noEmit
```
Expected: exit 0.

- [ ] **Step P4.2.5 — Commit**

```bash
cd "c:\Users\utilisateur\Downloads\make-the-change-main\make-the-change-main\repo-propre5\.worktrees\base-ui-finition"
git add apps/web-client/src/components/ui/info-tooltip.tsx \
  apps/web-client/src/app  # broad add for migrated files
git commit -m "feat(web-client): add InfoTooltip shared component + migrate Info button sites (P4.2)"
```

Mention in the commit message body the actual count of migrated sites.

---

## P5 — Avatar + Separator + NumberField

### Task P5.1 — Avatar batch migration

**Files:**
- Modify: multiple (audit will discover)

- [ ] **Step P5.1.1 — Sync**

```bash
cd "c:\Users\utilisateur\Downloads\make-the-change-main\make-the-change-main\repo-propre5\.worktrees\base-ui-finition"
git fetch origin
git rebase origin/main
```

- [ ] **Step P5.1.2 — Audit Avatar candidates**

Run searches to find avatar-shaped UI patterns:

```bash
# Round divs with initials
grep -rn 'rounded-full' apps/web-client/src --include="*.tsx" | grep -i 'initial\|user\|profile\|avatar' | head -20

# Profile-related files
grep -rln 'profile' apps/web-client/src/app --include="*.tsx" | head -10
```

Check primary candidate files:
- `apps/web-client/src/app/[locale]/(screens)/profile/[id]/page.tsx` (profile header)
- `apps/web-client/src/components/ui/image-uploader.tsx` (or wherever an image uploader lives — find via grep)
- Impact feed avatars (likely in `apps/web-client/src/app/[locale]/(screens)/impact/...`)
- Profile dropdown header

Build a list of `<div className="rounded-full ...">` or `<img>` patterns that represent USER avatars (with initials fallback or just an image). Skip non-avatar round divs (icons, badges, decorative).

- [ ] **Step P5.1.3 — Migrate each Avatar site**

For each Avatar candidate:

```tsx
// BEFORE (typical)
<div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
  {user.avatarUrl ? (
    <img src={user.avatarUrl} alt={user.name} className="h-full w-full rounded-full object-cover" />
  ) : (
    <span className="text-sm font-bold text-emerald-400">{initials}</span>
  )}
</div>

// AFTER
import { Avatar, AvatarFallback, AvatarImage } from '@make-the-change/core/ui'

<Avatar className="h-10 w-10">
  <AvatarImage src={user.avatarUrl} alt={user.name} />
  <AvatarFallback className="bg-emerald-500/20 text-sm font-bold text-emerald-400">
    {initials}
  </AvatarFallback>
</Avatar>
```

Adapt size and color classes to match the original visual exactly. The `AvatarImage` automatically falls back to `AvatarFallback` if the image fails to load — no manual conditional needed.

- [ ] **Step P5.1.4 — Type-check**

```bash
cd apps/web-client && ./node_modules/.bin/tsc --noEmit
```
Expected: exit 0.

- [ ] **Step P5.1.5 — Commit**

```bash
cd "c:\Users\utilisateur\Downloads\make-the-change-main\make-the-change-main\repo-propre5\.worktrees\base-ui-finition"
git add apps/web-client/src
git commit -m "refactor(web-client): migrate hand-rolled avatars to Base UI Avatar (P5.1)"
```

Report the count of migrated sites in the commit body.

### Task P5.2 — Migrate QuantityStepper to NumberField

**Files:**
- Modify: `apps/web-client/src/app/[locale]/(screens)/products/[id]/_components/quantity-stepper.tsx`

- [ ] **Step P5.2.1 — Read the file**

Read `apps/web-client/src/app/[locale]/(screens)/products/[id]/_components/quantity-stepper.tsx`. Note:
- Public props (likely `value`, `onValueChange`, `min`, `max`, `onDelete`)
- The "delete on decrement at 1" logic
- The visual layout (Button - Display - Button)
- Existing styling classes

- [ ] **Step P5.2.2 — Verify NumberField sub-components in core**

Check exports from `packages/core/src/shared/ui/base/number-field.tsx`. Expected exports include: `NumberField`, `NumberFieldGroup`, `NumberFieldDecrement`, `NumberFieldInput`, `NumberFieldIncrement`, `NumberFieldScrubArea`, `NumberFieldScrubAreaCursor`.

- [ ] **Step P5.2.3 — Rewrite quantity-stepper**

Replace the JSX with NumberField composition while preserving the delete-on-decrement logic. The pattern depends on whether the original `quantity-stepper` has an `onDelete` prop or wires deletion inline.

If `onDelete` is a separate prop:

```tsx
'use client'

import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@make-the-change/core/ui'
import { Minus, Plus, Trash2 } from 'lucide-react'

type QuantityStepperProps = {
  value: number
  onValueChange: (value: number) => void
  min?: number
  max?: number
  onDelete?: () => void
}

export function QuantityStepper({
  value,
  onValueChange,
  min = 1,
  max = 99,
  onDelete,
}: QuantityStepperProps) {
  const showDelete = value === 1 && onDelete

  return (
    <NumberField
      value={value}
      onValueChange={(next) => {
        if (typeof next === 'number') onValueChange(next)
      }}
      min={min}
      max={max}
    >
      <NumberFieldGroup className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] p-1">
        {showDelete ? (
          <button
            type="button"
            onClick={onDelete}
            aria-label="Supprimer"
            className="flex h-8 w-8 items-center justify-center rounded-full text-red-400 hover:bg-red-500/10"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        ) : (
          <NumberFieldDecrement
            render={(props) => (
              <button {...props} aria-label="Diminuer" className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 hover:bg-white/10">
                <Minus className="h-4 w-4" />
              </button>
            )}
          />
        )}
        <NumberFieldInput
          readOnly
          className="w-6 bg-transparent text-center text-sm font-bold text-white outline-none"
        />
        <NumberFieldIncrement
          render={(props) => (
            <button {...props} aria-label="Augmenter" className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 hover:bg-white/10">
              <Plus className="h-4 w-4" />
            </button>
          )}
        />
      </NumberFieldGroup>
    </NumberField>
  )
}
```

Preserve the EXACT public API of the original component (prop names, defaults). If `value` was `quantity`, keep `quantity`. Match the actual props.

- [ ] **Step P5.2.4 — Type-check**

```bash
cd apps/web-client && ./node_modules/.bin/tsc --noEmit
```
Expected: exit 0.

If `NumberFieldDecrement` doesn't support `render` prop, fall back to:
```tsx
<NumberFieldDecrement className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 hover:bg-white/10">
  <Minus className="h-4 w-4" />
</NumberFieldDecrement>
```

- [ ] **Step P5.2.5 — Commit**

```bash
cd "c:\Users\utilisateur\Downloads\make-the-change-main\make-the-change-main\repo-propre5\.worktrees\base-ui-finition"
git add "apps/web-client/src/app/[locale]/(screens)/products/[id]/_components/quantity-stepper.tsx"
git commit -m "refactor(products): migrate QuantityStepper to Base UI NumberField (P5.2)"
```

### Task P5.3 — Separator semantic batch migration

**Files:**
- Modify: multiple (audit will discover)

- [ ] **Step P5.3.1 — Audit Separator candidates**

Run:
```bash
grep -rn 'border-t\|border-b' apps/web-client/src/app --include="*.tsx" | head -50
grep -rn '<hr' apps/web-client/src/app --include="*.tsx"
```

For each match, READ THE CONTEXT (the parent JSX) and CATEGORIZE:
- **SEMANTIC separator** : a horizontal divider between distinct sections (e.g., between two list groups, between a card and a footer, between two settings groups) → migrate
- **CONTAINER border** : a border AROUND a card, popup, or container, partial border for visual styling → leave

Build a list of MIGRATABLE files with line numbers.

Estimation: ~35 semantic separators on ~110 total matches.

- [ ] **Step P5.3.2 — Add Separator imports and migrate**

For each migration site:

```tsx
// BEFORE
<div className="border-t border-white/10 my-4" />
// or
<hr className="my-4 border-white/10" />

// AFTER
import { Separator } from '@make-the-change/core/ui'

<Separator className="my-4 bg-white/10" />
```

`Separator` adds `role="separator"` and the proper ARIA semantics. The default Base UI Separator is a `<div>` with `height: 1px` (or `width: 1px` for vertical). Override the color via `bg-` classes.

If the original used `border-b` with content above and a margin below, structure equivalent:
```tsx
<div className="...content above...">...</div>
<Separator className="my-4 bg-white/10" />
<div className="...content below...">...</div>
```

If the original `border-t` was a partial style on a card (like only the top border of a footer section), DO NOT migrate — that's a container border, not a separator.

- [ ] **Step P5.3.3 — Type-check**

```bash
cd apps/web-client && ./node_modules/.bin/tsc --noEmit
```
Expected: exit 0.

- [ ] **Step P5.3.4 — Commit**

```bash
cd "c:\Users\utilisateur\Downloads\make-the-change-main\make-the-change-main\repo-propre5\.worktrees\base-ui-finition"
git add apps/web-client/src
git commit -m "refactor(web-client): migrate semantic border-t/border-b/hr to Base UI Separator (P5.3)"
```

Include the count in the commit body.

---

## Final verification

- [ ] **F.1 — Tests core**

```bash
cd "c:\Users\utilisateur\Downloads\make-the-change-main\make-the-change-main\repo-propre5\.worktrees\base-ui-finition"
pnpm --filter @make-the-change/core test
```
Expected: 33+ tests passed.

- [ ] **F.2 — Type-check web-client**

```bash
cd apps/web-client && ./node_modules/.bin/tsc --noEmit
```
Expected: exit 0.

- [ ] **F.3 — Verify progress.tsx moved**

```bash
test -f packages/core/src/shared/ui/base/progress.tsx && echo "OK"
test ! -f packages/core/src/shared/ui/progress.tsx && echo "OK"
```
Expected: both lines print `OK`.

- [ ] **F.4 — Verify Drawer wrapper exists**

```bash
test -f packages/core/src/shared/ui/base/drawer.tsx && echo "OK"
```
Expected: `OK`.

- [ ] **F.5 — Verify no direct @base-ui/react imports in web-client**

```bash
grep -rn "from '@base-ui/react" apps/web-client/src
```
Expected: zero results.

- [ ] **F.6 — Verify InfoTooltip component exists**

```bash
test -f apps/web-client/src/components/ui/info-tooltip.tsx && echo "OK"
```
Expected: `OK`.

- [ ] **F.7 — Verify @base-ui/react upgraded**

```bash
grep '"@base-ui/react"' packages/core/package.json
```
Expected: `"@base-ui/react": "^1.5.0"` or higher.

- [ ] **F.8 — Smoke test (manual, after Vercel deploy)**

Open the deployed site and test these 5 screens:
1. `/fr/login` — Field + Form + Input work
2. `/fr/products/checkout/infos` — Select country dropdown opens correctly, AddressAutocomplete works
3. `/fr/projects/[slug]` — Project detail modal opens, tabs work, MobileSheet opens with swipe-to-dismiss working (try Chrome DevTools mobile view)
4. `/fr/profile/settings/addresses` — Country select inside modal works
5. `/fr/lab/kinnu` — KinnuBottomSheet opens with swipe-to-dismiss working

If smoke test fails on any screen, file an issue and fix before merge.

---

## Plan complete

Total: 5 phases (P1–P5), 14 main tasks, ~70 sub-steps.

After verification, hand off to `superpowers:finishing-a-development-branch` to merge `feat/base-ui-finition` into `main`.
