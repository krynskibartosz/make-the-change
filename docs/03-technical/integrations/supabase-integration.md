# Supabase Integration - Make the CHANGE

 Scope: Auth, PostgreSQL, RLS, storage (optional), schema management.

## Source of truth policy
- Source of truth for runtime DB state: **Supabase MCP**.
- Local SQL files are not used as truth and are forbidden in this repository.
- Application schema in code (`packages/core/src/shared/db/schema.ts`) must be aligned with what is observed in Supabase MCP.

## Auth
- Use supabase-js in Edge-safe mode (no session persistence); inject user JWT in headers for RLS.

## Database
- Extensions: uuid-ossp, postgis, pg_trgm.
- RLS enabled on sensitive tables; policies included in `../database-schema.md`.
- Triggers for points balance; materialized views for analytics.
- Scheduling: enable `pg_cron` for points accrual and view refresh (see `../services/job-scheduling.md`).
- Canonical schema: `packages/core/src/shared/db/schema.ts`

## Storage (optional)
- Media can use Supabase Storage or Vercel Blob; choose per cost/perf.

## Migrations
- Validate real DB structure first with Supabase MCP.
- Keep TypeScript schema/contracts aligned in `packages/core/src/shared/db/schema.ts`.
- Drizzle config: `packages/core/drizzle.config.ts`.

## Observability
- Monitor slow queries; index usage; connection pool saturation.

## References
- `../database-schema.md`, `../services/*`.
