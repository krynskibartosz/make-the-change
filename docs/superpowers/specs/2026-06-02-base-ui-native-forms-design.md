# Base UI native forms — refacto web-client

**Date:** 2026-06-02
**Scope:** `apps/web-client` + composants forms dans `packages/core`
**Effort estimé:** 9 étapes incrémentales, ~2 semaines

---

## 1. Contexte

Le code actuel utilise `@base-ui/react` mais à la manière d'un design system "Material UI v4" : un composant `Input` monolithique avec props agrégées (`label`, `error`, `helpText`, `leadingIcon`, `showPasswordToggle`...) doublé d'un `FormInput` qui ajoute `react-hook-form`. Cette approche :

- **Bypasse la constraint validation API native** que Base UI Field utilise via les data-attributes (`data-touched`, `data-dirty`, `data-valid`, `data-filled`).
- **Réinvente la gestion de validation** (état `touched` manuel, objet `errors` calculé à la main dans chaque écran — voir `infos-client.tsx` lignes 43-57).
- **Rate l'intégration native Server Actions** (`<Form action={formAction} errors={state.errors}>`) qui câble automatiquement les erreurs serveur sur `Field.Error`.
- **Empile RHF par-dessus** un système de validation déjà fourni par Base UI Field.

Cette refacto migre les formulaires de `web-client` vers le pattern Base UI 2026 :
`<Form action={formAction} errors={state.errors}><Field.Root name="..."><Field.Label /><Input /><Field.Error /></Field.Root></Form>`.

`web-admin` et `app-mobile` ne sont pas touchés. `react-hook-form` est retiré du package `core`.

---

## 2. Architecture cible

Trois unités avec une responsabilité unique :

### 2.1 `Input` (et `TextArea`) — wrapper de styling uniquement

Devient un passthrough sur `@base-ui/react/input` avec uniquement les responsabilités styling :

```tsx
// packages/core/src/shared/ui/base/input.tsx
'use client'
import { Input as InputPrimitive, type InputProps as PrimitiveProps } from '@base-ui/react/input'
import { forwardRef } from 'react'
import { cn } from '../utils'
import { inputVariants, type InputVariantProps } from './input-variants'

export type InputProps = PrimitiveProps & InputVariantProps

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

Plus de label, error, helpText, leadingIcon, trailingIcon, showPasswordToggle, shake, WebkitTextFillColor variant-aware. Ces responsabilités migrent vers la composition.

#### Stratégie de coexistence — pas de breaking change intermédiaire

Si on remplaçait `Input` directement, les 4 fichiers qui utilisent l'API monolithique aujourd'hui (`login-form.tsx`, `register-form.tsx`, `forgot-password-form.tsx`, `theme-selection.tsx`) casseraient le type-check entre P0 et leur migration respective.

**Pattern adopté :** le même fichier `input.tsx` exporte les deux composants pendant la transition :

```tsx
// P0 — input.tsx contient :
// 1. Le NOUVEAU Input (minimaliste, code ci-dessus)
export const Input = forwardRef<HTMLInputElement, InputProps>(...)

// 2. L'ANCIEN Input renommé LegacyInput (code actuel inchangé)
export const LegacyInput = forwardRef<HTMLInputElement, LegacyInputProps>(...)
// Avec label, error, helpText, leadingIcon, showPasswordToggle, WebkitTextFillColor, etc.

// 3. PasswordInput legacy reste (utilise LegacyInput en interne)
export const LegacyPasswordInput = ...
```

Au moment de chaque migration `Pn`, l'`import { Input }` du fichier devient `import { LegacyInput as Input }` **avant** la migration, puis on remplace progressivement par la nouvelle composition Field + nouveau `Input`. Dernière étape **P9 (cleanup)** : supprime `LegacyInput` et `LegacyPasswordInput`.

Cette stratégie garantit que `pnpm type-check` passe à chaque étape.

### 2.2 `inputVariants` / `textareaVariants` — fonctions cva

```tsx
// packages/core/src/shared/ui/base/input-variants.ts
import { cva, type VariantProps } from 'class-variance-authority'

