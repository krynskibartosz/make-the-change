# 11 - Technique et data

## Role de ce document

Ce document decrit la structure technique, les sources de donnees et les integrations. Pour l'etat strictement observe, voir aussi `02-ETAT-ACTUEL-CODE.md`.

## Stack observee

`[ACTUEL_CODE]` Le web-client repose sur :

- Next.js App Router ;
- React ;
- TypeScript ;
- Tailwind CSS ;
- next-intl ;
- Supabase ;
- Stripe ;
- mocks internes ;
- package UI interne.

## Data source

`[ACTUEL_CODE]` `NEXT_PUBLIC_MTC_DATA_SOURCE` controle la source de donnees.

Valeurs observees :

- `mock` ;
- `supabase`.

`[ACTUEL_CODE]` Le defaut est `mock`.

`[CIBLE_VALIDEE]` Supabase actuel ne doit pas etre utilise comme modele cible implicite.

`[A_PLANIFIER]` La cible data sera redefinie plus tard a partir des mocks, des flows valides et des besoins produit.

## Mocks

`[ACTUEL_CODE]` `[SOURCE_PROTOTYPE]` Les mocks restent centraux pour :

- viewer/session ;
- factions ;
- projets ;
- produits ;
- BioDex ;
- challenges ;
- historique ;
- wallet / `impactCreditsBalance` (ancien alias `points` retire en R8, 2026-05-08).

`[ACTUEL_CODE]` `[SOURCE_PROTOTYPE]` Les mocks sont actuellement la meilleure base pour prototyper les ecrans, tester l'UX, stabiliser les flows et comprendre les besoins data reels.

`[RISQUE]` Les mocks peuvent contenir du vocabulaire legacy ou des donnees non finalisees.

`[RISQUE]` Les mocks ne doivent pas etre documentes comme DB finale.

## Supabase

`[ACTUEL_CODE]` Supabase est present via clients :

- `client.ts` ;
- `server.ts` ;
- `static.ts` ;
- `admin.ts`.

`[ACTUEL_CODE]` Des services utilisent Supabase pour projets, produits, profils, especes et paiements selon les cas.

`[ACTUEL_CODE]` `[LEGACY]` `[A_NE_PAS_TOUCHER]` La base Supabase actuelle est une ancienne base V0, issue d'une phase ou le dashboard admin a ete developpe avant le web-client.

Role actuel :

- garder le dashboard admin fonctionnel ;
- conserver une trace du travail deja fait ;
- servir de reference visuelle ou fonctionnelle partielle ;
- aider a comprendre l'historique technique.

`[RISQUE]` Supabase actuel n'est pas fiable comme modele cible du produit Make the Change actuel.

`[CIBLE_VALIDEE]` Pour l'instant, il ne faut pas modifier Supabase, renommer les tables, migrer les tables existantes, casser les generated types ou adapter le client a cette ancienne DB comme si elle etait definitive.

`[A_PLANIFIER]` Un futur modele data propre peut etre imagine sous forme de documentation conceptuelle, mais pas applique au code ou a la DB actuelle sans decision ulterieure.

## Strategie data cible : partir des mocks et des flows valides

`[A_PLANIFIER]` La future base de donnees V2 doit etre concue progressivement a partir :

1. des flows valides ;
2. des ecrans prototypes valides ;
3. des donnees mock reellement utilisees ;
4. des decisions produit validees ;
5. des regles business, gamification et impact ;
6. des besoins du futur dashboard admin refondu.

`[CIBLE_VALIDEE]` Formulation a utiliser dans les prochains audits : Supabase actuel est une base legacy branchee a l'ancien dashboard admin. La cible data sera redefinie plus tard a partir des mocks, des flows valides et des besoins produit.

## Projets data

`[ACTUEL_CODE]` `getProjects` utilise les mocks en mode mock.

`[ACTUEL_CODE]` Hors mock, il interroge `public_projects` et peut fusionner des projets Supabase avec les mocks.

`[A_DECIDER]` Il faut choisir a quel moment les mocks cessent d'etre fusionnes aux donnees reelles.

## Produits data

`[ACTUEL_CODE]` `getProducts` utilise `mock-products` en mode mock.

`[ACTUEL_CODE]` Hors mock, il interroge `public_products`, `categories`, `producers` et peut fusionner avec les mocks sur la premiere page.

`[A_DECIDER]` Il faut definir si les produits mockes restent des fixtures, des seeds ou des donnees demo.

## BioDex data

`[ACTUEL_CODE]` `species-context.service.ts` lit les mocks ou `v_species_context`.

`[ACTUEL_CODE]` Une fonction garantit un deblocage prototype si aucune espece n'est debloquee.

