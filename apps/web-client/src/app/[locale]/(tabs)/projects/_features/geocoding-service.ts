/**
 * Service de géocodage utilisant Nominatim (OpenStreetMap)
 *
 * Nominatim est un service gratuit de géocodage basé sur les données OpenStreetMap.
 * Politique d'utilisation: https://operations.osmfoundation.org/policies/nominatim/
 *
 * Limites:
 * - Maximum 1 requête par seconde
 * - Requiert un User-Agent identifiant l'application
 */

export type GeocodingResult = {
  place_id: number
  display_name: string
  lat: string
  lon: string
  address: {
    road?: string
    house_number?: string
    city?: string
    town?: string
    village?: string
    municipality?: string
    postcode?: string
    country?: string
    country_code?: string
    state?: string
    county?: string
  }
  boundingbox: [string, string, string, string] // [south, north, west, east]
  type: string
  importance: number
}

export type FormattedAddress = {
  street: string | null
  city: string | null
  postal_code: string | null
  country: string | null
  country_code: string | null
}

/**
 * Recherche une adresse via l'API Nominatim
 *
 * @param query - Texte de recherche (adresse, ville, pays, etc.)
 * @returns Liste de résultats de géocodage
 *
 * @example
 * const results = await searchAddress("123 Rue de la Paix, Paris");
 */
export async function searchAddress(query: string): Promise<GeocodingResult[]> {
  // Validation minimale
  if (!query || query.trim().length < 3) {
    return []
  }

  const params = new URLSearchParams({
    q: query.trim(),
    format: 'json',
    addressdetails: '1',
    limit: '5',
    'accept-language': 'fr', // Préférence pour les résultats en français
  })

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?${params.toString()}`,
      {
        headers: {
          // User-Agent requis par la politique d'utilisation de Nominatim
          'User-Agent': 'MakeTheChange-Admin/1.0 (biodiversity investment platform)',
        },
      },
    )

    if (!response.ok) {
      throw new Error(`Geocoding request failed: ${response.status} ${response.statusText}`)
    }

    const results: GeocodingResult[] = await response.json()
    return results
  } catch (error) {
    console.error('Geocoding error:', error)
    throw error
  }
}

/**
 * Formate un résultat Nominatim en objet address standardisé
 *
 * @param result - Résultat brut de Nominatim
 * @returns Objet address formaté pour la base de données
 *
 * @example
 * const address = formatAddress(nominatimResult);
 * // { street: "123 Rue de la Paix", city: "Paris", postal_code: "75002", country: "France" }
 */
export function formatAddress(result: GeocodingResult): FormattedAddress {
  const { address } = result

  // Construire le nom de rue complet (numéro + nom)
  const street =
    address.house_number && address.road
      ? `${address.house_number} ${address.road}`
      : address.road || null

  // Priorité : city > town > village > municipality
  const city = address.city || address.town || address.village || address.municipality || null

  return {
    street,
    city,
    postal_code: address.postcode || null,
    country: address.country || null,
    country_code: address.country_code ? address.country_code.toUpperCase() : null,
  }
}

/**
 * Convertit des coordonnées Nominatim (string) en tuple numérique
 *
 * @param result - Résultat Nominatim
 * @returns Coordonnées [latitude, longitude]
 */
export function extractCoordinates(result: GeocodingResult): [number, number] {
  const lat = parseFloat(result.lat)
  const lng = parseFloat(result.lon)

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    throw new Error('Invalid coordinates in geocoding result')
  }

  return [lat, lng]
}

/**
 * Formate un nom d'affichage court pour une adresse
 *
 * @param result - Résultat Nominatim
 * @returns Nom court (ex: "Paris, France" ou "123 Rue de la Paix, Paris")
 */
export function getShortDisplayName(result: GeocodingResult): string {
  const { address } = result

  // Si on a une rue, afficher rue + ville
  if (address.road) {
    const street = address.house_number ? `${address.house_number} ${address.road}` : address.road
    const city = address.city || address.town || address.village
    return city ? `${street}, ${city}` : street
  }

  // Sinon, afficher ville + pays
  const city = address.city || address.town || address.village
  const country = address.country

  if (city && country) {
    return `${city}, ${country}`
  }

  if (city) return city
  if (country) return country

  // Fallback sur le display_name complet
  return result.display_name
}

/**
 * Formate une FormattedAddress en string d'affichage lisible
 *
 * @param address - Adresse formatée depuis la base de données
 * @returns String d'affichage (ex: "123 Rue de la Paix, 75002 Paris, France")
 *
 * @example
 * formatAddressDisplay({ street: "123 Rue de la Paix", city: "Paris", postal_code: "75002", country: "France" })
 * // "123 Rue de la Paix, 75002 Paris, France"
 */
export function formatAddressDisplay(address: FormattedAddress | null | undefined): string | null {
  if (!address) return null

  const parts: string[] = []

  // Ajouter la rue
  if (address.street) {
    parts.push(address.street)
  }

  // Ajouter ville avec code postal
  const cityPart: string[] = []
  if (address.postal_code) cityPart.push(address.postal_code)
  if (address.city) cityPart.push(address.city)
  if (cityPart.length > 0) {
    parts.push(cityPart.join(' '))
  }

  // Ajouter le pays
  const countryLabel =
    address.country ?? (address.country_code ? address.country_code.toUpperCase() : null)

  if (countryLabel) {
    parts.push(countryLabel)
  }

  return parts.length > 0 ? parts.join(', ') : null
}
