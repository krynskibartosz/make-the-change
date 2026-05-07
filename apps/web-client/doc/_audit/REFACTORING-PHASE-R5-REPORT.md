# Rapport de Phase R5 — Stabilisation Mocks et Adapters

**Date :** 2026-05-07  
**Portée :** `apps/web-client`  
**Statut :** `[VALIDEE]` — Stabilisation mocks et création adapters

---

## 1. Résumé de R5

La phase R5 avait pour objectif de stabiliser les mocks critiques et de créer les adapters nécessaires pour utiliser le mapper `mapInvestmentToProducerSupport()` dans les composants UI.

**Philosophie R5 :**
- Documenter exhaustivement la classification des champs legacy
- Créer des adapters non destructeurs (types sources inchangés)
- Préparer l'utilisation réelle du mapper en R6
- Ne pas modifier Supabase, routes, ni structures legacy

---

## 2. État des structures auditées

### 2.1 Structures locales analysées

| Structure | Fichier | Usage | Statut |
|-----------|---------|-------|--------|
| `NormalizedInvestment` | `investments/page.tsx` | Normalisation Supabase/mock → UI | `[LEGACY_COMPAT]` |
| `NormalizedDonation` | `investments/page.tsx` | Normalisation Supabase/mock → UI | `[LEGACY_COMPAT]` |
| `NormalizedOrder` | `investments/page.tsx` | Normalisation Supabase/mock → UI | `[LEGACY_COMPAT]` |
| `MockInvestmentRecord` | `mock-member-data.ts` | Données mock investissement | `[LEGACY_COMPAT]` |
| `MockOrderRecord` | `mock-member-data.ts` | Données mock commande | `[LEGACY_COMPAT]` |
| `MockSubscriptionRecord` | `mock-member-data.ts` | Données mock abonnement | `[LEGACY_COMPAT]` |
| `MockPointsTransactionRecord` | `mock-member-data.ts` | Données mock transaction | `[LEGACY_COMPAT]` |
| `Profile` | `mock/types.ts` | Profil utilisateur mock | `[LEGACY_COMPAT]` |

### 2.2 Classification des champs sensibles

| Champ | Structure | Classification | Nomenclature cible |
|-------|-----------|----------------|-------------------|
| `amount_points` (soutien) | `NormalizedInvestment` | `[CREDITS_IMPACT_CLAIR]` | `impactCredits` |
| `amount_points` (don) | `NormalizedDonation` | `[SEEDS_CLAIR]` | `seeds` |
| `amount_eur` | `NormalizedInvestment` | `[EUR_CLAIR]` | `amountEuros` |
| `price_points` | `MockOrderItemRecord` | `[CREDITS_IMPACT_CLAIR]` | `impactCreditsPrice` |
| `total_points` | `MockOrderRecord` | `[CREDITS_IMPACT_CLAIR]` | `impactCreditsTotal` |
| `monthly_points_allocation` | `MockSubscriptionRecord` | `[CREDITS_IMPACT_CLAIR]` | `monthlyImpactCredits` |
| `Profile.points` | `Profile` | `[CREDITS_IMPACT_CLAIR]` | `impactCreditsBalance` |
| `reward` | `Challenge` | `[SEEDS_CLAIR]` | `seedsReward` |
| `beesSaved` | `Profile` | `[METRIQUE_IMPACT]` | `impactMetrics.bees` |
| `returns_received_points` | `MockInvestmentRecord` | `[AMBIGU]` | À clarifier métier |

Documentation complète : `@/lib/mappers/producer-support-classification.md`

---

## 3. Fichiers créés/modifiés

### 3.1 Nouveaux fichiers

| Fichier | Description | Statut |
|---------|-------------|--------|
| `src/lib/mappers/producer-support-adapters.ts` | Adapters legacy → view-model | `[ACTIF]` |
| `src/lib/mappers/producer-support-classification.md` | Documentation classification champs | `[DOCUMENTATION]` |

### 3.2 Contenu de producer-support-adapters.ts

