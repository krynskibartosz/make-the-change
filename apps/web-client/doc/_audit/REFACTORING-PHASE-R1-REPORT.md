# Rapport de refactoring — Phase R1

Date : 2026-05-07

Portée : refactoring R1 ciblé sur le wording UI, les clarifications UX et la réduction des claims sensibles. Cette phase ne fait pas de migration profonde, ne modifie pas Supabase, ne supprime aucune route legacy et ne réalise aucun remplacement global aveugle.

---

## 1. Résumé de la phase

La phase R1 a appliqué les corrections à faible risque identifiées dans `REFACTORING-GLOBAL-PLAN.md` :

- réduction des claims d'impact trop forts dans les écrans visibles ;
- clarification du checkout produit simulé ;
- suppression du wording `reçu fiscal` ;
- retrait de `Artisans Locaux` de l'UI d'onboarding principale ;
- harmonisation visible de `Credits Impact` sans migration globale des champs `points` ;
- conservation volontaire des termes legacy dans les zones techniques, mocks, auth et lab hors périmètre R1.

---

## 2. Fichiers modifiés

### Code applicatif

- `apps/web-client/src/app/[locale]/@modal/(.)products/balance/balance-modal-content.tsx`
- `apps/web-client/src/app/[locale]/(tabs)/profile/_features/guest-profile.tsx`
- `apps/web-client/src/app/[locale]/(tabs)/profile/_features/authenticated-profile.tsx`
- `apps/web-client/src/app/[locale]/(tabs)/products/products-client.tsx`
- `apps/web-client/src/app/[locale]/(tabs)/adventure/_features/adventure-tab-header.tsx`
- `apps/web-client/src/app/[locale]/(screens)/profile/[id]/mock-public-profile.tsx`
- `apps/web-client/src/app/[locale]/(screens)/profile/investments/_features/transaction-receipt.tsx`
- `apps/web-client/src/app/[locale]/(screens)/projects/[slug]/_components/sections/project-species-section.tsx`
- `apps/web-client/src/app/[locale]/(screens)/projects/[slug]/_components/sections/project-species-impact-section.tsx`
- `apps/web-client/src/app/[locale]/(screens)/projects/[slug]/_features/invest-client.tsx`
- `apps/web-client/src/app/[locale]/(screens)/products/[id]/_components/product-linked-species-section.tsx`
- `apps/web-client/src/app/[locale]/(screens)/products/[id]/_features/product-fiat-checkout-view.tsx`
- `apps/web-client/src/app/[locale]/(screens)/onboarding/_features/step-0-hook.tsx`
- `apps/web-client/src/app/[locale]/(screens)/onboarding/_features/onboarding-flow.tsx`
- `apps/web-client/src/components/currency/currency-design.ts`

### Documentation

- `apps/web-client/doc/_audit/REFACTORING-GLOBAL-PLAN.md`
- `apps/web-client/doc/_audit/REFACTORING-PHASE-R1-REPORT.md`

---

## 3. Changements réalisés

### 3.1 Wording impact prudent

Les formulations d'impact trop affirmatives ont été remplacées par des formulations plus prudentes :

- `ABEILLES SAUVÉES` -> `ESPÈCES LIÉES` ou `ABEILLES ASSOCIÉES` selon contexte ;
- `MIEL GÉNÉRÉ` -> `RÉCOLTE ESTIMÉE` ;
- `CO2 CAPTURÉ` -> `CO₂ ASSOCIÉ` ;
- `Espèces Protégées` -> `Espèces liées au projet` ou `Espèces liées au produit` ;
- `Impact:` dans une fiche produit -> `Contexte:` ;
- `Impact estimé` -> `Indicateurs pédagogiques estimés` ;
- `CO2 capturé` -> `CO2 associé` ;
- suppression d'une conversion directe solde / Credits Impact -> abeilles sauvées.

### 3.2 Clarification du checkout produit simulé

Le checkout produit ne présente plus le parcours comme un paiement Stripe réel :

