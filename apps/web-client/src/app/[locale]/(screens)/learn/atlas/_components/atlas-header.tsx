import { motion } from 'framer-motion'
import { ArrowLeft, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Link } from '@/i18n/navigation'
import type { AtlasTerritoryConfig } from '@/lib/learning/schema'

export const ICON_BUTTON_CLASS =
  'grid h-9 w-9 place-items-center rounded-full bg-[#f5f0e8]/90 text-[#1a1a14] shadow-[0_8px_24px_rgba(0,0,0,0.28)] backdrop-blur-sm transition-transform active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white'

export function AtlasHeader({
  selectedTerritory,
  onBackToWorld,
}: {
  selectedTerritory: AtlasTerritoryConfig | null
  onBackToWorld: () => void
}) {
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-50 px-4 pt-[max(1rem,env(safe-area-inset-top))] md:px-8">
      <div className="flex items-start justify-between gap-4">
        {selectedTerritory ? (
          <button
            type="button"
            aria-label="Retour à la carte Atlas"
            onClick={onBackToWorld}
            className={cn(ICON_BUTTON_CLASS, 'pointer-events-auto')}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : (
          <Link
            href="/learn"
            aria-label="Retour à Apprendre"
            className={cn(ICON_BUTTON_CLASS, 'pointer-events-auto')}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </Link>
        )}

        {/* Micro-Header for selected territory */}
        {selectedTerritory && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 text-center mt-1"
          >
            <h1 className="text-[1.05rem] font-black text-white/95 leading-tight tracking-tight drop-shadow-md">
              {selectedTerritory.domain.title}
            </h1>
            {selectedTerritory.domain.shortDescription && (
              <p className="mt-0.5 text-[0.75rem] font-medium text-white/70 drop-shadow-sm max-w-[200px] mx-auto leading-snug">
                {selectedTerritory.domain.shortDescription}
              </p>
            )}
          </motion.div>
        )}

        <button
          type="button"
          aria-label="Rechercher"
          className={cn(ICON_BUTTON_CLASS, 'pointer-events-auto', !selectedTerritory && 'ml-auto')}
        >
          <Search className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </header>
  )
}
