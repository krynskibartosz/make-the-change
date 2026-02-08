# P7 — Durcissement & Cohérence : plan d’exécution en tickets (ultra détaillé)

**Date** : 2026-02-05  
**Sources** :  
- `docs/03-technical/2026-02-05-comprehensive-system-handover.md` (handover v1.2)  
- `docs/03-technical/2026-02-05-architectural-debt-and-p7-roadmap.md` (stratégie P7)  
- `docs/03-technical/2026-02-04-web-client-security-refactor-plan.md` (contraintes sécurité & vues `public_*`)  

---

## 0) Objectif P7 (résultat attendu)

P7 vise à supprimer la dette “cohérence + sécurité” la plus risquée :

1) **Points** : supprimer le *dual-write* (profil cache vs ledger) et rendre le ledger la seule source d’écriture.  
2) **Stripe** : passer en “strict mode” (métadonnées validées + idempotence transactionnelle), et **gater** l’activation des investissements par webhook.  
3) **Checkout points** : rendre le checkout **atomique** (une seule transaction DB).  
4) **Schéma** : aligner les “ghost tables/views” et l’usage runtime (Drizzle / Supabase).  
5) **Ops** : rendre le système observable et vérifiable (runbook + métriques de drift).

---

## 1) Principes & garde-fous (non négociables)

### 1.1 Source of truth
En cas de divergence :  
1. Schéma DB réel (Postgres `information_schema`)  
2. Drizzle (`packages/core/src/shared/db/schema.ts`)  
3. Code runtime (`apps/**/src/**/*.{ts,tsx}`)  
4. Documentation

### 1.2 Modèle de confiance
- **Clients non fiables** (`apps/web-client`, `apps/mobile`) : accès via Supabase + RLS + vues `public_*` (pas de DB direct).  
- **Serveur fiable** (`apps/web` admin/producer + webhooks) : service role / DB direct autorisé.

### 1.3 Définition de “Done”
Un ticket est “Done” uniquement si :
- migration appliquée en staging puis prod,
- métriques (drift, erreurs webhook, échecs checkout) stables,
- runbook mis à jour (SQL de vérification + rollback),
- tests/QA passants pour les parcours concernés.

### 1.4 Conventions tickets
- **Type** : `DB`, `Backend`, `Frontend`, `Ops`, `Docs`.  
- **Priorité** : `P0` (bloquant), `P1` (important), `P2` (amélioration).  
- **Estimation** : `S` (≤ 0.5j), `M` (1–2j), `L` (3–5j), `XL` (> 5j).  
- **Dépendances** : explicites, pas implicites.

---

## 2) Découpage P7 (sprints)

> Recommandation : sprints de 1 semaine. Ajustable selon capacité.

- **P7.0 (préparation)** : inventaire DB + staging + garde-fous.  
- **P7.1** : ledger + trigger + migration + verrouillage écritures.  
- **P7.2** : alignement schéma (ghost tables/views) + refresh leaderboard + outillage migrations.  
- **P7.3** : Stripe strict mode + investissement asynchrone (pending → webhook).  
- **P7.4** : checkout atomique (fonction SQL) + refactor app.

---

## 3) Backlog P7 — tickets concrets

### EPIC P7.0 — Préparation (inventaire + staging)

#### P7.0-T01 — Inventaire DB “ghost tables/views”
- **Type** : DB
- **Priorité** : P0
- **Estimation** : S
- **Dépendances** : accès Supabase SQL editor
- **But** : figer la réalité DB avant toute migration.
- **Tâches**
  - Exécuter le sanity-check (adapter schéma si nécessaire) :
    - `to_regclass('commerce.points_ledger')`, `to_regclass('public.points_ledger')`
    - `to_regclass('commerce.stripe_events')`, `to_regclass('public.stripe_events')`
    - `to_regclass('public.producer_messages')`
    - `to_regclass('public.public_user_profiles')`
    - `to_regclass('public.public_user_rankings')`
  - Exporter (copier dans un gist privé interne / doc interne) :
    - DDL de ces objets (tables, indexes, contraintes, triggers, fonctions `add_points`, etc.)
  - Capturer **les colonnes exactes** :
    - `points_ledger` (delta, reason, ref_type/ref_id, metadata, created_at…)
    - `stripe_events` (event_id unique, type, processed_at, data jsonb…)
    - `producer_messages` (producer_id, sender_user_id, subject/message, status…)
