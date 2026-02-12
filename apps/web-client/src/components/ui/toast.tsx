'use client'

import {
  Toast,
  ToastClose,
  ToastContent,
  ToastDescription,
  ToastTitle,
} from '@make-the-change/core/ui'
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react'
import type { ComponentType } from 'react'
import type { ManagedToast, ToastData, ToastVariant } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

const toastIcons: Record<ToastVariant, ComponentType<{ className?: string }>> = {
  default: Info,
  success: CheckCircle,
  destructive: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const variantClasses: Record<ToastVariant, string> = {
  default: 'border-border bg-background text-foreground',
  destructive: 'border-destructive/40 bg-destructive/10 text-destructive',
  success: 'border-success/40 bg-success/10 text-success',
  warning: 'border-warning/40 bg-warning/10 text-warning-foreground',
  info: 'border-primary/40 bg-primary/10 text-primary',
}

export type ToastWithIconProps = {
  toast: ManagedToast
}

export function ToastWithIcon({ toast }: ToastWithIconProps) {
  const variant = (toast.type as ToastVariant | undefined) ?? 'default'
  const Icon = toastIcons[variant] ?? Info
  const data = (toast.data ?? {}) as ToastData
  const showIcon = data.showIcon ?? true

  return (
    <Toast
      toast={toast}
      className={cn(
        'pointer-events-auto relative flex w-full items-start justify-between gap-4 overflow-hidden rounded-xl border p-4 shadow-lg',
        variantClasses[variant],
      )}
    >
      <ToastContent className="grid gap-1">
        <div className="flex items-center gap-2">
          {showIcon && <Icon className="h-4 w-4" />}
          {toast.title && <ToastTitle className="text-sm font-semibold">{toast.title}</ToastTitle>}
        </div>
        {toast.description && (
          <ToastDescription className="text-sm opacity-90">{toast.description}</ToastDescription>
        )}
      </ToastContent>

      {data.action}

      <ToastClose
        className="absolute right-2 top-2 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100"
        aria-label="Fermer"
      >
        <X className="h-4 w-4" />
      </ToastClose>
    </Toast>
  )
}
