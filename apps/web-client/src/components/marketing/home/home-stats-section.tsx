import type { LucideIcon } from 'lucide-react'
import { MarketingSection } from '@/components/marketing/marketing-section'
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
}

export function HomeStatsSection({ title, stats }: HomeStatsSectionProps) {
  return (
    <MarketingSection
      title={title}
      size="lg"
      className="py-32 mt-24 md:mt-0 relative overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse duration-[8000ms]" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 relative z-10">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="group relative p-8 rounded-[2.5rem] border border-border/70 bg-card/80 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-border hover:shadow-xl"
          >
            <div
              className={cn(
                'absolute inset-0 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 border',
                stat.border,
              )}
            />

            <div className="flex flex-col items-center justify-center text-center space-y-6">
              <div
                className={cn(
                  'h-16 w-16 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 shadow-lg backdrop-blur-md',
                  stat.bg,
                )}
              >
                <stat.icon className={cn('h-8 w-8 transition-colors duration-500', stat.color)} />
              </div>

              <div className="space-y-2">
                <p className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">
                  {stat.value}
                </p>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                  {stat.label}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </MarketingSection>
  )
}
