# Audit `points` -> Credits Impact / Graines

Date : 2026-05-07

Portee : audit documentaire uniquement. Aucun code applicatif, mock, schema Supabase, route, composant, action, type ou integration Stripe n'est modifie par ce document.

Statuts utilises : `[CREDITS_IMPACT_LEGACY]`, `[GRAINES]`, `[SCORE_OU_XP]`, `[IMPACT_METRIC]`, `[LEGACY_INVESTMENT]`, `[SUPABASE_LEGACY]`, `[UNKNOWN]`, `[DEPRECIE]`, `[RISQUE]`, `[A_PLANIFIER]`, `[A_VERIFIER_CODE]`

## 1. Resume

`[A_VERIFIER_CODE]` Le terme `points` ne signifie pas une seule chose dans le code actuel.

Il peut designer selon les zones :

- une ancienne monnaie boutique proche des Credits Impact ;
- une valeur de prix produit ;
- un solde portefeuille ;
- un montant recu apres soutien producteur ;
- une allocation mensuelle d'abonnement legacy ;
- une logique de retour/rendement liee a l'ancien modele `investment` ;
- un score ou une progression ;
- une approximation d'impact ;
- un champ Supabase V0 legacy.

`[CIBLE_VALIDEE]` Il ne faut pas conclure automatiquement que `points = Credits Impact` partout.

`[CIBLE_VALIDEE]` Supabase actuel est `[ACTUEL_CODE]` + `[LEGACY]` + `[A_NE_PAS_TOUCHER]`; les champs `points` issus de cette base ne definissent pas la cible produit.

## 2. Tableau de classification

