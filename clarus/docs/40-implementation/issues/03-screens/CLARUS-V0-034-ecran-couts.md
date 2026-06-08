# CLARUS-V0-034 - Ecran Couts

## Agent recommande
Screens

## Objectif
Afficher les couts principaux du chantier.

## Contexte a lire
- `../../10-spec-v0-executable.md`

## Dependances
- CLARUS-V0-016
- CLARUS-V0-026
- CLARUS-V0-027

## Scope
- metriques couts ;
- repartition par personne ;
- repartition par zone ;
- repartition par phase ;
- mise en evidence `a verifier`.

## Hors scope
- exports ;
- facture officielle.

## Fichiers probables
- `clarus-app/src/app/(tabs)/couts/page.tsx`
- `clarus-app/src/features/costs/*`

## Criteres d'acceptation
- montants lisibles ;
- totaux coherents avec tests ;
- UI mobile scannable.

## Tests / verification
- screenshot mobile ;
- `pnpm type-check`

