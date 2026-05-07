# Migration `investment` -> `producer_support`

Date : 2026-05-07

Portee : documentation et plan de migration uniquement. Aucun code applicatif ne doit etre modifie dans cette phase.

Statuts utilises : `[CIBLE_VALIDEE]`, `[ACTUEL_CODE]`, `[A_PLANIFIER]`, `[A_VERIFIER_CODE]`, `[DEPRECIE]`, `[RISQUE]`

## 1. Resume du probleme

`[CIBLE_VALIDEE]` La decision P0-1 valide trois notions distinctes :

- don pur = contribution sans contrepartie economique directe ;
- soutien producteur = contribution a un producteur ou partenaire economique reel ;
- achat produit = achat boutique ou avantage partenaire.

`[CIBLE_VALIDEE]` Le soutien producteur doit viser le nom metier `producer_support`.

`[ACTUEL_CODE]` Le code utilise encore largement `investment`, `invest`, `investments`, la route `/invest`, la page `/profile/investments`, la table Supabase `investments`, des types `Investment*`, des mocks `MockInvestmentRecord` et la metadata Stripe `order_type: "investment"`.

`[RISQUE]` Ce decalage peut creer une confusion produit, juridique et technique : le soutien producteur ne doit pas etre compris comme un investissement financier.

## 2. Pourquoi `investment` est deprecie

`[DEPRECIE]` `investment` est deprecie pour le langage produit et pour le domaine metier cible.

Raisons :

- le mot evoque investissement financier, rendement, part, propriete ou ROI ;
- il brouille la separation entre don pur et soutien producteur ;
- il peut creer une attente de retour financier ou remboursement garanti ;
- il est incoherent avec la decision P0-1 ;
- il complique la communication publique et les risques juridiques.

## 3. Pourquoi `producer_support` est la cible

`[CIBLE_VALIDEE]` `producer_support` est la cible car le terme :

- decrit explicitement un soutien a un producteur ou partenaire ;
- evite la connotation financiere de `investment` ;
- distingue le soutien producteur du don pur ;
- reste plus precis que `support`, trop generique ;
- relie mieux les Credits Impact a une activite economique reelle.

`[CIBLE_VALIDEE]` La route utilisateur cible preferee est `/projects/[slug]/support`.

`[CIBLE_VALIDEE]` Les `order_type` cibles sont :

- `donation` ;
- `producer_support` ;
- `product_purchase` ;
- `subscription` plus tard.

## 4. Inventaire des occurrences trouvees dans le code

### Routes

| Occurrence | Fichier | Statut |
|---|---|---|
| `/projects/[slug]/invest` | `src/app/[locale]/(screens)/projects/[slug]/invest/page.tsx` | `[ACTUEL_CODE]` |
| route interceptee `/projects/[slug]/invest` | `src/app/[locale]/@modal/(.)projects/[slug]/invest/page.tsx` | `[ACTUEL_CODE]` |
| generation `donate` ou `invest` | `src/app/[locale]/(screens)/projects/[slug]/project-action.ts` | `[ACTUEL_CODE]` |
| quick view vers `/invest?source=quick_view` | `src/app/[locale]/(screens)/projects/[slug]/project-quick-view.tsx` | `[ACTUEL_CODE]` |
| test avec href `/projects/antsirabe/invest` | `src/app/[locale]/(screens)/projects/[slug]/project-action.test.ts` | `[ACTUEL_CODE]` |
| page `/profile/investments` | `src/app/[locale]/(screens)/profile/investments/page.tsx` | `[ACTUEL_CODE]` |
| fallback `/profile/investments` | `src/app/[locale]/@modal/(.)transactions/[id]/page.tsx` | `[ACTUEL_CODE]` |

### Actions

| Occurrence | Fichier | Statut |
|---|---|---|
| `create-investment.action.ts` | `src/app/[locale]/(screens)/projects/[slug]/invest/_actions/create-investment.action.ts` | `[ACTUEL_CODE]` |
| `createInvestmentAction` | meme fichier | `[ACTUEL_CODE]` |
| `CreateInvestmentInput` | meme fichier | `[ACTUEL_CODE]` |
| `CreateInvestmentResult` | meme fichier | `[ACTUEL_CODE]` |
| `investmentId` | meme fichier | `[ACTUEL_CODE]` |
| logs `[invest] ...` | meme fichier | `[ACTUEL_CODE]` |

### Types

