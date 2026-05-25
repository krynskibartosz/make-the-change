'use client'

import type { PropsWithChildren } from 'react'
import { FullScreenSlideModal } from '@/app/[locale]/@modal/_components/full-screen-slide-modal'
import { cn } from '@/lib/utils'

type InterceptedRouteDialogProps = PropsWithChildren<{
  title: string
  className?: string
  contentClassName?: string
  fallbackHref?: string
}>

export function InterceptedRouteDialog({
  title,
  className,
  contentClassName,
  fallbackHref = '/community',
  children,
}: InterceptedRouteDialogProps) {
  return (
    <FullScreenSlideModal
      title={title}
      fallbackHref={fallbackHref}
      className={className}
      contentClassName={cn('w-full mx-auto', contentClassName)}
    >
      {children}
    </FullScreenSlideModal>
  )
}
