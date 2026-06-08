# Clarus App

Prototype mobile-first mock-first pour le chantier Sparrenlaan.

## Structure

```txt
src/      Application Next.js
docs/     Specs, backlog et issues locales Clarus
assets/   Captures Make the Change et plans chantier de reference
```

## Scripts

```bash
pnpm dev
pnpm lint
pnpm type-check
pnpm test
pnpm build
```

Le serveur local utilise le port `3002`.

## Decisions V0

- App standalone, hors workspace Make the Change.
- Next App Router, TypeScript strict, Biome, Vitest.
- Theme visible dark-first, light-ready via tokens.
- Donnees V0 mock-first; Supabase hors scope pour l'instant.

## Vercel

Framework: Next.js
Build command: `pnpm build`
Install command: `pnpm install`
