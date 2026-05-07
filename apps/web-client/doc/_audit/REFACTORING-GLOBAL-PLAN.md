# Plan global de refactoring

Date : 2026-05-07

Portee : audit documentaire et plan de refactoring pour `apps/web-client`. Aucun code applicatif, mock, Supabase, Stripe, route, composant, action, type ou package n'est modifie par ce document.

Sources principales :

- `doc/README.md`
- `doc/_current/03-DECISIONS-VALIDEES.md`
- `doc/_current/04-QUESTIONS-OUVERTES.md`
- `doc/_current/02-ETAT-ACTUEL-CODE.md`
- `doc/_current/11-TECHNIQUE-DATA.md`
- `doc/_current/01-PRODUIT-ET-EXPERIENCE.md`
- `doc/_current/99-GLOSSAIRE-LEXIQUE.md`
- audits P0 existants dans `doc/_audit/`
- cartographie code effectuee dans `src/app`, `src/lib/mock`, `src/lib/api`, `src/lib/supabase`, `src/lib/stripe.ts`

Statuts utilises : `[IMMEDIAT]`, `[P1]`, `[P2]`, `[P3]`, `[DEFERER]`, `[A_NE_PAS_TOUCHER]`, `[LOW_RISK]`, `[MEDIUM_RISK]`, `[HIGH_RISK]`, `[CRITIQUE]`, `[ACTUEL_CODE]`, `[LEGACY]`, `[SOURCE_PROTOTYPE]`, `[CIBLE_VALIDEE]`, `[A_DECIDER]`, `[A_TESTER]`.

---

## 1. Resume executif

`[CIBLE_VALIDEE]` Le refactoring doit etre progressif. La documentation recente est maintenant suffisamment stable pour guider les migrations, mais le code reste un prototype hybride : mocks riches, Supabase legacy V0 encore connecte, Stripe reel sur certains flows, paiements produits simules, routes et termes legacy.

La priorite n'est pas de tout renommer. La priorite est de reduire les risques de confusion produit, juridique et impact sans casser le prototype.

Ordre recommande :

1. `[IMMEDIAT] [LOW_RISK]` Corriger plus tard les wording UI les plus dangereux : claims d'impact trop forts, `recu fiscal`, paiement Stripe simule presente comme reel, `Artisans Locaux` visible dans l'onboarding, `points` visible comme terme final.
2. `[P1] [LOW_RISK]` Ajouter des couches d'alias et helpers target sans supprimer les noms legacy : `producer_support` autour de `investment`, `impactCredits` autour de `points`, labels prudents d'impact.
3. `[P1] [MEDIUM_RISK]` Stabiliser les mocks critiques et classifier les donnees : projets, especes, produits, transactions, factions.
4. `[P2] [MEDIUM_RISK]` Unifier progressivement les services data et les APIs publiques autour de la doctrine `mock` source prototype / Supabase legacy.
5. `[P2-P3] [HIGH_RISK]` Preparer la migration route `/invest` vers `/support`, metadata Stripe `investment` vers `producer_support`, et schema DB V2.
6. `[DEFERER] [CRITIQUE]` Ne pas migrer maintenant Supabase legacy V0, generated types, tables `investments` / `donations`, webhooks complets, ou renommages globaux `points` / `investment`.

Principes directeurs :

- `donation`, `producer_support`, `product_purchase` sont les concepts cibles.
- `/invest`, `investment`, `points` et `Artisans Locaux` sont des elements legacy a migrer progressivement.
- Les mocks sont la source prototype court terme, pas le schema final.
- Supabase V0 est legacy et doit rester fonctionnel pour l'ancien dashboard.
- Stripe est hybride : reel pour don et invest, simule pour achat produit.
- BioDex est une trace pedagogique, jamais une preuve de sauvetage.
- Credits Impact et Graines ne sont jamais des preuves d'impact.

---

## 2. Cartographie globale de la dette

