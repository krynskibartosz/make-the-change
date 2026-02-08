# Prompt a donner a une autre IA - Playwright E2E (apps/web-client)

Tu es une IA dans le repo local :
`/Users/bartoszkrynski/Downloads/Development/make-the-change`

## Objectif
Rendre fonctionnels des tests Playwright E2E qui pilotent le navigateur pour :
- Aller sur des pages precises
- Cliquer sur des liens
- Ouvrir le login, se connecter
- Aller sur une page produit, ajouter au panier
- Aller jusqu au checkout et finaliser
- Investissement avec Stripe (flow investissement)

Tu dois **rendre les tests fiables et automatiques** et fournir un rapport final.

## Contexte technique (repo)
- App cible : `apps/web-client` (Next.js 16, port 3001)
- Scripts :
  - `pnpm --filter @make-the-change/web-client test:e2e`
  - `pnpm --filter @make-the-change/web-client test:e2e:ui`
  - `pnpm --filter @make-the-change/web-client test:e2e:headed`
- Config Playwright : `apps/web-client/playwright.config.ts`
  - `PLAYWRIGHT_BASE_URL` = `http://localhost:3001` par defaut
  - `webServer.command` = `pnpm dev`
- Tests existants :
  - `e2e/auth.setup.ts` : login + storage state
  - `e2e/specs/commerce-flow.spec.ts` : product -> cart -> checkout
  - `e2e/specs/investment-flow.spec.ts` : investissement avec Stripe
  - `e2e/seed/*` : seeding
- Fixtures :
  - `e2e/fixtures/env.ts` lit `process.env`
  - `e2e/fixtures/supabase.ts` utilise Supabase anon + service role
- Locale : `fr` par defaut, routes en `/fr/...` (voir `withLocale()`)

## Regles Playwright (best practices)
1. Priorite aux locators user-facing : `getByRole()` + `name`
2. Pour des inputs, preferer `getByLabel()` SI label HTML accessible existe.
3. Si pas de label : **ajouter des labels accessibles dans le UI** plutot que baser les tests sur les placeholders.
4. `getByPlaceholder()` uniquement en dernier recours.
5. Si besoin, ajouter `data-testid` pour stabilite.

## Etapes a suivre (detaillees)

### 1) Installer deps et Playwright
- `pnpm install`
- `pnpm --filter @make-the-change/web-client exec playwright install chromium`

### 2) Variables d environnement (apps/web-client/.env.local)
Ajouter / verifier :
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=

E2E_USER_EMAIL=
E2E_USER_PASSWORD=
E2E_LOCALE=fr
PLAYWRIGHT_BASE_URL=http://localhost:3001
```

Notes :
- `SUPABASE_SERVICE_ROLE_KEY` est requis pour les points (commerce-flow). Si absent, le test log un warning et saute le top-up.
- Ne jamais committer les secrets.

### 3) Compte E2E
Creer ou identifier un compte Supabase Auth :
- Email + password deterministes.
- Email confirme (email_confirm = true).

Option (via Supabase admin API) :
- utiliser `auth.admin.createUser({ email, password, email_confirm: true })`
- puis renseigner `E2E_USER_EMAIL` et `E2E_USER_PASSWORD`

### 4) Donnees necessaires
Les tests attendent des donnees existantes :
- `public_projects` (pour investissement)
- `public_products` (pour commerce)

Si vide :
- seed via scripts si existants
- ou inserer manuellement dans Supabase

### 5) Stripe (investment flow)
- Utiliser des cles test `pk_test_...` et `sk_test_...`
- Carte de test : 4242 4242 4242 4242
- Si besoin de webhooks :
  - `stripe listen --forward-to localhost:3001/api/webhooks/stripe`

### 6) Verifier accesibilite UI (important)
Si un test echoue sur un champ :
- Verifier que chaque input a un vrai label HTML (`<label for=...>`)
- Ajouter `aria-label` si pas de label visuel
- Exemple ideal :
```html
<label for="password">Mot de passe</label>
<input id="password" name="password" type="password" />
```
Et Playwright :
```ts
await page.getByLabel(/mot de passe/i).fill(password)
```

### 7) Lancer les tests
- `pnpm --filter @make-the-change/web-client test:e2e`
- Debug : `pnpm --filter @make-the-change/web-client test:e2e:headed`
- Inspecter : `pnpm --filter @make-the-change/web-client test:e2e:ui`
- Pour debug lent : `PWDEBUG=1 pnpm --filter @make-the-change/web-client test:e2e`

### 8) Livrables attendus
A la fin, fournir :
1. Valeurs des variables d env (redacter secrets si besoin)
2. Email + password du compte E2E
3. Confirmation que le serveur 3001 tourne et que Playwright est OK
4. Resultats des tests (pass/fail, logs utiles)
5. Changements de code proposes (avec fichiers et raisons)

## Important
- Ne pas lancer les tests en boucle sans expliquer le blocage.
- Prioriser une analyse claire avant de reessayer.
- Respecter les best practices Playwright pour les locators.
