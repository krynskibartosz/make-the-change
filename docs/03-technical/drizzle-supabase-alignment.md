# Alignement Drizzle / Supabase — Make the CHANGE

Source de vérité schéma : `packages/core/src/shared/db/schema.ts`.  
Ce document décrit les écarts entre le schéma Drizzle et l’usage Supabase dans les API, et propose un plan d’alignement.

---

## 1. État des lieux

- **Drizzle** : schéma et types dans `@make-the-change/core` ; client Postgres (`postgres` + `drizzle-orm`) utilisable en Node (migrations, scripts). Le package core expose `./db` uniquement en environnement Node (pas en browser/React Native).
- **Supabase** : utilisé dans **apps/web** pour toutes les routes API (admin + public). Connexion via `NEXT_PUBLIC_*` + `SUPABASE_SERVICE_ROLE_KEY` ; accès Postgres via le client Supabase (`.from()`, `.schema()`), pas via Drizzle.
- **Résultat** : deux façons d’accéder au même Postgres (Supabase héberge la BDD) ; le schéma Drizzle n’est pas la référence à l’exécution côté API, d’où dérives possibles (colonnes/tables manquantes dans le schéma, ou utilisées dans l’API mais pas modélisées).

---

## 2. Écarts identifiés

### 2.1 `investment.producers` (partenaires)

| Élément        | Drizzle (core)     | API (Supabase)                    |
|----------------|--------------------|-----------------------------------|
| Colonnes       | `id`, `name_default`, `contact_email`, `status`, `created_at` | Idem + **`description`**, **`website`**, **`logo`** (utilisés en GET/POST/PATCH). |

**Impact** : le formulaire et l’API partenaires lisent/écrivent `description`, `website`, `logo` ; le schéma Drizzle ne les reflète pas → types et migrations incomplets.

**Action** : ajouter dans le schéma Drizzle `description`, `website`, `logo` sur `investment.producers`.

---

### 2.2 `commerce.order_items`

| Élément | Drizzle (core) | API (Supabase) |
|---------|----------------|----------------|
| Table   | **Absente**    | Utilisée dans `orders` (select `order_items(*)`) et dans `lib/shop/actions.ts` (insert). |

Colonnes déduites du code :

- `order_id` (FK → `commerce.orders`)
- `product_id` (FK → `commerce.products`)
- `quantity`
- `unit_price_points`
- `total_price_points`

**Action** : ajouter la table `commerce.order_items` dans le schéma Drizzle (avec les colonnes ci‑dessus et clé primaire/id si besoin).

---

### 2.3 Points balance : `users` vs `profiles`

| Élément | Drizzle (core) | API (Supabase) |
|---------|----------------|----------------|
| `users`  | `id`, `name`, `email`, `createdAt` (pas de `points_balance`) | `/api/points/balance` fait `.from('users').select('points_balance')`. |
| `profiles` | `points_balance` présent | Non utilisé dans cette route. |

**Interprétation** : soit la table réelle `users` en base a une colonne `points_balance` (non décrite dans Drizzle), soit la route devrait s’appuyer sur `profiles` (aligné avec le schéma Drizzle).

**Action** : décider une seule source de vérité pour le solde (ex. `profiles.points_balance`) et aligner la route `/api/points/balance` et le schéma Drizzle en conséquence (documenter ou déplacer la lecture vers `profiles`).

---

### 2.4 Schéma utilisé pour `products` (public)

- **Drizzle** : `commerce.products`.
- **API** : `/api/products` utilise `supabase.from('products')` **sans** `.schema('commerce')` → requête sur le schéma par défaut (souvent `public`).
- **Risque** : si en base les produits sont dans `commerce.products`, la route interroge la mauvaise table ou une vue ; si tout est en `public.products`, le schéma Drizzle ne reflète pas la structure réelle.

**Action** : uniformiser : soit tout en `commerce` (Drizzle + API avec `.schema('commerce')`), soit documenter une vue `public.products` et l’aligner avec le schéma Drizzle.

---

### 2.5 `commerce.orders` — champs optionnels

- **Drizzle** : `id`, `status`, `created_at`, `total_points`, `user_id`.
- **API** : PATCH order utilise `shipping_address` ; non présent dans le schéma.

**Action** : si la table réelle contient `shipping_address`, l’ajouter au schéma Drizzle (et documenter ici).

---

## 3. Options d’alignement

### Option A — Garder Supabase dans les API, Drizzle = référence pour types et migrations

