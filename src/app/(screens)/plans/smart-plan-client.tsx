'use client'

import { AlertTriangle, Camera, CheckCircle2, FileText, Info } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Button, SegmentedControl } from '@/components/ui'
import type { Plan, PlanPin, PlanZone } from '@/lib/domain'
import { mockClarusRepository } from '@/lib/repositories/mock-clarus-repository'

type PlanMode = 'view' | 'zones' | 'pins'

export function SmartPlanClient({ plan }: { plan: Plan }) {
  const [mode, setMode] = useState<PlanMode>('view')
  const [zones, setZones] = useState<PlanZone[]>([])
  const [pins, setPins] = useState<PlanPin[]>([])
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null)
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [z, p] = await Promise.all([
        mockClarusRepository.getPlanZones(plan.id),
        mockClarusRepository.getPlanPins(plan.id),
      ])
      setZones(z)
      setPins(p)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }, [plan.id])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Reset selections when changing mode
  useEffect(() => {
    setSelectedZoneId(null)
    setSelectedPinId(null)
  }, [mode])

  const selectedZone = zones.find((z) => z.id === selectedZoneId)
  const selectedPin = pins.find((p) => p.id === selectedPinId)

  const getPinIcon = (type: PlanPin['type']) => {
    switch (type) {
      case 'confirm':
      case 'problem':
        return <AlertTriangle className="h-5 w-5 text-warning" />
      case 'photo':
        return <Camera className="h-5 w-5 text-primary" />
      case 'done':
        return <CheckCircle2 className="h-5 w-5 text-success" />
      case 'task':
        return <FileText className="h-5 w-5 text-info" />
      default:
        return <Info className="h-5 w-5 text-muted-foreground" />
    }
  }

  return (
    <div className="flex h-full w-full flex-col bg-black">
      {/* Mode Selector */}
      <div className="absolute top-16 left-0 right-0 z-50 flex justify-center px-4">
        <div className="w-full max-w-sm rounded-full bg-black/60 p-1 backdrop-blur-md">
          <SegmentedControl
            options={[
              { label: 'Voir', value: 'view' },
              { label: 'Zones', value: 'zones' },
              { label: 'Pins', value: 'pins' },
            ]}
            value={mode}
            onValueChange={(val) => setMode(val as PlanMode)}
            ariaLabel="Plan mode"
          />
        </div>
      </div>

      {/* Interactive Map Area */}
      <div className="flex-1 relative overflow-auto">
        <div className="min-h-full min-w-full flex items-center justify-center p-4">
          <div className="relative">
            {/* The base image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={plan.url}
              alt={plan.title}
              className="max-h-none max-w-none object-contain transition-opacity"
              style={{ width: '100%', height: 'auto', opacity: mode === 'view' ? 1 : 0.8 }}
            />

            {/* SVG Overlay for Zones */}
            {mode === 'zones' && (
              <svg
                className="absolute inset-0 h-full w-full pointer-events-none"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                {zones.map((zone) => {
                  const isSelected = selectedZoneId === zone.id
                  if (zone.shapeType === 'polygon') {
                    const points = zone.coordinates.map((p) => `${p[0]},${p[1]}`).join(' ')
                    return (
                      <polygon
                        key={zone.id}
                        points={points}
                        className={`pointer-events-auto cursor-pointer transition-all ${
                          isSelected
                            ? 'fill-primary/40 stroke-primary stroke-1'
                            : 'fill-primary/20 hover:fill-primary/30 stroke-primary/50 stroke-[0.5]'
                        }`}
                        onClick={() => setSelectedZoneId(zone.id)}
                      />
                    )
                  }
                  if (zone.shapeType === 'rect') {
                    const [p1, p2] = zone.coordinates
                    if (!p1 || !p2) return null
                    const x = Math.min(p1[0], p2[0])
                    const y = Math.min(p1[1], p2[1])
                    const width = Math.abs(p2[0] - p1[0])
                    const height = Math.abs(p2[1] - p1[1])
                    return (
                      <rect
                        key={zone.id}
                        x={`${x}%`}
                        y={`${y}%`}
                        width={`${width}%`}
                        height={`${height}%`}
                        className={`pointer-events-auto cursor-pointer transition-all ${
                          isSelected
                            ? 'fill-primary/40 stroke-primary stroke-1'
                            : 'fill-primary/20 hover:fill-primary/30 stroke-primary/50 stroke-[0.5]'
                        }`}
                        onClick={() => setSelectedZoneId(zone.id)}
                      />
                    )
                  }
                  return null
                })}
              </svg>
            )}

            {/* Absolute divs for Pins */}
            {mode === 'pins' &&
              pins.map((pin) => {
                const isSelected = selectedPinId === pin.id
                return (
                  <button
                    key={pin.id}
                    className={`absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full shadow-lg backdrop-blur-md transition-transform ${
                      isSelected ? 'scale-125 bg-background border-2 border-primary' : 'bg-background/90 hover:scale-110'
                    }`}
                    style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                    onClick={() => setSelectedPinId(pin.id)}
                  >
                    {getPinIcon(pin.type)}
                  </button>
                )
              })}
          </div>
        </div>
      </div>

      {/* Bottom Information Sheets */}
      {mode === 'zones' && selectedZone && (
        <div className="absolute bottom-0 left-0 right-0 animate-in slide-in-from-bottom-full bg-surface p-6 border-t border-border rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
          <div className="mb-4">
            <h3 className="text-xl font-bold">{selectedZone.label}</h3>
            <p className="text-sm text-muted-foreground mt-1">3 interventions • 2 tâches ouvertes</p>
          </div>
          <Button className="w-full" size="lg">
            Ajouter intervention ici
          </Button>
        </div>
      )}

      {mode === 'pins' && selectedPin && (
        <div className="absolute bottom-0 left-0 right-0 animate-in slide-in-from-bottom-full bg-surface p-6 border-t border-border rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
          <div className="mb-4 flex items-start gap-4">
            <div className="mt-1 bg-muted p-3 rounded-full">{getPinIcon(selectedPin.type)}</div>
            <div>
              <h3 className="text-lg font-bold leading-tight">{selectedPin.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 capitalize">
                Statut : {selectedPin.status?.replace('_', ' ') || 'Actif'}
              </p>
            </div>
          </div>
          <Button className="w-full" size="lg">
            Voir les détails
          </Button>
        </div>
      )}
      
      {/* Plan description fallback if nothing is selected and in view mode */}
      {mode === 'view' && plan.description && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md p-6 border-t border-white/10 pointer-events-none">
          <p className="text-white text-sm leading-relaxed">{plan.description}</p>
        </div>
      )}
    </div>
  )
}
