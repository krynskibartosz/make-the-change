import { createClient } from '@/lib/supabase/server'
import { isRecord, asString, asNumber, asStringArray } from '@/lib/type-guards'
import type { 
  ProjectContext, 
  ProjectSpecies, 
  ProjectChallenge, 
  ProducerProduct, 
  ProjectImpact 
} from '@/types/context'

export async function getProjectContext(slug: string): Promise<ProjectContext | null> {
  const supabase = await createClient()
  
  // Note: We are using the 'investment' schema, but Supabase client usually defaults to 'public'.
  // We might need to specify the schema if the view is not exposed in public.
  // Assuming the view is exposed or we can access it. If it's in a schema, we might need to use .schema('investment')
  // However, usually views are created in public or exposed via public.
  // The prompt says "investment.v_project_context", so let's try to query it.
  // If the view is in 'investment' schema and not public, we need to access it differently or it might be exposed as 'v_project_context' in public.
  // I will assume it is accessible as 'v_project_context' for now, or I'll try to find if I can specify schema.
  
  const { data, error } = await supabase
    .from('v_project_context') 
    .select('*')
    .eq('slug', slug)
    .single()
  
  if (error) {
    console.error('Error fetching project context:', error)
    return null
  }
  
  return mapProjectContext(data)
}

function mapProjectContext(data: unknown): ProjectContext | null {
  if (!isRecord(data)) return null
  
  const id = asString(data.id)
  const name = asString(data.name_default)
  
  if (!id || !name) return null
  
  return {
    id,
    name_default: name,
    slug: asString(data.slug) || '',
    description_default: asString(data.description_default) || '',
    status: asString(data.status) || '',
    type: asString(data.type) || '',
    producer_name: asString(data.producer_name) || '',
    producer_website: asString(data.producer_website),
    producer_city: asString(data.producer_city),
    producer_country: asString(data.producer_country),
    species: mapArray(data.species, mapProjectSpecies),
    challenges: mapArray(data.challenges, mapProjectChallenge),
    producer_products: mapArray(data.producer_products, mapProducerProduct),
    expected_impact: mapProjectImpact(data.expected_impact),
    
    // Additional fields mapping
    hero_image_url: asString(data.hero_image_url),
    images: asStringArray(data.images),
    address_city: asString(data.address_city),
    address_country_code: asString(data.address_country_code),
    current_funding: asNumber(data.current_funding),
    target_budget: asNumber(data.target_budget)
  }
}

function mapArray<T>(data: unknown, mapper: (item: unknown) => T | null): T[] {
  if (!Array.isArray(data)) return []
  return data.map(mapper).filter((item): item is T => item !== null)
}

function mapProjectSpecies(data: unknown): ProjectSpecies | null {
  if (!isRecord(data)) return null
  
  const id = asString(data.id)
  const name = asString(data.name)
  
  if (!id || !name) return null
  
  return {
    id,
    name,
    scientificName: asString(data.scientificName) || '',
    icon: asString(data.icon),
    rarity: asNumber(data.rarity) || 0,
    status: asString(data.status) || '',
    role: asString(data.role) || ''
  }
}

function mapProjectChallenge(data: unknown): ProjectChallenge | null {
  if (!isRecord(data)) return null
  
  const id = asString(data.id)
  const name = asString(data.name)
  
  if (!id || !name) return null
  
  return {
    id,
    name,
    type: asString(data.type) || '',
    difficulty: asString(data.difficulty) || '',
    userParticipation: Boolean(data.userParticipation),
    rewards: Array.isArray(data.rewards) ? data.rewards : []
  }
}

function mapProducerProduct(data: unknown): ProducerProduct | null {
  if (!isRecord(data)) return null
  
  const id = asString(data.id)
  const name = asString(data.name)
  
  if (!id || !name) return null
  
  return {
    id,
    name,
    price: asNumber(data.price) || 0,
    category: asString(data.category) || '',
    impactPercentage: asNumber(data.impactPercentage) || 0,
    image_url: asString(data.image_url)
  }
}

function mapProjectImpact(data: unknown): ProjectImpact | null {
  if (!isRecord(data)) return null
  
  return {
    co2Absorbed: asNumber(data.co2Absorbed),
    biodiversityGain: asNumber(data.biodiversityGain),
    jobsCreated: asNumber(data.jobsCreated),
    timeline: asNumber(data.timeline)
  }
}
