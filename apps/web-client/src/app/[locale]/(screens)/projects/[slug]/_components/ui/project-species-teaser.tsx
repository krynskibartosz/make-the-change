import { Lock } from 'lucide-react'
import type { ProjectSpecies } from '@/app/[locale]/(screens)/projects/_types/project'
import { sanitizeImageUrl } from '@/lib/image-url'

type RarityLabel = 'COMMUN' | 'RARE' | 'LÉGENDAIRE'

const RARITY_MUTED_COLOR: Record<RarityLabel, string> = {
  COMMUN: 'text-emerald-400/60',
  RARE: 'text-sky-400/60',
  LÉGENDAIRE: 'text-amber-400/60',
}

function getRarityLabel(status: string, rarity: number): RarityLabel {
  const s = status?.toUpperCase() ?? ''
  if (s === 'CR' || s === 'EN' || s === 'EW' || s === 'EX') return 'LÉGENDAIRE'
  if (s === 'VU' || s === 'NT') return 'RARE'
  if (s === 'LC' || s === 'DD' || s === 'NE') return 'COMMUN'
  if (rarity >= 8) return 'LÉGENDAIRE'
  if (rarity >= 5) return 'RARE'
  return 'COMMUN'
}

function isKeySpecies(role: string): boolean {
  const r = role?.toLowerCase() ?? ''
  return r.includes('cle') || r.includes('clé')
}

type ProjectSpeciesTeaserProps = {
  species?: ProjectSpecies[] | null
  accentColor?: string
}

export function ProjectSpeciesTeaser({
  species,
  accentColor = 'rgba(52, 211, 153, 0.75)',
}: ProjectSpeciesTeaserProps) {
  if (!species || species.length === 0) return null

  const keySpecies = species.filter((s) => isKeySpecies(s.role))
  const safePrimary = keySpecies.length > 0 ? keySpecies : species.slice(0, 1)
  const primaryIds = new Set(safePrimary.map((s) => s.id))
  const associated = species.filter((s) => !primaryIds.has(s.id))
  const ordered = [...safePrimary, ...associated]

  const subtitle =
    (safePrimary.length > 1 ? `${safePrimary.length} espèces clés` : '1 espèce clé') +
    (associated.length > 0
      ? ` · ${associated.length} associée${associated.length > 1 ? 's' : ''}`
      : '')

  return (
    <section aria-labelledby="project-species-title">
      <div className="mb-3 flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <h2
            id="project-species-title"
            className="text-[18px] font-black leading-none tracking-[-0.03em] text-white"
          >
            BioDex du projet
          </h2>
          <p className="mt-1 text-[12px] leading-snug text-white/50">{subtitle}</p>
        </div>
      </div>

      <div className="-mx-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-5 sm:px-5">
        <div className="flex gap-3 pr-4">
          {ordered.map((sp) => (
            <SpeciesThumb
              key={sp.id}
              species={sp}
              isPrimary={primaryIds.has(sp.id)}
              accentColor={accentColor}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function SpeciesThumb({
  species,
  isPrimary,
  accentColor,
}: {
  species: ProjectSpecies
  isPrimary: boolean
  accentColor: string
}) {
  const rarityLabel = getRarityLabel(species.status, species.rarity)
  const imageUrl = sanitizeImageUrl(species.icon)

  return (
    <div className="group relative w-[86px] shrink-0">
      <div
        className={`relative h-[72px] overflow-hidden rounded-[22px] bg-white/[0.045] ring-1 transition ${
          isPrimary ? 'ring-lime-300/35' : 'ring-white/[0.08]'
        }`}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={species.name}
            className="h-full w-full object-cover opacity-[0.18] blur-[2px]"
          />
        ) : (
          <div className="h-full w-full bg-white/[0.03]" />
        )}

        <div className="absolute inset-0 grid place-items-center bg-black/25">
          <Lock className="h-4 w-4 text-white/70" />
        </div>

        {isPrimary && (
          <div className="absolute left-1.5 top-1.5 rounded-full bg-lime-300 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.06em] text-black">
            Clé
          </div>
        )}
      </div>

      <p className="mt-2 line-clamp-2 text-[12px] font-extrabold leading-[1.05] text-white/40">
        {species.name}
      </p>

      <p
        className={`mt-1 text-[9px] font-black uppercase tracking-[0.07em] ${
          isPrimary ? RARITY_MUTED_COLOR[rarityLabel] : 'text-white/25'
        }`}
      >
        {isPrimary ? 'Espèce clé' : 'À découvrir'}
      </p>
    </div>
  )
}