| Domaine | Fichiers / zones concernees | Dette observee | Risque | Priorite | Recommandation |
|---|---|---|---|---|---|
| Don / soutien / achat | `projects/[slug]/donate`, `projects/[slug]/invest`, `products/[id]`, `api/payments/*` | Separation produit validee mais implementation heterogene. Don et invest ont Stripe reel ; achat produit est simule. | Juridique, UX, paiement | `[P1]` | Clarifier UI et architecture avant toute migration lourde. |
| `investment` vers `producer_support` | `projects/[slug]/invest`, `profile/investments`, `mock-member-data.ts`, Stripe metadata, core `investment` | Nom legacy financier present dans routes, types, actions, historique et metadata. | Juridique, comprehension, migration cascade | `[P1-P2]` | Creer alias et wording UI avant rename technique. Reporter route rename. |
| `points` vers `Credits Impact` | `mock-member-data.ts`, `mock-viewer.ts`, `utils.ts`, product checkout, balance modal, profile, Supabase legacy | `points` couvre Credits Impact, Graines, score, historique, impacts estimes et legacy DB. | Confusion produit, fausse monnaie, migration incorrecte | `[P1-P2]` | Classifier par famille avant migration. Ne jamais faire de search/replace global. |
| Claims d'impact | `balance-modal-content.tsx`, `mock-public-profile.tsx`, `guest-profile.tsx`, `project-species-section.tsx`, `project-species-impact-section.tsx`, `transaction-receipt.tsx`, mocks projets/factions | Formulations comme `abeilles sauvees`, `CO2 capture`, `Espèces Protégées`, equivalence solde -> abeilles. | Greenwashing, RSE, confiance | `[IMMEDIAT]` | Prioriser wording prudent et attachement a projet/methode. |
| BioDex unlock | `mock-biodex.ts`, `species-context.service.ts`, `biodex-preview.service.ts`, profile BioDex | Unlock base sur `investedProjectSlugs`, condition Academy pour Abeille Noire, exception prototype qui unlock automatiquement. | Confusion gamification/preuve, regle produit fausse | `[P1-P2]` | Documenter puis isoler les rules target sans supprimer brutalement le prototype. |
| Academy / Missions / Challenges / Aventure | `(screens)/academy`, `(screens)/challenges`, `(tabs)/adventure`, `mock-challenges.ts`, `quest.actions.ts` | Terminologie `quest`, `challenge`, `mission` confuse ; Aventure renvoie vers Challenges ; Academy peu integree. | UX, surcharge, gamification vide | `[P1]` | Harmoniser labels UI progressivement ; garder code legacy technique. |
| Factions | `mock-factions.ts`, `mock-viewer.ts`, `types.ts`, `mock-ids.ts`, onboarding, auth actions, impact seasons | `Artisans Locaux` encore present comme faction legacy. | Confusion producteurs/factions, onboarding faux | `[IMMEDIAT-P2]` | Ne plus renforcer ; remplacer UI visible plus tard ; migration type plus tard. |
| Stripe | `src/lib/stripe.ts`, `api/payments/create-intent`, `api/payments/mobile-sheet`, `api/webhooks/stripe`, donation/invest actions, product checkout | Integration reelle mais heterogene ; schema sans `donation`; flow produit simule ; webhook partiel. | Paiement, legal, data legacy | `[P1-P3]` | Corriger d'abord affichages trompeurs ; unifier architecture plus tard. |
| Supabase legacy | `src/lib/supabase/*`, generated types, routes API, webhook Stripe, auth | V0 connectee et encore utilisee par admin / webhooks / API. Pas schema cible. | Casse admin, migration prematuree | `[A_NE_PAS_TOUCHER]` | Ne pas modifier maintenant ; preparer DB V2 separee plus tard. |
| Services data hybrides | `get-projects.ts`, `get-products.ts`, `species-context.service.ts`, `biodex-preview.service.ts`, routes API | Services parfois mock-first, APIs parfois Supabase-only, merges et fallbacks. | Donnees incoherentes, doublons, debug difficile | `[P2]` | Stabiliser mocks puis definir une strategie API coherente. |
| Mocks critiques | `mock-ids.ts`, `mock-biodex.ts`, `mock-projects.ts`, `mock-products.ts`, `mock-member-data.ts` | Donnees riches mais encore porteuses de legacy et claims. | Casse prototype si changement brutal | `[P1]` | Geler structure, annoter familles, migrer par petites passes. |
| Produits / boutique | `products/[id]`, `products` tab, `mock-products.ts`, product checkout | Achat produit peut afficher Credits Impact gagnes alors que doctrine cible dit achat produit ne cree pas de Credits Impact. | Confusion business, promesse fausse | `[IMMEDIAT-P1]` | Clarifier le statut prototype et aligner rewards plus tard. |
| Profil / historique | `profile/investments`, `profile/[id]`, `transaction-receipt.tsx`, `mock-member-data.ts` | Historique centre sur `investment`, `points`, metriques d'impact fortes. | Confusion utilisateur, preuve excessive | `[P1]` | Renommer UI progressivement ; garder data legacy jusqu'a mapping. |
| Routes | `/projects/[slug]/invest`, `/profile/investments`, modals interceptes | Routes legacy visibles et profondement referencees. | Casse navigation / SEO / modals | `[P2-P3]` | Ne pas renommer maintenant ; preparer alias `/support` puis redirections. |

