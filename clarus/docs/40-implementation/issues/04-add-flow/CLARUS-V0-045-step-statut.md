# CLARUS-V0-045 - Step Statut

## Agent recommande
Add Flow

## Objectif
Creer l'etape statuts chantier/financier.

## Contexte a lire
- `../../10-spec-v0-executable.md`

## Dependances
- CLARUS-V0-011
- CLARUS-V0-027

## Scope
- inclus chantier ;
- supplement ;
- a verifier ;
- a facturer ;
- paye ;
- non concerne.

## Hors scope
- facture officielle ;
- TVA.

## Fichiers probables
- `clarus-app/src/features/interventions/add-flow/step-status.tsx`

## Criteres d'acceptation
- statut lisible avec label ;
- `to_check` possible ;
- couleur non seule porteuse d'information.

## Tests / verification
- tester choix statuts ;
- `pnpm type-check`