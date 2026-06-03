# Base UI vague 2 — Selects, Accordions, Autocomplete, Modales/Sheets

**Date:** 2026-06-03
**Scope:** `apps/web-client` uniquement
**Effort estimé:** 4 sprints incrémentaux, ~1 semaine

---

## 1. Contexte

La vague 1 (mergée le 2026-06-02, commit `a1319ebc`) a migré tous les formulaires de `web-client` au pattern `<Field><FieldControl render={<Input/>}/><FieldError/></Field>` de Base UI. Cette vague 2 étend la migration aux **autres composants UI hand-rolled** qui ont un équivalent direct dans Base UI.

L'audit du codebase a identifié 12 catégories de patterns custom. Cette vague 2 attaque les **4 catégories haute priorité** :

- **S1 — Selects HTML bruts** (4 fichiers, ~10 occurrences) : country pickers, perspective filters, course filters
- **S2 — Accordions custom** (3 fichiers : FAQ public, product info, home FAQ) : useState + Framer Motion hand-rolled
- **S3 — AddressAutocompleteInput** : 216 lignes de combobox async fait main avec portal manuel, getBoundingClientRect, debounce, AbortController, keyboard navigation
- **S4 — Modales et Sheets** : `FullScreenSlideModal` (utilisé dans ~55 fichiers via les @modal interceptés), `MobileSheet`, `SavedAddressesSheet`, `KinnuBottomSheet`, et dérivés

Les 8 catégories basse/moyenne priorité (Tabs, Switch, NumberField, RadioGroup, Slider, Separator, Progress, Toggle Switch checkout) sont **hors scope** de cette vague et feront des PRs séparées.

**Important** : tous les wrappers Base UI nécessaires existent déjà dans `packages/core/src/shared/ui/base/` — c'est une migration côté apps, pas une création de composants.

---

## 2. Architecture cible

### 2.1 Principe directeur — préserver l'API publique des wrappers

Les composants qui sont des **wrappers réutilisés à grande échelle** (FullScreenSlideModal × 55+, MobileSheet × 6+, AddressAutocompleteInput × 2) gardent leur signature publique inchangée. Seule l'implémentation interne change pour utiliser Base UI. Avantages :

- Zéro changement côté ~55 écrans `@modal` interceptés
- Pas de coordination cross-team nécessaire
- Si une autre IA (codex) bosse en parallèle, zéro conflit sur les zones intercept routes
- Possible de revert un sprint sans toucher aux consommateurs

Les patterns **non wrappés** (selects HTML directs, accordions inline) sont migrés directement chez le consommateur.

### 2.2 Composants Base UI utilisés (déjà dans `packages/core`)

| Sprint | Composant Base UI | Wrapper core existant |
|---|---|---|
| S1 | `Select`, `SelectItem`, `SimpleSelect` | `packages/core/src/shared/ui/base/select.tsx` |
| S2 | `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent` | `packages/core/src/shared/ui/base/accordion.tsx` |
| S3 | `Autocomplete`, `AutocompleteInput`, `AutocompletePortal`, `AutocompletePositioner`, `AutocompletePopup`, `AutocompleteList`, `AutocompleteItem`, `AutocompleteCollection` | `packages/core/src/shared/ui/base/autocomplete.tsx` |
| S4 | `Dialog` (pour FullScreenSlideModal), `Drawer` (pour MobileSheet et sheets) | `packages/core/src/shared/ui/base/dialog.tsx` ; pour `Drawer` à vérifier si déjà wrappé sinon ajouter |

### 2.3 Diagramme d'impact

