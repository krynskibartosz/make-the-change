import { NextRequest, NextResponse } from 'next/server'
import type { AddressSuggestion } from '@/lib/address-autocomplete'
import { GEOAPIFY_API_KEY } from '@/lib/geoapify'

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
  const debug = searchParams.get('debug') === '1'

  if (q.length < 3) {
    return NextResponse.json([])
  }

  const url = new URL(GEOAPIFY_URL)
  url.searchParams.set('text', q)
  url.searchParams.set('filter', `countrycode:${country}`)
  url.searchParams.set('limit', '5')
  url.searchParams.set('apiKey', GEOAPIFY_API_KEY)

  try {
    // cache: 'no-store' prevents Next.js data cache from serving stale empty results
    const res = await fetch(url.toString(), { cache: 'no-store' })

    if (!res.ok) {
      const body = await res.text()
      if (debug) return NextResponse.json({ error: res.status, body: body.slice(0, 500) })
      return NextResponse.json([])
    }

    const data = (await res.json()) as { features?: GeoapifyFeature[] }
    const features = data.features ?? []

    const suggestions: AddressSuggestion[] = features.flatMap((feature) => {
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

    if (debug) {
      return NextResponse.json({
        geoapifyStatus: res.status,
        featuresCount: features.length,
        suggestionsCount: suggestions.length,
        firstFeatureProps: features[0]?.properties ?? null,
        suggestions,
      })
    }

    return NextResponse.json(suggestions)
  } catch (e) {
    if (debug) return NextResponse.json({ error: 'fetch_threw', message: String(e) })
    return NextResponse.json([])
  }
}
