# CLARUS-V0-003 - Structure dossiers

## Agent recommande
Foundation

## Objectif
Creer l'arborescence cible pour que les agents suivants travaillent dans des zones stables.

## Contexte a lire
- `../../10-spec-v0-executable.md`
- `../../12-agent-workflow.md`

## Dependances
- CLARUS-V0-001

## Scope
- creer `src/app`, `src/components/ui`, `src/features`, `src/lib` ;
- creer les sous-dossiers V0 ;
- ajouter fichiers placeholder minimaux si necessaire.

## Hors scope
- implementation des ecrans ;
- implementation des calculs.

## Fichiers probables
- `clarus-app/src/features/*`
- `clarus-app/src/lib/*`
- `clarus-app/src/components/ui/*`

## Criteres d'acceptation
- l'arborescence correspond a la spec ;
- les dossiers sont nommes en anglais code-friendly ;
- aucun dossier inutile V1/V2 n'est cree.

## Tests / verification
- `pnpm type-check`