```
                ┌─ checkout/infos                     ┐
                │  addresses-client                   │
S1 Selects ────►│  ecosystem-detail                   │── 4 fichiers
                │  learn/courses                      │
                └─                                    ┘

                ┌─ faq/_features/faq-accordion        ┐
S2 Accordions ──►  product-information-sections      │── 3 fichiers
                │  home/sections/home-faq-section     │
                └─                                    ┘

                ┌─ checkout/infos                     ┐
S3 Autocomplete ►│ addresses (via AddressFields)      │── 1 fichier wrappé,
                │  (par le wrapper AddressAutocompleteInput) │   2 consommateurs
                └─                                    ┘

                ┌─ FullScreenSlideModal (wrapper)     ┐── 1 fichier wrappé
                │  └─ ~55 écrans intercepted routes   │   ~55 bénéficiaires
S4 Modales ────►│  MobileSheet (wrapper)              │── 1 fichier wrappé
                │  └─ funding-sheet, biodex-sheet,    │   6+ bénéficiaires
                │     atlas-course-sheet              │
                │  SavedAddressesSheet (custom)       │── 1 fichier direct
                │  KinnuBottomSheet (custom)          │── 1 fichier direct
                └─                                    ┘
```

---

## 3. Sprint S1 — Selects HTML → Base UI Select

### 3.1 Stratégie

Remplacer chaque pattern raw `<select>` + `<ChevronDown>` overlay par `<SimpleSelect>` de Base UI (déjà wrappé dans core).

Le wrapper core `SimpleSelect` accepte déjà un `triggerClassName` qui permet de réutiliser nos classes Tailwind ghost / default sans modification.

### 3.2 Variants

