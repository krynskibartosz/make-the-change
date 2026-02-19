import type { Database } from '@make-the-change/core/database-types'
import type { QueryData, SupabaseClient } from '@supabase/supabase-js'

declare const supabase: SupabaseClient<Database>

const q = supabase.from('public_products').select('id')
type R = QueryData<typeof q>[number]
let r!: R
r.id
