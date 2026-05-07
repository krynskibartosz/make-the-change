# Rapport de Phase R6 — Intégration UI des Adapters

**Date :** 2026-05-07  
**Portée :** `apps/web-client`  
**Statut :** `[VALIDEE]` — Intégration adapters dans UI historique

---

## 1. Résumé de R6

La phase R6 avait pour objectif d'intégrer les adapters créés en R5 dans une première zone UI réelle : la page d'historique des contributions (`/profile/investments`).

**Architecture R6 réalisée :**

```
legacy NormalizedInvestment ──┐
                              ├──► adapter ──► ProducerSupportViewModel ──► UI
legacy NormalizedDonation ────┘
```

---

## 2. Mini-audit activity-list.tsx

### 2.1 Classification des usages

| Usage | Classification | Justification |
|-------|----------------|---------------|
| `NormalizedInvestment` type local | `[TECH_LEGACY_A_GARDER]` | Type nécessaire pour props avec `page.tsx` |
| `NormalizedDonation` type local | `[TECH_LEGACY_A_GARDER]` | Type nécessaire pour props avec `page.tsx` |
| `NormalizedOrder` type local | `[TECH_LEGACY_A_GARDER]` | Type nécessaire pour props avec `page.tsx` |
| `type: 'investment'` discriminant | `[TECH_LEGACY_A_GARDER]` | Utilisé pour filtrage et routing |
| `type: 'donation'` discriminant | `[TECH_LEGACY_A_GARDER]` | Utilisé pour filtrage et routing |
| Filtres `'investment'`, `'donation'`, `'order'` | `[TECH_LEGACY_A_GARDER]` | Valeurs utilisées dans URL/routing |
| Rendu item investment | `[UI_A_ADAPTER]` ✅ | Migré vers `ProducerSupportViewModel` |
| Rendu item donation | `[UI_A_ADAPTER]` ✅ | Migré vers view-model donation |
| Rendu item order | `[AMBIGU_A_GARDER]` | Conservé tel quel (pas de view-model dédié) |

### 2.2 Zones non modifiées (respect des règles)

| Zone | Modifié ? | Raison |
|------|-----------|--------|
| Types locaux (`Normalized*`) | ❌ Non | Props inchangées avec `page.tsx` |
| Discriminants `type` | ❌ Non | Utilisés pour routing/filtrage |
| Logique de filtre | ❌ Non | URLs et navigation intactes |
| Appel API Supabase | ❌ Non | Dans `page.tsx`, non touché |
| Routes | ❌ Non | `/profile/investments` conservée |

---

## 3. Intégration réalisée

### 3.1 Imports ajoutés

```typescript
import {
  adaptNormalizedInvestmentToProducerSupport,
  adaptNormalizedDonationToViewModel,
  type ProducerSupportViewModel,
} from '@/lib/mappers/producer-support-adapters'
```

### 3.2 Utilisation dans le rendu investment

```typescript
// [R6] Adapter vers ProducerSupportViewModel pour affichage moderne
const support = adaptNormalizedInvestmentToProducerSupport(investment)
const statusLabel = support.statusLabel

// Utilisation dans JSX :
// - support.contributionTypeLabel → "Soutien producteur"
// - support.project.name (au lieu de project.name_default)
// - support.amountEuros (au lieu de investment.amount_eur)
// - support.createdAt (au lieu de investment.created_at)
```

### 3.3 Utilisation dans le rendu donation

```typescript
// [R6] Adapter vers view-model donation pour affichage moderne
const donationVM = adaptNormalizedDonationToViewModel(donation)
const statusLabel = donationVM.statusLabel

// Utilisation dans JSX :
// - donationVM.contributionTypeLabel → "Don"
// - donationVM.seedsReward (pour Graines reçues)
// - donationVM.amountEuros (montant donné)
```

### 3.4 Fichier modifié

| Fichier | Modification | Lignes |
|---------|--------------|--------|
| `activity-list.tsx` | Import adapters + intégration dans rendu investment/donation | +12 lignes, modifications rendu |

---

## 4. Déplacement documentation

### 4.1 Fichier déplacé

| Source | Destination | Raison |
|--------|-------------|--------|
| `src/lib/mappers/producer-support-classification.md` | `doc/_audit/producer-support-classification.md` | Documentation d'audit doit être dans `_audit/` |

