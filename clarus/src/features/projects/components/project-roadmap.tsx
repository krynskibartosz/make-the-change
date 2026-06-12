'use client'

import {
  differenceInDays,
  eachMonthOfInterval,
  endOfMonth,
  format,
  max,
  min,
  parseISO,
  startOfDay,
} from 'date-fns'
import { fr } from 'date-fns/locale'
import { Save, ZoomIn, ZoomOut } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { BottomSheet, Button, SegmentedControl } from '@/components/ui'
import type { Phase } from '@/lib/domain'
import { mockClarusRepository } from '@/lib/repositories/mock-clarus-repository'

export function ProjectRoadmap({ phases: initialPhases }: { phases: Phase[] }) {
  const containerRef = useRef<HTMLDivElement>(null)

  const [phases, setPhases] = useState<Phase[]>(initialPhases)
  const [zoomLevel, setZoomLevel] = useState<'days' | 'weeks'>('days')
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null)
  const [editProgress, setEditProgress] = useState(0)
  const [editStatus, setEditStatus] = useState<string>('in_progress')
  const [isSaving, setIsSaving] = useState(false)

  // Determine dynamic bounds based on phases
  const { timelineStart, timelineEnd } = useMemo(() => {
    const validPhases = phases.filter((p) => p.startDate && p.endDate)
    if (validPhases.length === 0) {
      return { timelineStart: new Date('2026-05-01'), timelineEnd: new Date('2026-10-31') }
    }
    const starts = validPhases.map((p) => parseISO(p.startDate!))
    const ends = validPhases.map((p) => parseISO(p.endDate!))
    // Add 15 days padding on each side
    const minD = min(starts)
    const maxD = max(ends)
    minD.setDate(minD.getDate() - 15)
    maxD.setDate(maxD.getDate() + 30) // More padding on the right for visuals
    return { timelineStart: minD, timelineEnd: maxD }
  }, [phases])

  const totalDays = differenceInDays(timelineEnd, timelineStart) + 1
  const months = useMemo(
    () => eachMonthOfInterval({ start: timelineStart, end: timelineEnd }),
    [timelineStart, timelineEnd],
  )

  // Constantes pour le rendu
  const DAY_WIDTH = zoomLevel === 'days' ? 10 : 3
  const TOTAL_WIDTH = totalDays * DAY_WIDTH

  // Today marker
  const today = startOfDay(new Date('2026-06-11')) // Simulated today for the demo context
  const todayPos = differenceInDays(today, timelineStart) * DAY_WIDTH

  useEffect(() => {
    // Auto-scroll to "Today" on mount or zoom change
    if (containerRef.current) {
      const clientWidth = containerRef.current.clientWidth
      containerRef.current.scrollTo({
        left: Math.max(0, todayPos - clientWidth / 2 + 100),
        behavior: 'smooth',
      })
    }
  }, [todayPos])

  const getPhasePosition = (phase: Phase) => {
    if (!phase.startDate || !phase.endDate) return { left: 0, width: 0 }

    const start = parseISO(phase.startDate)
    const end = parseISO(phase.endDate)

    const effectiveStart = start < timelineStart ? timelineStart : start
    const effectiveEnd = end > timelineEnd ? timelineEnd : end

    const daysFromStart = differenceInDays(effectiveStart, timelineStart)
    const durationDays = differenceInDays(effectiveEnd, effectiveStart) + 1

    return {
      left: daysFromStart * DAY_WIDTH,
      width: durationDays * DAY_WIDTH,
    }
  }

  const getStatusStyles = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'bg-gradient-to-r from-emerald-500/90 to-emerald-400 text-white border-white/20 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
      case 'in_progress':
        return 'bg-gradient-to-r from-blue-600/90 to-indigo-500 text-white border-white/20 shadow-[0_0_20px_rgba(59,130,246,0.4)]'
      case 'delayed':
        return 'bg-gradient-to-r from-rose-600/90 to-red-500 text-white border-white/20 shadow-[0_0_20px_rgba(244,63,94,0.4)]'
      default:
        return 'bg-surface-elevated/90 text-muted-foreground border-border backdrop-blur-md'
    }
  }

  const handlePhaseClick = (phase: Phase) => {
    setSelectedPhase(phase)
    setEditProgress(phase.progress || 0)
    setEditStatus(phase.status || 'not_started')
  }

  const handleSave = async () => {
    if (!selectedPhase) return
    setIsSaving(true)
    try {
      const updatedPhase = await mockClarusRepository.updatePhase(selectedPhase.id, {
        progress: editProgress,
        status: editStatus as any,
      })
      setPhases(phases.map((p) => (p.id === updatedPhase.id ? updatedPhase : p)))
      setSelectedPhase(null)
    } catch (e) {
      console.error('Failed to update phase', e)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[500px] bg-background rounded-[var(--radius-card)] overflow-hidden border border-border shadow-sm">
      {/* Header Info & Actions */}
      <div className="px-4 py-3 flex justify-between items-center bg-surface-elevated border-b border-border z-10">
        <div>
          <h2 className="text-sm font-black tracking-tight text-foreground uppercase">
            Planning Macro
          </h2>
          <p className="text-[10px] text-muted-foreground mt-0.5 font-bold">
            {format(timelineStart, 'MMM yyyy', { locale: fr })} -{' '}
            {format(timelineEnd, 'MMM yyyy', { locale: fr })}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex bg-surface border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setZoomLevel('weeks')}
              className={`p-1.5 transition-colors ${zoomLevel === 'weeks' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-surface-elevated'}`}
              aria-label="Zoom arrière (Vue Macro)"
            >
              <ZoomOut className="size-4" />
            </button>
            <button
              onClick={() => setZoomLevel('days')}
              className={`p-1.5 transition-colors ${zoomLevel === 'days' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-surface-elevated'}`}
              aria-label="Zoom avant (Vue Détail)"
            >
              <ZoomIn className="size-4" />
            </button>
          </div>

          <button
            onClick={() => {
              if (containerRef.current) {
                containerRef.current.scrollTo({
                  left: Math.max(0, todayPos - containerRef.current.clientWidth / 2 + 50),
                  behavior: 'smooth',
                })
              }
            }}
            className="text-[10px] font-bold uppercase tracking-wider bg-surface border border-border px-3 py-2 rounded-lg active:scale-95 transition-transform"
          >
            Aujourd'hui
          </button>
        </div>
      </div>

      {/* Gantt Scrollable Area */}
      <div
        ref={containerRef}
        className="relative flex-1 overflow-x-auto overflow-y-auto bg-[#0A0A0A] hide-scrollbar"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div
          style={{ width: `${TOTAL_WIDTH + 60}px` }}
          className="pt-2 pb-16 px-4 relative min-h-full"
        >
          {/* Header des Mois */}
          <div className="flex mb-4 relative z-0">
            {months.map((month, i) => {
              const daysInMonth =
                differenceInDays(
                  endOfMonth(month) > timelineEnd ? timelineEnd : endOfMonth(month),
                  month < timelineStart ? timelineStart : month,
                ) + 1
              return (
                <div
                  key={i}
                  style={{ width: daysInMonth * DAY_WIDTH }}
                  className="relative border-l border-white/10 pl-3 pb-2"
                >
                  <div className="text-[11px] font-extrabold uppercase tracking-widest text-white/50">
                    {format(month, 'MMM', { locale: fr })}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Grille verticale d'arrière-plan */}
          <div className="absolute inset-0 pt-[40px] pointer-events-none flex z-0 opacity-20">
            {months.map((month, i) => {
              const daysInMonth =
                differenceInDays(
                  endOfMonth(month) > timelineEnd ? timelineEnd : endOfMonth(month),
                  month < timelineStart ? timelineStart : month,
                ) + 1
              return (
                <div
                  key={`grid-${i}`}
                  style={{ width: daysInMonth * DAY_WIDTH }}
                  className="border-l border-white/20 h-full border-dashed"
                />
              )
            })}
          </div>

          {/* Ligne "Aujourd'hui" (Today Marker) */}
          {today >= timelineStart && today <= timelineEnd && (
            <div
              className="absolute top-0 bottom-0 z-10 pointer-events-none"
              style={{ left: todayPos + 16 /* +16 for padding-x */ }}
            >
              <div className="absolute -top-1 -left-1.5 size-3">
                <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75"></div>
                <div className="relative rounded-full size-3 bg-primary border-2 border-background shadow-[0_0_10px_rgba(var(--color-primary),1)]"></div>
              </div>
              <div className="w-[2px] h-full bg-gradient-to-b from-primary/80 via-primary/40 to-transparent ml-[1px]"></div>
            </div>
          )}

          {/* Barres des phases */}
          <div className="flex flex-col gap-4 relative z-20 mt-4 pb-20">
            {phases
              .sort((a, b) => a.order - b.order)
              .map((phase) => {
                const { left, width } = getPhasePosition(phase)
                const isShort = width < 100

                return (
                  <div
                    key={phase.id}
                    className="relative h-12 group"
                    onClick={() => handlePhaseClick(phase)}
                  >
                    {width > 0 && (
                      <div
                        className={`absolute top-0 bottom-0 rounded-xl border overflow-hidden cursor-pointer active:scale-[0.98] transition-all flex flex-col justify-center px-3 ${getStatusStyles(phase.status)} hover:brightness-110`}
                        style={{ left: left, width: Math.max(width, 30) }}
                      >
                        {/* Jauge de progression */}
                        {phase.progress !== undefined &&
                          phase.progress > 0 &&
                          phase.status !== 'not_started' && (
                            <div
                              className="absolute left-0 top-0 bottom-0 bg-white/20 mix-blend-overlay z-0 transition-all duration-500"
                              style={{ width: `${phase.progress}%` }}
                            />
                          )}

                        {/* Contenu de la barre */}
                        <div className="relative z-10 flex flex-col justify-center min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-bold truncate ${isShort ? 'text-[9px]' : 'text-xs'}`}
                            >
                              {phase.name}
                            </span>
                            {!isShort && phase.progress !== undefined && (
                              <span className="text-[9px] font-black bg-black/20 px-1.5 py-0.5 rounded-sm">
                                {phase.progress}%
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
          </div>
        </div>
      </div>

      {/* Légende fixée en bas */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 p-3 text-[9px] font-bold uppercase tracking-wider text-muted-foreground justify-center border-t border-border/50 bg-surface-elevated z-20">
        <div className="flex items-center gap-1.5">
          <div className="size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
          Terminé
        </div>
        <div className="flex items-center gap-1.5">
          <div className="size-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
          En cours
        </div>
        <div className="flex items-center gap-1.5">
          <div className="size-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"></div>
          En retard
        </div>
      </div>

      {/* BottomSheet for Phase Edit */}
      <BottomSheet
        isOpen={!!selectedPhase}
        onClose={() => setSelectedPhase(null)}
        title="Mettre à jour la phase"
      >
        {selectedPhase && (
          <div className="flex flex-col gap-6 pt-2 pb-6">
            <div>
              <h3 className="text-xl font-black">{selectedPhase.name}</h3>
              <p className="text-sm text-muted-foreground font-semibold mt-1">
                {selectedPhase.startDate &&
                  format(parseISO(selectedPhase.startDate), 'd MMMM yyyy', { locale: fr })}
                {' - '}
                {selectedPhase.endDate &&
                  format(parseISO(selectedPhase.endDate), 'd MMMM yyyy', { locale: fr })}
              </p>
            </div>

            {/* Status Selection */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Statut
              </label>
              <SegmentedControl
                ariaLabel="Statut de la phase"
                options={[
                  { label: 'À venir', value: 'not_started' },
                  { label: 'En cours', value: 'in_progress' },
                  { label: 'En retard', value: 'delayed' },
                  { label: 'Terminé', value: 'completed' },
                ]}
                value={editStatus}
                onValueChange={setEditStatus}
              />
            </div>

            {/* Progress Slider */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Avancement
                </label>
                <span className="text-lg font-black text-primary">{editProgress}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={editProgress}
                onChange={(e) => setEditProgress(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-surface-elevated rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground font-bold px-1">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            <Button
              size="primary"
              className="w-full font-bold text-base mt-4"
              onClick={handleSave}
              disabled={isSaving}
            >
              <Save className="size-5 mr-2" />
              {isSaving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        )}
      </BottomSheet>
    </div>
  )
}
