import { Button, Card, CardContent } from '@make-the-change/core/ui'
import type { SpeciesContext } from '@/types/context'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ChevronRight, Lock } from 'lucide-react'

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

  // ─── Déblocage/Redirection Ciblé (Locked ET Unlocked) ────────────────────────
  // Si locked OU (unlocked avec 1 seul projet) → Redirection vers projet
  const shouldRedirectToProject = species.associated_projects && species.associated_projects.length === 1
  
  const unlockTarget = shouldRedirectToProject
    ? {
        type: 'project' as const,
        slug: species.associated_projects[0].slug || species.associated_projects[0].id,
        name: species.associated_projects[0].name,
      }
    : null

  // ─── Texte de Quête Spécifique (Locked uniquement) ───────────────────────────
  const getQuestDescription = (): string => {
    if (unlockTarget) {
      return `Soutenez le projet "${unlockTarget.name}" pour révéler les secrets de cette espèce.`
    }
    // Fallback si pas de projet spécifique
    return `Soutenez un projet lié à cet habitat pour débloquer les secrets de cette espèce.`
  }

  const questDescription = getQuestDescription()

  // ─── Card Content (commun locked/unlocked) ───────────────────────────────────
  const cardContent = (
    <CardContent className="p-6 relative">
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

      {/* Description / Quête */}
      {isLocked ? (
        <div className="mb-4">
          <p className="text-sm text-muted-foreground leading-relaxed min-h-[3rem]">
            {questDescription}
          </p>
        </div>
      ) : (
        <p className="text-sm text-slate-300 mb-4 line-clamp-3 min-h-[3rem] leading-relaxed">
          {species.description_default}
        </p>
      )}

      {/* Projets associés (unlocked avec PLUSIEURS projets uniquement) */}
      {!isLocked && species.associated_projects && species.associated_projects.length > 1 && (
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

      {/* CTA pour unlocked SANS projet unique (plusieurs projets ou aucun) */}
      {!isLocked && !unlockTarget && (
        <div className="flex mt-auto pt-2">
          <Button
            asChild
            className="w-full bg-lime-500/10 hover:bg-lime-500/20 text-lime-500 border border-lime-500/20 shadow-none font-medium transition-all active:scale-95"
          >
            <Link href={`/aventure/biodex/${species.id}`}>📖 Explorer la fiche</Link>
          </Button>
        </div>
      )}

      {/* Indicateur interactivité (locked OU unlocked avec 1 projet) */}
      {unlockTarget && (
        <div className="absolute bottom-4 right-4 flex items-center gap-1 text-white/30">
          {isLocked && <Lock className="w-3 h-3" />}
          <ChevronRight className="w-4 h-4" />
        </div>
      )}
    </CardContent>
  )

  // ─── Rendu : Card Cliquable ou Card Standard ─────────────────────────────────
  if (unlockTarget) {
    // Locked AVEC quête OU Unlocked avec 1 SEUL projet : Card cliquable vers projet
    return (
      <Link href={`/projets/${unlockTarget.slug}`} className="block">
        <Card
          className={cn(
            'group relative overflow-hidden rounded-3xl border bg-background/50 hover:bg-background/80 transition-all duration-300 cursor-pointer',
            rarityStyle.border,
            rarityStyle.halo,
            'hover:scale-[1.01] active:scale-[0.98]',
          )}
        >
          {cardContent}
        </Card>
      </Link>
    )
  }

  // Unlocked SANS projet unique OU Locked sans projet : Card standard
  return (
    <Card
      className={cn(
        'group relative overflow-hidden rounded-3xl border bg-background/50 hover:bg-background/80 transition-all duration-300',
        rarityStyle.border,
        rarityStyle.halo,
        !isLocked && 'hover:scale-[1.01] active:scale-[0.99]',
      )}
    >
      {cardContent}
    </Card>
  )
}


