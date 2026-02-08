'use client'

import { Toast } from '@base-ui/react/toast'
import { ToastWithIcon } from '@/app/[locale]/admin/(dashboard)/components/ui/toast'
import { toastManager, useToast } from '@/hooks/use-toast'

const ToastList = () => {
  const { toasts } = useToast()
  return toasts.map((toast) => <ToastWithIcon key={toast.id} toast={toast} />)
}

import type { FC, PropsWithChildren } from 'react'

export const Toaster: FC<PropsWithChildren> = ({ children }) => (
  <Toast.Provider toastManager={toastManager}>
    {children}
    <Toast.Viewport className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]" />
    <ToastList />
  </Toast.Provider>
)
