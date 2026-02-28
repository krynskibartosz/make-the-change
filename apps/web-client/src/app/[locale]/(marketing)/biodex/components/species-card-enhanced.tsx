import { Badge, Button, Card, CardContent } from '@make-the-change/core/ui'
import { SpeciesContext } from '@/types/context'
import Link from 'next/link'

interface SpeciesCardEnhancedProps {
  species: SpeciesContext
  showUserStatus?: boolean
}

export function SpeciesCardEnhanced({ species, showUserStatus = true }: SpeciesCardEnhancedProps) {
  return (
    <Card className="group relative overflow-hidden rounded-3xl border border-border/50 bg-background/50 hover:bg-background/80 hover:shadow-lg transition-all">
      <CardContent className="p-6">
        {/* En-tête avec statut utilisateur */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
              {species.image_url ? (
                <img src={species.image_url} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="text-2xl">🦋</span>
              )}
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight line-clamp-1">{species.name_default}</h3>
              <p className="text-sm text-muted-foreground italic line-clamp-1">{species.scientific_name}</p>
            </div>
          </div>
          
          {showUserStatus && species.user_status?.isUnlocked && (
            <Badge variant="secondary" className="bg-primary/10 text-primary whitespace-nowrap">
              Niv. {species.user_status.progressionLevel}
            </Badge>
          )}
        </div>
        
        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3 min-h-[3rem]">
          {species.description_default}
        </p>
        
        {/* Statut de conservation */}
        <div className="flex items-center gap-2 mb-4">
          <Badge variant={getConservationStatusVariant(species.conservation_status)}>
            {species.conservation_status}
          </Badge>
        </div>
        
        {/* Projets associés */}
        {species.associated_projects && species.associated_projects.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold mb-2 uppercase tracking-wider text-muted-foreground">Projets ({species.associated_projects.length})</p>
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
        
        {/* Actions utilisateur */}
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

function getConservationStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
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
