import {
  Briefcase,
  Calendar,
  CheckSquare,
  ClipboardCheck,
  Home,
  ImageIcon,
  KanbanSquare,
  MapPinned,
  PieChart,
  Send,
  User,
  Package,
  Settings,
  Receipt,
  Users,
  MessageCircle,
  type LucideIcon,
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
    { href: '/profil', label: 'Profil', icon: User },
  ],
  chef: [
    { href: '/planning', label: 'Aujourd\'hui', icon: Calendar },
    { href: '/board', label: 'Kanban', icon: KanbanSquare },
    { href: '/a-verifier', label: 'À vérifier', icon: ClipboardCheck },
    { href: '/chantier', label: 'Chantier', icon: MapPinned },
    { href: '/ressources', label: 'Ressources', icon: Package },
  ],
  admin: [
    { href: '/projets', label: 'Projets', icon: Briefcase },
    { href: '/dashboard', label: 'Dashboard', icon: PieChart },
    { href: '/facturation', label: 'Facturation', icon: Receipt },
    { href: '/equipe', label: 'Équipe', icon: Users },
    { href: '/settings', label: 'Réglages', icon: Settings },
  ],
  client: [
    { href: '/chantier', label: 'Suivi', icon: Home },
    { href: '/validations', label: 'À valider', icon: CheckSquare },
    { href: '/photos', label: 'Photos', icon: ImageIcon },
    { href: '/contact', label: 'Contact', icon: MessageCircle },
  ],
} as const satisfies Record<AppRole, readonly ClarusTab[]>

export function getTabsForRole(role: AppRole): readonly ClarusTab[] {
  return tabsByRole[role]
}
