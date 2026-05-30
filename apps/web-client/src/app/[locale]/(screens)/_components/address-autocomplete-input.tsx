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
  const [activeIndex, setActiveIndex] = useState(-1)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [dropStyle, setDropStyle] = useState<React.CSSProperties>({})
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

  // Reset dropdown when country changes
  useEffect(() => {
    abortRef.current?.abort()
    if (debounceRef.current) clearTimeout(debounceRef.current)
    setSuggestions([])
    setIsOpen(false)
    setActiveIndex(-1)
    setIsLoading(false)
  }, [country])

  function syncPosition() {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const spaceBelow = window.innerHeight - rect.bottom
    const above = spaceBelow < 260
    setDropStyle(
      above
        ? { position: 'fixed', bottom: window.innerHeight - rect.top + 4, left: rect.left, width: rect.width }
        : { position: 'fixed', top: rect.bottom + 4, left: rect.left, width: rect.width },
    )
  }

  // Keep dropdown aligned to input when open (handles scroll + keyboard resize)
  useEffect(() => {
    if (!isOpen) return
    syncPosition()
    // Use capture:true to catch scrolls inside overflow-auto containers
    window.addEventListener('scroll', syncPosition, true)
    window.addEventListener('resize', syncPosition)
    return () => {
      window.removeEventListener('scroll', syncPosition, true)
      window.removeEventListener('resize', syncPosition)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  async function fetchSuggestions(query: string) {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setIsLoading(true)
    const params = new URLSearchParams({ q: query, country: country.toLowerCase() })
    try {
      const res = await fetch(`/api/address-autocomplete?${params.toString()}`, {
        signal: controller.signal,
      })
      if (!res.ok) return
      const data = (await res.json()) as AddressSuggestion[]
      if (data.length > 0) {
        syncPosition() // position calculée AVANT d'afficher le dropdown
        setSuggestions(data)
        setIsOpen(true)
      } else {
        setSuggestions([])
        setIsOpen(false)
      }
      setActiveIndex(-1)
    } catch (e) {
      if (e instanceof Error && e.name === 'AbortError') return
      // API unavailable — user can still type manually
    } finally {
      setIsLoading(false)
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    onChange(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (val.trim().length < 2) {
      setSuggestions([])
      setIsOpen(false)
      setIsLoading(false)
      return
    }
    setIsLoading(true)
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

  function handleBlurInternal() {
    setTimeout(() => {
      if (!containerRef.current?.contains(document.activeElement)) {
        setIsOpen(false)
        onBlur?.()
      }
    }, 150)
  }

  return (
    <div ref={containerRef} className="relative">
      {isLoading && (
        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
          <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/20 border-t-white/60" />
        </div>
      )}
      <input
        id={id}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlurInternal}
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
          style={{ ...dropStyle, zIndex: 9999 }}
          className="max-h-52 overflow-y-auto rounded-xl border border-white/10 bg-[#0B0F15] shadow-2xl"
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
