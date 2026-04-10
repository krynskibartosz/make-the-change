'use client'

import type { PropsWithChildren } from 'react'
import { FullScreenSlideModal } from '@/app/[locale]/@modal/_components/full-screen-slide-modal'
import { cn } from '@/lib/utils'

type InterceptedRouteDialogProps = PropsWithChildren<{
  title: string
  contentClassName?: string
  fallbackHref?: string
}>

export function InterceptedRouteDialog({
  title,
  contentClassName,
  fallbackHref = '/community',
  children,
}: InterceptedRouteDialogProps) {
  return (
    <FullScreenSlideModal
      title={title}
      fallbackHref={fallbackHref}
      contentClassName={cn('w-full mx-auto', contentClassName)}
    >
      {children}
    </FullScreenSlideModal>
  )
}
