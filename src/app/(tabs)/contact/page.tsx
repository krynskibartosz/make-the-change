'use client'

import { Bell, Mail, Settings, Phone, FileText } from 'lucide-react'
import Link from 'next/link'
import { RoleSwitcher } from '../_components/role-switcher'
import { SettingsGroup } from '../_components/settings-group'

export default function ContactPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col pb-32 text-foreground">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border/30 bg-background/85 px-5 pb-4 pt-[max(env(safe-area-inset-top),1.25rem)] backdrop-blur-md">
        <div>
          <h1 className="text-3xl font-semibold leading-tight">Contact</h1>
          <p className="mt-1 text-xs text-muted-foreground">Client (Jean)</p>
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
        title="L'entreprise"
        items={[
          {
            label: 'Contacter Martin',
            description: 'Poser une question sur votre chantier',
            href: 'mailto:martin@clarus.com',
            icon: Mail,
            iconWrapperClassName: 'bg-blue-500',
          },
          {
            label: 'Appeler',
            description: '+32 470 12 34 56',
            href: 'tel:+32470123456',
            icon: Phone,
            iconWrapperClassName: 'bg-emerald-500',
          },
        ]}
      />

      <SettingsGroup
        title="Documents"
        items={[
          {
            label: 'Mes Devis & Factures',
            description: 'Historique des documents',
            icon: FileText,
            iconWrapperClassName: 'bg-violet-500',
          },
          {
            label: 'Paramètres',
            description: 'Notifications et préférences',
            icon: Settings,
            iconWrapperClassName: 'bg-gray-500',
          },
        ]}
      />
    </main>
  )
}
