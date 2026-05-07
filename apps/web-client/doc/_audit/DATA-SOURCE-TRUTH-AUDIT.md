# P0-10 — Source de vérité data à court terme

**Objectif :** clarifier officiellement quelle source de données fait foi à court terme pour travailler sur le prototype Make the Change.

**Contraintes :**
- Ne modifie pas le code applicatif.
- Ne modifie pas les mocks.
- Ne modifie pas Supabase.
- Ne modifie pas Stripe.
- Ne modifie pas les routes.
- Travaille uniquement dans la documentation.

---

## 1. Analyse des mocks principaux

Les mocks sont situés dans `apps/web-client/src/lib/mock/` et constituent la **source prototype** principale du web-client.

### 1.1 Fichiers mocks structurants

| Fichier | Rôle | Taille | Statut |
|---------|------|--------|--------|
| `mock-biodex.ts` | Données espèces, statuts conservation, déblocages | ~68KB | `[ACTUEL_CODE] [SOURCE_PROTOTYPE]` |
| `mock-challenges.ts` | Défis, missions, challenges quotidiens | ~23KB | `[ACTUEL_CODE] [SOURCE_PROTOTYPE]` |
| `mock-projects.ts` (tabs) | Projets producteurs (Antsirabe, Manakara, Sardaigne, Corail...) | ~60KB | `[ACTUEL_CODE] [SOURCE_PROTOTYPE]` |
| `mock-products.ts` (tabs) | Produits boutique (miels, huiles, savons...) | ~25KB | `[ACTUEL_CODE] [SOURCE_PROTOTYPE]` |
| `mock-member-data.ts` | Historique investissements, commandes, transactions | ~17KB | `[ACTUEL_CODE] [SOURCE_PROTOTYPE]` |
| `mock-viewer.ts` | Profils utilisateurs, sessions | ~9KB | `[ACTUEL_CODE] [SOURCE_PROTOTYPE]` |
| `mock-ids.ts` | Identifiants constants référencés dans tout le code | ~9KB | `[ACTUEL_CODE] [SOURCE_PROTOTYPE] [CRITIQUE]` |
| `mock-factions.ts` | Factions et leurs configurations | ~5KB | `[ACTUEL_CODE] [SOURCE_PROTOTYPE] [LEGACY_FACTION]` |
| `mock-session.ts` / `mock-session-server.ts` | Gestion session mock (cookie-based) | ~7KB | `[ACTUEL_CODE] [SOURCE_PROTOTYPE]` |
| `types.ts` | Types TypeScript des mocks | ~3KB | `[ACTUEL_CODE] [SOURCE_PROTOTYPE]` |

### 1.2 Caractéristiques des mocks

**Points forts :**
- Données riches, réalistes et cohérentes pour prototyper
- Support i18n (fr/en) intégré
- Relations entre entités (projet ↔ espèce ↔ producteur ↔ produit)
- Types TypeScript stricts
- Peuvent fonctionner offline/pure-frontend

**Limites :**
- Pas de persistance réelle (sauf cookies session)
- Pas de concurrence/multi-utilisateur
- Pas d'historique transactionnel complet
- Mises à jour manuelles uniquement
- Certaines données désynchronisées avec Supabase legacy

---

## 2. Analyse des services et data-source

### 2.1 Configuration data-source (`data-source.ts`)

```typescript
type AppDataSource = 'mock' | 'supabase'
export const APP_DATA_SOURCE = resolveAppDataSource(process.env.NEXT_PUBLIC_MTC_DATA_SOURCE)
export const isMockDataSource = APP_DATA_SOURCE === 'mock'
```

**Comportement :**
- Défaut = `'mock'` (si variable non set ou valeur invalide)
- Passage à Supabase uniquement via `NEXT_PUBLIC_MTC_DATA_SOURCE=supabase`
- Runtime constant (décidé au build/serveur, pas dynamique par utilisateur)

### 2.2 Services hybrides principaux

Les services suivants implémentent une logique **hybride mock/Supabase** :

