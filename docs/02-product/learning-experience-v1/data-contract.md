# Contrat de données Learning

## Source locale

Le registre local vit dans `apps/web-client/src/lib/learning/`.

- `schema.ts` : types et validation Zod.
- `catalog.ts` : cours, domaines Atlas, parcours et liens produit.
- `selectors.ts` : fonctions pures pour les vues.
- `progress.ts` : progression locale `mtc_learning_progress_v1`.

`mtc_learning_progress_v1` est volontairement séparé de `mtc_academy_progress_v1`.

## LearningCourse

Champs obligatoires :

- `id`
- `title`
- `subtitle`
- `domain`
- `theme`
- `subject`
- `conceptIds`
- `level`
- `durationMinutes`
- `tags`
- `entry.kind`
- `entry.href`
- `relatedProjectSlugs`
- `relatedSpeciesIds`
- `relatedEcosystemIds`
- `relatedNodeIds`
- `recommendedAfterCourseIds`
- `accessPolicy`

`entry.kind` vaut :

- `academy_unit`
- `project_experience`
- `living_web`

`accessPolicy` vaut :

- `available`
- `recommended_after`
- `support_unlock_enrichment`

## Domaines Atlas

Les six domaines stables sont :

- `alphabet-du-vivant`
- `milieux-habitats`
- `relations-du-vivant`
- `menaces`
- `solutions`
- `lire-impact`

Tout cours doit appartenir à l’un de ces domaines. Les tests vérifient que chaque unité Academy V2 est mappée dans le catalogue Learning.
