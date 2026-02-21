'use client'

import {
  Toast,
  ToastClose,
  ToastContent,
  ToastDescription,
  ToastTitle,
} from '@make-the-change/core/ui'
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react'
import { type ComponentType, isValidElement, type ReactNode } from 'react'
import type { ManagedToast, ToastData, ToastVariant } from '@/components/ui/use-toast'
import { isRecord } from '@/lib/type-guards'
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

const isToastVariant = (value: unknown): value is ToastVariant =>
  typeof value === 'string' && Object.hasOwn(toastIcons, value)

const isRenderableNode = (value: unknown): value is ReactNode => {
  if (value === null) return true

  switch (typeof value) {
    case 'string':
    case 'number':
    case 'boolean':
      return true
    case 'undefined':
      return false
    default:
      break
  }

  if (isValidElement(value)) {
    return true
  }

  if (Array.isArray(value)) {
    return value.every((entry) => isRenderableNode(entry))
  }

  return false
}

const toToastData = (value: unknown): ToastData => {
  if (!isRecord(value)) {
    return {}
  }

  const data: ToastData = {}

  if (typeof value.showIcon === 'boolean') {
    data.showIcon = value.showIcon
  }

  if (isRenderableNode(value.action)) {
    data.action = value.action
  }

  return data
}

export function ToastWithIcon({ toast }: ToastWithIconProps) {
  const variant = isToastVariant(toast.type) ? toast.type : 'default'
  const Icon = toastIcons[variant] ?? Info
  const data = toToastData(toast.data)
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
