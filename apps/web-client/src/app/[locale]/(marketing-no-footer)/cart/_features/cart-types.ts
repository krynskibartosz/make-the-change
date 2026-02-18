export type CartProductSnapshot = {
  name: string
  slug: string
  pricePoints: number
  priceEuros?: number
  imageUrl: string | null
  fulfillmentMethod?: string | null
  stockQuantity?: number | null
}

export type CartItemSnapshot = {
  productId: string
  quantity: number
  snapshot: CartProductSnapshot
}

export type PersistedCart = {
  version: 1
  items: CartItemSnapshot[]
  updatedAt: string
}
