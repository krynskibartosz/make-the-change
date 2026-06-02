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

- N'utilisez plus `<Input label="..." error="..." helpText="..." />` (API monolithique legacy). Cette forme est temporairement disponible sous le nom `LegacyInput` mais sera supprimée en P9.
- N'utilisez pas `react-hook-form` ou `useController` — la composition Field + native HTML validation couvre tous nos cas.
- Ne posez pas `<Input>` directement à côté de `<FieldLabel>` sans `<FieldControl render={<Input />}>` — sinon les data-attributes ne sont pas posés sur le bon élément DOM.
