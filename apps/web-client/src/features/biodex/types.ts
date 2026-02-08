export type Species = {
  id: string
  created_at: string
  updated_at: string
  name_i18n: Record<string, string> | null
  scientific_name: string | null
  description_i18n: Record<string, string> | null
  conservation_status: 'NE' | 'DD' | 'LC' | 'NT' | 'VU' | 'EN' | 'CR' | 'EW' | 'EX' | null
  population_trend: 'increasing' | 'decreasing' | 'stable' | 'unknown' | null
  habitat: string[] | null
  threats: string[] | null
  image_url: string | null
  gallery_urls: string[] | null
  content_levels: Record<string, any> | null
  metadata: Record<string, any> | null
}

export type ConservationStatus = NonNullable<Species['conservation_status']>
