# Rapport de Phase R7 — Reçu de Contribution avec Adapters

**Date :** 2026-05-07  
**Portée :** `apps/web-client` — `transaction-receipt.tsx`  
**Statut :** `[VALIDEE]` — Intégration adapters dans le reçu de contribution

---

## 1. Résumé de R7

La phase R7 a étendu l'utilisation des adapters R5/R6 au composant `transaction-receipt.tsx`, qui affiche les détails et le reçu des contributions (soutiens producteurs, dons, commandes).

**Architecture R7 réalisée :**

```
legacy transaction data (investment/donation/order)
→ adapter (adaptNormalizedInvestmentToProducerSupport / adaptNormalizedDonationToViewModel)
→ ProducerSupportViewModel / DonationViewModel
→ UI propre sans termes financiers ni promesses non prouvées
```

---

## 2. Mini-audit transaction-receipt.tsx

### 2.1 Classification des champs et usages

| Champ/Usage | Classification | Justification |
|-------------|----------------|---------------|
| `transactionType: 'investment' \| 'donation' \| 'order'` | `[LEGACY_A_GARDER]` | Discriminant nécessaire pour routing |
| `legacyInvestmentData` (mock) | `[MOCK_PROTOTYPE]` | Données de démonstration — à remplacer |
| `legacyDonationData` (mock) | `[MOCK_PROTOTYPE]` | Données de démonstration — à remplacer |
| `adaptNormalizedInvestmentToProducerSupport()` | `[ADAPTER_ACTIF]` | ✅ Utilisé pour transformer legacy → VM |
| `adaptNormalizedDonationToViewModel()` | `[ADAPTER_ACTIF]` | ✅ Utilisé pour transformer legacy → VM |
| `supportVM.contributionTypeLabel` | `[UI_CIBLE]` | "Soutien producteur" affiché |
| `donationVM.contributionTypeLabel` | `[UI_CIBLE]` | "Don" affiché |
| `supportVM.amountImpactCredits` | `[CREDITS_IMPACT]` | Credits Impact pour soutien producteur |
| `donationVM.seedsReward` | `[GRAINES]` | Graines pour don pur |
| Timeline soutien | `[UI_CIBLE]` | Contribution versée → Projet en cours → Impact à valider |
| Timeline don | `[UI_CIBLE]` | Don reçu → Projet soutenu → Suivi disponible |
| `[HYPOTHESE]` disclaimer | `[P0-6]` | Mention obligatoire : impact réel dépend de la mise en œuvre |
| "Télécharger le reçu de contribution" | `[UI_CIBLE]` | Pas "reçu fiscal" |
| "Télécharger le reçu de don" | `[UI_CIBLE]` | Pas "reçu fiscal" |

### 2.2 Distinction Don / Soutien Producteur

| Aspect | Don pur | Soutien producteur |
|--------|---------|-------------------|
| **Label affiché** | "Don" | "Soutien producteur" |
| **Récompense** | Graines | Credits Impact |
| **Montant affiché** | `donationVM.amountEuros` | `supportVM.amountEuros` |
| **Timeline** | "Don reçu" → "Projet soutenu" | "Contribution versée" → "Projet en cours" |
| **Disclaimer** | "Le don pur n'est pas convertible en Credits Impact" | "[HYPOTHESE] L'impact réel dépend de la mise en œuvre du projet" |
| **Couleur icône** | Emerald (vert) | Lime (vert clair) |

---

## 3. Fichiers modifiés

| Fichier | Lignes | Description |
|---------|--------|-------------|
| `transaction-receipt.tsx` | ~+80/-20 | Intégration complète des adapters avec distinction don/soutien |

### 3.1 Changements clés

**Imports ajoutés :**
```typescript
import {
  adaptNormalizedInvestmentToProducerSupport,
  adaptNormalizedDonationToViewModel,
  type ProducerSupportViewModel,
} from '@/lib/mappers/producer-support-adapters'
```

**Type discriminant étendu :**
```typescript
type TransactionReceiptProps = {
  transactionId: string
  transactionType: 'investment' | 'donation' | 'order'  // [R7] + 'donation'
}
```

**Données legacy avec discriminant :**
```typescript
const legacyInvestmentData = {
  // ... champs legacy
  type: 'investment' as const,  // Discriminant requis par l'adapter
}

const legacyDonationData = {
  // ... champs legacy
  type: 'donation' as const,  // Discriminant requis par l'adapter
}
```

**Utilisation des adapters :**
```typescript
const supportVM = isInvestment 
  ? adaptNormalizedInvestmentToProducerSupport(legacyInvestmentData)
  : null

const donationVM = isDonation
  ? adaptNormalizedDonationToViewModel(legacyDonationData)
  : null
```

**UI différenciée :**
```typescript
{isProducerSupport ? (
  <>
    <p>Credits Impact reçus : {supportVM?.amountImpactCredits}</p>
    <p>[HYPOTHESE] L&apos;impact réel dépend de la mise en œuvre...</p>
  </>
) : isDonation ? (
  <>
    <p>Graines reçues : {donationVM?.seedsReward}</p>
    <p>Le don pur n&apos;est pas convertible en Credits Impact.</p>
  </>
) : (
  // Commande
)}
```

