'use client'

import { Camera, Image as ImageIcon } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import type { Zone } from '@/lib/domain'
import { toast } from '@/lib/hooks/use-toast'
import { mockClarusRepository } from '@/lib/repositories'
import { FullScreenSlideModal } from '../../../@modal/_components/full-screen-slide-modal'

function AjouterPhotoForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultZoneId = searchParams.get('zoneId') || ''
  const defaultInterventionId = searchParams.get('interventionId') || ''

  const [zones, setZones] = useState<Zone[]>([])

  const [url, setUrl] = useState('')
  const [type, setType] = useState<'before' | 'during' | 'after' | ''>('')
  const [zoneId, setZoneId] = useState(defaultZoneId)
  const [interventionId] = useState(defaultInterventionId)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    mockClarusRepository.getZones().then(setZones)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) {
      toast({ title: "L'URL de la photo est requise", variant: 'error' })
      return
    }

    setIsSubmitting(true)
    try {
      await mockClarusRepository.createPhoto({
        projectId: 'project-1', // Default mock project
        url,
        type: (type as any) || 'other',
        zoneId: zoneId || undefined,
        interventionId: interventionId || undefined,
        comment: comment || undefined,
        takenAt: new Date().toISOString(),
      })
      toast({ title: 'Photo ajoutée ✓', variant: 'success' })
      router.back()
    } catch (_error) {
      toast({ title: "Erreur lors de l'ajout", variant: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <FullScreenSlideModal asPage headerMode="back" title="Prendre une photo">
      <div className="flex-1 overflow-y-auto pb-[calc(env(safe-area-inset-bottom)+100px)] bg-background">
        <form id="add-photo-form" onSubmit={handleSubmit} className="p-5 flex flex-col gap-6">
          {/* Photo Preview / URL Input */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold flex items-center gap-2">
              <ImageIcon className="size-4 text-muted-foreground" />
              Source de la photo (URL)
            </label>
            <div className="relative aspect-video rounded-2xl border-2 border-dashed border-border/60 bg-surface-alt flex flex-col items-center justify-center overflow-hidden">
              {url ? (
                <img src={url} alt="Aperçu" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground p-6 text-center">
                  <Camera className="size-8 opacity-50" />
                  <span className="text-sm">En mode démo, collez une URL d'image ci-dessous</span>
                </div>
              )}
            </div>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="p-3.5 rounded-xl border border-border bg-surface text-base focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              required
            />
          </div>

          {url && (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4">
              <hr className="border-border/50" />

              {/* Metadata */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">Type de photo</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'before', label: 'Avant' },
                    { value: 'during', label: 'En cours' },
                    { value: 'after', label: 'Après' },
                  ].map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setType(type === t.value ? '' : (t.value as any))}
                      className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                        type === t.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-surface text-foreground hover:bg-surface-elevated'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">Zone concernée (Optionnel)</label>
                <select
                  value={zoneId}
                  onChange={(e) => setZoneId(e.target.value)}
                  className="p-3.5 rounded-xl border border-border bg-surface text-base focus:ring-2 focus:ring-primary/20 outline-none"
                >
                  <option value="">Aucune zone spécifique</option>
                  {zones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">Commentaire (Optionnel)</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Détails, anomalies constatées..."
                  className="p-3.5 rounded-xl border border-border bg-surface text-base min-h-[100px] resize-none focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
            </div>
          )}
        </form>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 pb-[max(env(safe-area-inset-bottom),1rem)] bg-background/90 backdrop-blur-md border-t border-border/50 z-40">
        <div className="max-w-md mx-auto">
          <button
            type="submit"
            form="add-photo-form"
            disabled={isSubmitting || !url}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground py-3.5 font-semibold active:scale-[0.98] transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSubmitting ? 'Enregistrement...' : 'Enregistrer la photo'}
          </button>
        </div>
      </div>
    </FullScreenSlideModal>
  )
}

export default function AjouterPhotoPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Chargement...</div>}>
      <AjouterPhotoForm />
    </Suspense>
  )
}
