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
          // Mobile : Bottom Sheet collé en bas, rounded uniquement en haut
          'fixed bottom-0 left-0 right-0 z-50 h-[96dvh] w-full max-w-none translate-x-0 translate-y-0 rounded-t-3xl border-0 border-t border-white/10 p-0 !bg-background/95 shadow-2xl backdrop-blur-md overflow-hidden',
          // Desktop : modale centrée classique
          'sm:inset-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:h-auto sm:max-h-[90vh] sm:w-full sm:max-w-5xl sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[28px] sm:border sm:border-border/60',
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
