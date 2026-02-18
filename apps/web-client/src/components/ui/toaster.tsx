'use client'

import { ToastProvider, ToastViewport } from '@make-the-change/core/ui'
import type { FC, PropsWithChildren } from 'react'
import { ToastWithIcon } from '@/components/ui/toast'
import { toastManager, useToast } from '@/components/ui/use-toast'

function ToastList() {
  const { toasts } = useToast()
  return toasts.map((toast) => <ToastWithIcon key={toast.id} toast={toast} />)
}

export const Toaster: FC<PropsWithChildren> = ({ children }) => (
  <ToastProvider toastManager={toastManager}>
    {children}
    <ToastViewport />
    <ToastList />
  </ToastProvider>
)
