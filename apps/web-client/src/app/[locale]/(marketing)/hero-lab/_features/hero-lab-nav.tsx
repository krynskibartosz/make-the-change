'use client'

import { Home } from 'lucide-react'
import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import type { HeroLabNavLabels } from './hero-lab.types'

type HeroLabNavProps = {
  labels: HeroLabNavLabels
  className?: string
}

export function HeroLabNav({ labels, className }: HeroLabNavProps) {
  const pathname = usePathname()

  const links = [
    { href: '/hero-lab', label: labels.index },
    { href: '/hero-lab/farmminerals', label: labels.farmMinerals },
    { href: '/hero-lab/awwwards', label: labels.awwwards },
    { href: '/hero-lab/v3', label: labels.v3 },
    { href: '/hero-lab/v1', label: labels.v1 },
  ] as const

  return (
    <nav
      aria-label={labels.title}
      className={cn(
        'rounded-2xl border border-border bg-background/90 p-3 backdrop-blur-md',
        className,
      )}
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="px-2 text-xs font-black uppercase tracking-[0.22em] text-muted-foreground">
          {labels.title}
        </p>

        <ul className="m-0 flex list-none flex-wrap items-center gap-2 p-0">
          {links.map((link) => {
            const isActive = pathname === link.href

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    'inline-flex items-center rounded-xl border px-3 py-2 text-xs font-bold uppercase tracking-wide transition-colors',
                    isActive
                      ? 'border-primary/30 bg-primary/10 text-primary'
                      : 'border-border bg-card text-muted-foreground hover:border-primary/20 hover:text-foreground',
                  )}
                >
                  {link.label}
                </Link>
              </li>
            )
          })}

          <li>
            <Link
              href="/"
              className={cn(
                'inline-flex items-center gap-1 rounded-xl border px-3 py-2 text-xs font-bold uppercase tracking-wide transition-colors',
                pathname === '/'
                  ? 'border-primary/30 bg-primary/10 text-primary'
                  : 'border-border bg-card text-muted-foreground hover:border-primary/20 hover:text-foreground',
              )}
            >
              <Home className="h-3.5 w-3.5" />
              {labels.home}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
