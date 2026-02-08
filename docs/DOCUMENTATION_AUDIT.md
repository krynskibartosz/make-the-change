# Audit documentation ↔ code — *Make the Change*

Date : **4 février 2026**  
Objectif : comparer la documentation du repo avec l’état réel du code/projet, et identifier ce qui est **incorrect**, **obsolète**, **ambigu**, ou **non implémenté**.

## Périmètre

- Docs : `README.md`, `docs/**` (hors `docs/_legacy_archive/**`), `apps/**/README*.md`, `packages/**/README*.md`
- Code/config : `package.json`, `turbo.json`, `.env.example` (+ variantes par app), schéma DB Drizzle (`packages/core/src/shared/db/schema.ts`)
- Vérifications “réalité” : scripts `pnpm`, imports DB (Drizzle), routes API, usages `process.env.*`, présence/absence de dépendances.

## Résumé exécutif

- ✅ `docs/GETTING-STARTED.md` est globalement aligné avec `package.json` et `turbo.json` (Node>=20, pnpm>=9, `pnpm dev`/`dev:all`).
- ✅ **Problème DB résolu** : `docs/03-technical/database-schema.md` et migrations Drizzle obsolètes ont été supprimés. Le schéma TypeScript `packages/core/src/shared/db/schema.ts` est maintenant la **source de vérité unique** et correspond à la DB réelle.
- ❗`apps/web-client/README.md` décrit un modèle de sécurité "RLS-only via Supabase / pas d'accès DB direct", alors que le code **importe `@make-the-change/core/db`** et exécute des requêtes Drizzle.
- ❗`apps/mobile` : docs **contradictoires** (SDK55 vs NativeWind v5) et **code** qui importe des packages non présents dans `apps/mobile/package.json` (`expo-sqlite`, `expo-widgets`, `expo-storereview`).
- ❗`pnpm types:generate` pointe vers un script qui écrit dans `packages/api/**` (package supprimé) : commande cassée.

---

## Constat 1 — Schéma DB : ✅ **Résolu** (Source de vérité unique)

### État actuel (post-nettoyage)

- ✅ **Source de vérité unique** : `packages/core/src/shared/db/schema.ts` 
- ✅ **DB réelle** : Correspond exactement au schéma TypeScript (vérifié via MCP Supabase)
- ✅ **Code** : Utilise `@make-the-change/core/db` de manière cohérente
- ✅ **Documentation** : `docs/03-technical/database-schema.md` supprimé (obsolète)
- ✅ **Migrations** : `packages/core/drizzle/` supprimé (94 migrations inutiles)

### Architecture validée

**Schémas multi-tenants :**
- `public`: Tables de référence (countries, languages, profiles)
- `commerce`: Produits, catégories, commandes, abonnements  
- `investment`: Projets, producteurs, investissements, espèces
- `content`: Blog, médias, traductions
- `identity`: Rôles utilisateurs, consentements, sessions
- `finance`: Journal comptable, comptes
- `ledger`: Transactions de points

**Principes confirmés :**
- Type-safe avec TypeScript
- RLS activé sur toutes les tables
- Colonnes i18n en JSONB
- Audit trail automatique
- Indexation optimisée

### Recommandations

✅ **Aucune action requise** - Le problème est résolu.

---

## Constat 2 — `apps/web-client/README.md` décrit un modèle de sécurité faux (Critique)

### Doc actuelle

`apps/web-client/README.md` affirme :
- “pas d’accès DB direct”
- “❌ No Drizzle ORM / Direct DB connection”
- “✅ Supabase RLS pour tout accès données”

### Réalité dans le code

Le code `apps/web-client` utilise Drizzle via `@make-the-change/core/db` et `drizzle-orm` (exemples, non exhaustif) :
- `apps/web-client/src/app/[locale]/projects/page.tsx` (imports `db` + Drizzle)
- `apps/web-client/src/app/[locale]/products/page.tsx` et `apps/web-client/src/app/[locale]/products/[slug]/page.tsx`
- `apps/web-client/src/app/api/partners/route.ts` (DB directe)

Et `@make-the-change/core/db` requiert **`DATABASE_URL`** (`packages/core/src/shared/db/client.ts`).

### Recommandations

