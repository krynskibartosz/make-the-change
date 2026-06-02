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

```tsx
<Form action={formAction} errors={state.errors}>
  <Field.Root name="email">
    <Field.Label className="text-xs font-bold text-white/55">Email</Field.Label>
    <Input type="email" variant="ghost" size="lg" required />
    <Field.Error className="text-xs text-red-400/90" match="valueMissing">
      Email requis
    </Field.Error>
    <Field.Error className="text-xs text-red-400/90" match="typeMismatch">
      Format invalide
    </Field.Error>
    <Field.Error className="text-xs text-red-400/90" />
    {/* ↑ catch-all pour les erreurs serveur (Form.errors[name]) */}
  </Field.Root>
</Form>
```

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

### 4.1 `packages/core`

| Fichier | Action |
|---|---|
| `packages/core/src/shared/ui/base/input.tsx` | Réécriture complète (~40 lignes) |
| `packages/core/src/shared/ui/base/textarea.tsx` | Réécriture complète |
| `packages/core/src/shared/ui/base/input-variants.ts` | **Nouveau** — cva variants |
| `packages/core/src/shared/ui/base/password-input.tsx` | **Nouveau** — composable |
| `packages/core/src/shared/ui/base/__tests__/input.test.tsx` | Réécriture — tests des variants + composition Field |
| `packages/core/src/shared/ui/forms/form-input.tsx` | **Supprimé** |
| `packages/core/src/shared/ui/forms/field-shell.tsx` | **Supprimé** |
| `packages/core/src/shared/ui/forms/__tests__/field-shell.test.tsx` | **Supprimé** |
| `packages/core/src/shared/ui/forms/index.ts` | Retirer exports `FormInput`, `FieldShell` |
| `packages/core/src/shared/ui/index.ts` | Ajouter exports `inputVariants`, `textareaVariants`, `PasswordInput` |
| `packages/core/package.json` | Retirer `react-hook-form` |

### 4.2 `apps/web-client` — Server Actions

| Fichier | Action |
|---|---|
| `apps/web-client/src/lib/server-actions.ts` | **Nouveau** — type `ServerActionState` partagé |
| `apps/web-client/src/app/[locale]/(site)/contact/actions.ts` | Adapter au nouveau shape |
| `apps/web-client/src/app/[locale]/(auth)/actions.ts` | Adapter login/register/forgot |
| `apps/web-client/src/app/[locale]/(screens)/products/checkout/_features/checkout-actions.ts` | À vérifier |

### 4.3 `apps/web-client` — formulaires

| Fichier | Action |
|---|---|
| `(site)/contact/page.tsx` | Recomposer avec Field.Root + Input + Field.Error |
| `(auth)/_components/forgot-password-form.tsx` | Idem |
| `(auth)/_components/login-form.tsx` | Idem + PasswordInput |
| `(screens)/profile/settings/addresses/addresses-client.tsx` | Idem |
| `(screens)/profile/account/_features/account-client.tsx` | Idem |
| `(screens)/products/checkout/infos/infos-client.tsx` | Idem — validation custom passe sur `validate` de Field ou reste en server action |
| `(auth)/_components/register-form.tsx` | Idem (wizard 3-steps, sessionStorage et popstate conservés) |
| `(screens)/projects/[slug]/contribute/_components/project-contribute-one-flow.tsx` | Guest email uniquement |
| `(screens)/projects/[slug]/support/_components/project-support-one-flow.tsx` | Guest email uniquement |

---

## 5. Ordre des étapes (P0 → P8)

Petit → gros pour valider le pattern sur du simple avant d'attaquer le complexe.

| # | Étape | Fichier(s) clé | Pourquoi à ce moment |
|---|---|---|---|
| **P0** | Foundations core | `input.tsx`, `textarea.tsx`, `input-variants.ts`, `password-input.tsx`, suppression `form-input.tsx` + `field-shell.tsx`, retrait RHF | Bloque tout le reste |
| **P1** | Contact | `contact/page.tsx` + `contact/actions.ts` | POC du pattern complet (1 input + 1 textarea + server action errors) |
| **P2** | Forgot password | `forgot-password-form.tsx` | 1 input email |
| **P3** | Login | `login-form.tsx` + auth action | 2 inputs + PasswordInput |
| **P4** | Addresses | `addresses-client.tsx` | Plusieurs inputs sans flow particulier |
| **P5** | Account | `account-client.tsx` | Pattern "iOS-settings" particulier — bord transparent dans card |
| **P6** | Checkout infos | `infos-client.tsx` | 5 fields + validation custom (street/postal/city + autocomplete address validation API) |
| **P7** | Register wizard | `register-form.tsx` + auth action | Wizard 3 steps + sessionStorage + popstate à préserver |
| **P8** | Contribute + Support | Les deux `*-one-flow.tsx` | Petit changement (guest email) dans gros fichiers — on profite des patterns rodés |

