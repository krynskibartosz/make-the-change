'use client'

import {
  BarChart3,
  Bell,
  BriefcaseBusiness,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  ClipboardList,
  FileText,
  Image as ImageIcon,
  Mail,
  Map as MapIcon,
  Package,
  Receipt,
  Settings,
  Timer,
  UserRound,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { type AppRole, useRole } from '@/lib/role-context'

type SettingsItem = {
  label: string
  description?: string
  href?: string
  icon: typeof Settings
  iconWrapperClassName: string
}

type SettingsSection = {
  title: string
  items: SettingsItem[]
}

const roleLabels: Record<AppRole, string> = {
  ouvrier: 'Ouvrier (Hubert)',
  chef: 'Superviseur (Christophe)',
  admin: 'Pilotage chantier (Martin)',
  client: 'Client final (Jean)',
}

const roleSections: Record<AppRole, SettingsSection[]> = {
  ouvrier: [
    {
      title: 'Mon chantier',
      items: [
        {
          label: 'Villa Sparrenlaan',
          description: 'Sparrenlaan 35, Overijse',
          href: '/chantier',
          icon: BriefcaseBusiness,
          iconWrapperClassName: 'bg-primary',
        },
        {
          label: 'Mes envoyés',
          description: 'Voir ce que Christophe a reçu',
          href: '/historique',
          icon: ClipboardList,
          iconWrapperClassName: 'bg-blue-500',
        },
        {
          label: 'Noter mes heures',
          description: 'Ajouter rapidement ma journée',
          href: '/ajouter-heures',
          icon: Timer,
          iconWrapperClassName: 'bg-emerald-500',
        },
        {
          label: 'Photos envoyées',
          description: 'Retrouver mes preuves terrain',
          href: '/photos',
          icon: ImageIcon,
          iconWrapperClassName: 'bg-orange-500',
        },
      ],
    },
    {
      title: 'Aide',
      items: [
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
      ],
    },
  ],
  chef: [
    {
      title: 'Supervision',
      items: [
        {
          label: 'À vérifier',
          description: 'Valider les remontées du terrain',
          href: '/a-verifier',
          icon: ClipboardCheck,
          iconWrapperClassName: 'bg-amber-500',
        },
        {
          label: 'Aujourd\'hui & Journal',
          description: 'Cockpit du jour, semaine, chronologie',
          href: '/planning',
          icon: ClipboardList,
          iconWrapperClassName: 'bg-blue-500',
        },
        {
          label: 'Kanban d\'exécution',
          description: 'Débloquer et avancer les tâches',
          href: '/board',
          icon: FileText,
          iconWrapperClassName: 'bg-slate-500',
        },
      ],
    },
    {
      title: 'Chantier',
      items: [
        {
          label: 'Chantier — Plans & suivi',
          description: 'Zones, tâches et points techniques',
          href: '/plans',
          icon: MapIcon,
          iconWrapperClassName: 'bg-purple-500',
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
        {
          label: 'Équipe du chantier',
          description: 'Rôles, compétences et contacts',
          href: '/equipe',
          icon: Users,
          iconWrapperClassName: 'bg-indigo-500',
        },
      ],
    },
    {
      title: 'Ressources',
      items: [
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
      ],
    },
  ],
  admin: [
    {
      title: 'Pilotage',
      items: [
        {
          label: 'Vue globale',
          description: 'Décisions, risques et finances',
          href: '/dashboard',
          icon: BarChart3,
          iconWrapperClassName: 'bg-blue-500',
        },
        {
          label: 'Projets',
          description: 'Portefeuille de chantiers',
          href: '/projets',
          icon: BriefcaseBusiness,
          iconWrapperClassName: 'bg-primary',
        },
        {
          label: 'À facturer',
          description: 'Préparer les éléments client',
          href: '/facturation',
          icon: Receipt,
          iconWrapperClassName: 'bg-emerald-500',
        },
        {
          label: 'Rapports',
          description: 'Synthèses publiées du chantier',
          href: '/rapports/semaine-24',
          icon: FileText,
          iconWrapperClassName: 'bg-violet-500',
        },
      ],
    },
    {
      title: 'Clients & chantier',
      items: [
        {
          label: 'Jean Dupont',
          description: 'Relation client et prochaine action',
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
          label: 'Équipe',
          description: 'Responsabilités et disponibilité',
          href: '/equipe',
          icon: Users,
          iconWrapperClassName: 'bg-slate-500',
        },
      ],
    },
  ],
  client: [
    {
      title: 'Votre espace',
      items: [
        {
          label: 'Votre suivi',
          description: 'Avancement de Villa Sparrenlaan',
          href: '/chantier',
          icon: BriefcaseBusiness,
          iconWrapperClassName: 'bg-primary',
        },
        {
          label: 'Demandes à valider',
          description: 'Décisions qui attendent votre avis',
          href: '/validations',
          icon: ClipboardCheck,
          iconWrapperClassName: 'bg-amber-500',
        },
        {
          label: 'Photos validées',
          description: 'Preuves publiées par le chantier',
          href: '/photos',
          icon: ImageIcon,
          iconWrapperClassName: 'bg-orange-500',
        },
        {
          label: 'Contacter Martin',
          description: 'Poser une question sur votre chantier',
          href: 'mailto:martin@clarus.com',
          icon: Mail,
          iconWrapperClassName: 'bg-blue-500',
        },
        {
          label: 'Paramètres',
          description: 'Notifications et préférences',
          icon: Settings,
          iconWrapperClassName: 'bg-gray-500',
        },
      ],
    },
  ],
}

function SettingsGroup({ title, items }: SettingsSection) {
  return (
    <section>
      <h2 className="mb-2 ml-8 mt-6 text-[11px] font-medium uppercase tracking-widest text-muted-foreground/70">
        {title}
      </h2>
      <div className="mx-4 mb-8 overflow-hidden rounded-lg border border-border/50 bg-surface">
        {items.map((item, index) => {
          const Icon = item.icon
          const content = (
            <>
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className={`flex size-8 shrink-0 items-center justify-center rounded-md text-white ${item.iconWrapperClassName}`}
                >
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0">
                  <span className="block truncate text-sm font-medium text-foreground">
                    {item.label}
                  </span>
                  {item.description && (
                    <span className="mt-0.5 block text-[11px] leading-tight text-muted-foreground/80">
                      {item.description}
                    </span>
                  )}
                </div>
              </div>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground/40" />
            </>
          )

          return (
            <div key={item.label}>
              {item.href ? (
                <Link
                  href={item.href}
                  className="flex min-h-14 w-full items-center justify-between gap-3 px-4 py-3 transition-colors active:bg-surface-elevated"
                >
                  {content}
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  className="flex min-h-14 w-full cursor-not-allowed items-center justify-between gap-3 px-4 py-3 opacity-50"
                >
                  {content}
                </button>
              )}
              {index < items.length - 1 && (
                <div className="ml-[3.75rem] border-b border-border/50" />
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default function MenuPage() {
  const { role, setRole, isReady } = useRole()

  if (!isReady) return null

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col pb-32 text-foreground">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border/30 bg-background/85 px-5 pb-4 pt-[max(env(safe-area-inset-top),1.25rem)] backdrop-blur-md">
        <div>
          <h1 className="text-3xl font-semibold leading-tight">
            {role === 'client' ? 'Plus' : 'Menu'}
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">{roleLabels[role]}</p>
        </div>
        <Link
          href="/notifications"
          aria-label="Notifications"
          className="relative flex size-11 items-center justify-center rounded-full transition-colors hover:bg-surface-elevated"
        >
          <Bell className="size-6" />
          <span className="absolute right-2 top-2 size-2.5 rounded-full border-2 border-background bg-primary" />
        </Link>
      </header>

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

      {roleSections[role].map((section) => (
        <SettingsGroup key={section.title} {...section} />
      ))}
    </main>
  )
}
