'use client'

import { Dialog } from '@base-ui/react/dialog'
import { clsx, type ClassValue } from 'clsx'
import { X } from 'lucide-react'
import type { ComponentPropsWithoutRef, ElementRef, FC, HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const baseOverlay =
  'fixed inset-0 z-50 bg-black/20 backdrop-blur-sm transition-all duration-300 ' +
  'dark:bg-black/60 data-[open]:animate-in data-[closed]:animate-out ' +
  'data-[closed]:fade-out-0 data-[open]:fade-in-0'

const baseContent =
  'overlay-dialog fixed left-[50%] top-[50%] z-50 grid w-full ' +
  'translate-x-[-50%] translate-y-[-50%] gap-4 p-6 duration-200 ' +
  'bg-background dark:bg-card/95 dark:shadow-2xl data-[open]:animate-in data-[closed]:animate-out ' +
  'data-[closed]:fade-out-0 data-[open]:fade-in-0 data-[closed]:zoom-out-95 ' +
  'data-[open]:zoom-in-95 data-[closed]:slide-out-to-left-1/2 ' +
  'data-[closed]:slide-out-to-top-[48%] data-[open]:slide-in-from-left-1/2 ' +
  'data-[open]:slide-in-from-top-[48%] data-[focus-visible]:outline-none'

const DialogRoot = Dialog.Root
const DialogTrigger = Dialog.Trigger
const DialogPortal = Dialog.Portal
const DialogClose = Dialog.Close

const DialogOverlay = forwardRef<
  ElementRef<typeof Dialog.Backdrop>,
  ComponentPropsWithoutRef<typeof Dialog.Backdrop>
>(({ className, ...props }, ref) => (
  <Dialog.Backdrop
    ref={ref}
    className={cn(baseOverlay, className)}
    {...props}
  />
))
DialogOverlay.displayName = 'DialogOverlay'

const DialogContent = forwardRef<
  ElementRef<typeof Dialog.Popup>,
  ComponentPropsWithoutRef<typeof Dialog.Popup> & {
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
    showCloseButton?: boolean
    closeLabel?: string
  }
>(
  (
    { className, children, size = 'md', showCloseButton = true, closeLabel = 'Fermer', ...props },
    ref,
  ) => {
    const sizeClasses = {
      sm: 'max-w-[425px]',
      md: 'max-w-[640px]',
      lg: 'max-w-[768px]',
      xl: 'max-w-[1024px]',
      full: 'max-w-[95vw] max-h-[95vh]',
    }

    return (
      <DialogPortal>
        <DialogOverlay />
        <Dialog.Viewport className="fixed inset-0 z-50">
          <Dialog.Popup
            ref={ref}
            className={cn(baseContent, sizeClasses[size], className)}
            {...props}
          >
            {children}
            {showCloseButton && (
              <DialogClose className="absolute right-4 top-4 rounded-lg p-1 opacity-70 transition-all hover:opacity-100 hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:ring-offset-background disabled:pointer-events-none">
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                <span className="sr-only">{closeLabel}</span>
              </DialogClose>
            )}
          </Dialog.Popup>
        </Dialog.Viewport>
      </DialogPortal>
    )
  },
)
DialogContent.displayName = 'DialogContent'

const DialogHeader: FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div
    className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)}
    {...props}
  />
)
DialogHeader.displayName = 'DialogHeader'

const DialogFooter: FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div
    className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
    {...props}
  />
)
DialogFooter.displayName = 'DialogFooter'

const DialogTitle = forwardRef<
  ElementRef<typeof Dialog.Title>,
  ComponentPropsWithoutRef<typeof Dialog.Title>
>(({ className, ...props }, ref) => (
  <Dialog.Title
    ref={ref}
    className={cn('text-lg font-semibold leading-none tracking-tight text-foreground', className)}
    {...props}
  />
))
DialogTitle.displayName = 'DialogTitle'

const DialogDescription = forwardRef<
  ElementRef<typeof Dialog.Description>,
  ComponentPropsWithoutRef<typeof Dialog.Description>
>(({ className, ...props }, ref) => (
  <Dialog.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
DialogDescription.displayName = 'DialogDescription'

export {
  DialogRoot as Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
