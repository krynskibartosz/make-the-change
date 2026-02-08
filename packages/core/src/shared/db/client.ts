import 'server-only'
import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import postgres, { type Sql } from 'postgres'

// Import schema type only (not the actual schema object)
// Import schema and relations types
type Schema = typeof import('./schema') & typeof import('./relations')

// Singleton pattern for Next.js HMR
const globalForDb = globalThis as unknown as {
  conn: Sql | undefined
  db: PostgresJsDatabase<Schema> | undefined
}

function getConnectionString(): string {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL is not defined')
  }
  return connectionString
}

export function getClient(): Sql {
  if (!globalForDb.conn) {
    globalForDb.conn = postgres(getConnectionString(), { prepare: false })
  }
  return globalForDb.conn
}

export function getDb(): PostgresJsDatabase<Schema> {
  if (!globalForDb.db) {
    // Lazy load schema to avoid circular dependency
    const schema = require('./schema')
    const relations = require('./relations')
    globalForDb.db = drizzle(getClient(), { schema: { ...schema, ...relations } })
  }
  return globalForDb.db
}

// Legacy exports for backward compatibility (lazy initialization)
export const db = new Proxy({} as PostgresJsDatabase<Schema>, {
  get(_, prop) {
    return Reflect.get(getDb(), prop)
  },
})

export const client = new Proxy({} as Sql, {
  get(_, prop) {
    return Reflect.get(getClient(), prop)
  },
})
