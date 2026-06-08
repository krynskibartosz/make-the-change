# CLARUS-V0-050 - Tests calculs metier

## Agent recommande
QA

## Objectif
Verifier tous les calculs critiques.

## Contexte a lire
- `../../10-spec-v0-executable.md`

## Dependances
- CLARUS-V0-014

## Scope
- duree simple ;
- pause ;
- multi-jours ;
- multi-personnes ;
- montant 45 EUR/h.

## Hors scope
- tests UI.

## Fichiers probables
- `clarus-app/src/lib/calculations/*.test.ts`

## Criteres d'acceptation
- cas obligatoires couverts ;
- tests lisibles ;
- pas d'arrondi ambigu.

## Tests / verification
- `pnpm test`