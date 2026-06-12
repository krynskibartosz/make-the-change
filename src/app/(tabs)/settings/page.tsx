'use client'

import { Bell, ImageIcon, Settings, UserRound, FileText } from 'lucide-react'
import Link from 'next/link'
import { RoleSwitcher } from '../_components/role-switcher'
import { SettingsGroup } from '../_components/settings-group'

export default function SettingsPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col pb-32 text-foreground">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border/30 bg-background/85 px-4 pb-4 pt-[max(env(safe-area-inset-top),1.25rem)] backdrop-blur-md">
        <div>
          <h1 className="text-3xl font-semibold leading-tight">Réglages</h1>
          <p className="mt-1 text-xs text-muted-foreground">Pilotage (Martin)</p>
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
        title="Informations"
        items={[
          {
            label: 'Jean Dupont',
            description: 'Relation client et actions',
            href: '/client/client-dupont',
            icon: UserRound,
            iconWrapperClassName: 'bg-indigo-500',
          },
          {
            label: 'Photos validées',
            description: 'Preuves partageables avec le client',
            href: '/photos',
            icon: ImageIcon,
            iconWrapperClassName: 'bg-orange-500',
          },
          {
            label: 'Rapports hebdomadaires',
            description: 'Synthèses publiées du chantier',
            href: '/rapports/semaine-24',
            icon: FileText,
            iconWrapperClassName: 'bg-violet-500',
          },
        ]}
      />

      <SettingsGroup
        title="Système"
        items={[
          {
            label: 'Paramètres du compte',
            description: 'TVA, adresses, mentions légales',
            icon: Settings,
            iconWrapperClassName: 'bg-gray-500',
          },
        ]}
      />
    </main>
  )
}
