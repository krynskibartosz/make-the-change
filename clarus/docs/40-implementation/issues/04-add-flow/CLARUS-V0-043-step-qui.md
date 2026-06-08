# CLARUS-V0-043 - Step Qui

## Agent recommande
Add Flow

## Objectif
Creer l'etape personnes et work entries.

## Contexte a lire
- `../../10-spec-v0-executable.md`

## Dependances
- CLARUS-V0-012
- CLARUS-V0-040

## Scope
- picker personnes ;
- multi-selection ;
- taux par defaut par personne ;
- preparation work entries.

## Hors scope
- gestion equipe avancee.

## Fichiers probables
- `clarus-app/src/features/interventions/add-flow/step-who.tsx`

## Criteres d'acceptation
- plusieurs personnes selectionnables ;
- taux par defaut visible ou applique ;
- selection claire.

## Tests / verification
- tester multi-select ;
- `pnpm type-check`