---

## 4. Adapters utilisés

| Adapter | Source | Destination | Usage dans R7 |
|---------|--------|-------------|---------------|
| `adaptNormalizedInvestmentToProducerSupport()` | `NormalizedInvestmentLegacy` | `ProducerSupportViewModel` | Reçu soutien producteur |
| `adaptNormalizedDonationToViewModel()` | `NormalizedDonationLegacy` | `DonationViewModel` | Reçu don pur |

---

## 5. Wording du reçu

### 5.1 Ce qui est affiché

| Élément | Wording | Conformité P0-6 |
|---------|---------|-----------------|
| Type contribution | "Soutien producteur" / "Don" | ✅ Correct |
| Reçu bouton | "Télécharger le reçu de contribution" / "Télécharger le reçu de don" | ✅ Pas "fiscal" |
| Timeline soutien | "Contribution versée" → "Projet en cours" → "Impact à valider" | ✅ Progression honnête |
| Timeline don | "Don reçu" → "Projet soutenu" → "Suivi disponible" | ✅ Confirmation |
| Disclaimer | "[HYPOTHESE] L'impact réel dépend de la mise en œuvre du projet sur le terrain" | ✅ P0-6 doctrine |
| Monnaie | "Credits Impact" (pas "points") | ✅ P0-3 |

### 5.2 Ce qui est évité

| Terme évité | Remplacé par | Raison |
|-------------|--------------|--------|
| "Reçu fiscal" | "Reçu de contribution" / "Reçu de don" | Pas de validation légale |
| "Impact validé" | "Impact à valider" | Pas de preuve terrain |
| "Impact vérifié" | "Suivi en cours" | Pas de méthode robuste |
| "Abeilles sauvées" | "Projet apicole" / "Abeilles soutenues" | Pas de promesse non prouvée |
| "Espèces sauvées" | "Protection des lémuriens" (projet lié) | Pas de preuve directe |
| "Crédits" | "Credits Impact" | Terme officiel P0-3 |

---

## 6. Champs legacy conservés

| Élément | Conservation | Raison |
|---------|------------|--------|
| `type: 'investment'` | ✅ Conservé | Discriminant legacy nécessaire |
| `type: 'donation'` | ✅ Ajouté | Nouveau discriminant pour dons |
| `NormalizedInvestment` type | ✅ Non modifié | Pas d'impact sur autres fichiers |
| `NormalizedDonation` type | ✅ Non modifié | Pas d'impact sur autres fichiers |
| Route `/profile/investments` | ✅ Non renommée | Attend R5B |
| Requêtes Supabase | ✅ Non touchées | Dans `page.tsx` |

---

## 7. Validation technique

```bash
✅ pnpm type-check  # Exit code 0 — Aucune erreur TypeScript
✅ pnpm lint        # Exit code 0 — Aucune erreur de linting
```

---

## 8. Recherche occurrences sensibles

### 8.1 Termes recherchés

| Terme | Occurrences trouvées | Classement |
|-------|---------------------|--------------|
| "reçu fiscal" / "recu fiscal" | 0 | ✅ Aucun — correct |
| "impact validé" | 0 | ✅ Aucun — correct |
| "impact vérifié" | 0 | ✅ Aucun — correct |
| "abeilles sauvées" | 0 | ✅ Aucun — correct |
| "espèces sauvées" | 0 | ✅ Aucun — correct |

### 8.2 Occurrences legacy attendues (non problématiques)

| Terme | Occurrences | Fichiers principaux | Classification |
|-------|-------------|---------------------|--------------|
| "investment" | 194 | 25 fichiers | `[LEGACY_CODE]` — routes, types, Supabase |
| "investissement" | 0 | — | ✅ Aucun en UI utilisateur |

Les occurrences de "investment" restantes sont :
- Routes (`/invest`, `/profile/investments`)
- Types (`NormalizedInvestment`, `MockInvestmentRecord`)
- Actions Stripe (`create-investment.action.ts`)
- Requêtes Supabase (`.from('investments')`)
- Mappers et adapters (pour transformation legacy → nouveau)

Toutes ces occurrences sont `[LEGACY_A_GARDER]` ou `[ADAPTER_ACTIF]`.

---

## 9. Risques restants

| Risque | Niveau | Mitigation | Action future |
|--------|--------|------------|---------------|
| Données mock hardcodées | Moyen | Remplacer par données réelles | R8A — Stabiliser mocks |
| Pas de view-model pour Order | Faible | `orderData` reste legacy | Créer `OrderViewModel` si besoin |
| Timeline simplifiée | Faible | Pas de dates réelles terrain | Intégrer suivi projet réel |
| Type `'investment'` vs `'producer_support'` | Faible | Discriminant legacy conservé | Migrer vers `'producer_support'` en R5B |

