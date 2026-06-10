'use client'

import {
  AlertTriangle,
  ChevronRight,
  ClipboardList,
  Clock,
  HardHat,
  ShieldAlert,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { FullScreenSlideModal } from '@/app/@modal/_components/full-screen-slide-modal'
import type { Intervention, Task, Zone } from '@/lib/domain'
import { mockClarusRepository } from '@/lib/repositories/mock-clarus-repository'
import { ZoneDetailClient } from './zone-detail-client'

type ZoneWithStats = Zone & {
  urgentTaskCount: number
  openTaskCount: number
  interventionCount: number
}

type ZoneGroup = {
  title: string
  icon: LucideIcon
  iconColor: string
  zones: ZoneWithStats[]
}

function buildZoneStats(
  zones: Zone[],
  tasks: Task[],
  interventions: Intervention[],
): ZoneWithStats[] {
  return zones.map((zone) => {
    const zoneTasks = tasks.filter((t) => t.zoneId === zone.id)
    const zoneInterventions = interventions.filter((i) => i.zoneId === zone.id)
    return {
      ...zone,
      urgentTaskCount: zoneTasks.filter(
        (t) =>
          (t.priority === 'urgent' || t.priority === 'high') &&
          t.status !== 'done',
      ).length,
      openTaskCount: zoneTasks.filter((t) => t.status !== 'done').length,
      interventionCount: zoneInterventions.length,
    }
  })
}

function groupZones(zones: ZoneWithStats[]): ZoneGroup[] {
  // Operational zones (simple type, no parent)
  const operational = zones.filter(
    (z) => z.type === 'simple' && !z.parentZoneId,
  )

  // Technical refs — structure (parent = zone-structure or zone-extension-arriere or zone-escalier-etage or zone-maison-existante or zone-maison-existante-gauche)
  const structureTechParents = new Set([
    'zone-structure',
    'zone-extension-arriere',
    'zone-escalier-etage',
    'zone-maison-existante',
    'zone-maison-existante-gauche',
  ])
  const techStructure = zones.filter(
    (z) =>
      z.type === 'technical' &&
      z.parentZoneId &&
      structureTechParents.has(z.parentZoneId),
  )

  // Technical refs — sous-sol
  const techSousSol = zones.filter(
    (z) => z.type === 'technical' && z.parentZoneId === 'zone-sous-sol',
  )

  const groups: ZoneGroup[] = []

  if (operational.length > 0) {
    groups.push({
      title: 'Zones du chantier',
      icon: HardHat,
      iconColor: 'text-amber-400',
      zones: operational,
    })
  }
  if (techStructure.length > 0) {
    groups.push({
      title: 'Références techniques — Structure',
      icon: Wrench,
      iconColor: 'text-blue-400',
      zones: techStructure,
    })
  }
  if (techSousSol.length > 0) {
    groups.push({
      title: 'Références techniques — Sous-sol',
      icon: ShieldAlert,
      iconColor: 'text-rose-400',
      zones: techSousSol,
    })
  }

  return groups
}

function ZoneRow({
  zone,
  onSelect,
}: {
  zone: ZoneWithStats
  onSelect: (z: ZoneWithStats) => void
}) {
  const hasUrgent = zone.urgentTaskCount > 0
  const hasOpen = zone.openTaskCount > 0

  return (
    <button
      type="button"
      onClick={() => onSelect(zone)}
      className="flex w-full items-center justify-between gap-3 px-4 py-3.5 transition-colors active:bg-surface-elevated text-left"
    >
      {/* Left: sensitive indicator + name */}
      <div className="flex min-w-0 flex-1 items-start gap-3">
        {/* Dot indicator */}
        <div className="mt-1 shrink-0">
          {hasUrgent ? (
            <span className="flex h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]" />
          ) : hasOpen ? (
            <span className="flex h-2.5 w-2.5 rounded-full bg-amber-400" />
          ) : (
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-foreground leading-snug">
              {zone.name}
            </span>
            {zone.isSensitive && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-red-500/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-red-400">
                <AlertTriangle className="h-2.5 w-2.5" />
                Sensible
              </span>
            )}
          </div>

          {/* Stats row */}
          <div className="mt-1 flex flex-wrap items-center gap-2">
            {zone.openTaskCount > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                <ClipboardList className="h-3 w-3" />
                {zone.openTaskCount} tâche{zone.openTaskCount > 1 ? 's' : ''}
              </span>
            )}
            {zone.interventionCount > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                <Clock className="h-3 w-3" />
                {zone.interventionCount} intervention
                {zone.interventionCount > 1 ? 's' : ''}
              </span>
            )}
            {zone.openTaskCount === 0 && zone.interventionCount === 0 && (
              <span className="text-[11px] text-muted-foreground/50">
                Aucune activité
              </span>
            )}
          </div>

          {/* Technical code if present */}
          {zone.technicalCode && (
            <div className="mt-1">
              <span className="text-[10px] font-mono text-blue-400/80 bg-blue-500/10 rounded px-1.5 py-0.5">
                {zone.technicalCode}
                {zone.planReference ? ` · ${zone.planReference}` : ''}
              </span>
            </div>
          )}
        </div>
      </div>

      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/40" />
    </button>
  )
}


