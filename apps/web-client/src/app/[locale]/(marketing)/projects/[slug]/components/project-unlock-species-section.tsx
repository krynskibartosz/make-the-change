import { Card, CardContent } from '@make-the-change/core/ui'
import { Lock } from 'lucide-react'
import type { ProjectSpecies } from '@/types/context'

interface ProjectUnlockSpeciesSectionProps {
  species: ProjectSpecies | null
}

const BIODEX_REWARD_IMAGE_URL = '/images/diorama-chouette.png'

export function ProjectUnlockSpeciesSection({ species }: ProjectUnlockSpeciesSectionProps) {
  if (!species) return null

  const imageUrl = species.icon || BIODEX_REWARD_IMAGE_URL

  return (
    <section>
      <div className="mb-6 flex items-center gap-3">
        <div className="h-10 w-1 rounded-full bg-primary" />
        <h2 className="text-3xl font-black tracking-tight">Espèce débloquable</h2>
      </div>

      <Card className="overflow-hidden rounded-2xl border-emerald-500/20 bg-gradient-to-br from-emerald-950/60 to-background shadow-lg shadow-emerald-900/20">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-lime-400 font-bold text-[11px] tracking-widest uppercase">
              Récompense projet
            </span>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-3">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5">
              <img
                src={imageUrl}
                alt={`Espèce déblocable: ${species.name}`}
                className="h-full w-full object-cover brightness-0 opacity-50"
              />
              <Lock className="absolute bottom-1 right-1 h-3.5 w-3.5 text-white/50" />
            </div>

            <div className="min-w-0">
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider">
                Espèce à débloquer
              </p>
              <p className="truncate text-base font-bold text-white">{species.name}</p>
              {species.scientificName ? (
                <p className="truncate text-xs italic text-muted-foreground">{species.scientificName}</p>
              ) : null}
            </div>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Soutenez ce projet pour contribuer au déblocage de cette espèce dans le BioDex.
          </p>
        </CardContent>
      </Card>
    </section>
  )
}
