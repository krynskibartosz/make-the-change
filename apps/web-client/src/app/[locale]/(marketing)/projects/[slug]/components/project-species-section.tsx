import { Badge, Button, Card, CardContent } from '@make-the-change/core/ui'
import { ProjectSpecies } from '@/types/context'
import Link from 'next/link'

interface ProjectSpeciesSectionProps {
  species: ProjectSpecies[] | null
}

export function ProjectSpeciesSection({ species }: ProjectSpeciesSectionProps) {
  if (!species || species.length === 0) return null

  return (
    <section>
      <div className="mb-6 flex items-center gap-3">
        <div className="h-10 w-1 rounded-full bg-primary" />
        <h2 className="text-3xl font-black tracking-tight">Espèces Protégées</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {species.map((sp) => (
          <SpeciesCard key={sp.id} species={sp} />
        ))}
      </div>
    </section>
  )
}

function SpeciesCard({ species }: { species: ProjectSpecies }) {
  return (
    <Card className="rounded-2xl border-border/50 bg-background/50 hover:bg-background/80 transition-all">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl overflow-hidden">
            {species.icon ? <img src={species.icon} alt="" className="w-full h-full object-cover" /> : '🦋'}
          </div>
          <div>
            <h3 className="font-bold text-lg">{species.name}</h3>
            <p className="text-sm text-muted-foreground italic">{species.scientificName}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm mb-4">
          <Badge variant={getConservationStatusVariant(species.status)}>
            {species.status}
          </Badge>
          <Badge variant="outline" className="text-muted-foreground">
            Rareté: {species.rarity}/10
          </Badge>
          <Badge variant="secondary">
            {species.role}
          </Badge>
        </div>
        <div className="mt-2">
          <Link href={`/biodex/${species.id}`}>
            <Button size="sm" variant="outline" className="w-full">
              Voir dans le BioDex →
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

function getConservationStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status?.toLowerCase()) {
    case 'cr':
    case 'en':
    case 'vu':
      return 'destructive'
    case 'nt':
    case 'lc':
      return 'secondary'
    default:
      return 'outline'
  }
}
