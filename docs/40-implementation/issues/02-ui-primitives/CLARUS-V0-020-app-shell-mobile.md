# CLARUS-V0-020 - App shell mobile

## Agent recommande
UI

## Objectif
Creer les shells `TabScreen` et `Screen`.

## Contexte a lire
- `../../10-spec-v0-executable.md`
- `../../../20-ui-and-references/06-cartographie-composants-web-client-pour-clarus.md`

## Dependances
- CLARUS-V0-004

## Scope
- shell tabs mobile ;
- shell ecran secondaire ;
- safe-area ;
- scroll vertical stable ;
- padding bottom pour nav/CTA.

## Hors scope
- contenu des ecrans.

## Fichiers probables
- `clarus-app/src/app/(tabs)/_components/tab-screen.tsx`
- `clarus-app/src/app/(screens)/_components/screen.tsx`

## Criteres d'acceptation
- hauteur mobile correcte ;
- aucun chevauchement avec bottom nav ;
- API simple.

## Tests / verification
- rendu local ;
- `pnpm type-check`