| Occurrence | Fichier | Statut |
|---|---|---|
| `investment.InvestmentType` | `invest-client.tsx`, `create-investment.action.ts` | `[ACTUEL_CODE]` |
| `investment.getInvestmentRules` | `invest-client.tsx`, `create-investment.action.ts` | `[ACTUEL_CODE]` |
| `investment.calculateInvestmentPoints` | `invest-client.tsx`, `create-investment.action.ts` | `[ACTUEL_CODE]` |
| `InvestmentType`, `Investment` | `packages/core/src/entities/investment/types.ts` | `[ACTUEL_CODE]` |
| `calculateInvestmentPoints` | `packages/core/src/entities/investment/utils.ts`, `points-calculator.ts` | `[ACTUEL_CODE]` |
| `investment_status`, `investments` table | `packages/core/src/shared/db/schema.ts` | `[ACTUEL_CODE]` |

### Mocks

| Occurrence | Fichier | Statut |
|---|---|---|
| `MockInvestmentRecord` | `src/lib/mock/mock-member-data.ts` | `[ACTUEL_CODE]` |
| `EXISTING_VIEWER_INVESTMENTS` | `src/lib/mock/mock-member-data.ts` | `[ACTUEL_CODE]` |
| `mock-investment-antsirabe` | `src/lib/mock/mock-member-data.ts` | `[ACTUEL_CODE]` |
| `mock-investment-manakara` | `src/lib/mock/mock-member-data.ts` | `[ACTUEL_CODE]` |
| `mock-points-investment-*` | `src/lib/mock/mock-member-data.ts` | `[ACTUEL_CODE]` |
| `getMockInvestments` | `src/lib/mock/mock-member-data.ts` | `[ACTUEL_CODE]` |
| `investedProjectSlugs` | `src/lib/mock/mock-biodex.ts` | `[ACTUEL_CODE]` |

### Stripe metadata

| Occurrence | Fichier | Statut |
|---|---|---|
| `order_type: "investment"` | `src/app/[locale]/(screens)/projects/[slug]/invest/_actions/create-investment.action.ts` | `[ACTUEL_CODE]` |
| `reference_id: created.id` lie a `investments` | meme fichier | `[ACTUEL_CODE]` |
| retour Stripe vers `/profile/investments` | `src/app/[locale]/(screens)/projects/[slug]/_features/invest-client.tsx` | `[ACTUEL_CODE]` |

### Profil utilisateur

| Occurrence | Fichier | Statut |
|---|---|---|
| `InvestmentsPage` | `src/app/[locale]/(screens)/profile/investments/page.tsx` | `[ACTUEL_CODE]` |
| `NormalizedInvestment` | `profile/investments/page.tsx`, `activity-list.tsx` | `[ACTUEL_CODE]` |
| `type: "investment"` | `profile/investments/page.tsx`, `activity-list.tsx` | `[ACTUEL_CODE]` |
| `.from("investments")` | `profile/investments/page.tsx` | `[ACTUEL_CODE]` |
| `totalInvested` | `profile/investments/page.tsx`, `activity-list.tsx` | `[ACTUEL_CODE]` |
| filtres `investment`, `donation`, `order` | `activity-list.tsx` | `[ACTUEL_CODE]` |

### UI wording

| Libelle observe | Fichier | Statut |
|---|---|---|
| `Soutenir ce projet` | `project-action.ts`, `project-quick-view.tsx`, `project-invest-one-flow.tsx` | `[ACTUEL_CODE]` compatible cible |
| `Soutien producteur` | `project-invest-one-flow.tsx` | `[ACTUEL_CODE]` compatible cible |
| `Votre soutien au projet` | `project-invest-one-flow.tsx` | `[ACTUEL_CODE]` compatible cible |
| `Crédits estimés`, `Crédits prévus` | `invest-client.tsx` | `[A_VERIFIER_CODE]` |
| `Fonds transférés` | `transaction-receipt.tsx` | `[RISQUE]` |
| `Télécharger le reçu fiscal (PDF)` | `transaction-receipt.tsx` | `[RISQUE]` |
| `Total Soutiens`, `Crédits gagnés` | `activity-list.tsx` | `[A_VERIFIER_CODE]` |

### Historique utilisateur

| Occurrence | Fichier | Statut |
|---|---|---|
| `transactionType: "investment" | "order"` | `transaction-receipt.tsx` | `[ACTUEL_CODE]` |
| query `type?: "investment" | "order"` | `@modal/(.)transactions/[id]/page.tsx` | `[ACTUEL_CODE]` |
| transactions details liees a `investment` | `profile/investments/_features/*` | `[ACTUEL_CODE]` |

