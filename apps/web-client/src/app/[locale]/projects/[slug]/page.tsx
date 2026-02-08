import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { ProjectUpdate } from '@/features/investment/project-timeline'
import ProjectClient from './project-client'

// Validate param params
export const dynamicParams = true

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: project } = await supabase
    .schema('investment')
    .from('projects')
    .select('name_default, description_default, hero_image_url, seo_keywords')
    .eq('slug', slug)
    .single()

  if (!project) {
    return {
      title: 'Projet non trouvé',
    }
  }

  return {
    title: project.name_default,
    description: project.description_default,
    keywords: project.seo_keywords || [],
    openGraph: {
      title: project.name_default,
      description: project.description_default,
      images: project.hero_image_url ? [project.hero_image_url] : [],
    },
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch project data
  const { data, error } = await supabase
    .schema('investment')
    .from('projects')
    .select(
      'id, slug, type, name_default, description_default, long_description_default, status, featured, target_budget, current_funding, impact_metrics, hero_image_url, avatar_image_url, gallery_image_urls, address_city, address_country_code, producer_id, species_id, created_at, updated_at',
    )
    .eq('slug', slug)
    .single()

  if (error || !data) {
    console.error('Project not found or error:', error)
    notFound()
  }

  // Fetch species data
  let species = null
  if (data.species_id) {
    const { data: speciesData } = await supabase
      .schema('investment')
      .from('species')
      .select('*')
      .eq('id', data.species_id)
      .single()
    species = speciesData
  }

  // Fetch project updates using Admin client (schema not exposed publicly)
  const adminSupabase = createAdminClient()
  const { data: updates } = await adminSupabase
    .schema('investment')
    .from('project_updates')
    .select('id, title, content, type, published_at, images')
    .eq('project_id', data.id)
    .order('published_at', { ascending: false })

  return (
    <ProjectClient
      project={data}
      updates={updates as ProjectUpdate[] | undefined}
      species={species}
    />
  )
}
