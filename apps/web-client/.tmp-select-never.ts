import type { Database } from '@make-the-change/core/database-types'
import type { QueryData, SupabaseClient } from '@supabase/supabase-js'

declare const supabase: SupabaseClient<Database>

const q1 = supabase.from('products').select('id,not_exists')
type R1 = QueryData<typeof q1>[number]
let r1!: R1
r1.id

const q2 = supabase.from('products').select('id,slug,')
type R2 = QueryData<typeof q2>[number]
let r2!: R2
r2.id
