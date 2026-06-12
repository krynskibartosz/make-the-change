'use client'

import { Bell, CircleHelp, Settings, Timer, LogOut } from 'lucide-react'
import Link from 'next/link'
import { RoleSwitcher } from '../_components/role-switcher'
import { SettingsGroup } from '../_components/settings-group'

export default function ProfilPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col pb-32 text-foreground">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border/30 bg-background/85 px-4 pb-4 pt-[max(env(safe-area-inset-top),1.25rem)] backdrop-blur-md">
        <div>
          <h1 className="text-3xl font-semibold leading-tight">Profil</h1>
          <p className="mt-1 text-xs text-muted-foreground">Ouvrier (Hubert)</p>
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
        title="Mes outils"
        items={[
          {
            label: 'Noter mes heures',
            description: 'Ajouter rapidement ma journée',
            href: '/ajouter-heures',
            icon: Timer,
            iconWrapperClassName: 'bg-emerald-500',
          },
        ]}
      />

      <SettingsGroup
        title="Aide & Compte"
        items={[
          {
            label: 'Comment dicter',
            description: 'Exemples de notes efficaces',
            href: '/chantier',
            icon: CircleHelp,
            iconWrapperClassName: 'bg-violet-500',
          },
          {
            label: 'Paramètres',
            description: "Réglages de l'application",
            icon: Settings,
            iconWrapperClassName: 'bg-gray-500',
          },
          {
            label: 'Déconnexion',
            icon: LogOut,
            iconWrapperClassName: 'bg-red-500',
          },
        ]}
      />
    </main>
  )
}
