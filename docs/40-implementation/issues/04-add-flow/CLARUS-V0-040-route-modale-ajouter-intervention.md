# CLARUS-V0-040 - Route modale Ajouter intervention

## Agent recommande
Add Flow

## Objectif
Creer la route modale du flow Ajouter intervention.

## Contexte a lire
- `../../10-spec-v0-executable.md`

## Dependances
- CLARUS-V0-023
- CLARUS-V0-017

## Scope
- route `@modal/(.)interventions/new` ;
- ouverture depuis CTA ;
- fermeture retour ;
- shell flow.

## Hors scope
- steps complets.

## Fichiers probables
- `clarus-app/src/app/@modal/(.)interventions/new/page.tsx`
- `clarus-app/src/features/interventions/add-flow/*`

## Criteres d'acceptation
- le CTA ouvre la modale ;
- la modale ferme proprement ;
- pas de tab Ajouter.

## Tests / verification
- tester navigation mobile ;
- `pnpm type-check`