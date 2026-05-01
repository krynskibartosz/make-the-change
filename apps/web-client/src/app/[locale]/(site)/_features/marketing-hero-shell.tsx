import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type MarketingHeroShellProps = {
  background?: ReactNode
  children: ReactNode
  className?: string
  containerClassName?: string
  minHeightClassName?: string
  paddingClassName?: string
}

export const MarketingHeroShell = ({
  background,
  children,
  className,
  containerClassName,
  minHeightClassName = 'min-h-[70vh]',
  paddingClassName = 'pt-32 pb-20 lg:pt-48 lg:pb-32',
}: MarketingHeroShellProps) => {
  return (
    <section
      className={cn(
        'relative overflow-hidden flex items-center justify-center',
        paddingClassName,
        minHeightClassName,
        className,
      )}
    >
      {background ? <div className="absolute inset-0 z-0">{background}</div> : null}

      <div className={cn('container relative z-10 mx-auto px-4', containerClassName)}>
        {children}
      </div>
    </section>
  )
}
