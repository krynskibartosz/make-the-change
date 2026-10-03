# Infrastructure de développement multi-agent — Make-the-Change

Référence pour un développeur solo qui fait travailler plusieurs agents IA
(Devin, Claude Code, Codex, Cursor) en parallèle. Chaîne visée :

```text
Issue → worktree/agent → branche → PR → CI → merge main → production (Vercel)
```

Le dépôt jumeau Virdel porte le document de référence complet
(`docs/infrastructure-multi-agent.md`) ; celui-ci se limite à ce qui est
propre à Make-the-Change. Date de l'audit : 3 octobre 2026.

---

## 1. Audit de l'existant

### 1.1 Git et GitHub

| Élément | Constat |
| --- | --- |
| Dépôt | `krynskibartosz/make-the-change`, **public** |
| Branche par défaut | `main` ; dernier commit le 12 juin 2026 (dépôt dormant) |
| Branches distantes | 14 (`chantier-refonte`, `codex/*`, `feature/*`, `fix/*`, `imgbot`, `mia`) ; PR ouvertes #1 (ImgBot), #2, #4 — toutes antérieures à mai 2026 |
| Historique | poussées **directes** sur `main` (les dix derniers commits n'ont aucune PR associée) |
| Protection de `main` | aucune — mais **disponible dès maintenant** (dépôt public, les rulesets ne nécessitent pas GitHub Pro) |
| Fusion | squash, merge et rebase autorisés ; auto-merge désactivé ; suppression de branche après fusion désactivée |
| `.github` | `pull_request_template.md`, `ISSUE_TEMPLATE/` ; pas de `dependabot.yml`, pas de `CODEOWNERS` |

### 1.2 Workflows (`.github/workflows/`), tous sur `ubuntu-latest`

| Workflow | Déclencheurs | Jobs = noms des checks | Observations |
| --- | --- | --- | --- |
| `devex-quality-gate.yml` | PR (paths apps/packages/tools/…), manuel | `Critical Quality Checks`, `Advisory Marketing Color Guard` (continue-on-error) | guards + type-check + lint + tests core |
| `web-client-types-quality.yml` | PR (paths web-client, core/db), manuel | `quality` | type-check + lint web-client (**doublon** du gate), `tsc --noUncheckedIndexedAccess`, `ts:metrics:check`, `db:types:check` (**doublon** de `check`) |
| `supabase-types-check.yml` | PR (paths core/db), manuel | `check` | `db:types:check` contre le projet hébergé (secrets `SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_ID`) |
| `security-audit.yml` | PR, push `main`, manuel | `Secret Scan`, `Dependency Audit (high+)` | regex maison + `pnpm audit` |
| `lint-terms.yml` | PR | `lint-terms` | terminologie interdite ; cite `docs/GLOSSARY.md` (réel : `docs/10-reference-content/GLOSSARY.md`) |
| `e2e-nightly.yml` | cron 03:00 UTC, manuel | `Playwright smoke (non-blocking)` | pointe `playwright.base-ui-web-client.config.ts`, **absent du dépôt** ; pnpm 9 forcé vs `packageManager` 10.34.1 ; vert par `continue-on-error` |
| `copilot-setup-steps.yml` | push/PR sur lui-même, manuel | `copilot-setup-steps` | install + build |

Aucun bloc `concurrency` nulle part : chaque push d'un agent empile un run
complet. Aucun job ne déploie (Vercel passe par son app GitHub).

Checks réellement observés : dernier run de PR le 15 août 2026 (`lint-terms`,
plus `Vercel Preview Comments` émis par l'app Vercel) ; sur `main@6cd526b4`
tous les checks applicatifs sont **rouges** (`Critical Quality Checks`,
`quality`, `check`, `copilot-setup-steps`, `Dependency Audit (high+)`,
`lint-terms`) parce que `package.json` appelle `tools/*.mjs` et que le dossier
`tools/` **n'existe pas** dans le dépôt : `pnpm lint` et `pnpm type-check`
échouent dès la première ligne. Ce n'est pas un problème d'infrastructure
mais il interdit de rendre ces checks obligatoires tant qu'il n'est pas réglé.

### 1.3 Monorepo, Supabase, Vercel

- `pnpm-workspace.yaml` : `apps/web`, `apps/web-client`, `packages/core`
  (Turbo 2). `clarus/` et `clarus-app/` vivent à la racine **hors workspace**
  avec leurs propres lockfiles ; `apps/_legacy/` contient une sauvegarde.
- **Pas de `supabase/config.toml`, pas de migrations, pas de seed** : le
  schéma est décrit en Drizzle (`packages/core/src/shared/db/schema.ts`), les
  types sont générés depuis le projet hébergé `ebmjxinsyyjwshnynwwu` par
  `pnpm --filter @make-the-change/core db:types:generate` (CLI
  `supabase@2.76.7`). `deployment_guide.md` décrit un flux `supabase db push`
  qui ne correspond à rien dans le dépôt. Il n'existe donc **aucun** moyen de
  reconstruire la base localement ni de brancher une preview Supabase :
  c'est le premier chantier si ce projet reprend (voir § 4).
- Vercel : trois `vercel.json` divergents (racine : `builds` legacy +
  `outputDirectory: apps/web-client/.next` alors que `buildCommand` construit
  les deux apps ; `apps/web/vercel.json` ; `apps/web-client/vercel.json`). Les
  projets `make-the-change-web` et `make-the-change-web-client` qui déployaient
  en juin 2026 **n'existent plus** dans l'équipe Vercel Pro
  `bartek-krynskis-projects` (seul `virdel` y figure). Aucun déploiement en
  cours ; rien à configurer tant qu'ils ne sont pas recréés.
- Tests : vitest dans `packages/core` et `apps/web-client` ; aucun Playwright
  actif.
- Instructions agents : aucune (`AGENTS.md`, `CLAUDE.md`, `.cursorrules`
  absents). Ajouté par cette PR.

### 1.4 Secret exposé — action prioritaire

`apps/web-client/.env.vercel.production` était **commité** depuis le 27 mars
2026 (commit `ee5e8dac`) avec des valeurs réelles : `SUPABASE_SERVICE_ROLE_KEY`,
`DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `E2E_USER_PASSWORD`,
`VERCEL_OIDC_TOKEN`. Le dépôt est public : ces valeurs doivent être
considérées comme compromises. Cette PR retire le fichier du HEAD et ajoute
`.env.vercel*` et `.env*.production` à `.gitignore`, mais **l'historique Git
reste public** : la rotation est indispensable (décision du 3 octobre 2026 :
retrait maintenant, rotation reportée par Christophe — à faire dès que
possible, voir § 7).

### 1.5 Variables d'environnement (noms seulement)

| Variable | Scope | Nature |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_CLIENT_URL`, `NEXT_PUBLIC_ADMIN_URL`, `NEXT_PUBLIC_PARTNER_APP_BASE_URL`, `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Local / Preview / Production | publiques |
| `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`, `GEOAPIFY_API_KEY`, `ADMIN_EMAIL_ALLOWLIST`, `JWT_SECRET` | serveur uniquement, par scope | **secrets** — jamais `NEXT_PUBLIC_` (vérifié : aucun ne l'est) |
| `SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_ID` | secrets GitHub Actions | génération de types |
| `E2E_USER_EMAIL`, `E2E_USER_PASSWORD`, `E2E_LOCALE`, `PLAYWRIGHT_BASE_URL` | CI/local | tests |
| `EXPO_PUBLIC_*`, `VERCEL_PROJECT_ID`, `VERCEL_ORG_ID` | déclarées dans `.env.example` sans usage (plus d'app mobile) | à nettoyer |

Aucune dépendance `resend` ni `deepl` dans les `package.json` malgré
`RESEND_API_KEY` dans `.env.example`.

---

## 2. Stratégie Git

Identique à Virdel : `main` stable, branches `feat/ fix/ refactor/ chore/
docs/ codex/ claude/ devin/`, une PR par livraison, squash merge, pas de
`develop` ni de staging permanent, un worktree par agent et par sujet
(`git worktree add -b feat/<sujet> ../make-the-change-<sujet> origin/main`).

## 3. Protection de `main` — applicable immédiatement

Le dépôt est public : le ruleset s'applique sans GitHub Pro, via le même
script que Virdel (`scripts/proteger-main.sh`, copié ici) :

```bash
CHECKS_REQUIS="Secret Scan,lint-terms" bash scripts/proteger-main.sh krynskibartosz/make-the-change
```

Required checks retenus : **`Secret Scan`** et **`lint-terms`** — les seuls
qui passent aujourd'hui sur `main` et qui tournent sur toute PR. `Critical
Quality Checks` devient obligatoire dès que `tools/` est restauré (ou que les
scripts `guard:*` sont retirés de `package.json`) et qu'il repasse au vert.
Pas de revue obligatoire (développeur solo), pas de « branche à jour »
obligatoire, auto-merge activé, suppression de branche après fusion.

## 4. Supabase

Make-the-Change n'a ni projet local ni migrations versionnées : il n'y a rien
à isoler par worktree et aucune preview branch n'est possible. Décision :
**ne rien créer maintenant** (le projet est dormant ; une branche ou un
projet Supabase supplémentaire coûterait sans servir). Si le projet reprend,
l'ordre est : `supabase init` à la racine → `supabase db pull` depuis le
projet hébergé (lecture seule, génère la migration de base) → `seed.sql`
sans données réelles → brancher `supabase-types-check.yml` sur la pile locale
plutôt que sur le projet hébergé → ensuite seulement envisager les previews
opt-in du modèle Virdel.

## 5. Vercel

Aucun projet actif. Recette si les deux apps sont redéployées (deux projets,
un par app, dans l'équipe Pro) :

| Projet | Root Directory | Build Command | Framework |
| --- | --- | --- | --- |
| `make-the-change-web` | `apps/web` | `cd ../.. && pnpm turbo build --filter=@make-the-change/web` | Next.js |
| `make-the-change-web-client` | `apps/web-client` | `cd ../.. && pnpm turbo build --filter=@make-the-change/web-client` | Next.js |

Ignored Build Step : `npx turbo-ignore` dans chaque projet pour ne pas
reconstruire l'app non touchée. Le `vercel.json` racine (`builds` legacy,
`outputDirectory` fixé sur web-client) est alors à retirer. Variables par
scope (Production / Preview / Development) ; les secrets serveur du § 1.5
jamais en `NEXT_PUBLIC_`. Cette PR ne modifie pas les `vercel.json` : sans
projet Vercel existant, il n'y a rien à vérifier.

## 6. CI — modifications de cette PR

| Fichier | Changement |
| --- | --- |
| tous les workflows déclenchés par `pull_request` | `concurrency: { group: <workflow>-<PR ou ref>, cancel-in-progress: true sur PR }` — un agent qui pousse cinq fois ne laisse qu'un run vivant |
| `web-client-types-quality.yml` | retrait du type-check/lint générique et de `db:types:check`, déjà couverts par `Critical Quality Checks` et `check` ; garde `tsc --noUncheckedIndexedAccess` et `ts:metrics:check` |
| `e2e-nightly.yml` | pnpm lu depuis `packageManager` (plus de `version: 9`) ; reste advisory — le fichier de config Playwright qu'il invoque n'existe pas, à rétablir ou à supprimer (hors périmètre infra) |
| `lint-terms.yml` | chemin du glossaire corrigé dans le message |
| `.gitignore` | `.env.vercel*`, `.env*.production` |
| `apps/web-client/.env.vercel.production` | **supprimé** |
| `AGENTS.md` | nouveau, source unique pour tous les agents |
| `scripts/proteger-main.sh` | copie du script Virdel |

Aucun test ni garde-fou n'a été désactivé ; les checks rouges de `main` le
restent tant que `tools/` manque (hors périmètre de cette PR, voir § 7).

## 7. Actions manuelles

1. **Rotation des secrets exposés** (Supabase : service role et mot de passe
   DB du projet `ebmjxinsyyjwshnynwwu` ; compte E2E ; vérifier Stripe/Resend
   si ces clés ont transité par le même fichier). Tant que ce n'est pas fait,
   le risque est entier.
2. Appliquer le ruleset : commande du § 3 (fait par la mission si `gh` y
   était autorisé — voir le rapport final).
3. Décider du sort de `tools/` (restaurer les guards ou retirer les scripts
   `guard:*`), puis ajouter `Critical Quality Checks` aux required checks.
4. Si le projet reprend : § 4 (Supabase local) puis § 5 (Vercel).

## 8. Coûts

Aucun coût nouveau : pas de projet Supabase, pas de branche, pas de projet
Vercel créés. Les minutes GitHub Actions des runners `ubuntu-latest` sont
gratuites sur un dépôt public.
