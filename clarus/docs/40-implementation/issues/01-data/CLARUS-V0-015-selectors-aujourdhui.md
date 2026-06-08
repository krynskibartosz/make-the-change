# CLARUS-V0-015 - Selectors summaries Aujourd'hui

## Agent recommande
Data

## Objectif
Creer les view models de l'ecran Aujourd'hui.

## Contexte a lire
- `../../10-spec-v0-executable.md`

## Dependances
- CLARUS-V0-013
- CLARUS-V0-014

## Scope
- summary date du jour ;
- metriques interventions/heures/montant/a verifier ;
- dernieres interventions ;
- alertes.

## Hors scope
- UI de l'ecran ;
- navigation.

## Fichiers probables
- `clarus-app/src/features/dashboard/selectors.ts`
- `clarus-app/src/features/dashboard/selectors.test.ts`

## Criteres d'acceptation
- selector pur ;
- resultat stable avec mocks ;
- donnees incompletes remontees.

## Tests / verification
- tests selector Aujourd'hui ;
- `pnpm type-check`

