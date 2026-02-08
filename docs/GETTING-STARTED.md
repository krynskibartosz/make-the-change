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
- `apps/mobile/.env.example`

## Démarrage (local)
```bash
pnpm dev        # web + web-client + core
pnpm dev:all    # inclut mobile
```

## Commandes qualité
```bash
pnpm lint
pnpm type-check
pnpm build
```

## Sources de vérité
- **Schéma DB (Drizzle)** : `packages/core/src/shared/db/schema.ts`
- **Tokens UI** : `packages/core/src/shared/ui/globals.css`
- **Config Tailwind** : `packages/core/tailwind.config.ts`
- **Locales** : `packages/core/locales/*`

Dernière MAJ : **2 février 2026**