### Services/API

| Occurrence | Fichier | Statut |
|---|---|---|
| insertion `.from("investments")` | `create-investment.action.ts` | `[ACTUEL_CODE]` |
| lecture `.from("investments")` | `profile/investments/page.tsx` | `[ACTUEL_CODE]` |
| schema Supabase `investment` | `packages/core/src/shared/db/schema.ts` | `[ACTUEL_CODE]` |
| champs `expected_return_rate`, `maturity_date`, `returns_received_points`, `investment_terms` | `packages/core/src/shared/db/schema.ts` | `[RISQUE]` |
| generated types `source_investment_id`, `total_investments`, `unique_investors` | `packages/core/src/shared/db/database.generated.ts` | `[ACTUEL_CODE]` + `[RISQUE]` |

## 5. Risque de migration par zone

| Zone | Risque | Raison |
|---|---|---|
| Routes `/invest` | `[RISQUE]` eleve | Liens internes, modales interceptees, tests, retours Stripe et bookmarks. |
| Actions | `[RISQUE]` eleve | Couplage Supabase, Stripe, calcul Credits Impact, status pending. |
| Types domaine | `[RISQUE]` moyen-eleve | Imports `@make-the-change/core`, usage multi-fichiers. |
| Mocks | `[RISQUE]` moyen | Demo, BioDex, historique et wallet dependent des mocks. |
| Stripe metadata | `[RISQUE]` tres eleve | Les paiements anciens doivent rester lisibles. |
| Profil utilisateur | `[RISQUE]` eleve | Page partagee entre soutiens, dons, commandes et details transactions. |
| UI wording | `[RISQUE]` faible-moyen | Plus facile, mais attention aux promesses et au fiscal. |
| Historique utilisateur | `[RISQUE]` eleve | Ne pas casser les anciens enregistrements. |
| Services/API Supabase | `[RISQUE]` tres eleve | Tables, vues, generated types, FK et historiques. |
| Package core | `[RISQUE]` eleve | Impact possible hors `apps/web-client`. |

## 6. Plan de migration progressif en phases

### Phase 0 - Documentation

Statut : `[CIBLE_VALIDEE]`

- documenter la cible `producer_support` ;
- inventorier les occurrences `investment` ;
- marquer `investment` comme `[DEPRECIE]` cote produit ;
- ne modifier aucun code.

### Phase 1 - Alias metier

Statut : `[A_PLANIFIER]`

- introduire `producer_support` comme alias metier ;
- garder `investment` comme nom legacy en lecture ;
- preparer un mapping `investment -> producer_support` ;
- ne pas changer routes, tables, Stripe ou generated types.

### Phase 2 - Wording UI

Statut : `[A_PLANIFIER]`

- remplacer les libelles visibles ambigus ;
- conserver les noms techniques legacy en interne ;
- verifier les formulations `Fonds transférés`, `reçu fiscal`, `Crédits gagnés` ;
- privilegier `Soutenir ce projet`, `Soutien producteur`, `Credits Impact`.

### Phase 3 - Types et domaine metier

Statut : `[A_PLANIFIER]`

- creer des types cibles `ProducerSupport*` ;
- garder `Investment*` comme alias legacy temporaire ;
- renommer progressivement les variables UI ;
- coordonner avec `packages/core`.

### Phase 4 - Routes

Statut : `[A_PLANIFIER]`

- evaluer `/projects/[slug]/support` ;
- garder `/projects/[slug]/invest` en redirect ou alias temporaire ;
- verifier modale interceptee, quick view, tests, return URL Stripe ;
- ne supprimer `/invest` qu'apres QA et monitoring.

### Phase 5 - Stripe metadata

Statut : `[A_PLANIFIER]` + `[RISQUE]`

- accepter `investment` et `producer_support` en lecture ;
- emettre `producer_support` seulement quand webhooks et historique sont compatibles ;
- conserver les anciens PaymentIntents `investment` ;
- ne pas modifier retroactivement Stripe sans plan dedie.

### Phase 6 - Nettoyage final

Statut : `[A_PLANIFIER]`

- supprimer les alias legacy inutilises ;
- finaliser redirects ;
- renommer ou migrer les schemas seulement avec migration DB explicite ;
- regenerer les types ;
- supprimer `investment` des nouvelles UI.

## 7. Ce qu'on peut renommer sans risque relatif

