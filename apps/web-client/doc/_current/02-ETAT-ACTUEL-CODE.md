# 02 - Etat actuel du code

## Role de ce document

Ce document decrit ce qui existe dans le code actuel de `apps/web-client`. Il ne decrit pas automatiquement la cible produit.

## Stack

`[ACTUEL_CODE]` Le web-client utilise notamment :

- Next.js avec App Router ;
- React ;
- TypeScript ;
- Tailwind CSS ;
- `next-intl` ;
- Supabase ;
- Stripe ;
- mocks internes ;
- composants UI internes `@make-the-change/core/ui`.

## Routage principal

`[ACTUEL_CODE]` La structure de routes est organisee autour de groupes :

- `(tabs)` pour les tabs principales ;
- `(screens)` pour des ecrans immersifs ou secondaires ;
- `(lab)` pour des prototypes/labs ;
- `(auth)` pour l'authentification ;
- `(site)` pour des pages publiques.

## Tabs principales

`[ACTUEL_CODE]` Les tabs mobiles sont definies dans `src/app/[locale]/(tabs)/_components/mobile-bottom-nav.tsx`.

| Label UI | Route | Dossier `(tabs)/` | Notes |
|---|---|---|---|
| Accueil | `/adventure` | `adventure/` | Hub quotidien. Label UI "Accueil", pas "Aventure". |
| Projets | `/projects` | `projects/` | Liste projets. |
| Apprendre | `/learn` | `learn/` | Module apprentissage. Remplace l'ancienne tab Collectif `/impact`. |
| Avantages | `/advantages` | `advantages/` | Produits/avantages. Route `/products` n'existe plus sous (tabs). |
| Profil | `/profile` | `profile/` | Profil et sous-pages. |

`[LEGACY]` Les anciennes routes `/impact` (Collectif) et `/products` (Avantages) ne font plus partie des tabs principales. Elles peuvent subsister dans des routes imbriquees ou des ecrans secondaires.

## Source de donnees

`[ACTUEL_CODE]` Le mode de donnees est controle par `NEXT_PUBLIC_MTC_DATA_SOURCE`.

`[ACTUEL_CODE]` Le defaut est `mock`.

`[ACTUEL_CODE]` Certains services peuvent basculer vers Supabase ou fusionner mocks et donnees Supabase.

`[AUDITE]` P0-10 est documente dans `_audit/DATA-SOURCE-TRUTH-AUDIT.md`.

`[ACTUEL_CODE] [SOURCE_PROTOTYPE]` Les mocks (`src/lib/mock/`) sont la source primaire pour le prototype court terme.

`[ACTUEL_CODE] [LEGACY] [A_NE_PAS_TOUCHER]` Supabase legacy V0 est connecte au dashboard admin legacy. Ne pas modifier.

`[ACTUEL_CODE] [HYBRIDE]` Certains services fusionnent mock + Supabase (ex: `get-projects.ts`, `get-products.ts`, `species-context.service.ts`).

`[ACTUEL_CODE] [RISQUE]` Les routes API (`/api/projects`, `/api/products`) lisent directement Supabase sans verifier `isMockDataSource`.

`[CIBLE_VALIDEE]` La base Supabase actuelle ne doit pas etre consideree comme la source de verite cible du produit.

## Statut Supabase : legacy V0 à ne pas toucher pour l'instant

`[ACTUEL_CODE]` `[LEGACY]` `[A_NE_PAS_TOUCHER]` La base Supabase actuelle est une ancienne base V0.

Elle date d'une phase anterieure ou le dashboard admin a ete developpe avant le client mobile/web-client.

Role actuel :

- ancienne base V0 ;
- base encore branchee au dashboard admin ;
- utile pour garder le dashboard admin fonctionnel ;
- utile pour comprendre l'historique du projet ;
- utile comme reference visuelle ou fonctionnelle partielle ;
- non fiable comme modele cible du produit Make the Change actuel.

`[CIBLE_VALIDEE]` Pour l'instant, il ne faut pas :

- modifier Supabase ;
- modifier le dashboard admin ;
- migrer les tables existantes ;
- renommer les tables Supabase ;
- casser les generated types ;
- adapter le client a cette ancienne DB comme si elle etait definitive.

`[A_PLANIFIER]` Supabase actuel est une base legacy branchee a l'ancien dashboard admin. La cible data sera redefinie plus tard a partir des mocks, des flows valides et des besoins produit.

## Strategie data cible : partir des mocks et des flows valides

`[ACTUEL_CODE]` `[SOURCE_PROTOTYPE]` Les mocks du web-client sont actuellement la meilleure base pour :

- prototyper les ecrans ;
- tester l'UX ;
- stabiliser les flows ;
- comprendre les besoins data reels ;
- preparer progressivement un futur schema propre.

`[RISQUE]` Les mocks ne sont pas une DB finale.

`[A_PLANIFIER]` La future base de donnees V2 devra etre concue progressivement a partir :

1. des flows valides ;
2. des ecrans prototypes valides ;
3. des donnees mock reellement utilisees ;
4. des decisions produit validees ;
5. des regles business, gamification et impact ;
6. des besoins du futur dashboard admin refondu.

## Projets

`[ACTUEL_CODE]` Les projets sont fournis par :

- `src/app/[locale]/(tabs)/projects/_features/mock-projects.ts` ;
- `src/app/[locale]/(tabs)/projects/_features/get-projects.ts` ;
- tables/vues Supabase comme `public_projects` selon le mode.

`[ACTUEL_CODE]` `getProjects` retourne d'abord les mocks en mode mock. Hors mock mode, il peut fusionner mocks et donnees Supabase en evitant certains doublons.

`[RISQUE]` Cette hybridation peut creer une difference entre prototype, preprod et production.

