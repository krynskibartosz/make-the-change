# Classification R5 — Champs Legacy Points/Investment

**Date :** 2026-05-07  
**Portée :** `apps/web-client` — Mocks et structures locales  
**Statut :** `[DOCUMENTATION]` — Référence pour migrations futures

---

## 1. Principes de classification

| Tag | Signification |
|-----|---------------|
| `[CREDITS_IMPACT_CLAIR]` | Champ = Credits Impact (montant, solde, prix) |
| `[SEEDS_CLAIR]` | Champ = Graines (progression, récompense) |
| `[EUR_CLAIR]` | Champ = Euros (montant en devise FIAT) |
| `[METRIQUE_IMPACT]` | Champ = Métrique pédagogique (abeilles, CO2, etc.) |
| `[LEGACY_COMPAT]` | Champ à garder pour compatibilité, usage legacy |
| `[A_MIGRER_PLUS_TARD]` | Champ à migrer dans phase ultérieure |
| `[A_NE_PAS_TOUCHER]` | Champ lié à Supabase/Stripe — ne pas modifier |
| `[AMBIGU]` | Champ dont la sémantique dépend du contexte |

---

## 2. Classification par structure

### 2.1 `NormalizedInvestment` (investments/page.tsx)

| Champ | Type | Classification | Justification |
|-------|------|----------------|---------------|
| `id` | `string` | `[LEGACY_COMPAT]` | Identifiant technique |
| `amount_eur` | `number` | `[EUR_CLAIR]` | Montant euros contribué (P0-1) |
| `amount_points` | `number` | `[CREDITS_IMPACT_CLAIR]` | Credits Impact reçus (P0-3) |
| `status` | `string` | `[LEGACY_COMPAT]` | Statut technique |
| `created_at` | `string` | `[LEGACY_COMPAT]` | Timestamp |
| `project.name_default` | `string \| null` | `[LEGACY_COMPAT]` | Nom projet legacy |
| `project.slug` | `string \| null` | `[LEGACY_COMPAT]` | Slug projet |
| `type: 'investment'` | literal | `[LEGACY_COMPAT]` | Tag legacy — ne pas afficher |

**Note :** `amount_points` dans `NormalizedInvestment` = Credits Impact (P0-3).
Le soutien producteur donne des Credits Impact, pas de Graines (sauf bonus symbolique).

---

### 2.2 `NormalizedDonation` (investments/page.tsx)

| Champ | Type | Classification | Justification |
|-------|------|----------------|---------------|
| `id` | `string` | `[LEGACY_COMPAT]` | Identifiant technique |
| `amount_eur` | `number` | `[EUR_CLAIR]` | Montant euros donné (P0-1) |
| `amount_points` | `number` | `[SEEDS_CLAIR]` | Graines reçues (P0-1) |
| `status` | `string` | `[LEGACY_COMPAT]` | Statut technique |
| `created_at` | `string` | `[LEGACY_COMPAT]` | Timestamp |
| `type: 'donation'` | literal | `[LEGACY_COMPAT]` | Tag legacy — ne pas afficher |

**Note :** `amount_points` dans `NormalizedDonation` = Graines (P0-1).
Le don pur donne des Graines, pas de Credits Impact.

---

### 2.3 `MockInvestmentRecord` (mock-member-data.ts)

| Champ | Type | Classification | Justification |
|-------|------|----------------|---------------|
| `id` | `string` | `[LEGACY_COMPAT]` | Identifiant technique |
| `amount_eur_equivalent` | `number` | `[EUR_CLAIR]` | Montant euros (P0-1) |
| `amount_points` | `number` | `[CREDITS_IMPACT_CLAIR]` | Credits Impact reçus (P0-3) |
| `returns_received_points` | `number` | `[AMBIGU_A_CLASSIFIER]` | Historique "retours" — usage à clarifier |
| `status` | `'active' \| 'completed' \| 'pending'` | `[LEGACY_COMPAT]` | Statut |
| `created_at` | `string` | `[LEGACY_COMPAT]` | Timestamp |
| `project.name_default` | `string` | `[LEGACY_COMPAT]` | Nom projet |
| `project.slug` | `string` | `[LEGACY_COMPAT]` | Slug projet |
| `project.status` | `string` | `[LEGACY_COMPAT]` | Statut projet |
| `project.cover_image_url` | `string \| null` | `[LEGACY_COMPAT]` | Image projet |

