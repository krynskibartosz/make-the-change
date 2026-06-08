# CLARUS-V0-046 - Step Resume et sauvegarde mock draft

## Agent recommande
Add Flow

## Objectif
Afficher le resume calcule et sauvegarder via repository.

## Contexte a lire
- `../../10-spec-v0-executable.md`

## Dependances
- CLARUS-V0-017
- CLARUS-V0-041
- CLARUS-V0-042
- CLARUS-V0-043
- CLARUS-V0-044
- CLARUS-V0-045

## Scope
- resume zone/phase/personnes/heures/montant/statut ;
- appel `createInterventionDraft` ;
- feedback sauvegarde ;
- retour vers Journal ou detail.

## Hors scope
- persistence serveur.

## Fichiers probables
- `clarus-app/src/features/interventions/add-flow/step-summary.tsx`

## Criteres d'acceptation
- resume lisible ;
- sauvegarde mock fonctionne ;
- l'intervention apparait ensuite dans les vues.

## Tests / verification
- tester flow complet ;
- `pnpm type-check`