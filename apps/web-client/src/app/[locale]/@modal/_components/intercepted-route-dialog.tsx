'use client'

import { Dialog, DialogContent, DialogTitle } from '@make-the-change/core/ui'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { useRouter } from 'next/navigation'
import type { PropsWithChildren } from 'react'
import { cn } from '@/lib/utils'

type InterceptedRouteDialogProps = PropsWithChildren<{
  title: string
  contentClassName?: string
}>

export function InterceptedRouteDialog({
  title,
  contentClassName,
  children,
}: InterceptedRouteDialogProps) {
  const router = useRouter()

  return (
    <Dialog open={true} onOpenChange={(open) => !open && router.back()}>
      <DialogContent
        className={cn(
          'w-[min(100vw-1.5rem,72rem)] max-h-[90vh] overflow-y-auto p-0 border-white/20 !bg-background/80 backdrop-blur-md shadow-2xl',
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