| Service | Fichier | Logique | Statut |
|---------|---------|---------|--------|
| `getProjects` | `get-projects.ts` | Si `isMockDataSource` → mocks ; sinon Supabase avec merge (mock prioritaire) | `[ACTUEL_CODE] [HYBRIDE]` |
| `getProducts` | `get-products.ts` | Si `isMockDataSource` → mocks ; sinon Supabase avec merge page 1 | `[ACTUEL_CODE] [HYBRIDE]` |
| `getSpeciesContext` | `species-context.service.ts` | Si `isMockDataSource` → mocks ; sinon vue Supabase `v_species_context` | `[ACTUEL_CODE] [HYBRIDE]` |
| `getBiodexPreviewData` | `biodex-preview.service.ts` | Appelle `getSpeciesContextList()` + fallback si vide | `[ACTUEL_CODE] [HYBRIDE]` |
| `getCurrentProfile` | `mock-session-server.ts` | Mock session + overrides (toujours mock) | `[ACTUEL_CODE] [SOURCE_PROTOTYPE]` |
| Auth/actions | `actions.ts` | Mock login/cookie ou Supabase selon source | `[ACTUEL_CODE] [HYBRIDE]` |

### 2.3 Routes API

| Route | Source de données | Statut |
|-------|-------------------|--------|
| `GET /api/projects` | Supabase `public_projects` uniquement | `[ACTUEL_CODE] [LEGACY]` |
| `GET /api/projects/featured` | Supabase | `[ACTUEL_CODE] [LEGACY]` |
| `GET /api/products` | Supabase | `[ACTUEL_CODE] [LEGACY]` |
| `GET /api/partners` | Supabase | `[ACTUEL_CODE] [LEGACY]` |
| `POST /api/payments/create-intent` | Stripe réel | `[ACTUEL_CODE] [REEL]` |
| `POST /api/payments/mobile-sheet` | Stripe réel | `[ACTUEL_CODE] [REEL]` |
| `POST /api/webhooks/stripe` | Supabase RPC + Stripe | `[ACTUEL_CODE] [REEL] [HYBRIDE]` |
| `POST /api/revalidate` | Next.js cache | `[ACTUEL_CODE]` |

**Anomalie :** Les routes API `/api/projects`, `/api/products` lisent directement Supabase **sans vérifier** `isMockDataSource`. Elles bypassent la logique hybride des services.

---

## 3. Analyse de Supabase

### 3.1 Tables/Vues utilisées

| Entité | Vue/Table Supabase | Usage dans code | Statut |
|--------|-------------------|-----------------|--------|
| Projets | `public_projects` | Routes API + `get-projects.ts` (fallback) | `[ACTUEL_CODE] [LEGACY]` |
| Producteurs | `public_producers` | Jointure projets/produits | `[ACTUEL_CODE] [LEGACY]` |
| Produits | `public_products` | Routes API + `get-products.ts` | `[ACTUEL_CODE] [LEGACY]` |
| Espèces | `v_species_context` | `species-context.service.ts` | `[ACTUEL_CODE] [LEGACY]` |
| Profils | `profiles` | Auth, webhook Stripe | `[ACTUEL_CODE] [LEGACY]` |
| Donations | `donations` | Webhook Stripe | `[ACTUEL_CODE] [LEGACY]` |
| Investissements | `investments` | Webhook Stripe, historique | `[ACTUEL_CODE] [LEGACY]` |
| Commandes | `orders` | Partiel | `[ACTUEL_CODE] [LEGACY]` |

### 3.2 Types générés (`generated-types.ts`)

- Générés automatiquement depuis le schéma Supabase legacy.
- Utilisés pour typer les réponses Supabase.
- **Ne pas modifier** car ils reflètent le legacy V0.

### 3.3 Clients Supabase

| Client | Usage | Localisation |
|--------|-------|--------------|
| `createClient()` | Server-side (actions, RSC) | `@/lib/supabase/server` |
| `createStaticClient()` | Static/fetch caching | `@/lib/supabase/static` |
| `supabaseAdmin` | Webhooks, admin ops | `@/lib/supabase/admin` |

---

## 4. Zones hybrides et risques

### 4.1 Zones les plus risquées

| Zone | Risque | Impact |
|------|--------|--------|
| **Merge mock + Supabase** | Doublons possibles (même slug dans mock et DB) | UX confuse, données incohérentes |
| **Routes API vs Services** | Routes API ignorent `isMockDataSource` | Comportement différent SSR vs API |
| **Species fallback** | `ensurePrototypeUnlockedSpecies()` crée un unlock artificiel | Fausse perception du déblocage BioDex |
| **Session mock** | Cookie-based, pas de vraie auth | Sécurité, persistance limitée |
| **Points/Crédits** | `points` dans mocks vs `impact_credits` cible | Confusion terminologique |
| **Webhook Stripe → Supabase** | Écrit dans Supabase legacy | Données legacy irréalistes |

### 4.2 Risque critique : désynchronisation mock ↔ Supabase

