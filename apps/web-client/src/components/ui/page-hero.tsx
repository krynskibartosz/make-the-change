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
        'relative ',
        sizeClasses[size],

        className,
      )}
    >
      
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
