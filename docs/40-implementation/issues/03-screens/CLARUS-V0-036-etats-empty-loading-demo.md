# CLARUS-V0-036 - Etats empty loading demo

## Agent recommande
Screens

## Objectif
Prevoir les etats simples pour eviter les ecrans cassants.

## Contexte a lire
- `../../10-spec-v0-executable.md`

## Dependances
- CLARUS-V0-031
- CLARUS-V0-032
- CLARUS-V0-033
- CLARUS-V0-034

## Scope
- empty state ;
- loading/skeleton simple ;
- erreurs repository ;
- labels mode demo si utile.

## Hors scope
- observability ;
- systeme d'erreur serveur.

## Fichiers probables
- `clarus-app/src/components/ui/empty-state.tsx`
- `clarus-app/src/components/ui/skeleton.tsx`

## Criteres d'acceptation
- aucune liste vide n'est confuse ;
- les erreurs restent comprehensibles ;
- pas de faux scope V1.

## Tests / verification
- verifier etats manuellement ;
- `pnpm type-check`