```typescript
// Adapters principaux
adaptNormalizedInvestmentToProducerSupport(record) → ProducerSupportViewModel
adaptMockInvestmentToProducerSupport(record) → ProducerSupportViewModel
adaptNormalizedDonationToViewModel(record) → DonationViewModel

// Adapters pour listes
adaptNormalizedInvestmentsToProducerSupports(records[]) → ProducerSupportViewModel[]
adaptMockInvestmentsToProducerSupports(records[]) → ProducerSupportViewModel[]
```

**Caractéristiques :**
- Types legacy définis comme `*Legacy` (mirroirs) pour éviter imports circulaires
- Aucune modification des types sources
- Mapping sémantique conforme P0-1 et P0-3
- Helpers pour listes (arrays)

---

## 4. Adapters détaillés

### 4.1 `adaptNormalizedInvestmentToProducerSupport`

**Input :** `NormalizedInvestmentLegacy`  
**Output :** `ProducerSupportViewModel`

| Champ source | Champ cible | Transformation |
|--------------|-------------|----------------|
| `id` | `id` | Direct |
| `amount_eur` | `amountEuros` | Renommage |
| `amount_points` | `amountImpactCredits` | Sémantique P0-3 |
| `status` | `status` | Normalisation union |
| `created_at` | `createdAt` | camelCase |
| `project.name_default` | `project.name` | Non-null fallback |
| `project.slug` | `project.slug` | Non-null fallback |
| `project.status` | `project.status` | Non-null fallback |
| `project.cover_image_url` | `project.coverImageUrl` | camelCase + null |
| — | `contributionTypeLabel` | Constante "Soutien producteur" |
| `status` | `statusLabel` | Mapping label UI |

### 4.2 `adaptMockInvestmentToProducerSupport`

**Input :** `MockInvestmentRecordLegacy`  
**Output :** `ProducerSupportViewModel`

Alias cohérent avec `mapInvestmentToProducerSupport()` existant.

### 4.3 `adaptNormalizedDonationToViewModel`

**Input :** `NormalizedDonationLegacy`  
**Output :** `DonationViewModel`

**Note importante :** Le don pur (P0-1) donne des **Graines**, pas des Credits Impact.
Le view-model retourné contient `seedsReward` au lieu de `amountImpactCredits`.

---

## 5. Principe de séparation Don vs Soutien

| Aspect | Soutien Producteur | Don Pur |
|--------|---------------------|---------|
| **Type** | `NormalizedInvestment` | `NormalizedDonation` |
| **Adapter** | `adaptNormalizedInvestmentToProducerSupport` | `adaptNormalizedDonationToViewModel` |
| **Label UI** | "Soutien producteur" | "Don" |
| **Monnaie reçue** | Credits Impact | Graines |
| **Champ legacy** | `amount_points` | `amount_points` |
| **Sémantique cible** | `impactCredits` | `seeds` |
| **P0-x** | P0-1 (soutien), P0-3 (Credits Impact) | P0-1 (don pur) |

---

## 6. Zones conservées (non modifiées)

### 6.1 Structures legacy intactes

| Structure | État | Raison |
|-----------|------|--------|
| `MockInvestmentRecord` | ✅ Inchangé | Compatibilité mock-member-data |
| `NormalizedInvestment` | ✅ Inchangé | Compatibilité investments/page.tsx |
| `NormalizedDonation` | ✅ Inchangé | Compatibilité investments/page.tsx |
| `NormalizedOrder` | ✅ Inchangé | Compatibilité investments/page.tsx |
| `MockOrderRecord` | ✅ Inchangé | Compatibilité historique commandes |
| `Profile.points` | ✅ Inchangé | Compatibilité gamification |

### 6.2 Zones interdites respectées

| Zone | Touché ? |
|------|----------|
| Supabase | ❌ Non |
| Generated types Supabase | ❌ Non |
| Stripe metadata | ❌ Non |
| Routes `/invest`, `/profile/investments` | ❌ Non |
| `create-investment.action.ts` | ❌ Non |
| Package core | ❌ Non |
| `Artisans Locaux` (faction) | ❌ Non |

---

## 7. Résultats validation

```bash
pnpm type-check  # ✅ Exit code 0
pnpm lint        # ✅ Exit code 0
```

**Aucune régression** — les adapters sont purement additifs.

---

## 8. Prêt pour R6

### 8.1 Ce qui est prêt

