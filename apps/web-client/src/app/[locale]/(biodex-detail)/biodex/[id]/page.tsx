import { ChevronLeft, Leaf, Lock, Sprout } from 'lucide-react'
import { getSpeciesContext } from '@/lib/api/species-context.service'

const REQUIRED_SEEDS = 500

export default async function SpeciesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const species = await getSpeciesContext(id)
  const currentSeeds = species?.user_status?.progressionLevel ?? 1

  if (!species) {
    return (
      <div className="min-h-screen bg-[#0B0F15] text-white">
        <main className="mx-auto w-full max-w-2xl pb-12">
          <div className="flex items-center justify-center px-5 pt-12">
            <div className="text-white/50">Espèce non trouvée</div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B0F15] text-white">
      <main className="mx-auto w-full max-w-2xl pb-12">
        <header className="flex items-center justify-between px-5 pb-4 pt-12">
          <button
            type="button"
            onClick={() => window.history.back()}
            aria-label="Retour"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white transition-colors hover:bg-white/10"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5">
            <Leaf className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-bold text-emerald-400 tabular-nums">{currentSeeds}</span>
          </div>
        </header>

        <section className="mt-4">
          <div className="relative flex aspect-square w-full items-center justify-center">
            <div className="absolute inset-0 mx-auto h-3/4 w-3/4 rounded-full bg-emerald-500/20 blur-[100px]" />
            <img
              src={species.image_url || '/images/diorama-chouette.png'}
              alt={species.name_default}
              className="z-10 h-64 w-64 rounded-full object-cover drop-shadow-2xl"
            />
          </div>
        </section>

        <section className="mt-2 text-center">
          <div className="mx-auto mb-3 w-fit rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white/70">
            Niveau {species.user_status?.progressionLevel ?? 1}
          </div>
          <h1 className="text-center text-3xl font-black text-white">{species.name_default}</h1>
          <p className="mt-2 px-8 text-center text-sm text-white/50">
            {species.description_default}
          </p>
        </section>

        <section className="mx-5 mt-10 rounded-3xl border border-white/5 bg-[#1C1C22] p-5">
          <h3 className="mb-4 font-bold text-white">Évolution disponible</h3>

          <div className="mb-2 flex justify-between text-sm">
            <span className="text-white/60">Graines requises</span>
            <span className="font-bold text-emerald-400 tabular-nums">
              {currentSeeds} / {REQUIRED_SEEDS} <Sprout className="inline h-[1.2em] w-[1.2em] align-text-bottom text-lime-400" />
            </span>
          </div>

          <div className="h-3 w-full overflow-hidden rounded-full bg-black/50">
            <div
              className="h-full rounded-full bg-emerald-400"
              style={{ width: `${Math.round((currentSeeds / REQUIRED_SEEDS) * 100)}%` }}
            />
          </div>

          <button
            type="button"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-white/5 py-4 font-bold text-white/40"
          >
            <Lock className="h-4 w-4" />
            Évoluer l&apos;espèce
          </button>

          <p className="mt-4 text-center text-xs text-white/40">
            Faites des{' '}
            <span className="text-lime-400 underline decoration-lime-400/30">Défis Quotidiens</span>{' '}
            pour gagner plus de graines.
          </p>
        </section>
      </main>
    </div>
  )
}
