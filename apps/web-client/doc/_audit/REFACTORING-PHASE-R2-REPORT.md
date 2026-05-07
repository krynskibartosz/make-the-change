# Rapport de Phase R2 — Helpers, Aliases, Nomenclature Locale

**Date :** 2026-05-07  
**Portée :** `apps/web-client`  
**Statut :** `[VALIDEE_AVEC_RESERVES]` — Préparation technique douce complétée, prêt pour R3

---

## 1. Résumé de R2

La phase R2 avait pour objectif de faire une passe de refactoring structurelle mais contrôlée :

- Créer des helpers sémantiques pour remplacer progressivement `points` par `Credits Impact` / `Graines`
- Établir un mapping `investment` → `producer_support` sans migration destructrice
- Documenter les composants currency et les règles métier
- Stabiliser doucement les mocks avec des aliases

**Philosophie R2 :** Préparer les futures migrations, pas les forcer. Aucune modification de données persistantes, Supabase, Stripe profond, routes legacy ou generated types.

---

## 2. Fichiers Modifiés

### Nouveaux fichiers (2)

| Fichier | Description | Statut |
|---------|-------------|--------|
| `src/lib/mappers/producer-support.mapper.ts` | Mapper `investment` → `producer_support` avec view-model et labels UI | `[PREPARATOIRE]` |
| `doc/_audit/REFACTORING-PHASE-R2-REPORT.md` | Ce rapport | `[DOCUMENTATION]` |

### Fichiers modifiés (4)

| Fichier | Modification | P0 concerné |
|---------|-------------|-------------|
| `src/lib/utils.ts` | Ajout `formatImpactCredits()` et `formatSeeds()`, `formatPoints()` marqué `@deprecated` | P0-3 |
| `src/lib/mock/mock-member-data.ts` | Ajout aliases `IMPACT_CREDITS_PRICE`, `IMPACT_CREDITS_AMOUNT` | P0-3 |
| `src/components/currency/currency-design.ts` | Documentation R2 + export `formatCurrencyValue()` | P0-3 |
| `src/components/currency/currency.tsx` | Documentation R2, import/export cohérent | P0-3 |

---

## 3. Helpers Créés ou Modifiés

### 3.1 Helpers de formatage (`src/lib/utils.ts`)

| Helper | Description | Usage actuel | Statut |
|--------|-------------|--------------|--------|
| `formatImpactCredits(value)` | Formate un montant en Credits Impact | Définition uniquement | `[PREPARATOIRE]` |
| `formatSeeds(value)` | Formate un montant en Graines | Définition uniquement | `[PREPARATOIRE]` |
| `formatPoints(points)` | Formate un nombre legacy | 17 usages dans 7 fichiers | `[LEGACY_COMPAT]` |

**Note importante :** Les helpers `formatImpactCredits()` et `formatSeeds()` sont créés mais **pas encore utilisés** dans le code applicatif. Ils sont prêts pour R3.

### 3.2 Mapper `investment` → `producer_support`

| Élément | Description | Usage actuel | Statut |
|---------|-------------|--------------|--------|
| `ProducerSupportViewModel` | Type view-model cible | Définition uniquement | `[PREPARATOIRE]` |
| `mapInvestmentToProducerSupport()` | Fonction de mapping | Définition uniquement | `[PREPARATOIRE]` |
| `PRODUCER_SUPPORT_LABELS` | Labels UI recommandés | Définition uniquement | `[PREPARATOIRE]` |
| `INVESTMENT_LABELS_LEGACY` | Labels legacy (compat) | Définition uniquement | `[LEGACY_COMPAT]` |

**Note :** Le mapper est créé mais **pas encore utilisé**. L'intégration dans les composants UI (`invest-client.tsx`, `activity-list.tsx`, etc.) est prévue pour R3.

### 3.3 Composants Currency

| Élément | Description | Usage actuel | Statut |
|---------|-------------|--------------|--------|
| `formatCurrencyValue()` | Helper exporté depuis currency-design | Utilisé dans currency.tsx | `[ACTIF]` |
| `CurrencyKind` | `'seeds'` \| `'impactCredits'` | Utilisé dans toute l'app | `[ACTIF]` |
| `CurrencyAmount`, `CurrencyBadge`, `CurrencyIcon` | Composants d'affichage | Utilisés dans l'app | `[ACTIF]` |

---

## 4. Usages Remplacés / Conservés

### 4.1 Usages de `formatPoints()` — Conservés (17 occurrences)