---

## 3. Refactors immediats a faible risque

Ces refactors peuvent etre planifies rapidement car ils touchent surtout le wording, les labels et la clarification UX. Ils ne doivent pas changer la logique metier ni les mocks dans la phase documentaire actuelle.

### 3.1 Wording impact prudent

`[IMMEDIAT] [LOW_RISK]`

Fichiers candidats :

- `src/app/[locale]/@modal/(.)products/balance/balance-modal-content.tsx`
- `src/app/[locale]/(tabs)/profile/_features/guest-profile.tsx`
- `src/app/[locale]/(screens)/profile/[id]/mock-public-profile.tsx`
- `src/app/[locale]/(screens)/projects/[slug]/_components/sections/project-species-section.tsx`
- `src/app/[locale]/(screens)/products/[id]/_components/product-linked-species-section.tsx`
- `src/app/[locale]/(screens)/projects/[slug]/_components/sections/project-species-impact-section.tsx`

Actions futures recommandees :

- Remplacer les formulations visibles `ABEILLES SAUVEES`, `CO2 CAPTURE`, `Espèces Protégées` par des labels prudents.
- Supprimer les conversions directes solde / Credits Impact / points vers impact vivant.
- Ajouter la logique de preuve seulement plus tard, rattachee a projet, action, hypothese et source.

Risque faible si limite aux labels UI, mais risque moyen si les noms techniques sont renommes en meme temps.

### 3.2 Clarification paiement produit simule

`[IMMEDIAT] [LOW_RISK]`

Fichier candidat :

- `src/app/[locale]/(screens)/products/[id]/_features/product-fiat-checkout-view.tsx`

Dette observee :

- Le paiement produit utilise `setTimeout`.
- L'UI affiche `Paiement sécurisé par Stripe`.
- L'ecran succes affiche `Paiement validé !`, un numero de commande et `Credits Impact gagnés`.

Actions futures recommandees :

- Tant que le flow est simule, ne pas afficher une rassurance Stripe reelle.
- Ne pas afficher des Credits Impact crees par achat produit si la doctrine cible reste : achat produit ne cree pas de Credits Impact.
- Indiquer explicitement le statut prototype si l'ecran reste accessible en demonstration.

### 3.3 Recu fiscal vers recu de contribution

`[IMMEDIAT] [LOW_RISK]`

Fichier candidat :

- `src/app/[locale]/(screens)/profile/investments/_features/transaction-receipt.tsx`

Action future recommandee :

- Remplacer `Télécharger le reçu fiscal (PDF)` par un wording prudent de type `recu de contribution` ou `recu de paiement`, tant que le statut fiscal/legal n'est pas valide.

### 3.4 `Artisans Locaux` visible dans l'onboarding

`[IMMEDIAT-P1] [LOW_RISK]`

Fichiers candidats :

- `src/app/[locale]/(screens)/onboarding/_features/step-0-hook.tsx`
- `src/app/[locale]/(screens)/onboarding/_features/onboarding-flow.tsx`

Actions futures recommandees :

- Ne plus presenter `Artisans Locaux` comme faction cible visible.
- Remplacer par `Gardiens des mers` dans l'UI quand une migration UX est planifiee.
- Ne pas retirer tout de suite `Artisans Locaux` du type `Faction` ni des mocks.

### 3.5 Labels `quest` / `challenge` / `mission`

`[P1] [LOW_RISK]`

Fichiers candidats :

- `src/app/[locale]/(tabs)/adventure/page.tsx`
- `src/app/[locale]/(tabs)/adventure/_features/adventure-tab.tsx`
- `src/app/[locale]/(screens)/challenges/*`
- `src/lib/mock/mock-challenges.ts`

Actions futures recommandees :

- Cote UI francophone, preferer `Mission` pour action courte et `Defi` pour objectif structure.
- Garder `quest` comme terme technique interne temporaire.
- Ne pas renommer les routes `/challenges` maintenant.

---

## 4. Refactors a risque moyen a preparer

Ces migrations sont utiles mais doivent etre precedees de mapping, tests et alias.

### 4.1 Alias `producer_support` autour de `investment`

`[P1-P2] [MEDIUM_RISK]`

