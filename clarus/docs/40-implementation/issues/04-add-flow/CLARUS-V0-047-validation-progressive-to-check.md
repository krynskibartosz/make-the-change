# CLARUS-V0-047 - Validation progressive to_check

## Agent recommande
Add Flow

## Objectif
Permettre une saisie terrain incomplete sans casser la qualite data.

## Contexte a lire
- `../../10-spec-v0-executable.md`

## Dependances
- CLARUS-V0-011
- CLARUS-V0-046

## Scope
- logique `to_check` ;
- messages de validation courts ;
- sauvegarde autorisee si info non critique manque ;
- marquage visible dans summary.

## Hors scope
- workflow d'approbation complexe.

## Fichiers probables
- `clarus-app/src/features/interventions/add-flow/validation.ts`

## Criteres d'acceptation
- info manquante non critique ne bloque pas ;
- intervention incomplete visible `to_check` ;
- absence type/titre impossible bloque avec message clair.

## Tests / verification
- tests validation ;
- flow manuel incomplet ;
- `pnpm type-check`