- **Critères d’acceptation**
  - Document d’inventaire partagé (lien interne) + décision “où vit quoi” (schéma `commerce` vs `public`).

#### P7.0-T02 — Staging & plan de déploiement sécurisé
- **Type** : Ops
- **Priorité** : P0
- **Estimation** : M
- **Dépendances** : P7.0-T01
- **But** : tester migrations + webhooks sans risque.
- **Tâches**
  - Disposer d’un environnement staging (Supabase + Stripe webhook endpoint séparé).
  - Vérifier variables env staging :
    - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    - `SUPABASE_SERVICE_ROLE_KEY` (serveur seulement)
    - `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` (serveur seulement)
    - `DATABASE_URL` (serveur seulement, si Drizzle runtime côté admin)
  - Définir un “freeze window” prod (30–60 min) + procédure rollback.
- **Critères d’acceptation**
  - Staging opérationnel avec webhook Stripe qui reçoit et répond 200.

---

### EPIC P7.1 — Ledger comme seule écriture + trigger de cache + migration

#### P7.1-T01 — Spécification canonique `commerce.points_ledger`
- **Type** : DB
- **Priorité** : P0
- **Estimation** : S
- **Dépendances** : P7.0-T01
- **But** : définir une table ledger stable et audit-friendly.
- **Décisions à figer**
  - Clé primaire : `id uuid`
  - Colonnes minimales :
    - `user_id uuid not null`
    - `delta int not null` (positif ou négatif)
    - `reason text not null` (enum logique ou text + convention)
    - `reference_type text`, `reference_id uuid` (ou text si hétérogène)
    - `idempotency_key text unique` (optionnel mais recommandé)
    - `metadata jsonb default '{}'`
    - `created_at timestamptz default now()`
  - Index :
    - `(user_id, created_at desc)`
    - `(reference_type, reference_id)`
    - `idempotency_key unique` (si retenu)
- **Critères d’acceptation**
  - DDL validé (review) + prêt pour migration (P7.1-T02).

#### P7.1-T02 — Migration : créer/normaliser `points_ledger` + indexes
- **Type** : DB
- **Priorité** : P0
- **Estimation** : M
- **Dépendances** : P7.1-T01
- **But** : rendre la table ledger utilisable et performante.
- **Tâches**
  - Si la table existe déjà :
    - aligner colonnes / contraintes / indexes sur la spec,
    - migrer sans perte (ALTER TABLE + backfill).
  - Si elle n’existe pas :
    - créer dans le schéma décidé (`commerce` recommandé),
    - créer view miroir `public.points_ledger` si un accès PostgREST est requis.
- **Critères d’acceptation**
  - `INSERT`/`SELECT` fonctionnels en staging, avec perf correcte (EXPLAIN sur requêtes principales).

#### P7.1-T03 — Standardiser la fonction RPC `add_points` (écriture unique)
- **Type** : DB
- **Priorité** : P0
- **Estimation** : M
- **Dépendances** : P7.1-T02
- **But** : un point d’entrée unique pour crédit/débit points.
- **Tâches**
  - Définir contrat final `add_points(p_user_id, p_delta, p_reason, p_reference_type, p_reference_id, p_metadata, p_idempotency_key?)`.
  - Implémenter :
    - insert ledger,
    - idempotence (si `idempotency_key`),
    - validation minimale (delta != 0, user_id non null).
  - Sécurité :
    - version “serveur” (service role) : autorisée,
    - version “user context” (si nécessaire) : **strictement** contrôlée (ex: `p_user_id = auth.uid()` + reasons autorisés).
- **Critères d’acceptation**
  - Webhook Stripe utilise uniquement `add_points` (aucune écriture directe ailleurs).

