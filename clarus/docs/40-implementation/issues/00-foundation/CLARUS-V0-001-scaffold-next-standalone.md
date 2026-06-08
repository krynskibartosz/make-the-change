# CLARUS-V0-001 - Scaffold Next standalone

## Agent recommande
Foundation

## Objectif
Creer l'app Clarus standalone avec Next App Router.

## Contexte a lire
- `../../10-spec-v0-executable.md`
- `../../12-agent-workflow.md`

## Dependances
Aucune.

## Scope
- creer `clarus-app/` ;
- installer Next, React, TypeScript ;
- configurer App Router ;
- creer une page racine minimale.

## Hors scope
- UI detaillee ;
- mocks ;
- Supabase ;
- auth.

## Fichiers probables
- `clarus-app/package.json`
- `clarus-app/src/app/layout.tsx`
- `clarus-app/src/app/page.tsx`

## Criteres d'acceptation
- l'app demarre en local ;
- la page racine affiche une base Clarus ;
- le projet est standalone.

## Tests / verification
- lancer le dev server ;
- ouvrir la page racine.