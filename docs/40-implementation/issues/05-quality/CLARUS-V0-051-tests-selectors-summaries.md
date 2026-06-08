# CLARUS-V0-051 - Tests selectors summaries

## Agent recommande
QA

## Objectif
Verifier les mappings vers Aujourd'hui et Couts.

## Contexte a lire
- `../../10-spec-v0-executable.md`

## Dependances
- CLARUS-V0-015
- CLARUS-V0-016

## Scope
- summary Aujourd'hui ;
- summary Couts ;
- regroupements ;
- alertes `to_check`.

## Hors scope
- screenshots.

## Fichiers probables
- `clarus-app/src/features/**/*.test.ts`

## Criteres d'acceptation
- resultats stables ;
- totaux corrects ;
- incomplete visible.

## Tests / verification
- `pnpm test`