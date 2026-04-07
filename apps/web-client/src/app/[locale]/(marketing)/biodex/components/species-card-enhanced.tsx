import { Button, Card, CardContent } from '@make-the-change/core/ui'
import type { SpeciesContext } from '@/types/context'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface SpeciesCardEnhancedProps {
  species: SpeciesContext
  showUserStatus?: boolean
}

// ─── Rareté déduite du statut de conservation IUCN ───────────────────────────
type Rarity = 'common' | 'rare' | 'legendary'

function getRarity(status: string | null | undefined): Rarity {
  switch (status?.toUpperCase()) {
    case 'EN':
    case 'CR':
    case 'EW':
    case 'EX':
      return 'legendary'
    case 'VU':
    case 'NT':
      return 'rare'
    default:
      return 'common'
  }
}

const RARITY_STYLES: Record<Rarity, { border: string; halo: string; badge: string; label: string }> = {
  common: {
    border: 'border-emerald-500/25',
    halo: 'shadow-[0_0_12px_rgba(16,185,129,0.08)]',
    badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    label: 'Commun',
  },
  rare: {
    border: 'border-blue-500/35',
    halo: 'shadow-[0_0_16px_rgba(59,130,246,0.12)]',
    badge: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    label: 'Rare',
  },
  legendary: {
    border: 'border-amber-400/45',
    halo: 'shadow-[0_0_20px_rgba(251,191,36,0.15)]',
    badge: 'bg-amber-400/15 text-amber-400 border-amber-400/20',
    label: 'Légendaire',
  },
}

export function SpeciesCardEnhanced({ species, showUserStatus = true }: SpeciesCardEnhancedProps) {
  const isLocked = showUserStatus && !species.user_status?.isUnlocked
  const rarity = getRarity(species.conservation_status)
  const rarityStyle = RARITY_STYLES[rarity]

  // ─── Description dynamique selon contexte ────────────────────────────────────
  const getLockedDescription = (): string => {
    // Si a des projets associés → message spécifique avec nom du projet
    if (species.associated_projects && species.associated_projects.length > 0) {
      const firstProject = species.associated_projects[0]
      return `Soutenez "${firstProject.name}" pour découvrir les secrets de cette espèce.`
    }

    // RÈGLE MANIFESTE : Espèces débloquées UNIQUEMENT via dons financiers
    // PAS via défis gratuits (qui donnent uniquement des badges)
    return `Soutenez un projet lié à cet habitat pour débloquer les secrets de cette espèce.`
  }

  // ─── CTA dynamique selon contexte ────────────────────────────────────────────
  const getCTA = (): { text: string; href: string; show: boolean } => {
    if (!isLocked) {
      // Espèce débloquée → Explorer la fiche
      return {
        text: '📖 Explorer la fiche',
        href: `/aventure/biodex/${species.id}`,
        show: true,
      }
    }

    // Espèce locked avec projets → Voir les projets
    if (species.associated_projects && species.associated_projects.length > 0) {
      return {
        text: '🌱 Voir les projets',
        href: '/projets',
        show: true,
      }
    }

    // Espèce locked avec challenges → Voir les défis
    if (species.associated_challenges && species.associated_challenges.length > 0) {
      return {
        text: '⚡ Voir les défis',
        href: '/aventure?tab=defis',
        show: true,
      }
    }

    // Espèce locked sans action spécifique → Pas de bouton
    return {
      text: '',
      href: '',
      show: false,
    }
  }

  const lockedDescription = getLockedDescription()
  const cta = getCTA()

  return (
    <Card
      className={cn(
        'group relative overflow-hidden rounded-3xl border bg-background/50 hover:bg-background/80 transition-all duration-300',
        rarityStyle.border,
        rarityStyle.halo,
        'hover:scale-[1.01] active:scale-[0.99]',
      )}
    >
      <CardContent className="p-6">
        {/* En-tête */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
              {species.image_url ? (
                <img
                  src={species.image_url}
                  alt=""
                  className={`h-full w-full object-cover transition-all duration-500 ${
                    isLocked ? 'brightness-0 opacity-40 contrast-125' : ''
                  }`}
                />
              ) : (
                <span className="text-2xl">{isLocked ? '🌿' : '🦋'}</span>
              )}
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight tracking-tight line-clamp-1">{species.name_default}</h3>
              <p className="text-sm text-white/50 italic line-clamp-1">{species.scientific_name}</p>
            </div>
          </div>

          {/* Badge rareté */}
          <span
            className={cn(
              'shrink-0 text-[9px] font-black uppercase tracking-widest rounded-full px-2 py-0.5 border',
              rarityStyle.badge,
            )}
          >
            {rarityStyle.label}
          </span>
        </div>

        {/* Description dynamique */}
        {isLocked ? (
          <p className="text-sm not-italic text-slate-300 mb-4 min-h-[3rem] leading-relaxed">
            {lockedDescription}
          </p>
        ) : (
          <p className="text-sm text-slate-300 mb-4 line-clamp-3 min-h-[3rem] leading-relaxed">
            {species.description_default}
          </p>
        )}

        {/* Projets associés — SANS le texte "Projets (X)" */}
        {species.associated_projects && species.associated_projects.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1.5">
              {species.associated_projects.slice(0, 3).map((project) => (
                <Link key={project.id} href={`/projects/${project.id}`}>
                  <span className="text-xs font-medium px-3 py-1 rounded-full border border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 hover:border-white/20 cursor-pointer transition-all active:scale-95">
                    {project.name}
                  </span>
                </Link>
              ))}
              {species.associated_projects.length > 3 && (
                <span className="text-xs font-medium px-3 py-1 rounded-full border border-white/10 bg-white/5 text-muted-foreground">
                  +{species.associated_projects.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Actions conditionnelles — iOS 26.4 style */}
        {cta.show && (
          <div className="flex mt-auto pt-2">
            <Button
              asChild
              className={cn(
                'w-full shadow-none font-medium transition-all active:scale-95',
                !isLocked
                  ? 'bg-lime-500/10 hover:bg-lime-500/20 text-lime-500 border border-lime-500/20'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/10',
              )}
            >
              <Link href={cta.href}>{cta.text}</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}