Chaque étape :
1. Implémentation par subagent
2. Tests passent (`pnpm --filter @make-the-change/core test`)
3. Type-check passe (`pnpm --filter @make-the-change/web-client type-check`)
4. Spec compliance review (subagent)
5. Code quality review (subagent)
6. Commit

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
| P0 Foundations | **sonnet** | sonnet | sonnet | Refacto multi-fichiers, suppression de modules, cohérence type cross-package |
| P1 Contact | **sonnet** | haiku | haiku | POC du pattern — investir sur l'implémenteur, reviews simples ensuite |
| P2 Forgot password | **haiku** | haiku | haiku | Mécanique pure, 1 input |
| P3 Login | **sonnet** | haiku | haiku | Auth action à adapter (login part) + PasswordInput |
| P4 Addresses | **haiku** | haiku | haiku | Mécanique |
| P5 Account | **haiku** | haiku | haiku | Mécanique mais style particulier — vérifier visuellement après |
| P6 Checkout infos | **sonnet** | sonnet | sonnet | Validation custom + autocomplete API + 5 fields couplés |
| P7 Register wizard | **sonnet** | sonnet | sonnet | sessionStorage + popstate + 3 steps — préserver le state machine |
| P8 Contribute + Support | **haiku** | haiku | haiku | Petit changement dans gros fichier |

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
| Autofill Safari/Chrome casse le texte blanc en ghost (perte du hack `WebkitTextFillColor`) | Test manuel explicite en P3 (login) — si problème, ajouter une CSS rule globale `input:-webkit-autofill { -webkit-text-fill-color: white }` ciblée sur `.input-ghost` |
| `register-form` wizard : la migration peut casser sessionStorage / popstate | P7 inclut un test manuel : remplir step 1, recharger, vérifier que step 1 est restauré. Faire avant et après. |
| Le pattern Field + native validation perd la validation custom de `infos-client` (validation d'adresse server-side via API) | P6 conserve la validation custom en utilisant `validate` prop de `Field.Root` côté async, OU laisse la logique custom au-dessus du Form (state machine `ValidationPhase` reste) |
| Une autre IA push sur main pendant qu'on travaille | Worktree isolé + rebase systématique avant chaque étape (section 6.2) |
| Les tests `field-shell.test.tsx` disparaissent — perte de couverture | Le nouveau test `input.test.tsx` couvre les variants + un test de composition avec Field couvre le câblage |
| Les tests `theme-builder.snapshot.test.tsx` peuvent re-bouger | Mettre à jour le snapshot dans le même commit que P0 |

---

## 9. Critères de succès

À la fin du plan :

1. **Zéro `<input>` ou `<textarea>` HTML brut comme champ de formulaire dans `apps/web-client`** (sauf inputs hidden et l'amount input custom du contribute/support).
2. **Zéro usage de la prop `label`/`error`/`helpText` sur `Input`** dans `apps/web-client` — la composition Field est utilisée partout.
3. **`react-hook-form` n'est plus une dépendance de `packages/core`** (`grep -r "react-hook-form" packages/core/package.json` → vide).
4. **Tous les tests passent** : `pnpm --filter @make-the-change/core test` (36+ tests) et `pnpm --filter @make-the-change/web-client type-check`.
5. **Le formulaire de contact envoie un vrai message** (à wirer dans P1 — pas juste console.log, mais via Resend ou équivalent. Si l'intégration email n'est pas dispo, on garde le TODO mais le shape `errors` est correct).
6. **Le wizard register fonctionne identique à avant** (sessionStorage + popstate préservés, 3 steps validables).
7. **Les erreurs serveur s'affichent automatiquement sous les champs concernés** sans code de câblage explicite côté composant.

---

## 10. Hors scope

- `web-admin` et `app-mobile`.
- Migration du composant `Select` (utilisé en checkout/courses/ecosystem). Sera un plan séparé.
- Migration du composant `Checkbox` / `Radio` / `Slider` (déjà composables, pas urgent).
- Refacto du formulaire de contact backend (intégration email réelle) — peut être TODO.
- Ajout de nouveaux composants type `OTP Field`, `Combobox` (existent dans Base UI 1.5 mais pas utilisés ici).
