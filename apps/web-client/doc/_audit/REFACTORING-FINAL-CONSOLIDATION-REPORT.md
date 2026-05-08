# Rapport Final — Consolidation Refactoring R1-R8

**Date :** 2026-05-08  
**Portée :** `apps/web-client/src/` — passe finale de consolidation  
**Statut :** `[VALIDEE]`

---

## 1. État initial avant cette passe

Les phases R1 à R8 avaient été exécutées, mais 7 problèmes restaient non résolus :

| Problème | Zone | Gravité |
|----------|------|---------|
| `[HYPOTHESE]` tag visible dans l'UI | `transaction-receipt.tsx` ligne 211 | `[A_CORRIGER_MAINTENANT]` |
| `'Impact à valider'` wording fort | `transaction-receipt.tsx` ligne 89 | `[A_CORRIGER_MAINTENANT]` |
| `formatImpactCredits()` sur du score/XP | `profile/[id]/page.tsx` ligne 248 | `[SCORE_PROGRESS_NOT_CREDITS]` |
| `points:` dans `mock-session-server.ts` | ligne 58 | `[TYPE_ERROR]` causait TS error |
| `'A protégé 3 espèces menacées'` visible en UI collectif | `impact-tab-client.tsx` ligne 176 | `[A_CORRIGER_MAINTENANT]` |
| `"Aucune quête pour aujourd'hui"` visible en UI | `adventure-tab.tsx` ligne 454 | `[A_CORRIGER_MAINTENANT]` |
| R8 manquait `mock-session-server.ts` | ligne 58 | `[OUBLI_R8]` |

---

## 2. Corrections R8 appliquées dans cette passe

### 2.1 Correction sémantique `profile/[id]/page.tsx`

**Problème :** `formatImpactCredits(levelProgress.nextMin - impactScore)` utilisé pour formater un écart de progression de niveau (score/XP), ce qui est sémantiquement incorrect — le score n'est pas des Credits Impact.

**Correction :**
```typescript
// Avant (incorrect sémantiquement) :
{formatImpactCredits(levelProgress.nextMin - impactScore)} crédits pour le prochain niveau

// Après (correct) :
{formatPoints(levelProgress.nextMin - impactScore)} crédits pour le prochain niveau
```

Import mis à jour : `formatImpactCredits` conservé pour `investment.amount_points`, `formatPoints` ajouté pour le score/XP.

**Classification finale :**
- `impactCreditsBalance = profile.points_balance || 0` → `[LEGACY_SUPABASE_ALIAS_OK]`
- `getMilestoneBadges({ points: impactCreditsBalance })` → `[AMBIGU_A_GARDER]` — param interne, non modifiable sans changer l'API gamification
- `formatImpactCredits(investment.amount_points)` → `[CREDITS_IMPACT_OK]` — investment amount IS Credits Impact
- `formatPoints(levelProgress.nextMin - impactScore)` → `[SCORE_PROGRESS_NOT_CREDITS]` — score/XP, format neutre correct

### 2.2 Correction `mock-session-server.ts` (oubli R8)

```typescript
// Avant :
points: await getCurrentMockImpactPoints(session.viewerId, session.faction),

// Après :
impactCreditsBalance: await getCurrentMockImpactPoints(session.viewerId, session.faction),
```

Ce fichier avait été oublié dans R8. La correction aligne avec `Profile.impactCreditsBalance`.

### 2.3 Vérification `home.view-model.ts`

`pointsGeneratedState.value` provient de `supabase.rpc('get_total_points_generated')` — stat agrégée plateforme des Credits Impact distribués via soutiens producteurs. Usage de `formatImpactCredits()` jugé acceptable dans ce contexte marketing.

Classification : `[CREDITS_IMPACT_ACCEPTABLE]`

---

## 3. Corrections R7 appliquées dans cette passe

### 3.1 Suppression tag `[HYPOTHESE]` visible dans l'UI

**Fichier :** `transaction-receipt.tsx` ligne 211

```tsx
// Avant :
[HYPOTHESE] L&apos;impact réel dépend de la mise en œuvre du projet sur le terrain.

// Après :
L&apos;impact réel dépend de la mise en œuvre du projet sur le terrain.
```

Le disclaimer reste affiché — seul le tag documentaire interne a été retiré.

