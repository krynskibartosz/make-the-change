# CLARUS-V0-054 - Verification mobile screenshots

## Agent recommande
QA

## Objectif
Verifier la V0 dans un vrai viewport mobile.

## Contexte a lire
- `../../10-spec-v0-executable.md`
- `../../../20-ui-and-references/09-analyse-screens-mtc-pour-clarus.md`

## Dependances
- CLARUS-V0-031
- CLARUS-V0-032
- CLARUS-V0-033
- CLARUS-V0-034
- CLARUS-V0-046

## Scope
- ouvrir l'app mobile ;
- verifier 4 tabs ;
- verifier Ajouter intervention ;
- verifier detail intervention ;
- capturer au moins 4 screenshots.

## Hors scope
- redesign majeur.

## Fichiers probables
- `output/clarus-v0-screenshots/*`

## Criteres d'acceptation
- aucun overlap evident ;
- CTA visible ;
- navigation claire.

## Tests / verification
- Playwright/browser screenshot ;
- rapport court.