| Occurrence | Fichier | Contexte | Categorie | Risque | Recommandation |
|---|---|---|---|---|---|
| `price_points` | `src/app/[locale]/(tabs)/products/_features/mock-products.ts` | Prix produit en monnaie boutique mock | `[CREDITS_IMPACT_LEGACY]` | Moyen | Futur nom cible : `impact_credits_price` ou equivalent. |
| `price_points` | `src/app/[locale]/(tabs)/projects/_features/mock-projects.ts` | Produits rattaches aux projets/producteurs | `[CREDITS_IMPACT_LEGACY]` | Moyen | Garder en legacy mock, documenter comme Credits Impact cote UI. |
| `unit_price_points`, `total_price_points` | `src/lib/mock/mock-member-data.ts` | Lignes de commande mock payees en points | `[CREDITS_IMPACT_LEGACY]` | Moyen | A migrer plus tard vers prix/montants en `impact_credits`. |
| `subtotal_points`, `shipping_cost_points`, `tax_points`, `total_points` | `src/lib/mock/mock-member-data.ts` | Commandes mock en credits boutique | `[CREDITS_IMPACT_LEGACY]` | Moyen | Conserver comme source prototype, ne pas traiter comme DB finale. |
| `selectedFormat.points` | `product-checkout-view.tsx` | Cout d'un produit en Credits Impact UI | `[CREDITS_IMPACT_LEGACY]` | Faible-moyen | Variable candidate a renommer plus tard en `impactCredits`. |
| `userBalance`, `totalCost`, `newBalance` calcules depuis `points` | `product-checkout-view.tsx` | Solde et cout d'echange produit | `[CREDITS_IMPACT_LEGACY]` | Moyen | Renommer conceptuellement en solde Credits Impact plus tard. |
| `CurrencyAmount kind="impactCredits"` | `product-checkout-view.tsx`, `project-invest-one-flow.tsx`, `balance-modal-content.tsx` | Affichage UI cible Credits Impact | `[CREDITS_IMPACT_LEGACY]` en entree, UI cible correcte | Faible | Garder UI `Credits Impact`; aligner les donnees plus tard. |
| `amount_points` | `MockInvestmentRecord` | Montant associe a ancien investissement/soutien | `[LEGACY_INVESTMENT]` + `[CREDITS_IMPACT_LEGACY]` | Eleve | Ne pas migrer brutalement; rattacher au plan `investment -> producer_support`. |
| `returns_received_points` | `MockInvestmentRecord` | Retours recus dans ancien modele investissement | `[LEGACY_INVESTMENT]` + `[DEPRECIE]` | Tres eleve | Ne pas reprendre dans la cible sans decision; vocabulaire rendement interdit. |
| `amount_points` insert | `create-investment.action.ts` | Points crees apres soutien/invest legacy | `[CREDITS_IMPACT_LEGACY]` + `[LEGACY_INVESTMENT]` | Eleve | Future cible probable : montant Credits Impact du soutien producteur. |
| `points.total_points`, `base_points`, `bonus_points` | `invest-client.tsx` | Calcul de credits apres soutien | `[CREDITS_IMPACT_LEGACY]` | Moyen-eleve | UI doit dire Credits Impact; technique a renommer plus tard. |
| `pointsEarned` | `create-investment.action.ts` | Resultat de server action investissement | `[CREDITS_IMPACT_LEGACY]` + `[LEGACY_INVESTMENT]` | Eleve | Ne pas modifier avant migration action/Stripe/Supabase. |
| `amount_points` | `create-donation.action.ts` | Don cree des `seeds` stockees dans `amount_points` | `[GRAINES]` stockees sous nom legacy | Eleve | Important : ne pas assimiler ces points a Credits Impact. |
| `monthly_points_allocation` | `MockSubscriptionRecord`, Supabase schema core | Allocation mensuelle abonnement | `[LEGACY_INVESTMENT]` / `[SUPABASE_LEGACY]` / `[DEPRECIE]` cible P0-1 | Eleve | Ne pas conserver comme Credits Impact gratuits sans soutien producteur. |
| `MockPointsTransactionRecord.delta` | `mock-member-data.ts` | Ledger mock mixte : allocations, commandes, contributions, challenges | `[UNKNOWN]` mixte | Eleve | A separer en ledger Credits Impact et ledger Graines plus tard. |
| `MockPointsTransactionRecord.impactDelta` | `mock-member-data.ts`, `mock-member-data-server.ts` | Agregat d'impact/solde utilise par balance | `[UNKNOWN]` + `[IMPACT_METRIC]` possible | Eleve | Clarifier : impactDelta n'est pas une monnaie cible. |
| `mock-points-allocation-*` | `mock-member-data.ts` | Allocation Pollinisateur+ | `[LEGACY_INVESTMENT]` + `[DEPRECIE]` | Eleve | Incompatible avec Credits Impact gratuits mensuels cible P0-1. |
| `mock-points-order-*` | `mock-member-data.ts` | Depense commande | `[CREDITS_IMPACT_LEGACY]` | Moyen | Correspond a achat produit avec Credits Impact. |
| `mock-points-eco-fact`, `mock-points-daily-harvest`, `mock-points-streak` | `mock-member-data.ts` | Progression / engagement | `[GRAINES]` ou `[SCORE_OU_XP]` | Moyen-eleve | Ne doit pas alimenter Credits Impact. |
| `getCurrentMockChallengeTransactions().delta` | `mock-challenge-progress-server.ts` | Reward de challenge Academy/mission | `[GRAINES]` / `[SCORE_OU_XP]` | Moyen | Cible : Graines, pas Credits Impact. |
| `getCurrentMockWalletBalance` | `mock-member-data-server.ts` | Somme de `delta` mixte | `[UNKNOWN]` | Eleve | Wallet a separer par monnaie. |
| `getCurrentMockImpactPoints` | `mock-member-data-server.ts` | Somme de `impactDelta` | `[IMPACT_METRIC]` possible / `[UNKNOWN]` | Eleve | Ne pas utiliser comme monnaie cible sans decision. |
| `calculateBeeEquivalence(points)` | `balance-modal-content.tsx` | Conversion points -> abeilles | `[IMPACT_METRIC]` | Eleve | Impact doit etre metrique specifique, pas monnaie convertie automatiquement. |
| `points` state dans balance modal | `balance-modal-content.tsx` | Affiche un solde comme Credits Impact | `[CREDITS_IMPACT_LEGACY]` + `[UNKNOWN]` source | Moyen-eleve | UI correcte, source data a clarifier. |
| `ImpactInputs.points` | `src/lib/gamification.ts` | Calcul de score/niveau | `[SCORE_OU_XP]` | Moyen | Ne pas confondre avec Credits Impact. |
| `calculateImpactScore` | `src/lib/gamification.ts` | Score composite points/projets/invested | `[SCORE_OU_XP]` | Moyen | Renommer conceptuellement en score/progression. |
| badge `1000 crédits` | `src/lib/gamification.ts` | Milestone de progression | `[SCORE_OU_XP]` + `[UNKNOWN]` | Moyen | Clarifier Graines vs Credits Impact. |
| `formatPoints(points)` | `src/lib/utils.ts` | Formatter generique | `[UNKNOWN]` | Moyen | A eviter comme API metier cible. |
| `points_used` | `api/payments/create-intent`, `mobile-sheet` | Metadata paiement | `[CREDITS_IMPACT_LEGACY]` + `[SUPABASE_LEGACY]` possible | Eleve | Future metadata cible : `impact_credits_used`. |
| `payment_method: points` | `packages/core/src/shared/db/schema.ts` | Ancien schema commerce | `[SUPABASE_LEGACY]` | Eleve | Ne pas definir la cible depuis ce schema. |
| `points_ledger_reason`, `points_ledger_reference_type` | `packages/core/src/shared/db/schema.ts` | Ledger DB V0 | `[SUPABASE_LEGACY]` | Eleve | Future V2 a redefinir. |
| `pricePoints`, `pointsLabel` | `packages/core/src/shared/ui/next/product-card*` | UI package generique produit | `[CREDITS_IMPACT_LEGACY]` | Moyen | A aligner plus tard avec `impactCredits`. |
| `hasEnoughPoints`, formatter `pts` | `packages/core/src/shared/utils/*` | Helpers generiques legacy | `[DEPRECIE]` / `[UNKNOWN]` | Moyen | Ne pas utiliser dans nouveaux modeles metier. |
| `biodiversityPoints` | Ancienne doc `09-DONNEES-MOCK-API-SUPABASE.md` | Troisieme monnaie mentionnee comme a eviter | `[DEPRECIE]` | Faible | Confirmer : ne pas creer cette monnaie. |
| `points` dans `mock-viewer.ts` | Profil viewer, totalSeedsContributed, impact metrics | `[GRAINES]` / `[SCORE_OU_XP]` / `[IMPACT_METRIC]` mixte | Eleve | Separateur necessaire entre Graines, score et metriques. |
| `currentSeeds`, `targetSeeds`, `contributionSeeds` | `mock-factions.ts` | Graines collectives de faction | `[GRAINES]` | Faible | Bon concept cible pour progression symbolique. |

