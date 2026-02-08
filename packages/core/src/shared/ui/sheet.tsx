'use client'

import * as React from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './base/dialog'
import { cn } from './utils'

const Sheet = Dialog
const SheetTrigger = DialogTrigger
const SheetClose = DialogClose
const SheetTitle = DialogTitle
const SheetDescription = DialogDescription
const SheetHeader = DialogHeader
const SheetFooter = DialogFooter

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogContent> {
  side?: 'top' | 'bottom' | 'left' | 'right'
}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogContent>,
  SheetContentProps
>(({ side = 'right', className, children, ...props }, ref) => {
  const sideClasses = {
    top: 'inset-x-0 top-0 border-b data-[closed]:slide-out-to-top data-[open]:slide-in-from-top',
    bottom:
      'inset-x-0 bottom-0 border-t data-[closed]:slide-out-to-bottom data-[open]:slide-in-from-bottom',
    left: 'inset-y-0 left-0 h-full w-3/4 border-r data-[closed]:slide-out-to-left data-[open]:slide-in-from-left sm:max-w-sm',
    right:
      'inset-y-0 right-0 h-full w-3/4 border-l data-[closed]:slide-out-to-right data-[open]:slide-in-from-right sm:max-w-sm',
  }

  return (
    <DialogContent
      ref={ref}
      className={cn(
        'fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[closed]:duration-300 data-[open]:duration-500 data-[open]:animate-in data-[closed]:animate-out',
        'top-0 left-auto right-0 translate-x-0 translate-y-0 rounded-none max-w-none', // Reset dialog centering
        sideClasses[side],
        className
      )}
      {...props}
    >
      {children}
    </DialogContent>
  )
})
SheetContent.displayName = 'SheetContent'

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
