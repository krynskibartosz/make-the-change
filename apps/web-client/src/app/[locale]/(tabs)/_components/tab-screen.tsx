import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type TabScreenProps = {
  children: ReactNode
  header?: ReactNode
  className?: string
  contentClassName?: string
}

export function TabScreen({ header, children, className, contentClassName }: TabScreenProps) {
  return (
    <div className={cn('fixed inset-0 z-40 bg-[#0B0F15]', className)}>
      {header && (
        <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/5 bg-background/80 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 backdrop-blur-lg">
          <div className="mx-auto flex h-16 max-w-3xl items-center">
            {header}
          </div>
        </header>
      )}
      <div
        className={cn(
          'h-[100dvh] w-full overflow-y-auto overflow-x-hidden overscroll-y-contain',
          header ? 'pt-[calc(4rem+max(0.75rem,env(safe-area-inset-top))+0.75rem)]' : 'pt-0',
          'pb-[calc(env(safe-area-inset-bottom)+5rem)]',
          contentClassName,
        )}
      >
        {children}
      </div>
    </div>
  )
}
