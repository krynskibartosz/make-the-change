'use client'

import { cn } from '@make-the-change/core/shared/utils'
import {
  Handshake,
  LayoutDashboard,
  type LucideIcon,
  Package,
  ShoppingCart,
  Sprout,
} from 'lucide-react'
import type { FC } from 'react'
import { LocalizedLink } from '@/components/localized-link'
import { usePathname } from '@/i18n/navigation'

type PartnerNavItem = {
  id: 'dashboard' | 'orders' | 'products' | 'projects'
  href: string
  icon: LucideIcon
  label: string
}

const navItems: PartnerNavItem[] = [
  { id: 'dashboard', href: '/partner/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'orders', href: '/partner/orders', icon: ShoppingCart, label: 'Commandes' },
  { id: 'products', href: '/partner/products', icon: Package, label: 'Produits' },
  { id: 'projects', href: '/partner/projects', icon: Sprout, label: 'Projets' },
]

export const PartnerBottomNav: FC = () => {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Navigation principale partenaire"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/60 bg-background/95 backdrop-blur md:hidden"
    >
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          const Icon = item.icon

          return (
            <LocalizedLink
              key={item.id}
              href={item.href}
              className={cn(
                'group flex min-w-[56px] flex-col items-center gap-1 rounded-2xl px-2 py-1 text-[10px] font-medium',
                'transition-colors motion-reduce:transition-none',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <div
                className={cn(
                  'relative flex h-9 w-9 items-center justify-center rounded-full',
                  isActive ? 'bg-primary/10' : 'group-hover:bg-muted/40',
                )}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <span className="leading-none">{item.label}</span>
            </LocalizedLink>
          )
        })}
      </div>
    </nav>
  )
}
