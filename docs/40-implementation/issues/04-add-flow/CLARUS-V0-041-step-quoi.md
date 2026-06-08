# CLARUS-V0-041 - Step Quoi

## Agent recommande
Add Flow

## Objectif
Creer la premiere etape du wizard : type/titre d'intervention.

## Contexte a lire
- `../../10-spec-v0-executable.md`

## Dependances
- CLARUS-V0-040
- CLARUS-V0-025

## Scope
- choix rapides : demolition, evacuation, protection, structure, achat, tache, autre ;
- titre derive ou editable ;
- note optionnelle.

## Hors scope
- calcul heures ;
- sauvegarde finale.

## Fichiers probables
- `clarus-app/src/features/interventions/add-flow/step-what.tsx`

## Criteres d'acceptation
- choix en moins de quelques secondes ;
- label visible ;
- pas de texte long obligatoire.

## Tests / verification
- tester le step mobile ;
- `pnpm type-check`