'use client'

import {
  Autocomplete,
  AutocompleteCollection,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
  AutocompletePopup,
  AutocompletePortal,
  AutocompletePositioner,
} from '@make-the-change/core/ui'
import { useEffect, useRef, useState } from 'react'
import type { AddressSuggestion } from '@/lib/address-autocomplete'

type Props = {
  id: string
  value: string
  country: string
  placeholder?: string
  className?: string
  onChange: (value: string) => void
  onSelect: (suggestion: Pick<AddressSuggestion, 'street' | 'postalCode' | 'city'>) => void
  onBlur?: () => void
}

export function AddressAutocompleteInput({
  id,
  value,
  country,
  placeholder,
  className,
  onChange,
  onSelect,
  onBlur,
}: Props) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  // Cancel in-flight work on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort()
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  // Reset suggestions on country change
  useEffect(() => {
    abortRef.current?.abort()
    if (debounceRef.current) clearTimeout(debounceRef.current)
    setSuggestions([])
    setIsLoading(false)
  }, [country])

  function handleInputChange(next: string) {
    onChange(next)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (next.trim().length < 2) {
      setSuggestions([])
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    debounceRef.current = setTimeout(async () => {
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller
      try {
        const params = new URLSearchParams({ q: next, country: country.toLowerCase() })
        const res = await fetch(`/api/address-autocomplete?${params.toString()}`, {
          signal: controller.signal,
        })
        if (!res.ok) {
          setSuggestions([])
          return
        }
        const data = (await res.json()) as AddressSuggestion[]
        setSuggestions(data)
      } catch (e) {
        if (e instanceof Error && e.name === 'AbortError') return
        setSuggestions([])
      } finally {
        setIsLoading(false)
      }
    }, 300)
  }

  return (
    <div className="relative">
      <Autocomplete
        items={suggestions}
        value={value}
        onValueChange={(next: string) => handleInputChange(next)}
        // mode="none" disables internal filtering — we handle it server-side
        mode="none"
        // itemToStringValue fills the input with street after selection
        itemToStringValue={(item: AddressSuggestion) => item.street}
      >
        <AutocompleteInput
          id={id}
          placeholder={placeholder}
          autoComplete="off"
          className={className}
          onBlur={onBlur}
        />
        {isLoading && (
          <div
            className="pointer-events-none absolute inset-y-0 right-4 flex items-center"
            aria-hidden="true"
          >
            <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/20 border-t-white/60" />
          </div>
        )}
        <AutocompletePortal>
          <AutocompletePositioner sideOffset={4} className="z-[9999]">
            <AutocompletePopup className="max-h-52 overflow-y-auto rounded-xl border border-white/10 bg-[#0B0F15] shadow-2xl w-[var(--anchor-width)]">
              <AutocompleteList>
                <AutocompleteCollection>
                  {(item: AddressSuggestion, index: number) => (
                    <AutocompleteItem
                      key={`${item.label}-${index}`}
                      value={item}
                      onClick={() => {
                        onChange(item.street)
                        onSelect({ street: item.street, postalCode: item.postalCode, city: item.city })
                      }}
                      className="cursor-pointer px-4 py-3 text-sm text-white/70 transition-colors data-[highlighted]:bg-white/[0.08] data-[highlighted]:text-white"
                    >
                      {item.label}
                    </AutocompleteItem>
                  )}
                </AutocompleteCollection>
                <AutocompleteEmpty className="px-4 py-3 text-sm text-white/40">
                  Aucune adresse trouvée
                </AutocompleteEmpty>
              </AutocompleteList>
            </AutocompletePopup>
          </AutocompletePositioner>
        </AutocompletePortal>
      </Autocomplete>
    </div>
  )
}