export function ZoneChantierClient() {
  const [zones, setZones] = useState<Zone[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [interventions, setInterventions] = useState<Intervention[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedZone, setSelectedZone] = useState<ZoneWithStats | null>(null)

  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [z, t, i] = await Promise.all([
        mockClarusRepository.getZones(),
        mockClarusRepository.getTasks(),
        mockClarusRepository.getInterventions(),
      ])
      setZones(z)
      setTasks(t)
      setInterventions(i)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 px-4 pt-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-16 rounded-xl bg-surface animate-pulse"
          />
        ))}
      </div>
    )
  }

  const zonesWithStats = buildZoneStats(zones, tasks, interventions)
  const groups = groupZones(zonesWithStats)

  // Global urgent count
  const totalUrgent = zonesWithStats.reduce(
    (sum, z) => sum + z.urgentTaskCount,
    0,
  )

  return (
    <>
      {/* Global alert banner */}
      {totalUrgent > 0 && (
        <div className="mx-4 mb-2 mt-1 flex items-center gap-3 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3">
          <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
          <p className="text-sm text-red-300 leading-snug">
            <span className="font-semibold">{totalUrgent} point{totalUrgent > 1 ? 's' : ''} urgent{totalUrgent > 1 ? 's' : ''}</span>
            {' '}à traiter sur le chantier
          </p>
        </div>
      )}

      {/* Zone groups */}
      {groups.map((group) => {
        const GroupIcon = group.icon
        return (
          <section key={group.title} className="mt-5">
            {/* Section header */}
            <div className="flex items-center gap-2 px-4 mb-1">
              <GroupIcon className={`h-3.5 w-3.5 shrink-0 ${group.iconColor}`} />
              <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
                {group.title}
              </h2>
            </div>

            {/* Zone rows */}
            <div className="mx-4 overflow-hidden rounded-xl bg-surface border border-border/50">
              {group.zones.map((zone, idx) => (
                <div key={zone.id}>
                  <ZoneRow zone={zone} onSelect={setSelectedZone} />
                  {idx < group.zones.length - 1 && (
                    <div className="ml-10 border-b border-border/40" />
                  )}
                </div>
              ))}
            </div>
          </section>
        )
      })}

      {/* Zone detail modal */}
      {selectedZone && (
        <FullScreenSlideModal
          title={selectedZone.name}
          headerMode="back"
          onClose={() => setSelectedZone(null)}
        >
          <ZoneDetailClient
            zone={selectedZone}
            tasks={tasks.filter((t) => t.zoneId === selectedZone.id)}
            interventions={interventions.filter(
              (i) => i.zoneId === selectedZone.id,
            )}
            onTaskUpdated={loadData}
          />
        </FullScreenSlideModal>
      )}
    </>
  )
}