Fichiers / zones :

- `src/app/[locale]/(screens)/projects/[slug]/invest/*`
- `src/app/[locale]/@modal/(.)projects/[slug]/invest/page.tsx`
- `src/app/[locale]/(screens)/profile/investments/*`
- `src/lib/mock/mock-member-data.ts`
- `src/lib/mock/mock-biodex.ts`
- `src/app/api/payments/create-intent/route.ts`
- `src/app/api/payments/mobile-sheet/route.ts`
- `src/app/api/webhooks/stripe/route.ts`
- package core `@make-the-change/core` si `investment` y reste expose

Approche recommandee :

1. Creer une couche de vocabulaire UI `soutien producteur` sans toucher aux routes.
2. Introduire des types alias documentes si necessaire : legacy `investment` lu comme `producer_support` cible.
3. Mapper les metadata `investment` vers `producer_support` uniquement quand Stripe/webhook et donnees existantes sont cadrés.
4. Ajouter `/support` seulement apres inventaire des liens, modals, redirects et analytics.

A eviter :

- Renommer le dossier `invest` maintenant.
- Renommer la table `investments`.
- Changer les metadata Stripe sans strategie de compatibilite.

### 4.2 Alias `impactCredits` autour de `points`

`[P1-P2] [MEDIUM_RISK]`

Fichiers / zones :

- `src/lib/mock/mock-member-data.ts`
- `src/lib/mock/mock-viewer.ts`
- `src/lib/mock/types.ts`
- `src/lib/utils.ts` (`formatPoints`)
- `src/app/[locale]/(tabs)/products/_features/mock-products.ts`
- `src/app/[locale]/(screens)/products/[id]/*`
- `src/app/[locale]/@modal/(.)products/balance/*`
- `src/app/api/payments/*` (`points_used`)
- Supabase legacy generated types si exposes

Approche recommandee :

1. Classifier chaque famille de `points` : Credits Impact, Graines, score/XP, impact metric, legacy investment, Supabase legacy, inconnu.
2. Introduire des helpers d'affichage `formatImpactCredits` sans supprimer `formatPoints` tout de suite.
3. Conserver les champs legacy persistants `*_points` jusqu'a migration data.
4. Interdire les nouveaux usages metier cibles de `points`.

A eviter :

- Search/replace global `points` -> `impactCredits`.
- Supposer que tous les points sont des Credits Impact.

### 4.3 Stabilisation des mocks critiques

`[P1] [MEDIUM_RISK]`

Mocks critiques :

- `src/lib/mock/mock-ids.ts`
- `src/lib/mock/mock-biodex.ts`
- `src/app/[locale]/(tabs)/projects/_features/mock-projects.ts`
- `src/app/[locale]/(tabs)/products/_features/mock-products.ts`
- `src/lib/mock/mock-member-data.ts`

Approche recommandee :

- Geler les IDs structurants.
- Annoter mentalement les champs legacy sans modifier brutalement.
- Distinguer donnees UX prototype et donnees futures DB V2.
- Preparer un dictionnaire de correspondance : projet, producteur, produit, espece, contribution, preuve, reward.

### 4.4 BioDex unlock rules

`[P1-P2] [MEDIUM_RISK]`

Fichiers / zones :

- `src/lib/mock/mock-biodex.ts`
- `src/lib/api/species-context.service.ts`
- `src/lib/api/biodex-preview.service.ts`
- `src/app/[locale]/(screens)/profile/biodex/*`

Dette observee :

- `investedProjectSlugs` est le declencheur principal.
- L'Abeille Noire depend d'un challenge Academy en plus de l'investissement.
- `ensurePrototypeUnlockedSpecies()` debloque automatiquement une espece si aucune n'est debloquee.
- L'achat produit peut enrichir une progression mais ne doit pas debloquer en cible.

Approche recommandee :

1. Garder toutes les especes visibles publiquement.
2. Introduire plus tard une fonction cible pure : action reelle + projet + lien espece explicite.
3. Isoler l'exception prototype derriere un flag de demonstration ou la supprimer en production seulement apres validation.
4. Ne pas confondre rarete de collection et statut de conservation.

### 4.5 Services data hybrides

`[P2] [MEDIUM_RISK]`

Fichiers / zones :

- `src/lib/mock/data-source.ts`
- `src/app/[locale]/(tabs)/projects/_features/get-projects.ts`
- `src/app/[locale]/(tabs)/products/_features/get-products.ts`
- `src/lib/api/species-context.service.ts`
- `src/lib/api/biodex-preview.service.ts`
- routes `src/app/api/projects`, `src/app/api/products`, `src/app/api/partners`

