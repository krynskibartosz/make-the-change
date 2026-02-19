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
  description_default: string | null
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

// Internal raw row shapes used by home normalizers.
export type HomeFeaturedProjectSource = {
  id: unknown
  slug: unknown
  name_default: unknown
  description_default: unknown
  hero_image_url: unknown
  target_budget: unknown
  current_funding: unknown
  status: unknown
  featured: unknown
}

// Internal raw row shapes used by home normalizers.
export type HomeFeaturedProductSource = {
  id: unknown
  slug: unknown
  name_default: unknown
  short_description_default: unknown
  price_points: unknown
  price_eur_equivalent: unknown
  stock_quantity: unknown
  featured: unknown
  fulfillment_method: unknown
  metadata: unknown
  images: unknown
  tags: unknown
}

// Internal raw row shapes used by home normalizers.
export type HomeActiveProducerSource = {
  id: unknown
  name_default: unknown
  description_default: unknown
  contact_website: unknown
  images: unknown
}
