# CLARUS-V0-031 - Ecran Aujourd'hui

## Agent recommande
Screens

## Objectif
Implementer le hub operationnel.

## Contexte a lire
- `../../10-spec-v0-executable.md`

## Dependances
- CLARUS-V0-015
- CLARUS-V0-020
- CLARUS-V0-022
- CLARUS-V0-026

## Scope
- titre chantier/date ;
- metriques ;
- dernieres interventions ;
- section `A verifier` ;
- CTA `+ Ajouter intervention`.

## Hors scope
- wizard Ajouter intervention.

## Fichiers probables
- `clarus-app/src/app/(tabs)/aujourd-hui/page.tsx`
- `clarus-app/src/features/dashboard/*`

## Criteres d'acceptation
- donnees du repository affichees ;
- CTA visible ;
- pas de chevauchement mobile.

## Tests / verification
- screenshot mobile ;
- `pnpm type-check`