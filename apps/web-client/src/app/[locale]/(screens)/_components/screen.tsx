import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type ScreenProps = {
  children: ReactNode
  header?: ReactNode
  className?: string
  contentClassName?: string
}

export function Screen({ header, children, className, contentClassName }: ScreenProps) {
  return (
    <div className={cn('fixed inset-0 z-40 bg-[#0B0F15]', className)}>
      {header && (
        <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/5 bg-background/80 px-4 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-lg">
          <div className="mx-auto flex h-12 max-w-3xl items-center">
            {header}
          </div>
        </header>
      )}
      <div
        className={cn(
          'h-[100dvh] w-full overflow-y-auto overflow-x-hidden overscroll-y-contain',
          header ? 'pt-[calc(3.5rem+max(0.75rem,env(safe-area-inset-top)))]' : 'pt-0',
          'pb-[max(1.5rem,env(safe-area-inset-bottom))]', // Pas de marge pour la Bottom Nav ici !
          contentClassName,
        )}
      >
        {children}
      </div>
    </div>
  )
}