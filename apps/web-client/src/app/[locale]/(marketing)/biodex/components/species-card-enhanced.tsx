import { Badge, Button, Card, CardContent } from '@make-the-change/core/ui'
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

  return (
    <Card
      className={cn(
        'group relative overflow-hidden rounded-3xl border bg-background/50 hover:bg-background/80 transition-all duration-300',
        rarityStyle.border,
        rarityStyle.halo,
        'hover:scale-[1.01]',
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
                    isLocked ? 'brightness-0 opacity-50 contrast-125' : ''
                  }`}
                />
              ) : (
                <span className="text-2xl">{isLocked ? '🌿' : '🦋'}</span>
              )}
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight line-clamp-1">{species.name_default}</h3>
              <p className="text-sm text-muted-foreground italic line-clamp-1">{species.scientific_name}</p>
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

        {/* Description */}
        {isLocked ? (
          <p className="text-sm text-muted-foreground italic mb-4 min-h-[3rem] leading-relaxed">
            Soutenez un projet lié à cet habitat pour débloquer les secrets de cette espèce.
          </p>
        ) : (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3 min-h-[3rem]">
            {species.description_default}
          </p>
        )}

        {/* Statut de conservation */}
        <div className="flex items-center gap-2 mb-4">
          <Badge variant={getConservationStatusVariant(species.conservation_status)}>
            {species.conservation_status}
          </Badge>
        </div>

        {/* Projets associés */}
        {species.associated_projects && species.associated_projects.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold mb-2 uppercase tracking-wider text-muted-foreground">
              Projets ({species.associated_projects.length})
            </p>
            <div className="flex flex-wrap gap-1">
              {species.associated_projects.slice(0, 3).map((project) => (
                <Link key={project.id} href={`/projects/${project.id}`}>
                  <Badge variant="outline" className="text-xs hover:bg-muted cursor-pointer">
                    {project.name}
                  </Badge>
                </Link>
              ))}
              {species.associated_projects.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{species.associated_projects.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-2">
          {showUserStatus && species.user_status?.isUnlocked ? (
            <>
              <Link href={`/biodex/${species.id}`} className="flex-1">
                <Button size="sm" variant="outline" className="w-full">
                  Observer
                </Button>
              </Link>
              <Button size="sm" className="flex-1">
                Contribuer
              </Button>
            </>
          ) : (
            <Link href={`/biodex/${species.id}`} className="w-full">
              <Button size="sm" variant="secondary" className="w-full opacity-80">
                🔒 Voir détails
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function getConservationStatusVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status?.toUpperCase()) {
    case 'CR':
    case 'EN':
    case 'VU':
      return 'destructive'
    case 'NT':
    case 'LC':
      return 'secondary'
    default:
      return 'outline'
  }
}
