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
  gradient:
    'bg-gradient-to-br from-primary/5 via-background to-accent/10 dark:from-primary/10 dark:via-background dark:to-accent/10',
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
  variant = 'gradient',
}) => {
  return (
    <section
      className={cn(
        'relative overflow-hidden',
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
    >
      {/* Animated Background Blobs */}
      {variant === 'gradient' && (
        <>
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl motion-safe:animate-pulse" />
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-accent/10 blur-3xl motion-safe:animate-pulse" />
          <div className="absolute left-1/2 top-8 h-40 w-40 -translate-x-1/2 rounded-full bg-accent/10 blur-2xl motion-safe:animate-pulse" />
        </>
      )}

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          {badge && (
            <Badge variant="secondary" className="mb-4">
              {badge}
            </Badge>
          )}
          <h1 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            {title}
          </h1>
          {description && (
            <p
              className={cn(
                'mb-8 text-base text-muted-foreground sm:text-lg md:text-xl',
                hideDescriptionOnMobile && 'hidden sm:block',
              )}
            >
              {description}
            </p>
          )}
          {children}
        </div>
      </div>
    </section>
  )
}