#### P7.1-T04 — Trigger : recalculer `profiles.metadata.points_balance` depuis le ledger
- **Type** : DB
- **Priorité** : P0
- **Estimation** : L
- **Dépendances** : P7.1-T02
- **But** : faire de `metadata.points_balance` un cache dérivé, pas une source d’écriture.
- **Tâches**
  - Créer fonction `update_points_balance_from_ledger(user_id)` :
    - calcule `SUM(delta)` depuis ledger,
    - met à jour `profiles.metadata.points_balance`.
  - Créer trigger `AFTER INSERT` sur `points_ledger` :
    - appelle la fonction (idempotent).
  - Gérer le cas “ledger vide” → balance = 0.
  - Optimisation :
    - éviter recalcul complet si possible (option) : update incrémental.
- **Critères d’acceptation**
  - Après insertion ledger, `profiles.metadata.points_balance` reflète la somme.
  - Script de vérification “diff metadata vs ledger” renvoie 0 en staging.

#### P7.1-T05 — Verrouiller les écritures directes sur `metadata.points_balance`
- **Type** : DB
- **Priorité** : P0
- **Estimation** : M
- **Dépendances** : P7.1-T04
- **But** : empêcher les dérives futures.
- **Options (choisir 1)**
  - **Option A (recommandée)** : trigger `BEFORE UPDATE` sur `profiles` qui rejette tout changement de `metadata.points_balance` si la requête ne vient pas du trigger ledger (ex: variable session, role, ou via une fonction dédiée).
  - **Option B** : retirer la permission `UPDATE` sur `profiles.metadata` aux rôles non-admin et forcer un chemin fonctionnel.
- **Critères d’acceptation**
  - Une tentative d’update directe de `metadata.points_balance` échoue en staging (hors chemin autorisé).

#### P7.1-T06 — Backfill / migration données : aligner balances (prod-safe)
- **Type** : DB
- **Priorité** : P0
- **Estimation** : L
- **Dépendances** : P7.1-T04
- **But** : remettre tout le monde “à zéro drift”.
- **Stratégie**
  - **Cas 1** : ledger existe et est fiable → metadata recalculée depuis ledger.
  - **Cas 2** : ledger incomplet → créer des écritures “migration” dans ledger pour rattraper metadata (avec reason `migration` + metadata trace).
- **Tâches**
  - Écrire un script SQL idempotent :
    - calcule `ledger_balance`,
    - compare à `metadata_balance`,
    - applique correction via ledger (ou via recalcul complet).
  - Capturer un rapport :
    - nombre d’utilisateurs corrigés,
    - total delta ajouté,
    - top N diffs.
- **Critères d’acceptation**
  - Diff = 0 pour tous les utilisateurs en staging, puis en prod après exécution.

#### P7.1-T07 — Sécurité messaging : RLS `producer_messages` (anti-spoof)
- **Type** : DB
- **Priorité** : P0
- **Estimation** : M
- **Dépendances** : P7.0-T01
- **But** : empêcher un utilisateur d’écrire “au nom” d’un autre.
- **Tâches**
  - Policy INSERT : `sender_user_id = auth.uid()`
  - Policy SELECT :
    - sender : voit ses messages,
    - producer : voit les messages liés au producer dont `owner_user_id = auth.uid()`,
    - admin : voit tout.
- **Critères d’acceptation**
  - Tests manuels : insert avec sender_user_id ≠ auth.uid() échoue.

---

### EPIC P7.2 — Alignement schéma Drizzle + views + refresh leaderboard + outillage migrations

#### P7.2-T01 — Typer les “ghost tables” dans `packages/core` (Drizzle)
- **Type** : Backend
- **Priorité** : P1
- **Estimation** : M
- **Dépendances** : P7.0-T01
- **But** : éviter la dérive “DB réelle ≠ types”.
- **Tâches**
  - Ajouter (selon schéma réel) :
    - `pointsLedger` (table)
    - `stripeEvents` (table)
    - `producerMessages` (table)
  - Ajouter les indexes/contraintes “au bon endroit” (Drizzle vs SQL migrations, selon stratégie P7.2-T04).
