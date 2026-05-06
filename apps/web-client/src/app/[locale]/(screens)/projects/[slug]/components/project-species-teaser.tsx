import { Lock } from 'lucide-react'

const BIODEX_REWARD_IMAGE_URL = '/images/diaromas/abeille noire.png'

type ProjectSpeciesTeaserProps = {
  isDonationProject?: boolean
  accentColor?: string
}

export function ProjectSpeciesTeaser({
  isDonationProject = false,
  accentColor = 'rgba(52, 211, 153, 0.75)', // emerald-400/75 par défaut
}: ProjectSpeciesTeaserProps) {
  return (
    <article className="flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.05] to-transparent p-4">
      <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black/50">
        <img
          src={BIODEX_REWARD_IMAGE_URL}
          alt={isDonationProject ? "Silhouette d'une espèce marine" : "Silhouette de l'Abeille Noire"}
          className="h-full w-full object-cover brightness-0 opacity-40"
        />
        <div className="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white/10 border border-white/15 backdrop-blur-sm">
          <Lock className="h-3 w-3 text-white/80" />
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <p
          className="mb-0.5 text-xs font-bold uppercase tracking-widest"
          style={{ color: accentColor }}
        >
          Espèce associée
        </p>
        <p className="text-base font-bold text-white">
          {isDonationProject ? 'Espèce marine' : "L'Abeille Noire"}
        </p>
        <p className="mt-1 text-sm leading-snug text-white/55">
          Soutenez ce projet pour débloquer cette espèce dans votre BioDex.
        </p>
      </div>
    </article>
  )
}
