'use client'

import { Building2, ChevronRight, Phone, Plus, Users } from 'lucide-react'
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
              href={`/equipe/${person.id}`}
              className="flex flex-col p-4 transition-colors border-b border-border last:border-0 active:bg-surface-elevated gap-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  {person.avatarUrl ? (
                    <img
                      src={person.avatarUrl}
                      alt={`Avatar de ${person.name}`}
                      className="size-14 rounded-full border border-border object-cover bg-background shrink-0"
                    />
                  ) : (
                    <div className="size-14 rounded-full border border-border bg-background flex items-center justify-center shrink-0">
                      <span className="text-sm font-medium text-muted-foreground uppercase">
                        {person.name.substring(0, 2)}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-base truncate flex items-center gap-2">
                      {person.name}
                    </span>
                    <span className="text-sm text-muted-foreground truncate leading-tight mb-1">
                      {person.role || 'Sans rôle'}
                    </span>
                    {person.company && (
                      <span className="text-[10px] font-semibold bg-primary/10 text-primary px-1.5 py-0.5 rounded w-fit flex items-center gap-1 mt-0.5">
                        <Building2 className="size-3" />
                        {person.company}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between h-14">
                  {person.phone ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        window.open(`tel:${person.phone}`)
                      }}
                      className="bg-emerald-500/10 text-emerald-600 p-2 rounded-full border border-emerald-500/20 active:bg-emerald-500/20 transition-colors"
                    >
                      <Phone className="size-4" />
                    </button>
                  ) : (
                    <div className="size-8" />
                  )}
                  <ChevronRight className="h-4 w-4 text-muted-foreground/40" />
                </div>
              </div>

              {person.skills && person.skills.length > 0 && (
                <div className="flex gap-1.5 flex-wrap ml-[4.25rem]">
                  {person.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-[10px] font-bold uppercase tracking-wider bg-surface-elevated px-2 py-0.5 rounded-md text-muted-foreground border border-border flex items-center gap-1"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
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
