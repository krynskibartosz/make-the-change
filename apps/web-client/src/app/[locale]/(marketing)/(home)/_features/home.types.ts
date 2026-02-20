export type DataState<T> =
  | {
      status: 'ready'
      value: T
    }
  | {
      status: 'empty'
    }
  | {
      status: 'unknown'
      error?: unknown
    }

export type HomeFeaturedProject = {
  id: string
  slug: string
  name_default: string | null
  name_i18n?: Record<string, string> | null
  description_default: string | null
  description_i18n?: Record<string, string> | null
  hero_image_url: string | null
  target_budget: number | null
  current_funding: number | null
  status: string | null
  featured: boolean | null
}

export type HomePartnerProducer = {
  id: string
  name_default: string
  description_default: string
  contact_website?: string
  images: string[]
}
