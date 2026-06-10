'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { mockClarusRepository } from '@/lib/repositories'
import { FullScreenSlideModal } from '../../../../@modal/_components/full-screen-slide-modal'
import { toast } from '@/lib/hooks/use-toast'

export default function EditerMateriauPage() {
  const router = useRouter()
  const params = useParams()
  const materialId = params.id as string

  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [defaultUnit, setDefaultUnit] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadMaterial = async () => {
      try {
        const material = await mockClarusRepository.getMaterialById(materialId)
        if (material) {
          setName(material.name)
          setCategory(material.category || '')
          setDefaultUnit(material.defaultUnit || '')
          setPhotoUrl(material.photoUrl || '')
        } else {
          toast({ title: 'Matériau introuvable', variant: 'error' })
          router.back()
        }
      } finally {
        setIsLoading(false)
      }
    }
    loadMaterial()
  }, [materialId, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !defaultUnit) return

    await mockClarusRepository.updateMaterial(materialId, {
      name,
      category,
      defaultUnit,
      photoUrl: photoUrl || undefined,
    })

    toast({ title: 'Matériau mis à jour ✓', variant: 'success' })
    router.back()
  }

  if (isLoading) {
    return (
      <FullScreenSlideModal asPage headerMode="back" title="Éditer le matériau">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </FullScreenSlideModal>
    )
  }

  return (
    <FullScreenSlideModal asPage headerMode="back" title="Éditer le matériau">
      <div className="flex-1 overflow-y-auto pb-[calc(env(safe-area-inset-bottom)+80px)]">
        <section className="p-5">
          <form id="edit-material-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Nom du matériau
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="p-3 rounded-[var(--radius-control)] border border-border bg-surface text-base"
                placeholder="Ex: Ciment blanc"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="category" className="text-sm font-medium">
                Catégorie (optionnelle)
              </label>
              <input
                id="category"
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="p-3 rounded-[var(--radius-control)] border border-border bg-surface text-base"
                placeholder="Ex: Maçonnerie"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="photoUrl" className="text-sm font-medium">
                Photo du matériau (URL optionnelle)
              </label>
              <input
                id="photoUrl"
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className="p-3 rounded-[var(--radius-control)] border border-border bg-surface text-base"
                placeholder="https://..."
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="unit" className="text-sm font-medium">
                Unité par défaut
              </label>
              <select
                id="unit"
                value={defaultUnit}
                onChange={(e) => setDefaultUnit(e.target.value)}
                className="p-3 rounded-[var(--radius-control)] border border-border bg-surface text-base"
                required
              >
                <option value="pièce">Pièce(s)</option>
                <option value="sac">Sac(s)</option>
                <option value="kg">Kg</option>
                <option value="L">Litre(s)</option>
                <option value="m">Mètre(s)</option>
                <option value="m2">m²</option>
                <option value="m3">m³</option>
              </select>
            </div>
          </form>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 pb-[max(env(safe-area-inset-bottom),1rem)] bg-background/90 backdrop-blur-md border-t border-border/50 z-40">
        <div className="max-w-md mx-auto">
          <button
            type="submit"
            form="edit-material-form"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground py-3.5 font-semibold active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
          >
            Enregistrer les modifications
          </button>
        </div>
      </div>
    </FullScreenSlideModal>
  )
}
