# CLARUS-V0-030 - Route tabs et redirection racine

## Agent recommande
Screens

## Objectif
Creer les routes principales V0 et la redirection racine.

## Contexte a lire
- `../../10-spec-v0-executable.md`

## Dependances
- CLARUS-V0-020
- CLARUS-V0-021

## Scope
- `(tabs)/layout.tsx` ;
- pages `aujourd-hui`, `journal`, `chantier`, `couts` ;
- redirection `/` vers `aujourd-hui`.

## Hors scope
- contenu complet des pages.

## Fichiers probables
- `clarus-app/src/app/(tabs)/*`
- `clarus-app/src/app/page.tsx`

## Criteres d'acceptation
- 4 routes accessibles ;
- bottom nav presente ;
- route racine claire.

## Tests / verification
- ouvrir les 4 routes ;
- `pnpm type-check`

