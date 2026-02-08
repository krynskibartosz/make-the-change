'use client'

import type { ToastManagerAddOptions, ToastManagerUpdateOptions } from '@base-ui/react/toast'
import { Toast } from '@base-ui/react/toast'
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

export const toastManager = Toast.createToastManager()

const buildData = (input: ToastInput): ToastData | undefined => {
  const data: ToastData = {}
  if (input.action !== undefined) data.action = input.action
  if (input.showIcon !== undefined) data.showIcon = input.showIcon
  return Object.keys(data).length > 0 ? data : undefined
}

const buildAddOptions = (input: ToastInput): ToastManagerAddOptions<ToastData> => ({
  title: input.title,
  description: input.description,
  type: input.variant ?? 'default',
  timeout: input.timeout,
  priority: input.priority,
  data: buildData(input),
})

const buildUpdateOptions = (input: ToastInput): ToastManagerUpdateOptions<ToastData> => {
  const options: ToastManagerUpdateOptions<ToastData> = {}

  if (input.title !== undefined) options.title = input.title
  if (input.description !== undefined) options.description = input.description
  if (input.variant !== undefined) options.type = input.variant
  if (input.timeout !== undefined) options.timeout = input.timeout
  if (input.priority !== undefined) options.priority = input.priority

  const data = buildData(input)
  if (data) options.data = data

  return options
}

function toast(input: ToastInput) {
  const id = toastManager.add(buildAddOptions(input))
  let currentData = buildData(input)

  const update = (updates: ToastInput) => {
    const updateOptions = buildUpdateOptions(updates)
    if (updateOptions.data) {
      currentData = { ...currentData, ...updateOptions.data }
      updateOptions.data = currentData
    }
    toastManager.update(id, updateOptions)
  }

  return { id, dismiss: () => toastManager.close(id), update }
}

export function useToast() {
  const { toasts, close } = Toast.useToastManager()

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
    toasts,
    toast,
    dismiss,
  }
}

export { toast }
