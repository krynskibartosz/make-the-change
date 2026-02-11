# Types TypeScript & Base de Données (2026)

## Règle principale

La vérité de la base de données est vérifiée via le MCP Supabase.

- Toujours valider l’état réel en base avec MCP Supabase.
- Ensuite seulement, aligner les types et schémas TypeScript.

## Contrat applicatif

Le contrat applicatif reste centralisé dans:
- `packages/core/src/shared/db/schema.ts`

Ce contrat doit refléter la réalité constatée via MCP Supabase.

## Types Supabase générés

La génération de types Supabase est optionnelle et ne remplace pas la vérification MCP:

```bash
supabase gen types typescript --project-id <PROJECT_ID> > /tmp/supabase-types.ts
```

## Politique SQL

- Aucun fichier `.sql` ne doit être versionné dans ce dépôt.
- Le guard `pnpm guard:no-sql` applique cette règle.