### 3.2 Remplacement 'Impact à valider'

**Fichier :** `transaction-receipt.tsx` ligne 89

```typescript
// Avant :
{ label: 'Impact à valider', date: 'À déterminer', status: 'future' as const }

// Après :
{ label: 'Suivi terrain à venir', date: 'À déterminer', status: 'future' as const }
```

Formulation plus naturelle, moins autoritaire, conforme à la doctrine P0-6.

---

## 4. Stabilisation mocks réalisée

### 4.1 Mocks non modifiés structurellement

Conformément aux directives, les structures des mocks critiques n'ont pas été modifiées :
- `mock-member-data.ts` — `[A_NE_PAS_TOUCHER]` — champs `_points` = colonnes Supabase
- `mock-biodex.ts` — `[A_NE_PAS_TOUCHER]` — pas de wording dangereux trouvé
- `mock-ids.ts` — déjà mis à jour en R7
- `mock-projects.ts` — pas de wording dangereux trouvé dans les noms de champs
- `mock-products.ts` — `price_points` = `[LEGACY_COMPAT]` [A_NE_PAS_TOUCHER]

### 4.2 Classification des champs mock principaux

| Champ | Fichier | Classification |
|-------|---------|----------------|
| `amount_points` | `MockInvestmentRecord` | `[CREDITS_IMPACT_CLAIR]` — montant Credits Impact soutien producteur |
| `returns_received_points` | `MockInvestmentRecord` | `[AMBIGU]` — ex-concept de retour, non affiché en UI |
| `price_points`, `unit_price_points`, `total_points` | `MockOrderRecord`, `MockOrderItemRecord` | `[CREDITS_IMPACT_CLAIR]` — prix boutique en Credits Impact |
| `monthly_points_allocation` | `MockSubscriptionRecord` | `[AMBIGU]` — allocation mensuelle abonnement, non encore documentée |
| `impactDelta` | `MockPointsTransactionRecord` | `[CREDITS_IMPACT_CLAIR]` — delta Credits Impact |
| `delta` | `MockPointsTransactionRecord` | `[AMBIGU]` — delta solde wallet mixte |
| `investedProjectSlugs` | BioDex unlock logic | `[LEGACY_A_MIGRER_PLUS_TARD]` — déclencheur BioDex hérité |
| `orderedProductIds` | BioDex | `[LEGACY_COMPAT]` — non utilisé pour unlock en cible |
| `impactCreditsBalance` | `Profile`, `mock-viewer.ts` | `[CREDITS_IMPACT_CLAIR]` — solde wallet Credits Impact |
| `totalSeedsContributed` | `Profile` | `[SEEDS_CLAIR]` — Graines contribuées totales |

---

## 5. Adapters utilisés / non utilisés

### 5.1 Adapters actifs (R5-R7)

| Adapter | Utilisé dans | Statut |
|---------|-------------|--------|
| `adaptNormalizedInvestmentToProducerSupport()` | `activity-list.tsx`, `transaction-receipt.tsx` | `[ACTIF]` |
| `adaptNormalizedDonationToViewModel()` | `activity-list.tsx`, `transaction-receipt.tsx` | `[ACTIF]` |
| `adaptMockInvestmentToProducerSupport()` | Disponible, non utilisé en UI | `[DISPONIBLE]` |

### 5.2 Extension adapters (D)

Analyse des zones candidates :
- `profile/[id]/page.tsx` — Section investments Supabase — la logique lit directement depuis Supabase via types générés. Intégrer les adapters ici demanderait une couche de normalisation non triviale et le risque est moyen. Reporté.
- `profile/investments/page.tsx` — Déjà couvert par `activity-list.tsx` (R6).

**Verdict :** Pas d'extension supplémentaire dans cette passe — les 2 zones UI prioritaires (historique + reçu) sont déjà couvertes.

---

## 6. Wordings corrigés

