import type { ReactNode } from 'react'
import { MarketingHeroShell } from '@/app/[locale]/(marketing)/_features/marketing-hero-shell'
import { cn } from '@/lib/utils'

type MarketingHeroProps = {
  title: ReactNode
  description?: ReactNode
  badge?: ReactNode
  background?: ReactNode
  visual?: ReactNode
  className?: string
  minHeightClassName?: string
  containerClassName?: string
  contentClassName?: string
  titleClassName?: string
  descriptionClassName?: string
}

export const MarketingHero = ({
  title,
  description,
  badge,
  background,
  visual,
  className,
  minHeightClassName = 'min-h-[70vh]',
  containerClassName,
  contentClassName = 'mx-auto max-w-4xl',
  titleClassName,
  descriptionClassName,
}: MarketingHeroProps) => {
  return (
    <MarketingHeroShell
      background={background}
      className={className}
      minHeightClassName={minHeightClassName}
      containerClassName={cn('text-center', containerClassName)}
    >
      <header className={contentClassName}>
        {badge}
        <h1
          className={cn(
            'mx-auto max-w-4xl text-5xl font-black tracking-tighter sm:text-7xl lg:text-8xl mb-8 text-foreground',
            titleClassName,
          )}
        >
          {title}
        </h1>

        {description ? (
          <p
            className={cn(
              'mx-auto max-w-2xl text-xl text-muted-foreground leading-relaxed font-medium',
              descriptionClassName,
            )}
          >
            {description}
          </p>
        ) : null}

        {visual}
      </header>
    </MarketingHeroShell>
  )
}
