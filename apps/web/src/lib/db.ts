/**
 * Server-only database access via Drizzle (same source of truth as packages/core).
 * Use in API routes and Server Components; requires DATABASE_URL (direct Postgres).
 * @see docs/03-technical/drizzle-supabase-alignment.md
 */
import { getDb } from '@make-the-change/core/db'

export const db = getDb()
export { getDb }
