import { asNumber, asString, isRecord } from '@/lib/type-guards'

export type ParsedProductSnapshot = {
  name: string
  priceEuros: number
}

export type ParsedOrderProduct = {
  id: string | null
  nameDefault: string
  slug: string | null
}

export type ParsedOrderItem = {
  id: string
  quantity: number
  unitPricePoints: number
  totalPricePoints: number
  snapshot: ParsedProductSnapshot
  product: ParsedOrderProduct | null
}

export type ParsedShippingAddress = {
  firstName: string
  lastName: string
  street: string
  postalCode: string
  city: string
  country: string
}

const parseProductSnapshot = (value: unknown): ParsedProductSnapshot => {
  const snapshot = isRecord(value) ? value : {}

  return {
    name: asString(snapshot.name, asString(snapshot.name_default, 'Produit')),
    priceEuros: asNumber(snapshot.priceEuros, asNumber(snapshot.price_eur_equivalent, 0)),
  }
}

const parseOrderProduct = (value: unknown): ParsedOrderProduct | null => {
  if (!isRecord(value)) {
    return null
  }

  const nameDefault = asString(value.name_default)
  const id = asString(value.id)
  const slug = asString(value.slug)

  if (!nameDefault && !id && !slug) {
    return null
  }

  return {
    id: id || null,
    nameDefault: nameDefault || 'Produit',
    slug: slug || null,
  }
}

const parseJoinedProduct = (value: unknown): ParsedOrderProduct | null => {
  if (Array.isArray(value)) {
    for (const entry of value) {
      const parsed = parseOrderProduct(entry)
      if (parsed) {
        return parsed
      }
    }
    return null
  }

  return parseOrderProduct(value)
}

export const parseOrderItems = (value: unknown): ParsedOrderItem[] => {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((item, index): ParsedOrderItem | null => {
      if (!isRecord(item)) {
        return null
      }

      return {
        id: asString(item.id, `item-${index}`),
        quantity: Math.max(0, Math.floor(asNumber(item.quantity, 0))),
        unitPricePoints: Math.max(0, Math.floor(asNumber(item.unit_price_points, 0))),
        totalPricePoints: Math.max(0, Math.floor(asNumber(item.total_price_points, 0))),
        snapshot: parseProductSnapshot(item.product_snapshot),
        product: parseJoinedProduct(item.product),
      }
    })
    .filter((item): item is ParsedOrderItem => item !== null)
}

export const parseShippingAddress = (value: unknown): ParsedShippingAddress => {
  const address = isRecord(value) ? value : {}

  return {
    firstName: asString(address.firstName, asString(address.first_name)),
    lastName: asString(address.lastName, asString(address.last_name)),
    street: asString(address.street, asString(address.address_street)),
    postalCode: asString(address.postalCode, asString(address.postal_code)),
    city: asString(address.city),
    country: asString(address.country, asString(address.country_code)),
  }
}
