'use client'

import { useState } from 'react'
import { Bot, Check, Clock, Package, Mic, AlertTriangle, User } from 'lucide-react'
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
  }
}

const mockDrafts: Draft[] = [
  {
    id: 'draft-1',
    author: 'Hubert (Ouvrier)',
    time: "Aujourd'hui à 16:30",
    rawText: "J'ai fini de casser la terrasse extérieure. On a mis 12 sacs de gravats dans la benne. Ça m'a pris la journée de 8h à 16h30.",
    extracted: {
      task: 'Démolition terrasse extérieure',
      status: 'Terminé',
      hours: '08:00 - 16:30',
      materials: ['12x Sacs de gravats']
    }
  },
  {
    id: 'draft-2',
    author: 'Christophe (Chef)',
    time: "Hier à 17:45",
    rawText: "Le client veut changer la couleur de la P1.7, il faut le valider avant de couler.",
    extracted: {
      task: 'Choix technique P1.7',
      status: 'Problème',
    }
  }
]

export default function AVerifierPage() {
  const { role, isReady } = useRole()
  const [drafts, setDrafts] = useState<Draft[]>(mockDrafts)

  if (!isReady) return null

  // Redirection ou message si on n'est pas chef
  if (role !== 'chef' && role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-5 text-center gap-4">
        <AlertTriangle className="size-12 text-orange-500 opacity-50" />
        <h1 className="text-xl font-bold">Accès restreint</h1>
        <p className="text-muted-foreground">Cet écran est réservé à la modération par le Chef de Chantier.</p>
      </div>
    )
  }

  const handleValidate = (id: string) => {
    // Animation/State update mock
    setDrafts(prev => prev.filter(d => d.id !== id))
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
          <div className="flex flex-col items-center justify-center h-48 text-center gap-3">
            <div className="p-4 bg-emerald-500/10 rounded-full">
              <Check className="size-8 text-emerald-500" />
            </div>
            <p className="font-medium text-muted-foreground">Tout est validé !</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {drafts.map((draft) => (
              <div key={draft.id} className="flex flex-col rounded-2xl border border-border bg-surface overflow-hidden shadow-sm">
                
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

                  {/* Extraction IA */}
                  <div className="flex flex-col gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10 relative">
                    <div className="absolute top-3 right-3">
                      <Bot className="size-5 text-primary opacity-50" />
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider mb-1">
                      Extraction IA
                    </div>
                    
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
                          <div className={`w-2 h-2 rounded-full ${draft.extracted.status === 'Terminé' ? 'bg-emerald-500' : draft.extracted.status === 'Problème' ? 'bg-orange-500' : 'bg-blue-500'}`} />
                          <span className="text-sm font-semibold">{draft.extracted.status}</span>
                        </div>
                      )}
                    </div>

                    {draft.extracted.materials && draft.extracted.materials.length > 0 && (
                      <div className="flex flex-col gap-1 mt-1">
                        <div className="flex items-center gap-2">
                          <Package className="size-4 text-emerald-500" />
                          <span className="text-[10px] text-muted-foreground uppercase">Matériaux</span>
                        </div>
                        {draft.extracted.materials.map((mat, i) => (
                          <span key={i} className="text-sm font-medium pl-6">{mat}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <button 
                      onClick={() => handleValidate(draft.id)}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <Check className="size-5" />
                      Valider
                    </button>
                    <button className="flex-1 bg-surface-elevated hover:bg-border border border-border text-foreground font-medium py-3 rounded-xl transition-colors">
                      Corriger
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
