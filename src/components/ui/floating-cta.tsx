import type { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

type FloatingCTAProps = Readonly<{
  children: ReactNode
  className?: string
}>

/**
 * A fixed bottom bar for primary CTAs on detail/creation screens.
 * Handles safe area insets, blur background, and max-width constraint.
 */
export function FloatingCTA({ children, className }: FloatingCTAProps) {
  return (
    <div
      className={cn(
        'sticky bottom-0 w-screen left-1/2 -translate-x-1/2 mt-auto p-4 pb-[max(env(safe-area-inset-bottom),1rem)]',
        'bg-background/90 backdrop-blur-md border-t border-border/50 z-40',
        className,
      )}
    >
      <div className="max-w-md mx-auto flex gap-3">{children}</div>
    </div>
  )
}
