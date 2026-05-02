import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function BottomActionBar({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn('border-t border-white/5 bg-background/80 px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-lg', className)}
    >
      {children}
    </div>
  )
}