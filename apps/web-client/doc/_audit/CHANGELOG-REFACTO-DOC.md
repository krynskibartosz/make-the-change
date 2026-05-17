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

## R9 — Correction navigation post-R8 + alignement semantique monnaies (2026-05-17)

### Contexte

Apres R8, la navigation a ete restructuree sans mise a jour documentaire. Cette passe corrige l'ecart entre documentation et code reel.

### Fichiers code modifies

- `src/lib/mock/mock-member-data.ts`
  - `MockSubscriptionRecord.monthly_points_allocation` renomme en `monthly_seeds_allocation` (allocation d'abonnement = Graines, pas Credits Impact).
  - `impactDelta` corrige dans `EXISTING_VIEWER_POINTS_TRANSACTIONS` : seuls les soutiens producteurs ont `impactDelta > 0`. Bonus de bienvenue, allocations abonnement, eco-fact, daily-harvest, parrainage, streak passent a `impactDelta: 0`.
  - `impactDelta` corrige dans `STARTER_POINTS_TRANSACTIONS` : bonus de depart passe a `impactDelta: 0`.
  - IDs support renommes : `mock-investment-antsirabe` → `mock-support-antsirabe`, `mock-investment-manakara` → `mock-support-manakara`.
  - IDs transactions renommes : `mock-points-investment-manakara` → `mock-points-support-manakara`, `mock-points-investment-antsirabe` → `mock-points-support-antsirabe`.

- `src/lib/mock/mock-challenge-progress-server.ts`
  - `impactDelta: challenge.reward` → `impactDelta: 0` : les defis donnent des Graines (`delta`), pas de Credits Impact.

- `src/lib/mock/mock-viewer.ts`
  - `EXISTING_VIEWER_PROFILE.impactCreditsBalance` : 2450 → 1175 (780 Manakara + 395 Antsirabe — soutien producteur uniquement).
  - `EXISTING_VIEWER_PROFILE.totalSeedsContributed` : 2450 → 1280 (Graines d'engagement : bienvenue + defis + parrainage + streak).
  - Profil generique starter : `impactCreditsBalance: 120` → 0 (aucun soutien producteur pour un nouveau membre) ; `totalSeedsContributed` reste 120 (Graines de bienvenue).

- `src/lib/mappers/producer-support-adapters.ts`
  - Commentaire `monthly_points_allocation` → `monthly_seeds_allocation` avec classification `[GRAINES_CLAIR]`.
  - Commentaire `impactDelta` precise : Credits Impact soutien producteur uniquement, vaut 0 sinon.

### Fichiers documentation mis a jour

- `_current/01-PRODUIT-ET-EXPERIENCE.md` — tableau navigation corrige (Apprendre/learn, Avantages/advantages) ; section Collectif/Impact marquee `[LEGACY]`.
- `_current/02-ETAT-ACTUEL-CODE.md` — tableau tabs corrige ; statut `points` precise (R8 partiel) ; section "Transactions et monnaies dans les mocks" ajoutee.
- `_current/03-DECISIONS-VALIDEES.md` — decision navigation mise a jour (Apprendre/learn, /advantages).
- `_current/99-GLOSSAIRE-LEXIQUE.md` — route `/products` → `/advantages` dans Avantages et routes cibles.
- `_audit/CODE-VS-DOC.md` — section navigation entierement mise a jour ; ecart #2 rebaptise `[PARTIELLEMENT_TRAITE_R8]`.

### Ecarts fermes (R9)

- Navigation Collectif/Impact → Apprendre/Learn : `[FERME_R9]`.
- Route `/products` → `/advantages` : `[FERME_R9]`.
- `impactDelta` incohérent pour challenges/engagement : `[FERME_R9]`.
- `impactCreditsBalance` == `totalSeedsContributed` (deux monnaies confondues) : `[FERME_R9]`.
- `monthly_points_allocation` mal classifie comme Credits Impact : `[FERME_R9]`.
- IDs mock `mock-investment-*` → `mock-support-*` : `[FERME_R9]`.

### Rapport detaille

Voir analyse dans la conversation du 2026-05-17.

### R9b — Corrections complementaires (2026-05-17)

Fichiers code :

- `src/lib/mock/mock-ids.ts` — `MOCK_TRIBE_DIRECTORY` : entree `ocean-guardians` ajoutee (oubli de la migration R7 qui avait ajoute la faction `Gardiens des mers` dans `FACTION_TO_TRIBE_ID` sans creer la tribu correspondante).
- `src/lib/mock/mock-member-data.ts` — `getMockImpactPoints` renomme en `getMockImpactCreditsBalance` pour refleter sa semantique reelle (retourne uniquement les Credits Impact du soutien producteur).
- `src/lib/mock/mock-member-data-server.ts` — `getCurrentMockImpactPoints` renomme en `getCurrentMockImpactCreditsBalance`.
- `src/lib/mock/mock-viewer.ts` — import mis a jour.
- `src/lib/mock/mock-session-server.ts` — import et usage mis a jour.
- `src/app/[locale]/@modal/(.)products/balance/balance-modal-content.tsx` — import dynamique mis a jour.
- `src/app/[locale]/(screens)/challenges/_features/challenges-tab-header.tsx` — remplace `getMockImpactPoints` par `getMockWalletBalance` : l'icone Seeds dans l'en-tete des challenges affiche le portefeuille Graines, pas les Credits Impact.

Fichiers documentation :

- `_current/00-CONTEXTE-COMMUN.md` — tableau modules corrige : `Collectif / Impact` marque `[LEGACY]`, `Apprendre /learn` et `Avantages /advantages` ajoutes avec routes reelles.
- `_current/02-ETAT-ACTUEL-CODE.md` — section "Zones hybrides et legacy restantes" ajoutee : `points_balance` Supabase, profils publics `totalSeedsContributed`, `returns_received_points`.

Ecarts fermes (R9b) :

- Bug tribu `ocean-guardians` manquante : `[FERME_R9b]`.
- `getMockImpactPoints` affichee comme Seeds dans l'UI challenges : `[FERME_R9b]`.
- Module Collectif/Impact absent du tableau 00 : `[FERME_R9b]`.
- Zones hybrides restantes documentees mais non modifiees (correctement) : `[DOCUMENTE_R9b]`.

---

## Passe finale de consolidation (2026-05-08)

### Documentation mise a jour

- `_current/00-CONTEXTE-COMMUN.md` — `Artisans Locaux` marque `[PURGE_R7]`.
- `_current/02-ETAT-ACTUEL-CODE.md` — tableau termes legacy mis a jour : R7/R8 refletes.
- `_current/11-TECHNIQUE-DATA.md` — `wallet/points` → `wallet / impactCreditsBalance`.
- `_audit/CODE-VS-DOC.md` — ecarts #2 et #3 marques fermes, #10 partiellement traite.

### Statut global

Phases R1 a R8 completees. Type-check : 0 erreur. Lint : 556 erreurs pre-existantes CRLF (non introduites). Prochaines etapes P2/P3 documentees dans `REFACTORING-FINAL-CONSOLIDATION-REPORT.md`.
