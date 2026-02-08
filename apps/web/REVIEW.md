# Revue approfondie – apps/web

> Revue du **5 février 2025** – Next.js 16, TypeScript 5.9, App Router, i18n, Supabase, Drizzle.

---

## 1. Synthèse

| Aspect | État | Commentaire |
|--------|------|-------------|
| **Architecture** | ✅ Solide | App Router, [locale], admin / partner bien séparés |
| **Auth & sécurité** | ⚠️ À corriger | Middleware non branché (voir ci‑dessous) |
| **i18n** | ✅ Bon | next-intl, fr/en/nl, routing centralisé |
| **Config & tooling** | ✅ Bon | TS strict, Turbopack, Tailwind 4 |
| **Tests** | ⚠️ Incomplet | Pas de dossiers `test/unit`, `test/e2e`, `test/setup.ts` |
| **Build** | ⚠️ Risque | `ignore-loader` dans next.config non installé |

---

## 2. Points critiques

### 2.1 Middleware Next.js non actif (priorité haute)

Le fichier **`proxy.ts`** à la racine de `apps/web` contient toute la logique de :

- routage i18n (next-intl)
- rafraîchissement de session Supabase
- protection des routes `/admin` et `/api/admin` (redirect login, vérif allowlist, rôles)

**Problème :** Next.js n’exécute que un fichier nommé **`middleware.ts`** (ou `middleware.js`) à la racine ou dans `src/`. Ici, la fonction exportée s’appelle `proxy`, pas `middleware`, et aucun `middleware.ts` n’existe. Donc :

- Aucun redirect précoce vers `/login` pour les non‑authentifiés sur `/admin`
- Pas de refresh de session côté middleware
- Pas de redirection i18n par le middleware (next-intl peut partiellement compenser ailleurs)

**Conséquences :** La sécurité repose entièrement sur `requireAdminPage()` et `requireAdminOrResponse()` dans les pages et les API. C’est cohérent, mais :

- Un utilisateur non connecté peut atteindre la page admin avant d’être redirigé (flash possible).
- La session Supabase n’est pas rafraîchie dans le middleware (recommandation Supabase).

**Recommandation :** Créer `apps/web/middleware.ts` (ou `src/middleware.ts`) et déléguer à `proxy` :

```ts
// apps/web/middleware.ts
export { proxy as middleware } from './proxy'
export { config } from './proxy'
```

Ou renommer `proxy` en `middleware` et exporter `middleware` + `config` depuis un fichier `middleware.ts` qui réexporte `proxy.ts`.

---

### 2.2 `ignore-loader` dans next.config (priorité moyenne)

Dans `next.config.js`, une règle Webpack exclut les fichiers de test :

```js
config.module.rules.push({
  test: /\.test\.|\.spec\.|\.setup\./,
  loader: 'ignore-loader',
})
```

**Problème :** Le package **`ignore-loader`** n’est pas listé dans `package.json` (ni en dependency ni en devDependency). Si un fichier `*.test.*` ou `*.spec.*` se retrouve dans le périmètre du build, le build peut échouer avec « Cannot find module 'ignore-loader' ».

**Recommandation :** Soit installer `ignore-loader` en devDependency, soit retirer cette règle et s’appuyer sur `pageExtensions` (déjà configuré) pour exclure les tests du build, ou utiliser une approche sans loader (ex. `exclude` dans une règle existante).

---

### 2.3 Dossiers de tests manquants (priorité moyenne)

- **Vitest** : `vitest.config.ts` référence `./test/setup.ts` et `**/test/unit/**/*.{test,spec}.*`.
- **Playwright** : `playwright.config.ts` référence `testDir: './test/e2e'`.

Le répertoire **`apps/web/test`** n’existe pas (aucun `test/unit`, `test/e2e`, `test/setup.ts`). Donc :

- Les commandes `pnpm test` / `pnpm test:e2e` peuvent échouer ou ne rien exécuter.
- La couverture (seuils 80 % global, 95 % pour `src/lib/business/**`) n’est pas vérifiable.

**Recommandation :** Créer au minimum :

- `apps/web/test/setup.ts` (vide ou avec setup minimal type `@testing-library/jest-dom`)
- `apps/web/test/unit/` avec au moins un test factice pour valider la config

Puis ajouter progressivement des tests unitaires et E2E sur les parcours critiques (auth, admin, commandes).

---

## 3. Points d’attention (non bloquants)

### 3.1 Langue par défaut et attribut `lang`

- **`app/layout.tsx`** : `<html lang="fr">` est en dur. Pour les routes sous `[locale]` (ex. `/en`, `/nl`), l’attribut devrait refléter la locale (en/nl). Soit le layout racine reçoit la locale (complexe avec App Router), soit un layout sous `[locale]` fixe `lang` via un client component ou une solution next-intl si disponible.

### 3.2 Fallback néerlandais (nl)

Dans `src/i18n/request.ts` :

```ts
const messagesByLocale = {
  en,
  fr,
  nl: en, // Use English as fallback for nl
}
```

Les messages NL utilisent l’anglais. Si le produit doit être en néerlandais, il faudra ajouter `nl.json` et l’utiliser ici.