### 4.2 Pourquoi ce déplacement

- Le fichier est pure documentation de classification (pas de code)
- Les autres rapports de phase sont dans `doc/_audit/`
- Cohérence avec l'organisation existante
- Aucune référence code ne pointe vers ce fichier (imports, etc.)

---

## 5. Mise à jour adapters

### 5.1 Re-export ajouté

```typescript
// Re-export du view-model cible depuis le mapper original
export type { ProducerSupportViewModel } from './producer-support.mapper'
```

**Pourquoi :** Permettre aux consommateurs d'importer `ProducerSupportViewModel` depuis le fichier adapters (point d'entrée unique).

---

## 6. Validation technique

```bash
✅ pnpm type-check  # Exit code 0
✅ pnpm lint        # Exit code 0
```

**Aucune régression** — les modifications sont contenues et non destructives.

---

## 7. État des livrables R6

### 7.1 Fichiers modifiés

| Fichier | Description | Statut |
|---------|-------------|--------|
| `src/app/[locale]/(screens)/profile/investments/_features/activity-list.tsx` | Intégration adapters dans UI | `[ACTIF]` |
| `src/lib/mappers/producer-support-adapters.ts` | Re-export ProducerSupportViewModel | `[ACTIF]` |

### 7.2 Fichiers déplacés

| Fichier | Description | Statut |
|---------|-------------|--------|
| `doc/_audit/producer-support-classification.md` | Classification champs (déplacé) | `[DOCUMENTATION]` |

---

## 8. Architecture résultante

### 8.1 Flux de données

```
┌─────────────────────────────────────────────────────────────────┐
│                         page.tsx                                │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐   │
│  │ getMockInvestments │  │ Supabase query   │  │ normalize    │   │
│  │ .from('investments')│  │ .from('investments')│  │ types        │   │
│  └────────┬─────────┘  └────────┬─────────┘  └──────┬───────┘   │
│           │                    │                   │           │
│           └────────────────────┼───────────────────┘           │
│                                ▼                               │
│                    ┌─────────────────────┐                     │
│                    │ NormalizedInvestment │                     │
│                    │ (type local legacy)   │                     │
│                    └──────────┬──────────┘                     │
└───────────────────────────────┼──────────────────────────────────┘
                                │
                                ▼ props
┌─────────────────────────────────────────────────────────────────┐
│                    activity-list.tsx                              │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  [R6] Adapter Integration                                   │  │
│  │                                                             │  │
│  │  const support = adaptNormalizedInvestmentToProducerSupport(│  │
│  │    investment                                               │  │
│  │  )                                                          │  │
│  │                                                             │  │
│  │  // support = ProducerSupportViewModel                      │  │
│  │  // - contributionTypeLabel: "Soutien producteur"            │  │
│  │  // - amountEuros: number                                  │  │
│  │  // - amountImpactCredits: number                          │  │
│  │  // - statusLabel: "En cours" | "Terminé" | ...            │  │
│  └────────────────────────┬───────────────────────────────────┘  │
│                           │                                      │
│                           ▼                                      │
│                    ┌─────────────┐                               │
│                    │     UI      │                               │
│                    │  (JSX)      │                               │
│                    └─────────────┘                               │
└─────────────────────────────────────────────────────────────────┘
```

### 8.2 Points clés

- **Types legacy conservés** : `NormalizedInvestment`, `NormalizedDonation`, `NormalizedOrder` inchangés
- **Adapter au point d'usage** : Transformation juste avant le rendu
- **Labels modernes** : "Soutien producteur" affiché via `contributionTypeLabel`
- **Pas de régression** : Routes, filtres, types inchangés

---

## 9. Ce qui a été préservé

| Élément | État | Raison |
|---------|------|--------|
| `NormalizedInvestment` | ✅ Inchangé | Type nécessaire pour interface page.tsx |
| `NormalizedDonation` | ✅ Inchangé | Type nécessaire pour interface page.tsx |
| `NormalizedOrder` | ✅ Inchangé | Type nécessaire pour interface page.tsx |
| Route `/profile/investments` | ✅ Inchangée | Pas de renommage |
| Dossier `investments/` | ✅ Inchangé | Pas de renommage |
| Requêtes Supabase | ✅ Inchangées | Dans page.tsx, non touchées |
| Filtres `investment`, `donation`, `order` | ✅ Inchangés | Utilisés pour routing |
| Discriminants `type` | ✅ Inchangés | Nécessaires pour logique |

