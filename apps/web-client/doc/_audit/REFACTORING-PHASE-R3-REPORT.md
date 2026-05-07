# Rapport de Phase R3 — Migration Helpers et Labels UI

**Date :** 2026-05-07  
**Portée :** `apps/web-client`  
**Statut :** `[VALIDEE]` — Migration douce des helpers R2 vers UI

---

## 1. Résumé de R3

La phase R3 avait pour objectif d'utiliser les helpers créés en R2 (`formatImpactCredits`, `formatSeeds`, `mapInvestmentToProducerSupport`) dans les zones claires du code, sans migration destructrice.

**Philosophie R3 :** Utiliser les outils préparatoires de R2 dans les contextes univoques, laisser les zones ambiguës en legacy, ne rien casser.

---

## 2. Classification des Occurrences (Pré-migration)

| Fichier | Occurrences | Contexte | Classification | Action |
|---------|-------------|----------|----------------|--------|
| `invest-client.tsx` | 8 | `calc.total_points`, `pointsBalance`, `pointsEarned` — soutien producteur | `[CREDITS_IMPACT_CLAIR]` | ✅ Migré vers `formatImpactCredits()` |
| `academy/page.tsx` | 2 | `progress.seedsBalance` — progression Academy | `[SEEDS_CLAIR]` | ✅ Migré vers `formatSeeds()` |
| `project-invest-one-flow.tsx` | 2 | Métriques soutien (abeilles, oliviers) | `[CREDITS_IMPACT_CLAIR]` | ✅ Migré vers `formatImpactCredits()` |
| `project-donate-one-flow.tsx` | 1 | `seeds` — récompenses don | `[SEEDS_CLAIR]` | ✅ Migré vers `formatSeeds()` |
| `activity-list.tsx` | - | Labels UI contributions | `[INVESTMENT_UI_TO_SUPPORT]` | ✅ Labels améliorés "Credits Impact" |
| `profile/[id]/page.tsx` | 2 | Mixte (score + crédits) | `[AMBIGU_A_GARDER]` | ⏸️ Conservé `formatPoints()` |
| `home.view-model.ts` | 1 | Stats homepage | `[AMBIGU_A_GARDER]` | ⏸️ Conservé `formatPoints()` |

---

## 3. Fichiers Modifiés

| Fichier | Modification | Classification |
|---------|-------------|----------------|
| `src/app/[locale]/(screens)/projects/[slug]/_features/invest-client.tsx` | Remplacé `formatPoints` par `formatImpactCredits` (8 occurrences) + import | `[CREDITS_IMPACT_CLAIR]` |
| `src/app/[locale]/(screens)/academy/page.tsx` | Remplacé `formatPoints` par `formatSeeds` (2 occurrences) + import | `[SEEDS_CLAIR]` |
| `src/app/[locale]/(screens)/projects/[slug]/invest/_components/project-invest-one-flow.tsx` | Remplacé `formatPoints` par `formatImpactCredits` (2 occurrences) + import | `[CREDITS_IMPACT_CLAIR]` |
| `src/app/[locale]/(screens)/projects/[slug]/donate/_components/project-donate-one-flow.tsx` | Remplacé `formatPoints` par `formatSeeds` (1 occurrence) + import | `[SEEDS_CLAIR]` |
| `src/app/[locale]/(screens)/profile/investments/_features/activity-list.tsx` | Labels améliorés : "crédits" → "Credits Impact" | `[INVESTMENT_UI_TO_SUPPORT]` |

---

## 4. Helpers Utilisés

### 4.1 `formatImpactCredits()` — Nouvellement utilisé

| Fichier | Contexte | Lignes |
|---------|----------|--------|
| `invest-client.tsx` | Calcul de Credits Impact après soutien | 260, 290, 296, 302, 311, 338, 402, 419 |
| `project-invest-one-flow.tsx` | Métriques d'impact (abeilles, oliviers) | 147, 152 |

**Total :** 10 occurrences migrées

### 4.2 `formatSeeds()` — Nouvellement utilisé

| Fichier | Contexte | Lignes |
|---------|----------|--------|
| `academy/page.tsx` | Affichage solde Graines | 727, 731 |
| `project-donate-one-flow.tsx` | Récompenses don en Graines | 424 |

**Total :** 3 occurrences migrées

### 4.3 `formatPoints()` — Conservé (zones ambiguës)

| Fichier | Contexte | Raison |
|---------|----------|--------|
| `profile/[id]/page.tsx` | Score, crédits, historique | Mixte score/XP + crédits — classification R3 nécessaire |
| `home.view-model.ts` | Stats homepage | Contexte mixte — à classifier |
| `utils.ts` | Définition helper | Legacy compatibilité |

---

## 5. Labels UI Améliorés

### 5.1 `activity-list.tsx`

| Avant | Après | Contexte |
|-------|-------|----------|
| `'crédits'` | `'Credits Impact'` | Unité commandes |
| `'Crédits gagnés'` | `'Credits Impact gagnés'` | Label investissement |
| `'Crédits dépensés'` | `'Credits Impact dépensés'` | Label dépenses |

