# Codex Rules - Make the Change

## Scope
Monorepo TypeScript/Next.js (`apps/web`, `apps/web-client`, `packages/core`).

## Non-Negotiables
1. Never expose secrets in code, prompts, logs, or commits.
2. Validate all external input at boundaries (Zod first where applicable).
3. Prefer immutable updates and explicit error handling.
4. Keep files focused; avoid oversized modules.
5. Before declaring done: type-check + lint + tests for impacted scope.
6. For risky changes: run `security-reviewer` prompt + `verify-loop` prompt.

## Stack-Specific
- Package manager: `pnpm`
- Workspace focus: `@make-the-change/web`, `@make-the-change/web-client`, `@make-the-change/core`
- Core commands:
  - `pnpm --filter @make-the-change/core test`
  - `pnpm --filter @make-the-change/web type-check`
  - `pnpm --filter @make-the-change/web-client type-check`
  - `pnpm --filter @make-the-change/web lint`
  - `pnpm --filter @make-the-change/web-client lint`

## Workflow
1. Planner mode for non-trivial tasks.
2. TDD-runner mode for new behavior and bug fixes.
3. Security-reviewer mode for auth/payment/input/db changes.
4. Verify-loop mode before PR/merge.

## Existing Project Conventions
- TypeScript/React conventions for `web-client` live in `/apps/web-client/TYPESCRIPT_REACT_CONVENTIONS.md`.
- Existing repository guards (`guard:no-sql`, `guard:ui`, color guard) remain in force unless explicitly scoped as advisory.

## Review Output Standard
- Findings first, ordered by severity.
- Include file + line references.
- Distinguish: critical/high/medium/low.
- If no findings, state residual risks and testing gaps.

## Codex Limitations and Workarounds
- No native hooks/subagents/slash commands.
- Workaround: use prompt templates in `.codex/commands` and memory files in `.codex/memory`.

## Security Incident Handling
If any credential is discovered in repository history or tracked files:
1. Revoke/rotate it immediately in provider dashboards.
2. Replace with environment variable references.
3. Add a follow-up check in CI (`security-audit` workflow).