`[A_DECIDER]` Il faut separer explicitement donnees demo, donnees scientifiques, donnees utilisateur et donnees de preuve.

## Stripe

`[AUDITE]` P0-9 est documente dans `_audit/STRIPE-STATUS-AUDIT.md`.

`[ACTUEL_CODE] [HYBRIDE]` Stripe est present cote client et serveur, mais l'integration paiement n'est pas complete ni homogene.

`[ACTUEL_CODE] [REEL]` Donation et invest creent des PaymentIntent Stripe reels.

`[ACTUEL_CODE] [REEL] [LEGACY]` Invest utilise encore les metadata legacy `order_type: "investment"`.

`[ACTUEL_CODE] [SIMULE] [RISQUE]` Le flow produit est simule et ne doit pas etre documente comme paiement Stripe reel.

`[ACTUEL_CODE] [PARTIEL]` Les webhooks Stripe sont partiels : `payment_intent.succeeded` est traite, mais `payment_intent.payment_failed` et `charge.refunded` sont limites ou non finalises.

`[ACTUEL_CODE] [PARTIEL]` Les remboursements ne sont pas implementes ou restent incomplets.

`[ACTUEL_CODE] [PARTIEL] [RISQUE]` Les flows donation et invest creent directement leurs PaymentIntent et ne passent pas par `api/payments/create-intent`.

`[ACTUEL_CODE] [PARTIEL]` L'API `payments/create-intent` cree un PaymentIntent pour utilisateur authentifie, mais ne couvre pas correctement tous les flows.

`[ACTUEL_CODE] [LEGACY]` Les metadata acceptees par `create-intent` sont limitees et incluent `investment`, `product_purchase`, `subscription`, mais pas `donation` ni `producer_support`.

`[CIBLE_VALIDEE]` Les `order_type` cibles sont :

- `donation` pour don pur ;
- `producer_support` pour soutien producteur ;
- `product_purchase` pour achat produit ;
- `subscription` plus tard.

`[ACTUEL_CODE]` Le code actuel ne reflete pas encore totalement cette cible.

`[RISQUE]` Ne pas documenter le paiement comme finalise sans QA complete.

## Route et modele technique cible

`[ACTUEL_CODE]` `/projects/[slug]/donate` existe pour le don.

`[ACTUEL_CODE]` `/projects/[slug]/invest` existe encore pour le soutien producteur.

`[ACTUEL_CODE]` `investment` reste structurant dans le code.

`[CIBLE_VALIDEE]` La cible future est :

- `/projects/[slug]/donate` pour don pur ;
- `/projects/[slug]/support` pour soutien producteur ;
- `/products` et checkout produit pour achat ;
- `donation` pour les objets/metadonnees de don ;
- `producer_support` pour les objets/metadonnees de soutien producteur ;
- `product_purchase` pour les objets/metadonnees d'achat produit.

`[CIBLE_VALIDEE]` Le nom metier cible prefere est `producer_support`, plus explicite que `support`.

Exemples cibles non implementes :

- `create-producer-support.action.ts` ;
- `ProducerSupportRecord` ;
- `order_type: "producer_support"`.

## Nom technique cible des Credits Impact

`[ACTUEL_CODE]` Le code utilise encore `points` dans plusieurs contextes : prix produits, commandes, wallet, historique, soutien producteur, dons, challenges, allocations, Stripe metadata et schemas legacy.

`[CIBLE_VALIDEE]` `points` ne doit pas etre conserve comme nom metier cible.

`[A_PLANIFIER]` Recommandation technique future :

- `impact_credits` en snake_case pour DB, API, metadata ou payloads persistants ;
- `impactCredits` en TypeScript ;
- `points` uniquement comme alias legacy temporaire pendant migration.

Exemples conceptuels non implementes :

- `impact_credits_balance` ;
- `impact_credits_amount` ;
- `impact_credits_price` ;
- `impact_credits_used` ;
- `impactCreditsBalance` ;
- `impactCreditsAmount` ;
- `impactCreditsPrice`.

`[RISQUE]` Ne pas renommer brutalement `price_points`, `amount_points`, `total_points`, `points_used`, `returns_received_points`, `monthly_points_allocation` ou `MockPointsTransactionRecord`, car ces champs couvrent plusieurs sens et peuvent etre lies a Supabase legacy, mocks, Stripe, historique ou package core.

## Migration future : investment -> producer_support

`[A_PLANIFIER]` La migration technique de `investment` vers `producer_support` doit etre progressive.

`[CIBLE_VALIDEE]` Le code ne doit pas etre renomme immediatement sans plan de migration.