export const inputVariants = cva(
  'flex w-full rounded-2xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-background/70 backdrop-blur-sm border border-[hsl(var(--border)/0.8)] shadow-sm text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-primary/30 focus-visible:border-primary/70',
        outlined:
          'bg-transparent border-2 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-primary/30',
        filled:
          'bg-muted/70 backdrop-blur-sm border shadow-sm text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-primary/30',
        ghost:
          'bg-white/[0.04] border border-white/10 text-white placeholder:text-white/25 focus-visible:ring-lime-300/30 focus-visible:border-lime-300/50',
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
```

`textareaVariants` est analogue avec `min-h-[100px]` au lieu de hauteurs fixes.

L'erreur (border rouge, ring rouge) est appliquée par **Base UI Field via les data-attributes** : on ajoute dans `inputVariants` une règle Tailwind ciblée :

```
data-[invalid]:border-destructive data-[invalid]:ring-destructive/30
```

Pas besoin de prop `error` sur `Input` — Field décore automatiquement.

**Autofill Safari/Chrome pour ghost.** L'autofill repeint le glyphe via `-webkit-text-fill-color`. Plutôt qu'un hack JS, on règle ça dans la cva via un sélecteur arbitrary Tailwind 4 directement dans la variant `ghost` :

```
[&:-webkit-autofill]:[-webkit-text-fill-color:white] [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s]
```

À ajouter dans la chaîne de la variant `ghost` de `inputVariants`. Les autres variants gardent `var(--foreground)` via un sélecteur équivalent. Pas de prop `style` runtime, pas de prop `variant` à propager par les composants consommateurs.

### 2.3 `PasswordInput` — petit composable

```tsx
// packages/core/src/shared/ui/base/password-input.tsx
'use client'
import { Eye, EyeOff } from 'lucide-react'
import { forwardRef, useState } from 'react'
import { Input, type InputProps } from './input'

export const PasswordInput = forwardRef<HTMLInputElement, Omit<InputProps, 'type'>>(
  ({ className, ...props }, ref) => {
    const [visible, setVisible] = useState(false)
    return (
      <div className="relative">
        <Input ref={ref} type={visible ? 'text' : 'password'} className={`pr-12 ${className ?? ''}`} {...props} />
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

### 2.4 Composition côté consommateur

**Pattern canonique — Field.Control est le contrôle déclaré.** Base UI suit la doc 1.5 : `Field.Control` (par défaut un `<input>`) est l'élément que Field surveille pour appliquer `data-touched`, `data-invalid`, `data-filled`, `aria-describedby`. On le remplace par notre `<Input>` styled via la prop `render` :

```tsx
<Form action={formAction} errors={state.errors}>
  <Field.Root name="email">
    <Field.Label className="text-xs font-bold text-white/55">Email</Field.Label>
    <Field.Control
      render={<Input variant="ghost" size="lg" />}
      type="email"
      required
    />
    <Field.Error className="text-xs text-red-400/90" match="valueMissing">
      Email requis
    </Field.Error>
    <Field.Error className="text-xs text-red-400/90" match="typeMismatch">
      Format invalide
    </Field.Error>
    <Field.Error className="text-xs text-red-400/90" />
    {/* ↑ catch-all : affiche Form.errors[name] s'il existe (server error) */}
  </Field.Root>
</Form>
```

Pourquoi `render={<Input />}` et pas `<Input>` à côté de `<Field.Label>` :
- Sans `Field.Control`, Field ne sait pas quel élément DOM décorer avec les data-attributes — l'`aria-describedby` ne pointe sur rien, l'`aria-invalid` n'est pas posé sur l'input, la border `data-[invalid]:` ne réagit pas.
- `Field.Control render={<Input />}` fusionne les props : notre `<Input>` reçoit `id`, `aria-describedby`, `aria-invalid`, `data-*` automatiquement.
- Les attributs `type`, `required`, `pattern`, `minLength` sont placés sur `Field.Control` (pas sur `<Input>`) pour que la validation HTML soit pilotée par Field.

**TextArea suit le même pattern** avec `Field.Control render={<TextArea variant="ghost" rows={4} />}`.

### 2.5 Validation custom asynchrone — `validate` prop

Pour les champs qui nécessitent une validation au-delà des contraintes HTML (par exemple l'autocomplete d'adresse du checkout qui appelle `/api/address-validate`), on utilise `validate` sur `Field.Root` :

```tsx
<Field.Root
  name="street"
  validationMode="onBlur"
  validate={async (value) => {
    if (typeof value !== 'string' || value.trim().length < 4) {
      return 'Adresse trop courte'
    }
    const result = await fetch('/api/address-validate', {
      method: 'POST',
      body: JSON.stringify({ street: value, country, postalCode, city }),
    }).then((r) => r.json())
    return result.status === 'invalid' ? 'Adresse non reconnue' : null
  }}
>
  <Field.Label>Rue et numéro</Field.Label>
  <Field.Control render={<Input variant="ghost" />} />
  <Field.Error /> {/* affiche la string retournée par validate */}
</Field.Root>
```

- Retourner `null` ou `undefined` = champ valide.
- Retourner une `string` = message d'erreur affiché dans `Field.Error`.
- `validationMode="onBlur"` évite de spammer l'API à chaque keystroke. `"onSubmit"` valide seulement au submit.

---

## 3. Contrat des Server Actions

### 3.1 Nouveau shape de retour

```ts
// shared type — à créer dans apps/web-client/src/lib/server-actions.ts
export type ServerActionState = {
  success?: boolean
  errors?: Record<string, string>  // key = Field.Root name
  formError?: string                // erreur globale, hors champ spécifique
  redirectUrl?: string              // si l'action redirige
}
```

### 3.2 Pattern de Server Action

```ts
'use server'
import type { ServerActionState } from '@/lib/server-actions'

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

  try {
    await sendEmail({ to: SUPPORT_EMAIL, from: email, body: message })
    return { success: true }
  } catch {
    return { formError: 'Envoi impossible pour le moment. Réessaie plus tard.' }
  }
}
```

### 3.3 Câblage côté client

```tsx
const [state, formAction, isPending] = useActionState<ServerActionState, FormData>(
  sendContactMessage,
  {},
)

<Form action={formAction} errors={state.errors}>
  {state.formError && <p role="alert" className="text-sm text-red-400">{state.formError}</p>}
  {/* champs */}
</Form>
```

`<Form errors={state.errors}>` pousse `state.errors.email` sur le `<Field.Error />` du `<Field.Root name="email">` automatiquement. Quand l'utilisateur modifie le champ, l'erreur disparaît (comportement Base UI natif).

---

## 4. Fichiers touchés

### 4.1 `packages/core` — au moment de P0

| Fichier | Action |
|---|---|
| `packages/core/src/shared/ui/base/input.tsx` | **Modifié** — l'ancien `Input` est renommé `LegacyInput`, ses exports `PasswordInput` deviennent `LegacyPasswordInput`. Le nouveau `Input` minimaliste est ajouté dans le même fichier. |
| `packages/core/src/shared/ui/base/textarea.tsx` | **Modifié** — `TextArea` renommé `LegacyTextArea`, nouveau `TextArea` minimaliste ajouté. |
| `packages/core/src/shared/ui/base/input-variants.ts` | **Nouveau** — cva `inputVariants`, `textareaVariants`, et leurs types `InputVariantProps`/`TextAreaVariantProps`. |
| `packages/core/src/shared/ui/base/password-input.tsx` | **Nouveau** — composable basé sur le nouveau `Input`. |
| `packages/core/src/shared/ui/base/__tests__/input.test.tsx` | **Réécrit** — voir section 4.4 Tests. |
| `packages/core/src/shared/ui/forms/form-input.tsx` | **Supprimé** (RHF retiré). |
| `packages/core/src/shared/ui/forms/field-shell.tsx` | **Supprimé** (composition Field directement utilisée). |
| `packages/core/src/shared/ui/forms/__tests__/field-shell.test.tsx` | **Supprimé**. |
| `packages/core/src/shared/ui/forms/index.ts` | Retirer exports `FormInput`, `FieldShell`. |
| `packages/core/src/shared/ui/index.ts` | Ajouter exports `Input`, `TextArea`, `PasswordInput`, `LegacyInput`, `LegacyTextArea`, `LegacyPasswordInput`, `inputVariants`, `textareaVariants`. |
| `packages/core/package.json` | Retirer `react-hook-form` des dependencies. |

### 4.2 `packages/core` — au moment de P9 (cleanup final)

| Fichier | Action |
|---|---|
| `packages/core/src/shared/ui/base/input.tsx` | Supprimer `LegacyInput` et `LegacyPasswordInput`. |
| `packages/core/src/shared/ui/base/textarea.tsx` | Supprimer `LegacyTextArea`. |
| `packages/core/src/shared/ui/index.ts` | Retirer exports `LegacyInput`, `LegacyTextArea`, `LegacyPasswordInput`. |

### 4.3 `apps/web-client` — Server Actions

| Fichier | Action |
|---|---|
| `apps/web-client/src/lib/server-actions.ts` | **Nouveau** — type `ServerActionState` partagé |
| `apps/web-client/src/app/[locale]/(site)/contact/actions.ts` | Adapter au nouveau shape |
| `apps/web-client/src/app/[locale]/(auth)/actions.ts` | Adapter login/register/forgot |
| `apps/web-client/src/app/[locale]/(screens)/products/checkout/_features/checkout-actions.ts` | À vérifier |

### 4.4 `apps/web-client` — formulaires

| Fichier | Action |
|---|---|
| `(site)/contact/page.tsx` | Recomposer avec Field.Root + Field.Control render={<Input/>} + Field.Error |
| `(auth)/_components/forgot-password-form.tsx` | Idem |
| `(auth)/_components/login-form.tsx` | Idem + PasswordInput |
| `(screens)/profile/settings/addresses/addresses-client.tsx` | Idem |
| `(screens)/profile/account/_features/account-client.tsx` | Idem |
| `(screens)/products/checkout/infos/infos-client.tsx` | Idem — validation custom via `validate` prop de Field (section 2.5) |
| `(auth)/_components/register-form.tsx` | Idem — wizard 3-steps conservé (voir 4.6 ci-dessous) |
| `(screens)/projects/[slug]/contribute/_components/project-contribute-one-flow.tsx` | Guest email uniquement |
| `(screens)/projects/[slug]/support/_components/project-support-one-flow.tsx` | Guest email uniquement |

### 4.5 Documentation

| Fichier | Action |
|---|---|
| `docs/02-product/design-system/forms.md` | **Nouveau** — guide du pattern `<Form errors><Field.Root><Field.Label><Field.Control render={<Input/>}/><Field.Error/></Field.Root></Form>` avec exemples (server action shape, validation custom, password input, autofill). Écrit dans P0. |

### 4.6 Wizard register — décision architecturale

Le `register-form.tsx` actuel a 3 steps. Décision retenue : **un seul `<Form action={formAction}>` enveloppant les 3 steps**.

- Les boutons "Suivant" des steps 1 et 2 sont `<button type="button" onClick={() => goToStep(step+1)}>`. Ils ne soumettent pas le form.
- Le bouton "S'inscrire" du step 3 est `<button type="submit">`. Il déclenche `formAction`.
- Tous les `<Field.Root name="...">` sont présents dans le DOM aux 3 steps (steps 1-2 cachés visuellement avec `hidden` ou rendu conditionnel avec `display: none` pour conserver le state).
- `canProceed` local valide les contraintes minimales avant `goToStep(step+1)` — Field native validation gère le reste au submit final.
- `sessionStorage` persistance et `popstate` listener restent inchangés.

Cette stratégie évite 3 `<form>` séparés qui exigeraient 3 server actions distinctes.

### 4.7 Tests à livrer en P0

`packages/core/src/shared/ui/base/__tests__/input.test.tsx` couvre 5 scénarios :

1. **Variants produisent les bonnes classes** : `inputVariants({ variant: 'ghost' })` contient `bg-white/[0.04]`, `text-white`.
2. **Composition Field passe data-attributes** : rendu `<Field.Root name="x"><Field.Control render={<Input/>} required /></Field.Root>`, blur sans valeur → l'input reçoit `data-touched` et `data-invalid`, et `aria-invalid="true"`.
3. **Field.Label associe correctement** : `<Field.Label>` rendu avec `for` correspondant à `id` de l'input.
4. **Form errors câble Field.Error** : rendu `<Form errors={{ email: 'X' }}><Field.Root name="email"><Field.Control /><Field.Error /></Field.Root></Form>` affiche "X".
5. **`validate` async retourne string → Field.Error affiche** : rendu avec `validate={async () => 'nope'}`, blur du champ, attendre, vérifier que "nope" est rendu.

Tests réécrits, pas migrés de l'ancien `input.test.tsx` (qui testait l'API monolithique label/error/helpText).

---

## 5. Ordre des étapes (P0 → P9)

Petit → gros pour valider le pattern sur du simple avant d'attaquer le complexe. Coexistence `LegacyInput` + `Input` pendant P1-P8, cleanup en P9.

| # | Étape | Fichier(s) clé | Pourquoi à ce moment |
|---|---|---|---|
| **P0** | Foundations core | `input.tsx` (split Legacy/new), `textarea.tsx` (split), `input-variants.ts`, `password-input.tsx`, suppression `form-input.tsx` + `field-shell.tsx`, retrait RHF, doc `forms.md` | Bloque tout le reste. `LegacyInput` reste exporté pour ne pas casser P1-P8. |
| **P1** | Contact | `contact/page.tsx` + `contact/actions.ts` | POC du pattern complet (1 input + 1 textarea + server action errors) |
| **P2** | Forgot password | `forgot-password-form.tsx` + auth action partie forgot | 1 input email. Premier formulaire auth migré. |
| **P3** | Login | `login-form.tsx` + auth action partie login | 2 inputs + PasswordInput |
| **P4** | Addresses | `addresses-client.tsx` | Plusieurs inputs sans flow particulier |
| **P5** | Account | `account-client.tsx` | Pattern "iOS-settings" particulier — bord transparent dans card |
| **P6** | Checkout infos | `infos-client.tsx` | 5 fields + validation custom (street/postal/city + autocomplete address validation API via `validate` prop) |
| **P7** | Register wizard | `register-form.tsx` + auth action partie register | Wizard 3 steps + sessionStorage + popstate (voir section 4.6) |
| **P8** | Contribute + Support | Les deux `*-one-flow.tsx` | Petit changement (guest email) dans gros fichiers — on profite des patterns rodés |
| **P9** | Cleanup Legacy | Suppression `LegacyInput`, `LegacyTextArea`, `LegacyPasswordInput` du core + exports | Aucun usage restant — verrouille la migration. |

Chaque étape :
1. **Avant** : `git fetch origin && git rebase origin/main` (sync avec autre IA)
2. Implémentation par subagent
3. Tests passent : `pnpm --filter @make-the-change/core test`
4. Type-check passe : `pnpm --filter @make-the-change/web-client type-check`
5. Spec compliance review (subagent)
6. Code quality review (subagent)
7. Commit
8. Verify manuel (`verify` skill) pour P1, P3, P6, P7

**Critère d'entrée pour P9** : `grep -r "Legacy\(Input\|TextArea\|PasswordInput\)" apps/` retourne zéro résultat.

---

## 6. Stratégie de branche (collaboration multi-IA)

Le risque est qu'une autre IA modifie `main` pendant la refacto. On l'isole proprement.

### 6.1 Worktree dédié

Au démarrage :

```bash
git fetch origin
git worktree add -b feat/base-ui-native-forms .worktrees/base-ui-native-forms origin/main
cd .worktrees/base-ui-native-forms
```

Toutes les étapes se font dans ce worktree. Le worktree principal (`repo-propre5`) reste libre pour l'autre IA.

Le skill `superpowers:using-git-worktrees` couvre ce flow et est invoqué au démarrage du plan.

### 6.2 Synchronisation en cours de route

**Avant chaque étape Pn (n ≥ 1)** :

```bash
git fetch origin
git log HEAD..origin/main --oneline   # voir ce que l'autre IA a poussé
```

- **Si aucune commit sur `origin/main`** : continuer.
- **Si commits sur `origin/main`** : `git rebase origin/main`. Résoudre les conflits éventuels. Re-run tests + type-check avant de poursuivre.
- **Si conflit sur un fichier qu'on s'apprête à toucher dans l'étape suivante** : reprendre les changements de l'autre IA d'abord, puis appliquer notre étape par-dessus.

### 6.3 Verrou implicite via découpage

Le découpage P0-P8 est conçu pour minimiser les zones de conflit :

- **P0 ne touche que `packages/core`.** Si l'autre IA travaille sur `apps/web-client`, zéro conflit.
- **P1-P8 touchent chacune 1-2 fichiers d'`apps/web-client`.** Les conflits sont possibles mais localisés.

### 6.4 Merge final

À la fin :

```bash
cd ../.. # retour au worktree principal
git fetch origin
git checkout main
git pull
git merge feat/base-ui-native-forms
# si conflits → résoudre, re-tester
git push origin main
git worktree remove .worktrees/base-ui-native-forms
git branch -d feat/base-ui-native-forms
```

---

## 7. Agents et outils par étape

Le plan utilise `superpowers:subagent-driven-development` pour orchestrer. Chaque étape dispatche un implémenteur + deux reviewers (spec + code quality).

### 7.1 Modèles recommandés par étape

| Étape | Implémenteur | Spec reviewer | Code quality reviewer | Justification |
|---|---|---|---|---|
| P0 Foundations | **sonnet** | sonnet | sonnet | Refacto multi-fichiers, split Legacy/new, suppression modules RHF, doc à écrire, tests à réécrire |
| P1 Contact | **sonnet** | haiku | haiku | POC du pattern complet — investir sur l'implémenteur, reviews simples ensuite |
| P2 Forgot password | **haiku** | haiku | haiku | Mécanique pure, 1 input |
| P3 Login | **sonnet** | haiku | haiku | Auth action à adapter (login part) + PasswordInput + autofill à vérifier |
| P4 Addresses | **haiku** | haiku | haiku | Mécanique |
| P5 Account | **haiku** | haiku | haiku | Mécanique mais style particulier — vérifier visuellement après |
| P6 Checkout infos | **sonnet** | sonnet | **opus** | Validation custom async via `validate` prop + autocomplete API + 5 fields couplés. Opus en code-review pour traquer les régressions sur la state machine ValidationPhase. |
| P7 Register wizard | **sonnet** | sonnet | sonnet | sessionStorage + popstate + 3 steps — préserver le state machine. Décision archi en 4.6 est explicite. |
| P8 Contribute + Support | **haiku** | haiku | haiku | Petit changement dans gros fichier |
| P9 Cleanup Legacy | **haiku** | haiku | haiku | Suppression mécanique. Test : `pnpm type-check` doit passer après suppression. |

### 7.2 Outils

- **Implémentation** : `general-purpose` subagent type pour P0/P3/P6/P7 (multi-fichiers, judgment), `haiku` standalone via subagent pour les étapes mécaniques.
- **Reviews** : `feature-dev:code-reviewer` pour spec compliance ET code quality.
- **Verification UI manuelle** : `verify` skill après P1, P3, P7 (les flows visibles). Pour les autres : pas obligatoire si tests + type-check passent, mais recommandé pour P6.
- **Tests** : `pnpm --filter @make-the-change/core test` après P0. `pnpm --filter @make-the-change/web-client type-check` après chaque étape.

### 7.3 Skills à invoquer

- **Démarrage du plan** : `superpowers:using-git-worktrees` pour créer le worktree.
- **Exécution** : `superpowers:subagent-driven-development` pour orchestrer chaque tâche avec ses reviewers.
- **Fin du plan** : `superpowers:finishing-a-development-branch` pour merge + cleanup worktree.
- **Optionnel pendant** : `verify` après les étapes UI sensibles (P1, P3, P6, P7).

---

## 8. Risques et mitigations

| Risque | Mitigation |
|---|---|
| Autofill Safari/Chrome casse le texte blanc en ghost (perte du hack `WebkitTextFillColor`) | Sélecteur arbitrary Tailwind 4 dans la variant ghost de `inputVariants` (section 2.2). Test manuel explicite en P3 (login) sur Chrome + Safari avec un compte sauvegardé. |
| `register-form` wizard : la migration peut casser sessionStorage / popstate | Décision architecturale tranchée (section 4.6) : un seul `<Form>` enveloppant les 3 steps. P7 inclut un test manuel : remplir step 1, recharger, vérifier que step 1 est restauré. Faire avant et après. |
| Validation custom de `infos-client` (validation d'adresse server-side via API) ne s'adapte pas naturellement à `validate` prop | Pattern documenté en section 2.5 avec exemple async. La state machine `ValidationPhase` actuelle disparait — `validate` + `Field.Error` la remplacent. P6 spec reviewer doit confirmer parité fonctionnelle. |
| Une autre IA push sur main pendant qu'on travaille | Worktree isolé + rebase systématique avant chaque étape (section 6.2). Découpage des étapes par fichier minimise les conflits (section 6.3). |
| Les tests `field-shell.test.tsx` disparaissent — perte de couverture | Le nouveau `input.test.tsx` couvre 5 scénarios incluant la composition Field (section 4.7). FieldShell n'a plus de raison d'être. |
| Les tests `theme-builder.snapshot.test.tsx` peuvent re-bouger | Mettre à jour le snapshot dans le même commit que P0 si besoin. |
| Migration partielle entre P0 et P9 — code mixte avec `Input` et `LegacyInput` côte à côte | Critère d'entrée P9 (`grep "Legacy" apps/` = 0) verrouille la complétude. Pendant la transition, ESLint peut warn sur imports `LegacyInput` (optionnel). |
| Le pattern `Field.Control render={<Input/>}` propage `id`/`aria-*` mais l'`<Input>` doit forward `ref` et tous les props sans filtre | Le nouveau `Input` utilise `forwardRef` et `{...props}` strict. Test #2 de section 4.7 vérifie le câblage `aria-invalid` automatique. |

---

## 9. Critères de succès

À la fin du plan (après P9) :

1. **Zéro `<input>` ou `<textarea>` HTML brut comme champ de formulaire dans `apps/web-client`** (sauf inputs hidden et l'amount input custom du contribute/support).
2. **Zéro usage des composants `LegacyInput`/`LegacyTextArea`/`LegacyPasswordInput`** anywhere — `grep -r "Legacy\(Input\|TextArea\|PasswordInput\)"` retourne 0.
3. **`react-hook-form` n'est plus une dépendance de `packages/core`** (`grep "react-hook-form" packages/core/package.json` → vide).
4. **Tous les tests passent** : `pnpm --filter @make-the-change/core test` (36+ tests, dont 5 nouveaux pour Input/Field/Form composition) et `pnpm --filter @make-the-change/web-client type-check`.
5. **Le formulaire de contact envoie un vrai message** (à wirer dans P1 — pas juste console.log, mais via Resend ou équivalent. Si l'intégration email n'est pas dispo en P1, on garde le TODO mais le shape `errors` est correct).
6. **Le wizard register fonctionne identique à avant** (sessionStorage + popstate préservés, 3 steps validables).
7. **Les erreurs serveur s'affichent automatiquement sous les champs concernés** via `<Form errors={state.errors}>` sans code de câblage explicite côté composant.
8. **Le pattern est documenté** : `docs/02-product/design-system/forms.md` existe et couvre composition Field, server action shape, validation custom, password input, gestion autofill.
9. **L'accessibilité est confirmée** : sur un formulaire migré (login ou contact), `axe-core` (ou inspection manuelle) montre `aria-invalid`, `aria-describedby`, `aria-required` correctement câblés sans code applicatif explicite — c'est Field qui les pose.

---

## 10. Hors scope

- `web-admin` et `app-mobile`.
- Migration du composant `Select` (utilisé en checkout/courses/ecosystem). Sera un plan séparé.
- Migration du composant `Checkbox` / `Radio` / `Slider` (déjà composables, pas urgent).
- Refacto du formulaire de contact backend (intégration email réelle) — peut être TODO.
- Ajout de nouveaux composants type `OTP Field`, `Combobox` (existent dans Base UI 1.5 mais pas utilisés ici).