### 3.3 Typage `locale` dans le layout

Dans `app/[locale]/layout.tsx` :

```ts
if (!routing.locales.includes(locale as any)) {
  notFound()
}
```

Remplacer `as any` par un type dérivé de `routing.locales` (ex. `Locale` depuis `@make-the-change/core/i18n`) pour garder le typage strict.

### 3.4 Instrumentation (monitoring)

`instrumentation.ts` est en place mais ne fait qu’ébaucher le monitoring (TODO côte serveur et client). À compléter quand un outil (Sentry, Vercel Analytics, etc.) sera choisi.

### 3.5 Profils : `profiles` vs `publicProfiles`

- **Page admin orders** (`orders/page.tsx`) : jointure avec **`publicProfiles`** (champs publics).
- **API admin orders** (`api/admin/orders/route.ts`) : utilise **`profiles`** (table complète).

La relation Drizzle pour `orders` pointe vers **`profiles`**. Vérifier que `public_profiles` et `profiles` partagent bien le même `id` (vue ou table dérivée) pour que les deux approches soient cohérentes. Si `public_profiles` est une vue sur `profiles`, documenter ce choix dans le code ou la doc technique.

### 3.6 Erreur / chargement admin

- **`error.tsx`** : texte en français en dur (« Une erreur est survenue », « Réessayer »). Pour cohérence i18n, utiliser `useTranslations` (next-intl) ou des clés partagées.
- **`loading.tsx`** : idem, pas d’i18n. Optionnel mais souhaitable pour cohérence.

### 3.7 Duplication auth : proxy vs auth-guards

La logique “admin” (rôles, allowlist) est dupliquée entre :

- `proxy.ts` (getActiveRoles, getAllowlist, vérifs admin)
- `lib/auth-guards.ts` (getActiveRoles, getAllowlist, requireAdmin, requireAdminPage)

Une fois le middleware branché, garder une seule source de vérité (ex. helpers dans `auth-guards.ts` ou un module dédié) et les réutiliser depuis le middleware et les pages pour éviter les écarts.

---

## 4. Points positifs

- **Auth** : Allowlist email, rôles (admin/superadmin/producer), guards par page et par API, logs sécurité (IP, email) en cas de refus.
- **TypeScript** : `strict`, `noUncheckedIndexedAccess`, chemins `@/` et alias `@make-the-change/core` bien configurés.
- **Structure** : Séparation claire `[locale]`, `(dashboard)`, `(auth)`, composants admin sous `components/` (layout, form, ui, orders, partners, etc.).
- **Données** : Usage cohérent de Drizzle (core) côté serveur, Supabase pour auth et storage, `createAdminClient` pour les opérations service role.
- **i18n** : next-intl avec `getRequestConfig`, `createNavigation`, `setRequestLocale`, `generateStaticParams` pour les locales.
- **UI** : Design tokens CSS, thème light/dark (next-themes), composants partagés avec `@make-the-change/core/ui`.
- **Performance** : Turbopack, `typedRoutes`, images AVIF/WebP, `remotePatterns` Supabase/Unsplash.
- **API** : Routes sous `api/admin/*` protégées via `requireAdminOrResponse()`, schémas Zod pour les query params (ex. orders).

---

## 5. Recommandations par priorité

| Priorité | Action |
|----------|--------|
| **P0** | Créer `middleware.ts` qui exporte la logique de `proxy.ts` pour activer i18n + refresh session + protection admin. |
| **P1** | Ajouter le dossier `test/` avec `setup.ts` et au moins un test unitaire ; corriger ou retirer la règle `ignore-loader` dans next.config. |
| **P2** | Factoriser la logique auth (rôles, allowlist) entre middleware et auth-guards ; corriger `lang` sur `<html>` pour la locale. |
| **P3** | i18n pour error/loading admin ; typage strict pour `locale` ; messages NL si requis ; documenter `profiles` vs `publicProfiles`. |

---

## 6. Fichiers clés parcourus

- `package.json`, `next.config.js`, `tsconfig.json`, `tailwind.config.js`, `postcss.config.js`
- `instrumentation.ts`, `proxy.ts`, `vercel.json`, `playwright.config.ts`, `vitest.config.ts`
- `src/app/layout.tsx`, `src/app/[locale]/layout.tsx`, `src/app/providers.tsx`
- `src/app/[locale]/admin/(dashboard)/layout.tsx`, `dashboard/page.tsx`, `orders/page.tsx`, `orders/orders-client.tsx`
- `src/supabase/client.ts`, `server.ts`, `middleware.ts` (Supabase)
- `src/lib/auth-guards.ts`, `src/lib/db.ts`, `src/lib/supabase/server.ts`, `src/lib/queries/admin.ts`
- `src/i18n/request.ts`, `routing.ts`, `navigation.ts`
- `src/app/api/admin/_utils.ts`, `src/app/api/admin/orders/route.ts`
- `src/theme/design-tokens.css`, `src/app/globals.css`

---

*Revue générée automatiquement. À relire et adapter selon les conventions et la roadmap du projet.*
