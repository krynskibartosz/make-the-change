import { createClient } from '@/lib/supabase/server'
import { isRecord, asString, asNumber, asStringArray } from '@/lib/type-guards'
import type { 
  ProductContext, 
  SupportedProject, 
  LinkedSpecies, 
  ProductImpact 
} from '@/types/context'

const toNullableNumber = (value: unknown): number | null => {
  if (value === null || value === undefined) {
    return null
  }
  const parsed = asNumber(value, Number.NaN)
  return Number.isFinite(parsed) ? parsed : null
}

const toNullableString = (value: unknown): string | null => {
  if (value === null || value === undefined) return null
  const str = asString(value)
  return str === '' ? null : str
}

export async function getProductContext(id: string): Promise<ProductContext | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('v_product_context')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching product context:', error)
    return null
  }
  
  return mapProductContext(data)
}

function mapProductContext(data: unknown): ProductContext | null {
  if (!isRecord(data)) return null
  
  const id = asString(data.id)
  const name = asString(data.name_default)
  
  if (!id || !name) return null
  
  return {
    id,
    name_default: name,
    slug: asString(data.slug) || '',
    description_default: asString(data.description_default) || '',
    price_points: toNullableNumber(data.price_points),
    category: toNullableString(data.category),
    image_url: toNullableString(data.image_url),
    producer_name: asString(data.producer_name),
    producer_description: toNullableString(data.producer_description),
    producer_website: toNullableString(data.producer_website),
    supported_projects: mapArray(data.supported_projects, mapSupportedProject),
    linked_species: mapArray(data.linked_species, mapLinkedSpecies),
    impact: mapProductImpact(data.impact),
    
    // Additional fields
    stock_quantity: toNullableNumber(data.stock_quantity),
    fulfillment_method: toNullableString(data.fulfillment_method),
    impact_story: toNullableString(data.impact_story),
    biodex_compatibility: Boolean(data.biodex_compatibility),
    user_actions: data.user_actions
  }
}

function mapArray<T>(data: unknown, mapper: (item: unknown) => T | null): T[] {
  if (!Array.isArray(data)) return []
  return data.map(mapper).filter((item): item is T => item !== null)
}

function mapSupportedProject(data: unknown): SupportedProject | null {
  if (!isRecord(data)) return null
  
  const id = asString(data.id)
  const name = asString(data.name)
  
  if (!id || !name) return null
  
  return {
    id,
    name,
    impactPercentage: asNumber(data.impactPercentage),
    ecosystem: toNullableString(data.ecosystem),
    status: asString(data.status)
  }
}

function mapLinkedSpecies(data: unknown): LinkedSpecies | null {
  if (!isRecord(data)) return null
  
  const id = asString(data.id)
  const name = asString(data.name)
  
  if (!id || !name) return null
  
  return {
    id,
    name,
    icon: toNullableString(data.icon),
    relationship: asString(data.relationship),
    impact: toNullableString(data.impact)
  }
}

function mapProductImpact(data: unknown): ProductImpact | null {
  if (!isRecord(data)) return null
  
  const environmental = isRecord(data.environmental) ? data.environmental : {}
  const social = isRecord(data.social) ? data.social : {}
  const economic = isRecord(data.economic) ? data.economic : {}
  
  return {
    environmental: {
      co2Footprint: toNullableNumber(environmental.co2Footprint),
      waterUsage: toNullableNumber(environmental.waterUsage),
      biodiversityImpact: toNullableString(environmental.biodiversityImpact),
      recyclability: toNullableNumber(environmental.recyclability)
    },
    social: {
      localJobs: toNullableNumber(social.localJobs),
      fairTrade: Boolean(social.fairTrade),
      communitySupport: toNullableString(social.communitySupport)
    },
    economic: {
      localRevenue: toNullableNumber(economic.localRevenue),
      profitSharing: toNullableNumber(economic.profitSharing),
      pricePremium: toNullableNumber(economic.pricePremium)
    }
  }
}