Si nécessaire (à vérifier au moment de l'implem), ajouter un `selectVariants` cva dans `packages/core/src/shared/ui/base/select-variants.ts` analogue à `inputVariants` avec variants `default`/`outlined`/`filled`/`ghost`. **Décision conditionnelle** : si les classes inline actuelles couvrent les besoins, pas de cva à créer.

### 3.3 Pattern de migration

```tsx
// AVANT
<div className="relative">
  <select
    value={customer.country}
    onChange={(e) => handleCountryChange(e.target.value)}
    autoComplete="country"
    className="h-13 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-base text-white placeholder:text-white/25 w-full appearance-none pr-10"
  >
    {CHECKOUT_COUNTRIES.map((c) => (
      <option key={c.code} value={c.code} className="bg-[#0B0F15] text-white">
        {c.label}
      </option>
    ))}
  </select>
  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" aria-hidden="true" />
</div>

// APRÈS
<SimpleSelect
  value={customer.country}
  onValueChange={(value) => handleCountryChange(value)}
  triggerClassName="h-13 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-base text-white w-full"
>
  {CHECKOUT_COUNTRIES.map((c) => (
    <SelectItem key={c.code} value={c.code}>{c.label}</SelectItem>
  ))}
</SimpleSelect>
```

### 3.4 Fichiers à migrer

| Fichier | Selects à migrer |
|---|---|
| `apps/web-client/src/app/[locale]/(screens)/profile/settings/addresses/addresses-client.tsx` | Pays (ligne ~43-52) |
| `apps/web-client/src/app/[locale]/(screens)/products/checkout/infos/infos-client.tsx` | Pays (ligne ~293-310) |
| `apps/web-client/src/app/[locale]/(screens)/ecosysteme/_components/ecosystem-detail.tsx` | Perspective (ligne ~218-228) |
| `apps/web-client/src/app/[locale]/(screens)/learn/courses/page.tsx` | Domaine + Niveau + Durée + Projet (4 selects) |

### 3.5 Bénéfices

- A11y native (annonces écran lecteur, navigation clavier complète)
- Style cohérent cross-écrans
- Popup positioning automatique (collision detection, virtual focus)
- Click outside, escape close gérés

### 3.6 Risques

- L'expérience native iOS/Android sélecteur "wheel" est perdue (Base UI Select rend un popup custom). Vérifier l'UX mobile avant merge.
- `learn/courses/page.tsx` est un **Server Component** côté Next.js qui envoie le form en GET. Vérifier que `SimpleSelect` se comporte bien dans un Server Component / form sans `useState`. **Décision** : si Server Component, migrer en Client Component (`'use client'`) le bloc filtres seul. Sinon garder native `<select>` qui est OK ici (form natif fonctionne).

---

## 4. Sprint S2 — Accordions custom → Base UI Accordion

### 4.1 Stratégie

3 fichiers utilisent des accordions custom. Tous migrés vers `<Accordion>` + sous-composants du core. Animations CSS natives via `data-[state=open]:` / `data-[state=closed]:` selectors Tailwind. Plus de Framer Motion dans ces composants.

### 4.2 Pattern de migration

```tsx
// AVANT — apps/web-client/src/app/[locale]/(site)/faq/_features/faq-accordion.tsx
const [activeId, setActiveId] = useState<string | null>(null)

{items.map(item => (
  <motion.div key={item.id} className="...">
    <button onClick={() => setActiveId(activeId === item.id ? null : item.id)}>
      {item.question}
      <ChevronDown className={activeId === item.id ? 'rotate-180' : ''} />
    </button>
    <AnimatePresence>
      {activeId === item.id && (
        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}>
          {item.answer}
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
))}

// APRÈS
<Accordion type="single" collapsible className="...">
  {items.map(item => (
    <AccordionItem key={item.id} value={item.id} className="...">
      <AccordionTrigger className="group flex w-full items-center justify-between ...">
        {item.question}
        <ChevronDown className="h-4 w-4 transition-transform group-data-[panel-open]:rotate-180" />
      </AccordionTrigger>
      <AccordionContent className="overflow-hidden transition-[height] duration-300 data-[ending-style]:h-0 data-[starting-style]:h-0">
        {item.answer}
      </AccordionContent>
    </AccordionItem>
  ))}
</Accordion>
```

### 4.3 Fichiers à migrer

| Fichier | Accordion type |
|---|---|
| `apps/web-client/src/app/[locale]/(site)/faq/_features/faq-accordion.tsx` | FAQ publique avec Framer Motion |
| `apps/web-client/src/app/[locale]/(screens)/products/[id]/_components/product-information-sections.tsx` | Sub-component `AccordionSection` interne |
| `apps/web-client/src/app/[locale]/(site)/(home)/_components/sections/home-faq-section.tsx` | FAQ home avec Plus/Minus icons + Framer Motion |

### 4.4 Décision animations

**Animations CSS natives Base UI** (validation user). Plus de Framer Motion pour les accordions. Pattern :
- `data-[panel-open]:rotate-180` sur ChevronDown trigger
- `transition-[height] duration-300 data-[starting-style]:h-0 data-[ending-style]:h-0` sur AccordionContent
- Si nécessaire, ajouter un overflow-hidden + une transition explicite

Framer Motion reste utilisé ailleurs dans le projet — pas de désinstallation.

### 4.5 Documentation

Ajouter une section "Disclosure patterns (Accordion, Collapsible)" au guide `docs/02-product/design-system/forms.md`. Documenter le pattern type, les animations CSS, les variants.

### 4.6 Risques

- Les animations CSS Base UI utilisent `height: auto` interpolation qui peut être imparfaite sur Safari sans `interpolate-size: allow-keywords`. Tester sur Safari avant merge.

---

## 5. Sprint S3 — AddressAutocompleteInput → Autocomplete

### 5.1 Stratégie

Le composant `AddressAutocompleteInput` (216 lignes) est un combobox custom hand-rolled. Sa réécriture interne utilise les sous-composants `Autocomplete*` de Base UI déjà dans core.

**API publique conservée** : les 2 consommateurs (`checkout/infos`, `AddressFields` dans `addresses-client`) ne changent pas.

```tsx
type AddressAutocompleteInputProps = {
  id: string
  value: string
  country: string
  placeholder?: string
  className?: string
  onChange: (street: string) => void
  onSelect: (selection: { street: string; postalCode: string; city: string }) => void
}
```

### 5.2 Architecture interne nouvelle

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

export function AddressAutocompleteInput({ id, value, country, placeholder, className, onChange, onSelect }: Props) {
  const [items, setItems] = useState<AddressSuggestion[]>([])
  const debouncedValue = useDebounce(value, 300)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (debouncedValue.length < 3) {
      setItems([])
      return
    }
    abortRef.current?.abort()
    const ac = new AbortController()
    abortRef.current = ac
    fetch(`/api/address-suggest?country=${country}&q=${encodeURIComponent(debouncedValue)}`, { signal: ac.signal })
      .then((r) => r.json())
      .then((data: AddressSuggestion[]) => setItems(data))
      .catch((err) => { if (err.name !== 'AbortError') console.warn(err) })
  }, [debouncedValue, country])

  return (
    <Autocomplete
      value={value}
      onValueChange={onChange}
      onItemHighlighted={() => {}}
      onSelected={(item) => {
        if (item) onSelect(item as AddressSuggestion)
      }}
    >
      <AutocompleteInput id={id} placeholder={placeholder} className={className} />
      <AutocompletePortal>
        <AutocompletePositioner>
          <AutocompletePopup>
            <AutocompleteList>
              <AutocompleteCollection>
                {items.map((s) => (
                  <AutocompleteItem key={`${s.street}-${s.postalCode}`} value={s}>
                    <div>{s.street}, {s.postalCode} {s.city}</div>
                  </AutocompleteItem>
                ))}
              </AutocompleteCollection>
              {items.length === 0 && debouncedValue.length >= 3 && (
                <AutocompleteEmpty>Aucune adresse trouvée</AutocompleteEmpty>
              )}
            </AutocompleteList>
          </AutocompletePopup>
        </AutocompletePositioner>
      </AutocompletePortal>
    </Autocomplete>
  )
}
```

### 5.3 Logique custom préservée

- **Fetch async** vers `/api/address-suggest` (route Next.js existante ou équivalent) : code identique
- **Debouncing 300ms** : hook `useDebounce` (à créer si absent dans `lib/`) ou approche `setTimeout` manuelle dans `useEffect`
- **AbortController** : pour annuler les requêtes obsolètes (race conditions)

### 5.4 Logique remplacée (gratuite avec Base UI)

| Avant | Maintenant |
|---|---|
| Portal manuel `createPortal(div, document.body)` | `<AutocompletePortal>` |
| Calcul `getBoundingClientRect()` + space-below | `<AutocompletePositioner>` (collision detection automatique) |
| Keyboard navigation `onKeyDown` arrow up/down/enter | Base UI a11y patterns natifs |
| `aria-autocomplete`, `aria-expanded`, `aria-activedescendant` à la main | Câblés automatiquement |
| `useId` + sync entre input et listbox | Géré par Base UI |
| Click outside detection custom | Base UI gère focus + dismiss |

### 5.5 Risques

- `useAutocompleteFilter` de Base UI est conçu pour filtrage client (liste statique). Notre fetch est async externe → on ne l'utilise pas, on alimente directement `items` par `setState`.
- La signature `onSelected` de Base UI passe l'item complet ; on adapte au type `AddressSuggestion`.
- Style ghost du popup : à styliser via className sur AutocompletePopup.

---

## 6. Sprint S4 — Modales et Sheets

### 6.1 S4.1 — `FullScreenSlideModal` refacto interne sur `Dialog`

#### Fichier
`apps/web-client/src/app/[locale]/@modal/_components/full-screen-slide-modal.tsx`

#### API publique (inchangée — 55+ consommateurs ne bougent pas)
```tsx
type FullScreenSlideModalProps = {
  title: string
  fallbackHref: string
  headerMode?: 'back' | 'close'
  onClose?: () => void
  contentClassName?: string
  className?: string
  children: ReactNode
}
```

#### Architecture interne nouvelle

```tsx
'use client'

