import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type SectionContainerProps = {
  title?: string
  description?: string
  hideDescriptionOnMobile?: boolean
  action?: ReactNode
  children: ReactNode
  className?: string
  variant?: 'default' | 'muted' | 'primary' | 'gradient' | 'glass'
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'py-12',
  md: 'py-16 md:py-20',
  lg: 'py-20 md:py-28',
}

const variantClasses = {
  default: 'bg-background',
  muted: 'bg-muted/30',
  primary: 'bg-primary text-primary-foreground',
  gradient:
    'bg-gradient-to-br from-primary/5 via-background to-accent/10 dark:from-primary/10 dark:via-background dark:to-accent/10',
  glass: 'bg-background/70 backdrop-blur',
}

export const SectionContainer = ({
  title,
  description,
  hideDescriptionOnMobile = false,
  action,
  children,
  className,
  variant = 'default',
  size = 'md',
}: SectionContainerProps) => {
  return (
    <section className={cn(sizeClasses[size], variantClasses[variant], className)}>
      <div className="container mx-auto px-4">
        {(title || action) && (
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {title && <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>}
              {description && (
                <p
                  className={cn(
                    'mt-2 text-lg',
                    variant === 'primary' ? 'opacity-90' : 'text-muted-foreground',
                    hideDescriptionOnMobile && 'hidden sm:block',
                  )}
                >
                  {description}
                </p>
              )}
            </div>
            {action}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}