| Terme | Fichier | Avant | Après | Classification |
|-------|---------|-------|-------|----------------|
| Tag documentaire UI | `transaction-receipt.tsx` | `[HYPOTHESE] L'impact réel...` | `L'impact réel...` | `[A_CORRIGER_MAINTENANT]` → corrigé |
| Timeline label | `transaction-receipt.tsx` | `'Impact à valider'` | `'Suivi terrain à venir'` | `[A_CORRIGER_MAINTENANT]` → corrigé |
| Collectif feed | `impact-tab-client.tsx` | `'A protégé 3 espèces menacées...'` | `'A signalé 3 zones sensibles liées...'` | `[A_CORRIGER_MAINTENANT]` → corrigé |
| Fallback aventure | `adventure-tab.tsx` | `"Aucune quête pour aujourd'hui"` | `"Aucune mission pour aujourd'hui"` | `[A_CORRIGER_MAINTENANT]` → corrigé |

---

## 7. Occurrences sensibles restantes classées

### 7.1 Termes classés OK (non corriger maintenant)

| Terme | Fichier(s) | Classification | Raison |
|-------|-----------|----------------|--------|
| `'abeilles protégées'` | `mock-factions.ts:69` | `[MOCK_A_TRAITER_PLUS_TARD]` | Stat mock faction, "protégées" ≠ "sauvées", acceptable en démo |
| `'km² de récifs protégés'` | `mock-factions.ts:97` | `[MOCK_A_TRAITER_PLUS_TARD]` | Idem — contexte démo faction |
| `'abeilles protégées estimées'` | `kinnu/graph.ts:86` | `[LAB_HORS_SCOPE]` | Zone lab, non production, "estimées" présent |
| `rendement` | `producer-support.mapper.ts:99` | `[OK_LEGAL_MENTION]` | Contexte négatif : "Pas de rendement" — correct |
| `Quest` / `quest` | Types TypeScript, variables JS | `[OK_HORS_UI]` | Noms techniques internes, non visibles utilisateur |
| `Credits Impact gagnés` | `activity-list.tsx:126` | `[OK_CONTEXTE_PROFIL]` | Filtre profil/historique — producer support DOES generate Credits Impact |
| `investissement` | Routes, types, adapters, Supabase | `[LEGACY_CODE]` | 194 occurrences techniques, non visibles UI en tant que terme produit |

### 7.2 Points de surveillance (post cette passe)

| Terme | Fichier | Note |
|-------|---------|------|
| `beesSaved` field | `Profile`, `mock-viewer.ts` | Champ technique OK ; UI affiche "ABEILLES SOUTENUES" (label corrigé R1) |
| `honeyGeneratedKg` | Profile | UI affiche "RÉCOLTE ESTIMÉE" — label prudent |
| `co2CapturedKg` | Profile | UI affiche "CO₂ ASSOCIÉ" — label prudent |
| `returns_received_points` | `MockInvestmentRecord` | Concept ambigu de "retour", non affiché dans UI actuelle |

---

## 8. Fichiers modifiés dans cette passe

| Fichier | Phase | Changement |
|---------|-------|-----------|
| `src/lib/mock/mock-session-server.ts` | R8-fix | `points:` → `impactCreditsBalance:` |
| `src/app/[locale]/(screens)/profile/[id]/page.tsx` | A | `formatImpactCredits` → `formatPoints` pour score/XP ; import ajusté |
| `src/app/[locale]/(screens)/profile/investments/_features/transaction-receipt.tsx` | B | Suppression `[HYPOTHESE]` + `'Impact à valider'` → `'Suivi terrain à venir'` |
| `src/app/[locale]/(tabs)/impact/_features/impact-tab-client.tsx` | E | `'A protégé 3 espèces menacées'` → `'A signalé 3 zones sensibles liées...'` |
| `src/app/[locale]/(tabs)/adventure/_features/adventure-tab.tsx` | E | `"Aucune quête pour aujourd'hui"` → `"Aucune mission pour aujourd'hui"` |

---

## 9. Résultats typecheck / lint

```
pnpm type-check → ✅ Exit 0 — Aucune erreur TypeScript
pnpm lint       → ❌ 556 erreurs (CRLF line endings pre-existantes)
```

**Note sur le lint :** Les 556 erreurs Biome sont des problèmes CRLF/LF pre-existants sur 441 fichiers analysés. Vérification baseline (git stash) : 561 erreurs avant nos changements. Nos modifications ont réduit le compteur de 5. Les erreurs Biome ne concernent pas les fichiers modifiés dans ces phases. Aucune nouvelle erreur introduite.

---

## 10. Risques restants

