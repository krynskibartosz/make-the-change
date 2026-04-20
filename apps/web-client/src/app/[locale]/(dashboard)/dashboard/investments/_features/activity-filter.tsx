'use client'

import { useState } from 'react'

type FilterType = 'all' | 'investment' | 'order'

type ActivityFilterProps = {
  onFilterChange: (filter: FilterType) => void
  currentFilter: FilterType
}

export function ActivityFilter({ onFilterChange, currentFilter }: ActivityFilterProps) {
  return (
    <div className="mx-6 mb-6 p-1 bg-[#1A1F26] rounded-xl flex gap-1 border border-white/5">
      <button
        onClick={() => onFilterChange('all')}
        className={`flex-1 py-2 rounded-lg text-sm transition-all ${
          currentFilter === 'all'
            ? 'bg-white/15 text-white font-semibold shadow-sm'
            : 'text-gray-500 hover:text-gray-300 font-medium'
        }`}
      >
        Tout
      </button>
      <button
        onClick={() => onFilterChange('investment')}
        className={`flex-1 py-2 rounded-lg text-sm transition-all ${
          currentFilter === 'investment'
            ? 'bg-white/15 text-white font-semibold shadow-sm'
            : 'text-gray-500 hover:text-gray-300 font-medium'
        }`}
      >
        Impact
      </button>
      <button
        onClick={() => onFilterChange('order')}
        className={`flex-1 py-2 rounded-lg text-sm transition-all ${
          currentFilter === 'order'
            ? 'bg-white/15 text-white font-semibold shadow-sm'
            : 'text-gray-500 hover:text-gray-300 font-medium'
        }`}
      >
        Boutique
      </button>
    </div>
  )
}
