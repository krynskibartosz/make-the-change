import { Badge, Button, Card, CardContent } from '@make-the-change/core/ui'
import { SupportedProject } from '@/types/context'
import Link from 'next/link'

interface ProductSupportedProjectsSectionProps {
  projects: SupportedProject[] | null
}

export function ProductSupportedProjectsSection({ projects }: ProductSupportedProjectsSectionProps) {
  if (!projects || projects.length === 0) return null

  return (
    <section>
      <div className="mb-6 flex items-center gap-3">
        <div className="h-10 w-1 rounded-full bg-primary" />
        <h2 className="text-3xl font-black tracking-tight">Projets Soutenus</h2>
      </div>
      <div className="space-y-4">
        {projects.map((project) => (
          <SupportedProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  )
}

function SupportedProjectCard({ project }: { project: SupportedProject }) {
  return (
    <Card className="rounded-2xl border-border/50 bg-background/50 hover:bg-background/80 transition-all">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">{project.name}</h3>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {project.impactPercentage}% reversés
          </Badge>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            🌱 {project.ecosystem || 'Écosystème non spécifié'}
          </span>
          <span>•</span>
          <Badge variant={getStatusVariant(project.status)}>
            {project.status}
          </Badge>
        </div>
        <Link href={`/projects/${project.id}`}>
          <Button size="sm" variant="outline" className="w-full">
            Voir le projet →
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status?.toLowerCase()) {
    case 'active':
      return 'default'
    case 'completed':
      return 'secondary'
    default:
      return 'outline'
  }
}