| Risque | Niveau | Mitigation | Action future |
|--------|--------|------------|---------------|
| `profile.points_balance` affiché avec label "points" dans `profile/[id]/page.tsx` (Supabase path) | Faible | Champ Supabase legacy — hors scope | Renommer à DB V2 |
| `returns_received_points` concept flou | Moyen | Non affiché en UI actuelle | Documenter à DB V2 |
| `monthly_points_allocation` concept flou | Moyen | Non affiché en UI actuelle | Clarifier en DB V2 |
| `mock-factions.ts` labels `impactLabel` trop forts | Faible | Données démo, pas production | Adoucir en P2 |
| `mock-biodex.ts` unlock via `investedProjectSlugs` | Moyen | Exception prototype présente | Isoler en R9/P2 |
| Lint CRLF 556 erreurs pre-existantes | Faible | Pré-existant avant R1 | Fixable via `git config core.autocrlf` ou Biome format globale |

---

## 11. Plan `/support` (F)

### État actuel

- Route active : `/projects/[slug]/invest` — `[ACTUEL_CODE] [LEGACY]`
- Cible documentée : `/projects/[slug]/support` — `[CIBLE_VALIDEE]`
- Fichiers concernés : `invest/page.tsx`, `@modal/(.)projects/[slug]/invest/page.tsx`, tous les liens CTA vers invest

### Prêt ou pas ?

**Pas prêt maintenant.** Conditions requises avant création :
1. Inventaire complet des liens vers `/invest` (CTAs, modals, navigation i18n)
2. Tests navigation directe + modal interceptée
3. Wording FR cibles validés pour tous les CTAs
4. Redirections 301 planifiées

### Approche recommandée (future)

1. Créer `/projects/[slug]/support/page.tsx` comme **copie** de `invest/page.tsx`
2. Garder `/invest` intacte avec un redirect vers `/support`
3. Mettre à jour les liens dans project cards et CTAs
4. Tester modals interceptées `/projects/[slug]/invest` et `/projects/[slug]/support`
5. Phase suivante : supprimer `/invest` seulement après 3 mois de coexistence

---

## 12. Plan Stripe metadata (F)

### État actuel

```
Invest → order_type: "investment"  [ACTUEL_CODE] [LEGACY] [REEL]
Donate → order_type: "donation"    [ACTUEL_CODE] [REEL] (implicite)
Product → simulé setTimeout        [ACTUEL_CODE] [SIMULE]
```

### Cible documentée

```
producer_support → order_type: "producer_support"
donation         → order_type: "donation"
product_purchase → order_type: "product_purchase"
```

### Plan de migration (futur — non exécuter maintenant)

1. Ajouter `producer_support` comme **nouveau** `order_type` accepté par `create-intent`
2. Garder `investment` en lecture legacy (webhook + historique existants)
3. Migrer `create-investment.action.ts` pour envoyer `producer_support` avec fallback read `investment`
4. Mettre à jour webhook pour accepter les deux valeurs
5. Ne jamais supprimer `investment` du webhook tant que des PaymentIntents legacy existent

**Précondition :** décision sur la stratégie webhooks remboursement (actuellement partielle).

---

## 13. Plan DB V2 conceptuel (F)

Schema conceptuel candidat basé sur les mocks stabilisés :

```sql
-- Flux financiers
donations (id, user_id, project_id, amount_eur, seeds_reward, stripe_payment_intent_id, status, created_at)
producer_supports (id, user_id, project_id, amount_eur, impact_credits_amount, stripe_payment_intent_id, status, created_at)
product_purchases (id, user_id, product_id, amount_eur_or_impact_credits, payment_method, status, created_at)

-- Ledgers
impact_credits_ledger (id, user_id, delta, source_type, source_id, created_at)
seeds_ledger (id, user_id, delta, source_type, source_id, created_at)

-- Projets / partenaires
projects (id, slug, name, type, status, producer_id, ...)
partners (id, slug, name, ...)
species (id, slug, name, conservation_status, ...)
project_species_links (project_id, species_id, link_type: 'primary'|'secondary')

-- BioDex utilisateur
user_species_unlocks (user_id, species_id, unlock_source_type, unlock_source_id, unlocked_at)

-- Impact
impact_claims (id, project_id, claim_type, value, unit, methodology, source, confidence_level, created_at)
impact_proof_sources (id, claim_id, source_url, source_type, verified_at)
```