---

## 10. Métriques R7

| Métrique | Valeur |
|----------|--------|
| Fichiers modifiés | 1 |
| Adapters utilisés | 2 |
| Types legacy modifiés | 0 ✅ |
| Routes modifiées | 0 ✅ |
| Supabase modifié | 0 ✅ |
| Stripe modifié | 0 ✅ |
| Wording financier éliminé | ✅ |
| "Reçu fiscal" présent | 0 ✅ |
| Type-check | ✅ Pass |
| Lint | ✅ Pass |

---

## 11. Architecture résultante

### 11.1 Flux de données

```
┌─────────────────────────────────────────────────────────────────┐
│                  transaction-receipt.tsx                          │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  Props legacy (non modifiées)                                 ││
│  │  transactionId: string                                        ││
│  │  transactionType: 'investment' | 'donation' | 'order'          ││
│  └─────────────────────────────────────────────────────────────┘│
│                              │                                    │
│                              ▼                                    │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  [R7] Mock data avec discriminant type                        ││
│  │  legacyInvestmentData = { ..., type: 'investment' }           ││
│  │  legacyDonationData = { ..., type: 'donation' }               ││
│  └─────────────────────────────────────────────────────────────┘│
│                              │                                    │
│                              ▼                                    │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  [R7] Adapters R5/R6                                          ││
│  │  supportVM = adaptNormalizedInvestmentToProducerSupport()    ││
│  │  donationVM = adaptNormalizedDonationToViewModel()           ││
│  └─────────────────────────────────────────────────────────────┘│
│                              │                                    │
│                              ▼                                    │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  [R7] UI avec view-models                                       ││
│  │  - supportVM.contributionTypeLabel → "Soutien producteur"     ││
│  │  - donationVM.contributionTypeLabel → "Don"                  ││
│  │  - supportVM.amountImpactCredits → Credits Impact             ││
│  │  - donationVM.seedsReward → Graines                           ││
│  │  - [HYPOTHESE] disclaimer pour P0-6                           ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

---

## 12. Verdict R7

**Verdict :** ✅ **R7 VALIDÉE**

**Résumé :**
- ✅ Mini-audit complet de `transaction-receipt.tsx`
- ✅ Classification claire des champs et usages
- ✅ Intégration réussie de `adaptNormalizedInvestmentToProducerSupport()`
- ✅ Intégration réussie de `adaptNormalizedDonationToViewModel()`
- ✅ Distinction nette entre don (Graines) et soutien producteur (Credits Impact)
- ✅ Wording conforme P0-3 et P0-6
- ✅ Pas de "reçu fiscal", "impact validé", promesses non prouvées
- ✅ Timeline adaptée par type de contribution
- ✅ Disclaimer `[HYPOTHESE]` pour doctrine d'impact
- ✅ Types legacy conservés intacts
- ✅ Routes non modifiées
- ✅ Supabase non touché
- ✅ Validations techniques passées

**Architecture atteinte :**

```
legacy data (investment/donation)
→ adapter
→ ProducerSupportViewModel / DonationViewModel
→ UI propre avec distinction don/soutien et disclaimer P0-6
```

**État des livrables :**
- `transaction-receipt.tsx` — `[ACTIF]` (enrichi avec adapters et distinction don/soutien)
- `@/lib/mappers/producer-support-adapters.ts` — `[ACTIF]` (pas de modification, réutilisation)
- `@/doc/_audit/REFACTORING-PHASE-R7-REPORT.md` — `[DOCUMENTATION]` (ce fichier)

---

## 13. Recommandation R8

### Option recommandée : **R8A — Stabiliser les mocks critiques**

**Pourquoi pas R8B (route `/support`) maintenant ?**

- Les adapters commencent à être utilisés dans 2 zones UI (activity-list, transaction-receipt)
- Les mocks sont encore hardcodés dans `transaction-receipt.tsx`
- Il faut stabiliser la source de données avant de créer nouvelles routes
- La route `/support` nécessite planification redirects et compatibilité

**Objectifs R8A suggérés :**

1. **Stabiliser `mock-member-data.ts`**
   - Rendre les données mock plus cohérentes avec les adapters
   - Ajouter des helpers pour générer des records de test

2. **Créer un mock service pour les reçus**
   - Remplacer les données hardcodées dans `transaction-receipt.tsx`
   - Permettre de tester différents scénarios (don, soutien, commande)

3. **Documentation des adapters**
   - Documenter l'usage des adapters pour les développeurs
   - Créer des exemples de patterns d'utilisation

**R8B (route `/support`) reste planifiée pour plus tard**, après stabilisation des mocks et validation des adapters dans toutes les zones UI.

---

*Tags :* `[R7]` `[VALIDEE]` `[RECEIPT]` `[ADAPTERS]` `[UI]` `[P0-1]` `[P0-3]` `[P0-6]` `[DON]` `[SOUTIEN_PRODUCTEUR]` `[CONTRIBUTION]`
