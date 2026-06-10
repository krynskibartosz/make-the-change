'use client'

import { ChevronRight, Plus, Users } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FloatingCTA } from '@/components/ui'
import type { Person } from '@/lib/domain'
import { mockClarusRepository } from '@/lib/repositories'
import { Screen } from '../_components/screen'

export default function EquipePage() {
  const router = useRouter()
  const [people, setPeople] = useState<Person[]>([])

  useEffect(() => {
    mockClarusRepository.getPeople().then(setPeople)
  }, [])

  return (
    <Screen title="Équipe du chantier" backHref="/menu">
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
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    par heure
                  </span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground/40" />
              </div>
            </Link>
          ))}
        </div>
      )}

      <FloatingCTA>
        <button
          type="button"
          onClick={() => router.push('/equipe/ajouter')}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground py-3.5 font-semibold active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
        >
          <Plus size={20} />
          Ajouter un membre
        </button>
      </FloatingCTA>
    </Screen>
  )
}
