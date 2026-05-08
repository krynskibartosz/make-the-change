# Changelog de refonte documentaire

Date : 2026-05-07

Portee : `apps/web-client/doc` uniquement.

## Version initiale de refonte

### Ajoute

- Creation d'une nouvelle structure documentaire a cote des anciens fichiers.
- Creation des rapports d'audit dans `_audit`.
- Creation d'un index `README.md` pour humains et IA.
- Separation des sujets : contexte, produit, code actuel, decisions, questions, business, go-to-market, impact, design, gamification, BioDex, technique/data, lexique.
- Ajout d'une convention de statuts sans accents : `[ACTUEL_CODE]`, `[CIBLE_VALIDEE]`, `[HYPOTHESE]`, `[A_TESTER]`, `[A_DECIDER]`, `[A_VERIFIER_CODE]`, `[DEPRECIE]`, `[RISQUE]`.

### Non modifie

- Aucun fichier applicatif React, TypeScript, Supabase, Stripe, mocks ou routes n'a ete modifie.
- Le dossier racine `docs/` n'a pas ete modifie.
- Les anciens fichiers `01-...` a `10-...` dans `apps/web-client/doc` sont laisses en place.
- Aucun ancien document n'a ete supprime.
- Aucun ancien document n'a ete archive.

### Ecarts explicitement integres

- `investment` reste present dans le code.
- `points` reste present comme vocabulaire technique.
- `Artisans Locaux` reste present dans des mocks et flows.
- Academy est documentee differemment selon les sources ; le code actuel est priorise.
- BioDex contient une exception prototype de deblocage.
- Don et soutien producteur ne sont pas encore parfaitement separes dans les modeles.
- Stripe/paiement est partiel.
- Supabase est partiel et cohabite avec les mocks.
- De nombreux textes restent hardcodes ; i18n partiel.

### Decisions de refonte

- `[CIBLE_VALIDEE]` La nouvelle documentation devient le point d'entree recommande.
- `[CIBLE_VALIDEE]` Les anciens documents restent consultables comme sources historiques.
- `[CIBLE_VALIDEE]` Les fichiers sont nommes sans accents pour limiter les problemes Git, Windows et liens Markdown.
- `[CIBLE_VALIDEE]` Aucune hypothese n'est transformee en decision.

### A faire apres validation utilisateur

- Reprendre chaque question P0 une par une avec le porteur du projet.
- Mettre a jour les fichiers de reference selon les reponses.
- Eventuellement archiver les anciens fichiers dans une etape separee, uniquement apres accord explicite.
- Plus tard, aligner le code sur le vocabulaire cible si une decision produit le demande.

---

## R7 — Purge Artisans Locaux (2026-05-08)

### Fichiers code modifies

- `src/lib/mock/types.ts` — `Faction` type : `Artisans Locaux` retire, `Gardiens des mers` ajoute.
- `src/lib/mock/mock-ids.ts` — `FACTION_TO_TRIBE_ID` ramene a 3 entrees.
- `src/lib/mock/mock-viewer.ts` — profils `citoyen-anonyme` et `marie-claire-b` migres vers `Gardiens des mers`.
- `src/lib/mock/mock-session.ts` — branche `artisans locaux` supprimee, branche `gardiens des mers` ajoutee.
- `src/app/[locale]/(tabs)/impact/_lib/mock-seasons.ts` — 3 instances `Artisans Locaux` remplacees, prestige-3 renomme "Halo des Abysses".
- `src/app/[locale]/(auth)/actions.ts` — faction check inclut desormais `Gardiens des mers`.

### Ecarts fermes

- Ecart #3 du CODE-VS-DOC : `Artisans Locaux` encore present dans le TypeScript — `[FERME_R7]`.

### Rapport detaille

Voir `REFACTORING-PHASE-R7-REPORT.md`.

---

## R8 — Profile.points → impactCreditsBalance (2026-05-08)

### Fichiers code modifies

- `src/lib/mock/types.ts` — `Profile.points` renomme `Profile.impactCreditsBalance`.
- `src/lib/mock/mock-viewer.ts` — 15+ occurrences de `points:` → `impactCreditsBalance:` dans EXISTING_VIEWER_PROFILE, PUBLIC_PROFILE_DIRECTORY (8 entrees), buildGenericProfile, getMockProfile, getMockPublicProfile.
- `src/lib/mock/mock-session-server.ts` — correction oubliee R8 : `points:` → `impactCreditsBalance:` ligne 58.
- `src/app/[locale]/(tabs)/profile/_features/authenticated-profile.tsx` — `profile?.points` → `profile?.impactCreditsBalance`.
- `src/app/[locale]/(screens)/profile/[id]/mock-public-profile.tsx` — `profile.points` → `profile.impactCreditsBalance`.
- `src/app/[locale]/(site)/(home)/_api/home.view-model.ts` — `formatPoints` → `formatImpactCredits`.
- `src/app/[locale]/@modal/(.)products/balance/balance-modal-content.tsx` — vars locales `points` → `balance`.
- `src/app/[locale]/(tabs)/products/products-client.tsx` — vars locales `userPoints` → `userImpactCredits`.

### Corrections semantiques incluses

- `src/app/[locale]/(screens)/profile/[id]/page.tsx` — `formatImpactCredits(levelProgress.nextMin - impactScore)` corrige en `formatPoints(...)` : l'ecart de score/XP n'est pas des Credits Impact.
- `src/app/[locale]/(screens)/profile/investments/_features/transaction-receipt.tsx` — tag `[HYPOTHESE]` retire de l'UI visible, label `Impact a valider` → `Suivi terrain a venir`.
- `src/app/[locale]/(tabs)/adventure/_features/adventure-tab.tsx` — `"Aucune quete pour aujourd'hui"` → `"Aucune mission pour aujourd'hui"`.
- `src/app/[locale]/(tabs)/impact/_features/impact-tab-client.tsx` — claim fort `A protege 3 especes menacees` → `A signale 3 zones sensibles liees a des especes menacees`.

### Ecarts fermes

- Ecart #2 du CODE-VS-DOC : `points` dominant dans TypeScript — `[FERME_R8]` cote mocks.
- Ecart #10 du CODE-VS-DOC : wording impact — `[PARTIELLEMENT_TRAITE]`.

### Rapport detaille

Voir `REFACTORING-PHASE-R8-POINTS-WALLET-REPORT.md` et `REFACTORING-FINAL-CONSOLIDATION-REPORT.md`.

---

## Passe finale de consolidation (2026-05-08)

### Documentation mise a jour

- `_current/00-CONTEXTE-COMMUN.md` — `Artisans Locaux` marque `[PURGE_R7]`.
- `_current/02-ETAT-ACTUEL-CODE.md` — tableau termes legacy mis a jour : R7/R8 refletes.
- `_current/11-TECHNIQUE-DATA.md` — `wallet/points` → `wallet / impactCreditsBalance`.
- `_audit/CODE-VS-DOC.md` — ecarts #2 et #3 marques fermes, #10 partiellement traite.

### Statut global

Phases R1 a R8 completees. Type-check : 0 erreur. Lint : 556 erreurs pre-existantes CRLF (non introduites). Prochaines etapes P2/P3 documentees dans `REFACTORING-FINAL-CONSOLIDATION-REPORT.md`.
