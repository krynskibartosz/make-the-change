'use client'

import {
  Activity,
  Building2,
  CheckCircle2,
  ChevronLeft,
  Clock,
  Flame,
  Mail,
  Pencil,
  Phone,
  UserCircle2,
  Wrench,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { Intervention, Person } from '@/lib/domain'
import { mockClarusRepository } from '@/lib/repositories'

type TimelineEvent = {
  id: string
  type: 'task_done' | 'task_pending' | 'work_entry'
  date: Date
  title: string
  subtitle?: string
  priority?: string
  hours?: number
}

export default function PersonProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [person, setPerson] = useState<Person | null>(null)
  const [timeline, setTimeline] = useState<TimelineEvent[]>([])
  const [stats, setStats] = useState({ hours: 0, cost: 0, pendingCount: 0, urgentCount: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      mockClarusRepository.getPersonById(params.id),
      mockClarusRepository.getTasks(),
      mockClarusRepository.getWorkEntries(),
      mockClarusRepository.getInterventions(),
    ]).then(([p, allTasks, allWorkEntries, allInterventions]) => {
      setPerson(p || null)
      if (!p) {
        setLoading(false)
        return
      }

      // Filter data for this person
      const personTasks = allTasks.filter((t) => t.assignedTo === p.id)
      const personWork = allWorkEntries.filter((w) => w.personId === p.id)

      const intMap: Record<string, Intervention> = {}
      allInterventions.forEach((i) => {
        intMap[i.id] = i
      })

      // Calculate stats
      const totalMinutes = personWork.reduce((acc, w) => acc + (w.durationMinutes || 0), 0)
      const pendingTasks = personTasks.filter((t) => t.status !== 'done')
      const urgentTasks = pendingTasks.filter(
        (t) => t.priority === 'urgent' || t.priority === 'high',
      )

      setStats({
        hours: totalMinutes / 60,
        cost: (totalMinutes / 60) * p.defaultHourlyRate,
        pendingCount: pendingTasks.length,
        urgentCount: urgentTasks.length,
      })

      // Build unified timeline
      const events: TimelineEvent[] = []

      // Add work entries
      personWork.forEach((we) => {
        const intervention = intMap[we.interventionId]
        if (intervention) {
          events.push({
            id: `we-${we.id}`,
            type: 'work_entry',
            date: new Date(we.date),
            title: intervention.title,
            hours: we.durationMinutes ? we.durationMinutes / 60 : 0,
          })
        }
      })

      // Add tasks
      personTasks.forEach((t) => {
        if (t.status === 'done' && t.completedAt) {
          events.push({
            id: `task-${t.id}`,
            type: 'task_done',
            date: new Date(t.completedAt),
            title: t.title,
            subtitle: 'Tâche terminée',
          })
        } else if (t.status !== 'done') {
          events.push({
            id: `task-${t.id}`,
            type: 'task_pending',
            date: new Date(t.createdAt),
            title: t.title,
            subtitle: 'En attente',
            priority: t.priority,
          })
        }
      })

      // Sort by date descending
      events.sort((a, b) => b.date.getTime() - a.date.getTime())
      setTimeline(events)
      setLoading(false)
    })
  }, [params.id])

  if (loading) return <div className="p-8 text-center text-muted-foreground">Chargement...</div>
  if (!person)
    return <div className="p-8 text-center text-muted-foreground">Profil introuvable</div>

  // Workload computation
  let workloadLevel = 'optimal'
  let workloadColor = 'bg-emerald-500'
  let workloadText = 'Dispo / Optimal'

  if (stats.urgentCount > 2 || stats.pendingCount > 5) {
    workloadLevel = 'overloaded'
    workloadColor = 'bg-red-500'
    workloadText = 'Surchargé'
  } else if (stats.urgentCount > 0 || stats.pendingCount > 2) {
    workloadLevel = 'busy'
    workloadColor = 'bg-orange-500'
    workloadText = 'Bien occupé'
  }

  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground pb-20 animate-in slide-in-from-right-8">
      {/* Header */}
      <header className="sticky top-0 z-30 flex flex-col gap-4 p-4 pb-4 pt-[max(env(safe-area-inset-top),1.25rem)] bg-background/80 backdrop-blur-md border-b border-border/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="p-2 -ml-2 rounded-full hover:bg-surface-elevated transition-colors"
            >
              <ChevronLeft className="size-5" />
            </button>
            <h1 className="text-xl font-bold leading-tight">Profil Intelligent</h1>
          </div>
          <button
            type="button"
            onClick={() => router.push(`/equipe/${params.id}/editer`)}
            className="p-2 -mr-2 rounded-full hover:bg-surface-elevated transition-colors text-primary"
          >
            <Pencil className="size-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 p-4 flex flex-col gap-6">
        {/* En-tête Profil */}
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="relative">
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
            {/* Indice Workload Pastille */}
            <div
              className={`absolute bottom-1 right-1 size-5 rounded-full border-2 border-background ${workloadColor}`}
            />
          </div>
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

        {/* Jauge de charge (Workload) */}
        <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Activity className="size-4" />
              Charge de travail
            </h3>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${workloadColor}`}
            >
              {workloadText}
            </span>
          </div>
          <div className="h-2 w-full bg-surface-elevated rounded-full overflow-hidden flex">
            <div
              className={`h-full ${workloadColor} transition-all duration-1000`}
              style={{
                width:
                  workloadLevel === 'overloaded' ? '90%' : workloadLevel === 'busy' ? '60%' : '25%',
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{stats.pendingCount} tâches en cours</span>
            {stats.urgentCount > 0 && (
              <span className="text-red-500 font-medium">{stats.urgentCount} urgentes</span>
            )}
          </div>
        </div>

        {/* Actions de contact */}
        <div className="flex gap-3">
          <a
            href={person.phone ? `tel:${person.phone}` : '#'}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold transition-colors ${
              person.phone
                ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 active:scale-95'
                : 'bg-surface-elevated text-muted-foreground opacity-50 cursor-not-allowed'
            }`}
          >
            <Phone className="size-4" /> Appeler
          </a>
          <a
            href={person.email ? `mailto:${person.email}` : '#'}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold transition-colors ${
              person.email
                ? 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 active:scale-95'
                : 'bg-surface-elevated text-muted-foreground opacity-50 cursor-not-allowed'
            }`}
          >
            <Mail className="size-4" /> Email
          </a>
        </div>

        {/* Timeline Unifiée */}
        <div className="flex flex-col gap-4 mt-2">
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground px-1">
            Flux d'activité
          </h3>

          <div className="flex flex-col relative before:absolute before:inset-y-0 before:left-6 before:w-px before:bg-border/50 gap-6">
            {timeline.length > 0 ? (
              timeline.map((event, _index) => {
                // Déterminer l'icône et la couleur selon le type d'événement
                let Icon = Wrench
                let iconColor = 'text-primary'
                let bgColor = 'bg-primary/10'
                let borderColor = 'border-primary/20'

                if (event.type === 'task_pending') {
                  Icon = Clock
                  iconColor = event.priority === 'urgent' ? 'text-red-500' : 'text-orange-500'
                  bgColor = event.priority === 'urgent' ? 'bg-red-500/10' : 'bg-orange-500/10'
                  borderColor =
                    event.priority === 'urgent' ? 'border-red-500/20' : 'border-orange-500/20'
                } else if (event.type === 'task_done') {
                  Icon = CheckCircle2
                  iconColor = 'text-emerald-500'
                  bgColor = 'bg-emerald-500/10'
                  borderColor = 'border-emerald-500/20'
                }

                return (
                  <div
                    key={event.id}
                    className="flex gap-4 relative z-10 group cursor-pointer active:scale-[0.98] transition-transform"
                  >
                    {/* Point sur la timeline */}
                    <div
                      className={`size-12 rounded-full border ${borderColor} ${bgColor} flex items-center justify-center shrink-0 shadow-sm`}
                    >
                      <Icon className={`size-5 ${iconColor}`} />
                    </div>

                    {/* Contenu de la carte */}
                    <div className="flex-1 bg-surface border border-border rounded-2xl p-4 shadow-sm flex flex-col justify-center">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-col min-w-0">
                          <span
                            className={`text-xs font-bold uppercase tracking-wider mb-1 ${iconColor}`}
                          >
                            {event.type === 'work_entry' ? 'Intervention' : event.subtitle}
                          </span>
                          <h4
                            className={`text-sm font-semibold leading-snug ${event.type === 'task_done' ? 'line-through text-muted-foreground' : 'text-foreground'}`}
                          >
                            {event.title}
                          </h4>
                        </div>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap mt-0.5 bg-background px-1.5 py-0.5 rounded border border-border">
                          {event.date.toLocaleDateString(undefined, {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                      </div>
                      {event.hours && (
                        <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-muted-foreground bg-background w-fit px-2 py-1 rounded-md border border-border">
                          <Flame className="size-3.5 text-orange-500" />
                          {event.hours}h de travail
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="pl-14 text-sm text-muted-foreground">Aucune activité récente.</div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