---

## 6. Éléments Conservés (Non modifiés)

### 6.1 Données persistantes
- ❌ Champs `price_points`, `amount_points` dans les mocks
- ❌ Types `MockInvestmentRecord`, `NormalizedInvestment`
- ❌ Routes `/invest`, `/profile/investments`
- ❌ Metadata Stripe `order_type: "investment"`

### 6.2 Zones ambiguës
- ❌ `profile/[id]/page.tsx` — mixte score/crédits
- ❌ `home.view-model.ts` — stats homepage à classifier

### 6.3 Supabase et infrastructure
- ❌ Aucune modification Supabase
- ❌ Aucune modification Stripe
- ❌ Aucune modification generated types
- ❌ Aucune route renommée/supprimée

---

## 7. Résultats Type-check / Lint

```bash
cd apps/web-client
pnpm type-check  # ✅ Exit code 0
pnpm lint         # ✅ Exit code 0
```

**Aucune régression** — tous les imports et types sont valides.

---

## 8. Occurrences Restantes Post-R3

### 8.1 `formatPoints()` restant

| Fichier | Occurrences | Contexte | Action future |
|---------|-------------|----------|---------------|
| `profile/[id]/page.tsx` | 2 | Score, crédits, historique | `[A_CLASSIFIER_R4]` |
| `home.view-model.ts` | 1 | Stats homepage | `[A_CLASSIFIER_R4]` |
| `utils.ts` | 1 | Définition helper | `[LEGACY_COMPAT]` |

**Total restant :** 4 occurrences (vs 17 avant R3)

### 8.2 `points` (champs data) — Non migré

- 121+ occurrences dans les mocks
- Champs persistants `price_points`, `amount_points`, `total_points`
- Classification par famille nécessaire (P0-3)

---

## 9. Mapper `investment` → `producer_support`

### 9.1 Statut du mapper

Le mapper `mapInvestmentToProducerSupport()` créé en R2 est **prêt mais non encore utilisé** dans les composants UI.

### 9.2 Raison

Les composants actuels utilisent des types locaux (`NormalizedInvestment`) qui ne sont pas directement compatibles avec `MockInvestmentRecord`. Une adaptation des types ou une couche de conversion supplémentaire serait nécessaire pour R4.

### 9.3 Utilisation actuelle

Les labels UI utilisent déjà la terminologie "Soutien" (ligne 189 de activity-list.tsx), ce qui est cohérent avec la cible `producer_support` sans modification technique profonde.

---

## 10. Risques Restants

| Risque | Niveau | Mitigation |
|--------|--------|------------|
| `formatPoints()` encore utilisé (4 occurrences) | Faible | Zones identifiées et documentées |
| Champs `points` persistants non migrés | Moyen | Classification P0-3 à appliquer |
| Mapper non utilisé | Faible | UI utilise déjà labels "Soutien" |
| Ambiguïté score vs Credits Impact | Moyen | À résoudre en R4 |

---

## 11. Recommandation Prochaine Phase

### 11.1 Validation de R3

**Verdict :** ✅ **R3 VALIDÉE**

Les helpers créés en R2 sont maintenant utilisés dans les zones claires. Les validations passent. Aucune régression.

### 11.2 Proposition R4 — Classification et Migration Profonde

**Objectif R4 suggéré :**

1. **Classification complète des `points`**
   - Inventaire des 121+ occurrences de champs `points`
   - Classification par famille : Credits Impact, Graines, Score/XP, Impact Metric, Legacy Investment, Supabase Legacy
   - Plan de migration par famille

2. **Migration des zones ambiguës restantes**
   - `profile/[id]/page.tsx` — séparer score et Credits Impact
   - `home.view-model.ts` — classifier les stats

3. **Intégration du mapper dans les composants**
   - Adapter `activity-list.tsx` pour utiliser `mapInvestmentToProducerSupport()`
   - Adapter `invest-client.tsx` pour utiliser le view-model

4. **Stabilisation mocks (P0-10a)**
   - Documenter la structure des 5 mocks critiques
   - Créer dictionnaire de correspondance DB V2

**Éléments à NE PAS toucher en R4 :**
- ❌ Supabase legacy
- ❌ Routes `/invest`
- ❌ Stripe metadata
- ❌ Structure mocks (pas de changement de schéma)

---

## 12. Métriques R3

| Métrique | Valeur |
|----------|--------|
| Fichiers modifiés | 5 |
| Helpers `formatImpactCredits()` utilisés | 10 occurrences |
| Helpers `formatSeeds()` utilisés | 3 occurrences |
| `formatPoints()` remplacés | 13/17 (76%) |
| `formatPoints()` restants | 4 (zones ambiguës) |
| Labels UI améliorés | 3 |
| Type-check | ✅ Pass |
| Lint | ✅ Pass |
| Régressions | 0 |

---

**Sign-off :** R3 complétée. Prête pour R4 (classification profonde).

---

*Tags :* `[R3]` `[VALIDEE]` `[MIGRATION_DOUCE]` `[HELPERS]` `[P0-2]` `[P0-3]`