Dette observee :

- Les services `getProjects` / `getProducts` sont mock-first puis merge Supabase selon source.
- Certaines routes API lisent directement Supabase sans respecter `isMockDataSource`.
- Le fallback BioDex peut masquer les problemes de data.

Approche recommandee :

1. Ne pas toucher Supabase legacy.
2. Decider si les APIs publiques doivent rester legacy ou devenir hybrides.
3. Si hybridation : utiliser les memes services que les pages.
4. Ajouter des tests de non-duplication slug/id avant refactor.

---

## 5. Refactors a eviter maintenant

### 5.1 Renommage global `investment` -> `producer_support`

`[DEFERER] [HIGH_RISK]`

Pourquoi :

- Le terme est present dans routes, modals, actions, core, mocks, historique, Stripe metadata, table Supabase `investments`.
- Un rename global peut casser checkout, historique utilisateur, webhook, liens profonds et modals interceptes.

Decision : ne pas faire maintenant.

### 5.2 Renommage global `points` -> `impactCredits`

`[DEFERER] [HIGH_RISK]`

Pourquoi :

- `points` couvre plusieurs familles.
- Certains champs representent Graines, score, prix produit, credits boutique, historique ou legacy DB.
- Une migration incorrecte creerait de la dette plus grave que la dette actuelle.

Decision : classifier avant migration.

### 5.3 Migration Supabase V0

`[A_NE_PAS_TOUCHER] [CRITIQUE]`

Elements a ne pas toucher maintenant :

- tables `investments`, `donations`, `orders`, `profiles`, `public_projects`, `public_products`, `public_producers`
- generated types
- dashboard admin legacy
- RPC webhook existante

Pourquoi :

- Supabase V0 reste connecte a l'ancien dashboard.
- Ce n'est pas le schema cible.
- Les webhooks ecrivent encore dedans.

### 5.4 Overhaul Stripe / webhooks

`[DEFERER] [HIGH_RISK]`

Pourquoi :

- Donation et invest creent deja de vrais PaymentIntents.
- Webhook success ecrit dans Supabase legacy.
- Remboursement, metadata, schema et architecture doivent etre planifies ensemble.

A faire avant :

- clarifier metadata cibles ;
- strategy compat legacy ;
- tests Stripe ;
- decision sur produit simule vs reel.

### 5.5 Suppression des mocks

`[A_NE_PAS_TOUCHER] [CRITIQUE]`

Pourquoi :

- Les mocks sont la source prototype pour UX, flows et future DB V2.
- Supabase legacy ne peut pas les remplacer proprement.

### 5.6 Renommage routes `/invest` et `/profile/investments`

`[DEFERER] [HIGH_RISK]`

Pourquoi :

- Routes profondement liees aux modals interceptes et aux liens existants.
- Peut casser navigation, fallback, historique et references.

Approche future :

- Ajouter `/support` en alias.
- Garder `/invest` en compatibilite.
- Rediriger apres tests.

---

## 6. Roadmap progressive doc -> UI -> architecture -> DB V2

### Phase 0 — Documentation et garde-fous

`[TERMINE_EN_PARTIE]`

Objectif : stabiliser les decisions et audits.

Etat :

- Documentation restructuree en `_current`, `_audit`, `_legacy`.
- P0 principaux documentes.
- Present plan ajoute la vision globale de refactoring.

Livrables restants possibles :

- Tickets issus de ce plan.
- Matrice de suivi des migrations `investment`, `points`, `impact claims`, `BioDex unlock`.

### Phase 1 — Corrections UI prudentes sans migration structurelle

`[IMMEDIAT-P1]`

Objectif : reduire les risques visibles sans changer les fondations.

Travaux :

- Wording impact prudent.
- Clarification paiement produit simule.
- Remplacement `recu fiscal` par `recu de contribution`.
- UI `Artisans Locaux` non renforcee.
- Labels `Mission` / `Defi` plus clairs.

Tests :

- Smoke test navigation.
- Test visuel des pages impact/profil/checkout/onboarding.
- Verification qu'aucun type, route, action, Stripe ou mock structurel n'a change.

### Phase 2 — Alias techniques et helpers

`[P1-P2]`

Objectif : preparer la migration sans casser legacy.

Travaux :

