# CLARUS-V0-035 - Detail intervention

## Agent recommande
Screens

## Objectif
Creer l'ecran detail d'une intervention.

## Contexte a lire
- `../../10-spec-v0-executable.md`

## Dependances
- CLARUS-V0-017
- CLARUS-V0-023
- CLARUS-V0-027

## Scope
- route `interventions/[id]` ;
- sections `Apercu`, `Heures`, `Couts`, `Photos` ;
- work entries ;
- blocs taches/materiaux/depenses/photos legers.

## Hors scope
- edition complete ;
- upload photo reel.

## Fichiers probables
- `clarus-app/src/app/(screens)/interventions/[id]/page.tsx`
- `clarus-app/src/features/interventions/components/intervention-detail.tsx`

## Criteres d'acceptation
- detail accessible depuis Journal ;
- les heures/couts sont comprehensibles ;
- les infos incompletes sont visibles.

## Tests / verification
- screenshot mobile ;
- `pnpm type-check`