# Supabase Integration - Make the CHANGE

 Scope: Auth, PostgreSQL, RLS, storage (optional), schema management.

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
- Drizzle schema is the source of truth (`packages/core/src/shared/db/schema.ts`).
- Drizzle config: `packages/core/drizzle.config.ts`.
- If SQL migrations are required, keep them co-located with the Drizzle workflow and document in `database-schema.md`.

## Observability
- Monitor slow queries; index usage; connection pool saturation.

## References
- `../database-schema.md`, `../services/*`.
