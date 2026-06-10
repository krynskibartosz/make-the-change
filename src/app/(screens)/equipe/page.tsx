'use client'

import { ChevronLeft, ChevronRight, Plus, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { IconButton } from '@/components/ui/button'
import type { Person } from '@/lib/domain'
import { mockClarusRepository } from '@/lib/repositories'

export default function EquipePage() {
  const router = useRouter()
  const [people, setPeople] = useState<Person[]>([])

  useEffect(() => {
    mockClarusRepository.getPeople().then(setPeople)
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 flex items-center justify-between pb-4 px-5 pt-[max(env(safe-area-inset-top),1.25rem)] bg-background/80 backdrop-blur-md border-b border-border/70 mb-5">
        <div className="flex items-center gap-4">
          <IconButton type="button" onClick={() => router.back()} variant="ghost" aria-label="Retour">
            <ChevronLeft size={24} />
          </IconButton>
          <h1 className="text-xl font-semibold">Équipe du chantier</h1>
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="flex flex-col gap-3">
          {people.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
              <Users size={48} className="mb-4 opacity-50" />
              <p>Aucun membre dans l'équipe</p>
            </div>
          ) : (
            <div className="flex flex-col bg-surface rounded-[var(--radius-card)] border border-border">
              {people.map((person) => (
                <Link
                  key={person.id}
                  href={`/equipe/${person.id}/editer`}
                  className="flex items-center justify-between p-4 transition-colors border-b border-border last:border-0 active:bg-surface-elevated"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {person.avatarUrl ? (
                      <img
                        src={person.avatarUrl}
                        alt={`Avatar de ${person.name}`}
                        className="h-12 w-12 rounded-full border border-border object-cover bg-background shrink-0"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full border border-border bg-background flex items-center justify-center shrink-0">
                        <span className="text-sm font-medium text-muted-foreground uppercase">
                          {person.name.substring(0, 2)}
                        </span>
                      </div>
                    )}
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-base truncate">{person.name}</span>
                      <span className="text-sm text-muted-foreground truncate">
                        {person.role || 'Sans rôle'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end">
                      <span className="font-medium">{person.defaultHourlyRate} €</span>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">par heure</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground/40" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 pb-[max(env(safe-area-inset-bottom),1rem)] bg-background/90 backdrop-blur-md border-t border-border/50 z-40">
        <div className="max-w-md mx-auto">
          <button
            type="button"
            onClick={() => router.push('/equipe/ajouter')}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground py-3.5 font-semibold active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
          >
            <Plus size={20} />
            Ajouter un membre
          </button>
        </div>
      </div>
    </div>
  )
}