`[A_PLANIFIER]` Les elements les moins risques sont :

- labels visibles non connectes a DB/Stripe ;
- variables locales purement UI ;
- titres et textes de documentation ;
- tests de wording ;
- noms de sections internes ;
- commentaires et contenus non contractuels.

`[RISQUE]` Meme ces changements doivent respecter P0-1 : don pur ne donne pas de Credits Impact, achat produit ne debloque pas BioDex.

## 8. Ce qu'il ne faut pas renommer brutalement

`[RISQUE]` Ne pas renommer brutalement :

- `/projects/[slug]/invest` ;
- `@modal/(.)projects/[slug]/invest` ;
- `/profile/investments` ;
- `.from("investments")` ;
- table Supabase `investments` ;
- generated types Supabase ;
- `order_type: "investment"` ;
- webhooks lies aux anciens PaymentIntents ;
- `InvestmentType`, `calculateInvestmentPoints`, `getInvestmentRules` ;
- `MockInvestmentRecord` si BioDex/profil/wallet en dependent ;
- champs `expected_return_rate`, `returns_received_points`, `maturity_date`, `investment_terms`.

## 9. Strategie de compatibilite temporaire

`[A_PLANIFIER]` Pendant la migration, `investment` doit etre interprete comme un alias legacy de `producer_support`.

Strategie :

- lecture : accepter `investment` et `producer_support` ;
- ecriture : passer a `producer_support` seulement apres compatibilite serveur/webhook ;
- routing : maintenir `/invest` comme redirect ou alias ;
- profil : afficher `Soutien producteur` pour les anciennes entrees `investment` ;
- historique : ne pas recalculer destructivement les anciennes donnees ;
- Stripe : conserver l'interpretation des anciens PaymentIntents `investment` ;
- analytics : suivre les deux labels pendant la transition.

## 10. Questions ouvertes restantes

- `[A_PLANIFIER]` Faut-il renommer `/profile/investments` en `/profile/contributions`, `/profile/supports` ou garder l'URL legacy ?
- `[A_VERIFIER_CODE]` Quels webhooks Stripe consomment exactement `order_type: "investment"` ?
- `[A_VERIFIER_CODE]` Les generated types Supabase refletent-ils une base deja en production ?
- `[A_PLANIFIER]` Faut-il migrer la table `investments` ou seulement ajouter une couche de vocabulaire metier ?
- `[A_VERIFIER_CODE]` Les champs `expected_return_rate`, `returns_received_points`, `maturity_date` sont-ils utilises en runtime ?
- `[A_PLANIFIER]` Comment traiter les anciennes especes BioDex debloquees via `source_investment_id` ?
- `[A_PLANIFIER]` Quelle duree de compatibilite pour `/invest` apres introduction de `/support` ?

## 11. Checklist avant migration code

- `[A_VERIFIER_CODE]` Inventaire complet des occurrences `investment`, `invest`, `investments`.
- `[A_VERIFIER_CODE]` Inventaire complet des webhooks Stripe.
- `[A_VERIFIER_CODE]` Cartographie des tables/vues Supabase liees a `investments`.
- `[A_VERIFIER_CODE]` Verification des generated types et relations DB.
- `[A_VERIFIER_CODE]` Verification des liens internes vers `/invest` et `/profile/investments`.
- `[A_VERIFIER_CODE]` Verification des modales interceptees.
- `[A_VERIFIER_CODE]` Verification des tests existants.
- `[A_VERIFIER_CODE]` Verification du BioDex et des sources de deblocage.
- `[A_PLANIFIER]` Definition d'une periode de compatibilite.
- `[A_PLANIFIER]` Plan de rollback.
- `[A_PLANIFIER]` Plan analytics/monitoring.
- `[A_PLANIFIER]` Plan QA paiement + historique + profil.

## 12. Strategie recommandee

`[A_PLANIFIER]` Migrer du moins risque au plus risque :

1. documentation et glossaire ;
2. wording UI visible ;
3. alias metier `producer_support` ;
4. types applicatifs non persistants ;
5. routes avec redirects ;
6. Stripe metadata avec double support ;
7. Supabase/schema/generated types ;
8. nettoyage final.

`[RISQUE]` Les zones les plus sensibles sont Stripe, Supabase, routes, historique utilisateur et package `core`.

`[CIBLE_VALIDEE]` La cible finale est claire : `investment` doit devenir un terme legacy, tandis que `producer_support` devient le nom metier du soutien producteur.
