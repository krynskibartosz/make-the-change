# CLARUS-V0-011 - Schemas Zod mocks et inputs

## Agent recommande
Data

## Objectif
Valider les mocks et les inputs sensibles avec Zod.

## Contexte a lire
- `../../10-spec-v0-executable.md`

## Dependances
- CLARUS-V0-010

## Scope
- schemas pour statuts ;
- schemas pour mocks principaux ;
- schema `CreateInterventionDraftInput` ;
- helper de validation.

## Hors scope
- formulaires UI ;
- Supabase.

## Fichiers probables
- `clarus-app/src/lib/schemas/*`

## Criteres d'acceptation
- les schemas couvrent les types critiques ;
- une info manquante peut devenir `to_check` quand c'est terrain-compatible ;
- les erreurs sont lisibles.

## Tests / verification
- tests schemas ;
- `pnpm type-check`