import {
  Briefcase,
  CheckSquare,
  ClipboardCheck,
  Home,
  ImageIcon,
  type LucideIcon,
  MapPinned,
  Menu,
  PieChart,
  Send,
} from 'lucide-react'
import type { AppRole } from '@/lib/role-context'

export type ClarusTab = Readonly<{
  href: string
  label: string
  icon: LucideIcon
}>

const tabsByRole = {
  ouvrier: [
    { href: '/chantier', label: 'Accueil', icon: Home },
    { href: '/historique', label: 'Envoyés', icon: Send },
    { href: '/menu', label: 'Menu', icon: Menu },
  ],
  chef: [
    { href: '/chantier', label: 'Chantier', icon: MapPinned },
    { href: '/a-verifier', label: 'À vérifier', icon: ClipboardCheck },
    { href: '/menu', label: 'Menu', icon: Menu },
  ],
  admin: [
    { href: '/projets', label: 'Projets', icon: Briefcase },
    { href: '/dashboard', label: 'Pilotage', icon: PieChart },
    { href: '/menu', label: 'Menu', icon: Menu },
  ],
  client: [
    { href: '/chantier', label: 'Suivi', icon: Home },
    { href: '/validations', label: 'À valider', icon: CheckSquare },
    { href: '/photos', label: 'Photos', icon: ImageIcon },
    { href: '/menu', label: 'Plus', icon: Menu },
  ],
} as const satisfies Record<AppRole, readonly ClarusTab[]>

export function getTabsForRole(role: AppRole): readonly ClarusTab[] {
  return tabsByRole[role]
}
