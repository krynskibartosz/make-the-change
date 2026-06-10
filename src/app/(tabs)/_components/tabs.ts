import { CalendarDays, type LucideIcon, MapPinned, Menu, CheckSquare, ClipboardCheck, Receipt, PieChart } from 'lucide-react'

export type ClarusTab = Readonly<{
  href: string
  label: string
  icon: LucideIcon
}>

export const clarusTabs = [
  {
    href: '/planning',
    label: 'Planning',
    icon: CalendarDays,
  },
  {
    href: '/chantier',
    label: 'Chantier',
    icon: MapPinned,
  },
  {
    href: '/menu',
    label: 'Menu',
    icon: Menu,
  },
  {
    href: '/a-verifier',
    label: 'À Vérifier',
    icon: ClipboardCheck,
  },
  {
    href: '/validations',
    label: 'À Valider',
    icon: CheckSquare,
  },
  {
    href: '/ajouter-ticket',
    label: 'Dépenses',
    icon: Receipt,
  },
  {
    href: '/dashboard',
    label: 'Vue Globale',
    icon: PieChart,
  },
] as const satisfies readonly ClarusTab[]
