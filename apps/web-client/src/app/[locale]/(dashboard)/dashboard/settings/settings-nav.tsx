'use client'

import Link from 'next/link'
import { usePathname, useParams } from 'next/navigation'
import { cn } from '@make-the-change/core/shared/utils'

export function SettingsNav() {
  const pathname = usePathname()
  const params = useParams()
  const locale = params.locale as string

  const items = [
    {
      title: 'Général',
      href: `/${locale}/dashboard/settings`,
      isActive: (path: string) => path === `/${locale}/dashboard/settings`
    },
    {
      title: 'Apparence',
      href: `/${locale}/dashboard/settings/appearance`,
      isActive: (path: string) => path === `/${locale}/dashboard/settings/appearance`
    },
    {
      title: 'Notifications',
      href: `/${locale}/dashboard/settings/notifications`,
      isActive: (path: string) => path === `/${locale}/dashboard/settings/notifications`
    },
  ]

  return (
    <nav className="flex items-center gap-6 border-b border-border/40 overflow-x-auto no-scrollbar">
      {items.map((item) => {
        const isActive = item.isActive(pathname)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-sm font-medium transition-all pb-4 border-b-2 whitespace-nowrap px-1",
              isActive
                ? "text-primary border-primary font-bold"
                : "text-muted-foreground border-transparent hover:text-foreground hover:border-border/50"
            )}
          >
            {item.title}
          </Link>
        )
      })}
    </nav>
  )
}
