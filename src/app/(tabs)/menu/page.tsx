'use client'

import {
  BarChart3,
  ChevronRight,
  ClipboardList,
  Image as ImageIcon,
  type LucideIcon,
  Map,
  Package,
  PlusCircle,
  Settings,
  Users,
} from 'lucide-react'
import Link from 'next/link'

type SettingsItem = {
  label: string
  description?: string
  href?: string
  icon: LucideIcon
  iconWrapperClassName: string
  iconClassName?: string
}

function SettingsGroup({ title, items }: { title: string; items: SettingsItem[] }) {
  return (
    <section>
      <h3 className="ml-8 mb-2 mt-6 text-[11px] font-medium uppercase tracking-widest text-muted-foreground/70">
        {title}
      </h3>

      <div className="mx-4 mb-8 overflow-hidden rounded-xl bg-surface border border-border/50">
        {items.map((item, index) => {
          const Icon = item.icon
          const iconClassName = item.iconClassName ?? 'text-primary-foreground'
          const row = (
            <>
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${item.iconWrapperClassName}`}
                >
                  <Icon className={`h-4 w-4 ${iconClassName}`} />
                </div>

                <div className="flex flex-col justify-center">
                  <span className="text-sm font-medium text-foreground leading-tight">
                    {item.label}
                  </span>
                  {item.description && (
                    <span className="text-[11px] text-muted-foreground/80 mt-0.5 leading-none">
                      {item.description}
                    </span>
                  )}
                </div>
              </div>

              <ChevronRight className="h-4 w-4 text-muted-foreground/40 shrink-0" />
            </>
          )

          return (
            <div key={item.label}>
              {item.href ? (
                <Link
                  href={item.href}
                  className="flex w-full items-center justify-between bg-transparent px-4 py-3 transition-colors active:bg-surface-elevated"
                >
                  {row}
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  className="flex w-full items-center justify-between bg-transparent px-4 py-3 transition-colors opacity-50 cursor-not-allowed"
                >
                  {row}
                </button>
              )}

              {index < items.length - 1 ? (
                <div className="ml-[3.25rem] border-b border-border/50" />
              ) : null}
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default function MenuPage() {
  const managementItems: SettingsItem[] = [
    {
      label: 'Coûts',
      description: 'Gérer les dépenses et la facturation',
      icon: BarChart3,
      href: '/couts',
      iconWrapperClassName: 'bg-blue-500',
      iconClassName: 'text-white',
    },
    {
      label: 'Matériaux',
      description: 'Gérer les matériaux et le stock',
      icon: Package,
      href: '/materiaux',
      iconWrapperClassName: 'bg-emerald-500',
      iconClassName: 'text-white',
    },
  ]

  const projectItems: SettingsItem[] = [
    {
      label: 'Chantier — Zones & Plans',
      description: 'Zones, références techniques et suivi',
      icon: Map,
      href: '/plans',
      iconWrapperClassName: 'bg-purple-500',
      iconClassName: 'text-white',
    },
    {
      label: 'Historique',
      description: 'Toutes les interventions du chantier',
      icon: ClipboardList,
      href: '/historique',
      iconWrapperClassName: 'bg-slate-500',
      iconClassName: 'text-white',
    },
    {
      label: 'Photos',
      description: 'Voir et ajouter des photos du chantier',
      icon: ImageIcon,
      href: '/photos',
      iconWrapperClassName: 'bg-orange-500',
      iconClassName: 'text-white',
    },
    {
      label: 'Équipe du chantier',
      description: "Gérer les membres de l'équipe",
      icon: Users,
      href: '/equipe',
      iconWrapperClassName: 'bg-indigo-500',
      iconClassName: 'text-white',
    },
  ]

  const appItems: SettingsItem[] = [
    {
      label: 'Paramètres',
      description: "Configuration de l'application",
      icon: Settings,
      iconWrapperClassName: 'bg-gray-500',
      iconClassName: 'text-white',
    },
  ]

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col pb-32 text-foreground">
      <header className="sticky top-0 z-30 flex items-center gap-4 pb-4 px-5 pt-[max(env(safe-area-inset-top),1.25rem)] bg-background/80 backdrop-blur-md border-b border-border/30">
        <div className="min-w-0">
          <h1 className="text-3xl font-semibold leading-tight">Menu</h1>
        </div>
      </header>

      <div className="flex flex-col">
        <SettingsGroup title="Gestion financière" items={managementItems} />
        <SettingsGroup title="Suivi de chantier" items={projectItems} />
        <SettingsGroup title="Application" items={appItems} />
      </div>
    </main>
  )
}