- **Idée** : les API restent sur le client Supabase ; Drizzle sert uniquement de **source de vérité** pour le schéma et les types.
- **À faire** :
  1. Mettre à jour le schéma Drizzle pour refléter toutes les tables/colonnes utilisées (producers + description/website/logo, order_items, users/profiles et points_balance, products schema, orders + shipping_address si présent).
  2. Générer et appliquer les migrations Drizzle contre la base Supabase (via `DATABASE_URL` = chaîne de connexion directe Postgres).
  3. Dans apps/web : importer les **types** depuis `@make-the-change/core/schema` (ou réexportés par core) pour typer les réponses/requêtes ; garder les appels Supabase.
- **Avantages** : peu de changement dans les routes ; auth et storage Supabase inchangés.  
- **Inconvénients** : pas de requêtes typées Drizzle côté API ; risque de dérive si de nouvelles colonnes sont ajoutées en base sans mise à jour du schéma.

---

### Option B — Utiliser Drizzle côté API pour les données métier

- **Idée** : pour les routes qui ne dépendent pas de l’auth Supabase ou du storage, utiliser le client Drizzle (`getDb()` depuis `@make-the-change/core/db`) dans apps/web.
- **Prérequis** :
  1. `DATABASE_URL` dans apps/web (même base que Supabase, connexion directe Postgres).
  2. Schéma Drizzle aligné (Option A, point 1).
  3. Migrations Drizzle appliquées sur cette base.
- **À faire** :
  1. Créer un module dans apps/web (ex. `lib/db.ts`) qui expose `getDb()` depuis `@make-the-change/core/db` (uniquement côté serveur).
  2. Migrer progressivement les routes admin (partners, projects, orders, categories, etc.) vers Drizzle ; garder Supabase pour auth, storage, et routes qui en dépendent (ex. points/balance si lié à la session Supabase).
- **Avantages** : requêtes typées, une seule définition du schéma, moins de dérive.  
- **Inconvénients** : double accès (Drizzle + Supabase) à documenter ; gestion des connexions (pool) à vérifier.

---

### Recommandation

1. **Court terme** : appliquer **Option A** (alignement du schéma Drizzle + migrations + typage depuis core) et corriger les écarts listés (producers, order_items, users/profiles, products schema, orders).
2. **Moyen terme** : si les routes admin grossissent ou si la cohérence types/schéma devient critique, introduire **Option B** progressivement (commencer par une route exemple, ex. GET partners) et documenter dans ce fichier.

---

## 4. Plan d’action concret

| # | Tâche | Priorité |
|---|--------|----------|
| 1 | Ajouter `description`, `website`, `logo` à `investment.producers` dans le schéma Drizzle. | Haute |
| 2 | Ajouter la table `commerce.order_items` (order_id, product_id, quantity, unit_price_points, total_price_points). | Haute |
| 3 | Clarifier et aligner points balance : utiliser `profiles` ou documenter `users.points_balance` et mettre à jour Drizzle. | Haute |
| 4 | Uniformiser le schéma des produits (commerce vs public) et mettre à jour la route `/api/products` si besoin. | Moyenne |
| 5 | Ajouter `shipping_address` à `commerce.orders` dans Drizzle si présent en base. | Basse |
| 6 | Ajouter `DATABASE_URL` dans `apps/web/.env.example` si Option B est retenue. | Moyenne |
| 7 | (Option B) Créer `lib/db.ts` et migrer une route admin vers Drizzle en exemple. | Moyenne |

---

## 5. Implémenté (février 2026)

- **Schéma Drizzle** : `producers` + `description`, `website`, `logo` ; table `commerce.order_items` ; `commerce.orders` + `shipping_address` ; types `Order`, `OrderItem` exportés.
- **apps/web** : `DATABASE_URL` ajouté dans `.env.example` ; `lib/db.ts` expose `db` / `getDb()` depuis `@make-the-change/core/db`.
- **Route exemple** : `GET /api/admin/partners` utilise Drizzle (`db`, `producers`, `and`/`or`/`eq`/`gt`/`sql`) au lieu de Supabase ; POST/PATCH partners restent sur Supabase (auth inchangée).
- **Suite possible** : migrer progressivement les autres routes admin (projects, orders, categories, etc.) vers `@/lib/db` + schéma core, ou garder Supabase et n’utiliser Drizzle que pour types et migrations.

---

Dernière MAJ : février 2026.
