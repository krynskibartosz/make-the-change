import { Card, CardContent } from '@make-the-change/core/ui'
import { ProductImpact } from '@/types/context'

interface ProductImpactSectionProps {
  impact: ProductImpact | null
}

export function ProductImpactSection({ impact }: ProductImpactSectionProps) {
  if (!impact) return null

  return (
    <section>
      <div className="mb-6 flex items-center gap-3">
        <div className="h-10 w-1 rounded-full bg-primary" />
        <h2 className="text-3xl font-black tracking-tight">Impact Environnemental et Social</h2>
      </div>
      
      <div className="space-y-6">
        <ImpactCategory title="Environnemental" icon="🌍">
          <ImpactRow label="Empreinte CO2" value={impact.environmental.co2Footprint} unit="kg" />
          <ImpactRow label="Usage d'eau" value={impact.environmental.waterUsage} unit="L" />
          <ImpactRow label="Impact biodiversité" value={impact.environmental.biodiversityImpact} />
          <ImpactRow label="Recyclabilité" value={impact.environmental.recyclability} unit="%" />
        </ImpactCategory>
        
        <ImpactCategory title="Social" icon="👥">
          <ImpactRow label="Emplois locaux" value={impact.social.localJobs} />
          <ImpactRow label="Commerce équitable" value={impact.social.fairTrade ? 'Oui' : 'Non'} />
          <ImpactRow label="Soutien communautaire" value={impact.social.communitySupport} />
        </ImpactCategory>
        
        <ImpactCategory title="Économique" icon="💰">
          <ImpactRow label="Revenu local" value={impact.economic.localRevenue} unit="€" />
          <ImpactRow label="Partage des bénéfices" value={impact.economic.profitSharing} unit="%" />
          <ImpactRow label="Prime durabilité" value={impact.economic.pricePremium} unit="€" />
        </ImpactCategory>
      </div>
    </section>
  )
}

function ImpactCategory({ title, icon, children }: {
  title: string
  icon: string
  children: React.ReactNode
}) {
  return (
    <Card className="rounded-2xl border-border/50 bg-background/50 hover:bg-background/80 transition-all">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span>{icon}</span>
          {title}
        </h3>
        <div className="space-y-3 divide-y divide-border/50">
          {children}
        </div>
      </CardContent>
    </Card>
  )
}

function ImpactRow({ label, value, unit }: {
  label: string
  value: number | string | null | undefined
  unit?: string
}) {
  if (value === null || value === undefined) {
    return (
      <div className="flex justify-between text-sm py-2">
        <span className="text-muted-foreground">{label}</span>
        <span className="text-muted-foreground italic">N/A</span>
      </div>
    )
  }

  const displayValue = typeof value === 'number' ? value.toLocaleString() : value
  const displayUnit = unit ? ` ${unit}` : ''

  return (
    <div className="flex justify-between text-sm py-2">
      <span className="text-muted-foreground font-medium">{label}</span>
      <span className="font-bold">{displayValue}{displayUnit}</span>
    </div>
  )
}
