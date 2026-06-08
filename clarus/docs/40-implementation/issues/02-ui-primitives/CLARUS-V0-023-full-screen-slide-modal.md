# CLARUS-V0-023 - Full screen slide modal

## Agent recommande
UI

## Objectif
Creer le pattern modal plein ecran pour les flows.

## Contexte a lire
- `../../10-spec-v0-executable.md`
- `../../../20-ui-and-references/06-cartographie-composants-web-client-pour-clarus.md`

## Dependances
- CLARUS-V0-020

## Scope
- modal fullscreen ;
- header back/close ;
- fallback href ;
- `asPage` si necessaire ;
- safe-area.

## Hors scope
- animation complexe ;
- routes Add Flow.

## Fichiers probables
- `clarus-app/src/app/@modal/_components/full-screen-slide-modal.tsx`
- `clarus-app/src/app/@modal/_components/intercepted-route-dialog.tsx`

## Criteres d'acceptation
- fonctionne comme page ou modal ;
- fermeture fiable ;
- header lisible.

## Tests / verification
- route test minimale ;
- `pnpm type-check`

