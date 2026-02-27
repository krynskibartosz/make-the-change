'use client'

import { Dialog, DialogContent, DialogTitle } from '@make-the-change/core/ui'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import type { PropsWithChildren } from 'react'
import { useRouter } from '@/i18n/navigation'
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
  const router = useRouter()

  const handleClose = (open: boolean) => {
    if (open) {
      return
    }

    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
      return
    }

    router.push(fallbackHref)
  }

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent
        className={cn(
          'fixed inset-0 z-50 h-[100dvh] w-full max-w-none translate-x-0 translate-y-0 rounded-none border-0 p-0 !bg-background/80 shadow-2xl backdrop-blur-md overflow-y-auto border-white/20 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:h-auto sm:max-h-[90vh] sm:w-full sm:max-w-5xl sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:border',
          contentClassName,
        )}
      >
        <VisuallyHidden>
          <DialogTitle>{title}</DialogTitle>
        </VisuallyHidden>
        {children}
      </DialogContent>
    </Dialog>
  )
}
