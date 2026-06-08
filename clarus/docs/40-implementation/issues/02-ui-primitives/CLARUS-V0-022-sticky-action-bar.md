# CLARUS-V0-022 - Sticky action bar

## Agent recommande
UI

## Objectif
Creer le CTA bas fixe pour actions principales.

## Contexte a lire
- `../../10-spec-v0-executable.md`

## Dependances
- CLARUS-V0-004

## Scope
- `StickyActionBar` ;
- bouton principal 56px ;
- safe-area ;
- support label + icon.

## Hors scope
- logique metier sauvegarde.

## Fichiers probables
- `clarus-app/src/components/ui/sticky-action-bar.tsx`

## Criteres d'acceptation
- ne cache pas le contenu critique ;
- CTA lime lisible ;
- utilisable dans tabs et modals.

## Tests / verification
- rendu mobile ;
- `pnpm type-check`

