'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import type { Person, Zone } from '@/lib/domain'
import { toast } from '@/lib/hooks/use-toast'
import { mockClarusRepository } from '@/lib/repositories'
import { useRole } from '@/lib/role-context'
import { FullScreenSlideModal } from '../../@modal/_components/full-screen-slide-modal'

function AjouterTacheForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { role, isReady } = useRole()

  const [zones, setZones] = useState<Zone[]>([])
  const [people, setPeople] = useState<Person[]>([])

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<'normal' | 'high' | 'urgent'>('normal')
  const [selectedZoneId, setSelectedZoneId] = useState(searchParams.get('zoneId') || '')
  const [assignedTo, setAssignedTo] = useState(searchParams.get('assignedTo') || '')

  useEffect(() => {
    mockClarusRepository.getZones().then(setZones)
    mockClarusRepository.getPeople().then(setPeople)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title) return

    await mockClarusRepository.createTask({
      projectId: 'project-1',
      title,
      description,
      priority,
      status: 'to_do',
      zoneId: selectedZoneId || undefined,
      assignedTo: assignedTo || undefined,
    })

    toast({
      title: 'Tâche créée ✓',
      description: title,
      variant: 'success',
    })

    router.back()
  }

  if (!isReady) return null

  const isOuvrier = role === 'ouvrier'

  return (
    <FullScreenSlideModal
      asPage
      headerMode="back"
      title={isOuvrier ? 'Signaler / À prévoir' : 'Ajouter une tâche'}
    >
      <div className="flex-1 overflow-y-auto pb-[calc(env(safe-area-inset-bottom)+80px)]">
        <section className="p-4">
          <form id="add-task-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="title" className="text-sm font-medium">
                {isOuvrier ? "Qu'y a-t-il à prévoir ?" : 'Titre de la tâche'}
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="p-3 rounded-[var(--radius-control)] border border-border bg-surface text-base"
                placeholder="Ex: Peinture du salon"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description (optionnelle)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="p-3 rounded-[var(--radius-control)] border border-border bg-surface text-base min-h-[80px]"
                placeholder="Détails supplémentaires..."
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="priority" className="text-sm font-medium">
                Priorité
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'normal' | 'high' | 'urgent')}
                className="p-3 rounded-[var(--radius-control)] border border-border bg-surface text-base"
              >
                <option value="normal">Normale</option>
                <option value="high">Élevée</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="zone" className="text-sm font-medium">
                Zone concernée (optionnelle)
              </label>
              <select
                id="zone"
                value={selectedZoneId}
                onChange={(e) => setSelectedZoneId(e.target.value)}
                className="p-3 rounded-[var(--radius-control)] border border-border bg-surface text-base"
              >
                <option value="">Sélectionner une zone</option>
                {zones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name}
                  </option>
                ))}
              </select>
            </div>

            {!isOuvrier && (
              <div className="flex flex-col gap-2">
                <label htmlFor="assignee" className="text-sm font-medium">
                  Assigner à (optionnel)
                </label>
                <select
                  id="assignee"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="p-3 rounded-[var(--radius-control)] border border-border bg-surface text-base"
                >
                  <option value="">Non assigné</option>
                  {people.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.role || 'Sans rôle'})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </form>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 pb-[max(env(safe-area-inset-bottom),1rem)] bg-background/90 backdrop-blur-md border-t border-border/50 z-40">
        <div className="max-w-md mx-auto">
          <button
            type="submit"
            form="add-task-form"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground py-3.5 font-semibold active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
          >
            {isOuvrier ? 'Envoyer à Christophe' : 'Enregistrer la tâche'}
          </button>
        </div>
      </div>
    </FullScreenSlideModal>
  )
}

export default function AjouterTachePage() {
  return (
    <Suspense fallback={<div className="p-4">Chargement...</div>}>
      <AjouterTacheForm />
    </Suspense>
  )
}
