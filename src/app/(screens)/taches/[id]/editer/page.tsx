'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { Person, Phase, Task, Zone } from '@/lib/domain'
import { mockClarusRepository } from '@/lib/repositories'
import { FullScreenSlideModal } from '../../../../@modal/_components/full-screen-slide-modal'

export default function EditTaskPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Task['priority']>('normal')
  const [assignedTo, setAssignedTo] = useState<string>('')
  const [zoneId, setZoneId] = useState<string>('')
  const [phaseId, setPhaseId] = useState<string>('')

  const [people, setPeople] = useState<Person[]>([])
  const [zones, setZones] = useState<Zone[]>([])
  const [phases, setPhases] = useState<Phase[]>([])

  useEffect(() => {
    Promise.all([
      mockClarusRepository.getTaskById(params.id),
      mockClarusRepository.getPeople(),
      mockClarusRepository.getZones(),
      mockClarusRepository.getPhases(),
    ]).then(([fetchedTask, fetchedPeople, fetchedZones, fetchedPhases]) => {
      if (fetchedTask) {
        setTask(fetchedTask)
        setTitle(fetchedTask.title)
        setDescription(fetchedTask.description || '')
        setPriority(fetchedTask.priority)
        setAssignedTo(fetchedTask.assignedTo || '')
        setZoneId(fetchedTask.zoneId || '')
        setPhaseId(fetchedTask.phaseId || '')
      }
      setPeople(fetchedPeople)
      setZones(fetchedZones)
      setPhases(fetchedPhases)
      setLoading(false)
    })
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title) return

    await mockClarusRepository.updateTask(params.id, {
      title,
      description: description || undefined,
      priority,
      assignedTo: assignedTo || undefined,
      zoneId: zoneId || undefined,
      phaseId: phaseId || undefined,
    })

    router.back()
  }

  if (loading) return null
  if (!task) return <div>Tâche introuvable</div>

  return (
    <FullScreenSlideModal asPage headerMode="back" title="Modifier la tâche">
      <div className="flex-1 overflow-y-auto pb-[calc(env(safe-area-inset-bottom)+80px)]">
        <section className="p-5">
          <form id="edit-task-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="title" className="text-sm font-medium">
                Titre de la tâche
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="p-3 rounded-[var(--radius-control)] border border-border bg-surface text-base"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description (optionnel)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="p-3 rounded-[var(--radius-control)] border border-border bg-surface text-base min-h-[100px]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="priority" className="text-sm font-medium">
                Priorité
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="p-3 rounded-[var(--radius-control)] border border-border bg-surface text-base"
              >
                <option value="low">Basse</option>
                <option value="normal">Normale</option>
                <option value="high">Haute</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="assignedTo" className="text-sm font-medium">
                Assigné à
              </label>
              <select
                id="assignedTo"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="p-3 rounded-[var(--radius-control)] border border-border bg-surface text-base"
              >
                <option value="">Non assigné</option>
                {people.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="zoneId" className="text-sm font-medium">
                Zone
              </label>
              <select
                id="zoneId"
                value={zoneId}
                onChange={(e) => setZoneId(e.target.value)}
                className="p-3 rounded-[var(--radius-control)] border border-border bg-surface text-base"
              >
                <option value="">Aucune zone</option>
                {zones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="phaseId" className="text-sm font-medium">
                Phase
              </label>
              <select
                id="phaseId"
                value={phaseId}
                onChange={(e) => setPhaseId(e.target.value)}
                className="p-3 rounded-[var(--radius-control)] border border-border bg-surface text-base"
              >
                <option value="">Aucune phase</option>
                {phases.map((phase) => (
                  <option key={phase.id} value={phase.id}>
                    {phase.name}
                  </option>
                ))}
              </select>
            </div>
          </form>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 pb-[max(env(safe-area-inset-bottom),1rem)] bg-background/90 backdrop-blur-md border-t border-border/50 z-40">
        <div className="max-w-md mx-auto">
          <button
            type="submit"
            form="edit-task-form"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground py-3.5 font-semibold active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
          >
            Enregistrer les modifications
          </button>
        </div>
      </div>
    </FullScreenSlideModal>
  )
}