- `Paiement validé !` -> `Commande prototype validée` ;
- `Paiement sécurisé par Stripe` -> `Prototype de paiement — aucun débit réel` ;
- `Payer avec Apple Pay` -> `Simuler avec Apple Pay` ;
- `Payer par Carte Bancaire` -> `Simuler par Carte Bancaire` ;
- message de succès clarifié : aucun paiement réel n'est débité ;
- suppression de l'affichage de `Credits Impact gagnés` après achat produit ;
- ajout du rappel visible : un achat produit ne crée pas automatiquement de Credits Impact.

### 3.3 Reçu fiscal

Le wording fiscal non validé a été remplacé :

- `Télécharger le reçu fiscal (PDF)` -> `Télécharger le reçu de contribution (PDF)`.

### 3.4 Onboarding et faction legacy

L'onboarding principal ne présente plus `Artisans Locaux` comme faction cible visible :

- `Artisans Locaux` -> `Gardiens des mers` ;
- icône `🤝` -> `🌊` ;
- description orientée océans / biodiversité marine ;
- textes `artisans locaux` remplacés par `projets producteurs` ;
- `Abeilles protégées` -> `Abeilles associées`.

### 3.5 Credits Impact

Le label visible recommandé est désormais utilisé sans accent :

- `Crédits Impact` / `CRÉDITS IMPACT` / `crédits impact` -> `Credits Impact` / `CREDITS IMPACT` dans les labels visibles ou aria-labels ciblés.

Aucune migration globale des champs `points` n'a été faite.

---

## 4. Termes remplacés

- `ABEILLES SAUVÉES`
- `abeilles sauvées`
- `Abeilles protégées`
- `Abeilles Protégées`
- `Espèces Protégées`
- `CO2 CAPTURÉ`
- `CO2 capturé`
- `MIEL GÉNÉRÉ`
- `Impact:` dans la section produit ciblée
- `reçu fiscal`
- `Paiement sécurisé par Stripe` dans le checkout produit simulé
- `Paiement validé !`
- `Credits Impact gagnés`
- `Crédits Impact` / `CRÉDITS IMPACT` dans les occurrences visibles ciblées
- `Artisans Locaux` dans l'UI onboarding ciblée

---

## 5. Termes conservés volontairement

Ces termes restent présents car ils sont hors périmètre R1 ou nécessaires à la compatibilité legacy :

- `Artisans Locaux` dans :
  - `src/lib/mock/types.ts` ;
  - `src/lib/mock/mock-viewer.ts` ;
  - `src/lib/mock/mock-session.ts` ;
  - `src/lib/mock/mock-ids.ts` ;
  - `src/app/[locale]/(tabs)/impact/_lib/mock-seasons.ts` ;
  - `src/app/[locale]/(auth)/actions.ts`.
- `abeilles protégées` dans :
  - `src/lib/mock/mock-factions.ts` ;
  - `src/app/[locale]/(tabs)/projects/_features/project-map-data.test.ts` ;
  - `src/app/[locale]/(lab)/kinnu/_lib/graph.ts`.
- `investment`, `invest`, `/invest`, `profile/investments` : conservés volontairement comme legacy technique et routes existantes.
- `points` : conservé volontairement comme alias legacy technique dans mocks, types, calculs et historique.
- Supabase V0 : non modifié.
- Stripe réel des flows don/soutien legacy : non modifié.

---

## 6. Éléments non traités

Non traités volontairement en R1 :

- migration `investment` -> `producer_support` ;
- renommage de routes `/invest` ou `/profile/investments` ;
- migration globale `points` -> `impactCredits` ;
- modification de Supabase, tables, generated types ou dashboard admin ;
- refonte Stripe / webhooks ;
- suppression des mocks legacy ;
- suppression de `Artisans Locaux` dans les types, mocks et auth ;
- refactor BioDex unlock rules ;
- refactor Academy / Missions / Challenges / Aventure ;
- normalisation complète des comments internes existants.

---

## 7. Risques restants

