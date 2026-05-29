import { NextRequest, NextResponse } from 'next/server'
import type { AddressValidationResult } from '@/lib/address-validation'

const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY ?? '76c8b6833fa94d18932e6b80cd71e4f8'
const GEOAPIFY_SEARCH_URL = 'https://api.geoapify.com/v1/geocode/search'

type GeoapifyFeature = {
  properties: {
    formatted?: string
    address_line1?: string
    postcode?: string
    city?: string
    rank?: { confidence?: number }
  }
}

export async function POST(request: NextRequest) {
  let body: { street?: string; postalCode?: string; city?: string; country?: string }
  try {
    body = (await request.json()) as typeof body
  } catch {
    return NextResponse.json<AddressValidationResult>({ status: 'invalid' })
  }

  const { street = '', postalCode = '', city = '', country = 'be' } = body
  if (!street || !postalCode || !city) {
    return NextResponse.json<AddressValidationResult>({ status: 'invalid' })
  }

  const text = `${street}, ${postalCode} ${city}`
  const url = new URL(GEOAPIFY_SEARCH_URL)
  url.searchParams.set('text', text)
  url.searchParams.set('filter', `countrycode:${country.toLowerCase()}`)
  url.searchParams.set('limit', '1')
  url.searchParams.set('apiKey', GEOAPIFY_API_KEY)

  try {
    const res = await fetch(url.toString())
    if (!res.ok) return NextResponse.json<AddressValidationResult>({ status: 'unavailable' })

    const data = (await res.json()) as { features?: GeoapifyFeature[] }
    const feature = data.features?.[0]

    if (!feature) return NextResponse.json<AddressValidationResult>({ status: 'invalid' })

    const p = feature.properties
    const confidence = p.rank?.confidence ?? 0

    if (confidence >= 0.75) {
      return NextResponse.json<AddressValidationResult>({ status: 'confirmed' })
    }

    if (confidence >= 0.4 && p.address_line1 && p.postcode && p.city) {
      return NextResponse.json<AddressValidationResult>({
        status: 'suggested',
        suggestion: {
          street: p.address_line1,
          postalCode: p.postcode,
          city: p.city,
          label: p.formatted ?? `${p.address_line1}, ${p.postcode} ${p.city}`,
        },
      })
    }

    return NextResponse.json<AddressValidationResult>({ status: 'invalid' })
  } catch {
    // Network error — let the user proceed rather than block checkout
    return NextResponse.json<AddressValidationResult>({ status: 'unavailable' })
  }
}