- **Critères d’acceptation**
  - `pnpm --filter @make-the-change/core type-check` passe.

#### P7.2-T02 — Typer les views publiques `public_user_profiles` et `public_user_rankings`
- **Type** : Backend
- **Priorité** : P2
- **Estimation** : M
- **Dépendances** : P7.0-T01
- **But** : stabiliser les champs consommés par web-client/mobile.
- **Tâches**
  - Définir types “read-only” (Drizzle view ou table proxy).
  - Mettre à jour la doc interne : colonnes garanties.
- **Critères d’acceptation**
  - Le code qui consomme ces vues compile avec types stricts.

#### P7.2-T03 — Normaliser les schémas Supabase (`public` vs `commerce`)
- **Type** : Backend
- **Priorité** : P1
- **Estimation** : M
- **Dépendances** : P7.0-T01
- **But** : éviter les requêtes sur la mauvaise table.
- **Tâches**
  - Décider la “surface PostgREST” :
    - accès client via `public_*` views (recommandé),
    - accès serveur via tables `commerce.*` / `investment.*`.
  - Mettre à jour les accès Supabase existants :
    - webhooks : `.schema('commerce')` si nécessaire,
    - admin : s’assurer que les tables ciblées sont correctes.
- **Critères d’acceptation**
  - Aucun `.from('products')` “ambigu” côté client; les listes publiques passent par `public_products`.

#### P7.2-T04 — Outillage migrations : choisir et standardiser (Drizzle vs Supabase)
- **Type** : Ops/Backend
- **Priorité** : P1
- **Estimation** : L
- **Dépendances** : P7.0-T02
- **But** : versionner tables/views/policies/triggers proprement.
- **Décision**
  - **Option A** : Supabase migrations (`supabase/migrations/*`) pour SQL (policies, triggers, views) + Drizzle pour types.
  - **Option B** : Drizzle migrations pour tables + SQL annexes versionnées à côté (moins naturel pour RLS).
- **Tâches**
  - Documenter le flux “staging → prod”.
  - Ajouter scripts `pnpm db:migrate:staging` / `pnpm db:migrate:prod` (si souhaité).
- **Critères d’acceptation**
  - Une migration P7 (ledger/trigger) est rejouable et auditée.

#### P7.2-T05 — Refresh leaderboard (MV) : stratégie + automatisation
- **Type** : DB/Ops
- **Priorité** : P2
- **Estimation** : M
- **Dépendances** : existence MV
- **But** : leaderboard à jour sans opération manuelle.
- **Tâches**
  - Choisir exécution :
    - `pg_cron` si dispo,
    - ou cron externe (Vercel/GitHub Actions) qui exécute une requête SQL sécurisée.
  - Définir fréquence : 10–60 min.
  - Assurer `CONCURRENTLY` + index nécessaire sur MV.
- **Critères d’acceptation**
  - MV refresh automatique + runbook de vérification.

---

### EPIC P7.3 — Stripe “strict mode” + investissement asynchrone

#### P7.3-T01 — Webhook Stripe : validation Zod des métadonnées + checks de référence
- **Type** : Backend
- **Priorité** : P0
- **Estimation** : M
- **Dépendances** : P7.0-T01
- **But** : refuser tout événement incomplet/malveillant.
- **Tâches**
  - Implémenter un schema Zod pour `metadata` :
    - `user_id` uuid
    - `order_type` ∈ {`investment`, `product_purchase`}
    - `reference_id` uuid
    - `points_used` int string (si `product_purchase`)
  - Vérifier l’existence du `reference_id` :
    - si `investment` → `investment.investments`
    - si `product_purchase` → `commerce.orders`
  - Vérifier cohérence `user_id` :
    - référence appartient au user attendu (si applicable).
- **Critères d’acceptation**
  - Un event avec metadata invalide est loggé et n’applique aucun effet.