- Helpers UI `formatImpactCredits`, labels prudents d'impact.
- Alias metier `producer_support` au-dessus de `investment` dans les view-models.
- Mapping clair des familles de `points`.
- Fonction cible documentee pour BioDex unlock.

Tests :

- Typecheck.
- Tests unitaires des helpers.
- Tests de non-regression sur historique, balance, projets, produits.

### Phase 3 — Stabilisation data prototype

`[P1-P2]`

Objectif : figer les mocks qui serviront a la DB V2.

Travaux :

- Stabiliser les 5 mocks critiques.
- Identifier champs target vs legacy.
- Documenter relations projet-producteur-espece-produit-action-preuve.
- Definir minimum viable data model sans toucher Supabase.

Tests :

- Parcours projet -> donation/support -> profil -> BioDex.
- Parcours produit -> commande prototype.
- Parcours Aventure -> mission/defi -> Graines.

### Phase 4 — Architecture data et paiement

`[P2]`

Objectif : rendre les sources de donnees et paiements coherents.

Travaux :

- Decider si routes API doivent respecter `APP_DATA_SOURCE`.
- Unifier `create-intent` avec donation/invest ou documenter leur separation.
- Preparer `producer_support` metadata avec compat legacy.
- Clarifier produit simule vs Stripe reel.

Tests :

- Tests Stripe sandbox.
- Tests auth mock/supabase.
- Tests webhook avec metadata legacy et cible.

### Phase 5 — Routes et migration metier

`[P2-P3]`

Objectif : migrer progressivement les noms publics et techniques.

Travaux :

- Ajouter route `/projects/[slug]/support` comme alias.
- Garder `/invest` temporairement.
- Renommer UI `profile/investments` vers historique de soutiens / contributions, sans casser route au debut.
- Migrer metadata `investment` -> `producer_support` avec fallback.

Tests :

- Tests navigation directe et modals.
- Tests redirections.
- Tests historique transactionnel.

### Phase 6 — DB V2 et admin V2

`[P3+] [DEFERER]`

Objectif : creer une base cible propre separee de Supabase V0 legacy.

Preconditions :

- Flows valides par tests utilisateur.
- Mocks stabilises.
- Dashboard admin cible defini.
- Modele de preuve et reporting documente.
- Strategie Stripe et webhooks stabilisee.

Schema conceptuel candidat :

- `donations`
- `producer_supports`
- `product_purchases`
- `impact_credits_ledger`
- `seeds_ledger`
- `projects`
- `partners`
- `species`
- `project_species_links`
- `user_species_unlocks`
- `impact_claims`
- `impact_proof_sources`

---

## 7. Propositions de tickets concrets

### Ticket 1 — Audit visuel des claims d'impact publics

Priorite : `[IMMEDIAT]`

Objectif : remplacer les formulations visibles les plus risquees par des formulations prudentes.

Fichiers :

- `balance-modal-content.tsx`
- `mock-public-profile.tsx`
- `guest-profile.tsx`
- `project-species-section.tsx`
- `product-linked-species-section.tsx`
- `project-species-impact-section.tsx`
- `transaction-receipt.tsx`

Risques :

- Faible si wording uniquement.
- Moyen si changement de donnees ou calculs.

Preconditions :

- Liste de formulations validees.

Tests :

- Verification visuelle pages profil, portefeuille, projets, produits.
- Recherche `sauve`, `protege`, `CO2 capture`, `recu fiscal` apres changement.

### Ticket 2 — Clarifier le statut du checkout produit

Priorite : `[IMMEDIAT]`

Objectif : eviter qu'un paiement simule soit presente comme Stripe reel.

Fichier :

- `products/[id]/_features/product-fiat-checkout-view.tsx`

Risques :

- UX si le prototype doit rester demo.
- Legal si non corrige avant test public.

Preconditions :

- Decision : garder demo explicite ou desactiver le checkout produit reel.

Tests :

- Parcours produit jusqu'a succes.
- Verification absence de promesse Stripe reelle si pas de Stripe.

### Ticket 3 — Remplacer `Artisans Locaux` en UI onboarding

Priorite : `[P1]`

Objectif : ne plus presenter une faction depreciee comme choix cible.

Fichiers :

- `onboarding/_features/step-0-hook.tsx`
- `onboarding/_features/onboarding-flow.tsx`

Risques :

- Faible pour UI.
- Moyen si type `Faction` modifie en meme temps.

Preconditions :

- Confirmer la faction de remplacement et son wording.

Tests :

- Parcours onboarding mock.
- Verification auth setup ne casse pas tant que `Artisans Locaux` existe en compatibilite.

