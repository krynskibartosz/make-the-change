# CLARUS-V0-021 - Bottom navigation

## Agent recommande
UI

## Objectif
Creer la navigation principale Clarus.

## Contexte a lire
- `../../10-spec-v0-executable.md`

## Dependances
- CLARUS-V0-020

## Scope
- tabs `Aujourd'hui`, `Journal`, `Chantier`, `Couts` ;
- icones lucide ;
- etat actif lime ;
- safe-area bottom.

## Hors scope
- bouton Ajouter comme tab ;
- navigation desktop complexe.

## Fichiers probables
- `clarus-app/src/app/(tabs)/_components/bottom-nav.tsx`

## Criteres d'acceptation
- 4 tabs visibles ;
- label court ;
- touch target confortable.

## Tests / verification
- verifier mobile viewport ;
- `pnpm type-check`

