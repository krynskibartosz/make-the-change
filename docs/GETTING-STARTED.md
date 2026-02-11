# GETTING STARTED — Make the CHANGE (2026)

## Prérequis
- Node.js **>=20**
- pnpm **>=9**

## Installation
```bash
pnpm install
```

## Environnements
Copier et remplir :
- `.env.example`
- `apps/web/.env.example`
- `apps/web-client/.env.example`

## Démarrage (local)
```bash
pnpm dev
```

## Commandes qualité
```bash
pnpm lint
pnpm type-check
pnpm build
```

## Scope actif
- `apps/web`
- `apps/web-client`
- `packages/core`

## Règles DB
- **Source de vérité DB runtime** : MCP Supabase (toujours vérifier l’état réel en base via MCP avant toute décision technique).
- **Fichiers `.sql`** : interdits dans le repo (guard `pnpm guard:no-sql`).
- **Contrat applicatif** : `packages/core/src/shared/db/schema.ts` doit rester aligné avec la vérité observée via MCP.

## Sources techniques
- **Tokens UI** : `packages/core/src/shared/ui/globals.css`
- **Config Tailwind** : `packages/core/tailwind.config.ts`
- **Locales** : `packages/core/locales/*`

Dernière MAJ : **11 février 2026**
