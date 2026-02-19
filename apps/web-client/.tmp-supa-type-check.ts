import type { Database } from '@make-the-change/core/database-types'
import type { QueryData, SupabaseClient } from '@supabase/supabase-js'

declare const supabase: SupabaseClient<Database>

const qPublic = supabase
  .from('products')
  .select('id,slug,name_default,short_description_default,price_points,price_eur_equivalent,stock_quantity,featured,fulfillment_method,metadata,images,tags')

type PublicRow = QueryData<typeof qPublic>[number]

const qCommerce = supabase
  .schema('commerce')
  .from('products')
  .select('id,slug,name_default,short_description_default,price_points,price_eur_equivalent,stock_quantity,featured,fulfillment_method,metadata,images,tags')

type CommerceRow = QueryData<typeof qCommerce>[number]

let a!: PublicRow
let b!: CommerceRow

a.id
b.id
