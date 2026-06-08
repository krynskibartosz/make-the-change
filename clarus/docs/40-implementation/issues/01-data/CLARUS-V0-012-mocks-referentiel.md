# CLARUS-V0-012 - Mocks Sparrenlaan referentiel

## Agent recommande
Data

## Objectif
Creer les mocks de base du chantier Sparrenlaan.

## Contexte a lire
- `../../10-spec-v0-executable.md`
- `../../../00-source-canvases/zones-phases-chantier.md`

## Dependances
- CLARUS-V0-010
- CLARUS-V0-011

## Scope
- 1 projet ;
- 5 personnes ;
- 9 phases ;
- 12 zones simples ;
- 5 zones techniques.

## Hors scope
- interventions ;
- work entries.

## Fichiers probables
- `clarus-app/src/lib/mock/project.ts`
- `clarus-app/src/lib/mock/referential.ts`

## Criteres d'acceptation
- donnees realistes Sparrenlaan ;
- ids stables ;
- validation Zod possible.

## Tests / verification
- test validation mocks ;
- `pnpm type-check`