#### P7.3-T02 — Webhook idempotent “transactionnel” (anti double-traitement)
- **Type** : DB/Backend
- **Priorité** : P0
- **Estimation** : M
- **Dépendances** : table `stripe_events`
- **But** : empêcher les doubles crédits/débits sous concurrence.
- **Tâches**
  - Ajouter contrainte unique `stripe_events.event_id`.
  - Modifier le handler :
    - tenter insert `stripe_events` d’abord,
    - en cas de conflit unique → retourner 200 “déjà traité”.
  - Encapsuler “insert stripe_events + add_points + update investment/order” dans une transaction (si exécuté côté DB / ou côté app si possible).
- **Critères d’acceptation**
  - Deux requêtes concurrentes sur le même event n’appliquent qu’un seul effet.

#### P7.3-T03 — Investissement : passer à `PENDING` puis activation webhook
- **Type** : Backend/DB
- **Priorité** : P0
- **Estimation** : L
- **Dépendances** : P7.3-T01, P7.3-T02, P7.1 ledger stable
- **But** : aucun investissement “actif” sans confirmation Stripe.
- **Tâches**
  - DB :
    - s’assurer que `investment_status_enum` contient `pending` (déjà le cas dans Drizzle).
    - ajouter si nécessaire un lien `stripe_payment_intent_id` dans `investment.investments` (décision).
  - Web-client :
    - remplacer `createInvestmentAction` par un flow “créer pending + créer PaymentIntent” via Route Handler.
  - Webhook :
    - sur `payment_intent.succeeded` (investment) :
      - passer investment à `active`,
      - créditer points via ledger (`add_points`),
      - mettre à jour `current_funding` projet si applicable (option).
- **Critères d’acceptation**
  - Un investissement n’apparaît “actif” qu’après event Stripe validé.

#### P7.3-T04 — UI web-client : états “pending/failed/success” pour investissement
- **Type** : Frontend
- **Priorité** : P1
- **Estimation** : M
- **Dépendances** : P7.3-T03
- **But** : UX claire + pas de “points instantanés” sans confirmation.
- **Tâches**
  - Afficher état pending après init PaymentIntent.
  - Afficher succès quand webhook a activé (polling, revalidation, ou refresh).
  - Afficher erreur si Stripe échoue.
- **Critères d’acceptation**
  - Parcours complet validé en staging avec un PI Stripe test.

#### P7.3-T05 — Observabilité Stripe : logs structurés + alerting
- **Type** : Ops
- **Priorité** : P1
- **Estimation** : M
- **Dépendances** : P7.3-T02
- **But** : diagnostiquer rapidement les anomalies.
- **Tâches**
  - Log minimal :
    - `event_id`, `type`, `order_type`, `reference_id`, résultat (appliqué / ignoré / invalide).
  - Compteurs :
    - taux d’événements invalides,
    - erreurs RPC `add_points`,
    - drift détecté (si job).
- **Critères d’acceptation**
  - Dashboard/console consultable + runbook “que faire si…”.

---

### EPIC P7.4 — Checkout atomique (fonction SQL) + refactor app

#### P7.4-T01 — Spécifier la fonction DB `commerce.checkout_points()`
- **Type** : DB
- **Priorité** : P0
- **Estimation** : M
- **Dépendances** : ledger stable (P7.1)
- **But** : une seule transaction DB pour “réserver stock + créer commande + débiter points”.
- **Signature proposée**
  - `checkout_points(p_items jsonb, p_shipping_address jsonb, p_idempotency_key text) returns uuid`
- **Règles**
  - Vérifier stock (row locks) :
    - stock null = illimité,
    - sinon `stock_quantity >= qty`.
  - Vérifier solde points :
    - source = ledger (sum deltas) ou cache metadata,
    - verrouiller la ligne profil si nécessaire.
  - Créer :
    - `orders` (status `paid`, payment_method `points`)
    - `order_items` avec snapshot produit (safe)
    - ledger entry débit points (ref order)
  - Mettre à jour :
    - décrément stock (si géré).
- **Critères d’acceptation**
  - Spec revue et validée (dev + DB).

