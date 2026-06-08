# CLARUS-V0-033 - Ecran Chantier

## Agent recommande
Screens

## Objectif
Afficher zones, phases et resume chantier.

## Contexte a lire
- `../../10-spec-v0-executable.md`

## Dependances
- CLARUS-V0-012
- CLARUS-V0-026

## Scope
- zones principales ;
- phases principales ;
- personnes ;
- blocs legers taches/materiaux/photos ;
- section a verifier.

## Hors scope
- detail zone complet ;
- plan interactif.

## Fichiers probables
- `clarus-app/src/app/(tabs)/chantier/page.tsx`
- `clarus-app/src/features/project/*`

## Criteres d'acceptation
- chantier comprehensible ;
- pas de modules complets V1 ;
- liens vers interventions si disponibles.

## Tests / verification
- screenshot mobile ;
- `pnpm type-check`