## Produits

`[ACTUEL_CODE]` Les produits sont fournis par :

- `mock-products.ts` ;
- `get-products.ts` ;
- `public_products`, `categories`, `producers` selon le mode Supabase.

`[ACTUEL_CODE]` Les prix utilisent encore `price_points` techniquement.

## Paiement et Stripe

`[ACTUEL_CODE]` Stripe est present via :

- `@stripe/react-stripe-js` ;
- `@stripe/stripe-js` ;
- `src/app/api/payments/create-intent/route.ts` ;
- `src/app/api/payments/mobile-sheet/route.ts` ;
- `src/app/api/webhooks/stripe/route.ts` ;
- `src/lib/stripe`.

`[ACTUEL_CODE]` L'API `payments/create-intent` accepte comme metadata `order_type` : `investment`, `product_purchase`, `subscription`.

`[RISQUE]` La presence de Stripe ne signifie pas que tous les flows de paiement sont finalises.

## Don et soutien

`[ACTUEL_CODE]` Deux experiences distinctes existent :

- `/projects/[slug]/donate` ;
- `/projects/[slug]/invest`.

`[ACTUEL_CODE]` Le soutien producteur est encore nomme `invest` / `investment` dans les routes, types, actions et metadata.

`[DEPRECIE]` Ce vocabulaire ne doit pas etre renforce dans les textes utilisateur finaux.

## BioDex

`[ACTUEL_CODE]` BioDex utilise :

- `src/lib/api/species-context.service.ts` ;
- `src/lib/api/biodex-preview.service.ts` ;
- `src/lib/mock/mock-biodex` ;
- route `/profile/biodex`.

`[ACTUEL_CODE]` Une exception prototype debloque une espece si aucune n'est debloquee.

`[RISQUE]` Cette exception doit rester documentee comme prototype.

## Transactions et monnaies dans les mocks

`[ACTUEL_CODE]` `MockPointsTransactionRecord` a deux champs monetaires :

- `delta` : variation du portefeuille global (Graines gagnees/depensees ou soutien debite).
- `impactDelta` : Credits Impact generes — **soutien producteur uniquement**. Vaut `0` pour tout autre type de transaction (defis, missions, engagement, bonus, allocations d'abonnement).

`[CIBLE_VALIDEE]` Regles de remplissage validees apres R8 :

| Source de transaction | `delta` | `impactDelta` |
|---|---|---|
| Soutien producteur | negatif (montant debite) | positif (Credits Impact) |
| Don pur | negatif | 0 |
| Achat produit | negatif | 0 |
| Defi / mission complete | positif (Graines) | 0 |
| Allocation abonnement | positif (Graines) | 0 |
| Bonus de bienvenue / streak / parrainage | positif (Graines) | 0 |

`[ACTUEL_CODE]` `MockSubscriptionRecord.monthly_seeds_allocation` represente l'allocation mensuelle de Graines liee a l'abonnement. Ce n'est pas des Credits Impact.

`[ACTUEL_CODE]` `getMockImpactPoints(viewerId)` retourne le solde de Credits Impact calcule depuis `impactDelta`. Apres correction, ce solde reflète uniquement les soutiens producteurs.

## Academy

`[ACTUEL_CODE]` Academy est presente dans :

- `src/app/[locale]/(screens)/academy`.

`[ACTUEL_CODE]` Des prototypes/labs d'apprentissage existent aussi dans :

- `src/app/[locale]/(lab)/kinnu` ;
- `src/app/[locale]/(lab)/kinnu-v2`.

`[A_DECIDER]` Le statut produit exact des labs reste a trancher.

## i18n et contenus

`[ACTUEL_CODE]` Les routes sont locale-aware via `[locale]` et `next-intl`.

`[ACTUEL_CODE]` Beaucoup de textes restent hardcodes dans les composants.

`[A_VERIFIER_CODE]` Aucun dossier `messages` n'a ete identifie dans `apps/web-client` pendant cette passe.

## Termes legacy presents dans le code

| Terme | Presence | Statut |
|---|---|---|
| `investment` | Routes, actions, metadata Stripe, mocks | `[ACTUEL_CODE]` + `[DEPRECIE]` | Ne pas utiliser en UI finale. Metadata Stripe doivent migrer vers `producer_support`. |
| `points` | Encore present dans `mock-member-data.ts` : `MockPointsTransactionRecord`, `total_points`, `unit_price_points`, `amount_points`, `getMockPointsTransactions`. R8 a renomme `Profile.points` uniquement. | `[ACTUEL_CODE]` + `[DEPRECIE]` | `impactCreditsBalance` est la cible pour le solde Credits Impact. Les autres champs `*_points` restent en attente de migration progressive. Reste aussi dans Supabase V0 (`[A_NE_PAS_TOUCHER]`). |
| `Artisans Locaux` | Supabase V0 uniquement — retire du TypeScript en R7 (2026-05-08) | `[PURGE_R7]` + `[LEGACY]` | Ne pas reintroduire. Factions cibles : Vie Sauvage, Terres & Forets, Gardiens des mers. |
| Supabase V0 | Ancienne DB branchee au dashboard admin | `[ACTUEL_CODE]` + `[LEGACY]` + `[A_NE_PAS_TOUCHER]` |
| mocks web-client | Donnees prototype pour UX et flows | `[ACTUEL_CODE]` + `[SOURCE_PROTOTYPE]` |

## Ce document ne decide pas

Ce document ne decide pas :

- le futur nom des routes ;
- le futur modele economique ;
- les regles finales de deblocage BioDex ;
- la separation definitive don/soutien/achat ;
- le statut final de l'Academy.

Ces sujets sont dans `04-QUESTIONS-OUVERTES.md`.
