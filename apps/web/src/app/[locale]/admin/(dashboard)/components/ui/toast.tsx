'use client'

import type { ToastRootToastObject } from '@base-ui/react/toast'
import { Toast } from '@base-ui/react/toast'
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react'
import type { ComponentType } from 'react'

import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn'
import type { ToastData } from '@/hooks/use-toast'

type ToastVariant = 'default' | 'destructive' | 'success' | 'warning' | 'info'

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
  toast: ToastRootToastObject<ToastData>
}

export const ToastWithIcon = ({ toast }: ToastWithIconProps) => {
  const variant = (toast.type as ToastVariant | undefined) ?? 'default'
  const Icon = toastIcons[variant] ?? Info
  const showIcon = toast.data?.showIcon ?? true

  return (
    <Toast.Root
      toast={toast}
      className={cn(
        'pointer-events-auto relative flex w-full items-start justify-between gap-4 overflow-hidden rounded-xl border p-4 shadow-lg',
        variantClasses[variant],
      )}
    >
      <Toast.Content className="grid gap-1">
        <div className="flex items-center gap-2">
          {showIcon && <Icon className="h-4 w-4" />}
          {toast.title && (
            <Toast.Title className="text-sm font-semibold">{toast.title}</Toast.Title>
          )}
        </div>
        {toast.description && (
          <Toast.Description className="text-sm opacity-90">{toast.description}</Toast.Description>
        )}
      </Toast.Content>

      {toast.data?.action}

      <Toast.Close
        className="absolute right-2 top-2 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100"
        aria-label="Fermer"
      >
        <X className="h-4 w-4" />
      </Toast.Close>
    </Toast.Root>
  )
}
