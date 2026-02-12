'use client'

import { Toast as ToastPrimitive } from '@base-ui/react/toast'
import type { ComponentPropsWithoutRef, ElementRef } from 'react'
import { forwardRef } from 'react'
import { cn } from '../utils'

const ToastProvider = ToastPrimitive.Provider

const ToastViewport = forwardRef<
  ElementRef<typeof ToastPrimitive.Viewport>,
  ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn(
      'fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]',
      className,
    )}
    {...props}
  />
))
ToastViewport.displayName = 'ToastViewport'

const Toast = ToastPrimitive.Root
const ToastContent = ToastPrimitive.Content
const ToastTitle = ToastPrimitive.Title
const ToastDescription = ToastPrimitive.Description
const ToastAction = ToastPrimitive.Action
const ToastClose = ToastPrimitive.Close
const ToastPortal: typeof ToastPrimitive.Portal = ToastPrimitive.Portal
const ToastPositioner: typeof ToastPrimitive.Positioner = ToastPrimitive.Positioner
const ToastArrow = ToastPrimitive.Arrow

const createToastManager: typeof ToastPrimitive.createToastManager =
  ToastPrimitive.createToastManager
const useToastManager: typeof ToastPrimitive.useToastManager = ToastPrimitive.useToastManager

export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastContent,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose,
  ToastPortal,
  ToastPositioner,
  ToastArrow,
  createToastManager,
  useToastManager,
}
