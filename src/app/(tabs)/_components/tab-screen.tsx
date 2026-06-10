'use client'

import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

import { mockClarusRepository } from '@/lib/repositories'
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
  eyebrow,
  subtitle,
  title,
}: TabScreenProps) {
  const [projectName, setProjectName] = useState<string>('Chargement...')

  useEffect(() => {
    mockClarusRepository.getProject().then((project) => {
      setProjectName(project.name)
    })
  }, [])

  const displayEyebrow = eyebrow ?? projectName

  return (
    <main
      className={cn(
        'mx-auto flex min-h-dvh w-full max-w-md flex-col pb-40 text-foreground',
        className,
      )}
    >
      <header
        className="flex items-start justify-between gap-4 pb-4 px-5 pt-[max(env(safe-area-inset-top),1.25rem)] mb-5"
      >
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{displayEyebrow}</p>
          <h1 className="mt-1 text-3xl font-semibold leading-tight">{title}</h1>
          {subtitle ? (
            <div className="mt-2 text-sm leading-6 text-muted-foreground">{subtitle}</div>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </header>

      <div className={cn('flex flex-1 flex-col gap-4 px-5', contentClassName)}>{children}</div>
    </main>
  )
}
