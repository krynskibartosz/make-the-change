'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { Material, Zone } from '@/lib/domain'
import { toast } from '@/lib/hooks/use-toast'
import { mockClarusRepository } from '@/lib/repositories'
import { FullScreenSlideModal } from '../../@modal/_components/full-screen-slide-modal'

export default function AjouterMateriauPage() {
  const router = useRouter()
  const [materials, setMaterials] = useState<Material[]>([])
  const [zones, setZones] = useState<Zone[]>([])

  const [selectedMaterialId, setSelectedMaterialId] = useState('')
  const [quantity, setQuantity] = useState('')
  const [unit, setUnit] = useState('')
  const [selectedZoneId, setSelectedZoneId] = useState('')

  useEffect(() => {
    mockClarusRepository.getMaterials().then(setMaterials)
    mockClarusRepository.getZones().then(setZones)
  }, [])

  // Auto-fill unit when material is selected
  useEffect(() => {
    const selectedMaterial = materials.find((m) => m.id === selectedMaterialId)
    if (selectedMaterial?.defaultUnit) {
      setUnit(selectedMaterial.defaultUnit)
    }
  }, [selectedMaterialId, materials])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedMaterialId || !quantity || !unit || !selectedZoneId) return

    const material = materials.find((m) => m.id === selectedMaterialId)
    const zone = zones.find((z) => z.id === selectedZoneId)

    await mockClarusRepository.createMaterialMovement({
      projectId: 'project-1',
      materialId: selectedMaterialId,
      zoneId: selectedZoneId,
      type: 'used',
      quantity: parseFloat(quantity),
      unit: unit,
      status: 'on_site',
    })

    toast({
      title: 'Matériau enregistré ✓',
      description: `${quantity} ${unit} de ${material?.name ?? ''} → ${zone?.name ?? ''}`,
      variant: 'success',
    })

    router.back()
  }

  return (
    <FullScreenSlideModal asPage headerMode="back" title="Ajouter un matériau">
      <section className="rounded-[var(--radius-card)] border border-border bg-surface p-4 flex-1 overflow-hidden flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Matériau</label>
            <select
              value={selectedMaterialId}
              onChange={(e) => setSelectedMaterialId(e.target.value)}
              className="p-3 rounded-[var(--radius-control)] border border-border bg-surface text-base"
              required
            >
              <option value="">Sélectionner un matériau</option>
              {materials.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Zone</label>
            <select
              value={selectedZoneId}
              onChange={(e) => setSelectedZoneId(e.target.value)}
              className="p-3 rounded-[var(--radius-control)] border border-border bg-surface text-base"
              required
            >
              <option value="">Sélectionner une zone</option>
              {zones.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm font-medium">Quantité</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="p-3 rounded-[var(--radius-control)] border border-border bg-surface text-base"
                required
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm font-medium">Unité</label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="p-3 rounded-[var(--radius-control)] border border-border bg-surface text-base"
                placeholder="Ex: kg, m²"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 p-4 bg-brand-primary text-brand-primary-foreground rounded-[var(--radius-button)] font-semibold text-lg"
          >
            Enregistrer l'utilisation
          </button>
        </form>
      </section>
    </FullScreenSlideModal>
  )
}