**Note :** `returns_received_points` = historique "retours perçus" legacy.
À classifier selon future décision métier (probablement Credits Impact historique).

---

### 2.4 `MockOrderRecord` / `MockOrderItemRecord` (mock-member-data.ts)

| Champ | Type | Classification | Justification |
|-------|------|----------------|---------------|
| `subtotal_points` | `number` | `[CREDITS_IMPACT_CLAIR]` | Sous-total Credits Impact |
| `shipping_cost_points` | `number` | `[CREDITS_IMPACT_CLAIR]` | Frais port Credits Impact |
| `tax_points` | `number` | `[CREDITS_IMPACT_CLAIR]` | Taxes Credits Impact |
| `total_points` | `number` | `[CREDITS_IMPACT_CLAIR]` | Total Credits Impact (P0-3) |
| `subtotal_euros` | `number` | `[EUR_CLAIR]` | Sous-total euros |
| `shipping_cost_euros` | `number` | `[EUR_CLAIR]` | Frais port euros |
| `tax_euros` | `number` | `[EUR_CLAIR]` | Taxes euros |
| `total_euros` | `number` | `[EUR_CLAIR]` | Total euros |
| `unit_price_points` | `number` | `[CREDITS_IMPACT_CLAIR]` | Prix unitaire Credits Impact |
| `total_price_points` | `number` | `[CREDITS_IMPACT_CLAIR]` | Prix total Credits Impact |
| `product_snapshot.pricePoints` | `number` | `[CREDITS_IMPACT_CLAIR]` | Snapshot prix Credits Impact |

---

### 2.5 `MockSubscriptionRecord` (mock-member-data.ts)

| Champ | Type | Classification | Justification |
|-------|------|----------------|---------------|
| `monthly_points_allocation` | `number` | `[CREDITS_IMPACT_CLAIR]` | Allocation mensuelle Credits Impact (P0-3) |
| `monthly_price` | `number` | `[EUR_CLAIR]` | Prix mensuel euros |
| `annual_price` | `number` | `[EUR_CLAIR]` | Prix annuel euros |

---

### 2.6 `MockPointsTransactionRecord` (mock-member-data.ts)

| Champ | Type | Classification | Justification |
|-------|------|----------------|---------------|
| `delta` | `number` | `[AMBIGU]` | Variation — peut être Credits ou Graines selon label |
| `impactDelta` | `number` | `[CREDITS_IMPACT_CLAIR]` | Impact en Credits Impact |
| `label` | `string` | `[LEGACY_COMPAT]` | Description transaction |

**Règle de résolution :**
- Si `label` contient "Contribution" → `delta` = Credits Impact
- Si `label` contient "Commande" → `delta` = Credits Impact (dépense)
- Si `label` contient "Eco-Fact", "Récolte", "Serie" → `delta` = Graines

---

### 2.7 `Profile` (mock/types.ts)

| Champ | Type | Classification | Justification |
|-------|------|----------------|---------------|
| `points` | `number` | `[CREDITS_IMPACT_CLAIR]` | Solde Credits Impact utilisateur (P0-3) |
| `totalSeedsContributed` | `number` | `[SEEDS_CLAIR]` | Total Graines contribuées |
| `beesSaved` | `number` | `[METRIQUE_IMPACT]` | Métrique pédagogique abeilles |
| `honeyGeneratedKg` | `number` | `[METRIQUE_IMPACT]` | Métrique pédagogique miel |
| `co2CapturedKg` | `number` | `[METRIQUE_IMPACT]` | Métrique pédagogique CO2 |
| `streakDays` | `number` | `[SEEDS_CLAIR]` | Gamification — lié aux Graines |