Choisir une direction et rendre la doc cohérente :
- Option A : assumer l’accès DB direct côté serveur (Server Components/Route Handlers uniquement)
  - mettre à jour `apps/web-client/README.md` + `apps/web-client/.env.example` (inclure `DATABASE_URL` si requis),
  - préciser clairement les contraintes (server-only, pas de RLS “automatique” selon le rôle DB).
- Option B : revenir à un modèle “RLS-only”
  - supprimer les imports `@make-the-change/core/db` dans web-client,
  - centraliser l’accès données via `@/lib/supabase/*` et des policies.

---

## Constat 3 — `apps/mobile` : docs ↔ code ↔ deps non cohérents (Critique)

### 3.1 README mobile inexacte / confuse

`apps/mobile/README.md` :
- annonce Supabase/Auth + variables `EXPO_PUBLIC_SUPABASE_*` alors que le code ne référence pas Supabase (aucun `supabase` trouvé dans `apps/mobile/**`).
- la seule variable lue dans le code est `EXPO_PUBLIC_API_BASE_URL` (`apps/mobile/lib/api.ts`).
- contient une incohérence de copie : “Copier `.env.example` vers `.env.local`” mais exemple `cp .env.example .env`.
- badge React Native affiche **0.78** alors que `apps/mobile/package.json` indique `react-native: 0.83.1`.

### 3.2 Docs internes contradictoires + deps manquantes

- `apps/mobile/README-SDK55.md` décrit des features basées sur :
  - `expo-sqlite` (`apps/mobile/src/app/lib/database.ts`)
  - `expo-widgets` (`apps/mobile/src/app/lib/widgets.ts`)
  - `expo-storereview` (`apps/mobile/src/app/lib/store-review.ts`)
- `apps/mobile/README-NativeWind-v5.md` affirme que ces packages ont été supprimés.
- `apps/mobile/package.json` ne contient pas `expo-sqlite`, `expo-widgets`, ni `expo-storereview` ⇒ le code est potentiellement **non compilable** / non exécutable tel quel.

### Recommandations

1. Décider si ces features (SQLite / Widgets / Store review) sont :
   - **actives** (alors ajouter/renommer les bonnes deps + aligner `app.json` plugins), ou
   - **abandonnées** (alors supprimer le code correspondant et archiver `README-SDK55.md`).
2. Mettre à jour `apps/mobile/README.md` pour refléter la réalité :
   - l’app consomme l’API web-client via `EXPO_PUBLIC_API_BASE_URL`,
   - préciser les endpoints attendus (ex : `/api/projects/featured`).

---

## Constat 4 — Script de génération de types cassé (Critique)

- `package.json` expose `types:generate`: `./scripts/generate-types.sh`
- `scripts/generate-types.sh` écrit vers `packages/api/src/types/supabase.ts`
- `packages/api` n’existe pas dans ce repo (supprimé / legacy)

### Recommandations

- Si non utilisé : supprimer `types:generate` et/ou archiver le script.
- Si utilisé : corriger la destination (ex : `packages/core/...`) + documenter les prérequis (`supabase` CLI, variables, project-id).

---

## Constat 5 — Design system : principes documentés ≠ implémentation (Majeur)

`docs/03-technical/design-system.md` pose des règles (“pas de `cn/clsx`”, “pas de logique style JS”), alors que :
- les composants partagés utilisent `cn()` et `cva()` (ex : `packages/core/src/shared/ui/button.tsx`, `card.tsx`, etc.)
- `apps/web` et `apps/web-client` importent les tokens CSS via `@import "@make-the-change/core/css";`
- `apps/mobile` partage plutôt la config Tailwind via `sharedConfig` + preset NativeWind (`apps/mobile/tailwind.config.js`), sans importer `@make-the-change/core/css`.

### Recommandations

- Reformuler la règle : “`cn`/`cva` autorisés pour variants/composition”, et réserver “data-* selectors” aux états Base UI quand pertinent.
- Mettre à jour la checklist “tokens” : distinguer web/web-client (CSS variables) vs mobile (preset/config).

---

## Constat 6 — Docs “integrations/services” mélangent “actuel” et “cible” (Majeur)

