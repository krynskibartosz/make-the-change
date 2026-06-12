'use client'

import { Package, Receipt, Users } from 'lucide-react'
import { SettingsGroup } from '../_components/settings-group'

export default function GestionPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col pb-32 text-foreground">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border/30 bg-background/85 px-4 pb-4 pt-[max(env(safe-area-inset-top),1.25rem)] backdrop-blur-md">
        <div>
          <h1 className="text-3xl font-semibold leading-tight">Gestion</h1>
          <p className="mt-1 text-xs text-muted-foreground">Ressources, matériel et coûts</p>
        </div>
      </header>

      <SettingsGroup
        title="L'équipe"
        items={[
          {
            label: 'Équipe du chantier',
            description: 'Rôles, compétences et contacts',
            href: '/equipe',
            icon: Users,
            iconWrapperClassName: 'bg-indigo-500',
          },
        ]}
      />

      <SettingsGroup
        title="Matériel & Coûts"
        items={[
          {
            label: 'Matériaux & stock',
            description: 'Besoins, utilisations et inventaire',
            href: '/materiaux',
            icon: Package,
            iconWrapperClassName: 'bg-emerald-500',
          },
          {
            label: 'Dépenses terrain',
            description: 'Tickets et achats à vérifier',
            href: '/couts',
            icon: Receipt,
            iconWrapperClassName: 'bg-teal-500',
          },
        ]}
      />
    </main>
  )
}
