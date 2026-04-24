import { Lock, Sprout, HelpCircle } from 'lucide-react'

interface EvolutionCardProps {
  currentSeeds: number
  requiredSeeds?: number
  canEvolve?: boolean
}

export function EvolutionCard({ currentSeeds, requiredSeeds = 500, canEvolve = false }: EvolutionCardProps) {
  const progress = Math.min((currentSeeds / requiredSeeds) * 100, 100)

  return (
    <div className="mx-5 mt-10 rounded-3xl border-l-4 border-l-amber-500 border-y border-r border-white/5 bg-white/5 p-5 backdrop-blur-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="mb-4 font-bold text-white">Évolution disponible</h3>

          <div className="mb-2 flex justify-between text-sm">
            <span className="text-white/60">Graines requises</span>
            <span className="font-bold text-emerald-400 tabular-nums">
              {currentSeeds} / {requiredSeeds} <Sprout className="inline h-[1.2em] w-[1.2em] align-text-bottom text-lime-400" />
            </span>
          </div>

          <div className="h-3 w-full overflow-hidden rounded-full bg-black/50">
            <div
              className="h-full rounded-full bg-emerald-400"
              style={{ width: `${progress}%` }}
            />
          </div>

          <button
            type="button"
            disabled={!canEvolve}
            className={`
              mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-4 font-bold transition-colors
              ${canEvolve
                ? 'bg-amber-500 text-white hover:bg-amber-600'
                : 'border border-white/20 bg-transparent text-white/40 cursor-not-allowed'
              }
            `}
          >
            {canEvolve ? (
              <>Faire évoluer ({requiredSeeds} 🌱)</>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                Évoluer l&apos;espèce
              </>
            )}
          </button>

          <p className="mt-4 text-center text-xs text-white/40">
            Faites des{' '}
            <span className="text-lime-400 underline decoration-lime-400/30">Défis Quotidiens</span>{' '}
            pour gagner plus de graines.
          </p>
        </div>

        <div className="ml-4 flex h-24 w-24 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
          <div className="flex flex-col items-center">
            <HelpCircle className="h-8 w-8 text-white/30 blur-sm" />
            <span className="mt-1 text-xs text-white/30">Niv 3</span>
          </div>
        </div>
      </div>
    </div>
  )
}
