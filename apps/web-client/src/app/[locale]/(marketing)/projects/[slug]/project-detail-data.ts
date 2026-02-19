import { createClient } from '@/lib/supabase/server'

export type ProjectProducer = {
  name_default: string
  description_default: string | null
  contact_website: string | null
  images: string[] | null
}

export type PublicProject = {
  id: string
  slug: string
  status: string | null
  type: string | null
  name_default: string
  description_default: string | null
  long_description_default: string | null
  address_city: string | null
  address_country_code: string | null
  launch_date: string | null
  maturity_date: string | null
  current_funding: number | null
  target_budget: number | null
  hero_image_url: string | null
  images: string[] | null
  producer: ProjectProducer | null
}

export async function getPublicProjectBySlug(slug: string): Promise<PublicProject | null> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('public_projects')
    .select(
      `
      *,
      producer:public_producers!producer_id(*)
    `,
    )
    .eq('slug', slug)
    .single()

  return (data as PublicProject | null) ?? null
}