## 3. Principales familles observees

### Famille A - Credits Impact legacy

Champs typiques :

- `price_points` ;
- `unit_price_points` ;
- `total_price_points` ;
- `subtotal_points` ;
- `shipping_cost_points` ;
- `tax_points` ;
- `points_used` ;
- certains `amount_points` lies aux soutiens producteurs ;
- certains `total_points`, `base_points`, `bonus_points` dans les calculs de soutien.

Interpretation : ancien nom technique probable de la valeur boutique qui doit devenir Credits Impact cote UI, et probablement `impact_credits` cote technique futur.

### Famille B - Graines / progression symbolique

Champs ou contextes typiques :

- challenges Academy / missions ;
- daily harvest ;
- streak ;
- faction seeds : `currentSeeds`, `targetSeeds`, `contributionSeeds` ;
- don pur stockant des `seeds` dans `amount_points`.

Interpretation : ces valeurs ne doivent pas devenir des Credits Impact.

### Famille C - Score / XP

Champs typiques :

- `ImpactInputs.points` ;
- `calculateImpactScore` ;
- badges et niveaux ;
- progressions utilisateur.

Interpretation : score ou XP de progression, distinct des monnaies.

### Famille D - Metriques d'impact

Exemples :

- abeilles ;
- fleurs ;
- coraux ;
- CO2 ;
- kg de miel ;
- equivalence `calculateBeeEquivalence(points)`.

Interpretation : une metrique d'impact ne doit pas etre une monnaie et ne doit pas etre derivee automatiquement d'un solde sans preuve documentee.

### Famille E - Legacy investissement / rendement

Champs typiques :

