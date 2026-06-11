'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!mounted) return null

  return createPortal(
    <div
      className={cn(
        'fixed inset-0 z-50 flex flex-col justify-end transition-opacity duration-300',
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      )}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div 
        className={cn(
          'relative w-full max-w-md mx-auto bg-surface border-t border-border shadow-2xl rounded-t-3xl flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]',
          isOpen ? 'translate-y-0' : 'translate-y-full'
        )}
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {/* Drag handle */}
        <div className="w-full flex justify-center py-3 cursor-pointer" onClick={onClose}>
          <div className="w-12 h-1.5 bg-muted rounded-full opacity-50" />
        </div>

        {/* Header */}
        {(title) && (
          <div className="px-5 pb-3 flex items-center justify-between border-b border-border/50">
            <h3 className="font-bold text-lg">{title}</h3>
            <button 
              onClick={onClose}
              className="p-2 -mr-2 text-muted-foreground hover:text-foreground hover:bg-surface-elevated rounded-full transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-5 overflow-y-auto max-h-[70vh]">
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}
