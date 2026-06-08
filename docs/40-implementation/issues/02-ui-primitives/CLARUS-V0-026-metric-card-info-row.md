# CLARUS-V0-026 - MetricCard et InfoRow

## Agent recommande
UI

## Objectif
Creer les composants generiques pour dashboards et details.

## Contexte a lire
- `../../10-spec-v0-executable.md`
- `../../../20-ui-and-references/09-analyse-screens-mtc-pour-clarus.md`

## Dependances
- CLARUS-V0-024

## Scope
- `MetricCard` ;
- `InfoRow` ;
- support icone ;
- support valeur numerique tabulaire ;
- labels courts.

## Hors scope
- calculs metier.

## Fichiers probables
- `clarus-app/src/components/ui/metric-card.tsx`
- `clarus-app/src/components/ui/info-row.tsx`

## Criteres d'acceptation
- lisible en mobile ;
- fonctionne pour heures et montants ;
- API generique.

## Tests / verification
- `pnpm type-check`