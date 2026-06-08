import { BarChart3, CalendarDays, ClipboardList, type LucideIcon, MapPinned } from 'lucide-react'

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
    href: '/journal',
    label: 'Journal',
    icon: ClipboardList,
  },
  {
    href: '/chantier',
    label: 'Chantier',
    icon: MapPinned,
  },
  {
    href: '/couts',
    label: 'Couts',
    icon: BarChart3,
  },
] as const satisfies readonly ClarusTab[]
