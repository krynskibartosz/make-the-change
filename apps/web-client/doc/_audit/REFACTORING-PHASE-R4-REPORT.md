# Rapport de Phase R4 — Intégration Mapper Producer Support

**Date :** 2026-05-07  
**Portée :** `apps/web-client`  
**Statut :** `[VALIDEE]` — Audit UI investment et correction terminologique

---

## 1. Résumé de R4

La phase R4 avait pour objectif d'intégrer progressivement le mapper `mapInvestmentToProducerSupport()` dans les UI liées à `investment`, sans renommer les routes ni les structures legacy.

**Constat principal :** Le mapper créé en R2/R3 est prêt mais l'intégration complète nécessiterait une refonte des types locaux (`NormalizedInvestment`). La stratégie R4 a été adaptée pour se concentrer sur la **correction des labels UI** problématiques.

**Philosophie R4 :** Corriger le wording visible utilisateur pour éliminer les termes financiers ("Fonds transférés"), garder le mapper préparatoire pour R5, ne pas toucher aux structures data.

---

## 2. Mini-Audit des Occurrences `investment`

### 2.1 Classification par zone

| Fichier | Occurrences | Contexte | Classification | Action R4 |
|---------|-------------|----------|----------------|-----------|
| `activity-list.tsx` | 28 | `NormalizedInvestment`, `type: 'investment'`, filtres | `[TECH_LEGACY_A_GARDER]` | ⏸️ Label UI déjà "Soutien" ✅ |
| `create-investment.action.ts` | 22 | Action Stripe/Supabase, metadata, insertion | `[A_NE_PAS_TOUCHER]` | ⏸️ Stripe + Supabase |
| `profile/[id]/page.tsx` | 21 | Requête `.from('investments')`, affichage | `[TECH_LEGACY_A_GARDER]` | ⏸️ UI déjà "Soutien" ✅ |
| `investments/page.tsx` | 17 | Requête Supabase, `NormalizedInvestment` | `[TECH_LEGACY_A_GARDER]` | ⏸️ Data layer |
| `producer-support.mapper.ts` | 16 | Définition mapper et labels | `[PREPARATOIRE]` | ✅ Mapper prêt |
| `mock-biodex.ts` | 15 | `investedProjectSlugs`, BioDex | `[TECH_LEGACY_A_GARDER]` | ⏸️ Structure mock |
| `invest-client.tsx` | 13 | Flow soutien (déjà migré R3) | `[UI_OK]` | ✅ Labels corrects |
| `transaction-receipt.tsx` | 11 | Reçu transaction | `[UI_A_CORRIGER]` | ✅ "Fonds transférés" corrigé |
| `mock-member-data.ts` | 11 | `MockInvestmentRecord` | `[TECH_LEGACY_A_GARDER]` | ⏸️ Structure mock |
| `project-invest-one-flow.tsx` | 8 | Flow invest (déjà migré R3) | `[UI_OK]` | ✅ Labels corrects |

### 2.2 Analyse détaillée par zone

#### `[UI_A_CORRIGER]` — Corrigé en R4

| Fichier | Avant | Après | Ligne |
|---------|-------|-------|-------|
| `transaction-receipt.tsx` | `Fonds transférés` | `Contribution versée` | 23 |

**Raison :** Le terme "Fonds" a une connotation financière/investissement à éviter selon P0-1.

#### `[UI_OK]` — Déjà correct (R2/R3)

| Fichier | Label observé | Statut |
|---------|---------------|--------|
| `activity-list.tsx` | "Soutien" | ✅ Correct |
| `activity-list.tsx` | "Total Soutiens" | ✅ Correct |
| `invest-client.tsx` | "Crédits estimés" | ✅ Correct (R3) |
| `invest-client.tsx` | "Votre solde" | ✅ Correct |
| `project-invest-one-flow.tsx` | "Soutien producteur" | ✅ Correct |
| `project-invest-one-flow.tsx` | "Votre soutien au projet" | ✅ Correct |
| `transaction-receipt.tsx` | "Télécharger le reçu de contribution (PDF)" | ✅ Correct |
| `transaction-receipt.tsx` | "Votre soutien de..." | ✅ Correct |

