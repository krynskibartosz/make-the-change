'use client'

import { Loader2, MapPin, Search, X } from 'lucide-react'
import { type FC, useCallback, useEffect, useRef, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'

import {
  extractCoordinates,
  type FormattedAddress,
  formatAddress,
  formatAddressDisplay,
  type GeocodingResult,
  getShortDisplayName,
  searchAddress,
} from '@/lib/geocoding-service'
import { cn } from '@/lib/utils'

export type AddressSelectResult = {
  coords: [number, number]
  address: FormattedAddress
  displayName: string
}

type AddressAutocompleteProps = {
  value?: FormattedAddress | null
  onAddressSelect: (result: AddressSelectResult) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

/**
 * Composant d'autocomplétion d'adresse avec géocodage Nominatim (OpenStreetMap)
 *
 * Fonctionnalités:
 * - Recherche d'adresse en temps réel
 * - Debounce de 500ms pour éviter trop de requêtes
 * - Affichage de suggestions avec icônes
 * - Conversion automatique en coordonnées GPS
 * - Extraction des détails d'adresse (rue, ville, code postal, pays)
 *
 * @example
 * ```tsx
 * <AddressAutocomplete
 *   onAddressSelect={(result) => {
 *
 *   }}
 * />
 * ```
 */
export const AddressAutocomplete: FC<AddressAutocompleteProps> = ({
  value,
  onAddressSelect,
  placeholder = 'Rechercher une adresse...',
  disabled = false,
  className,
}) => {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<GeocodingResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState<string | null>(() => {
    // Initialiser avec la valeur existante si présente
    return formatAddressDisplay(value)
  })
  const [showDropdown, setShowDropdown] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Synchroniser l'adresse affichée avec la valeur externe
  useEffect(() => {
    const displayAddress = formatAddressDisplay(value)
    setSelectedAddress(displayAddress)
  }, [value])

  // Debounce de 600ms pour respecter la limite de 1 req/sec de Nominatim
  const debouncedSearch = useDebouncedCallback(async (searchQuery: string) => {
    if (searchQuery.trim().length < 3) {
      setSuggestions([])
      setError(null)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const results = await searchAddress(searchQuery)

      if (results.length === 0) {
        setError('Aucune adresse trouvée. Essayez une recherche différente.')
      }

      setSuggestions(results)
      setShowDropdown(true)
    } catch (err) {
      console.error('Geocoding error:', err)
      setError('Erreur lors de la recherche. Veuillez réessayer.')
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }, 600)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setSelectedAddress(null)
    setError(null)

    if (value.trim().length < 3) {
      setSuggestions([])
      setShowDropdown(false)
      return
    }

    debouncedSearch(value)
  }

  const handleSelectSuggestion = useCallback(
    (result: GeocodingResult) => {
      const coords = extractCoordinates(result)
      const address = formatAddress(result)
      const displayName = result.display_name

      setSelectedAddress(getShortDisplayName(result))
      setQuery('')
      setSuggestions([])
      setShowDropdown(false)
      setError(null)

      onAddressSelect({
        coords,
        address,
        displayName,
      })
    },
    [onAddressSelect],
  )

  const handleClear = useCallback(() => {
    setQuery('')
    setSelectedAddress(null)
    setSuggestions([])
    setShowDropdown(false)
    setError(null)
    inputRef.current?.focus()
  }, [])

  const handleBlur = useCallback(() => {
    // Délai pour permettre le clic sur une suggestion
    setTimeout(() => {
      setShowDropdown(false)
    }, 200)
  }, [])

  return (
    <div className={cn('space-y-2', className)}>
      {/* Input de recherche */}
      {!selectedAddress && (
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
              onBlur={handleBlur}
              placeholder={placeholder}
              disabled={disabled}
              className={cn(
                'w-full rounded-xl border py-2.5 pl-10 pr-10 text-sm transition-colors',
                'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
                'disabled:cursor-not-allowed disabled:opacity-50',
                error ? 'border-destructive' : 'border-input bg-background',
              )}
            />
            {isLoading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
            )}
          </div>

          {/* Message d'aide */}
          {!isLoading && !error && query.length > 0 && query.length < 3 && (
            <p className="mt-1 text-xs text-muted-foreground">
              Tapez au moins 3 caractères pour rechercher...
            </p>
          )}

          {/* Message d'erreur */}
          {error && <p className="mt-1 text-xs text-destructive">{error}</p>}

          {/* Dropdown de suggestions */}
          {showDropdown && suggestions.length > 0 && !error && (
            <div className="absolute z-[1000] mt-1 w-full overflow-hidden rounded-xl border border-border bg-popover shadow-xl backdrop-blur-md">
              <ul className="max-h-64 overflow-y-auto py-1">
                {suggestions.map((result) => (
                  <li key={result.place_id}>
                    <button
                      type="button"
                      onClick={() => handleSelectSuggestion(result)}
                      className="flex w-full items-start gap-3 px-4 py-2.5 text-left text-sm text-popover-foreground transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer"
                    >
                      <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{getShortDisplayName(result)}</p>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {result.display_name}
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>

              {/* Footer avec attribution OSM */}
              <div className="border-t border-border bg-muted/50 px-4 py-2">
                <p className="text-xs text-muted-foreground">
                  Résultats fournis par{' '}
                  <a
                    href="https://www.openstreetmap.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-foreground"
                  >
                    OpenStreetMap
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Adresse sélectionnée */}
      {selectedAddress && (
        <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-3">
          <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">{selectedAddress}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Adresse sélectionnée</p>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
            title="Effacer la sélection"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}
