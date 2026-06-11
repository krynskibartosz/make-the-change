'use client'

import { AlertTriangle, Map, HardHat, ShieldAlert, Wrench, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { SegmentedControl } from '@/components/ui/segmented-control'
import { Card } from '@/components/ui'
import type { Intervention, Task, Zone, Plan } from '@/lib/domain'
import { mockClarusRepository } from '@/lib/repositories/mock-clarus-repository'
import { ZoneRowCard } from './_components/zone-row-card'
import Link from 'next/link'

export function ChantierDashboardClient() {
  const [filter, setFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)

  const [zones, setZones] = useState<Zone[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [interventions, setInterventions] = useState<Intervention[]>([])
  const [plans, setPlans] = useState<Plan[]>([])

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        const [z, t, i, p] = await Promise.all([
          mockClarusRepository.getZones(),
          mockClarusRepository.getTasks(),
          mockClarusRepository.getInterventions(),
          mockClarusRepository.getPlans(),
        ])
        setZones(z)
        setTasks(t)
        setInterventions(i)
        setPlans(p)
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  if (isLoading) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">Chargement du chantier...</div>
    )
  }

  // Count tasks and interventions per zone
  const countsByZone = zones.reduce(
    (acc, zone) => {
      acc[zone.id] = { tasks: 0, interventions: 0 }
      return acc
    },
    {} as Record<string, { tasks: number; interventions: number }>,
  )

  tasks.forEach((task) => {
    if (task.zoneId) {
      const zoneData = countsByZone[task.zoneId]
      if (zoneData) zoneData.tasks++
    }
  })

  interventions.forEach((intervention) => {
    if (intervention.zoneId) {
      const zoneData = countsByZone[intervention.zoneId]
      if (zoneData) zoneData.interventions++
    }
  })

  // Group zones
  const simpleZones = zones.filter((z) => z.type === 'simple' && !z.parentZoneId)
  const technicalZones = zones.filter((z) => z.type === 'technical')

  // A heuristic to mark technical elements as 'sensible' (for the demo)
  const isSensible = (code?: string | null) =>
    code?.includes('P1.7') ||
    code?.includes('P1.8') ||
    code?.includes('S') ||
    code?.includes('L180')

  // Calculate urgent tasks
  const urgentTasksCount = tasks.filter((t) => t.priority === 'urgent').length + 5

  const filterOptions = [
    { label: 'Plans', value: 'plans' },
    { label: 'Zones', value: 'zones' },
    { label: 'Technique', value: 'technical' },
  ]

  // Default filter logic if 'all' is not present in options but is the initial state
  const currentFilter = filter === 'all' ? 'plans' : filter

  return (
    <div className="flex flex-col gap-4 mt-2">
      {/* Red Alert Banner */}
      {urgentTasksCount > 0 && (
        <div className="flex items-center gap-2 rounded-[var(--radius-card)] border border-danger/50 bg-danger/10 px-4 py-3 text-danger shadow-[0_0_15px_rgba(var(--color-danger),0.1)] active:scale-[0.98] transition-transform cursor-pointer">
          <AlertTriangle className="size-5 shrink-0" />
          <span className="text-sm font-semibold">
            {urgentTasksCount} points urgents{' '}
            <span className="font-normal opacity-80">à traiter</span>
          </span>
          <ChevronRight className="size-4 ml-auto opacity-70" />
        </div>
      )}

      {/* Sticky Segmented Control */}
      <div className="sticky top-0 z-10 -mx-4 px-4 py-2 bg-background/95 backdrop-blur-md">
        <SegmentedControl
          ariaLabel="Filtre d'affichage"
          options={filterOptions}
          value={currentFilter}
          onValueChange={setFilter}
        />
      </div>

      <div className="flex flex-col gap-8 pb-10">
        
        {/* Plans */}
        {currentFilter === 'plans' && (
          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-1 text-sm font-bold tracking-wider text-muted-foreground uppercase">
              <Map className="size-4 text-primary" />
              Plans du projet
            </div>
            <div className="grid gap-3">
              {plans.map((plan) => (
                <Link key={plan.id} href={`/chantier/plans/${plan.id}`}>
                  <Card className="flex flex-col overflow-hidden bg-surface hover:bg-surface-elevated transition-colors border-border/50 group cursor-pointer active:scale-[0.98]">
                    <div className="relative h-32 w-full bg-muted border-b border-border/50">
                      <img 
                        src={plan.url} 
                        alt={plan.title} 
                        className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity" 
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).src = 'https://placehold.co/400x200/1e293b/475569?text=Plan'
                        }}
                      />
                      <div className="absolute top-2 right-2 rounded-full bg-background/80 backdrop-blur-sm px-2 py-0.5 text-xs font-bold text-foreground shadow-sm">
                        Plan
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="text-base font-bold text-foreground line-clamp-1">{plan.title}</h3>
                      {plan.description && (
                        <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{plan.description}</p>
                      )}
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {plan.id === 'plan-1' ? (
                          <>
                            <span className="flex items-center gap-1 rounded bg-red-500/10 px-1.5 py-0.5 text-[10px] font-bold uppercase text-red-600 dark:text-red-400">
                              <AlertTriangle className="size-3" /> 3 urgents
                            </span>
                            <span className="flex items-center gap-1 rounded bg-surface-elevated border border-border px-1.5 py-0.5 text-[10px] font-bold uppercase text-muted-foreground">
                              2 tâches
                            </span>
                            <span className="flex items-center gap-1 rounded bg-surface-elevated border border-border px-1.5 py-0.5 text-[10px] font-bold uppercase text-muted-foreground">
                              5 réf.
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="flex items-center gap-1 rounded bg-surface-elevated border border-border px-1.5 py-0.5 text-[10px] font-bold uppercase text-muted-foreground">
                              0 urgent
                            </span>
                            <span className="flex items-center gap-1 rounded bg-surface-elevated border border-border px-1.5 py-0.5 text-[10px] font-bold uppercase text-muted-foreground">
                              1 tâche
                            </span>
                            <span className="flex items-center gap-1 rounded bg-surface-elevated border border-border px-1.5 py-0.5 text-[10px] font-bold uppercase text-muted-foreground">
                              2 réf.
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Simple Zones */}
        {currentFilter === 'zones' && (
          <section>
            <div className="flex items-center gap-2 mb-3 text-sm font-bold tracking-wider text-muted-foreground uppercase">
              <HardHat className="size-4 text-warning" />
              Zones d'intervention
            </div>
            <div>
              {simpleZones.map((zone) => (
                <ZoneRowCard
                  key={zone.id}
                  id={zone.id}
                  name={zone.name}
                  tasksCount={countsByZone[zone.id]?.tasks ?? 0}
                  interventionsCount={countsByZone[zone.id]?.interventions ?? 0}
                />
              ))}
            </div>
          </section>
        )}

        {/* Technical Zones */}
        {currentFilter === 'technical' && (
          <section className="flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3 text-sm font-bold tracking-wider text-muted-foreground uppercase mt-2">
                <Wrench className="size-4 text-info" />
                Structure & Techniques
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Éléments structurels nécessitant une attention particulière ou une validation avant fermeture.
              </p>
              <div>
                {technicalZones
                  .filter((z) => !z.technicalCode?.startsWith('S'))
                  .map((zone) => (
                    <ZoneRowCard
                      key={zone.id}
                      id={zone.id}
                      name={zone.name}
                      tasksCount={countsByZone[zone.id]?.tasks ?? 0}
                      interventionsCount={countsByZone[zone.id]?.interventions ?? 0}
                      isTechnical={true}
                      technicalCode={zone.technicalCode}
                      planReference={zone.planReference}
                      isSensible={isSensible(zone.technicalCode)}
                    />
                  ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3 text-sm font-bold tracking-wider text-muted-foreground uppercase mt-2">
                <ShieldAlert className="size-4 text-danger" />
                Sous-sol & Fondations
              </div>
              <div>
                {technicalZones
                  .filter((z) => z.technicalCode?.startsWith('S'))
                  .map((zone) => (
                    <ZoneRowCard
                      key={zone.id}
                      id={zone.id}
                      name={zone.name}
                      tasksCount={countsByZone[zone.id]?.tasks ?? 0}
                      interventionsCount={countsByZone[zone.id]?.interventions ?? 0}
                      isTechnical={true}
                      technicalCode={zone.technicalCode}
                      planReference={zone.planReference}
                      isSensible={isSensible(zone.technicalCode)}
                    />
                  ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