---

### 2.8 `Challenge` (mock/types.ts)

| Champ | Type | Classification | Justification |
|-------|------|----------------|---------------|
| `reward` | `number` | `[SEEDS_CLAIR]` | Récompense en Graines (Academy) |

---

### 2.9 `SeasonStats` (mock/types.ts)

| Champ | Type | Classification | Justification |
|-------|------|----------------|---------------|
| `totalSeeds` | `number` | `[SEEDS_CLAIR]` | Total Graines de la faction |
| `contributions` | `number` | `[LEGACY_COMPAT]` | Nombre contributions |
| `engagementScore` | `number` | `[SEEDS_CLAIR]` | Score engagement gamification |

---

## 3. Table de correspondance sémantique

| Champ Legacy | Nomenclature cible (P0-3) | Contexte |
|--------------|---------------------------|----------|
| `points` (Profile) | `impactCredits` / `impact_credits` | Solde Credits Impact |
| `amount_points` (soutien) | `impactCredits` / `impact_credits` | Montant reçu |
| `amount_points` (don) | `seeds` / `graines` | Récompense don |
| `price_points` | `impactCreditsPrice` / `impact_credits_price` | Prix produit |
| `total_points` | `impactCreditsTotal` / `impact_credits_total` | Total commande |
| `monthly_points_allocation` | `monthlyImpactCredits` / `monthly_impact_credits` | Abonnement |
| `returns_received_points` | `historicalReturns` / `returns_impact_credits` | À clarifier |
| `investment` | `producerSupport` / `producer_support` | Soutien producteur |
| `reward` (challenge) | `seedsReward` / `seeds_reward` | Récompense Academy |

---

## 4. Zones à ne pas toucher

| Structure | Raison |
|-----------|--------|
| Supabase `investments` table | `[A_NE_PAS_TOUCHER]` Legacy V0 |
| Supabase `orders` table | `[A_NE_PAS_TOUCHER]` Legacy V0 |
| Stripe metadata `order_type` | `[A_NE_PAS_TOUCHER]` Compatibilité paiements |
| `create-investment.action.ts` | `[A_NE_PAS_TOUCHER]` Stripe + Supabase |
| Routes `/invest`, `/profile/investments` | `[A_NE_PAS_TOUCHER]` R5B à planifier |

---

## 5. Résumé par catégorie

### `[CREDITS_IMPACT_CLAIR]` — Credits Impact
- `amount_points` (soutien, commande)
- `price_points` / `unit_price_points` / `total_price_points`
- `total_points` / `subtotal_points` / `shipping_cost_points` / `tax_points`
- `monthly_points_allocation`
- `impactDelta`
- `Profile.points` (solde)

### `[SEEDS_CLAIR]` — Graines
- `amount_points` (don)
- `reward` (challenge)
- `totalSeedsContributed`
- `totalSeeds` (faction)
- `streakDays`, `engagementScore`

### `[METRIQUE_IMPACT]` — Métriques pédagogiques
- `beesSaved`
- `honeyGeneratedKg`
- `co2CapturedKg`

### `[EUR_CLAIR]` — Euros
- `amount_eur` / `amount_eur_equivalent`
- `subtotal_euros` / `total_euros` / etc.
- `monthly_price` / `annual_price`

### `[AMBIGU]` — À résoudre par contexte
- `delta` (PointsTransaction — dépend du label)
- `returns_received_points` (à clarifier métier)

---

*Tags :* `[R5]` `[CLASSIFICATION]` `[P0-3]` `[MOCKS]` `[LEGACY]` `[ADAPTERS]`
