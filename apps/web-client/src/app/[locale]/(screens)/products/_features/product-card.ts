export type ProductCardProduct = {
  id: string
  slug?: string | null
  name_default: string
  name_i18n?: Record<string, string> | null
  short_description_default?: string | null
  short_description_i18n?: Record<string, string> | null
  price_points: number
  price_eur_equivalent?: number | null
  stock_quantity?: number | null
  featured?: boolean | null
  fulfillment_method?: string | null
  metadata?: unknown
  images: string[]
  tags?: string[] | null
}