### Ticket 4 — Introduire un mapping UI `investment` -> `soutien producteur`

Priorite : `[P1]`

Objectif : reduire le vocabulaire financier visible sans renommer routes ni tables.

Fichiers :

- `projects/[slug]/invest/_components/*`
- `projects/[slug]/_features/invest-client.tsx`
- `profile/investments/*`
- `transaction-receipt.tsx`

Risques :

- Moyen : wording et navigation peuvent diverger.

Preconditions :

- Liste de labels FR cibles.
- Decision sur maintien visible du mot `investir` dans certains CTAs legacy.

Tests :

- Parcours projet -> support/invest -> profil.
- Recherche termes `investir`, `investissement`, `rendement`, `retour` en UI.

### Ticket 5 — Classifier toutes les occurrences `points`

Priorite : `[P1]`

Objectif : preparer la migration `points` sans rename global.

Fichiers :

- `src/lib/mock/mock-member-data.ts`
- `src/lib/mock/mock-viewer.ts`
- `src/lib/mock/types.ts`
- `src/lib/utils.ts`
- `products/*`
- `profile/*`
- `api/payments/*`

Risques :

- Faible si documentaire / tableau.
- Eleve si migration technique immediate.

Preconditions :

- Reprendre la classification P0-3.

Tests :

- Aucun test code si audit uniquement.
- Si helpers ajoutes plus tard : typecheck et affichage balance/produits/profil.

### Ticket 6 — Creer helpers d'affichage Credits Impact

Priorite : `[P1-P2]`

Objectif : permettre de nouveaux ecrans propres sans supprimer `points` legacy.

Fichiers :

- `src/lib/utils.ts` ou helper dedie
- `src/components/currency/*`
- usages balance / produits / profil

Risques :

- Moyen : confusion si helper applique a des points qui ne sont pas Credits Impact.

Preconditions :

- Ticket 5 termine.

Tests :

- Typecheck.
- Tests visuels sur balance et produits.

### Ticket 7 — Isoler la logique BioDex unlock cible

Priorite : `[P1-P2]`

Objectif : preparer des rules propres sans casser `mock-biodex.ts`.

Fichiers :

- `src/lib/mock/mock-biodex.ts`
- `src/lib/api/species-context.service.ts`
- `src/lib/api/biodex-preview.service.ts`

Risques :

- Moyen a eleve : BioDex depend de nombreux mocks et parcours.

Preconditions :

- Decision finale sur role espece principale / secondaire.
- Decision sur suppression ou flag de l'exception prototype.

Tests :

- Utilisateur sans action : pas d'unlock produit final sauf demo explicite.
- Don/soutien lie a espece : unlock attendu.
- Achat produit seul : pas d'unlock.
- Academy seule : pas d'unlock.

### Ticket 8 — Stabiliser les mocks critiques

Priorite : `[P1]`

Objectif : transformer les mocks en base fiable pour la DB V2 future.

Fichiers :

- `mock-ids.ts`
- `mock-biodex.ts`
- `mock-projects.ts`
- `mock-products.ts`
- `mock-member-data.ts`

Risques :

- Moyen : les mocks sont tres connectes.

Preconditions :

- Aucun changement de schema sans ticket dedie.

Tests :

- Smoke test projets, produits, profil, BioDex, Aventure.

### Ticket 9 — Decider la strategie API mock/Supabase

Priorite : `[P2]`

Objectif : eviter que pages et routes API lisent des sources differentes.

Fichiers :

- `src/app/api/projects/route.ts`
- `src/app/api/projects/featured/route.ts`
- `src/app/api/products/route.ts`
- `src/app/api/partners/route.ts`
- `get-projects.ts`
- `get-products.ts`

Risques :

- Moyen : clients mobiles/API peuvent attendre Supabase.

Preconditions :

- Decision : API legacy assumee ou API hybride.

Tests :

- Requetes API.
- Comparaison pages vs API.
- Non regression mobile si utilise.

### Ticket 10 — Aligner schema Stripe create-intent avec flows reels

Priorite : `[P2]`

Objectif : corriger l'incoherence `donation` absent du schema create-intent et preparer `producer_support`.

Fichiers :

- `api/payments/create-intent/route.ts`
- `api/payments/mobile-sheet/route.ts`
- `projects/[slug]/donate/_actions/create-donation.action.ts`
- `projects/[slug]/invest/_actions/create-investment.action.ts`

Risques :

- Eleve : paiement reel.