**Problème :** Les mocks et Supabase contiennent des données similaires mais pas identiques.

Exemple :
- Mock : projet `ruchers-apiculteurs-independants-antsirabe` avec funding €390/€780
- Supabase : même slug mais funding différent ou absent
- Résultat : comportement différent selon `NEXT_PUBLIC_MTC_DATA_SOURCE`

---

## 5. Doctrine de source de vérité

### 5.1 Court terme (P0-P1) — Par contexte

**`[CIBLE_VALIDEE]`**

| Contexte | Source de vérité | Statut |
|----------|------------------|--------|
| **Décisions produit, business, impact, gamification, wording** | Docs récentes (00-11, 99), surtout `03-DECISIONS-VALIDEES.md` | `[CIBLE_VALIDEE]` |
| **État technique réel** | Code actuel observé | `[ACTUEL_CODE]` |
| **Données prototype, besoins UX, flows** | Mocks (`src/lib/mock/`) | `[ACTUEL_CODE] [SOURCE_PROTOTYPE]` |
| **Historique backend / dashboard admin** | Supabase legacy V0 uniquement comme état legacy | `[ACTUEL_CODE] [LEGACY] [A_NE_PAS_TOUCHER]` |

### 5.2 En cas de contradiction

**Si code et doc se contredisent :**
1. Ne pas modifier directement
2. Signaler l'écart dans `_audit/CODE-VS-DOC.md`
3. Classer avec les tags appropriés :
   - `[ACTUEL_CODE]` = réalité
   - `[CIBLE_VALIDEE]` = cible validée
   - `[A_MIGRER_PLUS_TARD]` = migration future
   - `[RISQUE]` = incohérence problématique

**Si mock et cible produit se contredisent :**
1. Conserver le mock tant que le prototype en dépend
2. Documenter la dette dans `DATA-SOURCE-TRUTH-AUDIT.md`
3. Préparer une migration data V2 plus tard

**Si Supabase legacy et cible se contredisent :**
1. **Ne pas modifier Supabase**
2. Documenter l'écart comme legacy attendu
3. La future DB V2 résoudra la divergence

### 5.3 Préparation DB V2 (P2+)

**Conditions préalables :**
- Flows validés par test terrain
- Mocks stabilisés (pas de changement structurel fréquent)
- Besoins data clairement documentés (via présent audit)
- Règles produit validées (P0-1 à P0-9)
- Dashboard admin refondu (pas legacy)

**Ne pas faire maintenant :**
- ❌ Créer une nouvelle base sans cadrage
- ❌ Migrer les données legacy automatiquement
- ❌ Adapter les mocks à Supabase legacy
- ❌ Supprimer les mocks avant d'avoir une source fiable

---

## 6. Réponses aux 10 questions

### 1. Quelle source de données fait foi pour le prototype court terme ?

**`[CIBLE_VALIDEE]`** Doctrine par contexte :

- **Pour les décisions produit, business, impact, gamification et wording** : les docs récentes font foi, surtout `03-DECISIONS-VALIDEES.md`.
- **Pour l'état technique réel** : le code actuel fait foi (`[ACTUEL_CODE]`).
- **Pour les données prototype et les besoins UX** : les mocks font foi (`[SOURCE_PROTOTYPE]`).
- **Pour l'historique backend / dashboard admin** : Supabase legacy fait foi uniquement comme état legacy, pas comme cible (`[LEGACY]`).

### 2. Quel rôle joue Supabase aujourd'hui ?

**`[ACTUEL_CODE] [LEGACY] [A_NE_PAS_TOUCHER]`**

- Rôle : garder le dashboard admin legacy fonctionnel
- Ne pas utiliser comme modèle cible pour le produit
- Ne pas y adapter le client comme si c'était définitif
- Webhooks Stripe écrivent dedans (legacy, à migrer plus tard)
- Routes API publiques y accèdent (à unifier avec services)

### 3. Quel rôle jouent les mocks aujourd'hui ?

**`[ACTUEL_CODE] [SOURCE_PROTOTYPE]`**

- Source primaire pour prototyper les écrans
- Stabiliser les flows utilisateur
- Comprendre les vrais besoins data
- Tester l'UX sans dépendances backend
- Une entrée majeure pour concevoir la future DB V2, mais le schéma final devra être déduit des flows validés, des décisions produit, des besoins du futur dashboard admin et des contraintes techniques

### 4. Quel rôle joue la documentation ?

**`[CIBLE_VALIDEE]`**

