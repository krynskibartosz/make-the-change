import { Card, CardContent, CardHeader, CardTitle } from '@make-the-change/core/ui'
import { ArrowRight, Gift, Heart, TrendingUp, type LucideIcon } from 'lucide-react'
import { MarketingSection } from '@/app/[locale]/(marketing)/_features/marketing-section'
import { cn } from '@/lib/utils'

type FeatureItem = {
  title: string
  description: string
}

type FeatureCardConfig = {
  icon: LucideIcon
  title: string
  description: string
  colorClassName: string
  backgroundClassName: string
  borderClassName: string
  glowClassName: string
}

type HomeFeaturesSectionProps = {
  title: string
  exploreLabel: string
  invest: FeatureItem
  earn: FeatureItem
  redeem: FeatureItem
}

export function HomeFeaturesSection({
  title,
  exploreLabel,
  invest,
  earn,
  redeem,
}: HomeFeaturesSectionProps) {
  const featureItems: FeatureCardConfig[] = [
    {
      icon: Heart,
      title: invest.title,
      description: invest.description,
      colorClassName: 'text-marketing-accent-alt-500',
      backgroundClassName: 'bg-marketing-accent-alt-500/10',
      borderClassName: 'group-hover:border-marketing-accent-alt-500/50',
      glowClassName: 'group-hover:shadow-marketing-accent-alt-500/20',
    },
    {
      icon: TrendingUp,
      title: earn.title,
      description: earn.description,
      colorClassName: 'text-primary',
      backgroundClassName: 'bg-primary/10',
      borderClassName: 'group-hover:border-primary/50',
      glowClassName: 'group-hover:shadow-primary/20',
    },
    {
      icon: Gift,
      title: redeem.title,
      description: redeem.description,
      colorClassName: 'text-marketing-positive-500',
      backgroundClassName: 'bg-marketing-positive-500/10',
      borderClassName: 'group-hover:border-marketing-positive-500/50',
      glowClassName: 'group-hover:shadow-marketing-positive-500/20',
    },
  ]

  return (
    <MarketingSection title={title} size="lg" className="relative overflow-hidden py-32">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background -z-10 opacity-60" aria-hidden="true" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] -z-10 mix-blend-screen animate-pulse duration-[10000ms]" aria-hidden="true" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-marketing-positive-500/10 rounded-full blur-[128px] -z-10 mix-blend-screen" aria-hidden="true" />

      <ul className="relative z-10 m-0 grid list-none gap-8 p-0 md:grid-cols-3">
        {featureItems.map((feature) => (
          <li key={feature.title}>
            <Card
              className={cn(
                'group relative border border-marketing-overlay-light/5 bg-marketing-overlay-light/[0.03] backdrop-blur-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl rounded-[2.5rem] overflow-hidden h-full',
                feature.borderClassName,
                feature.glowClassName,
              )}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-marketing-overlay-light/5 to-transparent pointer-events-none" aria-hidden="true" />

              <CardHeader className="p-10 pb-6 relative">
                <div
                  className={cn(
                    'mb-8 flex h-20 w-20 items-center justify-center rounded-[1.5rem] border border-marketing-overlay-light/10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg backdrop-blur-md',
                    feature.backgroundClassName,
                  )}
                  aria-hidden="true"
                >
                  <feature.icon
                    className={cn('h-10 w-10 transition-colors duration-500', feature.colorClassName)}
                  />
                </div>
                <CardTitle className="text-3xl font-black tracking-tight text-foreground mb-2">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10 pt-4 relative">
                <p className="text-muted-foreground font-medium leading-relaxed text-lg">
                  {feature.description}
                </p>

                <div className="mt-8 flex items-center gap-2 text-sm font-bold uppercase tracking-widest opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-75">
                  <span className={feature.colorClassName}>{exploreLabel}</span>
                  <ArrowRight className={cn('h-4 w-4', feature.colorClassName)} aria-hidden="true" />
                </div>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </MarketingSection>
  )
}
