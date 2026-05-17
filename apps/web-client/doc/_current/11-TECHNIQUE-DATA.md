# 11 - Technique et data

## Role de ce document

Ce document décrit les **décisions techniques, les cibles d'architecture et les règles de migration**. Il ne répète pas l'état brut du code.

Pour l'état observé du code (stack, routes, fichiers, zones hybrides) : voir [02-ETAT-ACTUEL-CODE.md](02-ETAT-ACTUEL-CODE.md).

Pour les décisions validées sur la source de vérité (P0-10/P0-11) : voir [03-DECISIONS-VALIDEES.md](03-DECISIONS-VALIDEES.md).

## Source de données : doctrine cible

`[CIBLE_VALIDEE]` Le web-client est **mock-first exclusif** jusqu'à validation complète du prototype.

`[CIBLE_VALIDEE]` Supabase actuel (`[LEGACY]` `[A_NE_PAS_TOUCHER]`) ne doit pas être utilisé comme modèle cible implicite. Il reste connecté au dashboard admin legacy uniquement.

`[A_PLANIFIER]` La cible data sera redéfinie à partir des mocks stabilisés, des flows validés et des besoins produit. Voir P0-10/P0-11 dans `03-DECISIONS-VALIDEES.md`.

## Decisions data : projets, produits, BioDex

`[A_DECIDER]` À quel moment les mocks cessent-ils d'être fusionnés aux données réelles pour les projets ?

`[A_DECIDER]` Les produits mockés restent-ils des fixtures, des seeds ou des données demo ?

`[A_DECIDER]` Il faut séparer explicitement données demo, données scientifiques, données utilisateur et données de preuve dans le BioDex.

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

`[RISQUE]` Ne pas renommer brutalement `price_points`, `amount_points`, `total_points`, `points_used`, `returns_received_points` ou `MockPointsTransactionRecord`, car ces champs couvrent plusieurs sens et peuvent etre lies a Supabase legacy, mocks, Stripe, historique ou package core. Note : `monthly_points_allocation` a ete renomme en `monthly_seeds_allocation` en R9 (2026-05-17).

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

## Authentification et i18n

Pour l'etat observe (auth combinee mock/Supabase, flows invites, magic link, textes hardcodes, absence de dossier `messages` confirme en R9) : voir [02-ETAT-ACTUEL-CODE.md](02-ETAT-ACTUEL-CODE.md).

## Dette de vocabulaire technique

| Terme | Probleme | Action future possible |
|---|---|---|
| `investment` | Confusion juridique/produit | Migrer progressivement vers `producer_support`. Metadata Stripe doivent migrer vers `producer_support`. |
| `points` | Ambiguite entre Credits Impact, Graines, score, impact et legacy Supabase | Utiliser `impact_credits` / `impactCredits` pour la cible Credits Impact, garder `points` en alias legacy temporaire. |
| `Artisans Locaux` | Faction legacy | `[ACTUEL_CODE]` + `[DEPRECIE]` + `[A_MIGRER_PLUS_TARD]` | Ne pas renforcer. Les seules factions cibles sont Vie Sauvage, Terres & Forets, Gardiens des mers. |
| `funding` | Peut evoquer investissement | Clarifier selon contexte. |

## Doctrine source de verite court terme

Synthese dans [03-DECISIONS-VALIDEES.md — P0-10/P0-11](03-DECISIONS-VALIDEES.md). Audit complet dans `_audit/DATA-SOURCE-TRUTH-AUDIT.md`.

## Regles pour futures modifications code

`[CIBLE_VALIDEE]` Toute future modification applicative doit :

- verifier le statut documentaire du sujet ;
- ne pas renforcer un terme deprecie sans decision ;
- distinguer mock, prototype et production ;
- mettre a jour `02-ETAT-ACTUEL-CODE.md` si l'etat code change ;
- mettre a jour le fichier thematique concerne.
