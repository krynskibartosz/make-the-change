'use client'

type FilterType = 'all' | 'support' | 'contribution' | 'order'

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
        onClick={() => onFilterChange('support')}
        className={`flex-1 py-2 rounded-lg text-sm transition-all ${
          currentFilter === 'support'
            ? 'bg-white/15 text-white font-semibold shadow-sm'
            : 'text-gray-500 hover:text-gray-300 font-medium'
        }`}
      >
        Soutiens
      </button>
      <button
        onClick={() => onFilterChange('contribution')}
        className={`flex-1 py-2 rounded-lg text-sm transition-all ${
          currentFilter === 'contribution'
            ? 'bg-white/15 text-white font-semibold shadow-sm'
            : 'text-gray-500 hover:text-gray-300 font-medium'
        }`}
      >
        Contributions
      </button>
      <button
        onClick={() => onFilterChange('order')}
        className={`flex-1 py-2 rounded-lg text-sm transition-all ${
          currentFilter === 'order'
            ? 'bg-white/15 text-white font-semibold shadow-sm'
            : 'text-gray-500 hover:text-gray-300 font-medium'
        }`}
      >
        Échanges
      </button>
    </div>
  )
}