| Élément | Statut | Usage R6 |
|---------|--------|----------|
| `ProducerSupportViewModel` | ✅ | Type cible pour nouveaux composants |
| `adaptNormalizedInvestmentToProducerSupport` | ✅ | Adapter pour données page.tsx |
| `adaptMockInvestmentToProducerSupport` | ✅ | Adapter pour données mock |
| `adaptNormalizedDonationToViewModel` | ✅ | Adapter pour donations |
| `PRODUCER_SUPPORT_LABELS` | ✅ | Labels UI cohérents |
| Classification champs | ✅ | Référence pour futurs devs |

### 8.2 Ce qui sera possible en R6

1. **Créer un nouveau composant** `ProducerSupportCard` utilisant `ProducerSupportViewModel`
2. **Migrer progressivement** `activity-list.tsx` vers les adapters
3. **Créer des sections UI** "Mes Soutiens" avec la bonne terminologie
4. **Ajouter des exports** CSV/récap utilisant les view-models

### 8.3 Ce qui nécessite encore du travail

| Élément | Blocage | Solution future |
|---------|---------|-----------------|
| Renommage route `/support` | Gestion redirects | R5B planifié |
| Metadata Stripe `producer_support` | Compatibilité historique | P0-2 Phase 5 |
| DB V2 propre | Attente validation mocks | P0-10a |

---

## 9. Risques identifiés et mitigations

| Risque | Niveau | Mitigation R5 |
|--------|--------|---------------|
| Confusion `amount_points` = Credits vs Graines | Moyen | Documentation classification claire |
| Adapters non utilisés immédiatement | Faible | Préparatoires pour R6, pas bloquant |
| Divergence types legacy / view-model | Faible | Adapters maintenus à jour |
| `returns_received_points` ambigu | Moyen | Taggué `[AMBIGU]` — à clarifier métier |

---

## 10. Métriques R5

| Métrique | Valeur |
|----------|--------|
| Fichiers créés | 2 |
| Adapters créés | 5 fonctions + 2 helpers listes |
| Structures auditées | 8 types principaux |
| Champs classifiés | 40+ champs |
| Tags de classification | 8 catégories |
| Structures legacy modifiées | 0 ✅ |
| Zones Supabase touchées | 0 ✅ |
| Type-check | ✅ Pass |
| Lint | ✅ Pass |
| Régressions | 0 |

---

## 11. Recommandations R6

### 11.1 Option A — Composant UI pilote

Créer un nouveau composant `ProducerSupportList` qui :
- Utilise `adaptNormalizedInvestmentToProducerSupport`
- Affiche "Soutien producteur" au lieu de "Investissement"
- Remplace progressivement `activity-list.tsx` dans une section dédiée

### 11.2 Option B — Refonte modale transaction

Modifier `transaction-receipt.tsx` pour :
- Utiliser `ProducerSupportViewModel` via adapter
- Afficher les bonnes nomenclatures
- Préparer le terrain pour les nouvelles routes

### 11.3 Option C — Stabilisation complète

Documenter dans `02-ETAT-ACTUEL-CODE.md` :
- L'état des adapters
- La classification des champs
- Les chemins de migration recommandés

---

## 12. Verdict R5

**Verdict :** ✅ **R5 VALIDÉE**

**Résumé :**
- ✅ Audit complet des structures locales (8 types)
- ✅ Classification exhaustive des champs sensibles (40+ champs)
- ✅ Adapters non destructeurs créés (5 fonctions)
- ✅ Documentation classification créée
- ✅ Types legacy conservés intacts
- ✅ Aucune zone interdite touchée
- ✅ Validations techniques passées

**État des livrables :**
- `@/lib/mappers/producer-support-adapters.ts` — `[ACTIF]`
- `@/lib/mappers/producer-support-classification.md` — `[DOCUMENTATION]`
- `@/lib/mappers/producer-support.mapper.ts` — `[ACTIF]` (créé en R2/R3)

**Prochaine étape recommandée :** R6 — Intégration UI pilote avec les adapters.

---

*Tags :* `[R5]` `[VALIDEE]` `[MOCKS]` `[ADAPTERS]` `[P0-1]` `[P0-3]` `[INVESTMENT]` `[PRODUCER_SUPPORT]` `[STABILISATION]`
