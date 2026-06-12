'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, Package, Plus } from 'lucide-react'
import Link from 'next/link'
import { mockClarusRepository } from '@/lib/repositories/mock-clarus-repository'
import { FloatingCTA } from '@/components/ui/floating-cta'
import type { Material, MaterialMovement } from '@/lib/domain'

export default function InventairePage() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [movements, setMovements] = useState<MaterialMovement[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [fetchedMaterials, fetchedMovements] = await Promise.all([
          mockClarusRepository.getMaterials(),
          mockClarusRepository.getMaterialMovements(),
        ])
        setMaterials(fetchedMaterials)
        setMovements(fetchedMovements)
      } catch (error) {
        console.error('Failed to load inventory', error)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const materialsWithStock = materials.map(material => {
    const materialMovements = movements.filter(m => m.materialId === material.id)
    const inQty = materialMovements.filter(m => (m as any).type === 'in').reduce((sum, m) => sum + m.quantity, 0)
    const outQty = materialMovements.filter(m => (m as any).type === 'out' || (m as any).type === 'used').reduce((sum, m) => sum + m.quantity, 0)
    const stock = inQty - outQty
    return { ...material, stock }
  })

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col pb-32 text-foreground bg-background">
      <header className="sticky top-0 z-30 flex items-center gap-3 pb-4 px-5 pt-[max(env(safe-area-inset-top),1.25rem)] bg-background/80 backdrop-blur-md border-b border-border/30">
        <Link
          href="/menu"
          className="flex size-10 items-center justify-center rounded-full bg-surface-elevated active:scale-95 transition-transform"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div className="min-w-0">
          <h1 className="text-xl font-semibold leading-tight">Inventaire des matériaux</h1>
        </div>
      </header>

      <div className="flex flex-col p-4 gap-4">
        {isLoading ? (
          <div className="flex justify-center p-8 text-muted-foreground text-sm">Chargement...</div>
        ) : (
          <div className="flex flex-col gap-3">
            {materialsWithStock.map(material => (
              <div key={material.id} className="flex items-center justify-between p-4 rounded-xl bg-surface border border-border/50">
                <div className="flex items-center gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                    <Package className="size-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">{material.name}</span>
                    <span className="text-sm text-muted-foreground">{material.category || 'Standard'}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end shrink-0 pl-4">
                  <span className="font-bold text-xl">{material.stock}</span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
                    {material.defaultUnit}
                  </span>
                </div>
              </div>
            ))}
            {materialsWithStock.length === 0 && (
              <div className="text-center text-muted-foreground p-8 text-sm">
                Aucun matériau trouvé.
              </div>
            )}
          </div>
        )}
      </div>

      <FloatingCTA>
        <Link
          href="/ajouter-materiau"
          className="inline-flex w-full min-h-[var(--size-primary-button)] items-center justify-center gap-2 rounded-[var(--radius-control)] border border-transparent bg-primary px-5 text-base font-semibold text-primary-foreground shadow-[var(--shadow-elevated)] transition-colors active:scale-95"
        >
          <Plus className="size-5" />
          <span>Nouvelle entrée de stock</span>
        </Link>
      </FloatingCTA>
    </main>
  )
}
