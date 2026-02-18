import { Badge } from '@make-the-change/core/ui'
import type { FC, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type PageHeroProps = {
  badge?: ReactNode
  title: string
  description?: ReactNode
  hideDescriptionOnMobile?: boolean
  children?: ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'gradient' | 'muted'
}

const sizeClasses = {
  sm: 'py-12 md:py-16',
  md: 'py-16 md:py-24',
  lg: 'py-20 md:py-32',
}

const variantClasses = {
  default: 'bg-background',
  gradient: 'bg-gradient-to-br from-primary/5 via-background to-secondary/5',
  muted: 'bg-muted/30',
}

export const PageHero: FC<PageHeroProps> = ({
  badge,
  title,
  description,
  hideDescriptionOnMobile = false,
  children,
  className,
  size = 'md',
  variant = 'default',
}) => {
  return (
    <section
      className={cn(
        'relative flex flex-col items-center justify-center overflow-hidden',
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
    >
      <div className="container relative z-10 mx-auto px-4 flex flex-col items-center text-center">
        {badge && (
          <div className="mb-6 animate-fade-in">
            {badge}
          </div>
        )}

        <h1 className="mb-6 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          {title}
        </h1>

        {description && (
          <p
            className={cn(
              'mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl md:text-2xl font-medium leading-relaxed',
              hideDescriptionOnMobile && 'hidden sm:block',
            )}
          >
            {description}
          </p>
        )}
        {children}
      </div>
    </section>
  )
}
