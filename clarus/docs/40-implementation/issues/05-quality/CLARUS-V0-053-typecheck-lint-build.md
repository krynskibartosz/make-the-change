# CLARUS-V0-053 - Type-check lint build

## Agent recommande
QA

## Objectif
Valider le socle technique complet.

## Contexte a lire
- `../../10-spec-v0-executable.md`

## Dependances
- toutes les issues implementation selon avancement.

## Scope
- type-check ;
- lint ;
- test ;
- build.

## Hors scope
- correction produit hors scope.

## Fichiers probables
- selon erreurs detectees.

## Criteres d'acceptation
- commandes passent ;
- aucune erreur masquee par config ;
- corrections limitees au scope.

## Tests / verification
- `pnpm type-check`
- `pnpm lint`
- `pnpm test`
- `pnpm build`

