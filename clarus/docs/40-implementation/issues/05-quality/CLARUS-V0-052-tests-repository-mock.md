# CLARUS-V0-052 - Tests repository mock

## Agent recommande
QA

## Objectif
Verifier que l'UI peut utiliser les repositories sans importer les mocks.

## Contexte a lire
- `../../10-spec-v0-executable.md`

## Dependances
- CLARUS-V0-017

## Scope
- appels repository principaux ;
- `getInterventionById` ;
- `createInterventionDraft` ;
- validation data source mock.

## Hors scope
- Supabase.

## Fichiers probables
- `clarus-app/src/lib/repositories/*.test.ts`

## Criteres d'acceptation
- signatures testees ;
- pas d'import direct mock dans screens ;
- draft cree visible.

## Tests / verification
- `pnpm test`
- recherche imports mock dans `src/app` et `src/features`

