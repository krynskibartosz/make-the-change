# Clarus

Clarus est le dossier de preparation du projet **Clarus Chantier - Sparrenlaan**.

Objectif court terme : creer une V0 mobile mock-first, inspiree de `apps/web-client`, pour valider l'UX de suivi de chantier avant Supabase, offline, auth ou multi-chantier.

## Lecture recommandee

1. `docs/10-v0-planning/00-synthese-produit.md`
2. `docs/30-decisions/08-recherche-web-decisions-avant-developpement.md`
3. `docs/20-ui-and-references/09-analyse-screens-mtc-pour-clarus.md`
4. `docs/10-v0-planning/02-architecture-technique-clarus.md`
5. `docs/10-v0-planning/03-modele-data-mock-first.md`
6. `docs/10-v0-planning/04-ux-mobile-v0-v1.md`
7. `docs/10-v0-planning/05-roadmap-developpement.md`

## Structure

```txt
clarus/
  README.md
  assets/
    mtc-screens/
    plan/
  docs/
    00-source-canvases/
    10-v0-planning/
    20-ui-and-references/
    30-decisions/
    40-implementation/
```

## Decisions actuelles

- V0 centree sur le chantier Sparrenlaan.
- Prototype mock-first, pret pour remplacement futur par Supabase.
- App standalone, pas de monorepo Clarus complexe au demarrage.
- UI mobile dark-first, light-ready via tokens.
- Identite couleur V0 : **Clarus Dark Terrain** avec lime MTC comme accent principal.
- Tabs principales : `Aujourd'hui`, `Journal`, `Chantier`, `Couts`.
- `Ajouter intervention` est une action globale, pas une tab.
- Taches, materiaux, depenses et photos existent dans les mocks/details, mais pas comme modules complets en V0.

## Prochaine etape

Avant de lancer le developpement, preparer :

- `docs/40-implementation/10-spec-v0-executable.md`
- `docs/40-implementation/11-backlog-v0.md`
- `docs/40-implementation/12-agent-workflow.md`
- `docs/40-implementation/issues/`

Ces fichiers transforment les decisions en tickets executables par agent.
