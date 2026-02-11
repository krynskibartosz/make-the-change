# Marketing Theme Token Map

This document defines the canonical mapping used to migrate marketing pages from hardcoded palette classes to shared core tokens.

## Source of truth
- Core tokens: `packages/core/src/shared/ui/globals.css`
- Scope: `apps/web-client/src/app/[locale]/(marketing)`

## Base token contract
- `--marketing-surface-strong`
- `--marketing-surface-elevated`
- `--marketing-positive`
- `--marketing-info`
- `--marketing-warning`
- `--marketing-accent-alt`
- `--marketing-gradient-mid`
- `--marketing-overlay-light`
- `--marketing-overlay-dark`

Tailwind-facing aliases are exposed via `@theme`:
- `--color-marketing-*`

## Migration mapping
- `emerald-*` -> `marketing-positive-*`
- `green-*` -> `marketing-positive-*`
- `blue-*` -> `marketing-info-*`
- `orange-*` -> `marketing-warning-*`
- `amber-*` -> `marketing-warning-*`
- `purple-*` -> `marketing-accent-alt-*`
- `rose-*` and `pink-*` -> `marketing-accent-alt-*`
- `teal-*` -> `marketing-gradient-mid-*`
- `slate-*` -> `marketing-neutral-*`
- `#0A1A14` -> `marketing-surface-strong`
- `#1A2E26` -> `marketing-surface-elevated`
- `#030712` and `slate-950` -> `marketing-surface-strong`
- `white/black overlays` -> `marketing-overlay-light` / `marketing-overlay-dark`

## Guardrails
- Script: `tools/guard-no-hardcoded-marketing-colors.mjs`
- Enforced in root scripts:
  - `pnpm lint`
  - `pnpm type-check`
- Disallowed in marketing source:
  - Hex/RGB/HSL numeric literals
  - Inline style colors (`style={{ backgroundColor|color|boxShadow|borderColor }}`)
  - Tailwind fixed palette class families
