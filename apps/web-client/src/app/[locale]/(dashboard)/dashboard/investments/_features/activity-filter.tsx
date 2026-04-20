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
        className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all ${
          currentFilter === 'all'
            ? 'bg-white/10 text-white shadow-sm'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        Tout
      </button>
      <button
        onClick={() => onFilterChange('investment')}
        className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all ${
          currentFilter === 'investment'
            ? 'bg-white/10 text-white shadow-sm'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        Impact
      </button>
      <button
        onClick={() => onFilterChange('order')}
        className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all ${
          currentFilter === 'order'
            ? 'bg-white/10 text-white shadow-sm'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        Boutique
      </button>
    </div>
  )
}
