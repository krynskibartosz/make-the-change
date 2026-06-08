# CLARUS-V0-014 - Calculs heures et montants

## Agent recommande
Data

## Objectif
Implementer les calculs purs de duree et montant.

## Contexte a lire
- `../../10-spec-v0-executable.md`

## Dependances
- CLARUS-V0-010

## Scope
- `calculateWorkEntryDuration` ;
- `calculateWorkEntryAmount` ;
- gestion pause ;
- gestion multi-jours ;
- taux horaire 45 EUR/h par defaut dans les inputs/mocks.

## Hors scope
- rendu UI ;
- arrondis comptables complexes.

## Fichiers probables
- `clarus-app/src/lib/calculations/work.ts`
- `clarus-app/src/lib/calculations/work.test.ts`

## Criteres d'acceptation
- 8h00 -> 18h30 fonctionne ;
- pause definie fonctionne ;
- multi-jours fonctionne ;
- montant calcule correctement.

## Tests / verification
- `pnpm test -- work`