- Les termes legacy restent présents dans les mocks, types, auth et lab.
- Certaines données mockées conservent des claims ou labels forts pour préserver le prototype.
- Le checkout produit reste simulé ; il est maintenant explicite côté UI mais pas relié à Stripe réel.
- Les routes legacy `/invest` et `/profile/investments` restent visibles dans l'architecture.
- Le terme `points` reste très présent dans le code et ne doit pas être migré globalement sans classification.
- Le BioDex conserve des logiques de déblocage prototype non traitées en R1.
- Des warnings Git signalent des conversions LF -> CRLF possibles lors du prochain toucher de certains fichiers.

---

## 8. Tests / lint / typecheck exécutés

### Scripts disponibles dans `apps/web-client/package.json`

- `lint` : `biome check .`
- `type-check` : `tsc --noEmit`
- Aucun script `test` dédié n'est défini dans `apps/web-client/package.json`.

### Exécutions effectuées avant la consigne de report des validations

- Une tentative `pnpm type-check` a été lancée depuis le workspace racine. Elle a échoué sur un guard racine manquant : `tools/guard-no-sql.mjs` introuvable. Cet échec semble lié à la configuration workspace/racine et non aux changements R1.
- Une tentative directe `npx tsc --noEmit` a remonté des erreurs dans `apps/_legacy/apps-backup/...`, hors périmètre `apps/web-client` actif. Ces erreurs semblent préexistantes et liées au backup legacy.
- Une tentative `npx biome check apps/web-client/src` a demandé l'installation d'un package `biome@0.3.3`; la validation a été interrompue suite à la consigne utilisateur de ne pas poursuivre lint/typecheck maintenant.

### Validations reportées

Suite à la consigne utilisateur, aucun lint/typecheck/test complet n'a été relancé après les modifications R1.

---

## 9. Erreurs éventuelles

- Erreur initiale de commande PowerShell : usage de `head` / `tail`, indisponibles sur Windows PowerShell. Corrigé ensuite avec `Select-Object`.
- `pnpm type-check` racine échoue sur `tools/guard-no-sql.mjs` introuvable.
- `npx tsc --noEmit` direct remonte des erreurs dans `apps/_legacy/apps-backup`, hors périmètre actif.
- `npx biome check` n'a pas été poursuivi pour éviter une installation non nécessaire et respecter la consigne utilisateur.

---

## 10. Résultats des recherches finales

Recherche principale sur les termes sensibles UI R1 : aucun résultat restant pour :

- `Crédits Impact`
- `CRÉDITS IMPACT`
- `crédits impact`
- `Paiement sécurisé par Stripe`
- `Credits Impact gagnés`
- `Paiement validé`
- `Payer avec Apple Pay`
- `Payer par Carte Bancaire`
- `reçu fiscal`
- `Espèces Protégées`
- `ABEILLES SAUVÉES`
- `Abeilles sauvées`
- `CO2 CAPTURÉ`
- `CO2 capturé`

Recherche secondaire : occurrences restantes volontaires dans legacy/mocks/lab/tests/auth :

- `Artisans Locaux` dans les types, mocks, auth compatibility et seasons mock ;
- `abeilles protégées` dans mocks/lab/tests ;
- `protégées estimées` dans un graphe lab Kinnu.

---

## 11. Recommandations pour R2

Priorités recommandées pour R2 :

1. Créer une table de classification `points` : Credits Impact, Graines, score/XP, métriques d'impact, legacy Supabase, inconnu.
2. Introduire un helper explicite `formatImpactCredits` sans supprimer `formatPoints`.
3. Introduire une couche d'alias UI / view-model `producer_support` au-dessus de `investment` sans renommer les routes.
4. Préparer une migration douce de `/projects/[slug]/invest` vers un alias `/projects/[slug]/support` sans supprimer `/invest`.
5. Auditer les mocks conservant `Artisans Locaux` et décider la stratégie de compatibilité.
6. Isoler les règles BioDex unlock dans une fonction cible testable, sans suppression brutale du prototype.
7. Relancer `type-check`, `lint` et éventuellement un smoke test manuel après stabilisation de R1.
