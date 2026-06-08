# CLARUS-V0-010 - Types metier Clarus

## Agent recommande
Data

## Objectif
Creer les types metier minimum de la V0.

## Contexte a lire
- `../../10-spec-v0-executable.md`
- `../../../10-v0-planning/03-modele-data-mock-first.md`

## Dependances
- CLARUS-V0-003

## Scope
- `Project`, `Phase`, `Zone`, `Person` ;
- `Intervention`, `WorkEntry` ;
- `Task`, `Material`, `MaterialMovement`, `Expense`, `Photo` ;
- statuts normalises.

## Hors scope
- schemas Zod ;
- mocks ;
- UI.

## Fichiers probables
- `clarus-app/src/lib/domain/types.ts`

## Criteres d'acceptation
- tous les types V0 existent ;
- `projectId` est present ;
- aucun type ne depend de React.

## Tests / verification
- `pnpm type-check`