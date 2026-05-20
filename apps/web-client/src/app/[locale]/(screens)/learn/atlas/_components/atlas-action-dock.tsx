import { Compass } from 'lucide-react'
import type { AtlasTerritoryConfig } from '@/lib/learning/schema'

export function AtlasActionDock({
  selectedTerritory,
  hasStartedDomain,
}: {
  selectedTerritory: AtlasTerritoryConfig | null
  hasStartedDomain: boolean
}) {
  const label = selectedTerritory
    ? hasStartedDomain
      ? `Reprendre ${selectedTerritory.domain.title}`
      : `Commencer ${selectedTerritory.domain.title}`
    : 'Me guider dans l’Atlas'

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 flex justify-center px-4">
      <button
        type="button"
        aria-label={label}
        className="pointer-events-auto flex h-14 min-w-0 max-w-[25rem] flex-1 items-center justify-center gap-3 rounded-full bg-[#f5f0e8]/95 px-5 font-black text-[#1a1a14] shadow-[0_12px_40px_rgba(0,0,0,0.32)] backdrop-blur-sm transition-transform active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:flex-none sm:px-9"
      >
        <Compass className="h-5 w-5 shrink-0 text-amber-700" strokeWidth={2.8} aria-hidden="true" />
        <span className="truncate text-[0.98rem]">{label}</span>
      </button>
    </div>
  )
}
