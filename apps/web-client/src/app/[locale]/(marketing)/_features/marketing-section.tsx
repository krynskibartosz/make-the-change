import type { ReactNode } from 'react'
import { SectionContainer } from '@/components/ui/section-container'
import { cn } from '@/lib/utils'

type MarketingSectionProps = {
  title?: string
  description?: string
  hideDescriptionOnMobile?: boolean
  action?: ReactNode
  children: ReactNode
  variant?: 'default' | 'muted' | 'primary' | 'gradient' | 'glass'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  contentClassName?: string
}

export const MarketingSection = ({
  title,
  description,
  hideDescriptionOnMobile = false,
  action,
  children,
  variant = 'default',
  size = 'md',
  className,
  contentClassName,
}: MarketingSectionProps) => {
  return (
    <SectionContainer
      title={title}
      description={description}
      hideDescriptionOnMobile={hideDescriptionOnMobile}
      action={action}
      variant={variant}
      size={size}
      className={cn('relative', className)}
    >
      <div className={cn('mx-auto w-full', contentClassName)}>{children}</div>
    </SectionContainer>
  )
}
