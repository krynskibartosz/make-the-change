'use client'

import { createToastManager, useToastManager } from '@make-the-change/core/ui'
import type { ReactNode } from 'react'

export type ToastVariant = 'default' | 'destructive' | 'success' | 'warning' | 'info'

export type ToastData = {
  action?: ReactNode
  showIcon?: boolean
}

export type ToastInput = {
  title?: ReactNode
  description?: ReactNode
  action?: ReactNode
  variant?: ToastVariant
  timeout?: number
  priority?: 'low' | 'high'
  showIcon?: boolean
}

export type ManagedToast = ReturnType<typeof useToastManager>['toasts'][number] & {
  data?: ToastData
}

export const toastManager = createToastManager()

const buildData = (input: ToastInput): ToastData | undefined => {
  const data: ToastData = {}
  if (input.action !== undefined) data.action = input.action
  if (input.showIcon !== undefined) data.showIcon = input.showIcon
  return Object.keys(data).length > 0 ? data : undefined
}

function toast(input: ToastInput) {
  const id = toastManager.add({
    title: input.title,
    description: input.description,
    type: input.variant ?? 'default',
    timeout: input.timeout,
    priority: input.priority,
    data: buildData(input),
  })
  let currentData = buildData(input)

  const update = (updates: ToastInput) => {
    const nextData = buildData(updates)
    const data = nextData ? { ...currentData, ...nextData } : undefined
    currentData = data

    toastManager.update(id, {
      ...(updates.title !== undefined ? { title: updates.title } : {}),
      ...(updates.description !== undefined ? { description: updates.description } : {}),
      ...(updates.variant !== undefined ? { type: updates.variant } : {}),
      ...(updates.timeout !== undefined ? { timeout: updates.timeout } : {}),
      ...(updates.priority !== undefined ? { priority: updates.priority } : {}),
      ...(data ? { data } : {}),
    })
  }

  return { id, dismiss: () => toastManager.close(id), update }
}

export function useToast() {
  const { toasts, close } = useToastManager()

  const dismiss = (toastId?: string) => {
    if (toastId) {
      close(toastId)
      return
    }

    for (const toastItem of toasts) {
      close(toastItem.id)
    }
  }

  return {
    toasts: toasts as ManagedToast[],
    toast,
    dismiss,
  }
}

export { toast }