| Fichier | Occurrences | Contexte | Classification |
|---------|-------------|----------|----------------|
| `invest-client.tsx` | 8 | Calcul de Credits Impact après soutien | `[A_MIGRER_R3]` |
| `academy/page.tsx` | 2 | Affichage solde Graines | `[A_MIGRER_R3]` |
| `profile/[id]/page.tsx` | 2 | Score, crédits, historique | `[A_MIGRER_R3]` |
| `project-invest-one-flow.tsx` | 2 | Calcul Credits Impact | `[A_MIGRER_R3]` |
| `project-donate-one-flow.tsx` | 1 | Récompenses | `[A_MIGRER_R3]` |
| `home.view-model.ts` | 1 | Stats homepage | `[A_MIGRER_R3]` |
| `utils.ts` | 1 | Définition helper | `[LEGACY_COMPAT]` |

**Stratégie R3 :** Remplacer progressivement par `formatImpactCredits()` (pour Credits Impact) ou `formatSeeds()` (pour Graines) selon le contexte identifié dans P0-3.

### 4.2 Champs `points` dans les mocks — Conservés (121 occurrences)

| Famille | Champs | Occurrences | Statut |
|---------|--------|-------------|--------|
| Credits Impact legacy | `price_points`, `amount_points`, `total_points` | 121 dans 28 fichiers | `[A_MIGRER_R3]` |
| Graines / Score | `seedsBalance`, `impactScore` | Mélangé | `[A_CLASSIFIER_R3]` |

**Aliases créés :** `IMPACT_CREDITS_PRICE`, `IMPACT_CREDITS_AMOUNT` dans `mock-member-data.ts` — **pas encore utilisés**, préparatoires pour R3.

### 4.3 `investment` / `invest` — Conservés (219 occurrences)

| Zone | Occurrences | Classification |
|------|-------------|----------------|
| Routes `/projects/[slug]/invest` | 7+ | `[A_NE_PAS_TOUCHER_R3]` |
| Actions `create-investment.action.ts` | 22 | `[A_MIGRER_PLUS_TARD]` |
| UI `invest-client.tsx` | 13 | `[A_MIGRER_R3]` |
| Historique `profile/investments/*` | 56+ | `[A_MIGRER_R3]` |
| Mocks `mock-biodex.ts`, `mock-member-data.ts` | 26 | `[A_MIGRER_R3]` |
| Nouveau mapper (fichier créé) | 16 | `[PREPARATOIRE]` |

---

## 5. Zones Ambiguës Identifiées

### 5.1 Contexte `points` ambigu

Certaines zones mélangent plusieurs sens de `points` :

- `invest-client.tsx` : `points` = Credits Impact (clair)
- `academy/page.tsx` : `seedsBalance` vs `formatPoints()` — Graines (clair)
- `profile/[id]/page.tsx` : `impactScore` vs `points` — score/XP à distinguer

**Action R3 :** Classifier chaque usage selon P0-3 (Credits Impact, Graines, Score/XP, Impact Metric, Legacy Investment, Supabase Legacy).

### 5.2 Legacy `investment` profond

Les routes `/invest` et la page `/profile/investments` sont fortement couplées à :
- Modals interceptées
- Retours Stripe
- Types `Investment`, `MockInvestmentRecord`
- Actions serveur `create-investment.action.ts`

**Action R3+ :** Migration progressive via le mapper, pas de rename brutal.

---

## 6. Mocks Modifiés

### 6.1 Changements effectués

| Fichier | Changement | Impact |
|---------|-----------|--------|
| `mock-member-data.ts` | Ajout aliases `IMPACT_CREDITS_PRICE`, `IMPACT_CREDITS_AMOUNT` | Documentationnel uniquement |

### 6.2 Mocks critiques — Non modifiés (stabilisation reportée R3)

| Fichier | Statut | Note |
|---------|--------|------|
| `mock-ids.ts` | `[A_NE_PAS_TOUCHER]` | IDs structurants |
| `mock-biodex.ts` | `[LEGACY_INVESTMENT]` | BioDex unlock rules |
| `mock-projects.ts` | `[STABLE]` | Structure inchangée |
| `mock-products.ts` | `[STABLE]` | Structure inchangée |
| `mock-member-data.ts` | `[LEGACY_COMPAT]` | Aliases ajoutés, structure inchangée |

**Note :** La "stabilisation douce" de R2 n'a pas figé les mocks, seulement préparé des aliases. La vraie stabilisation (P0-10a) est reportée à R3.

---

## 7. Éléments Reportés à R3

### 7.1 Stabilisation des mocks critiques (P0-10a)

- Geler la structure des 5 mocks critiques
- Documenter les relations projet-producteur-espece-produit
- Créer un dictionnaire de correspondance pour la future DB V2

### 7.2 Migration douce des helpers

