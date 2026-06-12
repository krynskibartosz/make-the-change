import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils/cn'

type ScreenProps = Readonly<{
  action?: ReactNode
  backHref?: string
  backLabel?: string
  children: ReactNode
  className?: string
  contentClassName?: string
  eyebrow?: string
  subtitle?: ReactNode
  title: string
}>

export function Screen({
  action,
  backHref,
  backLabel = 'Retour',
  children,
  className,
  contentClassName,
  eyebrow = 'Sparrenlaan',
  subtitle,
  title,
}: ScreenProps) {
  return (
    <main
      className={cn(
        'mx-auto min-h-dvh w-full max-w-md px-4 pb-8 pt-[max(env(safe-area-inset-top),1.25rem)] text-foreground',
        className,
      )}
    >
      <header className="pb-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          {backHref ? (
            <Link
              aria-label={backLabel}
              className="inline-flex min-h-[var(--size-secondary-button)] items-center gap-2 rounded-[var(--radius-control)] text-sm font-semibold text-foreground"
              href={backHref}
            >
              <ChevronLeft aria-hidden="true" className="size-5" />
              <span>{backLabel}</span>
            </Link>
          ) : (
            <span />
          )}
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
        <p className="text-sm font-medium text-muted-foreground">{eyebrow}</p>
        <h1 className="mt-1 text-3xl font-semibold leading-tight">{title}</h1>
        {subtitle ? (
          <div className="mt-2 text-sm leading-6 text-muted-foreground">{subtitle}</div>
        ) : null}
      </header>

      <div className={cn('flex flex-col gap-4', contentClassName)}>{children}</div>
    </main>
  )
}
