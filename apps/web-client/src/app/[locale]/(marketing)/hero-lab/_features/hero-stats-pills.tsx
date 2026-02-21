import type { HomeHeroStat } from '@/app/[locale]/(marketing)/(home)/_features/home.view-model'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

type HeroStatsPillsProps = {
  heroStats: HomeHeroStat[]
  className?: string
}

export function HeroStatsPills({ heroStats, className }: HeroStatsPillsProps) {
  if (heroStats.length === 0) {
    return null
  }

  return (
    <ul className={cn('m-0 flex list-none flex-wrap justify-center gap-3 p-0', className)}>
      {heroStats.map((heroStat) => (
        <li key={heroStat.key}>
          <Link href={heroStat.href}>
            <span className="flex items-center gap-2 rounded-2xl border border-marketing-overlay-light/10 bg-background/55 px-4 py-2 shadow-sm backdrop-blur-md">
              <heroStat.icon className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-tight">
                {heroStat.value} {heroStat.label}
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
