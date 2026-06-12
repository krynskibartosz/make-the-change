'use client'

import { ImageIcon, MapIcon, MapPinned } from 'lucide-react'
import { SettingsGroup } from '../_components/settings-group'
import { RoleSwitcher } from '../_components/role-switcher'

export default function TerrainPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col pb-32 text-foreground">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border/30 bg-background/85 px-4 pb-4 pt-[max(env(safe-area-inset-top),1.25rem)] backdrop-blur-md">
        <div>
          <h1 className="text-3xl font-semibold leading-tight">Terrain</h1>
          <p className="mt-1 text-xs text-muted-foreground">Données physiques du chantier</p>
        </div>
      </header>

      {/* Uniquement pour tester les rôles facilement sur cette démo */}
      <RoleSwitcher />

      <SettingsGroup
        title="Plans et Espaces"
        items={[
          {
            label: 'Plans du projet',
            description: 'Plans PDF, coupes et 3D',
            href: '/plans',
            icon: MapPinned,
            iconWrapperClassName: 'bg-emerald-500',
          },
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
        ]}
      />
    </main>
  )
}
