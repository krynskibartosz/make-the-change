'use client'

import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react'
import { useEffect } from 'react'

import { cn } from '@/lib/utils/cn'
import type { Toast, ToastVariant } from '@/lib/hooks/use-toast'
import { dismissToast, useToastStore } from '@/lib/hooks/use-toast'

const variantConfig: Record<
  ToastVariant,
  { icon: typeof Info; classes: string; iconClass: string }
> = {
  success: {
    icon: CheckCircle,
    classes: 'border-green-500/40 bg-green-500/10 text-green-700 dark:text-green-400',
    iconClass: 'text-green-500',
  },
  error: {
    icon: AlertCircle,
    classes: 'border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-400',
    iconClass: 'text-red-500',
  },
  warning: {
    icon: AlertTriangle,
    classes: 'border-yellow-500/40 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
    iconClass: 'text-yellow-500',
  },
  info: {
    icon: Info,
    classes: 'border-border bg-surface text-foreground',
    iconClass: 'text-primary',
  },
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const variant = toast.variant ?? 'info'
  const { icon: Icon, classes, iconClass } = variantConfig[variant]

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 4000)
    return () => clearTimeout(timer)
  }, [toast.id, onDismiss])

  return (
    <div
      className={cn(
        'pointer-events-auto flex w-full max-w-sm items-start gap-3 overflow-hidden rounded-xl border p-4 shadow-lg backdrop-blur-sm',
        'animate-in slide-in-from-top-2 fade-in duration-300',
        classes,
      )}
      role="alert"
    >
      <Icon className={cn('mt-0.5 size-5 shrink-0', iconClass)} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-tight">{toast.title}</p>
        {toast.description && (
          <p className="mt-1 text-xs opacity-80">{toast.description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 rounded-md p-0.5 opacity-60 transition-opacity hover:opacity-100"
        aria-label="Fermer"
      >
        <X className="size-4" />
      </button>
    </div>
  )
}

export function Toaster() {
  const { toasts, setToasts, addListener, addDismissListener } = useToastStore()

  useEffect(() => {
    const removeAdd = addListener((toast) => {
      setToasts((prev) => [toast, ...prev].slice(0, 5))
    })
    const removeDismiss = addDismissListener((id) => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    })
    return () => {
      removeAdd()
      removeDismiss()
    }
  }, [addListener, addDismissListener, setToasts])

  const handleDismiss = (id: string) => {
    dismissToast(id)
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  if (toasts.length === 0) return null

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed top-[max(env(safe-area-inset-top),1rem)] inset-x-0 z-[100] flex flex-col items-center gap-2 px-4 pointer-events-none"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={handleDismiss} />
      ))}
    </div>
  )
}
