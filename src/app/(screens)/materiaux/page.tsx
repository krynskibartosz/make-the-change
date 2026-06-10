'use client'

import { ChevronRight, Package, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FullScreenSlideModal } from '../../@modal/_components/full-screen-slide-modal'
import type { Material, MaterialMovement } from '@/lib/domain'
import { mockClarusRepository } from '@/lib/repositories'

export default function MateriauxPage() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [movements, setMovements] = useState<MaterialMovement[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    Promise.all([
      mockClarusRepository.getMaterials(),
      mockClarusRepository.getMaterialMovements()
    ]).then(([mats, movs]) => {
      setMaterials(mats)
      setMovements(movs)
      setLoading(false)
    })
  }, [])

  // Calcul du stock pour chaque matériau (somme des mouvements sur site vs utilisés)
  const getStock = (materialId: string) => {
    const matMovements = movements.filter(m => m.materialId === materialId)
    let stock = 0
    for (const mov of matMovements) {
      if (mov.type === 'on_site' || mov.type === 'purchased') {
        stock += mov.quantity
      } else if (mov.type === 'used' || mov.type === 'wasted' || mov.type === 'returned') {
        stock -= mov.quantity
      }
    }
    return stock > 0 ? stock : 0
  }

  return (
    <FullScreenSlideModal asPage headerMode="back" title="Matériaux du chantier">
      <div className="flex-1 overflow-y-auto p-4 pb-32">
        <div className="flex flex-col gap-3">
          {loading ? (
            <div className="flex justify-center items-center h-40 text-muted-foreground">
              Chargement des matériaux...
            </div>
          ) : materials.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
              <Package size={48} className="mb-4 opacity-50" />
              <p>Aucun matériau enregistré</p>
            </div>
          ) : (
            <div className="flex flex-col bg-surface rounded-[var(--radius-card)] border border-border">
              {materials.map((material) => {
                const stock = getStock(material.id)
                return (
                  <Link
                    key={material.id}
                    href={`/materiaux/${material.id}`}
                    className="flex items-center justify-between p-4 transition-colors border-b border-border last:border-0 active:bg-surface-elevated"
                  >
                    <div className="flex flex-col min-w-0 pr-4">
                      <span className="font-semibold text-base truncate">{material.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {material.category || 'Sans catégorie'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex flex-col items-end">
                        <span className="font-bold text-lg text-primary">{stock}</span>
                        <span className="text-xs text-muted-foreground">{material.defaultUnit || 'pièce'}(s)</span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground/40" />
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 pb-[max(env(safe-area-inset-bottom),1rem)] bg-background/90 backdrop-blur-md border-t border-border/50 z-40">
        <div className="max-w-md mx-auto">
          <button
            type="button"
            onClick={() => router.push('/ajouter-materiau')}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground py-3.5 font-semibold active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
          >
            <Plus size={20} />
            Ajouter un matériau
          </button>
        </div>
      </div>
    </FullScreenSlideModal>
  )
}
