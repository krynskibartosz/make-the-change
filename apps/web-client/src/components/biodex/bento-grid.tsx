import type { PropsWithChildren } from 'react'

interface BentoGridProps extends PropsWithChildren {
  className?: string
}

export function BentoGrid({ children, className = '' }: BentoGridProps) {
  return (
    <div className={`mx-5 grid grid-cols-2 gap-3 ${className}`}>
      {children}
    </div>
  )
}
