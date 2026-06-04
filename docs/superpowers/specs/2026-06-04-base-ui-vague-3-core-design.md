# Base UI vague 3 core — AlertDialog, Switch, Tabs, RadioGroup, Slider, Progress/Meter

**Date:** 2026-06-04
**Scope:** `apps/web-client` uniquement
**Effort estimé:** 6 sprints incrémentaux, ~3h total

---

## 1. Contexte

La vague 1 a migré les formulaires (Input, Field, Form). La vague 2 a migré les sélecteurs structurels (Select, Accordion, Autocomplete, modales/sheets). Cette vague 3 core attaque les composants moyens encore hand-rolled : confirmation destructive, switches, tabs, radio groups, sliders, progress bars.

L'audit a identifié 13 fichiers concernés et **2 patterns dupliqués** qui méritent d'être consolidés dans des composants partagés :

- `ResetConfirmModal` utilisé dans Academy + Streak (action destructive)
- `ToggleSwitch` local utilisé 8× dans notifications-client

Cette vague crée ces deux composants partagés et migre tous les autres patterns en direct.

**Hors scope** (documenté en section 11) :
- Patterns Popover/Tooltip (vague 3 étendue, non urgent)
- Avatar batch (vague 3 étendue)
- Separator semantique (35 cas, opportuniste)
- QuantityStepper (déjà semi-compliant)
- Amount inputs `text-7xl` (UX intentionnelle)
- Drawer (nécessite upgrade Base UI 1.5+)

---

## 2. Architecture cible

### 2.1 Composant partagé `ConfirmDestructiveDialog`

**Emplacement** : `apps/web-client/src/components/ui/confirm-destructive-dialog.tsx`

**API publique** :
```tsx
type ConfirmDestructiveDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel?: string  // default: "Confirmer"
  cancelLabel?: string   // default: "Annuler"
  onConfirm: () => void | Promise<void>
  isPending?: boolean
}
```

**Architecture interne** : utilise `AlertDialog`, `AlertDialogPortal`, `AlertDialogOverlay`, `AlertDialogContent`, `AlertDialogTitle`, `AlertDialogDescription`, `AlertDialogAction`, `AlertDialogCancel` de `@make-the-change/core/ui`.

**Spécifications visuelles** :
- Backdrop assombri : `bg-black/70 backdrop-blur-sm`
- Z-index : `z-[110]` backdrop, `z-[120]` popup (au-dessus des `FullScreenSlideModal` à `z-[100]`)
- Popup centré : `max-w-sm rounded-2xl bg-[#0B0F15] border border-white/10 p-6`
- Title : `text-lg font-bold text-white`
- Description : `mt-2 text-sm text-white/70`
- Footer flex avec 2 boutons :
  - Cancel : `border border-white/10 text-white/80 bg-transparent hover:bg-white/5`
  - Confirm : `bg-red-500 hover:bg-red-600 text-white`
- Loader Lucide `Loader2` à gauche du label confirm quand `isPending=true`
- Les deux boutons sont `disabled` pendant `isPending`

**Bénéfices a11y** : `AlertDialog` de Base UI assure :
- `role="alertdialog"` automatique
- Focus trap entre les 2 boutons
- Pas de fermeture par escape ou click-outside par défaut (force la décision)
- Annonce lecteur d'écran comme alerte (pas comme dialog simple)

### 2.2 Composant partagé `NotificationToggleRow`

**Emplacement** : `apps/web-client/src/components/ui/notification-toggle-row.tsx`

**API publique** :
```tsx
type NotificationToggleRowProps = {
  label: string
  description?: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
}
```

**Architecture interne** : utilise `Switch` + `SwitchThumb` de `@make-the-change/core/ui` dans un layout flex.

