'use client'

import {
  AlertTriangle,
  CalendarDays,
  ChevronRight,
  HardHat,
  Map as MapIcon,
  ShieldAlert,
  Wrench,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Card } from '@/components/ui'
import { SegmentedControl } from '@/components/ui/segmented-control'
import { ProjectSwitcher } from '@/features/projects/components/project-switcher'
import type { Intervention, Phase, Plan, Task, Zone } from '@/lib/domain'
import { mockClarusRepository } from '@/lib/repositories/mock-clarus-repository'
import { ZoneRowCard } from './_components/zone-row-card'

export function ChantierDashboardClient() {
  const [filter, setFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)

  const [zones, setZones] = useState<Zone[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [interventions, setInterventions] = useState<Intervention[]>([])
  const [plans, setPlans] = useState<Plan[]>([])
  const [phases, setPhases] = useState<Phase[]>([])
  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        const [z, t, i, p, ph] = await Promise.all([
          mockClarusRepository.getZones(),
          mockClarusRepository.getTasks(),
          mockClarusRepository.getInterventions(),
          mockClarusRepository.getPlans(),
          mockClarusRepository.getPhases(),
        ])
        setZones(z)
        setTasks(t)
        setInterventions(i)
        setPlans(p)
        setPhases(ph)
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
      <div className="flex justify-end -mt-10 mb-2 relative z-20 px-4">
        <ProjectSwitcher />
      </div>

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

      {/* Quick Access to Planning Hub */}
      <Link href="/roadmap-viewer" className="mt-2 block">
        <Card className="flex items-center gap-3 border-primary/20 bg-primary/5 p-4 transition-colors hover:bg-primary/10 active:scale-[0.99]">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary">
            <CalendarDays className="size-5" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="text-base font-bold leading-tight text-primary">
              Planning et tâches
            </span>
            <span className="mt-0.5 text-sm text-muted-foreground">
              {phases.filter((phase) => phase.status === 'in_progress').length} phases en cours ·
              résumé d’abord
            </span>
          </div>
          <ChevronRight className="size-5 text-primary/50" />
        </Card>
      </Link>

      <div className="flex flex-col gap-8 pb-10">
        {/* Filter for Structure */}
        <div className="mb-2">
          <SegmentedControl
            ariaLabel="Filtre de structure"
            options={filterOptions}
            value={currentFilter}
            onValueChange={setFilter}
          />
        </div>
        {currentFilter === 'plans' && (
          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-1 text-sm font-bold tracking-wider text-muted-foreground uppercase">
              <MapIcon className="size-4 text-primary" />
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
                          ;(e.target as HTMLImageElement).src =
                            'https://placehold.co/400x200/1e293b/475569?text=Plan'
                        }}
                      />
                      <div className="absolute top-2 right-2 rounded-full bg-background/80 backdrop-blur-sm px-2 py-0.5 text-xs font-bold text-foreground shadow-sm">
                        Plan
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="text-base font-bold text-foreground line-clamp-1">
                        {plan.title}
                      </h3>
                      {plan.description && (
                        <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                          {plan.description}
                        </p>
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
                Éléments structurels nécessitant une attention particulière ou une validation avant
                fermeture.
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
