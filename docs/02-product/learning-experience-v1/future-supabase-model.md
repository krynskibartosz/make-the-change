# Futur modèle Supabase

La v1 reste locale en TypeScript pour accélérer l’itération produit. La structure est pensée pour migrer vers Supabase sans refonte des écrans.

## Tables cibles

`learning_courses`

- `id`
- `source_id`
- `title`
- `subtitle`
- `domain`
- `theme`
- `subject`
- `level`
- `duration_minutes`
- `entry_kind`
- `entry_href`
- `access_policy`
- `created_at`
- `updated_at`

`learning_course_concepts`

- `course_id`
- `concept_id`

`learning_course_tags`

- `course_id`
- `tag`

`learning_course_relations`

- `course_id`
- `relation_type` : `project`, `species`, `ecosystem`, `node`, `recommended_after`
- `target_id`

`learning_paths`

- `id`
- `title`
- `subtitle`
- `description`
- `level`
- `duration_minutes`
- `primary_href`
- `is_academy_primary`

`learning_path_courses`

- `path_id`
- `course_id`
- `position`

`learning_progress`

- `viewer_id`
- `completed_course_ids`
- `completed_lesson_ids_by_course`
- `last_course_id`
- `updated_at`

## Migration recommandée

1. Garder les selectors comme façade produit.
2. Remplacer `catalog.ts` par un adaptateur Supabase côté serveur.
3. Garder le même shape renvoyé aux pages.
4. Migrer ensuite `progress.ts` vers une table utilisateur synchronisée, tout en conservant la clé localStorage comme cache/offline léger.
