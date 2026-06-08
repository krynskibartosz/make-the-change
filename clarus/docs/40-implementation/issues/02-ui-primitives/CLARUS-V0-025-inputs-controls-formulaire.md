# CLARUS-V0-025 - Inputs et controls formulaire

## Agent recommande
UI

## Objectif
Creer les controls necessaires au flow Ajouter intervention.

## Contexte a lire
- `../../10-spec-v0-executable.md`

## Dependances
- CLARUS-V0-024

## Scope
- `Input` ;
- `Textarea` ;
- `Select` ou equivalent simple ;
- `NumberStepper` ;
- labels visibles ;
- etats erreur/help.

## Hors scope
- validation metier ;
- sauvegarde.

## Fichiers probables
- `clarus-app/src/components/ui/input.tsx`
- `clarus-app/src/components/ui/textarea.tsx`
- `clarus-app/src/components/ui/number-stepper.tsx`

## Criteres d'acceptation
- labels visibles ;
- hauteur mobile correcte ;
- pas de placeholder comme label unique.

## Tests / verification
- `pnpm type-check`