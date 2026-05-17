# Rapport de refactoring — Phase R9

Date : 2026-05-17

Portee : corrections navigation post-R8, alignement semantique monnaies (Graines / Credits Impact), corrections complementaires R9b.

---

## Contexte

Apres R8 (2026-05-08), la navigation a ete restructuree (Collectif/Impact → Apprendre/Learn, /products → /advantages) sans mise a jour documentaire. R9 corrige cet ecart et aligne les semantiques monnaies dans les mocks.

---

## R9 — Correction navigation et alignement semantique monnaies

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

| Ecart | Statut |
|---|---|
| Navigation Collectif/Impact → Apprendre/Learn | `[FERME_R9]` |
| Route `/products` → `/advantages` | `[FERME_R9]` |
| `impactDelta` incoherent pour challenges/engagement | `[FERME_R9]` |
| `impactCreditsBalance` == `totalSeedsContributed` (deux monnaies confondues) | `[FERME_R9]` |
| `monthly_points_allocation` mal classifie comme Credits Impact | `[FERME_R9]` |
| IDs mock `mock-investment-*` → `mock-support-*` | `[FERME_R9]` |

---

## R9b — Corrections complementaires (2026-05-17)

### Fichiers code modifies

- `src/lib/mock/mock-ids.ts` — `MOCK_TRIBE_DIRECTORY` : entree `ocean-guardians` ajoutee (oubli migration R7 : faction `Gardiens des mers` ajoutee dans `FACTION_TO_TRIBE_ID` sans creer la tribu correspondante).
- `src/lib/mock/mock-member-data.ts` — `getMockImpactPoints` renomme en `getMockImpactCreditsBalance` (retourne uniquement les Credits Impact du soutien producteur).
- `src/lib/mock/mock-member-data-server.ts` — `getCurrentMockImpactPoints` renomme en `getCurrentMockImpactCreditsBalance`.
- `src/lib/mock/mock-viewer.ts` — import mis a jour.
- `src/lib/mock/mock-session-server.ts` — import et usage mis a jour.
- `src/app/[locale]/@modal/(.)products/balance/balance-modal-content.tsx` — import dynamique mis a jour.
- `src/app/[locale]/(screens)/challenges/_features/challenges-tab-header.tsx` — remplace `getMockImpactPoints` par `getMockWalletBalance` : l'icone Seeds dans l'en-tete des challenges affiche le portefeuille Graines, pas les Credits Impact.

### Fichiers code modifies (correction build post-R9b, 2026-05-17)

- `src/app/[locale]/(tabs)/advantages/page.tsx` — `getCurrentMockImpactPoints` → `getCurrentMockImpactCreditsBalance` (import + appel).
- `src/app/[locale]/(tabs)/adventure/page.tsx` — `getCurrentMockImpactPoints` → `getCurrentMockImpactCreditsBalance` (import + appel).
- `src/app/[locale]/(screens)/products/products-client.tsx` — `getCurrentMockImpactPoints` → `getCurrentMockImpactCreditsBalance` (import dynamique + appel).

### Fichiers documentation mis a jour (R9b)

- `_current/00-CONTEXTE-COMMUN.md` — tableau modules corrige : `Collectif / Impact` marque `[LEGACY]`, `Apprendre /learn` et `Avantages /advantages` ajoutes avec routes reelles.
- `_current/02-ETAT-ACTUEL-CODE.md` — section "Zones hybrides et legacy restantes" ajoutee : `points_balance` Supabase, profils publics `totalSeedsContributed`, `returns_received_points`.

### Ecarts fermes (R9b)

| Ecart | Statut |
|---|---|
| Bug tribu `ocean-guardians` manquante | `[FERME_R9b]` |
| `getMockImpactPoints` affichee comme Seeds dans l'UI challenges | `[FERME_R9b]` |
| Module Collectif/Impact absent du tableau 00 | `[FERME_R9b]` |
| Zones hybrides restantes documentees (non modifiees, correctement) | `[DOCUMENTE_R9b]` |
| Build cassé : `getCurrentMockImpactPoints` non renomme dans 3 fichiers consommateurs | `[FERME_R9b]` |

---

## Statut apres R9/R9b

Type-check : 0 erreur attendu apres correction build.

Ecarts ouverts restants : voir `CODE-VS-DOC.md` Top 10 et `04-QUESTIONS-OUVERTES.md` P1/P2.
