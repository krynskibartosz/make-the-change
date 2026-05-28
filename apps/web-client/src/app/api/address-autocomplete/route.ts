import { NextRequest, NextResponse } from 'next/server'
import type { AddressSuggestion } from '@/lib/address-autocomplete'

const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY ?? ''
const GEOAPIFY_URL = 'https://api.geoapify.com/v1/geocode/autocomplete'

type GeoapifyFeature = {
  properties: {
    formatted?: string
    address_line1?: string
    postcode?: string
    city?: string
    country_code?: string
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim() ?? ''
  const country = (searchParams.get('country') ?? 'be').toLowerCase()

  if (q.length < 3 || !GEOAPIFY_API_KEY) {
    return NextResponse.json([])
  }

  const url = new URL(GEOAPIFY_URL)
  url.searchParams.set('text', q)
  url.searchParams.set('filter', `countrycode:${country}`)
  url.searchParams.set('limit', '5')
  url.searchParams.set('apiKey', GEOAPIFY_API_KEY)

  try {
    const res = await fetch(url.toString())
    if (!res.ok) return NextResponse.json([])

    const data = (await res.json()) as { features?: GeoapifyFeature[] }
    const suggestions: AddressSuggestion[] = (data.features ?? []).flatMap((feature) => {
      const p = feature.properties
      if (!p.address_line1 || !p.postcode || !p.city) return []
      return [
        {
          label: p.formatted ?? `${p.address_line1}, ${p.postcode} ${p.city}`,
          street: p.address_line1,
          postalCode: p.postcode,
          city: p.city,
          country: (p.country_code ?? country).toUpperCase(),
        },
      ]
    })

    return NextResponse.json(suggestions)
  } catch {
    return NextResponse.json([])
  }
}
