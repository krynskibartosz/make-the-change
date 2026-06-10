import Link from 'next/link'
import { Hammer, Camera, Package, Euro, AlertTriangle, CheckSquare } from 'lucide-react'
import { Screen } from '../_components/screen'

const ADD_ACTIONS = [
  {
    href: '/interventions/new',
    title: 'Travail réalisé',
    description: 'Encoder des heures, avancement, rapport',
    icon: Hammer,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20'
  },
  {
    href: '/photos/ajouter',
    title: 'Photo',
    description: 'Preuve, état des lieux, avancement',
    icon: Camera,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20'
  },
  {
    href: '/ajouter-materiau',
    title: 'Matériau utilisé',
    description: 'Déclarer du matériel sorti du stock',
    icon: Package,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20'
  },
  {
    href: '/ajouter-depense',
    title: 'Achat / Dépense',
    description: 'Ticket, achat direct sur le terrain',
    icon: Euro,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20'
  },
  {
    href: '/ajouter-tache?priority=urgent',
    title: 'Problème / Blocage',
    description: 'Signaler un point bloquant urgent',
    icon: AlertTriangle,
    color: 'text-red-500',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20'
  },
  {
    href: '/ajouter-tache',
    title: 'Tâche à faire',
    description: 'Créer une tâche pour plus tard',
    icon: CheckSquare,
    color: 'text-foreground',
    bg: 'bg-surface',
    border: 'border-border'
  }
]

export default function AjouterMenuPage() {
  return (
    <Screen 
      title="Que veux-tu ajouter ?" 
      backHref="/planning"
      eyebrow="Nouveau"
    >
      <div className="grid gap-3 mt-4">
        {ADD_ACTIONS.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={`flex items-center gap-4 p-4 rounded-2xl border ${action.border} ${action.bg} transition-transform active:scale-[0.98] group`}
          >
            <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl bg-background shadow-sm ${action.color}`}>
              <action.icon className="size-6" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-base font-bold text-foreground truncate">{action.title}</span>
              <span className="text-sm text-muted-foreground truncate mt-0.5">{action.description}</span>
            </div>
          </Link>
        ))}
      </div>
    </Screen>
  )
}
