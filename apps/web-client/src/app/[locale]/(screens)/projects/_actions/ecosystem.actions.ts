'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * Fetch an ecosystem by its slug
 */
export async function getEcosystemBySlug(slug: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .schema('investment')
        .from('ecosystems')
        .select('*')
        .eq('slug', slug)
        .single()

    if (error) {
        if (error.code === 'PGRST116') {
            return null // Not found
        }
        console.error('Error fetching ecosystem:', error)
        throw new Error("Impossible de charger l'écosystème")
    }

    return data
}

/**
 * Fetch an ecosystem by its ID
 */
export async function getEcosystemById(id: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .schema('investment')
        .from('ecosystems')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        if (error.code === 'PGRST116') {
            return null // Not found
        }
        console.error('Error fetching ecosystem:', error)
        throw new Error("Impossible de charger l'écosystème")
    }

    return data
}

/**
 * Fetch properties (parcels/locations) associated with a project ID
 */
export async function getPropertiesByProjectId(projectId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .schema('investment')
        .from('properties')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true })

    if (error) {
        console.error('Error fetching properties:', error)
        throw new Error('Impossible de charger les propriétés du projet')
    }

    return data || []
}