- `returns_received_points` ;
- `expected_return_rate` ;
- `maturity_date` ;
- `investment_terms` ;
- `monthly_points_allocation` ;
- allocations mensuelles Pollinisateur+.

Interpretation : zone la plus sensible, a ne pas reprendre telle quelle dans la cible.

### Famille F - Supabase legacy V0

Champs typiques :

- schema `commerce` et `investment` dans `packages/core` ;
- `points_ledger_reason` ;
- `payment_method: points` ;
- generated types ;
- anciennes tables `investments`, `orders`, `subscriptions`.

Interpretation : heritage technique, non cible produit.

## 4. Regles cible proposees

### UI utilisateur

`[CIBLE_VALIDEE]` Ne jamais afficher `points` comme monnaie principale.

Regles :

- afficher `Credits Impact` pour la valeur boutique ;
- afficher `Graines` pour la progression symbolique, Academy, missions, BioDex ou engagement ;
- afficher des metriques specifiques pour l'impact : abeilles, fleurs, coraux, CO2, kg, hectares, etc. ;
- ne pas afficher `Points biodiversite` comme monnaie ou recompense ;
- ne pas utiliser `credits` seul si le contexte peut confondre Credits Impact et score.

### Produit

`[CIBLE_VALIDEE]` Credits Impact = valeur boutique issue d'un soutien producteur.

`[CIBLE_VALIDEE]` Graines = progression, engagement, Academy, BioDex, missions et reconnaissance symbolique.

`[CIBLE_VALIDEE]` Les metriques d'impact ne sont pas des monnaies.

`[CIBLE_VALIDEE]` Un don pur ne genere pas de Credits Impact.

`[CIBLE_VALIDEE]` Un quiz Academy ne genere pas de Credits Impact.

`[CIBLE_VALIDEE]` Un achat produit ne cree pas de Credits Impact.

### Technique future

`[A_PLANIFIER]` Ne pas garder `points` comme nom metier cible.

`[A_PLANIFIER]` Utiliser `points` uniquement comme alias legacy temporaire pour lecture/compatibilite.

`[A_PLANIFIER]` Recommandation technique : utiliser `impact_credits` pour les champs persistants/API et `impactCredits` en TypeScript.

Exemples cibles conceptuels :

- `impact_credits_balance` en DB/API ;
- `impact_credits_amount` en DB/API ;
- `impact_credits_price` en DB/API ;
- `impactCreditsBalance` en TypeScript ;
- `impactCreditsAmount` en TypeScript ;
- `impactCreditsPrice` en TypeScript.

## 5. Strategie de migration progressive

1. Documenter toutes les familles de `points`.
2. Interdire `points` dans les nouveaux textes UI.
3. Garder les champs legacy tant que le code n'est pas migre.
4. Introduire un mapping documentaire : `points` legacy -> interpretation selon contexte.
5. Separer conceptuellement trois ledgers futurs : Credits Impact, Graines, score/progression.
6. Ne pas migrer Supabase V0 maintenant.
7. Ne pas renommer brutalement les mocks : ils restent `[SOURCE_PROTOTYPE]`.
8. Quand les flows seront valides, definir une DB V2 propre.

## 6. A ne surtout pas migrer brutalement

`[RISQUE]` Ne pas renommer brutalement :

- `price_points` ;
- `amount_points` ;
- `total_points` ;
- `points_used` ;
- `returns_received_points` ;
- `monthly_points_allocation` ;
- `MockPointsTransactionRecord` ;
- `formatPoints` ;
- `points` dans les schemas Supabase V0 ;
- `points` dans Stripe metadata ;
- `points` dans les tests ou composants partages `@make-the-change/core`.

Raison : ces termes recouvrent plusieurs sens differents et certains sont lies a Supabase legacy, Stripe, historique, mocks ou package core.

## 7. Recommandation finale P0-3

`[CIBLE_VALIDEE]` UI : utiliser `Credits Impact`.

`[A_PLANIFIER]` Technique future recommandee : `impact_credits` en snake_case et `impactCredits` en TypeScript.

`[DEPRECIE]` `points` ne doit plus etre utilise comme nom metier dans les nouveaux modeles.

`[A_PLANIFIER]` `points` peut rester un alias legacy temporaire uniquement pour compatibilite, lecture historique et transition.
