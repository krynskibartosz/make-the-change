import { Badge, Button, Card, CardContent } from '@make-the-change/core/ui'
import { LinkedSpecies } from '@/types/context'
import Link from 'next/link'

interface ProductLinkedSpeciesSectionProps {
  species: LinkedSpecies[] | null
}

export function ProductLinkedSpeciesSection({ species }: ProductLinkedSpeciesSectionProps) {
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

function SpeciesCard({ species }: { species: LinkedSpecies }) {
  return (
    <Card className="rounded-2xl border-border/50 bg-background/50 hover:bg-background/80 transition-all">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
            {species.icon ? <img src={species.icon} alt="" className="w-full h-full object-cover" /> : '🦋'}
          </div>
          <div>
            <h3 className="font-bold text-lg">{species.name}</h3>
            <p className="text-sm text-muted-foreground">{species.relationship}</p>
          </div>
        </div>
        
        {species.impact && (
          <div className="mb-4 text-sm bg-muted/50 p-2 rounded-lg">
            <span className="font-semibold">Impact: </span>
            {species.impact}
          </div>
        )}
        
        <Link href={`/biodex/${species.id}`}>
          <Button size="sm" variant="outline" className="w-full">
            Voir dans le BioDex →
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
