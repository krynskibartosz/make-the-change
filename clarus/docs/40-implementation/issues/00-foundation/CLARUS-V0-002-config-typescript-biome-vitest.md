# CLARUS-V0-002 - Config TypeScript Biome Vitest

## Agent recommande
Foundation

## Objectif
Configurer le tooling strict pour eviter une dette inutile des le depart.

## Contexte a lire
- `../../10-spec-v0-executable.md`

## Dependances
- CLARUS-V0-001

## Scope
- TypeScript strict ;
- `noUncheckedIndexedAccess` ;
- `verbatimModuleSyntax` ;
- Biome ;
- Vitest ;
- scripts `lint`, `type-check`, `test`.

## Hors scope
- tests metier complets ;
- configuration CI.

## Fichiers probables
- `clarus-app/tsconfig.json`
- `clarus-app/biome.json`
- `clarus-app/vitest.config.ts`
- `clarus-app/package.json`

## Criteres d'acceptation
- les scripts existent ;
- `any` est evite ;
- la config ne masque pas les erreurs de build.

## Tests / verification
- `pnpm type-check`
- `pnpm lint`
- `pnpm test`