#### P7.4-T02 — Implémenter `checkout_points()` + tests de concurrence
- **Type** : DB
- **Priorité** : P0
- **Estimation** : XL
- **Dépendances** : P7.4-T01
- **But** : supprimer les états partiels en cas d’échec.
- **Tâches**
  - Implémenter en PL/pgSQL :
    - transaction,
    - `FOR UPDATE`/`SKIP LOCKED` si nécessaire,
    - idempotence par `p_idempotency_key`.
  - Scénarios :
    - stock insuffisant,
    - points insuffisants,
    - double appel (idempotence),
    - concurrence (2 checkouts simultanés sur même stock).
- **Critères d’acceptation**
  - Aucun cas où `orders` existe sans items et sans débit points.

#### P7.4-T03 — Refactor web-client : `placePointsOrderAction` → RPC checkout
- **Type** : Backend/Frontend
- **Priorité** : P0
- **Estimation** : M
- **Dépendances** : P7.4-T02
- **But** : arrêter les écritures multi-étapes côté app.
- **Tâches**
  - Remplacer :
    - insert `orders`, insert `order_items`, update profile metadata
  - Par :
    - appel RPC `checkout_points()`,
    - gestion erreurs typées (`OUT_OF_STOCK`, `INSUFFICIENT_POINTS`, `UNKNOWN`).
  - Retirer toute mise à jour directe de `metadata.points_balance`.
- **Critères d’acceptation**
  - Checkout points fonctionne end-to-end en staging.

#### P7.4-T04 — UI web-client : confirmation + revalidation + affichage solde
- **Type** : Frontend
- **Priorité** : P1
- **Estimation** : M
- **Dépendances** : P7.4-T03
- **But** : cohérence UI après checkout.
- **Tâches**
  - Après succès : revalidate tags/paths dashboard points + orders.
  - Afficher solde issu du cache (metadata) qui est mis à jour par trigger.
- **Critères d’acceptation**
  - Le solde affiché correspond au ledger (diff = 0).

#### P7.4-T05 — Nettoyage : supprimer les chemins legacy de points (si non utilisés)
- **Type** : Backend/Docs
- **Priorité** : P2
- **Estimation** : S
- **Dépendances** : P7.4-T03
- **But** : réduire les surfaces d’erreur.
- **Tâches**
  - Identifier et retirer (ou isoler) les fonctions/actions non utilisées qui écrivent sur `users.points_balance` / `points_transactions`.
  - Mettre à jour docs correspondantes.
- **Critères d’acceptation**
  - Plus aucune écriture “points” hors ledger.

---

## 4) Plan de validation (staging → prod)

### 4.1 Checklists staging
- Ledger : insert → trigger → metadata balance mise à jour.
- Drift : requête “metadata vs ledger” = 0.
- Webhook : idempotence validée (2 appels concurrents).
- Investissement : pending → success Stripe → active + points crédités.
- Checkout points : fonction SQL atomique + idempotence.
- Messaging : spoof insert impossible.

### 4.2 Déploiement prod (proposé)
1) Déployer migrations DB (ledger + trigger + policies) en heure creuse.  
2) Déployer webhook strict mode + idempotence.  
3) Déployer refactor investissement.  
4) Déployer checkout SQL + refactor côté app.  
5) Exécuter backfill (si nécessaire) + audit drift.

### 4.3 Rollback (principes)
- Le rollback doit privilégier :
  - désactivation des nouveaux chemins (feature flag),
  - conservation des données (pas de suppression),
  - script de restauration de `metadata.points_balance` depuis ledger si besoin.

---

## 5) Annexes (à remplir pendant P7.0)

### 5.1 Décisions à acter
- Schéma final de `stripe_events` (public vs commerce) + contraintes.
- Schéma final de `points_ledger` (public vs commerce) + idempotency_key.
- Stratégie migrations (Supabase vs Drizzle).

### 5.2 Liens runbook (SQL)
- Sanity check : `to_regclass(...)`
- Drift check : balance metadata vs SUM(ledger.delta)
- Derniers events Stripe traités

