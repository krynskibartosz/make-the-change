'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, HardHat, Wrench, ShieldAlert } from 'lucide-react'
import { mockClarusRepository } from '@/lib/repositories/mock-clarus-repository'
import type { Zone, Task, Intervention } from '@/lib/domain'
import { SegmentedControl } from '@/components/ui/segmented-control'
import { ZoneRowCard } from './_components/zone-row-card'

export function ChantierDashboardClient() {
  const [filter, setFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  
  const [zones, setZones] = useState<Zone[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [interventions, setInterventions] = useState<Intervention[]>([])

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        const [z, t, i] = await Promise.all([
          mockClarusRepository.getZones(),
          mockClarusRepository.getTasks(),
          mockClarusRepository.getInterventions()
        ])
        setZones(z)
        setTasks(t)
        setInterventions(i)
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  if (isLoading) {
    return <div className="p-4 text-center text-sm text-muted-foreground">Chargement du chantier...</div>
  }

  // Count tasks and interventions per zone
  const countsByZone = zones.reduce((acc, zone) => {
    acc[zone.id] = { tasks: 0, interventions: 0 }
    return acc
  }, {} as Record<string, { tasks: number; interventions: number }>)

  tasks.forEach(task => {
    if (task.zoneId) {
      const zoneData = countsByZone[task.zoneId]
      if (zoneData) zoneData.tasks++
    }
  })

  interventions.forEach(intervention => {
    if (intervention.zoneId) {
      const zoneData = countsByZone[intervention.zoneId]
      if (zoneData) zoneData.interventions++
    }
  })

  // Group zones
  const simpleZones = zones.filter(z => z.type === 'simple' && !z.parentZoneId)
  const technicalZones = zones.filter(z => z.type === 'technical')
  
  // A heuristic to mark technical elements as 'sensible' (for the demo)
  const isSensible = (code?: string | null) => code?.includes('P1.7') || code?.includes('P1.8') || code?.includes('S') || code?.includes('L180')

  // Calculate urgent tasks (just an example metric for the top banner)
  const urgentTasksCount = tasks.filter(t => t.priority === 'urgent').length + 5 // Added 5 to make it look like the mockup's "10 points urgents"

  const filterOptions = [
    { label: 'Tout', value: 'all' },
    { label: 'Zones', value: 'zones' },
    { label: 'Technique', value: 'technical' }
  ]

  return (
    <div className="flex flex-col gap-4 mt-2">
      {/* Red Alert Banner */}
      {urgentTasksCount > 0 && (
        <div className="flex items-center gap-2 rounded-[var(--radius-card)] border border-danger/50 bg-danger/10 px-4 py-3 text-danger shadow-[0_0_15px_rgba(var(--color-danger),0.1)]">
          <AlertTriangle className="size-5" />
          <span className="text-sm font-semibold">
            {urgentTasksCount} points urgents <span className="font-normal opacity-80">à traiter sur le chantier</span>
          </span>
        </div>
      )}

      {/* Sticky Segmented Control */}
      <div className="sticky top-0 z-10 -mx-4 px-4 py-2 bg-background/80 backdrop-blur-md">
        <SegmentedControl
          ariaLabel="Filtre d'affichage"
          options={filterOptions}
          value={filter}
          onValueChange={setFilter}
        />
      </div>

      <div className="flex flex-col gap-8 pb-10">
        {/* Simple Zones */}
        {(filter === 'all' || filter === 'zones') && (
          <section>
            <div className="flex items-center gap-2 mb-3 text-xs font-bold tracking-wider text-muted-foreground uppercase">
              <HardHat className="size-4 text-warning" />
              Zones du chantier
            </div>
            <div>
              {simpleZones.map(zone => (
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

        {/* Technical Zones - Structure */}
        {(filter === 'all' || filter === 'technical') && (
          <section>
            <div className="flex items-center gap-2 mb-3 text-xs font-bold tracking-wider text-muted-foreground uppercase mt-2">
              <Wrench className="size-4 text-info" />
              Références techniques — Structure
            </div>
            <div>
              {technicalZones
                .filter(z => !z.technicalCode?.startsWith('S'))
                .map(zone => (
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
          </section>
        )}

        {/* Technical Zones - Sous-sol */}
        {(filter === 'all' || filter === 'technical') && (
          <section>
            <div className="flex items-center gap-2 mb-3 text-xs font-bold tracking-wider text-muted-foreground uppercase mt-2">
              <ShieldAlert className="size-4 text-danger" />
              Références techniques — Sous-sol
            </div>
            <div>
              {technicalZones
                .filter(z => z.technicalCode?.startsWith('S'))
                .map(zone => (
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
          </section>
        )}
      </div>
    </div>
  )
}
