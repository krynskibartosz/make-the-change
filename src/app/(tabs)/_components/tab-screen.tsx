import type { ReactNode } from 'react'

import { cn } from '@/lib/utils/cn'

type TabScreenProps = Readonly<{
  action?: ReactNode
  children: ReactNode
  className?: string
  contentClassName?: string
  eyebrow?: string
  subtitle?: ReactNode
  title: string
}>

export function TabScreen({
  action,
  children,
  className,
  contentClassName,
  eyebrow = 'Sparrenlaan',
  subtitle,
  title,
}: TabScreenProps) {
  return (
    <main
      className={cn(
        'mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-32 pt-[max(env(safe-area-inset-top),1.25rem)] text-foreground',
        className,
      )}
    >
      <header className="flex items-start justify-between gap-4 pb-5">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{eyebrow}</p>
          <h1 className="mt-1 text-3xl font-semibold leading-tight">{title}</h1>
          {subtitle ? (
            <div className="mt-2 text-sm leading-6 text-muted-foreground">{subtitle}</div>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </header>

      <div className={cn('flex flex-1 flex-col gap-4', contentClassName)}>{children}</div>
    </main>
  )
}
