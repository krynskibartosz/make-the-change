import type { Database as GeneratedDatabase } from './database.generated'

type SchemaWithFunctions<TSchema> = TSchema extends {
  Tables: infer Tables
  Views: infer Views
  Enums: infer Enums
  CompositeTypes: infer CompositeTypes
}
  ? {
      Tables: Tables
      Views: Views
      Functions: Record<string, never>
      Enums: Enums
      CompositeTypes: CompositeTypes
    }
  : TSchema

export type Database = Omit<
  GeneratedDatabase,
  'commerce' | 'investment' | 'cms' | 'content' | 'identity'
> & {
  commerce: SchemaWithFunctions<GeneratedDatabase['commerce']>
  investment: SchemaWithFunctions<GeneratedDatabase['investment']>
  cms: SchemaWithFunctions<GeneratedDatabase['cms']>
  content: SchemaWithFunctions<GeneratedDatabase['content']>
  identity: SchemaWithFunctions<GeneratedDatabase['identity']>
}

export type { CompositeTypes, Enums, Json, Tables, TablesInsert, TablesUpdate } from './database.generated'

export const Constants = Object.freeze({})
