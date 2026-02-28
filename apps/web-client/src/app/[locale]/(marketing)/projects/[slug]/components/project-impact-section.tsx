import { Card, CardContent } from '@make-the-change/core/ui'
import { ProjectImpact } from '@/types/context'

interface ProjectImpactSectionProps {
  impact: ProjectImpact | null
}

export function ProjectImpactSection({ impact }: ProjectImpactSectionProps) {
  if (!impact) return null

  return (
    <section>
      <div className="mb-6 flex items-center gap-3">
        <div className="h-10 w-1 rounded-full bg-primary" />
        <h2 className="text-3xl font-black tracking-tight">Impact Attendu</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ImpactMetric
          label="CO2 Absorbé"
          value={impact.co2Absorbed ? `${impact.co2Absorbed} kg` : 'N/A'}
          icon="🌍"
          trend="positive"
        />
        <ImpactMetric
          label="Biodiversité"
          value={impact.biodiversityGain ? `${impact.biodiversityGain} pts` : 'N/A'}
          icon="🦋"
          trend="positive"
        />
        <ImpactMetric
          label="Emplois Créés"
          value={impact.jobsCreated ? `${impact.jobsCreated}` : 'N/A'}
          icon="👥"
          trend="positive"
        />
        <ImpactMetric
          label="Timeline"
          value={impact.timeline ? `${impact.timeline} mois` : 'N/A'}
          icon="📅"
          trend="neutral"
        />
      </div>
    </section>
  )
}

function ImpactMetric({ label, value, icon, trend }: {
  label: string
  value: string
  icon: string
  trend: 'positive' | 'neutral' | 'negative'
}) {
  return (
    <Card className="rounded-2xl border-border/50 bg-background/50 hover:bg-background/80 transition-all text-center">
      <CardContent className="p-6">
        <div className="text-3xl mb-3">{icon}</div>
        <div className="font-bold text-lg">{value}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
        {trend !== 'neutral' && (
          <div className={`mt-2 text-xs font-bold ${
            trend === 'positive' ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend === 'positive' ? '↗️' : '↘️'}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