---

## 10. Ce qui a été amélioré

| Aspect | Avant | Après |
|--------|-------|-------|
| **Label type contribution** | "Soutien" (hardcoded) | `support.contributionTypeLabel` → "Soutien producteur" |
| **Accès propriétés** | `investment.project?.name_default` | `support.project.name` (avec fallback) |
| **Coherence dates** | `investment.created_at` | `support.createdAt` (camelCase) |
| **Type-safety** | Direct access legacy | View-model structuré |
| **Maintenance** | Changements dispersés | Centralisés dans adapters |

---

## 11. Limites et non-faits (intentionnel)

| Élément | Pourquoi non modifié |
|---------|---------------------|
| Orders (commandes) | Pas de view-model spécifique créé en R5 — à faire si besoin |
| Rename dossier `investments` | Trop invasif — nécessite plan R5B |
| Rename route `/profile/investments` | Nécessite redirects + plan de compatibilité |
| Renommage Supabase | `[A_NE_PAS_TOUCHER]` — legacy V0 |
| Modification `page.tsx` | Risque de régression data fetching |

---

## 12. Prochaines étapes recommandées

### Option A — Étendre à d'autres composants (R7)

Intégrer les adapters dans :
- `transaction-receipt.tsx` pour les détails de transaction
- Nouveau composant `ProducerSupportCard` extrait de activity-list

### Option B — Nettoyage et documentation (R7)

- Mettre à jour `02-ETAT-ACTUEL-CODE.md` avec l'état R6
- Documenter l'usage des adapters pour nouveaux développeurs
- Créer exemples d'utilisation

### Option C — Stabilisation route (R5B)

Planifier (hors scope immédiat) :
- Route `/profile/contributions` ou `/profile/supports`
- Redirects depuis `/profile/investments`
- Gestion bookmarks et liens existants

---

## 13. Métriques R6

| Métrique | Valeur |
|----------|--------|
| Fichiers modifiés | 2 |
| Fichiers déplacés | 1 |
| Adapters intégrés | 2 (`adaptNormalizedInvestmentToProducerSupport`, `adaptNormalizedDonationToViewModel`) |
| Types legacy modifiés | 0 ✅ |
| Routes modifiées | 0 ✅ |
| Requêtes Supabase modifiées | 0 ✅ |
| Lignes ajoutées (imports) | +4 |
| Lignes modifiées (rendu) | ~40 (investment + donation) |
| Type-check | ✅ Pass |
| Lint | ✅ Pass |
| Régressions | 0 |

---

## 14. Verdict R6

**Verdict :** ✅ **R6 VALIDÉE**

**Résumé :**
- ✅ Mini-audit complet de activity-list.tsx
- ✅ Classification claire des usages `[UI_A_ADAPTER]`, `[TECH_LEGACY_A_GARDER]`, etc.
- ✅ Intégration réussie des adapters dans le rendu investment
- ✅ Intégration réussie des adapters dans le rendu donation
- ✅ Types legacy conservés intacts
- ✅ Routes et filtres non modifiés
- ✅ Supabase non touché
- ✅ Documentation déplacée vers `_audit/`
- ✅ Validations techniques passées

**Architecture atteinte :**

```
legacy NormalizedInvestment ──► adapter ──► ProducerSupportViewModel ──► UI
```

**État des livrables :**
- `@/lib/mappers/producer-support-adapters.ts` — `[ACTIF]` (enrichi re-export)
- `@/doc/_audit/producer-support-classification.md` — `[DOCUMENTATION]` (déplacé)
- `@/doc/_audit/REFACTORING-PHASE-R6-REPORT.md` — `[DOCUMENTATION]` (ce fichier)

**Prochaine étape recommandée :** R7 — Extension des adapters à d'autres composants UI ou consolidation documentation.

---

*Tags :* `[R6]` `[VALIDEE]` `[UI]` `[ADAPTERS]` `[INTEGRATION]` `[P0-1]` `[P0-3]` `[INVESTMENT]` `[PRODUCER_SUPPORT]`