Preconditions :

- Strategie d'architecture : actions directes Stripe ou route centralisee.
- Compat metadata legacy.

Tests :

- Stripe test mode pour donation.
- Stripe test mode pour support legacy.
- Auth required.
- Metadata attendues.

### Ticket 11 — Preparer route `/support` sans supprimer `/invest`

Priorite : `[P2-P3]`

Objectif : migrer progressivement l'URL publique vers la cible.

Fichiers :

- `projects/[slug]/invest/page.tsx`
- `@modal/(.)projects/[slug]/invest/page.tsx`
- liens depuis project detail / cards / CTAs
- navigation i18n

Risques :

- Eleve : routes, modals, liens profonds, SEO.

Preconditions :

- Wording UI deja migre.
- Tests E2E disponibles.

Tests :

- Acces direct `/invest`.
- Acces direct `/support`.
- Modal interceptee.
- Redirect/fallback.

### Ticket 12 — Schema conceptuel DB V2

Priorite : `[P3+]`

Objectif : concevoir la base cible sans toucher Supabase V0.

Fichiers :

- Nouveau document d'audit/data futur, pas le code.

Risques :

- Critique si implemente trop tot.

Preconditions :

- Mocks stabilises.
- Flows testes.
- Admin V2 cadre.
- Stripe cible cadre.

Tests :

- Revue architecture.
- Mapping mock -> DB V2.
- Revue migration legacy.

---

## 8. Ordre recommande des migrations

### Maintenant

1. Documenter ce plan.
2. Ouvrir les tickets `claims impact`, `checkout produit simule`, `recu fiscal`, `Artisans Locaux UI`.
3. Ne pas toucher au code tant que les tickets ne sont pas explicitement demandes.

### Prochaine passe de code faible risque

1. Wording impact prudent.
2. Checkout produit explicite comme prototype ou non trompeur.
3. Recu de contribution.
4. Faction UI onboarding.
5. Labels mission/defi.

### Passe de preparation technique

1. Classification `points`.
2. Helpers `Credits Impact`.
3. Alias `producer_support` view-model.
4. BioDex unlock target helper.
5. Stabilisation mocks.

### Passe architecture

1. Data-source API strategy.
2. Stripe create-intent strategy.
3. Webhook and refund strategy.
4. Product purchase real Stripe or disabled prototype.

### Passe migration lourde

1. `/support` alias.
2. Metadata `producer_support`.
3. DB V2 design.
4. Admin V2.
5. Migration data progressive.

---

## 9. Risques transverses

### Risque juridique / financier

Declencheurs :

- `investment`
- promesse de rendement ou retour
- `recu fiscal`
- Credits Impact perçus comme monnaie financiere

Mitigation :

- UI `soutien producteur`.
- Wording prudent.
- Pas de promesse fiscale ou rendement.

### Risque greenwashing / RSE

Declencheurs :

- `abeilles sauvees`
- `CO2 capture`
- `especes protegees`
- impact converti depuis un solde
- RSE sans preuve robuste

Mitigation :

- Niveaux de preuve.
- Estimations rattachees a projet/methode/source.
- Pas de conversion Credits Impact / Graines vers preuve.

### Risque casse prototype

Declencheurs :

- Suppression brutale de mocks.
- Rename routes.
- Rename types centraux.
- Modification Supabase legacy.

Mitigation :

- Alias avant migration.
- Tests de parcours.
- Documentation des champs legacy.

### Risque data incoherente

Declencheurs :

- Merges mock/Supabase.
- APIs Supabase-only.
- Fallback BioDex automatique.
- Webhook ecrivant en V0.

Mitigation :

- Doctrine par contexte.
- Stabilisation mocks.
- DB V2 separee plus tard.

---

## 10. Conclusion

Le codebase n'a pas besoin d'un grand refactoring immediat. Il a besoin d'une sequence controlee :

1. reduire les risques visibles ;
2. poser des alias ;
3. stabiliser les mocks ;
4. harmoniser progressivement data et paiement ;
5. seulement ensuite migrer routes, metadata et DB.

Les migrations les plus faciles sont les changements de wording prudents et les clarifications UX.

Les migrations les plus dangereuses sont les renommages globaux `investment`, `points`, la modification de Supabase legacy, et l'overhaul Stripe/webhook.

La regle centrale reste : ne pas forcer le code legacy a ressembler immediatement a la cible. Il faut creer des ponts explicites entre l'etat actuel et la cible validee, puis migrer par couches testables.
