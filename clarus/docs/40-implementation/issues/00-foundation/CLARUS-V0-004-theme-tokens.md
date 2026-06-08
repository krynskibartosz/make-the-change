# CLARUS-V0-004 - Theme tokens dark-first light-ready

## Agent recommande
Foundation

## Objectif
Poser les tokens Clarus Dark Terrain sans hardcoder les couleurs dans les composants metier.

## Contexte a lire
- `../../10-spec-v0-executable.md`
- `../../../30-decisions/07-design-system-et-decisions-avant-dev.md`

## Dependances
- CLARUS-V0-001

## Scope
- tokens CSS dark ;
- structure light-ready ;
- variables semantic colors ;
- base typography mobile.

## Hors scope
- toggle light/dark visible ;
- design complet des ecrans.

## Fichiers probables
- `clarus-app/src/app/globals.css`
- `clarus-app/src/styles/tokens.css`

## Criteres d'acceptation
- `primary` vaut `#B6F255` ;
- les statuts ont des tokens distincts ;
- les composants peuvent consommer des variables.

## Tests / verification
- verifier rendu local ;
- `pnpm type-check`

