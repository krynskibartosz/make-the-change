import { createClient } from '@/lib/supabase/server'
import { isRecord, asString, asNumber } from '@/lib/type-guards'
import type { 
  PostContext, 
  SourceBadge, 
  LinkedEntity, 
  PostEngagement, 
  UserPostState,
  PostFilters 
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

export async function getPostContext(id: string): Promise<PostContext | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('v_post_context')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching post context:', error)
    return null
  }
  
  return mapPostContext(data)
}

export async function getPostContextList(filters?: PostFilters): Promise<PostContext[]> {
  const supabase = await createClient()
  
  try {
    let query = supabase.from('v_post_context').select('*')
    
    if (filters?.sourceType) {
      // Assuming JSONB query or column filter
      // query = query.eq('source_type', filters.sourceType)
    }
    
    if (filters?.sourceId) {
      // query = query.eq('source_id', filters.sourceId)
    }
    
    if (filters?.authorId) {
      // query = query.eq('author_id', filters.authorId)
    }
    
    query = query.order('created_at', { ascending: false })

    const { data, error } = await query
    
    if (error) {
      console.error('Error fetching post list:', error)
      return []
    }
    
    return mapArray(data, mapPostContext)
  } catch (err) {
    console.error('Unexpected error in getPostContextList:', err)
    return []
  }
}

function mapPostContext(data: unknown): PostContext | null {
  try {
    if (!isRecord(data)) return null
    
    const id = asString(data.id)
    const content = asString(data.content)
    
    if (!id) return null
    
    return {
      id,
      content,
      type: asString(data.type),
      visibility: asString(data.visibility),
      created_at: asString(data.created_at),
      author_name: asString(data.author_name),
      author_avatar: toNullableString(data.author_avatar),
      source_badge: mapSourceBadge(data.source_badge),
      linked_entity: mapLinkedEntity(data.linked_entity),
      engagement: mapPostEngagement(data.engagement),
      user_state: mapUserPostState(data.user_state)
    }
  } catch (error) {
    console.error('Error mapping post context:', error)
    return null
  }
}

function mapArray<T>(data: unknown, mapper: (item: unknown) => T | null): T[] {
  if (!Array.isArray(data)) return []
  return data.map(mapper).filter((item): item is T => item !== null)
}

function mapSourceBadge(data: unknown): SourceBadge | null {
  try {
    if (!isRecord(data)) return null
    
    const id = asString(data.id)
    const name = asString(data.name)
    
    if (!id || !name) return null
    
    return {
      id,
      name,
      type: asString(data.type),
      icon: toNullableString(data.icon),
      color: toNullableString(data.color),
      link: asString(data.link)
    }
  } catch (error) {
    console.error('Error mapping source badge:', error)
    return null
  }
}

function mapLinkedEntity(data: unknown): LinkedEntity | null {
  try {
    if (!isRecord(data)) return null
    
    const id = asString(data.id)
    const name = asString(data.name)
    
    if (!id || !name) return null
    
    return {
      id,
      name,
      type: asString(data.type),
      description: toNullableString(data.description),
      image: toNullableString(data.image),
      link: asString(data.link)
    }
  } catch (error) {
    console.error('Error mapping linked entity:', error)
    return null
  }
}

function mapPostEngagement(data: unknown): PostEngagement {
  try {
    if (!isRecord(data)) {
      return { likes: 0, comments: 0, shares: 0, bookmarks: 0, views: 0 }
    }
    
    return {
      likes: asNumber(data.likes),
      comments: asNumber(data.comments),
      shares: asNumber(data.shares),
      bookmarks: asNumber(data.bookmarks),
      views: asNumber(data.views)
    }
  } catch (error) {
    console.error('Error mapping post engagement:', error)
    return { likes: 0, comments: 0, shares: 0, bookmarks: 0, views: 0 }
  }
}

function mapUserPostState(data: unknown): UserPostState {
  try {
    if (!isRecord(data)) {
      return { hasLiked: false, hasBookmarked: false, hasShared: false, canComment: false, canEdit: false }
    }
    
    return {
      hasLiked: Boolean(data.hasLiked),
      hasBookmarked: Boolean(data.hasBookmarked),
      hasShared: Boolean(data.hasShared),
      canComment: Boolean(data.canComment),
      canEdit: Boolean(data.canEdit)
    }
  } catch (error) {
    console.error('Error mapping user post state:', error)
    return { hasLiked: false, hasBookmarked: false, hasShared: false, canComment: false, canEdit: false }
  }
}
