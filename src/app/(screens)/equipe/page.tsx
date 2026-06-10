'use client'

import { ChevronLeft, Plus, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
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
      <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-surface border-b border-border">
        <div className="flex items-center gap-4">
          <IconButton type="button" onClick={() => router.back()} variant="ghost" aria-label="Retour">
            <ChevronLeft size={24} />
          </IconButton>
          <h1 className="text-xl font-semibold">Équipe du chantier</h1>
        </div>
        <button
          type="button"
          onClick={() => router.push('/equipe/ajouter')}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary bg-primary/10 rounded-[var(--radius-button)] hover:bg-primary/20 transition-colors"
        >
          <Plus size={16} />
          Ajouter
        </button>
      </header>

      <main className="flex-1 p-4">
        <div className="flex flex-col gap-3">
          {people.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
              <Users size={48} className="mb-4 opacity-50" />
              <p>Aucun membre dans l'équipe</p>
            </div>
          ) : (
            people.map((person) => (
              <div
                key={person.id}
                className="flex items-center justify-between p-4 bg-surface border border-border rounded-[var(--radius-card)]"
              >
                <div className="flex flex-col">
                  <span className="font-semibold text-base">{person.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {person.role || 'Sans rôle'}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-medium">{person.defaultHourlyRate} €</span>
                  <span className="text-xs text-muted-foreground">par heure</span>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