**Spécifications visuelles** (reprises de l'actuel `ToggleSwitch` local) :
- Row : `flex items-center justify-between gap-4 py-3`
- Text block (gauche) : `flex-1`
  - Label : `text-sm font-medium text-white`
  - Description : `mt-0.5 text-xs text-white/50`
- Switch track : `relative h-6 w-11 shrink-0 rounded-full transition-colors data-[checked]:bg-lime-400 data-[unchecked]:bg-white/10`
- Switch thumb : `absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform data-[checked]:translate-x-5`

### 2.3 Migrations directes (sans wrapper partagé)

Tous les autres composants migrent en direct chez le consommateur :
- **Tabs** : `<Tabs>` + `<TabsList>` + `<TabsTrigger>` + `<TabsContent>` de core
- **RadioGroup** : `<RadioGroup>` + `<Radio>` de core
- **Slider** : `<Slider>` + `<SliderControl>` + `<SliderTrack>` + `<SliderIndicator>` + `<SliderThumb>` de core
- **Progress** : `<Progress>` + `<ProgressTrack>` + `<ProgressIndicator>` (à vérifier composition exacte)
- **Meter** : `<Meter>` + `<MeterTrack>` + `<MeterIndicator>` + `<MeterValue>` (à vérifier composition exacte)

Les `<Switch>` directs dans checkout (cas unique pour "Sauvegarder cette adresse") sont également migrés en direct, sans passer par `NotificationToggleRow`.

---

## 3. Sprints (S1 → S6)

### S1 — AlertDialog et `ConfirmDestructiveDialog`

**Nouveau composant** :
- Créer `apps/web-client/src/components/ui/confirm-destructive-dialog.tsx` avec l'API et le visuel décrits en 2.1.

**Migrations** :
- `apps/web-client/src/app/[locale]/(screens)/academy/page.tsx`
  - Remplacer le bloc `ResetConfirmModal` (lignes ~207-248) qui utilise `setShowResetConfirm` + `FullScreenSlideModal`
  - Par `<ConfirmDestructiveDialog open={showResetConfirm} onOpenChange={setShowResetConfirm} title="Réinitialiser ta progression ?" description="..." confirmLabel="Réinitialiser" onConfirm={handleReset} />`

- `apps/web-client/src/app/[locale]/(screens)/academy/streak/page.tsx`
  - Idem (lignes ~141-162)

**Durée estimée** : 30 min

### S2 — Switch et `NotificationToggleRow`

**Nouveau composant** :
- Créer `apps/web-client/src/components/ui/notification-toggle-row.tsx` avec l'API et le visuel décrits en 2.2.

**Migrations** :
- `apps/web-client/src/app/[locale]/(screens)/profile/settings/notifications/notifications-client.tsx`
  - Supprimer la définition locale `ToggleSwitch` (~lignes 26-39)
  - Remplacer les 8 utilisations par `<NotificationToggleRow label="..." description="..." checked={...} onCheckedChange={...} />`
  - Les 8 settings sont : push, email, monthly_report, project_updates, product_updates, leaderboard, marketing, academy

- `apps/web-client/src/app/[locale]/(screens)/products/checkout/infos/infos-client.tsx`
  - Remplacer le toggle "Sauvegarder cette adresse" (~lignes 314-335) par un usage direct de `<Switch checked={saveAddress} onCheckedChange={setSaveAddress}>` + `<SwitchThumb>`, avec layout flex inline (pas via `NotificationToggleRow` car contexte différent)

**Durée estimée** : 30 min

### S3 — Tabs

**Migrations** :
- `apps/web-client/src/app/[locale]/(screens)/projects/[slug]/_components/project-detail-tabs.tsx`
  - Remplacer le `useState<ProjectDetailTabId>` + `<button role="tab">` manuel + `role="tablist"` par la composition Base UI
  - Préserver le visuel (pills horizontales, scroll horizontal, sticky behavior)
  - Préserver le type `ProjectDetailTabId` (utilisé ailleurs)

- `apps/web-client/src/app/[locale]/(screens)/projects/[slug]/project-quick-view.tsx`
  - Vérifier si tabs internes (probable, à confirmer en lisant le fichier)
  - Si oui, même migration

**Durée estimée** : 30 min

### S4 — RadioGroup

**Migration** :
- `apps/web-client/src/app/[locale]/(screens)/advantages/[id]/_features/experience-slot-picker.tsx`
  - Remplacer le `role="radiogroup"` manuel + `<input type="radio" sr-only>` cachés par `<RadioGroup value={...} onValueChange={...}>` + `<Radio value="...">` de core
  - Préserver le visuel "carte cliquable" via className personnalisé sur `<Radio>` ou via composition avec `<label>` autour de chaque `<Radio>`

**Durée estimée** : 15 min

### S5 — Slider

**Migrations** :
- `apps/web-client/src/app/[locale]/(screens)/academy/[chapter]/[unit]/page.tsx`
  - Ligne ~727 : remplacer `<input type="range" min={0} max={100} step={5} value={confidence} ...>` par la composition Base UI Slider
  - Préserver le style `accent-emerald-500` via className sur `<SliderIndicator>` et `<SliderThumb>`

- `apps/web-client/src/app/[locale]/(screens)/ecosysteme/_components/ecosystem-interactions-lab.tsx`
  - Localiser le `<input type="range">` (ligne à confirmer)
  - Idem

**Durée estimée** : 20 min

### S6 — Progress + Meter batch

**Migrations Progress** (8 instances) :

| Fichier | Lignes | Type |
|---|---|---|
| `apps/web-client/src/app/[locale]/(screens)/projects/[slug]/_components/quick-view/funding-sheet.tsx` | ~120-125 | Funding goal % |
| `apps/web-client/src/app/[locale]/(screens)/impact/_features/impact-tab-client.tsx` | ~507-510 | Collective goal % |
| `apps/web-client/src/app/[locale]/(screens)/impact/reward/page.tsx` | ~100-105 | Collective goal % |
| `apps/web-client/src/app/[locale]/(screens)/academy/page.tsx` | ~761-763 | Chapter progress |
| `apps/web-client/src/app/[locale]/(screens)/learn/parcours/[pathId]/_components/guided-path-experience.tsx` | ~154-156 | Path progress |
| `apps/web-client/src/app/[locale]/(screens)/onboarding/_features/step-3-contract.tsx` | ~76-78 | Slider background |

Remplacer chaque `<div style={{ width: '${x}%' }}>` interne par `<Progress value={x}>` avec composition Base UI préservant les gradients existants via className.

**Migrations Meter** (4 instances) :

| Fichier | Lignes | Type |
|---|---|---|
| `apps/web-client/src/app/[locale]/(lab)/kinnu/_components/kinnu-bottom-sheet.tsx` | ~157 | Health % |
| `apps/web-client/src/app/[locale]/(lab)/kinnu/_components/kinnu-hud.tsx` | ~61 | Energy % |
| `apps/web-client/src/app/[locale]/(lab)/kinnu/_components/kinnu-world-card.tsx` | ~96 | Mastery % |
| `apps/web-client/src/app/[locale]/(screens)/ecosysteme/_components/ecosystem-interactions-lab.tsx` | ~477 | Edge strength % |

Remplacer chaque `<div>` calculé par `<Meter value={x} min={0} max={100}>` avec composition Base UI préservant le visuel.

**Durée estimée** : 1h (12 instances, batch)

---

## 4. Stratégie de branche

Identique à la vague 2 : worktree isolé `.worktrees/base-ui-vague-3-core` sur branche `feat/base-ui-vague-3-core`. Sync `git fetch && git rebase origin/main` avant chaque sprint.

---

## 5. Agents et outils par sprint

| Sprint | Implémenteur | Spec reviewer | Code quality reviewer | Justification |
|---|---|---|---|---|
| S1 AlertDialog | **sonnet** | haiku | haiku | Création de composant partagé + 2 migrations cohérentes |
| S2 Switch | **sonnet** | haiku | haiku | Création de composant partagé + 9 migrations |
| S3 Tabs | **haiku** | haiku | haiku | Mécanique simple, structure répétitive |
| S4 RadioGroup | **haiku** | haiku | haiku | 1 fichier, mécanique simple |
| S5 Slider | **haiku** | haiku | haiku | 2 fichiers, composition mécanique |
| S6 Progress/Meter | **sonnet** | haiku | haiku | 12 instances batch, attention aux styles préservés |

Vérification UI manuelle (skill `verify` ou test manuel direct) recommandée après chaque sprint sensible visuellement (S1 reset modal, S6 progress bars).

---

## 6. Risques et mitigations

| Risque | Mitigation |
|---|---|
| Composition exacte des sous-composants `Progress` et `Meter` inconnue (Base UI a beaucoup de variantes) | S6 : lire `packages/core/src/shared/ui/base/progress.tsx` et `meter.tsx` en début de sprint pour confirmer l'API exacte avant de migrer |
| `Tabs` de Base UI peut imposer un layout qui clash avec le pattern pills horizontales actuel | S3 : préserver le visuel via className override sur `TabsList` + `TabsTrigger`. Si nécessaire, garder le sticky behavior dans un wrapper externe à `<Tabs>` |
| `RadioGroup` change la structure DOM (plus de label wrapper sr-only) → CSS hover/focus existant peut casser | S4 : adapter le CSS pour cibler `data-[checked]` sur `Radio` directement plutôt que via input:checked |
| Animation Switch (translate-x) doit fonctionner avec `data-[checked]` au lieu de boolean prop | S2 : utiliser les sélecteurs `data-[checked]:translate-x-5 data-[unchecked]:translate-x-0` sur SwitchThumb |
| `ConfirmDestructiveDialog` centered modal change l'UX par rapport au full-screen slide actuel | Validé en brainstorming : pattern UX standard pour confirmation destructive, plus correct sémantiquement |
| `tailwindcss-animate` (vague 2 fix) est nouveau dans le pipeline, animations Base UI pourraient surprendre | Déjà installé (commit `ddf2141b`), tw-animate-css fournit les keyframes nécessaires |

---

## 7. Critères de succès

1. **`ConfirmDestructiveDialog` créé** et utilisé par Academy + Streak. Aucun `FullScreenSlideModal` n'est plus utilisé pour confirmation destructive dans ces 2 fichiers.
2. **`NotificationToggleRow` créé** et utilisé 8× dans notifications-client.tsx. Définition locale `ToggleSwitch` supprimée.
3. **Switch direct** dans checkout/infos pour le toggle "Sauvegarder cette adresse".
4. **Tabs migrés** : `grep -rn 'role="tab"' apps/web-client/src` retourne zéro (sauf Base UI internals si rendus).
5. **Zéro `<input type="radio"` brut** dans `apps/web-client/src/app` (hors hidden form inputs si présents).
6. **Zéro `<input type="range">`** dans `apps/web-client/src/app`.
7. **Zéro `<div style={{ width: '..%' }}>`** utilisé pour visualisation de progress/meter dans les fichiers listés en S6.
8. **Type-check passe** : `pnpm --filter @make-the-change/web-client type-check` exit 0.
9. **Tests core passent** : `pnpm --filter @make-the-change/core test`.
10. **Vérification manuelle OK** sur 4 écrans représentatifs :
    - Academy reset confirm (centered modal, action rouge, focus trap)
    - Notifications settings (8 toggles fonctionnels)
    - Project detail tabs (switch entre tabs, sticky behavior)
    - Kinnu HUD (meter health/energy affichage correct)

---

## 8. Décisions architecturales validées en brainstorming

- **Composants partagés créés** pour ResetConfirm et NotificationToggle (patterns dupliqués éliminés)
- **AlertDialog centered** plutôt que full-screen slide-up (pattern UX standard pour destructive)
- **Switch checkout en direct** (cas unique, pas dans NotificationToggleRow)
- **Tabs migration 1-pour-1** (préserver UX existante)
- **`Progress` vs `Meter` distingué** : task completion → Progress, range numérique → Meter

---

## 9. Hors scope (rappelé)

| Pattern | Raison du skip |
|---|---|
| QuantityStepper | Déjà sémantiquement correct (`role="group"`, aria-labels) |
| Amount inputs `text-7xl` contribute/support | UX intentionnel produit |
| Popover patterns (HoneyEffort, TerritoryMap, ImpactDisclaimer, ThemeNaming) | Vague 3 étendue |
| Avatar batch (profile, image-uploader, impact feed) | Vague 3 étendue |
| Separator semantique (35 cas) | Cosmétique, opportuniste |
| ~75 `border-t` cosmétiques | Pas des séparateurs sémantiques |
| Drawer pour MobileSheet (swipe-to-dismiss natif) | Nécessite upgrade `@base-ui/react` 1.1 → 1.5+ |
| `web-admin` | Hors scope global de la migration web-client |