Exemples :
- `docs/03-technical/integrations/stripe-integration.md` et `docs/03-technical/services/billing-service.md` décrivent webhooks Stripe, portal, etc., mais aucun code Stripe n’est présent (pas d’import `stripe`, pas de route webhook détectée).
- `docs/03-technical/integrations/partner-webhooks.md` décrit un endpoint `/api/partners/webhooks/:partner` absent.
- `docs/03-technical/integrations/supabase-integration.md` évoque RLS policies “incluses dans `database-schema.md`” (non présent) + triggers/views/pg_cron (plutôt au stade “design”).

### Recommandations

- Ajouter en tête de chaque doc : **Status** (Implemented / Partial / Planned) + **Scope**.
- Renommer ou déplacer les docs purement “spec” (ex : `docs/specs/`), ou les marquer “Planned” de façon cohérente.

---

## Constat 7 — Variables d’environnement : doc partielle, exemples en avance sur le code (Majeur)

Variables `process.env.*` réellement utilisées (extraits) :
- `DATABASE_URL` (Drizzle, `@make-the-change/core/db`)
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Supabase SSR)
- `SUPABASE_SERVICE_ROLE_KEY` (admin client / upload)
- `ADMIN_EMAIL_ALLOWLIST` (guard admin)
- `EXPO_PUBLIC_API_BASE_URL` (mobile)
- scripts : `SUPABASE_URL`, `SUPABASE_ANON_KEY` (scripts data)

Constat :
- Les `.env.example` contiennent des variables (Stripe, Resend, Google Maps, Vercel…) actuellement **non utilisées** dans le code.
- Certains scripts (`scripts/*.js`) attendent `SUPABASE_URL`/`SUPABASE_ANON_KEY` mais ces clés n’apparaissent pas dans les `.env.example` (elles existent sous forme `NEXT_PUBLIC_*`).

### Recommandations

- Documenter “env minimal” par app (web / web-client / mobile) + “env optionnel”.
- Harmoniser les noms (`SUPABASE_URL` vs `NEXT_PUBLIC_SUPABASE_URL`) ou documenter clairement les fallbacks.

---

## Exemples d’inexactitudes ponctuelles (à corriger)

- `docs/03-technical/schemas/database-types.md`
  - affirme “aucune contrainte unique” et “PK UUID partout” : faux (ex : `users.email` est `UNIQUE`, `countries.code` est une PK `text` dans le schéma TS).
- `docs/03-technical/drizzle-supabase-alignment.md`
  - plusieurs passages ne reflètent plus l’état actuel (ex : usage Supabase vs Drizzle dans certaines routes; section “Implémenté (février 2026)” à revalider).
- `apps/web-client/README.md`
  - section “Testing” propose `pnpm test`, mais `apps/web-client/package.json` ne définit pas de script `test`.
- `packages/core/README.md`
  - “Schema Overview” mentionne des tables/schémas qui ne correspondent pas au schéma TS actuel (ex : `producers` en `commerce`, `subscriptions` en `public`, `points_transactions`).
- `packages/core/src/shared/ui/README.md`
  - contient des imports et une liste de composants très “aspirationnels” (chemins d’imports non alignés sur `@make-the-change/core/ui`, composants/fichiers annoncés mais absents).

---

## Points secondaires / hygiène doc (À faire quand les critiques sont traités)

- Clarifier le statut des apps supplémentaires : `apps/mobile-clean/`, `apps/mobile-sdk55/` (expérimentations ? templates ?), car la doc “officielle” parle surtout de `apps/mobile/`.
- `packages/core/src/shared/ui/README.md` contient beaucoup de contenu “aspirationnel” (composants/fichiers/imports non alignés avec l’état actuel) ⇒ risque de confusion.

---

## Next steps proposés (ordre recommandé)

1. ✅ **DB** : **RÉSOLU** - Source de vérité unique établie avec `schema.ts`
2. **web-client** : décider "RLS-only" vs "DB direct serveur", puis mettre README + `.env.example` en cohérence.
3. **mobile** : décider du périmètre (SQLite/Widgets/Store review) et aligner deps + docs + code.
4. **tooling** : corriger/supprimer `types:generate`.
5. **docs** : marquer explicitement "Planned" vs "Implemented" sur les docs d'intégration/services.
