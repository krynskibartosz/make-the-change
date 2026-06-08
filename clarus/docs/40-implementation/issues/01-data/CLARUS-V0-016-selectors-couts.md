# CLARUS-V0-016 - Selectors summaries Couts

## Agent recommande
Data

## Objectif
Creer les view models de l'ecran Couts.

## Contexte a lire
- `../../10-spec-v0-executable.md`

## Dependances
- CLARUS-V0-013
- CLARUS-V0-014

## Scope
- total heures ;
- total main d'oeuvre ;
- total a verifier ;
- total supplement ;
- repartitions par personne, zone, phase.

## Hors scope
- exports ;
- facturation officielle.

## Fichiers probables
- `clarus-app/src/features/costs/selectors.ts`
- `clarus-app/src/features/costs/selectors.test.ts`

## Criteres d'acceptation
- totaux exacts ;
- regroupements lisibles ;
- cas `to_check` visible.

## Tests / verification
- tests selector Couts ;
- `pnpm type-check`