- Centralise les décisions produit (P0-1 à P0-9)
- Définit les règles business, impact, gamification
- Documente les écarts code/mocks/legacy
- Guide les choix de migration
- Référence pour humains et IA

### 5. Quel rôle joue le code actuel ?

**`[ACTUEL_CODE]`**

- Réalité technique vérifiable
- Implémentation des flows (même si hybride/incomplete)
- Source pour identifier les zones à refactorer
- Doit être lu avant de prendre des décisions de migration

### 6. Que doit faire une IA si le code, les mocks et la doc se contredisent ?

**`[CIBLE_VALIDEE]`**

1. **Lire le code** pour comprendre la réalité
2. **Vérifier la doc** pour les décisions validées
3. **Classer l'écart** avec les tags standards :
   - `[ACTUEL_CODE]` = réalité
   - `[CIBLE_VALIDEE]` = cible validée
   - `[A_MIGRER_PLUS_TARD]` = migration future
   - `[RISQUE]` = incohérence bloquante
4. **Ne pas modifier** directement pour forcer l'alignement
5. **Documenter** dans `_audit/CODE-VS-DOC.md` ou présent fichier
6. **Signaler** à l'utilisateur si incohérence majeure

### 7. Quels fichiers mocks sont les plus structurants ?

**`[SOURCE_PROTOTYPE] [CRITIQUE]`**

| Fichier | Pourquoi critique |
|---------|-------------------|
| `mock-ids.ts` | IDs référencés dans tout le code (projets, produits, espèces, producteurs). Changement = cascade massive. |
| `mock-biodex.ts` | BioDex complet, règles de déblocage, espèces liées aux projets. Cœur de la gamification. |
| `mock-projects.ts` | Projets liés aux producteurs, espèces, dons, investissements. Cœur de l'impact. |
| `mock-products.ts` | Catalogue boutique, prix, variants. Cœur de l'économie. |
| `mock-member-data.ts` | Historique transactions, commandes, investissements. Cœur du wallet. |

### 8. Quels services sont hybrides ?

**`[ACTUEL_CODE] [HYBRIDE]`**

| Service | Pattern hybride | Risque |
|---------|-----------------|--------|
| `getProjects` | Mock prioritaire + merge Supabase | Doublons si même slug |
| `getProducts` | Mock prioritaire + merge Supabase page 1 | Pagination incohérente |
| `getSpeciesContext` | Mock complet OU Supabase vue | Fallback prototype qui unlock artificiellement |
| `getBiodexPreviewData` | Wrapper + fallback si vide | Masque des problèmes de data |

### 9. Qu'est-ce qu'il ne faut surtout pas migrer maintenant ?

**`[INTERDIT] [A_NE_PAS_TOUCHER]`**

| Élément | Pourquoi ne pas toucher |
|---------|------------------------|
| **Supabase legacy V0** | Dashboard admin dépendant, risque de casser l'admin existant |
| **Generated types** | Auto-générés, reflètent le legacy, pas la cible |
| **Tables `investments`, `donations`** | Stripe webhooks y écrivent, migration complexe |
| **Mock → Supabase sync** | Trop tôt, pas de schéma cible validé |
| **Suppression des mocks** | Rien ne remplit encore leur rôle |
| **Migration globale `points`** | Classification par famille requise (P0-3) |
| **Rename routes `/invest`** | P0-2 planifié mais pas exécuté maintenant |

### 10. Comment préparer progressivement une DB V2 propre ?

**`[A_PLANIFIER]`**

1. **Stabiliser les mocks** (pas de changement structurel majeur)
2. **Documenter les besoins** via présent audit
3. **Valider les flows** avec tests terrain/utilisateurs
4. **Définir le schéma cible** à partir des mocks utilisés + décisions P0
5. **Concevoir dashboard admin V2** séparément du legacy
6. **Planifier migration** en phases :
   - Phase 1 : Dual-write (écrire dans les deux)
   - Phase 2 : Read-from-V2 avec fallback V1
   - Phase 3 : Décommission V1

---

## 7. Classification des zones

### `[ACTUEL_CODE] [SOURCE_PROTOTYPE]` — Mocks

- `src/lib/mock/mock-*.ts` (tous)
- `src/app/[locale]/(tabs)/projects/_features/mock-projects.ts`
- `src/app/[locale]/(tabs)/products/_features/mock-products.ts`

### `[ACTUEL_CODE] [HYBRIDE]` — Services à double source

