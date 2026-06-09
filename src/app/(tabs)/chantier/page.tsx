import { Badge, Card } from '@/components/ui'
import { clarusRepository } from '@/lib/repositories'
import { TabScreen } from '../_components/tab-screen'

export default async function ProjectPage() {
  const [zones, phases, people, tasks] = await Promise.all([
    clarusRepository.getZones(),
    clarusRepository.getPhases(),
    clarusRepository.getPeople(),
    clarusRepository.getTasks(),
  ])

  const simpleZones = zones.filter((z) => z.type === 'simple').sort((a, b) => a.order - b.order)
  const technicalZones = zones
    .filter((z) => z.type === 'technical')
    .sort((a, b) => a.order - b.order)
  const sortedPhases = [...phases].sort((a, b) => a.order - b.order)
  const activePeople = people.filter((p) => p.active)

  return (
    <TabScreen title="Chantier">
      <div className="flex flex-col gap-8">
        {/* Taches */}
        {tasks.length > 0 && (
          <section>
            <h2 className="mb-4 font-semibold text-foreground">Taches a faire</h2>
            <div className="flex flex-col gap-2">
              {tasks.map((task) => (
                <Card key={task.id} className="flex flex-col p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-foreground">{task.title}</p>
                    <Badge tone={task.status === 'to_do' ? 'neutral' : 'success'}>
                      {task.status === 'to_do' ? 'A faire' : 'Termine'}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Priorite: {task.priority}
                    {task.assignedTo &&
                      (() => {
                        const assignee = people.find((p) => p.id === task.assignedTo)
                        return assignee ? ` - Assigne a: ${assignee.name}` : ''
                      })()}
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Zones */}
        <section>
          <h2 className="mb-4 font-semibold text-foreground">Zones</h2>

          <div className="mb-2 text-sm font-medium text-muted-foreground">Zones simples</div>
          <div className="mb-4 flex flex-col gap-2">
            {simpleZones.map((zone) => (
              <Card key={zone.id} className="p-4">
                <p className="font-medium text-foreground">{zone.name}</p>
              </Card>
            ))}
          </div>

          <div className="mb-2 text-sm font-medium text-muted-foreground">Zones techniques</div>
          <div className="flex flex-col gap-2">
            {technicalZones.map((zone) => (
              <Card key={zone.id} className="flex items-center justify-between p-4">
                <p className="font-medium text-foreground">{zone.name}</p>
                {zone.technicalCode && (
                  <span className="text-xs font-mono text-muted-foreground">
                    {zone.technicalCode}
                  </span>
                )}
              </Card>
            ))}
          </div>
        </section>

        {/* Phases */}
        <section>
          <h2 className="mb-4 font-semibold text-foreground">Phases</h2>
          <div className="flex flex-col gap-2">
            {sortedPhases.map((phase, index) => (
              <Card key={phase.id} className="flex items-center gap-3 p-4">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-surface-elevated text-xs font-semibold text-muted-foreground">
                  {index + 1}
                </span>
                <p className="font-medium text-foreground">{phase.name}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Personnes */}
        <section>
          <h2 className="mb-4 font-semibold text-foreground">Equipe ({activePeople.length})</h2>
          <div className="flex flex-wrap gap-2">
            {activePeople.map((person) => (
              <Badge key={person.id} tone="neutral" className="px-3 py-1.5 text-sm">
                {person.name}
              </Badge>
            ))}
          </div>
        </section>
      </div>
    </TabScreen>
  )
}
