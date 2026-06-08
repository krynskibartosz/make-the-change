# CLARUS-V0-027 - SegmentedControl et filters

## Agent recommande
UI

## Objectif
Creer les filtres rapides reutilisables.

## Contexte a lire
- `../../10-spec-v0-executable.md`

## Dependances
- CLARUS-V0-024

## Scope
- `SegmentedControl` ;
- options scrollables si besoin ;
- etat actif ;
- accessibilite label.

## Hors scope
- logique de filtrage metier.

## Fichiers probables
- `clarus-app/src/components/ui/segmented-control.tsx`

## Criteres d'acceptation
- utilisable dans Journal/Couts/Detail ;
- touch target >= 44px ;
- actif visible sans couleur seule.

## Tests / verification
- `pnpm type-check`

