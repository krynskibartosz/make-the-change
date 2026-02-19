import type { LucideIcon } from 'lucide-react'
import { MarketingSection } from '@/app/[locale]/(marketing)/_features/marketing-section'
import { cn } from '@/lib/utils'

type HomeStat = {
  value: string | number
  label: string
  icon: LucideIcon
  color: string
  bg: string
  border: string
}

type HomeStatsSectionProps = {
  title: string
  stats: HomeStat[]
  variant?: 'default' | 'muted'
}

const numberFormatter = new Intl.NumberFormat('fr-FR')

const formatStatValue = (value: string | number) => {
  if (typeof value === 'string' && value.includes(' ')) {
    return value
  }

  const numericValue = typeof value === 'number' ? value : Number(value)
  return Number.isNaN(numericValue) ? value : numberFormatter.format(numericValue)
}

export const HomeStatsSection = ({ title, stats, variant = 'default' }: HomeStatsSectionProps) => (
  <MarketingSection
    title={title}
    size="lg"
    variant={variant}
    className="relative mt-24 overflow-hidden py-32 md:mt-0"
  >
    <div
      className="absolute left-1/2 top-1/2 -z-10 h-200 w-200 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-primary/10 blur-[120px] duration-8000"
      aria-hidden="true"
    />

    <dl className="relative z-10 m-0 grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="group relative rounded-[2.5rem] border border-border/70 bg-card/80 p-8 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-border hover:shadow-xl"
        >
          <div
            className={cn(
              'absolute inset-0 rounded-[2.5rem] border opacity-0 transition-opacity duration-500 group-hover:opacity-100',
              stat.border,
            )}
            aria-hidden="true"
          />

          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <div
              className={cn(
                'flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg backdrop-blur-md transition-all duration-500 group-hover:scale-110 group-hover:rotate-12',
                stat.bg,
              )}
              aria-hidden="true"
            >
              <stat.icon className={cn('h-8 w-8 transition-colors duration-500', stat.color)} />
            </div>
          </div>

          <dt className="order-2 mt-2 m-0 text-center text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
            {stat.label}
          </dt>
          <dd className="order-1 mt-6 m-0 text-center text-4xl font-black tracking-tighter text-foreground md:text-5xl">
            {formatStatValue(stat.value)}
          </dd>
        </div>
      ))}
    </dl>
  </MarketingSection>
);
