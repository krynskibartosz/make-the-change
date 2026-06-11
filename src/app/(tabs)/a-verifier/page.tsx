'use client'

import { AlertTriangle, Bot, Check, Clock, Mic, Package, User } from 'lucide-react'
import { useState } from 'react'
import { useRole } from '@/lib/role-context'

type Draft = {
  id: string
  author: string
  time: string
  rawText: string
  extracted: {
    hours?: string
    materials?: string[]
    task?: string
    status?: 'Terminé' | 'En cours' | 'Problème'
    confidence: 'Élevée' | 'Moyenne' | 'Faible'
    missingFields?: string[]
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
]

export default function AVerifierPage() {
  const { role, isReady } = useRole()
  const [drafts, setDrafts] = useState<Draft[]>(mockDrafts)
  const [editingDraftId, setEditingDraftId] = useState<string | null>(null)

  // State for edit form
  const [editTask, setEditTask] = useState('')
  const [editHours, setEditHours] = useState('')
  const [editStatus, setEditStatus] = useState<'Terminé' | 'En cours' | 'Problème'>('Terminé')
  const [editMaterials, setEditMaterials] = useState('')

  if (!isReady) return null

  // Redirection ou message si on n'est pas chef
  if (role !== 'chef' && role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-5 text-center gap-4">
        <AlertTriangle className="size-12 text-orange-500 opacity-50" />
        <h1 className="text-xl font-bold">Accès restreint</h1>
        <p className="text-muted-foreground">
          Cet écran est réservé à la modération par le Chef de Chantier.
        </p>
      </div>
    )
  }

  const handleValidate = (id: string) => {
    // Animation/State update mock
    setDrafts((prev) => prev.filter((d) => d.id !== id))
  }

  const handleEditClick = (draft: Draft) => {
    setEditTask(draft.extracted.task || '')
    setEditHours(draft.extracted.hours || '')
    setEditStatus(draft.extracted.status || 'Terminé')
    setEditMaterials(draft.extracted.materials ? draft.extracted.materials.join('\n') : '')
    setEditingDraftId(draft.id)
  }

  const handleSaveEdit = (id: string) => {
    setDrafts((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          return {
            ...d,
            extracted: {
              ...d.extracted,
              task: editTask,
              hours: editHours,
              status: editStatus,
              materials: editMaterials ? editMaterials.split('\n').filter(Boolean) : [],
            },
          }
        }
        return d
      }),
    )
    setEditingDraftId(null)
  }

  return (
    <div className="flex flex-col min-h-dvh pb-32 text-foreground">
      <header className="sticky top-0 z-30 flex flex-col gap-4 pb-4 px-5 pt-[max(env(safe-area-inset-top),1.25rem)] bg-background/80 backdrop-blur-md border-b border-border/30">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold leading-tight">À Vérifier</h1>
          <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-full">
            {drafts.length} en attente
          </span>
        </div>
      </header>

      <main className="flex-1 flex flex-col gap-6 p-5 max-w-md mx-auto w-full">
        {drafts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center gap-3">
            <div className="p-4 bg-emerald-500/10 rounded-full mb-2">
              <Check className="size-10 text-emerald-500" />
            </div>
            <p className="font-semibold text-lg text-foreground">Rien à vérifier</p>
            <p className="text-sm text-muted-foreground px-4">
              Les notes terrain, tickets et photos à valider apparaîtront ici.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {drafts.map((draft) => (
              <div
                key={draft.id}
                className="flex flex-col rounded-2xl border border-border bg-surface overflow-hidden shadow-sm"
              >
                {/* Source & Auteur */}
                <div className="bg-surface-elevated px-4 py-3 border-b border-border/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="size-4 text-muted-foreground" />
                    <span className="text-sm font-semibold">{draft.author}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{draft.time}</span>
                </div>

                <div className="p-4 flex flex-col gap-5">
                  {/* Note vocale brute */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      <Mic className="size-3.5" />
                      Note brute
                    </div>
                    <p className="text-sm italic text-muted-foreground border-l-2 border-primary/30 pl-3">
                      "{draft.rawText}"
                    </p>
                  </div>

                  {/* Extraction IA ou Mode Édition */}
                  {editingDraftId === draft.id ? (
                    <div className="flex flex-col gap-3 p-4 bg-primary/5 rounded-xl border border-primary/20">
                      <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider mb-1">
                        Modification
                      </div>
                      <label className="flex flex-col gap-1">
                        <span className="text-[10px] text-muted-foreground uppercase">Tâche</span>
                        <input
                          type="text"
                          value={editTask}
                          onChange={(e) => setEditTask(e.target.value)}
                          className="bg-background border border-border rounded-md px-3 py-1.5 text-sm"
                        />
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <label className="flex flex-col gap-1">
                          <span className="text-[10px] text-muted-foreground uppercase">
                            Heures
                          </span>
                          <input
                            type="text"
                            value={editHours}
                            onChange={(e) => setEditHours(e.target.value)}
                            className="bg-background border border-border rounded-md px-3 py-1.5 text-sm"
                            placeholder="ex: 08:00 - 16:30"
                          />
                        </label>
                        <label className="flex flex-col gap-1">
                          <span className="text-[10px] text-muted-foreground uppercase">
                            Statut
                          </span>
                          <select
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value as any)}
                            className="bg-background border border-border rounded-md px-3 py-1.5 text-sm"
                          >
                            <option value="Terminé">Terminé</option>
                            <option value="En cours">En cours</option>
                            <option value="Problème">Problème</option>
                          </select>
                        </label>
                      </div>
                      <label className="flex flex-col gap-1">
                        <span className="text-[10px] text-muted-foreground uppercase">
                          Matériaux (un par ligne)
                        </span>
                        <textarea
                          value={editMaterials}
                          onChange={(e) => setEditMaterials(e.target.value)}
                          className="bg-background border border-border rounded-md px-3 py-1.5 text-sm min-h-[60px]"
                        />
                      </label>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => setEditingDraftId(null)}
                          className="flex-1 bg-surface-elevated hover:bg-border border border-border text-foreground text-sm font-medium py-2 rounded-xl transition-colors"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={() => handleSaveEdit(draft.id)}
                          className="flex-1 bg-primary text-primary-foreground text-sm font-semibold py-2 rounded-xl transition-colors"
                        >
                          Sauvegarder
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10 relative">
                      <div className="absolute top-3 right-3">
                        <Bot className="size-5 text-primary opacity-50" />
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
                          Extraction IA
                        </div>
                        {draft.extracted.confidence === 'Élevée' ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                            Confiance Élevée
                          </span>
                        ) : draft.extracted.confidence === 'Moyenne' ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-600 dark:text-yellow-400">
                            À compléter
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-600 dark:text-orange-400">
                            Doute IA
                          </span>
                        )}
                      </div>

                      {draft.extracted.missingFields &&
                        draft.extracted.missingFields.length > 0 && (
                          <div className="flex flex-col gap-1 mb-2 p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                            <span className="text-[10px] font-bold uppercase text-yellow-700 dark:text-yellow-400">
                              Points à vérifier :
                            </span>
                            {draft.extracted.missingFields.map((f, i) => (
                              <span
                                key={i}
                                className="text-xs font-medium text-yellow-700 dark:text-yellow-400"
                              >
                                - {f}
                              </span>
                            ))}
                          </div>
                        )}

                      {draft.extracted.task && (
                        <div className="flex flex-col">
                          <span className="text-[10px] text-muted-foreground uppercase">Tâche</span>
                          <span className="text-sm font-medium">{draft.extracted.task}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-3 mt-1">
                        {draft.extracted.hours && (
                          <div className="flex items-center gap-2">
                            <Clock className="size-4 text-blue-500" />
                            <span className="text-sm font-semibold">{draft.extracted.hours}</span>
                          </div>
                        )}
                        {draft.extracted.status && (
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${draft.extracted.status === 'Terminé' ? 'bg-emerald-500' : draft.extracted.status === 'Problème' ? 'bg-orange-500' : 'bg-blue-500'}`}
                            />
                            <span className="text-sm font-semibold">{draft.extracted.status}</span>
                          </div>
                        )}
                      </div>

                      {draft.extracted.materials && draft.extracted.materials.length > 0 && (
                        <div className="flex flex-col gap-1 mt-1">
                          <div className="flex items-center gap-2">
                            <Package className="size-4 text-emerald-500" />
                            <span className="text-[10px] text-muted-foreground uppercase">
                              Matériaux
                            </span>
                          </div>
                          {draft.extracted.materials.map((mat, i) => (
                            <span key={i} className="text-sm font-medium pl-6">
                              {mat}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  {editingDraftId !== draft.id && (
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => handleValidate(draft.id)}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                      >
                        <Check className="size-5" />
                        Valider
                      </button>
                      <button
                        onClick={() => handleEditClick(draft)}
                        className="flex-1 bg-surface-elevated hover:bg-border border border-border text-foreground font-medium py-3 rounded-xl transition-colors"
                      >
                        Corriger
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
