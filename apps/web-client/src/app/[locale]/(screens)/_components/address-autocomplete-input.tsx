'use client'

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
}

export function AddressAutocompleteInput({
  id,
  value,
  country,
  placeholder,
  className,
  onChange,
  onSelect,
}: Props) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([])
  const [activeIndex, setActiveIndex] = useState(-1)
  const [isOpen, setIsOpen] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const listboxId = `${id}-listbox`

  // Cancel in-flight work on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort()
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  // Reset dropdown when country changes, and cancel any in-flight request for the old country
  useEffect(() => {
    abortRef.current?.abort()
    if (debounceRef.current) clearTimeout(debounceRef.current)
    setSuggestions([])
    setIsOpen(false)
    setActiveIndex(-1)
  }, [country])

  async function fetchSuggestions(query: string) {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    const params = new URLSearchParams({ q: query, country: country.toLowerCase() })
    try {
      const res = await fetch(`/api/address-autocomplete?${params.toString()}`, {
        signal: controller.signal,
      })
      if (!res.ok) return
      const data = (await res.json()) as AddressSuggestion[]
      setSuggestions(data)
      setIsOpen(data.length > 0)
      setActiveIndex(-1)
    } catch (e) {
      if (e instanceof Error && e.name === 'AbortError') return
      // API unavailable — user can still type manually
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    onChange(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (val.trim().length < 3) {
      setSuggestions([])
      setIsOpen(false)
      return
    }
    debounceRef.current = setTimeout(() => void fetchSuggestions(val), 300)
  }

  function handleSelect(suggestion: AddressSuggestion) {
    onChange(suggestion.street)
    onSelect(suggestion)
    setSuggestions([])
    setIsOpen(false)
    setActiveIndex(-1)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isOpen || suggestions.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, -1))
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault()
      const selected = suggestions[activeIndex]
      if (selected) handleSelect(selected)
    } else if (e.key === 'Escape') {
      setSuggestions([])
      setIsOpen(false)
      setActiveIndex(-1)
    }
  }

  function handleBlur() {
    // Delay to allow onMouseDown on a suggestion to fire first
    setTimeout(() => {
      if (!containerRef.current?.contains(document.activeElement)) {
        setIsOpen(false)
      }
    }, 150)
  }

  return (
    <div ref={containerRef} className="relative">
      <input
        id={id}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={placeholder}
        autoComplete="off"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-activedescendant={activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined}
        className={className}
      />
      {isOpen && suggestions.length > 0 && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-white/10 bg-[#0B0F15] shadow-2xl"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={`${suggestion.label}-${index}`}
              id={`${id}-option-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              onMouseDown={() => handleSelect(suggestion)}
              className={`cursor-pointer px-4 py-3 text-sm transition-colors ${
                index === activeIndex
                  ? 'bg-white/[0.08] text-white'
                  : 'text-white/70 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              {suggestion.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
