'use client'

import { useRouter } from 'next/navigation'
import { Suspense, useState } from 'react'
import { toast } from '@/lib/hooks/use-toast'
import { mockClarusRepository } from '@/lib/repositories'
import { FullScreenSlideModal } from '../../@modal/_components/full-screen-slide-modal'

function AjouterHeuresForm() {
  const router = useRouter()

  const [startTime, setStartTime] = useState('08:00')
  const [endTime, setEndTime] = useState('16:30')
  const [pauseMinutes, setPauseMinutes] = useState('30')
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!startTime || !endTime) {
      toast({ title: 'Heures incomplètes', variant: 'error' })
      return
    }

    setIsSubmitting(true)
    try {
      await mockClarusRepository.createInterventionDraft({
        projectId: 'project-1',
        title: 'Pointage heures',
        type: 'other',
        date: new Date().toISOString().split('T')[0]!,
        phaseId: null,
        zoneId: null,
        personIds: ['person-1'], // Mock pour "Moi"
        startTime,
        endTime,
        breakMinutes: parseInt(pauseMinutes, 10),
        days: 1,
        hourlyRate: 50,
        isExtra: 'to_check',
        notes: comment,
      })

      toast({ title: 'Heures enregistrées ✓', variant: 'success' })
      router.back()
    } catch (error) {
      toast({ title: 'Erreur lors de l\'enregistrement', variant: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <FullScreenSlideModal asPage headerMode="back" title="Noter mes heures">
      <div className="flex-1 overflow-y-auto pb-[calc(env(safe-area-inset-bottom)+100px)] bg-background">
        <form id="add-hours-form" onSubmit={handleSubmit} className="p-5 flex flex-col gap-6">
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm font-semibold">Heure d'arrivée</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="p-3.5 rounded-xl border border-border bg-surface text-base focus:ring-2 focus:ring-primary/20 outline-none w-full"
                required
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm font-semibold">Heure de départ</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="p-3.5 rounded-xl border border-border bg-surface text-base focus:ring-2 focus:ring-primary/20 outline-none w-full"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold">Temps de pause</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: '0', label: '0 min' },
                { value: '15', label: '15 min' },
                { value: '30', label: '30 min' },
                { value: '60', label: '1h' },
              ].map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setPauseMinutes(t.value)}
                  className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                    pauseMinutes === t.value
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
            <label className="text-sm font-semibold">Commentaire (Optionnel)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Ex: Départ anticipé pour rdv médical..."
              className="p-3.5 rounded-xl border border-border bg-surface text-base min-h-[100px] resize-none focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
        </form>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 pb-[max(env(safe-area-inset-bottom),1rem)] bg-background/90 backdrop-blur-md border-t border-border/50 z-40">
        <div className="max-w-md mx-auto">
          <button
            type="submit"
            form="add-hours-form"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground py-3.5 font-semibold active:scale-[0.98] transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            {isSubmitting ? 'Enregistrement...' : 'Valider ma journée'}
          </button>
        </div>
      </div>
    </FullScreenSlideModal>
  )
}

export default function AjouterHeuresPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Chargement...</div>}>
      <AjouterHeuresForm />
    </Suspense>
  )
}
