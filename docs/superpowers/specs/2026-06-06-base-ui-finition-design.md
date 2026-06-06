# Base UI finition — cleanup + upgrade 1.5 + Drawer + Popover/Tooltip + Avatar/Separator/NumberField

**Date:** 2026-06-06
**Scope:** `apps/web-client` + `packages/core`
**Effort estimé:** 5 phases incrémentales, ~10h total

---

## 1. Contexte

Les vagues 1, 2, et 3 core ont migré les composants critiques de `web-client` vers Base UI. Ce spec finalise la migration en couvrant les 5 chantiers restants :

- **P1** Cleanup mineurs de la vague 3 (debt connue)
- **P2** Upgrade `@base-ui/react` 1.1.0 → 1.5.0 (drop-in upgrade selon release notes)
- **P3** Wrapper Drawer dans core + migration sheets (swipe-to-dismiss natif)
- **P4** Popover (4 patterns dupliqués) + Tooltip (~15 boutons Info)
- **P5** Avatar + Separator semantique + NumberField + autres

À la fin de ce sprint, `web-client` aura une couverture Base UI à 100% sur tous les patterns hand-rolled identifiés.

---

## 2. Analyse de l'upgrade Base UI 1.1.0 → 1.5.0

Lecture des release notes (1.2, 1.3, 1.4, 1.5) confirme :

### Breaking changes — aucun ne nous affecte