import { Dialog } from '@make-the-change/core/ui'
import { useRouter } from 'next/navigation'
import { useScrollElevation } from './use-scroll-elevation'

export function FullScreenSlideModal({ title, fallbackHref, headerMode = 'close', onClose, contentClassName, className, children }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(true)
  const contentRef = useRef<HTMLDivElement>(null)
  const elevated = useScrollElevation(contentRef)

  const handleClose = () => {
    setOpen(false)
    onClose?.()
    setTimeout(() => router.back() || router.push(fallbackHref), 200) // wait for close animation
  }

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && handleClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 transition-opacity duration-200" />
        <Dialog.Popup
          className={cn(
            'fixed inset-y-0 right-0 z-50 flex w-full flex-col bg-[#0B0F15] text-white',
            'data-[ending-style]:translate-x-full data-[starting-style]:translate-x-full transition-transform duration-200 ease-out',
            className,
          )}
        >
          <header className={cn(
            'sticky top-0 z-10 flex h-14 items-center justify-between border-b border-white/5 bg-[#0B0F15]/80 px-4 backdrop-blur-xl transition-shadow',
            elevated && 'shadow-[0_4px_12px_rgba(0,0,0,0.3)]',
          )}>
            <Dialog.Close render={<button aria-label="Fermer" className="...">{headerMode === 'back' ? <ChevronLeft /> : <X />}</button>} />
            <Dialog.Title className="text-sm font-semibold">{title}</Dialog.Title>
            <div className="w-10" /> {/* spacer */}
          </header>
          <div ref={contentRef} className={cn('flex-1 overflow-y-auto', contentClassName)}>
            {children}
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
```

#### Hook `useScrollElevation`

```tsx
// apps/web-client/src/app/[locale]/@modal/_components/use-scroll-elevation.ts
import { useEffect, useState, type RefObject } from 'react'

export function useScrollElevation(ref: RefObject<HTMLElement>, threshold = 4) {
  const [elevated, setElevated] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onScroll = () => setElevated(el.scrollTop > threshold)
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [ref, threshold])
  return elevated
}
```

#### Bénéfices

| Avant | Après |
|---|---|
| Focus trap fait à la main | Géré par Base UI Dialog |
| Body scroll lock manuel | Géré par Base UI |
| Escape key fermeture | Câblé automatiquement |
| `aria-modal`, `role="dialog"`, `aria-labelledby` | Câblés via Dialog.Title |
| Animation slide-in via Tailwind `animate-in slide-in-from-right` | `data-[starting-style]:translate-x-full` + transition |

### 6.2 S4.2 — `MobileSheet` refacto interne sur `Drawer`

#### Fichier
`apps/web-client/src/app/[locale]/(screens)/projects/[slug]/_components/shared/mobile-sheet.tsx`

#### Prérequis core
Vérifier si `Drawer` est déjà wrappé dans `packages/core/src/shared/ui/base/`. Si non, créer le wrapper `drawer.tsx` qui ré-exporte `Drawer.*` de `@base-ui/react/drawer`.

#### Architecture nouvelle (Drawer Base UI)

```tsx
'use client'

