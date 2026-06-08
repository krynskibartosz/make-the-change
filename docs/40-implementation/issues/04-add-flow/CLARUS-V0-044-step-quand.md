# CLARUS-V0-044 - Step Quand

## Agent recommande
Add Flow

## Objectif
Creer l'etape horaires, pause et jours.

## Contexte a lire
- `../../10-spec-v0-executable.md`

## Dependances
- CLARUS-V0-014
- CLARUS-V0-025
- CLARUS-V0-043

## Scope
- date par defaut aujourd'hui ;
- start/end time ;
- pause ;
- nombre de jours ;
- recalcul preview duree/montant.

## Hors scope
- calendrier complexe ;
- planning Gantt.

## Fichiers probables
- `clarus-app/src/features/interventions/add-flow/step-when.tsx`

## Criteres d'acceptation
- calcul preview correct ;
- horaires rapides utilisables ;
- erreurs visibles.

## Tests / verification
- tester 8h00 -> 18h30 ;
- `pnpm type-check`