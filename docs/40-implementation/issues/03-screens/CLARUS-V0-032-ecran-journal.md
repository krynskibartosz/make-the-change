# CLARUS-V0-032 - Ecran Journal

## Agent recommande
Screens

## Objectif
Afficher la liste chronologique des interventions.

## Contexte a lire
- `../../10-spec-v0-executable.md`

## Dependances
- CLARUS-V0-017
- CLARUS-V0-027

## Scope
- filtres rapides ;
- `InterventionCard` ;
- badges zone/phase/statut ;
- resume heures/montant ;
- lien detail intervention.

## Hors scope
- edition intervention ;
- recherche avancee.

## Fichiers probables
- `clarus-app/src/app/(tabs)/journal/page.tsx`
- `clarus-app/src/features/interventions/components/intervention-card.tsx`

## Criteres d'acceptation
- liste lisible ;
- `to_check` visible ;
- detail ouvrable.

## Tests / verification
- screenshot mobile ;
- `pnpm type-check`