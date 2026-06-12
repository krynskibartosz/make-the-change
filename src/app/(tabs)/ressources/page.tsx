'use client'

import { Bell, ImageIcon, MapIcon, Package, Receipt, Users } from 'lucide-react'
import Link from 'next/link'
import { RoleSwitcher } from '../_components/role-switcher'
import { SettingsGroup } from '../_components/settings-group'

export default function RessourcesPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col pb-32 text-foreground">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border/30 bg-background/85 px-5 pb-4 pt-[max(env(safe-area-inset-top),1.25rem)] backdrop-blur-md">
        <div>
          <h1 className="text-3xl font-semibold leading-tight">Ressources</h1>
          <p className="mt-1 text-xs text-muted-foreground">Superviseur (Christophe)</p>
        </div>
        <Link
          href="/notifications"
          aria-label="Notifications"
          className="relative flex size-11 items-center justify-center rounded-full transition-colors hover:bg-surface-elevated"
        >
          <Bell className="size-6" />
        </Link>
      </header>

      <RoleSwitcher />

      <SettingsGroup
        title="Gestion de chantier"
        items={[
          {
            label: 'Configuration des zones',
            description: 'Créer ou modifier les zones',
            href: '/zones',
            icon: MapIcon,
            iconWrapperClassName: 'bg-rose-500',
          },
          {
            label: 'Photos',
            description: 'Preuves et avancement du chantier',
            href: '/photos',
            icon: ImageIcon,
            iconWrapperClassName: 'bg-orange-500',
          },
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
