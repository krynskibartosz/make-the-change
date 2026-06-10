'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ArrowDownRight, ArrowUpRight, Clock, Package, Pencil, Plus, History } from 'lucide-react'
import { mockClarusRepository } from '@/lib/repositories'
import { FullScreenSlideModal } from '../../../@modal/_components/full-screen-slide-modal'
import { IconButton } from '@/components/ui/button'
import type { Material, MaterialMovement } from '@/lib/domain'
import { toast } from '@/lib/hooks/use-toast'

export default function MaterialDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const materialId = params.id as string

  const [material, setMaterial] = useState<Material | null>(null)
  const [movements, setMovements] = useState<MaterialMovement[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const mat = await mockClarusRepository.getMaterialById(materialId)
        if (!mat) {
          toast({ title: 'Matériau introuvable', variant: 'error' })
          router.back()
          return
        }
        setMaterial(mat)

        const allMovs = await mockClarusRepository.getMaterialMovements()
        const matMovs = allMovs.filter(m => m.materialId === materialId)
        setMovements(matMovs.reverse()) // newest first
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [materialId, router])

  if (isLoading || !material) {
    return (
      <FullScreenSlideModal asPage headerMode="back" title="Détails du matériau">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </FullScreenSlideModal>
    )
  }

  // Calcul du stock
  let stock = 0
  for (const mov of movements) {
    if (mov.type === 'on_site' || mov.type === 'purchased') {
      stock += mov.quantity
    } else if (mov.type === 'used' || mov.type === 'wasted' || mov.type === 'returned') {
      stock -= mov.quantity
    }
  }
  if (stock < 0) stock = 0

  const getMovementIcon = (type: MaterialMovement['type']) => {
    switch (type) {
      case 'on_site':
      case 'purchased':
        return <ArrowDownRight className="text-success h-5 w-5" />
      case 'used':
      case 'wasted':
      case 'returned':
        return <ArrowUpRight className="text-destructive h-5 w-5" />
      default:
        return <Clock className="text-muted-foreground h-5 w-5" />
    }
  }

  const getMovementLabel = (type: MaterialMovement['type']) => {
    switch (type) {
      case 'on_site': return 'Arrivé sur site'
      case 'purchased': return 'Acheté'
      case 'used': return 'Utilisé'
      case 'returned': return 'Retourné'
      case 'wasted': return 'Perdu/Cassé'
      case 'needed': return 'Besoin'
      default: return type
    }
  }

  return (
    <FullScreenSlideModal 
      asPage 
      headerMode="back" 
      title={material.name}
      action={
        <IconButton onClick={() => router.push(`/materiaux/${material.id}/editer`)} variant="ghost" aria-label="Modifier">
          <Pencil size={20} />
        </IconButton>
      }
    >
      <div className="flex-1 overflow-y-auto pb-[calc(env(safe-area-inset-bottom)+100px)]">
        <div className="p-4 flex flex-col gap-6">
          
          {/* Dashboard Hero */}
          <section className="bg-surface rounded-[var(--radius-card)] border border-border p-6 flex flex-col items-center justify-center text-center shadow-sm">
            <Package size={40} className="text-primary/80 mb-3" />
            <h2 className="text-2xl font-bold">{material.name}</h2>
            <p className="text-muted-foreground mb-6">{material.category || 'Sans catégorie'}</p>
            
            <div className="bg-background rounded-2xl px-8 py-4 border border-border/50">
              <span className="text-4xl font-black text-primary">{stock}</span>
              <span className="ml-2 text-muted-foreground uppercase text-xs tracking-wider">{material.defaultUnit || 'pièce'}(s) en stock</span>
            </div>
          </section>

          {/* Historique */}
          <section className="flex flex-col gap-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70 flex items-center gap-2">
              <History size={14} />
              Historique des mouvements
            </h3>
            
            {movements.length === 0 ? (
              <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6 text-center text-muted-foreground text-sm">
                Aucun mouvement enregistré pour le moment.
              </div>
            ) : (
              <div className="bg-surface rounded-[var(--radius-card)] border border-border overflow-hidden">
                {movements.map((mov) => (
                  <div key={mov.id} className="flex items-center justify-between p-4 border-b border-border last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center border border-border">
                        {getMovementIcon(mov.type)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{getMovementLabel(mov.type)}</span>
                        {/* You could add date here if it was on the model, e.g. <span className="text-xs text-muted-foreground">{date}</span> */}
                        <span className="text-xs text-muted-foreground capitalize">{mov.status.replace('_', ' ')}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`font-semibold ${['on_site', 'purchased'].includes(mov.type) ? 'text-success' : 'text-destructive'}`}>
                        {['on_site', 'purchased'].includes(mov.type) ? '+' : '-'}{mov.quantity}
                      </span>
                      <span className="text-[10px] text-muted-foreground uppercase">{mov.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 pb-[max(env(safe-area-inset-bottom),1rem)] bg-background/90 backdrop-blur-md border-t border-border/50 z-40">
        <div className="max-w-md mx-auto grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => router.push('/ajouter-materiau')}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-surface border border-border py-3.5 font-semibold text-foreground active:scale-[0.98] transition-all"
          >
            <ArrowUpRight size={18} className="text-destructive" />
            Déclarer utilisé
          </button>
          <button
            type="button"
            onClick={() => router.push('/ajouter-materiau')}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground py-3.5 font-semibold active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
          >
            <ArrowDownRight size={18} />
            Ajouter stock
          </button>
        </div>
      </div>
    </FullScreenSlideModal>
  )
}