- **1.3** : Drawer sort de preview (nous ne l'utilisons pas en 1.1 ; au contraire, on va l'ajouter)
- **1.5** : OTP Field `sanitizeValue` → `normalizeValue` (nous n'utilisons pas OTP)

Le package `@base-ui/react` (anciennement `@base-ui-components/react`) est déjà sous ce nom dans nos imports. Aucun changement d'import nécessaire.

### Bénéfices immédiats post-upgrade

| Version | Apport pour nous |
|---|---|
| 1.2 | Drawer stable, perf : memoization + style recalc reduced. Fixes iOS VoiceOver, focus handling. New props `allowOutOfRange` (NumberField), `finalFocus` (Select), `autoComplete` (Combobox/Select) |
| 1.3 | Drawer.SwipeArea, Tooltip.closeOnClick, Label parts (Select/Slider/Combobox), modal focus trapping amélioré, Autocomplete InputGroup |
| 1.4 | OTP Field (preview, future 2FA). Fixes Combobox + Drawer + Select |
| 1.5 | **+50-85% perf** sur mount/unmount popups. RTL fixes. Drawer.Viewport style forwarding. |

### Stratégie de vérification

Post-upgrade :
1. `pnpm --filter @make-the-change/core test` (33 tests doivent passer)
2. `pnpm --filter @make-the-change/web-client type-check` (exit 0)
3. Smoke test manuel : 5 écrans représentatifs (login, checkout/infos, project detail modal, addresses, kinnu)

Si un test échoue ou type-check casse, analyse au cas par cas. Probabilité estimée < 10%.

---

## 3. P1 — Cleanup vague 3 (3 sprints courts)

### P1.1 — Déplacer `progress.tsx` dans `base/`

**Fichier** :
- Déplacer : `packages/core/src/shared/ui/progress.tsx` → `packages/core/src/shared/ui/base/progress.tsx`

**Modification du contenu** :
- Corriger l'import `cn` : `from '../utils/cn'` → `from '../utils'`
- (le reste du fichier inchangé)

**Mise à jour barrel** :
- Dans `packages/core/src/shared/ui/index.ts` : changer l'export du chemin
```ts
// AVANT
export { Progress, type ProgressProps } from './progress'

// APRÈS
export { Progress, type ProgressProps } from './base/progress'
```

### P1.2 — Corriger callbacks `NotificationToggleRow`

**Fichier** : `apps/web-client/src/app/[locale]/(screens)/profile/settings/notifications/notifications-client.tsx`

7 occurrences de :
```tsx
onCheckedChange={() => handleToggle('push')}
```

Remplacer par :
```tsx
onCheckedChange={(_checked) => handleToggle('push')}
```

Les 7 keys : `push`, `email`, `monthly_report`, `project_updates`, `product_updates`, `leaderboard`, `academy`.

Le `_checked` souligne que la valeur est ignorée intentionnellement (le handler négocie l'état via la closure).

### P1.3 — Migrer slider step-3-contract

**Fichier** : `apps/web-client/src/app/[locale]/(screens)/onboarding/_features/step-3-contract.tsx`

Localiser la partie "subscription level slider" (~ligne 76-78). C'est un slider interactif avec :
- Une track `bg-white/10` ou similaire
- Un fill `style={{ width: '${percentage}%' }}`
- Un thumb positionné absolument
- Des click zones invisibles

Migrer la track + fill vers `SliderRoot` + primitives, en gardant le thumb visuel custom (Slider compose avec un `Thumb` Base UI invisible pour l'a11y + le thumb visuel custom positionné via CSS variable `--slider-position` exposée par Base UI).

Si la migration est trop complexe (UX très spécifique avec animations Framer Motion), documenter en `// TODO: post-finition migration` et passer.

**Durée P1** : 30 min total.

---

## 4. P2 — Upgrade `@base-ui/react` 1.5.0

### Action

```bash
cd "<worktree-path>"
pnpm --filter @make-the-change/core up "@base-ui/react@^1.5.0"
pnpm install
```

### Vérifications post-upgrade (séquentielles)

1. **Type-check core** :
```bash
pnpm --filter @make-the-change/core type-check
```
Si erreurs : lire chacune, fix surgical. Probabilité < 10%.

2. **Tests core** :
```bash
pnpm --filter @make-the-change/core test
```
33+ tests doivent passer. Si échec : analyser, fix.

3. **Type-check web-client** :
```bash
pnpm --filter @make-the-change/web-client type-check
```
Exit 0. Si erreurs nouvelles : analyser.

4. **Snapshot test** :
Si `theme-builder.snapshot.test.tsx` échoue par drift de classes CSS (perf optimizations 1.5 changent peut-être l'ordre des classes), mettre à jour le snapshot et commit dans le même commit que l'upgrade.

### Smoke test manuel (5 écrans)

Après merge éventuel sur main + Vercel build :
- `/fr/login` (Input + PasswordInput, Field, Form)
- `/fr/products/checkout/infos` (Select, AddressAutocompleteInput, Switch)
- `/fr/projets/[slug]` (FullScreenSlideModal, Tabs, MobileSheet via funding)
- `/fr/profile/settings/addresses` (Select dans modal)
- `/fr/lab/kinnu` (KinnuBottomSheet, Meter)

Tout doit fonctionner comme avant. Bonus visible : perf des popups (Select, Menu) plus fluide.

**Durée P2** : 1-2h.

---

## 5. P3 — Drawer pour sheets

### P3.1 — Créer wrapper Drawer dans core

**Nouveau fichier** : `packages/core/src/shared/ui/base/drawer.tsx`

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

**Update barrel** : ajouter ces exports dans `packages/core/src/shared/ui/index.ts` (alphabétiquement entre `Dialog` et `Field`).

### P3.2 — Migrer MobileSheet à Drawer

**Fichier** : `apps/web-client/src/app/[locale]/(screens)/projects/[slug]/_components/shared/mobile-sheet.tsx`

**Public API préservée** :
```ts
type MobileSheetProps = {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}
```

**Nouvelle implémentation** :

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

**Différences vs version Dialog actuelle** :
- `Drawer` au lieu de `Dialog` (root)
- `DrawerSwipeArea` autour du handle → swipe-down gesture natif
- `DrawerHandle` réactivé (visuel + sémantique)
- Z-index inchangé (z-[110]/z-[120] préservés du fix précédent)

**API publique strictement inchangée** : aucun consommateur (6+ fichiers utilisant MobileSheet via `@/components/ui/mobile-sheet`) ne doit changer.

### P3.3 — Migrer KinnuBottomSheet à Drawer

**Fichier** : `apps/web-client/src/app/[locale]/(lab)/kinnu/_components/kinnu-bottom-sheet.tsx`

Même approche : remplacer Dialog par Drawer + SwipeArea + Handle dans l'outer shell. Préserver le contenu intérieur (cards, status, particles si présentes).

### P3.4 — Documentation

Mettre à jour `docs/02-product/design-system/forms.md` (ou créer `overlays.md`) :
- Documenter Drawer disponible
- Pattern type pour bottom sheet
- Mention de swipe-to-dismiss natif
- Retirer la limitation documentée en vague 2 ("swipe-to-dismiss deferred")

**Durée P3** : 2-3h.

### Vérification manuelle obligatoire P3

Tester sur Chrome DevTools mode mobile :
- `/fr/projects/[slug]` → ouvrir funding sheet → swipe down dismisses
- `/fr/lab/kinnu` → ouvrir node detail → swipe down dismisses

---

## 6. P4 — Popover + Tooltip

### P4.1 — 4 migrations Popover

| Fichier | Pattern actuel | Migration |
|---|---|---|
| `apps/web-client/src/app/[locale]/(screens)/projects/[slug]/_components/shared/impact-disclaimer.tsx` (~lines 1-55) | `useState` + `AnimatePresence` Framer Motion + Info icon | `<Popover>` + `<PopoverTrigger>` (Info icon) + `<PopoverContent>` (disclaimer text) |
| `apps/web-client/src/app/[locale]/(screens)/academy/project-experiences/ruchers-antsirabe/_components/honey-effort-panel.tsx` (~lines 142-167) | `useState` toggle + AnimatePresence sources reveal | `<Collapsible>` (plus pertinent que Popover ici car c'est un disclose en place, pas un popup ancré) OU `<Popover>` |
| `apps/web-client/src/app/[locale]/(screens)/academy/project-experiences/ruchers-antsirabe/_components/territory-map.tsx` | Pattern identique au honey-effort | Idem (déduplique avec honey-effort si même usage) |
| `apps/web-client/src/app/[locale]/(lab)/appearance/_features/theme/theme-selection.tsx` (~lines 281-304) | `setShowNaming` + reveal slide-in input | `<Popover>` ancré sur le bouton qui ouvre |

**Décision détaillée par fichier** lors de l'implémentation. Si le pattern est "disclose in-place" (HoneyEffort, TerritoryMap) → `<Collapsible>` est plus correct. Si le pattern est "popup ancré sur trigger" (ImpactDisclaimer, theme naming) → `<Popover>`.

### P4.2 — `InfoTooltip` composant + ~15 migrations

**Nouveau composant** : `apps/web-client/src/components/ui/info-tooltip.tsx`

```tsx
'use client'

import { Info } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
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

export function InfoTooltip({ content, side = 'top', ariaLabel = 'Information', className }: InfoTooltipProps) {
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

Notes :
- Utilise `closeOnClick` prop (ajouté en 1.3) — fonctionne sur mobile (tap pour fermer)
- Z-index 200 (au-dessus des modales)
- L'icon Info est par défaut, le contenu est libre

**Migrations** : trouver les ~15 boutons `<button aria-label="..."><Info /></button>` et remplacer par `<InfoTooltip content="..." />`. Liste prévue (à confirmer par grep en début de sprint) :
- `academy/streak/page.tsx` : Info "Série locale"
- Profile settings pages
- Product detail
- Checkout info icons
- Advantages info icons

**Durée P4** : 2h.

---

## 7. P5 — Avatar + Separator + NumberField + finition

### P5.1 — Avatar batch

**Audit en début de sprint** : grep dans `apps/web-client/src` pour les patterns :
- `<div className="rounded-full ...">` avec initiales
- `<img>` custom avec sémantique avatar
- `<Image>` Next/Image avec fallback initiales

**Migration** : pour chaque avatar trouvé, remplacer par :
```tsx
import { Avatar, AvatarFallback, AvatarImage } from '@make-the-change/core/ui'

<Avatar className="...">
  <AvatarImage src={url} alt={name} />
  <AvatarFallback>{initials}</AvatarFallback>
</Avatar>
```

Candidats identifiés en vague 3 audit : profile header (`profile/[id]/page.tsx`), image uploader, impact feed.

### P5.2 — NumberField pour QuantityStepper

**Fichier** : `apps/web-client/src/app/[locale]/(screens)/products/[id]/_components/quantity-stepper.tsx`

Actuel : 2 boutons custom (− et +) + un display, avec logique "delete if quantity == 1 and user presses −".

Migration :
```tsx
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@make-the-change/core/ui'

<NumberField value={quantity} onValueChange={handleChange} min={0} max={maxStock}>
  <NumberFieldGroup>
    <NumberFieldDecrement onClick={handleDecrement /* with delete logic */} />
    <NumberFieldInput readOnly />
    <NumberFieldIncrement />
  </NumberFieldGroup>
</NumberField>
```

La logique "delete on decrement at 1" reste dans le `onClick` du Decrement.

### P5.3 — Separator semantique batch

**Audit méthodique** : lister TOUS les `border-t` / `border-b` / `<hr>` dans `apps/web-client/src/app`. Pour chaque :
- Est-ce une **bordure de container** (card, popup, header) ? → laisser
- Est-ce un **séparateur entre sections logiquement distinctes** ? → migrer vers `<Separator/>`

Estimation initiale : ~35 vrais séparateurs sur ~110 occurrences totales. Liste exhaustive à produire en début de sprint.

**Migration type** :
```tsx
// AVANT
<div className="border-t border-white/10 my-4" />

// APRÈS
import { Separator } from '@make-the-change/core/ui'
<Separator className="my-4 bg-white/10" />
```

Le `<Separator/>` Base UI ajoute `role="separator"` correctement.

### P5.4 — Cleanup final

- Vérifier que `step-3-contract.tsx` slider est bien migré (avait été touché en P1, vérifier consolidation)
- Remove imports inutilisés détectés post-migration

**Durée P5** : 2-3h.

---

## 8. Stratégie de branche

**Une seule branche** : `feat/base-ui-finition`.

**Worktree dédié** : `.worktrees/base-ui-finition` créé depuis `main` à jour. Pattern établi en vagues 1/2/3.

**Sync avant chaque phase** :
```bash
git fetch origin
git rebase origin/main
```

**Merge final** : après les 5 phases complétées et vérifiées, merge vers `main` avec `--no-ff` + commit de merge détaillant les 5 phases.

---

## 9. Agents par phase

| Phase | Implémenteur principal | Spec reviewer | Code quality reviewer | Justification |
|---|---|---|---|---|
| **P1.1** | **haiku** | haiku | haiku | File move + import path |
| **P1.2** | **haiku** | haiku | haiku | 7 string replacements |
| **P1.3** | **sonnet** | haiku | haiku | Slider complexe à comprendre |
| **P2** | **sonnet** | sonnet | sonnet | Upgrade Base UI, analyse risque |
| **P3.1** | **haiku** | haiku | haiku | Wrapper Drawer mécanique |
| **P3.2** | **sonnet** | sonnet | sonnet | MobileSheet utilisé par 6+ consumers, swipe gestures à valider |
| **P3.3** | **sonnet** | haiku | haiku | KinnuBottomSheet outer shell |
| **P3.4** | **haiku** | haiku | haiku | Documentation update |
| **P4.1** | **sonnet** | sonnet | haiku | Décision Popover vs Collapsible par fichier |
| **P4.2** | **sonnet** | haiku | haiku | Création InfoTooltip + ~15 migrations batch |
| **P5.1** | **sonnet** | haiku | haiku | Avatar audit + migrations (judgment) |
| **P5.2** | **haiku** | haiku | haiku | NumberField mécanique |
| **P5.3** | **sonnet** | sonnet | haiku | Separator audit discriminant (judgment) |

Vérification manuelle obligatoire après : P2 (smoke test), P3 (test swipe mobile), P4 (test tooltip hover/click).

---

## 10. Risques et mitigations

| Risque | Mitigation |
|---|---|
| Upgrade 1.5 introduit régression non documentée dans release notes | P2 inclut tests core + type-check + smoke test sur 5 écrans. Si bug : rollback `pnpm up` revert |
| Drawer.SwipeArea + Drawer.Handle layout casse l'apparence visuelle de MobileSheet | P3.2 préserve les classes existantes du sheet, ajoute Drawer comme racine. Test visuel avant merge. |
| API publique de MobileSheet change subtilement → casse 6+ consumers | API stricte `{isOpen, onClose, title?, children}` préservée. TypeScript check protège. |
| Migration Popover détruit le visuel Framer Motion existant (HoneyEffort, TerritoryMap) | Conservation du visuel : pendant migration, garder les classes Tailwind existantes. Animations Base UI native (data-[starting-style]) remplacent Framer mais préservent le look. |
| `closeOnClick` Tooltip se comporte différemment sur mobile que sur desktop | Test sur les deux. Si problème, ajuster côté par côté. |
| Avatar fallback nécessite calcul d'initiales custom | `<AvatarFallback>` accepte n'importe quel ReactNode → on garde la logique existante de génération d'initiales |
| Separator audit incorrect → migrer un border-t qui doit rester | Discrimination conservatrice : si doute, laisser. Plutôt under-migrate que casser un visuel. |
| Codex (autre IA) push sur main pendant le sprint | Rebase systématique avant chaque phase, comme vagues précédentes |

---

## 11. Critères de succès finaux

1. **`packages/core/src/shared/ui/progress.tsx` n'existe plus** (déplacé en `base/`)
2. **`NotificationToggleRow` callbacks** utilisent `(_checked) => ...` signature dans `notifications-client.tsx`
3. **`step-3-contract.tsx`** n'a plus de `<div style={{ width: 'X%' }}>` (Slider Base UI)
4. **`@base-ui/react` upgraded** à `^1.5.0` dans `packages/core/package.json`
5. **`tw-animate-css` toujours présent** et fonctionnel post-upgrade
6. **Wrapper `Drawer` existe** dans `packages/core/src/shared/ui/base/drawer.tsx`
7. **`MobileSheet`** utilise Drawer + swipe-to-dismiss fonctionnel sur Chrome DevTools mobile
8. **`KinnuBottomSheet`** utilise Drawer (outer shell)
9. **Composant `InfoTooltip`** créé et utilisé sur ~15 sites
10. **4 patterns Popover/Collapsible** migrés (ImpactDisclaimer, HoneyEffort, TerritoryMap, theme naming)
11. **Avatar Base UI** utilisé partout où sémantique avatar
12. **`QuantityStepper`** migré sur `NumberField`
13. **~35 séparateurs sémantiques** migrés vers `<Separator/>`
14. **Tests core 33/33** + type-check web-client exit 0
15. **Documentation à jour** : `forms.md` ou `overlays.md` mentionne Drawer + Tooltip pattern
16. **Aucun import direct** `@base-ui/react` dans `apps/web-client/src` (toujours via core)

---

## 12. Hors scope

- Migration `web-admin` (la même stack existe mais hors périmètre vague 1+2+3+finition)
- Refacto de Framer Motion partout (on en élimine certains, on garde le reste)
- Migration OTP Field (utile pour 2FA future, pas une régression actuelle)
- ContextMenu / Menubar / Toolbar / Toolbar (composants Base UI dispo mais aucun pattern hand-rolled identifié)
- ScrollArea (custom scrollbars — aucun cas critique audité)
- PreviewCard (hover preview — pas de pattern dans web-client)
- Direction Provider / CSP Provider (utilités Base UI non requises pour notre stack)