import { Drawer } from '@make-the-change/core/ui'
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
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Backdrop className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 transition-opacity duration-200" />
        <Drawer.Popup
          className={cn(
            'fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[90dvh] w-full max-w-screen-sm flex-col rounded-t-3xl bg-[#0B0F15] text-white',
            'data-[ending-style]:translate-y-full data-[starting-style]:translate-y-full transition-transform duration-200 ease-out',
            className,
          )}
        >
          <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-white/20" />
          {title && (
            <Drawer.Title className="px-4 pt-2 text-center text-base font-semibold">{title}</Drawer.Title>
          )}
          <div className="flex-1 overflow-y-auto px-4 pb-[env(safe-area-inset-bottom)] pt-4">
            {children}
          </div>
        </Drawer.Popup>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
```

#### Bénéfices supplémentaires

- **Swipe-to-dismiss** : Base UI Drawer fournit nativement le geste de swipe pour fermer (`Drawer.Handle` optionnel pour le bouton de "poignée")
- Animation fluide native
- Focus trap, scroll lock, escape close automatiques
- Le wrapper `MobileSheet` garde son API publique — les ~6 sheets dérivées (`funding-sheet`, `biodex-sheet`, `atlas-course-sheet`, `quick-view`) ne changent pas une ligne

### 6.3 S4.3 — Sheets custom (SavedAddressesSheet, KinnuBottomSheet)

Ces deux sheets n'utilisent pas `MobileSheet` actuellement. Décision :

- **`SavedAddressesSheet`** ([apps/web-client/src/app/[locale]/(screens)/products/checkout/infos/saved-addresses-sheet.tsx](apps/web-client/src/app/[locale]/(screens)/products/checkout/infos/saved-addresses-sheet.tsx)) : migrer pour utiliser le nouveau `MobileSheet` (consistance UX). La composition extérieure devient `<MobileSheet open={true} onOpenChange={onClose} title="Mes adresses">...</MobileSheet>`.
- **`KinnuBottomSheet`** ([apps/web-client/src/app/[locale]/(lab)/kinnu/_components/kinnu-bottom-sheet.tsx](apps/web-client/src/app/[locale]/(lab)/kinnu/_components/kinnu-bottom-sheet.tsx)) : migrer vers `<Drawer>` direct (pas via MobileSheet) car cas spécifique avec animations et structure non-standard. Plus de Framer Motion dans ce composant si CSS Base UI suffit ; sinon garder Framer pour les sous-composants animés (cartes, particules).

### 6.4 Risques globaux S4

- L'animation slide-in / slide-up actuelle utilise `animate-in slide-in-from-right` (Tailwind animation plugin). Base UI utilise des transitions CSS via `data-[starting-style]:` / `data-[ending-style]:`. Comportement visuel **proche mais pas pixel-perfect**. Vérification manuelle obligatoire.
- Les 55+ écrans `@modal` doivent être testés visuellement après S4.1 (au moins 5 représentatifs : login modal, project detail, profile settings, addresses, checkout).
- Si `Drawer` n'est pas wrappé dans core, le wrapper drawer.tsx doit être créé en début de sprint S4.

---

## 7. Stratégie de branche

Identique à la vague 1 :

```bash
git fetch origin
git worktree add -b feat/base-ui-vague-2 .worktrees/base-ui-vague-2 origin/main
cd .worktrees/base-ui-vague-2
pnpm install
```

**Avant chaque sprint Pn (n ≥ 1)** :
```bash
git fetch origin
git rebase origin/main
pnpm --filter @make-the-change/core test
pnpm --filter @make-the-change/web-client type-check
```

Si conflits avec une autre IA (codex), résoudre, re-tester.

---

## 8. Agents et outils par sprint

| Sprint | Implémenteur | Spec reviewer | Code quality reviewer | Justification |
|---|---|---|---|---|
| S1 Selects | **haiku** | haiku | haiku | Mécanique, 4 fichiers, pattern identique |
| S2 Accordions | **sonnet** | haiku | haiku | Animation CSS complexe (Safari `interpolate-size`), 3 fichiers |
| S3 Autocomplete | **sonnet** | sonnet | sonnet | 216 lignes à réécrire, logique async + portal + a11y |
| S4.1 FullScreenSlideModal | **sonnet** | sonnet | **opus** | Wrapper utilisé par 55+ écrans, scroll-elevation custom, animations sensibles |
| S4.2 MobileSheet | **sonnet** | haiku | sonnet | Wrapper avec Drawer + swipe gestures, modéré |
| S4.3 Sheets custom | **haiku** | haiku | haiku | 2 fichiers spécifiques, migration directe |

Verify skill (`/verify`) après chaque sprint S2, S3, S4 pour confirmer comportement visuel.

---

## 9. Risques et mitigations

| Risque | Mitigation |
|---|---|
| Régression visuelle sur l'animation slide-in modales | Sprint S4.1 inclut un test manuel sur 5 écrans représentatifs avant merge |
| Safari `interpolate-size: allow-keywords` non supporté → accordion `height: auto` casse | Tester Safari en S2 ; fallback : utiliser `max-height` ou hauteur fixée |
| Base UI Drawer pas encore wrappé dans core | Sprint S4.2 inclut une sous-tâche "vérifier/créer wrapper drawer.tsx" en premier |
| AddressAutocomplete : `useAutocompleteFilter` inadapté pour async | On ne l'utilise pas — on alimente directement `items` par fetch (pattern documenté dans S3) |
| `learn/courses/page.tsx` est un Server Component, `SimpleSelect` requiert client | Si Server Component, extraire le bloc filtres en Client Component dédié ; ou garder `<select>` natif (form GET fonctionne) |
| Codex bosse en parallèle sur des fichiers que nous touchons | Vague 1 a montré que rebase systématique avant chaque sprint résout. Découpage par fichier minimise les conflits. |
| 55+ écrans `@modal` impactés invisiblement par S4.1 | API publique inchangée, mais smoke test obligatoire sur 5 représentants : login modal, register modal, project detail intercepted, profile addresses, balance modal |

---

## 10. Critères de succès

1. **Zéro raw `<select>` HTML** comme contrôle de formulaire dans `apps/web-client/src/app` (sauf cas `learn/courses` Server Component où c'est intentionnel)
2. **Zéro accordion hand-rolled avec `useState` + Framer Motion** dans les 3 fichiers concernés — tous utilisent `<Accordion>` de core
3. **`AddressAutocompleteInput`** interne utilise `<Autocomplete>` de Base UI ; signature publique inchangée ; les 2 consommateurs (`checkout/infos`, `AddressFields`) ne changent pas
4. **`FullScreenSlideModal`** interne utilise `<Dialog>` ; signature publique inchangée ; ~55 écrans intercept fonctionnent
5. **`MobileSheet`** interne utilise `<Drawer>` ; swipe-to-dismiss disponible
6. **`SavedAddressesSheet`** utilise le nouveau `MobileSheet`
7. **`KinnuBottomSheet`** utilise `<Drawer>` direct
8. **Tests passent** : `pnpm --filter @make-the-change/core test` et `pnpm --filter @make-the-change/web-client type-check`
9. **Documentation** : section "Disclosure patterns" ajoutée à `docs/02-product/design-system/forms.md` (ou nouveau fichier `disclosure.md` si plus naturel)
10. **Vérifications manuelles** : `/fr/login` (modal), `/fr/products/checkout/infos` (country select + saved addresses sheet), `/fr/faq` (accordion), `/fr/projects/[slug]` (project detail modal + MobileSheets) ouverts et testés sur Chrome desktop + iOS Safari (au moins via DevTools mobile view)

---

## 11. Hors scope

- Tabs custom (`project-detail-tabs.tsx`) → vague 3
- Switch custom checkout (`infos-client.tsx` "Sauvegarder cette adresse") → vague 3
- NumberField (`quantity-stepper.tsx`, amount input contribute/support) → vague 3 ou jamais (custom particulier)
- RadioGroup (`experience-slot-picker.tsx`) → vague 3
- Slider range (`academy/.../page.tsx`) → vague 3
- Separators (15+ occurrences de border-t) → batch trivial à part
- Progress bars (Kinnu shield, funding goals) → vague 3
- `web-admin` et `app-mobile`
- Migration de Framer Motion vers autre animation lib (Framer reste utilisé par ailleurs)
- Refacto des `_components/_features` patterns Next.js