- `src/app/[locale]/(tabs)/projects/_features/get-projects.ts`
- `src/app/[locale]/(tabs)/products/_features/get-products.ts`
- `src/lib/api/species-context.service.ts`
- `src/lib/api/biodex-preview.service.ts`
- Auth actions (`src/app/[locale]/(auth)/actions.ts`)

### `[ACTUEL_CODE] [LEGACY]` — Supabase seul

- Routes API : `/api/projects`, `/api/products`, `/api/partners`
- Webhook Stripe : écriture Supabase
- Dashboard admin legacy

### `[ACTUEL_CODE] [REEL]` — Stripe

- `src/app/api/payments/create-intent/route.ts`
- `src/app/api/payments/mobile-sheet/route.ts`
- `src/app/api/webhooks/stripe/route.ts`

### `[ACTUEL_CODE] [RISQUE]` — Zones à surveiller

- Merge mock/Supabase avec possibilité de doublons
- Fallback BioDex qui unlock artificiellement
- Routes API qui ignorent `isMockDataSource`
- Points vs Credits Impact (terminologie)

---

## 8. Décisions validables maintenant

### `[CIBLE_VALIDEE]`

1. **Source de vérité court terme :** mocks
2. **Supabase :** legacy à ne pas toucher
3. **Stratégie V2 :** pas maintenant, préparation uniquement
4. **Gestion des contradictions :** documenter, classifier, ne pas forcer
5. **Mocks structurants :** stabiliser `mock-ids.ts`, `mock-biodex.ts`, `mock-projects.ts`

### `[A_DECIDER]`

1. Timing de la stabilisation des mocks (quand figer la structure ?)
2. Stratégie de résolution des doublons mock/Supabase
3. Uniformisation des routes API avec `isMockDataSource`

### `[A_PLANIFIER]`

1. Schéma cible DB V2 (après stabilisation mocks)
2. Migration progressive mock → V2
3. Dashboard admin refondu

---

## 9. Éléments encore à décider

| ID | Question | Domaine |
|----|----------|---------|
| P0-10a | Quand figer la structure des mocks ? | Produit / data |
| P0-10b | Comment gérer les doublons mock/Supabase ? | Technique |
| P0-10c | Les routes API doivent-elles aussi être hybrides ? | Architecture |
| P0-11 | Stratégie future DB V2 complète | Data / admin |

---

## 10. Synthèse et recommandation

### Source de vérité recommandée (doctrine par contexte)

**Court terme (P0-P1) :**

| Contexte | Source | Statut |
|----------|--------|--------|
| Décisions produit, business, impact, gamification, wording | Docs récentes (00-11, 99), surtout `03-DECISIONS-VALIDEES.md` | `[CIBLE_VALIDEE]` |
| État technique réel | Code actuel observé | `[ACTUEL_CODE]` |
| Données prototype, besoins UX, flows | Mocks | `[ACTUEL_CODE] [SOURCE_PROTOTYPE]` |
| Historique backend / dashboard admin | Supabase legacy V0 uniquement | `[ACTUEL_CODE] [LEGACY] [A_NE_PAS_TOUCHER]` |

### Prochaine étape recommandée

**P0-10a — Quand et comment stabiliser les mocks critiques ?**

À traiter avant P0-11 :
- Timing de gel de la structure des 5 mocks critiques
- Stratégie de résolution des doublons mock/Supabase
- Uniformisation éventuelle des routes API

**P0-11 — Stratégie future DB V2** (seulement après P0-10a stabilisé)

Conditions de déclenchement :
- Mocks stabilisés (P0-10a traité)
- Flows validés terrain
- Dashboard admin cible défini
- Schéma data cible documenté

---

**Statut :** `[AUDITE]` P0-10 complet.

**Fichiers audités :**
- `src/lib/mock/data-source.ts`
- `src/lib/mock/mock-*.ts` (19 fichiers)
- `src/app/[locale]/(tabs)/projects/_features/mock-projects.ts`
- `src/app/[locale]/(tabs)/projects/_features/get-projects.ts`
- `src/app/[locale]/(tabs)/products/_features/mock-products.ts`
- `src/app/[locale]/(tabs)/products/_features/get-products.ts`
- `src/lib/api/species-context.service.ts`
- `src/lib/api/biodex-preview.service.ts`
- `src/app/api/*/route.ts` (11 routes)
- `src/lib/supabase/*` (clients et types)

**Risques identifiés :** 7 (merge doublons, routes API bypass, fallback BioDex, session mock, terminologie points/crédits, webhook legacy, désynchro data)

**Recommandation immédiate :** Stabiliser les 5 mocks critiques avant toute migration.
