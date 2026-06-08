# CLARUS-V0-013 - Mocks interventions et work entries

## Agent recommande
Data

## Objectif
Creer des interventions realistes avec heures multi-personnes.

## Contexte a lire
- `../../10-spec-v0-executable.md`
- `../../../10-v0-planning/03-modele-data-mock-first.md`

## Dependances
- CLARUS-V0-012

## Scope
- 10 a 15 interventions ;
- 20 a 30 work entries ;
- cas complet, incomplet, supplement, paye, a verifier ;
- quelques taches/materiaux/depenses/photos liees.

## Hors scope
- upload photo reel ;
- persistence utilisateur.

## Fichiers probables
- `clarus-app/src/lib/mock/interventions.ts`
- `clarus-app/src/lib/mock/work-entries.ts`

## Criteres d'acceptation
- la demo raconte un vrai chantier ;
- les relations sont valides ;
- les cas `to_check` existent.

## Tests / verification
- test validation mocks ;
- `pnpm type-check`

