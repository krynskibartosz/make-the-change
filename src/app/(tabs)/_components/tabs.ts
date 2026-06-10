import { CalendarDays, type LucideIcon, MapPinned, Menu } from 'lucide-react'

export type ClarusTab = Readonly<{
  href: string
  label: string
  icon: LucideIcon
}>

export const clarusTabs = [
  {
    href: '/aujourd-hui',
    label: "Aujourd'hui",
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
] as const satisfies readonly ClarusTab[]
