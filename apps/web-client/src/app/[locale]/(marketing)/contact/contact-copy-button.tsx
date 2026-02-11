'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { Button } from '@make-the-change/core/ui'
import { cn } from '@/lib/utils'

export function ContactCopyButton({ email = "contact@make-the-change.com", className }: { email?: string, className?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn("rounded-full h-12 w-12 bg-white/10 border-white/20 hover:bg-white/20 text-white backdrop-blur-sm transition-all duration-300", className)}
      onClick={handleCopy}
    >
      <span className="sr-only">Copier l'email</span>
      {copied ? (
        <Check className="h-5 w-5 animate-in zoom-in duration-300" />
      ) : (
        <Copy className="h-5 w-5" />
      )}
    </Button>
  )
}
