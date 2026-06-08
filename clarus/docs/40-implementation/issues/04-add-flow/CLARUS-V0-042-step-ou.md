# CLARUS-V0-042 - Step Ou

## Agent recommande
Add Flow

## Objectif
Creer l'etape zone/phase.

## Contexte a lire
- `../../10-spec-v0-executable.md`

## Dependances
- CLARUS-V0-012
- CLARUS-V0-040

## Scope
- selection zone ;
- selection phase ;
- option `a definir` qui marque `to_check` ;
- choix rapides.

## Hors scope
- detail zone ;
- plan interactif.

## Fichiers probables
- `clarus-app/src/features/interventions/add-flow/step-where.tsx`

## Criteres d'acceptation
- zones/phases viennent du repository ;
- `a definir` fonctionne ;
- touch targets confortables.

## Tests / verification
- tester selection ;
- `pnpm type-check`