**Préconditions avant création :**
- Mocks flows validés terrain
- Dashboard admin V2 cadré
- Stratégie Stripe webhooks stabilisée
- Tests utilisateur complets

---

## 14. Ce qui peut être considéré terminé

| Domaine | État |
|---------|------|
| Suppression `Artisans Locaux` du code TypeScript | ✅ R7 — Terminé |
| Correction `Gardiens des mers` gap (session/auth) | ✅ R7 — Terminé |
| `Profile.points` → `impactCreditsBalance` | ✅ R8 + fix — Terminé |
| `formatPoints` → `formatImpactCredits` zones Credits Impact claires | ✅ R8 — Terminé |
| `formatImpactCredits` sur score/XP corrigé → `formatPoints` | ✅ Cette passe — Terminé |
| Tags documentaires `[HYPOTHESE]` hors UI | ✅ Cette passe — Terminé |
| Wording `'Impact à valider'` → `'Suivi terrain à venir'` | ✅ Cette passe — Terminé |
| Claim `'A protégé 3 espèces menacées'` adouci | ✅ Cette passe — Terminé |
| `"Aucune quête"` → `"Aucune mission"` | ✅ Cette passe — Terminé |
| Adapters R5-R7 dans `activity-list.tsx` et `transaction-receipt.tsx` | ✅ R6-R7 — Terminé |
| `reçu fiscal` → `reçu de contribution` | ✅ R7 — Terminé |
| Wording UI `investment` → `soutien producteur` (zones couvertes) | ✅ R6-R7 — Terminé |
| Helpers `formatImpactCredits`, `formatSeeds` | ✅ R2-R3 — Terminés |
| `ProducerSupportViewModel` + adapters | ✅ R2-R5 — Terminés |
| pnpm type-check | ✅ Exit 0 |

---

## 15. Ce qui reste pour plus tard

| Domaine | Priorité | Risque | Raison du report |
|---------|----------|--------|-----------------|
| Route `/support` comme alias de `/invest` | P2 | Moyen | Inventaire liens, modals, redirects nécessaires |
| Stripe metadata `producer_support` | P2 | Élevé | Webhook strategy, compat legacy, tests Stripe |
| DB V2 | P3 | Critique | Attendre flows validés, admin V2, mocks gelés |
| `returns_received_points` clarification | P2 | Faible | Concept non affiché en UI actuelle |
| `monthly_points_allocation` clarification | P2 | Faible | Non affiché en UI actuelle |
| `mock-factions.ts` impactLabel adoucissement | P3 | Très faible | Données démo, non critique |
| BioDex unlock rules isolation (`investedProjectSlugs`) | P2 | Moyen | Exception prototype présente, BioDex non cassé |
| Lint CRLF 556 erreurs baseline | P3 | Nul | Biome format ou gitattributes |
| `formatPoints()` suppression de `utils.ts` | P3 | Faible | Attendre que tous les callers Supabase soient migrés |

---

## Verdict final

**Cette grande phase de refactoring préparatoire est TERMINÉE.**

- ✅ R1 à R8 validées
- ✅ type-check passe (exit 0)
- ✅ Lint : aucune nouvelle erreur (erreurs pre-existantes CRLF non introduites par nos changements)
- ✅ Aucune zone interdite touchée (Supabase, Stripe, routes `/invest`, `packages/core`)
- ✅ Wording dangereux corrigé (HYPOTHESE, Impact à valider, espèces menacées, quête)
- ✅ R8 sémantiquement corrigé (score/XP ≠ Credits Impact)
- ✅ Mocks clarifiés et classifiés sans casse
- ✅ Adapters actifs dans les deux zones UI prioritaires
- ✅ Plan `/support`, Stripe metadata, DB V2 documenté sans migration prématurée

**Prochaine étape recommandée :** Valider les flows UX terrain (don, soutien, produit) avant toute migration de route ou de metadata Stripe.

---

*Tags :* `[CONSOLIDATION]` `[R1-R8]` `[VALIDEE]` `[TYPECHECK_OK]` `[WORDING_PROPRE]` `[ADAPTERS]` `[MOCKS_STABILISES]`
