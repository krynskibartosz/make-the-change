'use client'

import {
  Building2,
  CheckCircle2,
  ChevronLeft,
  Clock,
  FileText,
  Mail,
  MapPin,
  Phone,
  UserCircle2,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { Intervention, Person, Task, WorkEntry } from '@/lib/domain'
import { mockClarusRepository } from '@/lib/repositories'

export default function PersonProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [person, setPerson] = useState<Person | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [workEntries, setWorkEntries] = useState<WorkEntry[]>([])
  const [interventions, setInterventions] = useState<Record<string, Intervention>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      mockClarusRepository.getPersonById(params.id),
      mockClarusRepository.getTasks(),
      mockClarusRepository.getWorkEntries(),
      mockClarusRepository.getInterventions(),
    ]).then(([p, allTasks, allWorkEntries, allInterventions]) => {
      setPerson(p)
      if (p) {
        setTasks(allTasks.filter((t) => t.assignedTo === p.id))
        setWorkEntries(allWorkEntries.filter((w) => w.personId === p.id))
      }

      const intMap: Record<string, Intervention> = {}
      allInterventions.forEach((i) => {
        intMap[i.id] = i
      })
      setInterventions(intMap)

      setLoading(false)
    })
  }, [params.id])

  if (loading) return <div className="p-8 text-center text-muted-foreground">Chargement...</div>
  if (!person)
    return <div className="p-8 text-center text-muted-foreground">Profil introuvable</div>

  const totalHours = workEntries.reduce((acc, w) => acc + w.hours, 0)
  const totalCost = totalHours * person.defaultHourlyRate

  const pendingTasks = tasks.filter((t) => t.status !== 'done')
  const completedTasks = tasks.filter((t) => t.status === 'done')

  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground pb-20 animate-in slide-in-from-right-8">
      {/* Header */}
      <header className="sticky top-0 z-30 flex flex-col gap-4 p-5 pb-4 pt-[max(env(safe-area-inset-top),1.25rem)] bg-background/80 backdrop-blur-md border-b border-border/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 -ml-2 rounded-full hover:bg-surface-elevated transition-colors"
            >
              <ChevronLeft className="size-5" />
            </button>
            <h1 className="text-xl font-bold leading-tight">Profil Membre</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 p-5 flex flex-col gap-6">
        {/* En-tête Profil */}
        <div className="flex flex-col items-center gap-3 py-4">
          {person.avatarUrl ? (
            <img
              src={person.avatarUrl}
              alt={person.name}
              className="size-24 rounded-full border-4 border-surface shadow-sm object-cover bg-background"
            />
          ) : (
            <div className="size-24 rounded-full border-4 border-surface shadow-sm bg-primary/10 flex items-center justify-center text-primary">
              <UserCircle2 className="size-12" />
            </div>
          )}
          <div className="text-center">
            <h2 className="text-2xl font-bold">{person.name}</h2>
            <p className="text-muted-foreground mt-1 font-medium">{person.role}</p>
            {person.company && (
              <span className="inline-flex items-center gap-1.5 mt-2 bg-primary/10 text-primary px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
                <Building2 className="size-3.5" />
                {person.company}
              </span>
            )}
          </div>
        </div>

        {/* Actions de contact */}
        <div className="flex gap-3">
          <a
            href={person.phone ? `tel:${person.phone}` : '#'}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-colors ${
              person.phone
                ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'
                : 'bg-surface-elevated text-muted-foreground opacity-50 cursor-not-allowed'
            }`}
          >
            <Phone className="size-4" /> Appeler
          </a>
          <a
            href={person.email ? `mailto:${person.email}` : '#'}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-colors ${
              person.email
                ? 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20'
                : 'bg-surface-elevated text-muted-foreground opacity-50 cursor-not-allowed'
            }`}
          >
            <Mail className="size-4" /> Email
          </a>
        </div>

        {/* Statistiques (si pertinent) */}
        {totalHours > 0 && (
          <div className="bg-surface border border-border rounded-2xl p-5 flex flex-col gap-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
              Statistiques d'intervention
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-bold">{totalHours}h</span>
                <span className="text-xs text-muted-foreground">Heures encodées</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-bold">{totalCost}€</span>
                <span className="text-xs text-muted-foreground">Coût valorisé</span>
              </div>
            </div>

            <div className="pt-3 border-t border-border mt-1">
              <p className="text-sm font-medium mb-3">Dernières interventions :</p>
              <div className="flex flex-col gap-2">
                {workEntries.slice(0, 3).map((we) => {
                  const intervention = interventions[we.interventionId]
                  if (!intervention) return null
                  return (
                    <div
                      key={we.id}
                      className="flex justify-between items-center bg-background rounded-lg p-3 border border-border"
                    >
                      <div className="flex flex-col min-w-0 pr-2">
                        <span className="text-sm font-semibold truncate">{intervention.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(we.date).toLocaleDateString()}
                        </span>
                      </div>
                      <span className="text-sm font-bold bg-surface-elevated px-2 py-1 rounded-md">
                        {we.hours}h
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tâches */}
        <div className="flex flex-col gap-3">
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground px-1">
            Tâches assignées
          </h3>

          {pendingTasks.length > 0 ? (
            <div className="flex flex-col gap-2">
              {pendingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start gap-3 p-4 rounded-xl border border-border bg-surface"
                >
                  <div className="size-8 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="size-4 text-orange-500" />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-semibold text-base leading-tight">{task.title}</span>
                    <span className="text-sm text-muted-foreground mt-1">En attente</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center border border-dashed border-border rounded-xl text-muted-foreground text-sm">
              Aucune tâche en attente
            </div>
          )}

          {completedTasks.length > 0 && (
            <div className="mt-4 flex flex-col gap-2 opacity-60 hover:opacity-100 transition-opacity">
              <span className="text-xs font-bold uppercase text-muted-foreground px-1 mb-1">
                Historique
              </span>
              {completedTasks.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background"
                >
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                  <span className="text-sm font-medium line-through truncate">{task.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
