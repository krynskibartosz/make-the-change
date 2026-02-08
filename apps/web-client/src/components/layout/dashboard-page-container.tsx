import { cn } from '@/lib/utils'
import type { PropsWithChildren } from 'react'

interface DashboardPageContainerProps extends PropsWithChildren {
  className?: string
}

export function DashboardPageContainer({ children, className }: DashboardPageContainerProps) {
  return (
    <div className={cn("h-full p-4 md:p-8 pb-24 md:pb-8 max-w-7xl mx-auto", className)}>
      {children}
    </div>
  )
}
