# AGENTS.md

Contexte pour les agents (Claude Code le lit via l'import `@AGENTS.md` dans
`CLAUDE.md` ; Codex, Devin et les autres le lisent directement ici — une
seule source, jamais deux copies à tenir synchronisées). Les décisions
d'infrastructure sont dans
[`docs/infrastructure-multi-agent.md`](docs/infrastructure-multi-agent.md).

## Ce que fait ce projet

Make the Change est une plateforme d'investissement biodiversité avec
récompenses tangibles — monorepo pnpm + Turbo, Next.js 16, Supabase, Stripe,
Biome.

## Structure

- `apps/web` (`@make-the-change/web`) — app Next.js principale (port 3000).
- `apps/web-client` (`@make-the-change/web-client`) — app Next.js (port 3001,
  Stripe, vitest).
- `packages/core` (`@make-the-change/core`) — domaine, schéma Drizzle, types
  Supabase générés, tests vitest.
- `clarus/` et `clarus-app/` — apps Next.js **hors workspace** (leurs propres
  lockfiles) ; ne pas les inclure dans les commandes du monorepo.
- `apps/_legacy/` — gelé, ne pas toucher.

Seuls `apps/web`, `apps/web-client` et `packages/core` sont dans
`pnpm-workspace.yaml`.

## Commandes

```bash
pnpm install
pnpm dev                                  # turbo dev, les deux apps
pnpm --filter @make-the-change/core test  # vitest du package touché
pnpm --filter @make-the-change/web-client test
pnpm lint / pnpm type-check
```

`pnpm lint` et `pnpm type-check` racine échouent **aujourd'hui** : ils
enchaînent les scripts `guard:*` qui appellent `tools/*.mjs`, un dossier
absent du dépôt. C'est un état connu — ne pas « réparer » en désactivant
les guards ; utiliser `pnpm --filter <pkg> lint` ou `biome check` en attendant
la décision sur `tools/`. Le lint effectif est `biome check` par package.

## Supabase

Pas de Supabase local : le schéma vit en Drizzle dans
`packages/core/src/shared/db/schema.ts` ; les types sont régénérés depuis le
projet hébergé par `pnpm --filter @make-the-change/core db:types:generate`
(exige `SUPABASE_ACCESS_TOKEN` et `SUPABASE_PROJECT_ID` dans
l'environnement). Jamais de valeur de production dans le dépôt.

## Règles de sécurité

- Aucun fichier `.env*` commité, sauf `*.env.example` — un
  `.env.vercel.production` avec des secrets réels a déjà fuité dans ce
  dépôt **public** (rotation en cours, voir la doc § 7).
- Aucun secret serveur préfixé `NEXT_PUBLIC_` ou `EXPO_PUBLIC_`
  (`SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`,
  `RESEND_API_KEY` restent côté serveur).

## Stratégie Git

- `main` stable ; **jamais de travail ni de push direct sur `main`** — une
  PR est l'unité de livraison, fusion en squash.
- Préfixes de branches : `feat/ fix/ refactor/ chore/ docs/ codex/ claude/
  devin/`.
- Un sujet = un worktree = une branche :

  ```bash
  git worktree add -b <prefixe>/<sujet> ../make-the-change-<sujet> origin/main
  ```

## Avant d'ouvrir une PR

- Tests du package touché (`pnpm --filter … test`) ; la CI rejoue
  type-check, lint et audits sur la PR.
- Vocabulaire conforme à `docs/10-reference-content/GLOSSARY.md` — le check
  `lint-terms` refuse les termes interdits dans les fichiers modifiés.
- Remplir `.github/pull_request_template.md`.

## Avant de fusionner

- Checks **`Secret Scan`** et **`lint-terms`** verts (required checks du
  ruleset `main-protegee`, appliqué par
  `CHECKS_REQUIS="Secret Scan,lint-terms" bash scripts/proteger-main.sh
  krynskibartosz/make-the-change`).