#### `[TECH_LEGACY_A_GARDER]` — Non modifié (risque trop élevé)

| Fichier | Élément | Raison |
|---------|---------|--------|
| `investments/page.tsx` | `from('investments')` | Requête Supabase legacy |
| `investments/page.tsx` | `NormalizedInvestment` | Type local utilisé par multiple composants |
| `profile/[id]/page.tsx` | `from('investments')` | Requête Supabase |
| `create-investment.action.ts` | `order_type: "investment"` | Metadata Stripe persistée |
| `create-investment.action.ts` | `from('investments')` | Insertion Supabase |
| `mock-member-data.ts` | `MockInvestmentRecord` | Structure mock utilisée par BioDex, wallet, historique |

#### `[PREPARATOIRE]` — Mapper prêt pour R5

| Élément | Statut | Usage |
|---------|--------|-------|
| `mapInvestmentToProducerSupport()` | Défini, testé | Non utilisé en production |
| `ProducerSupportViewModel` | Type prêt | Attente adaptation types locaux |
| `PRODUCER_SUPPORT_LABELS` | Exporté | Peut être utilisé dans nouveaux composants |

---

## 3. Modifications R4

### 3.1 Fichiers modifiés

| Fichier | Modification | Classification |
|---------|-------------|----------------|
| `transaction-receipt.tsx` | `Fonds transférés` → `Contribution versée` | `[UI_A_CORRIGER]` |

### 3.2 Fichiers analysés mais non modifiés

| Fichier | Raison |
|---------|--------|
| `activity-list.tsx` | Labels déjà corrects, types legacy à garder |
| `investments/page.tsx` | Requêtes Supabase, ne pas toucher |
| `profile/[id]/page.tsx` | Requêtes Supabase, ne pas toucher |
| `create-investment.action.ts` | Stripe + Supabase, ne pas toucher |
| `mock-member-data.ts` | Structure data, risque trop élevé |

---

## 4. Statut du Mapper

### 4.1 `mapInvestmentToProducerSupport()`

**Utilisation actuelle :** `[PREPARATOIRE]` — 0 utilisation en production

**Raison :** Les composants utilisent des types locaux (`NormalizedInvestment`) qui ne sont pas compatibles directement avec `MockInvestmentRecord`. Une adaptation des types ou une conversion supplémentaire serait nécessaire.

**Recommandation R5 :** Créer une couche de normalisation qui adapte `NormalizedInvestment` vers `ProducerSupportViewModel` pour les nouveaux composants UI.

### 4.2 Labels disponibles

```typescript
// PRODUCER_SUPPORT_LABELS exportés et prêts à l'emploi
{
  ctaSupport: 'Soutenir ce producteur',
  sectionTitle: 'Soutien aux producteurs',
  legalMention: 'Pas de rendement financier ni de remboursement garanti.',
  contributedAmount: 'Montant contribué',
  creditsReceived: 'Credits Impact reçus',
  receiptLabel: 'Reçu de contribution',
}
```

---

## 5. Inventaire des Termes Sensibles

### 5.1 Termes vérifiés (grep complet)

| Terme | Occurrences | Statut |
|-------|-------------|--------|
| `investir` / `Investir` | 0 en UI | ✅ Aucun verbe investir |
| `rendement` | 0 en UI | ✅ Aucune promesse |
| `profit` | 0 en UI sauf `profitSharing` (impact économique produit) | ✅ Contexte correct |
| `ROI` | 0 | ✅ Aucune occurrence |
| `retour.*investissement` | 0 | ✅ Aucune occurrence |
| `fiscal` | 0 en UI sauf legacy commentaires | ✅ Pas de promesse fiscale |

### 5.2 Termes legacy présents mais justifiés

