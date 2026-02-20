import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type SectionContainerVariant = 'default' | 'muted' | 'primary' | 'gradient' | 'glass'
type SectionContainerSize = 'sm' | 'md' | 'lg'

type SectionElementProps = Omit<ComponentPropsWithoutRef<'section'>, 'children'>

type SectionContainerProps = SectionElementProps & {
  title?: string
  description?: string
  hideDescriptionOnMobile?: boolean
  action?: ReactNode
  children: ReactNode
  variant?: SectionContainerVariant
  size?: SectionContainerSize
}

const sizeClasses = {
  sm: 'py-12',
  md: 'py-16 md:py-20',
  lg: 'py-20 md:py-28',
} satisfies Record<SectionContainerSize, string>

const variantClasses = {
  default: 'bg-background',
  muted: 'bg-muted/30',
  primary: 'bg-primary text-primary-foreground',
  gradient:
    'bg-gradient-to-br from-primary/5 via-background to-accent/10 dark:from-primary/10 dark:via-background dark:to-accent/10',
  glass: 'bg-background/70 backdrop-blur',
} satisfies Record<SectionContainerVariant, string>

export const SectionContainer = ({
  title,
  description,
  hideDescriptionOnMobile = false,
  action,
  children,
  className,
  variant = 'default',
  size = 'md',
  ...rest
}: SectionContainerProps) => (
  <section {...rest} className={cn(sizeClasses[size], variantClasses[variant], className)}>
    <div className="w-full max-w-[1920px] mx-auto px-4 md:px-8 lg:px-12">
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
