'use client'

import { type AppRole, useRole } from '@/lib/role-context'

const roleLabels: Record<AppRole, string> = {
  ouvrier: 'Ouvrier (Hubert)',
  chef: 'Superviseur (Christophe)',
  admin: 'Pilotage chantier (Martin)',
  client: 'Client final (Jean)',
}

export function RoleSwitcher() {
  const { role, setRole, isReady } = useRole()

  if (!isReady) return null

  return (
    <section>
      <h2 className="mb-2 ml-8 mt-6 text-[11px] font-medium uppercase tracking-widest text-muted-foreground/70">
        Mode démonstration
      </h2>
      <div className="mx-4 mb-3 overflow-hidden rounded-lg border border-border/50 bg-surface">
        {(['ouvrier', 'chef', 'admin', 'client'] as AppRole[]).map((candidate, index) => (
          <div key={candidate}>
            <button
              type="button"
              onClick={() => setRole(candidate)}
              className={`flex min-h-12 w-full items-center justify-between px-4 py-3 text-left transition-colors active:bg-surface-elevated ${
                role === candidate ? 'bg-primary/5 font-bold text-primary' : 'text-foreground'
              }`}
            >
              <span>Mode {roleLabels[candidate]}</span>
              {role === candidate && <span aria-hidden="true">✓</span>}
            </button>
            {index < 3 && <div className="border-b border-border/50" />}
          </div>
        ))}
      </div>
      <p className="mx-6 text-xs leading-relaxed text-muted-foreground">
        Ce sélecteur est uniquement présent pour tester rapidement les quatre expériences.
      </p>
    </section>
  )
}