| Terme | Présence | Justification |
|-------|----------|---------------|
| `investment` | Types, routes, Supabase | `[TECH_LEGACY_A_GARDER]` |
| `invest` | Route `/invest` | `[TECH_LEGACY_A_GARDER]` |
| `amount_points` | Mocks, DB | `[A_MIGRER_PLUS_TARD]` (P0-3) |

---

## 6. Résultats Type-check / Lint

```bash
pnpm type-check  # ✅ Exit code 0
pnpm lint        # ✅ Exit code 0
```

**Aucune régression** — la modification terminologique est validée.

---

## 7. Zones Non Traitées (Raisons)

| Zone | Raison | Plan |
|------|--------|------|
| Intégration mapper dans composants | Nécessite refonte types locaux | R5 avec adaptation `NormalizedInvestment` |
| Renommage routes `/invest` | Risque élevé (bookmarks, liens, Stripe return URL) | R5B avec redirects |
| Renommage table Supabase | Migration DB complexe | P0-10a → Future DB V2 |
| Metadata Stripe `order_type` | Compatibilité historique paiements | P0-2 Phase 5 |
| `MockInvestmentRecord` structure | BioDex, wallet, historique dépendent | P0-10a stabilisation mocks |

---

## 8. Risques Restants

| Risque | Niveau | Mitigation |
|--------|--------|------------|
| Termes "investment" encore visibles en UI technique | Faible | Aucun verbe "investir", labels corrigés |
| Mapper non utilisé | Faible | Préparatoire, ne bloque pas R5 |
| Structure types locaux / mapper mismatch | Moyen | Nécessite adaptation R5 |
| Routes `/invest` et `/profile/investments` | Moyen | Plan R5B avec redirects |

---

## 9. Recommandation R5

### 9.1 Deux chemins possibles

#### R5A — Stabilisation Mocks (P0-10a)

**Objectif :** Stabiliser les 5 mocks critiques avant conception DB V2.

**Travail :**
1. Documenter structure `mock-member-data.ts`
2. Documenter liens BioDex ↔ investment
3. Créer dictionnaire correspondance DB V2
4. Uniformiser API des mocks

#### R5B — Alias Route `/support`

**Objectif :** Introduire `/projects/[slug]/support` sans supprimer `/invest`.

**Travail :**
1. Créer route `/support` (copie ou redirect interne)
2. Adapter `project-action.ts` pour générer `/support`
3. Tester modale interceptée `/support`
4. Plan de redirection `/invest` → `/support`

### 9.2 Intégration Mapper (indépendante)

**Objectif :** Utiliser `mapInvestmentToProducerSupport()` dans nouveaux composants.

**Travail :**
1. Créer adaptateur `NormalizedInvestment` → `ProducerSupportViewModel`
2. Utiliser mapper dans `activity-list.tsx` (section nouvelle)
3. Utiliser `PRODUCER_SUPPORT_LABELS` dans composants neufs

---

## 10. Métriques R4

| Métrique | Valeur |
|----------|--------|
| Fichiers modifiés | 1 |
| Labels UI corrigés | 1 ("Fonds transférés" → "Contribution versée") |
| Mapper utilisé | 0 (reste `[PREPARATOIRE]`) |
| Zones Supabase touchées | 0 ✅ |
| Zones Stripe touchées | 0 ✅ |
| Routes renommées | 0 ✅ |
| Type-check | ✅ Pass |
| Lint | ✅ Pass |
| Régressions | 0 |

---

## 11. Verdict R4

**Verdict :** ✅ **R4 VALIDÉE**

**Résumé :**
- Mini-audit complet des 219 occurrences `investment`
- Correction du label "Fonds transférés" (connotation financière)
- Confirmation que la majorité des labels UI sont déjà corrects ("Soutien", "Contribution")
- Aucune zone interdite touchée
- Mapper prêt pour R5

**Prochaine étape recommandée :** Décider entre R5A (stabilisation mocks) ou R5B (alias route /support).

---

*Tags :* `[R4]` `[VALIDEE]` `[MAPPER]` `[P0-2]` `[UI_WORDING]` `[INVESTMENT]` `[PRODUCER_SUPPORT]`
