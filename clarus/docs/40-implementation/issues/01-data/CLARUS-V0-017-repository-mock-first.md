# CLARUS-V0-017 - Repository mock-first

## Agent recommande
Data

## Objectif
Exposer les donnees V0 via repository, sans import direct des mocks par l'UI.

## Contexte a lire
- `../../10-spec-v0-executable.md`
- `../../../10-v0-planning/02-architecture-technique-clarus.md`

## Dependances
- CLARUS-V0-012
- CLARUS-V0-013
- CLARUS-V0-015
- CLARUS-V0-016

## Scope
- `getProject` ;
- `getPeople`, `getPhases`, `getZones` ;
- `getInterventions`, `getInterventionById` ;
- `getWorkEntries` ;
- `getTodaySummary` ;
- `createInterventionDraft`.

## Hors scope
- Supabase implementation ;
- persistence reelle.

## Fichiers probables
- `clarus-app/src/lib/repositories/clarus-repository.ts`
- `clarus-app/src/lib/repositories/mock-clarus-repository.ts`

## Criteres d'acceptation
- signatures conformes a la spec ;
- les composants peuvent consommer le repository ;
- `mock` est la seule source supportee.

## Tests / verification
- tests repository mock ;
- `pnpm type-check`

