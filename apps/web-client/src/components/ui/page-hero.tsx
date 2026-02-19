import type { FC, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type PageHeroSize = 'sm' | 'md' | 'lg'
type PageHeroVariant = 'default' | 'gradient' | 'muted'

type PageHeroLayoutProps = {
  children?: ReactNode
  className?: string
  size?: PageHeroSize
  variant?: PageHeroVariant
}

type PageHeroSlotProps = {
  children?: ReactNode
  className?: string
}

type PageHeroDescriptionProps = PageHeroSlotProps & {
  hideOnMobile?: boolean
}

type PageHeroProps = PageHeroLayoutProps & {
  badge?: ReactNode
  title?: ReactNode
  description?: ReactNode
  hideDescriptionOnMobile?: boolean
}

const sizeClasses: Record<PageHeroSize, string> = {
  sm: 'py-12 md:py-16',
  md: 'py-16 md:py-24',
  lg: 'py-20 md:pb-32',
}

const variantClasses: Record<PageHeroVariant, string> = {
  default: 'bg-background',
  gradient: 'bg-gradient-to-br from-primary/5 via-background to-secondary/5',
  muted: 'bg-muted/30',
}

const PageHeroLayout: FC<PageHeroLayoutProps> = ({
  children,
  className,
  size = 'md',
  variant = 'default',
}) => (
  <section
    className={cn(
      'relative flex flex-col items-center justify-center',
      sizeClasses[size],
      variantClasses[variant],
      className,
    )}
  >
    <div className="container relative z-10 mx-auto flex flex-col items-center px-4 text-center">
      {children}
    </div>
  </section>
)

const PageHeroBadge: FC<PageHeroSlotProps> = ({ children, className }) => (
  <div className={cn('mb-6 animate-fade-in', className)}>{children}</div>
)

const PageHeroTitle: FC<PageHeroSlotProps> = ({ children, className }) => (
  <h1
    className={cn(
      'mb-6 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl md:text-6xl lg:text-7xl',
      className,
    )}
  >
    {children}
  </h1>
)

const PageHeroDescription: FC<PageHeroDescriptionProps> = ({
  children,
  className,
  hideOnMobile = false,
}) => (
  <p
    className={cn(
      'mb-8 max-w-2xl text-lg text-muted-foreground font-medium leading-relaxed sm:text-xl md:text-2xl',
      hideOnMobile && 'hidden sm:block',
      className,
    )}
  >
    {children}
  </p>
)

const PageHeroContent: FC<PageHeroSlotProps> = ({ children, className }) => (
  <div className={cn('relative z-10', className)}>{children}</div>
)

const PageHeroActions: FC<PageHeroSlotProps> = ({ children, className }) => (
  <div className={cn('flex flex-col items-center justify-center gap-4 sm:flex-row', className)}>
    {children}
  </div>
)

const PageHeroCTA: FC<PageHeroSlotProps> = ({ children, className }) => (
  <div className={cn('w-full sm:w-auto', className)}>{children}</div>
)

const PageHeroRoot: FC<PageHeroProps> = ({
  badge,
  title,
  description,
  hideDescriptionOnMobile = false,
  children,
  className,
  size = 'md',
  variant = 'default',
}) => {
  const hasLegacySlots = badge !== undefined || title !== undefined || description !== undefined

  if (!hasLegacySlots)
    return (
      <PageHeroLayout className={className} size={size} variant={variant}>
        {children}
      </PageHeroLayout>
    )

  return (
    <PageHeroLayout className={className} size={size} variant={variant}>
      {badge !== undefined ? <PageHeroBadge>{badge}</PageHeroBadge> : null}
      {title !== undefined ? <PageHeroTitle>{title}</PageHeroTitle> : null}
      {description !== undefined ? (
        <PageHeroDescription hideOnMobile={hideDescriptionOnMobile}>
          {description}
        </PageHeroDescription>
      ) : null}
      {children}
    </PageHeroLayout>
  )
}

type PageHeroComponent = FC<PageHeroProps> & {
  Layout: FC<PageHeroLayoutProps>
  Badge: FC<PageHeroSlotProps>
  Title: FC<PageHeroSlotProps>
  Description: FC<PageHeroDescriptionProps>
  Content: FC<PageHeroSlotProps>
  Actions: FC<PageHeroSlotProps>
  CTA: FC<PageHeroSlotProps>
}

export const PageHero = Object.assign(PageHeroRoot, {
  Layout: PageHeroLayout,
  Badge: PageHeroBadge,
  Title: PageHeroTitle,
  Description: PageHeroDescription,
  Content: PageHeroContent,
  Actions: PageHeroActions,
  CTA: PageHeroCTA,
}) as PageHeroComponent