Perimetres a analyser avant migration :

- routes `/projects/[slug]/invest` ;
- server actions `create-investment.action.ts` ;
- composants `project-invest-one-flow` ;
- types `Investment`, `MockInvestmentRecord` et equivalents ;
- tables ou vues Supabase liees a `investments` ;
- metadata Stripe `order_type: "investment"` ;
- historiques profil `profile/investments` ;
- mocks et fixtures ;
- eventuels webhooks et exports.

`[CIBLE_VALIDEE]` Les tables Supabase liees a `investments`, `points`, `returns` ou aux generated types doivent etre traitees comme heritage legacy tant qu'une strategie DB V2 n'est pas decidee.

`[A_PLANIFIER]` La migration `investment` vers `producer_support` ne doit pas declencher automatiquement une migration Supabase.

Plan de migration documentaire recommande :

1. Documenter l'etat legacy `investment`.
2. Introduire les alias cible `producer_support`.
3. Ajouter les nouveaux `order_type` cibles.
4. Prevoir compatibilite lecture ancienne donnee `investment`.
5. Renommer routes et objets seulement apres validation technique.
6. Mettre a jour les textes UI en premier, sans casser les modeles.

## Authentification

`[ACTUEL_CODE]` Le code combine Supabase auth et session mock selon les zones.

`[A_VERIFIER_CODE]` Les flows invites, magic link et claim apres action doivent etre revus avant production.

## i18n

`[ACTUEL_CODE]` `next-intl` est configure et les routes utilisent `[locale]`.

`[ACTUEL_CODE]` De nombreux textes restent hardcodes.

`[A_VERIFIER_CODE]` Aucun dossier `messages` n'a ete identifie dans `apps/web-client` pendant cette passe.

`[RISQUE]` La documentation ne doit pas decrire une internationalisation complete.

## Dette de vocabulaire technique

| Terme | Probleme | Action future possible |
|---|---|---|
| `investment` | Confusion juridique/produit | Migrer progressivement vers `producer_support`. Metadata Stripe doivent migrer vers `producer_support`. |
| `points` | Ambiguite entre Credits Impact, Graines, score, impact et legacy Supabase | Utiliser `impact_credits` / `impactCredits` pour la cible Credits Impact, garder `points` en alias legacy temporaire. |
| `Artisans Locaux` | Faction legacy | `[ACTUEL_CODE]` + `[DEPRECIE]` + `[A_MIGRER_PLUS_TARD]` | Ne pas renforcer. Les seules factions cibles sont Vie Sauvage, Terres & Forets, Gardiens des mers. |
| `funding` | Peut evoquer investissement | Clarifier selon contexte. |

## Doctrine source de verite court terme

`[AUDITE]` P0-10 est documente dans `_audit/DATA-SOURCE-TRUTH-AUDIT.md`.

### Sources de verite par contexte

| Contexte | Source | Statut |
|----------|--------|--------|
| Decisions produit, business, impact, gamification, wording | Docs recentes (00-11, 99), surtout `03-DECISIONS-VALIDEES.md` | `[CIBLE_VALIDEE]` |
| Etat technique reel | Code actuel observe | `[ACTUEL_CODE]` |
| Donnees prototype, besoins UX, flows | Mocks (`src/lib/mock/`) | `[ACTUEL_CODE] [SOURCE_PROTOTYPE]` |
| Historique backend / dashboard admin | Supabase legacy V0 uniquement comme etat legacy | `[ACTUEL_CODE] [LEGACY] [A_NE_PAS_TOUCHER]` |
| Future DB V2 | Plus tard, apres stabilisation mocks et validation flows | `[A_PLANIFIER]` |

### En cas de contradiction

`[CIBLE_VALIDEE]` Signaler et classifier avant toute migration :

1. Lire le code pour la realite technique (`[ACTUEL_CODE]`)
2. Verifier la documentation pour les decisions validees (`[CIBLE_VALIDEE]`)
3. Classer l'ecart avec les tags standards (`[A_MIGRER_PLUS_TARD]`, `[RISQUE]`, etc.)
4. Ne pas modifier directement pour forcer l'alignement
5. Documenter dans `_audit/CODE-VS-DOC.md` ou `_audit/DATA-SOURCE-TRUTH-AUDIT.md`

## Regles pour futures modifications code

`[CIBLE_VALIDEE]` Toute future modification applicative doit :

- verifier le statut documentaire du sujet ;
- ne pas renforcer un terme deprecie sans decision ;
- distinguer mock, prototype et production ;
- mettre a jour `02-ETAT-ACTUEL-CODE.md` si l'etat code change ;
- mettre a jour le fichier thematique concerne.
