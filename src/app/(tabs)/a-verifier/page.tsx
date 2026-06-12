'use client'

import {
  AlertTriangle,
  Bot,
  Check,
  ChevronRight,
  Clock,
  ListChecks,
  Mic,
  Package,
  Pencil,
  Sparkles,
  User,
} from 'lucide-react'
import { useState } from 'react'
import { Badge, BottomSheet } from '@/components/ui'
import { useRole } from '@/lib/role-context'
import { cn } from '@/lib/utils/cn'
import {
  getReviewPriority,
  groupReviewDrafts,
  type ReviewDraftSignal,
  type ReviewPriority,
} from './review-queue'

type DraftStatus = 'Terminé' | 'En cours' | 'Problème'

type Draft = ReviewDraftSignal & {
  author: string
  time: string
  rawText: string
  extracted: ReviewDraftSignal['extracted'] & {
    hours?: string
    materials?: string[]
    task?: string
  }
}

const mockDrafts: Draft[] = [
  {
    id: 'draft-1',
    author: 'Hubert (Ouvrier)',
    time: "Aujourd'hui à 16:30",
    rawText:
      "J'ai fini de casser la terrasse extérieure. On a mis 12 sacs de gravats dans la benne. Ça m'a pris la journée de 8h à 16h30.",
    extracted: {
      task: 'Démolition terrasse extérieure',
      status: 'Terminé',
      hours: '08:00 - 16:30',
      materials: ['12x Sacs de gravats'],
      confidence: 'Élevée',
    },
  },
  {
    id: 'draft-2',
    author: 'Christophe (Chef)',
    time: 'Hier à 17:45',
    rawText: 'Le client veut changer la couleur de la P1.7, il faut le valider avant de couler.',
    extracted: {
      task: 'Choix technique P1.7',
      status: 'Problème',
      confidence: 'Moyenne',
      missingFields: ['Zone à confirmer', 'Impact planning'],
    },
  },
  {
    id: 'draft-3',
    author: 'Nicolas (Ouvrier)',
    time: 'Hier à 15:10',
    rawText: "La livraison d'isolant est arrivée, mais je n'ai pas compté tous les paquets.",
    extracted: {
      task: "Réception de l'isolant",
      status: 'En cours',
      confidence: 'Faible',
      materials: ["Paquets d'isolant"],
      missingFields: ['Quantité reçue'],
    },
  },
]

const priorityStyles: Record<
  ReviewPriority,
  {
    badgeTone: 'danger' | 'warning' | 'primary'
    iconClass: string
    rowClass: string
  }
> = {
  blocking: {
    badgeTone: 'danger',
    iconClass: 'text-danger',
    rowClass: 'border-l-danger',
  },
  validate: {
    badgeTone: 'warning',
    iconClass: 'text-warning',
    rowClass: 'border-l-warning',
  },
  process: {
    badgeTone: 'primary',
    iconClass: 'text-primary',
    rowClass: 'border-l-primary',
  },
}

