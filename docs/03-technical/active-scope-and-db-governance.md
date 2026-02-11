# Scope Actif & Gouvernance DB (2026)

## 1. Scope de développement actif

Les travaux actifs sont limités à:
- `apps/web`
- `apps/web-client`
- `packages/core`

Les dossiers ci-dessous sont gelés (pas de développement actif, pas de build/lint/type-check dans les commandes root):
- `apps/mobile`
- `apps/mobile-clean`
- `apps/mobile-sdk55`
- `apps/_legacy`

## 2. Règle de vérité base de données

La vérité de la base est toujours vérifiée via le MCP Supabase.

Règle obligatoire:
1. Vérifier l’état réel en base via MCP Supabase avant toute modification de logique DB.
2. Considérer le code (Drizzle/types/docs) comme contrat applicatif à réaligner si l’état réel diffère.
3. Ne pas se baser sur des fichiers SQL locaux comme source de vérité.

## 3. Politique fichiers SQL

- Les fichiers `.sql` sont interdits dans ce repo.
- Le guard `pnpm guard:no-sql` bloque leur présence.

## 4. Workflow recommandé

1. Interroger MCP Supabase pour confirmer la structure réelle.
2. Aligner ensuite le code TypeScript (`packages/core`) et les usages `apps/web*`.
3. Documenter les décisions techniques dans `docs/03-technical/`.