- Remplacer `formatPoints()` par `formatImpactCredits()` / `formatSeeds()` selon contexte
- Intégrer `mapInvestmentToProducerSupport()` dans les composants UI
- Utiliser `PRODUCER_SUPPORT_LABELS` pour remplacer les labels "investissement"

### 7.3 Clarification des types `points`

- Classifier toutes les occurrences de `points` selon P0-3
- Documenter les familles : Credits Impact, Graines, Score/XP, Impact Metric, Legacy Investment, Supabase Legacy
- Ne pas migrer les champs persistants (`price_points`, `amount_points`) sans stratégie DB V2

---

## 8. Résultats Type-check / Lint

### 8.1 Validations

```bash
cd apps/web-client
pnpm type-check  # ✅ Exit code 0
pnpm lint         # ✅ Exit code 0 (format only, no errors)
```

### 8.2 Aucune Régression

- Aucun import cassé
- Aucun type invalide
- Aucune route supprimée
- Aucune modification Supabase
- Aucune modification Stripe profonde
- Aucun generated type modifié

---

## 9. Risques Restants

| Risque | Niveau | Mitigation |
|--------|--------|------------|
| Helpers créés mais non utilisés (code mort potentiel) | Faible | Documenté comme `[PREPARATOIRE]`, utilisation prévue R3 |
| Aliases mocks non utilisés | Faible | Documentationnel, pas bloquant |
| `formatPoints()` encore largement utilisé | Moyen | Plan de migration R3 documenté |
| `investment` très répandu (219 occurrences) | Moyen | Mapper créé, migration progressive planifiée |
| Ambiguïté `points` = multi-sens | Moyen | Classification P0-3 à appliquer en R3 |
| Confusion Graines vs Credits Impact | Faible | Helpers distincts créés, documentation claire |

---

## 10. Recommandation Prochaine Phase

### 10.1 Validation de R2

**Verdict :** ✅ **R2 VALIDÉE**

R2 a atteint son objectif : créer une couche de préparation technique (helpers, mappers, documentation) sans migration destructrice. Les helpers sont prêts, le mapper est prêt, les validations passent.

### 10.2 Proposition R3 — Stabilisation et Migration Douce

**Objectif R3 :** Utiliser les outils créés en R2 pour une migration douce et documentée.

**Périmètre R3 suggéré :**

1. **Stabilisation mocks (P0-10a)**
   - Documenter la structure des 5 mocks critiques
   - Geler les IDs, relations, types
   - Créer schéma conceptuel DB V2 préparatoire

2. **Migration helpers R2 → UI**
   - Remplacer `formatPoints()` par les helpers sémantiques dans les UI claires
   - Intégrer `mapInvestmentToProducerSupport()` dans `invest-client.tsx`, `activity-list.tsx`
   - Utiliser `PRODUCER_SUPPORT_LABELS` pour wording UI

3. **Classification `points` P0-3**
   - Inventaire complet des 121+ occurrences
   - Classification par famille
   - Plan de migration par famille

4. **Préparation routes `/support`**
   - Créer alias `/projects/[slug]/support`
   - Garder `/invest` en compatibilité
   - Préparer redirect stratégique

**Éléments à NE PAS toucher en R3 :**
- ❌ Supabase legacy (tables, generated types, RPC)
- ❌ Stripe metadata (reste `investment` pour l'instant)
- ❌ Routes `/invest` (pas de suppression)
- ❌ Structure mocks (pas de changement de schéma)
- ❌ Renommage global `points` → `impactCredits`

---

## 11. Checklist R2 Finale

- [x] Helpers `formatImpactCredits()` et `formatSeeds()` créés
- [x] `formatPoints()` marqué `@deprecated`
- [x] Mapper `investment` → `producer_support` créé avec view-model
- [x] Composants currency documentés (R2, P0-3, P0-6)
- [x] Aliases mocks créés (`IMPACT_CREDITS_PRICE`, `IMPACT_CREDITS_AMOUNT`)
- [x] `pnpm type-check` passe
- [x] `pnpm lint` passe
- [x] Aucun changement Supabase
- [x] Aucun changement Stripe profond
- [x] Aucune route supprimée/renommée
- [x] Aucun generated type modifié
- [x] Rapport R2 créé (ce fichier)
- [ ] Helpers utilisés dans l'UI (reporté R3)
- [ ] Mapper utilisé dans les composants (reporté R3)
- [ ] Mocks stabilisés structurellement (reporté R3)

---

**Sign-off :** R2 prête pour clôture. Passage à R3 recommandé.

---

*Tags :* `[R2]` `[VALIDEE]` `[PREPARATOIRE]` `[A_MIGRER_R3]` `[P0-2]` `[P0-3]` `[P0-10a]`