export default function AVerifierPage() {
  const { role, isReady } = useRole()
  const [drafts, setDrafts] = useState<Draft[]>(mockDrafts)
  const [selectedDraftId, setSelectedDraftId] = useState<string | null>(null)
  const [editingDraftId, setEditingDraftId] = useState<string | null>(null)
  const [editTask, setEditTask] = useState('')
  const [editHours, setEditHours] = useState('')
  const [editStatus, setEditStatus] = useState<DraftStatus>('Terminé')
  const [editMaterials, setEditMaterials] = useState('')

  if (!isReady) return null

  if (role !== 'chef' && role !== 'admin') {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-5 text-center">
        <AlertTriangle className="size-12 text-orange-500 opacity-50" />
        <h1 className="text-xl font-bold">Accès restreint</h1>
        <p className="text-muted-foreground">
          Cet écran est réservé à la modération par le chef de chantier.
        </p>
      </div>
    )
  }

  const selectedDraft = drafts.find((draft) => draft.id === selectedDraftId) ?? null
  const groups = groupReviewDrafts(drafts)

  const closeDetail = () => {
    setSelectedDraftId(null)
    setEditingDraftId(null)
  }

  const completeDraft = (id: string) => {
    setDrafts((current) => current.filter((draft) => draft.id !== id))
    closeDetail()
  }

  const handleEditClick = (draft: Draft) => {
    setEditTask(draft.extracted.task ?? '')
    setEditHours(draft.extracted.hours ?? '')
    setEditStatus(draft.extracted.status ?? 'Terminé')
    setEditMaterials(draft.extracted.materials?.join('\n') ?? '')
    setEditingDraftId(draft.id)
  }

  const handleSaveEdit = (id: string) => {
    setDrafts((current) =>
      current.map((draft) =>
        draft.id === id
          ? {
              ...draft,
              extracted: {
                ...draft.extracted,
                task: editTask,
                hours: editHours,
                status: editStatus,
                materials: editMaterials
                  .split('\n')
                  .map((material) => material.trim())
                  .filter(Boolean),
              },
            }
          : draft,
      ),
    )
    setEditingDraftId(null)
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background pb-28 text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/40 bg-background/90 px-4 pb-4 pt-[max(env(safe-area-inset-top),1rem)] backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-xl items-center justify-between">
          <div>
            <h1 className="text-xl font-bold leading-tight">À vérifier</h1>
            <p className="mt-0.5 text-xs text-muted-foreground">Cockpit de supervision</p>
          </div>
          <Badge tone={drafts.length > 0 ? 'warning' : 'success'}>{drafts.length} en attente</Badge>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-5 px-4 py-5">
        {drafts.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-success/10">
              <Check className="size-8 text-success" />
            </div>
            <p className="text-lg font-semibold">Rien à vérifier</p>
            <p className="max-w-xs text-sm text-muted-foreground">
              Les notes terrain, tickets et photos à valider apparaîtront ici.
            </p>
          </div>
        ) : (
          groups.map((group) => {
            if (group.items.length === 0) return null
            const styles = priorityStyles[group.priority]

            return (
              <section key={group.priority} className="flex flex-col gap-2">
                <div className="flex items-end justify-between gap-3 px-1">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-bold">{group.label}</h2>
                      <Badge tone={styles.badgeTone} className="min-h-6 px-2">
                        {group.items.length}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{group.description}</p>
                  </div>
                </div>

                <div className="overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface divide-y divide-border">
                  {group.items.map((draft) => (
                    <button
                      type="button"
                      key={draft.id}
                      onClick={() => setSelectedDraftId(draft.id)}
                      className={cn(
                        'flex min-h-20 w-full items-center gap-3 border-l-4 px-3 py-3 text-left transition-colors active:bg-surface-elevated',
                        styles.rowClass,
                      )}
                    >
                      <div className={cn('shrink-0', styles.iconClass)}>
                        {group.priority === 'blocking' ? (
                          <AlertTriangle className="size-5" />
                        ) : group.priority === 'validate' ? (
                          <Bot className="size-5" />
                        ) : (
                          <ListChecks className="size-5" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">
                          {draft.extracted.task ?? 'Note terrain sans titre'}
                        </p>
                        <p className="mt-1 truncate text-xs text-muted-foreground">
                          {draft.author} · {draft.time}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <span className="hidden text-xs font-medium text-muted-foreground min-[390px]:inline">
                          IA {draft.extracted.confidence.toLowerCase()}
                        </span>
                        <ChevronRight className="size-5 text-muted-foreground" />
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )
          })
        )}
      </main>

      <BottomSheet isOpen={selectedDraft !== null} onClose={closeDetail} title="Détail à vérifier">
        {selectedDraft ? (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={priorityStyles[getReviewPriority(selectedDraft)].badgeTone}>
                  {groups.find((group) => group.priority === getReviewPriority(selectedDraft))
                    ?.label ?? 'À traiter'}
                </Badge>
                <span className="text-xs text-muted-foreground">{selectedDraft.time}</span>
              </div>
              <h2 className="text-lg font-bold leading-snug">
                {selectedDraft.extracted.task ?? 'Note terrain sans titre'}
              </h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="size-4" />
                {selectedDraft.author}
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border bg-surface-elevated px-3 py-2.5">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Bot className="size-4 text-primary" />
                Confiance IA
              </div>
              <Badge
                tone={
                  selectedDraft.extracted.confidence === 'Élevée'
                    ? 'success'
                    : selectedDraft.extracted.confidence === 'Moyenne'
                      ? 'warning'
                      : 'danger'
                }
              >
                {selectedDraft.extracted.confidence}
              </Badge>
            </div>

            {editingDraftId !== selectedDraft.id ? (
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => completeDraft(selectedDraft.id)}
                  className="flex min-h-11 items-center justify-center gap-1.5 rounded-lg bg-success px-2 text-xs font-bold text-white"
                >
                  <Check className="size-4" />
                  Valider
                </button>
                <button
                  type="button"
                  onClick={() => handleEditClick(selectedDraft)}
                  className="flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-2 text-xs font-bold"
                >
                  <Pencil className="size-4" />
                  Corriger
                </button>
                <button
                  type="button"
                  onClick={() => completeDraft(selectedDraft.id)}
                  className="flex min-h-11 items-center justify-center gap-1.5 rounded-lg bg-primary px-2 text-xs font-bold text-primary-foreground"
                >
                  <ListChecks className="size-4" />
                  Organiser
                </button>
              </div>
            ) : null}

            <section className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground">
                <Mic className="size-4" />
                Note brute
              </div>
              <p className="border-l-2 border-primary/40 pl-3 text-sm italic leading-relaxed text-muted-foreground">
                « {selectedDraft.rawText} »
              </p>
            </section>

            {editingDraftId === selectedDraft.id ? (
              <div className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-primary/30 bg-primary/5 p-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-primary">
                  <Pencil className="size-4" />
                  Correction
                </div>
                <label className="flex flex-col gap-1.5 text-xs font-semibold">
                  Tâche
                  <input
                    type="text"
                    value={editTask}
                    onChange={(event) => setEditTask(event.target.value)}
                    className="min-h-11 rounded-lg border border-border bg-background px-3 text-sm font-normal"
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-xs font-semibold">
                  Heures
                  <input
                    type="text"
                    value={editHours}
                    onChange={(event) => setEditHours(event.target.value)}
                    placeholder="08:00 - 16:30"
                    className="min-h-11 rounded-lg border border-border bg-background px-3 text-sm font-normal"
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-xs font-semibold">
                  Statut
                  <select
                    value={editStatus}
                    onChange={(event) => setEditStatus(event.target.value as DraftStatus)}
                    className="min-h-11 rounded-lg border border-border bg-background px-3 text-sm font-normal"
                  >
                    <option value="Terminé">Terminé</option>
                    <option value="En cours">En cours</option>
                    <option value="Problème">Problème</option>
                  </select>
                </label>
                <label className="flex flex-col gap-1.5 text-xs font-semibold">
                  Matériaux, un par ligne
                  <textarea
                    value={editMaterials}
                    onChange={(event) => setEditMaterials(event.target.value)}
                    className="min-h-20 rounded-lg border border-border bg-background p-3 text-sm font-normal"
                  />
                </label>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setEditingDraftId(null)}
                    className="min-h-11 rounded-lg border border-border bg-surface text-sm font-semibold"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveEdit(selectedDraft.id)}
                    className="min-h-11 rounded-lg bg-primary text-sm font-semibold text-primary-foreground"
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            ) : (
              <section className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-border bg-surface-elevated p-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-primary">
                  <Sparkles className="size-4" />
                  Lecture proposée
                </div>

                {selectedDraft.extracted.missingFields?.length ? (
                  <div className="rounded-lg border border-warning/30 bg-warning/10 p-3">
                    <p className="text-xs font-bold text-warning">À confirmer</p>
                    <ul className="mt-1.5 flex flex-col gap-1 text-sm">
                      {selectedDraft.extracted.missingFields.map((field) => (
                        <li key={field}>• {field}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div className="grid grid-cols-2 gap-3">
                  {selectedDraft.extracted.hours ? (
                    <div>
                      <p className="text-xs text-muted-foreground">Heures</p>
                      <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold">
                        <Clock className="size-4 text-info" />
                        {selectedDraft.extracted.hours}
                      </p>
                    </div>
                  ) : null}
                  {selectedDraft.extracted.status ? (
                    <div>
                      <p className="text-xs text-muted-foreground">Statut</p>
                      <p className="mt-1 text-sm font-semibold">{selectedDraft.extracted.status}</p>
                    </div>
                  ) : null}
                </div>

                {selectedDraft.extracted.materials?.length ? (
                  <div>
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Package className="size-4 text-success" />
                      Matériaux
                    </p>
                    <p className="mt-1 text-sm font-semibold">
                      {selectedDraft.extracted.materials.join(', ')}
                    </p>
                  </div>
                ) : null}
              </section>
            )}
          </div>
        ) : null}
      </BottomSheet>
    </div>
  )
}
